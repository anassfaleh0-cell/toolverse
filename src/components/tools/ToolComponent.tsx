"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Input, Button, Alert, Card, Textarea } from "@/components/ui";
import { CopyButton } from "@/components/shared";
import { getToolBySlug } from "@/lib/registry";
import { getToolConfig, type ToolConfig, type ToolField } from "@/lib/tools-config";
import { Icon } from "@/components/shared/icon";

interface ToolComponentProps {
  slug: string;
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: ToolField;
  value: string;
  onChange: (name: string, value: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  if (field.type === "file") {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 20 * 1024 * 1024) { onChange(field.name, "__error__:File exceeds 20MB limit"); return; }
      const reader = new FileReader();
      reader.onload = () => onChange(field.name, reader.result as string);
      reader.readAsDataURL(file);
    };
    return (
      <div>
        <input
          ref={fileRef}
          type="file"
          accept={field.accept || "*/*"}
          onChange={handleFile}
          className="block w-full text-sm text-zinc-500 dark:text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-nuvora-50 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-nuvora-700 hover:file:bg-nuvora-100 dark:file:bg-nuvora-900/50 dark:file:text-nuvora-600 dark:hover:file:bg-nuvora-900/70"
          aria-label={field.label}
        />
        {value && value.startsWith("data:") && (
          <p className="mt-1 text-xs text-green-700 dark:text-green-400">File loaded ({Math.round(((value.length * 3) / 4 / 1024))} KB)</p>
        )}
        {value === "__error__:File exceeds 20MB limit" && (
          <p className="mt-1 text-xs text-red-700 dark:text-red-400">File exceeds 20MB limit. Please choose a smaller file.</p>
        )}
        {value && value.startsWith("data:image/") && (
          <img src={value} alt="Preview" loading="lazy" decoding="async" className="mt-2 max-h-40 rounded-lg border border-zinc-200 object-contain dark:border-zinc-700" />
        )}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        aria-label={field.label}
        rows={6}
      />
    );
  }
  if (field.type === "select") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400"
        aria-label={field.label}
      >
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <Input
      type={field.type === "number" ? "number" : "text"}
      value={value}
      onChange={(e) => onChange(field.name, e.target.value)}
      placeholder={field.placeholder}
      aria-label={field.label}
    />
  );
}

function ResultRenderer({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(([k]) => k !== "swatch");

  if (entries.length === 0) return null;

  const swatch = data.swatch as string | undefined;

  return (
    <div className="space-y-3">
      {swatch && (
        <div
          style={{ background: swatch.replace("background:", "").split(";")[0] || swatch, borderRadius: "8px", border: "1px solid #e4e4e7", height: "48px", width: "100%" }}
        />
      )}
      {entries.map(([key, val]) => {
        const strVal = typeof val === "object" ? JSON.stringify(val, null, 2) : String(val);
        const isImageResult = typeof val === "string" && val.startsWith("__image__:");
        const isDownload = typeof val === "string" && val.startsWith("__download__:");
        const isCode = !isImageResult && !isDownload && (key === "formatted" || key === "encoded" || key === "decoded" || key === "binary" || key === "hex" || key === "octal" || key === "html" || key === "cleaned" || key === "css-prefixer" || strVal.length > 60);
        const isError = key === "error";
        const imageUrl = isImageResult ? strVal.replace("__image__:", "") : null;

        return (
          <Card key={key} variant="default" className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {key.replace(/-/g, " ")}
              </p>
              {!isError && !isImageResult && !isDownload && <CopyButton text={strVal} />}
            </div>
            {isError ? (
              <p className="text-sm text-red-700 dark:text-red-400">{strVal}</p>
            ) : isImageResult && imageUrl ? (
              <img src={imageUrl} alt={key} loading="lazy" decoding="async" className="max-h-64 rounded-lg border border-zinc-200 object-contain dark:border-zinc-700" />
            ) : isDownload ? (
              <a
                href={strVal.replace(/__download__:/, "").replace(/\|\|.*$/, "")}
                download={strVal.includes("||") ? strVal.split("||").pop() : "download"}
                className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Download File
              </a>
            ) : isCode ? (
              <pre className="max-h-64 overflow-x-auto rounded-lg bg-zinc-50 p-3 font-mono text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                {strVal}
              </pre>
            ) : (
              <p className="break-all font-medium text-zinc-900 dark:text-zinc-50">
                {strVal}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export function ToolComponent({ slug }: ToolComponentProps) {
  const tool = getToolBySlug(slug);
  const config: ToolConfig = getToolConfig(slug);
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValues({});
    setResult(null);
    setError("");
  }, [slug]);

  const updateField = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (config.asyncProcess) {
        setLoading(true);
        const res = await config.asyncProcess(values);
        if (res && "error" in res && res.error) {
          setError(String(res.error));
        } else if (res) {
          setResult(res);
        }
      } else if (config.process) {
        await new Promise((r) => setTimeout(r, 200));
        const res = config.process(values);

        if (res && "error" in res && res.error) {
          setError(String(res.error));
        } else if (res) {
          setResult(res as Record<string, unknown>);
        }
      } else if (config.apiEndpoint) {
        const params = new URLSearchParams();
        if (values.input) params.set("q", values.input);
        Object.entries(values).forEach(([k, v]) => {
          if (k !== "input" && v) params.set(k, v);
        });

        const res = await fetch(`${config.apiEndpoint}?${params.toString()}`);
        const json = await res.json();

        if (!res.ok) {
          setError(json.error || "Request failed");
        } else {
          setResult(json);
        }
      } else {
        setError("No processing method configured for this tool");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!tool) {
    return <Alert variant="error">Tool not found.</Alert>;
  }

  if (config.isComingSoon) {
    return (
      <div className="mx-auto max-w-lg text-center py-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-nuvora-100 text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">
          <Icon name="PenSquare" className="size-8" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{tool.name}</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{tool.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Icon name="RefreshCw" className="size-4" />
          Coming soon â€” interactive version under development
        </span>
      </div>
    );
  }

  const hasFields = config.fields.length > 0;
  const canSubmit = hasFields
    ? config.fields.every((f) => !f.required || values[f.name])
    : true;

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {hasFields ? (
          config.fields.map((field) => (
            <div key={field.name}>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {field.label}
              </label>
              <FieldRenderer
                field={field}
                value={values[field.name] || ""}
                onChange={updateField}
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Click the button below to run this tool.
          </p>
        )}

        <Button type="submit" disabled={loading || (!hasFields && result !== null)} variant="primary" className="w-full">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            config.buttonText
          )}
        </Button>
      </form>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {loading && (
        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Results
            </h3>
          </div>
          <ResultRenderer data={result} />
        </div>
      )}
    </div>
  );
}
