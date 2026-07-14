"use client";

import { useState, useMemo } from "react";
import { Textarea, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

interface CleanOption {
  id: string;
  label: string;
  enabled: boolean;
}

export function TextCleaner() {
  const [input, setInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [options, setOptions] = useState<CleanOption[]>([
    { id: "extraSpaces", label: "Collapse extra spaces", enabled: true },
    { id: "specialChars", label: "Remove special characters", enabled: false },
    { id: "removeNumbers", label: "Remove numbers", enabled: false },
    { id: "removeHtml", label: "Remove HTML tags", enabled: true },
    { id: "trim", label: "Trim leading/trailing whitespace", enabled: true },
    { id: "smartQuotes", label: "Replace smart quotes", enabled: true },
    { id: "removeUrls", label: "Remove URLs", enabled: false },
  ]);

  const toggleOption = (id: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, enabled: !o.enabled } : o)));
  };

  const cleaned = useMemo(() => {
    let text = input;
    const opts = Object.fromEntries(options.map((o) => [o.id, o.enabled]));
    if (opts.removeHtml) text = text.replace(/<[^>]*>/g, "");
    if (opts.smartQuotes) {
      text = text
        .replace(/“|”/g, '"')
        .replace(/‘|’/g, "'")
        .replace(/–|—/g, "-");
    }
    if (opts.removeUrls) text = text.replace(/https?:\/\/[^\s]+/g, "");
    if (opts.removeNumbers) text = text.replace(/\d+/g, "");
    if (opts.specialChars) text = text.replace(/[^a-zA-Z0-9\s]/g, "");
    if (opts.extraSpaces) text = text.replace(/\s{2,}/g, " ");
    if (opts.trim) text = text.trim();
    return text;
  }, [input, options]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text to clean..."
          rows={6}
          aria-label="Input text"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt.id} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={opt.enabled}
              onChange={() => toggleOption(opt.id)}
              className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {input && (
        <Button variant="secondary" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Hide" : "Show"} Preview
        </Button>
      )}

      {showPreview && input && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Before</p>
            </div>
            <pre className="max-h-48 overflow-y-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{input}</pre>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">After</p>
              <CopyButton text={cleaned} />
            </div>
            <pre className="max-h-48 overflow-y-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{cleaned}</pre>
          </div>
        </div>
      )}

      {!showPreview && cleaned && input && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Cleaned Result</p>
            <CopyButton text={cleaned} />
          </div>
          <pre className="max-h-64 overflow-y-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{cleaned}</pre>
        </div>
      )}
    </div>
  );
}
