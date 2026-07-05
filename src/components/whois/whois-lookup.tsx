"use client";

import { useState, useTransition } from "react";

interface WhoisResult {
  domain: string;
  data: string;
}

function parseWhoisData(raw: string): { label: string; value: string }[] {
  const lines = raw.split("\n");
  const fields: { label: string; value: string }[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const label = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (!label || !value || label.startsWith("%") || label.startsWith(">")) continue;
    if (seen.has(label)) continue;
    seen.add(label);
    fields.push({ label, value });
  }

  return fields;
}

export function WhoisLookup() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<WhoisResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = domain.trim().toLowerCase();
    if (!trimmed) return;

    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!domainRegex.test(trimmed)) {
      setError("Enter a valid domain name (e.g., example.com)");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/whois?domain=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to fetch WHOIS data");
      } else {
        startTransition(() => {
          setResult(json);
        });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fields = result ? parseWhoisData(result.data) : [];

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          aria-label="Domain name"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Looking up..." : "Lookup"}
        </button>
      </form>

      {error && (
        <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className={`h-4 flex-1 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`} />
            </div>
          ))}
        </div>
      )}

      {result && fields.length > 0 && !loading && (
        <div aria-live="polite" className="mt-8 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              WHOIS Data for {result.domain}
            </p>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {fields.map((field) => (
              <div
                key={field.label}
                className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {field.label}
                </span>
                <span className="break-words text-zinc-600 dark:text-zinc-400">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && fields.length === 0 && !loading && (
        <div className="mt-8 rounded-lg border border-zinc-200 p-6 text-center text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <pre className="whitespace-pre-wrap break-words text-left text-xs">
            {result.data}
          </pre>
        </div>
      )}
    </div>
  );
}
