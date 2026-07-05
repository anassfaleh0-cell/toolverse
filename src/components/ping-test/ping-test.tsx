"use client";

import { useState, useTransition } from "react";

interface PingResult {
  host: string;
  attempts: number;
  successful: number;
  lossCount: number;
  packetLoss: number;
  min: number;
  max: number;
  avg: number;
  times: number[];
}

export function PingTest() {
  const [host, setHost] = useState("");
  const [result, setResult] = useState<PingResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = host.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/ping-test?host=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Ping test failed");
      } else {
        startTransition(() => setResult(json));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="example.com"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          aria-label="Hostname or IP"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Pinging..." : "Ping"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="h-4 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Packets</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.successful}/{result.attempts}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Packet Loss</p>
              <p className={`mt-1 text-sm font-semibold ${
                result.packetLoss === 0 ? "text-green-600 dark:text-green-400" :
                result.packetLoss >= 50 ? "text-red-600 dark:text-red-400" :
                "text-amber-600 dark:text-amber-400"
              }`}>
                {result.packetLoss}%
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Min</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.min}ms
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Average</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.avg}ms
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Max</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.max}ms
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Ping Results for {result.host}
              </p>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {result.times.map((time, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50"
                >
                  <span className="text-zinc-500 dark:text-zinc-400">Reply {i + 1}</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-50">
                    {time}ms
                  </span>
                </div>
              ))}
              {result.lossCount > 0 && Array.from({ length: result.lossCount }).map((_, i) => (
                <div
                  key={`loss-${i}`}
                  className="flex items-center justify-between px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50"
                >
                  <span className="text-zinc-500 dark:text-zinc-400">Request {result.times.length + i + 1}</span>
                  <span className="font-mono text-red-600 dark:text-red-400">Timeout</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
