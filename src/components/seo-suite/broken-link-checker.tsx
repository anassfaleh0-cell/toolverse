"use client";

import { useState } from "react";
import { Textarea, Button, Input } from "@/components/ui";

interface LinkResult {
  url: string;
  status: number;
  statusText: string;
  responseTime: number;
  error?: string;
}

export function BrokenLinkChecker() {
  const [urls, setUrls] = useState("https://example.com\nhttps://example.com/nonexistent");
  const [results, setResults] = useState<LinkResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [concurrency, setConcurrency] = useState("3");

  async function checkLinks() {
    const urlList = urls.split("\n").filter(Boolean).map(u => u.trim());
    if (urlList.length === 0) return;

    setLoading(true);
    setResults([]);
    const maxConcurrent = Math.min(parseInt(concurrency) || 3, 10);
    const res: LinkResult[] = [];

    for (let i = 0; i < urlList.length; i += maxConcurrent) {
      const batch = urlList.slice(i, i + maxConcurrent);
      const batchResults = await Promise.all(
        batch.map(async (url): Promise<LinkResult> => {
          const start = performance.now();
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(url, { method: "HEAD", signal: controller.signal, mode: "no-cors" });
            clearTimeout(timeout);
            const elapsed = Math.round(performance.now() - start);
            if (response.type === "opaque") {
              return { url, status: 0, statusText: "CORS blocked (needs server-side check)", responseTime: elapsed };
            }
            return { url, status: response.status, statusText: response.statusText, responseTime: elapsed };
          } catch (err) {
            const elapsed = Math.round(performance.now() - start);
            const message = err instanceof Error ? err.message : "Unknown error";
            return { url, status: 0, statusText: "Error", responseTime: elapsed, error: message };
          }
        }),
      );
      res.push(...batchResults);
    }

    setResults(res);
    setLoading(false);
  }

  const statusColor = (status: number) => {
    if (status === 0) return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
    if (status >= 200 && status < 300) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300";
    if (status >= 300 && status < 400) return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
    return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
  };

  const brokenCount = results.filter(r => r.status >= 400 || r.status === 0).length;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label htmlFor="bl-urls" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">URLs to check (one per line)</label>
        <Textarea id="bl-urls" value={urls} onChange={(e) => setUrls(e.target.value)} rows={5} aria-label="URLs to check" />
      </div>
      <div className="flex items-end gap-3">
        <div className="w-32">
          <label htmlFor="bl-concurrency" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Concurrency</label>
          <Input id="bl-concurrency" type="number" min="1" max="10" value={concurrency} onChange={(e) => setConcurrency(e.target.value)} aria-label="Concurrency" />
        </div>
        <Button type="button" onClick={checkLinks} disabled={loading} aria-label="Check links">
          {loading ? "Checking..." : "Check Links"}
        </Button>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400" role="alert">
        Due to browser CORS restrictions, many URLs will show as &ldquo;CORS blocked.&rdquo; For production use, implement a server-side proxy or use our API.
      </div>

      {results.length > 0 && (
        <>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Total: {results.length}</span>
            <span className="text-emerald-600 dark:text-emerald-400">OK: {results.length - brokenCount}</span>
            {brokenCount > 0 && <span className="text-red-600 dark:text-red-400">Broken: {brokenCount}</span>}
          </div>
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">{r.url}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(r.status)}`}>
                        {r.status || "N/A"} {r.statusText}
                      </span>
                      <span className="text-xs text-zinc-400">{r.responseTime}ms</span>
                    </div>
                    {r.error && <p className="mt-1 text-xs text-red-500">{r.error}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
