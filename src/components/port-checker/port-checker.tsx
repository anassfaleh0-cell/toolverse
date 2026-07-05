"use client";

import { useState, useTransition } from "react";

interface PortResult {
  port: number;
  service: string;
  status: "open" | "closed" | "filtered";
  responseTime: number | null;
}

interface PortResultData {
  host: string;
  ports: PortResult[];
}

export function PortChecker() {
  const [host, setHost] = useState("");
  const [customPort, setCustomPort] = useState("");
  const [result, setResult] = useState<PortResultData | null>(null);
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
      let url = `/api/port-checker?host=${encodeURIComponent(trimmed)}`;
      const customPortTrimmed = customPort.trim();
      if (customPortTrimmed) {
        const portNum = parseInt(customPortTrimmed, 10);
        if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
          setError("Port must be between 1 and 65535");
          setLoading(false);
          return;
        }
        url += `&port=${portNum}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Port check failed");
      } else {
        startTransition(() => setResult(json));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const openPorts = result?.ports.filter((p) => p.status === "open") || [];
  const closedPorts = result?.ports.filter((p) => p.status === "closed") || [];
  const filteredPorts = result?.ports.filter((p) => p.status === "filtered") || [];

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="example.com"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          aria-label="Hostname"
        />
        <input
          type="text"
          value={customPort}
          onChange={(e) => setCustomPort(e.target.value)}
          placeholder="Port (optional)"
          className="w-32 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          aria-label="Port number"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Scanning..." : "Scan"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="mb-2 h-4 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 space-y-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Scan results for <span className="font-medium text-zinc-900 dark:text-zinc-50">{result.host}</span>
            {" "}— {openPorts.length} open, {filteredPorts.length} filtered, {closedPorts.length} closed
          </p>

          {openPorts.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-green-600 dark:text-green-400">Open Ports</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {openPorts.map((p) => (
                  <div key={p.port} className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">{p.port}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">{p.service}</p>
                    <p className="mt-1 text-xs text-green-500">{p.responseTime}ms</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredPorts.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-amber-600 dark:text-amber-400">Filtered Ports</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {filteredPorts.map((p) => (
                  <div key={p.port} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{p.port}</p>
                    <p className="text-xs text-zinc-500">{p.service}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {closedPorts.length > 0 && (
            <details className="rounded-xl border border-zinc-200 dark:border-zinc-800">
              <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                Closed Ports ({closedPorts.length})
              </summary>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {closedPorts.map((p) => (
                  <div key={p.port} className="flex items-center justify-between px-5 py-2 text-sm">
                    <span className="text-zinc-900 dark:text-zinc-50">{p.port}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{p.service}</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
