"use client";

import { useState } from "react";
import { Input, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  params: { key: string; value: string }[];
}

interface UrlComponents {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  hash: string;
  params: { key: string; value: string }[];
}

const emptyComponents: UrlComponents = {
  protocol: "https:",
  hostname: "",
  port: "",
  pathname: "/",
  hash: "",
  params: [{ key: "", value: "" }],
};

export function UrlParser() {
  const [urlInput, setUrlInput] = useState("https://example.com/path/to/page?name=John&age=30#section");
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);
  const [buildComponents, setBuildComponents] = useState<UrlComponents>({ ...emptyComponents });
  const [builtUrl, setBuiltUrl] = useState("");
  const [mode, setMode] = useState<"parse" | "build">("parse");

  function handleParse() {
    try {
      const url = new URL(urlInput);
      const params: { key: string; value: string }[] = [];
      url.searchParams.forEach((value, key) => params.push({ key, value }));

      setParsed({
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || "(default)",
        pathname: url.pathname,
        search: url.search || "(none)",
        hash: url.hash || "(none)",
        origin: url.origin,
        params,
      });
    } catch {
      setParsed(null);
    }
  }

  function handleBuild() {
    try {
      const params = buildComponents.params
        .filter((p) => p.key && p.value)
        .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join("&");

      let url = `${buildComponents.protocol}//${buildComponents.hostname}`;
      if (buildComponents.port) url += `:${buildComponents.port}`;
      url += buildComponents.pathname.startsWith("/") ? buildComponents.pathname : `/${buildComponents.pathname}`;
      if (params) url += `?${params}`;
      if (buildComponents.hash) url += buildComponents.hash.startsWith("#") ? buildComponents.hash : `#${buildComponents.hash}`;

      setBuiltUrl(url);
    } catch {
      setBuiltUrl("Invalid URL components");
    }
  }

  function updateBuildParam(index: number, field: "key" | "value", value: string) {
    const updated = [...buildComponents.params];
    updated[index] = { ...updated[index], [field]: value };
    setBuildComponents({ ...buildComponents, params: updated });
  }

  function addBuildParam() {
    setBuildComponents({ ...buildComponents, params: [...buildComponents.params, { key: "", value: "" }] });
  }

  function removeBuildParam(index: number) {
    const updated = buildComponents.params.filter((_, i) => i !== index);
    setBuildComponents({ ...buildComponents, params: updated.length ? updated : [{ key: "", value: "" }] });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex gap-2">
        <Button variant={mode === "parse" ? "primary" : "secondary"} onClick={() => setMode("parse")} size="sm">
          Parse URL
        </Button>
        <Button variant={mode === "build" ? "primary" : "secondary"} onClick={() => setMode("build")} size="sm">
          Build URL
        </Button>
      </div>

      {mode === "parse" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1">
              <label htmlFor="url-input" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Enter URL
              </label>
              <Input
                id="url-input"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/path?query=value#hash"
              />
            </div>
            <Button onClick={handleParse}>Parse</Button>
          </div>

          {parsed && (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Parsed Components
                </p>
                <CopyButton text={urlInput} label="Copy URL" />
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {[
                  { label: "Protocol", value: parsed.protocol },
                  { label: "Hostname", value: parsed.hostname },
                  { label: "Port", value: parsed.port },
                  { label: "Pathname", value: parsed.pathname },
                  { label: "Search", value: parsed.search },
                  { label: "Hash", value: parsed.hash },
                  { label: "Origin", value: parsed.origin },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-3 even:bg-zinc-50 dark:even:bg-zinc-900/50">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                    <span className="max-w-[60%] truncate font-mono text-sm text-zinc-900 dark:text-zinc-50">{item.value}</span>
                  </div>
                ))}
              </div>

              {parsed.params.length > 0 && (
                <>
                  <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Query Parameters ({parsed.params.length})
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800">
                          <th className="px-5 py-2 font-medium text-zinc-500 dark:text-zinc-400">Key</th>
                          <th className="px-5 py-2 font-medium text-zinc-500 dark:text-zinc-400">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {parsed.params.map((p, i) => (
                          <tr key={i} className="even:bg-zinc-50 dark:even:bg-zinc-900/50">
                            <td className="px-5 py-2 font-mono text-zinc-900 dark:text-zinc-50">{p.key}</td>
                            <td className="px-5 py-2 font-mono text-zinc-700 dark:text-zinc-300">{p.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {!parsed && urlInput && (
            <p className="text-sm text-red-700">Invalid URL. Please enter a valid URL (e.g., https://example.com).</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Protocol</label>
              <select
                value={buildComponents.protocol}
                onChange={(e) => setBuildComponents({ ...buildComponents, protocol: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400"
              >
                <option value="https:">https://</option>
                <option value="http:">http://</option>
                <option value="ftp:">ftp://</option>
                <option value="mailto:">mailto:</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Hostname</label>
              <Input
                value={buildComponents.hostname}
                onChange={(e) => setBuildComponents({ ...buildComponents, hostname: e.target.value })}
                placeholder="example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Port</label>
              <Input
                value={buildComponents.port}
                onChange={(e) => setBuildComponents({ ...buildComponents, port: e.target.value })}
                placeholder="8080"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Pathname</label>
              <Input
                value={buildComponents.pathname}
                onChange={(e) => setBuildComponents({ ...buildComponents, pathname: e.target.value })}
                placeholder="/path/to/page"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Hash</label>
            <Input
              value={buildComponents.hash}
              onChange={(e) => setBuildComponents({ ...buildComponents, hash: e.target.value })}
              placeholder="section-id"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Query Parameters</label>
              <Button variant="ghost" size="sm" onClick={addBuildParam}>+ Add Parameter</Button>
            </div>
            {buildComponents.params.map((param, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <Input
                  value={param.key}
                  onChange={(e) => updateBuildParam(i, "key", e.target.value)}
                  placeholder="Key"
                />
                <Input
                  value={param.value}
                  onChange={(e) => updateBuildParam(i, "value", e.target.value)}
                  placeholder="Value"
                />
                <Button variant="ghost" size="sm" onClick={() => removeBuildParam(i)}>âœ•</Button>
              </div>
            ))}
          </div>

          <Button onClick={handleBuild}>Build URL</Button>

          {builtUrl && (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Built URL</p>
                <CopyButton text={builtUrl} label="Copy URL" />
              </div>
              <div className="px-5 py-4">
                <code className="break-all font-mono text-sm text-blue-600 dark:text-blue-400">{builtUrl}</code>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
