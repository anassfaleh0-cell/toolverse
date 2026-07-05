"use client";

import { useState, useTransition } from "react";

interface ServerResult {
  server: string;
  values: string[] | null;
}

interface PropagationResult {
  hostname: string;
  type: string;
  servers: ServerResult[];
  uniqueValues: string[];
}

const RECORD_TYPES = ["A", "AAAA", "MX", "NS", "TXT", "CNAME"];

export function DnsPropagationChecker() {
  const [hostname, setHostname] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [result, setResult] = useState<PropagationResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = hostname.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `/api/dns-propagation?hostname=${encodeURIComponent(trimmed)}&type=${recordType}`,
      );
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to check DNS propagation");
      } else {
        startTransition(() => setResult(json));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const statusIcon = (values: string[] | null) => {
    if (values === null) return { icon: "⚠️", label: "No response" };
    if (values.length === 0) return { icon: "❌", label: "No records" };
    return { icon: "✅", label: `${values.length} record(s)` };
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
        <select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          aria-label="Record type"
        >
          {RECORD_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
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
        <div className="mt-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="h-5 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 flex-1 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="mt-8">
          <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            Propagation status for <span className="font-medium text-zinc-900 dark:text-zinc-50">{result.hostname}</span> {result.type} records
          </p>

          {result.uniqueValues.length > 1 && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Propagation in progress — different DNS servers see different values.
            </div>
          )}

          {result.uniqueValues.length === 1 && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
              Fully propagated — all DNS servers agree on the same value.
            </div>
          )}

          <div className="space-y-3">
            {result.servers.map((s) => {
              const status = statusIcon(s.values);
              return (
                <div
                  key={s.server}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {s.server}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {status.icon} {status.label}
                    </span>
                  </div>
                  {s.values && s.values.length > 0 && (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {s.values.map((val, i) => (
                        <div
                          key={i}
                          className="px-5 py-3 font-mono text-sm text-zinc-600 dark:text-zinc-400"
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
