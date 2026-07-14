"use client";

import { useState, useTransition, useCallback } from "react";
import { Input, Button, Alert, Card, Skeleton } from "@/components/ui";
import { CopyButton, DashboardSummary, StatusBadge, GradeBadge, computeSecurityGrade, CompositeScore, ResultExport, ResultHistory, ToolMethodology } from "@/components/shared";
import { METHODOLOGY } from "@/lib/methodology";
import { saveResult } from "@/lib/user-storage";

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

export const SECURITY_HEADERS = [
  { name: "strict-transport-security", label: "HTTP Strict Transport Security (HSTS)", why: "Enforces HTTPS connections, preventing downgrade attacks." },
  { name: "x-frame-options", label: "X-Frame-Options", why: "Prevents clickjacking by controlling iframe embedding." },
  { name: "x-content-type-options", label: "X-Content-Type-Options", why: "Prevents MIME sniffing, reducing XSS risk." },
  { name: "content-security-policy", label: "Content Security Policy (CSP)", why: "Restricts script/style sources to mitigate XSS and data injection." },
  { name: "referrer-policy", label: "Referrer-Policy", why: "Controls how much referrer information is shared cross-origin." },
  { name: "permissions-policy", label: "Permissions-Policy", why: "Limits access to browser APIs like camera, microphone, and geolocation." },
];

function auditSecurityHeaders(headers: Record<string, string>): { name: string; label: string; why: string; present: boolean }[] {
  const keys = Object.keys(headers).map((k) => k.toLowerCase());
  return SECURITY_HEADERS.map((h) => ({
    ...h,
    present: keys.includes(h.name),
  }));
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
        startTransition(() => { setResult(json); saveResult("http-headers", json); });
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

  const formatHeadersText = useCallback(() => {
    if (!result) return "";
    const lines = [
      `HTTP Headers for: ${result.url}`,
      `Generated: ${new Date().toISOString()}`,
      `Status: ${result.statusCode} ${result.statusText}`,
      `Response Time: ${result.responseTime}ms`,
      `TLS Version: ${result.tlsVersion || "N/A"}`,
      "",
      "--- Response Headers ---",
      ...Object.entries(result.headers).map(([k, v]) => `${k}: ${v}`),
    ];
    if (result.redirectChain.length > 0) {
      lines.push("", "--- Redirect Chain ---");
      for (const hop of result.redirectChain) {
        lines.push(`  ${hop.status} ${hop.url}`);
      }
    }
    return lines.join("\n");
  }, [result]);

  const formatHeadersCsv = useCallback(() => {
    if (!result) return "";
    const rows = [["Header", "Value"]];
    for (const [k, v] of Object.entries(result.headers)) {
      rows.push([k, v.replace(/"/g, '""')]);
    }
    return rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  }, [result]);

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://example.com"
          aria-label="URL"
        />
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
          <Skeleton count={8} columns={1} />
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 space-y-6">
          {(() => {
            const audit = auditSecurityHeaders(result.headers);
            const present = audit.filter((h) => h.present).length;
            const secScore = Math.round((present / audit.length) * 100);
            const { grade } = computeSecurityGrade(present, audit.length);
            return (
              <DashboardSummary
                title={new URL(result.finalUrl).hostname}
                status={secScore >= 66 ? "good" : secScore >= 33 ? "warning" : "critical"}
                mainFinding={`${result.statusCode} ${result.statusText} — Grade ${grade} (${present}/${audit.length} headers)`}
                riskLevel={secScore >= 66 ? "low" : secScore >= 33 ? "medium" : "high"}
                riskLabel={grade}
                nextAction={present < audit.length ? `Add ${audit.length - present} missing security header${audit.length - present > 1 ? "s" : ""}. Start with HSTS and Content-Security-Policy.` : "Good security posture. Maintain with regular audits."}
              >
                <GradeBadge grade={grade} size={64} />
                <CompositeScore overall={secScore} subScores={[
                  { label: "HSTS", score: audit.find(h => h.name === "strict-transport-security")?.present ? 100 : 0 },
                  { label: "CSP", score: audit.find(h => h.name === "content-security-policy")?.present ? 100 : 0 },
                  { label: "XFO", score: audit.find(h => h.name === "x-frame-options")?.present ? 100 : 0 },
                  { label: "Other", score: Math.round((present / audit.length) * 100) },
                ]} size={60} />
                <StatusBadge status={result.tlsVersion?.includes("1.3") ? "good" : result.tlsVersion ? "warning" : "critical"} label={result.tlsVersion || "No TLS"} />
              </DashboardSummary>
            );
          })()}

          <div className="flex flex-wrap gap-4">
            <Card variant="default" className="p-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Status</p>
              <span className={`mt-1 inline-block rounded-md px-2.5 py-0.5 text-sm font-semibold ${statusColor(result.statusCode)}`}>
                {result.statusCode} {result.statusText}
              </span>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Response Time</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.responseTime}ms
              </p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Final URL</p>
              <p className="mt-1 max-w-xs truncate text-sm text-zinc-900 dark:text-zinc-50">
                {result.finalUrl}
              </p>
            </Card>
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

          <div className="flex items-center justify-between gap-2">
            <ResultHistory toolSlug="http-headers" onRestore={(d) => { setResult(d as HeadersResult); }} />
            <ResultExport rawData={result} fileName={`http-headers-${new URL(result.url).hostname}`} displayName="HTTP Headers" formatAsText={formatHeadersText} formatAsCsv={formatHeadersCsv} />
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Response Headers ({Object.keys(result.headers).length})
              </p>
              <CopyButton text={JSON.stringify(result.headers, null, 2)} label="Copy" />
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

          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Security Headers Audit
            </p>
            <div className="space-y-2">
              {auditSecurityHeaders(result.headers).map((h) => (
                <div key={h.name} className="flex items-start gap-3 text-sm">
                  {h.present ? (
                    <span className="mt-0.5 shrink-0 text-emerald-500">&#10003;</span>
                  ) : (
                    <span className="mt-0.5 shrink-0 text-red-500">&#10007;</span>
                  )}
                  <div>
                    <p className={h.present ? "text-zinc-900 dark:text-zinc-50" : "text-red-600 dark:text-red-400"}>
                      {h.label}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{h.why}</p>
                    {!h.present && (
                      <p className="mt-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">Missing</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {result && !loading && (
        <ToolMethodology sections={METHODOLOGY["http-headers"]} />
      )}
    </div>
  );
}
