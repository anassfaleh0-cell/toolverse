"use client";

import { useState, useTransition } from "react";

interface HeadersResult {
  url: string;
  finalUrl: string;
  statusCode: number;
  statusText: string;
  responseTime: number;
  headers: Record<string, string>;
  redirectChain: { url: string; status: number; headers: Record<string, string> }[];
  tlsVersion: string | null;
}

export function HttpHeadersChecker() {
  const [inputUrl, setInputUrl] = useState("");
  const [result, setResult] = useState<HeadersResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputUrl.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/http-headers?url=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to fetch headers");
      } else {
        startTransition(() => setResult(json));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const statusColor = (code: number) => {
    if (code >= 200 && code < 300) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (code >= 300 && code < 400) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (code >= 400 && code < 500) return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const importantHeaders = [
    "content-type", "content-length", "cache-control", "expires",
    "set-cookie", "strict-transport-security", "x-frame-options",
    "x-content-type-options", "x-xss-protection", "referrer-policy",
    "content-security-policy", "access-control-allow-origin",
    "server", "x-powered-by", "location", "age",
  ];

  const sortedHeaders = (headers: Record<string, string>) => {
    const entries = Object.entries(headers);
    const important = entries.filter(([k]) => importantHeaders.includes(k.toLowerCase()));
    const rest = entries.filter(([k]) => !importantHeaders.includes(k.toLowerCase()));
    important.sort(([a], [b]) => importantHeaders.indexOf(a.toLowerCase()) - importantHeaders.indexOf(b.toLowerCase()));
    return [...important, ...rest.sort(([a], [b]) => a.localeCompare(b))];
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          aria-label="URL"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 w-36 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className={`h-4 flex-1 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`} />
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Status</p>
              <span className={`mt-1 inline-block rounded-md px-2.5 py-0.5 text-sm font-semibold ${statusColor(result.statusCode)}`}>
                {result.statusCode} {result.statusText}
              </span>
            </div>
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Response Time</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.responseTime}ms
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Final URL</p>
              <p className="mt-1 max-w-xs truncate text-sm text-zinc-900 dark:text-zinc-50">
                {result.finalUrl}
              </p>
            </div>
          </div>

          {result.redirectChain.length > 0 && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Redirect Chain
                </p>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {result.redirectChain.map((hop, i) => (
                  <div key={i} className="px-5 py-3 text-sm">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${statusColor(hop.status)}`}>
                      {hop.status}
                    </span>
                    <span className="ml-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      {hop.url}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Response Headers ({Object.keys(result.headers).length})
              </p>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {sortedHeaders(result.headers).map(([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {key}
                  </span>
                  <span className="break-words font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
