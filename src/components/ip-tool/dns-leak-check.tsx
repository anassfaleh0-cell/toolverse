"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { runDnsLeakCheck, type DnsLeakResult } from "@/lib/dns-leak-utils";

function LeakStatusBadge({ hasLeak }: { hasLeak: boolean }) {
  if (hasLeak) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/50 dark:text-red-300">
        <span className="inline-block size-1.5 rounded-full bg-red-500" />
        Leak Detected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
      <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
      No Leak Detected
    </span>
  );
}

interface DnsLeakCheckProps {
  publicIp: string;
}

export function DnsLeakCheck({ publicIp }: DnsLeakCheckProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DnsLeakResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCheck = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await runDnsLeakCheck(publicIp);
      setResult(r);
    } catch {
      setError("DNS leak check failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [publicIp]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            DNS Leak Test
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Checks if your DNS queries leak your real location behind a VPN. Fully client-side.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm" onClick={runCheck} disabled={loading}>
          {loading ? "Scanning..." : "Run DNS Leak Test"}
        </Button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="size-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600 dark:border-zinc-600" />
          <span className="text-sm text-zinc-500">Querying DNS resolvers and checking for leaks...</span>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {result && !loading && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <LeakStatusBadge hasLeak={result.hasLeak} />
            <span className="text-xs text-zinc-500">
              Your public IP: <span className="font-mono text-zinc-700 dark:text-zinc-300">{result.publicIp}</span>
            </span>
          </div>

          {result.hasLeak && result.leakedIps.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Potential IP Leak Detected</p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                WebRTC revealed an IP ({result.leakedIps.join(", ")}) that differs from your public IP ({result.publicIp}).
                This means your real IP may be exposed through WebRTC even if you are using a VPN.
              </p>
            </div>
          )}

          {result.webRtc.error && !result.hasLeak && (
            <p className="text-xs text-zinc-500">
              WebRTC check: {result.webRtc.error} — your browser likely blocks WebRTC IP leaks.
            </p>
          )}

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">DNS Resolvers</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {result.resolvers.map((r) => (
                <div key={r.name} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                  <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50">{r.name}</p>
                  {r.error ? (
                    <p className="mt-1 text-xs text-red-500">{r.error}</p>
                  ) : (
                    <>
                      <p className="mt-0.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">{r.ip || "N/A"}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {r.latencyMs !== null ? `${r.latencyMs}ms` : ""}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
            <p className="mb-1 font-medium">What this means</p>
            <ul className="list-inside list-disc space-y-1">
              <li>DNS resolvers show which services handle your DNS queries and their response times.</li>
              <li>WebRTC can reveal your real IP even behind a VPN if not properly blocked.</li>
              <li>If all IPs match your public IP and no WebRTC leak is detected, your connection is likely private.</li>
              <li>For full protection, use a VPN with built-in DNS leak protection and a WebRTC blocker.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
