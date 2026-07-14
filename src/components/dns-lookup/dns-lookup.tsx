"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import Link from "next/link";
import { Input, Button, Alert, Skeleton, Callout } from "@/components/ui";
import { CopyButton, DashboardSummary, StatusBadge, CompositeScore, ResultExport, ResultHistory, ToolMethodology } from "@/components/shared";
import { METHODOLOGY } from "@/lib/methodology";
import { saveResult } from "@/lib/user-storage";

interface DnsRecord {
  type: string;
  values: string[];
}

interface DnsResult {
  hostname: string;
  records: DnsRecord[];
}

interface HealthCheck {
  label: string;
  passed: boolean;
  points: number;
  message: string;
}

const EXAMPLES = ["example.com", "google.com", "cloudflare.com", "github.com"];

const TYPE_COLORS: Record<string, string> = {
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

const RECORD_EXPLANATIONS: Record<string, string> = {
  A: "Maps a domain name to an IPv4 address. Without this, the domain cannot be reached over the internet.",
  AAAA: "Maps a domain name to an IPv6 address. Required for reachability on IPv6-only networks.",
  CNAME: "Alias that points one domain to another. The resolver must perform an additional lookup for the target.",
  MX: "Specifies mail servers responsible for receiving email. Each entry includes a priority value (lower = preferred).",
  NS: "Delegates the domain to authoritative name servers. These servers hold the official DNS records for the zone.",
  TXT: "Holds arbitrary text data. Used for email authentication (SPF, DKIM, DMARC) and domain ownership verification.",
  SOA: "Start of Authority — the authoritative metadata for the zone. Contains the primary nameserver, admin contact, and serial number.",
  SRV: "Service locator that identifies hosts and ports for specific services like SIP or LDAP.",
  CAA: "Certification Authority Authorization — specifies which CAs are allowed to issue SSL/TLS certificates for the domain.",
};

const COMMON_MISTAKES = [
  "Missing MX records — email delivery fails silently; senders get bounce-back messages.",
  "No SPF/DKIM/DMARC TXT records — email from your domain is likely flagged as spam or rejected.",
  "CNAME at zone apex — CNAME records cannot coexist with other record types at the root domain.",
  "Missing AAAA record — IPv6-only users (growing in mobile networks) cannot reach your site.",
  "Excessive CNAME chains — each hop adds latency; keep chains under 3 hops.",
  "Mismatched NS delegation — glue records at the registrar point to servers not configured for the zone.",
];

function getHealthChecks(records: DnsRecord[]): HealthCheck[] {
  const types = new Set(records.map((r) => r.type));
  const allTxtValues = records
    .filter((r) => r.type === "TXT")
    .flatMap((r) => r.values);

  const hasSpf = allTxtValues.some((v) => {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed.join("").startsWith("v=spf1") : String(v).startsWith("v=spf1");
    } catch {
      return String(v).startsWith("v=spf1");
    }
  });

  return [
    {
      label: "A Record",
      passed: types.has("A") || types.has("AAAA"),
      points: 30,
      message: types.has("A") || types.has("AAAA")
        ? "IPv4 or IPv6 address is configured."
        : "No A or AAAA record. The domain is not reachable via the internet.",
    },
    {
      label: "AAAA Record (IPv6)",
      passed: types.has("AAAA"),
      points: 15,
      message: types.has("AAAA")
        ? "IPv6 record found. Domain is reachable over IPv6."
        : "No AAAA record. IPv6-only users cannot reach this domain.",
    },
    {
      label: "SOA Record",
      passed: types.has("SOA"),
      points: 15,
      message: types.has("SOA")
        ? "Start of Authority record found. Zone is properly delegated."
        : "No SOA record. The zone may not be properly configured.",
    },
    {
      label: "NS Records",
      passed: types.has("NS"),
      points: 15,
      message: types.has("NS")
        ? "Name server records found. Domain delegation is configured."
        : "No NS records. Domain delegation may be broken.",
    },
    {
      label: "MX Record (Email)",
      passed: types.has("MX"),
      points: 15,
      message: types.has("MX")
        ? "Mail exchanger records found. Email routing is configured."
        : "No MX record. Email delivery is not configured.",
    },
    {
      label: "TXT / SPF Record",
      passed: types.has("TXT") && hasSpf,
      points: 10,
      message: types.has("TXT") && hasSpf
        ? "TXT record with SPF policy found. Email authentication partially configured."
        : types.has("TXT")
          ? "TXT record found but no SPF policy (v=spf1) detected."
          : "No TXT record. SPF, DKIM, and DMARC are missing.",
    },
  ];
}

function getWarnings(records: DnsRecord[]): { variant: "warning" | "info"; title: string; message: string }[] {
  const types = new Set(records.map((r) => r.type));
  const warnings: { variant: "warning" | "info"; title: string; message: string }[] = [];

  if (types.has("A") && !types.has("AAAA")) {
    warnings.push({
      variant: "warning",
      title: "No AAAA Record",
      message: "This domain has no IPv6 (AAAA) record. Users on IPv6-only networks will not be able to reach it.",
    });
  }

  if (!types.has("MX")) {
    warnings.push({
      variant: "info",
      title: "No MX Record",
      message: "No mail exchangers are configured. If this domain should send or receive email, add MX records.",
    });
  }

  if (!types.has("TXT")) {
    warnings.push({
      variant: "info",
      title: "No TXT Record",
      message: "No TXT records found. Email authentication (SPF, DKIM, DMARC) and domain verification may be missing.",
    });
  }

  if (!types.has("SOA")) {
    warnings.push({
      variant: "warning",
      title: "No SOA Record",
      message: "Missing Start of Authority record. The DNS zone may not be properly configured or delegated.",
    });
  }

  return warnings;
}

function getSuspiciousConfigs(records: DnsRecord[]): string[] {
  const issues: string[] = [];
  const cnames = records.filter((r) => r.type === "CNAME");
  const aRecords = records.filter((r) => r.type === "A");

  if (cnames.length > 0 && aRecords.length > 0) {
    issues.push("CNAME record coexists with A record at the same name — this violates RFC 1034 and may cause unpredictable resolution.");
  }

  if (cnames.length > 3) {
    issues.push("Multiple CNAME records detected — long alias chains increase latency and risk of resolution failure.");
  }

  return issues;
}

function parseRecordValue(type: string, value: string): string {
  if (value.startsWith("{") || value.startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      if (type === "MX" && typeof parsed.priority === "number") {
        return `${parsed.exchange} (Priority: ${parsed.priority})`;
      }
      if (type === "SOA") {
        return `Primary NS: ${parsed.nsname || "—"} | Serial: ${parsed.serial ?? "—"}`;
      }
      if (type === "SRV" && typeof parsed.name === "string") {
        return `${parsed.name}:${parsed.port} (Priority: ${parsed.priority}, Weight: ${parsed.weight})`;
      }
      if (type === "CAA" && typeof parsed.tag === "string") {
        return `${parsed.tag} ${parsed.value}`;
      }
      if (Array.isArray(parsed)) return parsed.join("");
      return JSON.stringify(parsed);
    } catch {
      return value;
    }
  }
  return value;
}

export function DnsLookup() {
  const [hostname, setHostname] = useState("");
  const [result, setResult] = useState<DnsResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
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
    setFilterType(null);

    try {
      const res = await fetch(`/api/dns-lookup?hostname=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to perform DNS lookup");
      } else {
        startTransition(() => {
          setResult(json);
          setTimestamp(new Date().toISOString());
          saveResult("dns-lookup", json);
        });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function quickLookup(domain: string) {
    setHostname(domain);
    setFilterType(null);
    setLoading(true);
    setError("");
    setResult(null);

    fetch(`/api/dns-lookup?hostname=${encodeURIComponent(domain)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
        } else {
          startTransition(() => {
            setResult(json);
            setTimestamp(new Date().toISOString());
            saveResult("dns-lookup", json);
          });
        }
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }

  const formatDnsText = useCallback(() => {
    if (!result) return "";
    const lines = [`DNS Lookup Results for: ${result.hostname}`, `Generated: ${new Date().toISOString()}\n`];
    for (const rec of result.records) {
      for (const val of rec.values) {
        let display = val;
        try {
          const p = JSON.parse(val);
          if (rec.type === "MX" && typeof p.priority === "number") display = `${p.exchange} (Priority: ${p.priority})`;
          else if (rec.type === "SOA") display = `Primary NS: ${p.nsname || "—"} | Serial: ${p.serial ?? "—"}`;
        } catch { /* not json */ }
        lines.push(`${rec.type}\t${display}`);
      }
    }
    return lines.join("\n");
  }, [result]);

  const formatDnsCsv = useCallback(() => {
    if (!result) return "";
    const rows = [["Type", "Value"]];
    for (const rec of result.records) {
      for (const val of rec.values) {
        rows.push([rec.type, val.replace(/"/g, '""')]);
      }
    }
    return rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  }, [result]);

  const allTypes = [...new Set(result?.records.map((r) => r.type) ?? [])];
  const filteredRecords = filterType
    ? result?.records.filter((r) => r.type === filterType)
    : result?.records;

  const warnings = useMemo(() => result ? getWarnings(result.records) : [], [result]);
  const suspicious = useMemo(() => result ? getSuspiciousConfigs(result.records) : [], [result]);
  const checks = useMemo(() => result ? getHealthChecks(result.records) : [], [result]);

  const healthScore = useMemo(() => {
    if (checks.length === 0) return null;
    const total = checks.reduce((s, c) => s + c.points, 0);
    const earned = checks.reduce((s, c) => s + (c.passed ? c.points : 0), 0);
    return Math.round((earned / total) * 100);
  }, [checks]);

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
        <Button type="submit" disabled={loading} variant="primary">
          {loading ? "Looking up..." : "Lookup"}
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Quick:</span>
        {EXAMPLES.map((domain) => (
          <button
            key={domain}
            type="button"
            onClick={() => quickLookup(domain)}
            disabled={loading}
            className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-emerald-600 dark:hover:text-emerald-400"
          >
            {domain}
          </button>
        ))}
      </div>

      {error && (
        <Alert variant="error" className="mt-6">{error}</Alert>
      )}

      {loading && (
        <div className="mt-8">
          <Skeleton count={5} columns={1} />
        </div>
      )}

      {result && result.records.length > 0 && !loading && (
        <div aria-live="polite" className="mt-8 space-y-6">
          <DashboardSummary
            title={result.hostname}
            status={healthScore !== null && healthScore >= 80 ? "good" : healthScore !== null && healthScore >= 50 ? "warning" : "critical"}
            mainFinding={healthScore !== null ? `DNS Health Score: ${healthScore}/100 — ${healthScore >= 80 ? "Well configured" : healthScore >= 50 ? "Needs improvement" : "Critical issues found"}` : "DNS records found"}
            riskLevel={healthScore !== null && healthScore >= 80 ? "low" : healthScore !== null && healthScore >= 50 ? "medium" : healthScore !== null ? "high" : "medium"}
            riskLabel={healthScore !== null ? `${healthScore}/100` : undefined}
            timestamp={timestamp || undefined}
            nextAction={warnings.length > 0 ? "Review health analysis below and address warnings" : "Your DNS configuration looks healthy. Run a propagation check if you recently made changes."}
          >
            <CompositeScore overall={healthScore ?? 0} subScores={checks.map(c => ({
              label: c.label.replace(" Record", ""),
              score: c.passed ? c.points : 0,
              max: 30,
            }))} size={60} />
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={allTypes.includes("A") || allTypes.includes("AAAA") ? "good" : "critical"} label={allTypes.includes("A") || allTypes.includes("AAAA") ? "A/AAAA Present" : "No A/AAAA"} />
              {allTypes.includes("MX") ? <StatusBadge status="good" label="MX Present" /> : <StatusBadge status="warning" label="No MX" />}
              {allTypes.includes("TXT") ? <StatusBadge status="good" label="TXT Present" /> : <StatusBadge status="warning" label="No TXT" />}
              {allTypes.includes("SOA") ? <StatusBadge status="good" label="SOA Present" /> : <StatusBadge status="critical" label="No SOA" />}
              {allTypes.includes("AAAA") ? <StatusBadge status="good" label="IPv6 Ready" /> : <StatusBadge status="warning" label="No IPv6" />}
            </div>
          </DashboardSummary>

          <div className="flex items-center justify-between gap-2">
            <ResultHistory toolSlug="dns-lookup" onRestore={(d) => { setResult(d as DnsResult); setTimestamp(new Date().toISOString()); }} />
            <div className="flex items-center gap-2">
              <ResultExport rawData={result} fileName={`dns-lookup-${result.hostname}`} displayName="DNS Lookup" formatAsText={formatDnsText} formatAsCsv={formatDnsCsv} />
              <CopyButton text={JSON.stringify(result, null, 2)} label="Copy all records" />
            </div>
          </div>

          {healthScore !== null && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 animate-fade-slide-up">
              <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  DNS Health Breakdown
                </h3>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {checks.map((check) => (
                  <div
                    key={check.label}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        check.passed
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {check.passed ? "✓" : "—"}
                    </span>
                    <span className="text-sm text-zinc-900 dark:text-zinc-50">{check.label}</span>
                    <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-300">+{check.points}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                DNS Records ({result.records.reduce((s, r) => s + r.values.length, 0)})
              </span>
              <div className="ml-auto flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setFilterType(null)}
                  className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                    filterType === null
                      ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  All
                </button>
                {allTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFilterType(t)}
                    className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                      filterType === t
                        ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Type
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Value
                    </th>
                    <th className="w-12 px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredRecords?.map((record) =>
                    record.values.map((val, i) => (
                      <tr
                        key={`${record.type}-${i}`}
                        className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      >
                        <td className="px-5 py-3 align-middle">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[record.type] || "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"}`}
                          >
                            {record.type}
                          </span>
                        </td>
                        <td className="max-w-xs truncate px-5 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                          {parseRecordValue(record.type, val)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <CopyButton text={val} label="" />
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {warnings.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Health Analysis
              </h3>
              {warnings.map((w) => (
                <Callout key={w.title} variant={w.variant} title={w.title}>
                  {w.message}
                </Callout>
              ))}
            </div>
          )}

          {suspicious.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">
                Suspicious Configurations
              </h3>
              {suspicious.map((msg, i) => (
                <Callout key={i} variant="warning" title="Configuration Issue">
                  {msg}
                </Callout>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
            <h3 className="mb-3 font-medium text-zinc-900 dark:text-zinc-50">What Do These Record Types Mean?</h3>
            <div className="space-y-2">
              {allTypes.map((type) => (
                <div key={type} className="flex gap-2">
                  <span className={`mt-0.5 inline-block shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[type] || "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"}`}>
                    {type}
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {RECORD_EXPLANATIONS[type] || "Custom or less common record type."}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
            <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">Understanding TTL (Time To Live)</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              TTL tells DNS resolvers how long (in seconds) they can cache a record before requesting a fresh copy.
              A short TTL (30-300s) means changes propagate quickly but resolvers make more queries. A long TTL (3600-86400s)
              reduces resolver load but means changes take hours or days to propagate. Best practice: lower TTL 48 hours
              before planned DNS changes, then raise it back afterward.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">Short (30-300s)</span>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">Fast propagation, higher query volume. Use during migration.</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">Medium (3600s)</span>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">Balanced for stable production records.</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">Long (86400s+)</span>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">Maximum caching. Use for records that rarely change.</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
            <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">Common DNS Mistakes</h3>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              {COMMON_MISTAKES.map((m, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-amber-700">&#9888;</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          {(warnings.length > 0 || suspicious.length > 0) && (
            <div className="rounded-xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
              <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">What To Do Next</h3>
              <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                {!allTypes.includes("AAAA") && (
                  <li className="flex gap-2">
                    <span className="mt-0.5 shrink-0">&#8594;</span>
                    Add AAAA records for IPv6 reachability. Use <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> to verify changes propagate.
                  </li>
                )}
                {!allTypes.includes("MX") && (
                  <li className="flex gap-2">
                    <span className="mt-0.5 shrink-0">&#8594;</span>
                    Configure MX records if this domain handles email. Use <Link href="/whois-lookup" className="text-blue-600 hover:underline dark:text-blue-400">WHOIS Lookup</Link> to verify domain ownership first.
                  </li>
                )}
                {!allTypes.includes("TXT") && (
                  <li className="flex gap-2">
                    <span className="mt-0.5 shrink-0">&#8594;</span>
                    Add SPF, DKIM, and DMARC TXT records to prevent email spoofing and improve deliverability.
                  </li>
                )}
                <li className="flex gap-2">
                  <span className="mt-0.5 shrink-0">&#8594;</span>
                  If you changed records recently, use <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> to confirm the update reached all global resolvers.
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {result && result.records.length > 0 && !loading && (
        <ToolMethodology sections={METHODOLOGY["dns-lookup"]} />
      )}
      {result && result.records.length === 0 && !loading && (
        <div className="mt-8 rounded-lg border border-zinc-200 p-8 text-center text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          No DNS records found for {result.hostname}. The domain may not exist or has no configured records.
        </div>
      )}
    </div>
  );
}
