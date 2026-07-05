"use client";

import { useState, useTransition } from "react";

interface DnsRecord {
  type: string;
  values: string[];
}

interface DnsResult {
  hostname: string;
  records: DnsRecord[];
}

export function DnsLookup() {
  const [hostname, setHostname] = useState("");
  const [result, setResult] = useState<DnsResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = hostname.trim().toLowerCase();
    if (!trimmed) return;

    const hostnameRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!hostnameRegex.test(trimmed)) {
      setError("Enter a valid hostname (e.g., example.com)");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/dns-lookup?hostname=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to perform DNS lookup");
      } else {
        startTransition(() => setResult(json));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const typeColors: Record<string, string> = {
    A: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    AAAA: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    CNAME: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    MX: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    NS: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    TXT: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    SOA: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
    SRV: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    CAA: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={hostname}
          onChange={(e) => setHostname(e.target.value)}
          placeholder="example.com"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          aria-label="Hostname"
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
        <div className="mt-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="mb-3 h-5 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {result && result.records.length > 0 && !loading && (
        <div aria-live="polite" className="mt-8 space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            DNS records for <span className="font-medium text-zinc-900 dark:text-zinc-50">{result.hostname}</span>
          </p>
          {result.records.map((record) => (
            <div
              key={record.type}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <span
                  className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${typeColors[record.type] || "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"}`}
                >
                  {record.type}
                </span>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {record.values.map((val, i) => (
                  <div
                    key={i}
                    className="px-5 py-3 font-mono text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {result && result.records.length === 0 && !loading && (
        <div className="mt-8 rounded-lg border border-zinc-200 p-8 text-center text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          No DNS records found for {result.hostname}. The domain may not exist or has no configured records.
        </div>
      )}
    </div>
  );
}
