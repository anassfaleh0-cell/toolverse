"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Input, Button, Alert, Skeleton } from "@/components/ui";
import { CopyButton, DashboardSummary, StatusBadge, ScoreGauge } from "@/components/shared";
import { Icon } from "@/components/shared/icon";

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

const SERVER_GEO: Record<string, { label: string; flag: string }> = {
  Google: { label: "Google (US)", flag: "🇺🇸" },
  Cloudflare: { label: "Cloudflare (Global)", flag: "🌍" },
  Quad9: { label: "Quad9 (Switzerland)", flag: "🇨🇭" },
  OpenDNS: { label: "OpenDNS (US)", flag: "🇺🇸" },
  Mullvad: { label: "Mullvad (Sweden)", flag: "🇸🇪" },
};

function getPropagationStatus(uniqueValues: string[]): {
  label: string;
  variant: "success" | "warning" | "error";
  message: string;
} {
  if (uniqueValues.length === 0) {
    return {
      label: "No Records Found",
      variant: "error",
      message: "None of the queried DNS servers returned records for this domain and record type.",
    };
  }
  if (uniqueValues.length === 1) {
    return {
      label: "Propagation Complete",
      variant: "success",
      message: "All DNS servers return the same value. Your DNS change has propagated globally.",
    };
  }
  if (uniqueValues.length <= 3) {
    return {
      label: "Still Propagating",
      variant: "warning",
      message: `Different DNS servers see ${uniqueValues.length} different values. The change is still spreading. Check back in 15-30 minutes.`,
    };
  }
  return {
    label: "Possible Issue",
    variant: "error",
    message: `DNS servers disagree with ${uniqueValues.length} unique values. This could indicate a split-brain DNS configuration, a recent change still propagating, or an outage at one provider.`,
  };
}

export function DnsPropagationChecker() {
  const [hostname, setHostname] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [result, setResult] = useState<PropagationResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState<string | null>(null);
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
        startTransition(() => {
          setResult(json);
          setTimestamp(new Date().toISOString());
        });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const status = result ? getPropagationStatus(result.uniqueValues) : null;
  const geoLabel = (server: string) => SERVER_GEO[server] || { label: server, flag: "" };

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          value={hostname}
          onChange={(e) => setHostname(e.target.value)}
          placeholder="example.com"
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
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
        >
          {loading ? "Checking..." : "Check"}
        </Button>
      </form>

      {error && (
        <Alert variant="error" className="mt-6">{error}</Alert>
      )}

      {loading && (
        <div className="mt-8">
          <Skeleton count={5} columns={1} />
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 space-y-6">
          <DashboardSummary
            title={`${result.hostname} — ${result.type} Records`}
            status={result.uniqueValues.length === 1 ? "good" : result.uniqueValues.length <= 3 ? "warning" : "critical"}
            mainFinding={status?.label || "Checking..."}
            riskLevel={result.uniqueValues.length === 1 ? "low" : result.uniqueValues.length <= 3 ? "medium" : "high"}
            riskLabel={`${result.uniqueValues.length} value${result.uniqueValues.length > 1 ? "s" : ""}`}
            timestamp={timestamp || undefined}
            nextAction={result.uniqueValues.length > 1 ? "Wait for propagation. Check back in 15-30 minutes. If inconsistent after 48h, contact your DNS provider." : "Propagation complete. Verify with DNS Lookup if you need individual record details."}
          >
            {(() => {
              const responding = result.servers.filter(s => s.values !== null && s.values.length > 0).length;
              const total = result.servers.length;
              const confidence = result.uniqueValues.length === 1 ? Math.round(80 + (responding / total) * 20) : result.uniqueValues.length <= 3 ? Math.round(30 + (responding / total) * 20) : Math.round(10 + (responding / total) * 10);
              return <ScoreGauge score={confidence} size={60} label="Confidence" />;
            })()}
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={result.uniqueValues.length === 1 ? "good" : result.uniqueValues.length <= 3 ? "warning" : "critical"} label={status?.label || "Unknown"} pulse={result.uniqueValues.length > 1} />
              <StatusBadge status={result.servers.some((s) => s.values === null) ? "warning" : "good"} label={result.servers.some((s) => s.values === null) ? "Server Dropout" : "All Responding"} />
            </div>
          </DashboardSummary>

          <div className="flex items-center justify-end">
            <CopyButton text={JSON.stringify(result, null, 2)} label="Copy" />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {result.servers.map((s) => {
              const ok = s.values !== null && s.values.length > 0;
              return (
                <div key={s.server} className={`h-2 rounded-full transition-all duration-500 ${ok ? "bg-emerald-500" : "bg-red-400"}`} title={s.server} />
              );
            })}
          </div>

          <div className="space-y-3">
            {result.servers.map((s) => {
              const geo = geoLabel(s.server);
              const consistent = result.uniqueValues.length === 1;
              return (
                <div
                  key={s.server}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {geo.flag ? <span aria-hidden="true">{geo.flag}</span> : null}
                      {geo.label}
                    </span>
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {s.values === null ? <><Icon name="AlertTriangle" className="size-3.5 text-amber-500" /> No response</> : s.values.length === 0 ? <><Icon name="XCircle" className="size-3.5 text-red-500" /> No records</> : <><Icon name="CheckCircle2" className="size-3.5 text-emerald-500" /> {s.values.length} record(s)</>}
                      </span>
                  </div>
                  {s.values && s.values.length > 0 && (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {s.values.map((val, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-5 py-3 font-mono text-sm"
                        >
                          {consistent ? (
                            <Icon name="CheckCircle2" className="size-4 text-emerald-500" />
                          ) : (
                            <Icon name="AlertTriangle" className="size-4 text-amber-500" />
                          )}
                          <span className="text-zinc-600 dark:text-zinc-400">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {s.values === null && (
                    <div className="px-5 py-3 text-sm text-red-500">
                      Server did not respond. May be blocking DoH queries or experiencing an outage.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
            <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">Why Different Locations See Different Results</h3>
            <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <p>
                DNS propagation is not a geographic wave. Each resolver refreshes its cache independently when its
                stored TTL expires. A resolver in Australia may update before one next to your server.
              </p>
              <p>
                Factors that cause inconsistency: resolver-specific cache policies, anycast routing (different physical
                servers behind the same IP), DNSSEC validation failures, and negative caching of non-existent records.
              </p>
              <p>
                <strong>Estimated propagation time:</strong> Records with TTL 300s typically propagate within 5-10
                minutes. TTL 3600s can take 1-2 hours. TTL 86400s may take 24-48 hours. Lower TTL 48 hours before
                making changes for faster rollout.
              </p>
            </div>
          </div>

          {result.uniqueValues.length > 1 && (
            <div className="rounded-xl border border-amber-200 p-5 text-sm dark:border-amber-900">
              <h3 className="mb-2 font-medium text-amber-800 dark:text-amber-200">When To Worry</h3>
              <div className="space-y-1.5 text-amber-700 dark:text-amber-300">
                <p>&#8226; Mixed results lasting over 48 hours with TTL &lt; 3600s suggest stale glue records or secondary NS failure.</p>
                <p>&#8226; One resolver returning old data while others show new data indicates a specific resolver is not respecting TTL.</p>
                <p>&#8226; A server returning no response across multiple checks may be blocking DoH or experiencing a partial outage.</p>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
            <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">Troubleshooting Resources</h3>
            <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <p>
                Verify individual record details with <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link>.
              </p>
              <p>
                Check domain registration and expiration with <Link href="/whois-lookup" className="text-blue-600 hover:underline dark:text-blue-400">WHOIS Lookup</Link>.
              </p>
              <p>
                If propagation is critical, purge your recursive resolver cache or wait out the original TTL.
                Contact your DNS provider if inconsistency persists beyond 72 hours.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
