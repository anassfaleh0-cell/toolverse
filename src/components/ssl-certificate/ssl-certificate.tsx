"use client";

import { useState, useTransition, useCallback } from "react";
import { Input, Button, Alert, Skeleton } from "@/components/ui";
import { DashboardSummary, StatusBadge, GradeBadge, Timeline, ResultExport, ResultHistory, ToolMethodology } from "@/components/shared";
import { METHODOLOGY } from "@/lib/methodology";
import { saveResult } from "@/lib/user-storage";

interface CertInfo {
  subject: Record<string, string>;
  issuer: Record<string, string>;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  fingerprint: string;
  fingerprint256: string;
  serialNumber: string;
  subjectAltNames: string[];
  organization: string;
  country: string;
  commonName: string;
}

interface SslResult {
  host: string;
  port: number;
  certificate: CertInfo;
  tlsVersion: string | null;
}

interface GradeInfo {
  grade: string;
  label: string;
  className: string;
}

function getSecurityGrade(cert: CertInfo): GradeInfo {
  const { daysRemaining, organization } = cert;
  const hasOrg = Boolean(organization);

  if (daysRemaining > 365 && hasOrg) return { grade: "A+", label: "Excellent", className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" };
  if (daysRemaining > 30 && hasOrg) return { grade: "A", label: "Good", className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" };
  if (daysRemaining > 30 && !hasOrg) return { grade: "B", label: "Fair", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" };
  if (daysRemaining > 0 && hasOrg) return { grade: "B", label: "Fair", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" };
  if (daysRemaining > 0 && !hasOrg) return { grade: "C", label: "Warning", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" };
  if (daysRemaining === 0) return { grade: "D", label: "Expiring Today", className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" };
  return { grade: "F", label: "Expired", className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" };
}

function getSeverityClass(level: "good" | "warning" | "critical"): string {
  switch (level) {
    case "good": return "bg-green-500/20 text-green-700 dark:text-green-400";
    case "warning": return "bg-amber-500/20 text-amber-700 dark:text-amber-400";
    case "critical": return "bg-red-500/20 text-red-700 dark:text-red-400";
  }
}

function getIssuerCN(issuer: Record<string, string>): string {
  return issuer.CN || issuer.commonName || "Unknown CA";
}

function getIssuerOrg(issuer: Record<string, string>): string {
  return issuer.O || issuer.organization || "";
}

export function SslCertificateChecker() {
  const [host, setHost] = useState("");
  const [result, setResult] = useState<SslResult | null>(null);
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
      const res = await fetch(`/api/ssl-certificate?host=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to check SSL certificate");
      } else {
        startTransition(() => { setResult(json); saveResult("ssl-certificate", json); });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const formatSslText = useCallback(() => {
    if (!result) return "";
    const c = result.certificate;
    const lines = [
      `SSL Certificate Check for: ${result.host}`,
      `Generated: ${new Date().toISOString()}`,
      `TLS Version: ${result.tlsVersion || "N/A"}`,
      `Grade: ${getSecurityGrade(c).grade} â€” ${getSecurityGrade(c).label}`,
      "",
      `Common Name: ${c.commonName}`,
      `Organization: ${c.organization || "N/A"}`,
      `Country: ${c.country || "N/A"}`,
      `Valid From: ${new Date(c.validFrom).toISOString()}`,
      `Valid To: ${new Date(c.validTo).toISOString()}`,
      `Days Remaining: ${c.daysRemaining}`,
      `Issuer: ${getIssuerCN(c.issuer)}`,
      `Serial: ${c.serialNumber}`,
      `SHA1: ${c.fingerprint}`,
      `SHA256: ${c.fingerprint256}`,
      "",
      "Subject Alternative Names:",
      ...c.subjectAltNames.map((san) => `  - ${san}`),
    ];
    return lines.join("\n");
  }, [result]);

  const formatSslCsv = useCallback(() => {
    if (!result) return "";
    const c = result.certificate;
    const rows = [["Field", "Value"]];
    rows.push(["Host", result.host]);
    rows.push(["TLS Version", result.tlsVersion || ""]);
    rows.push(["Grade", getSecurityGrade(c).grade]);
    rows.push(["Common Name", c.commonName]);
    rows.push(["Organization", c.organization]);
    rows.push(["Valid From", c.validFrom]);
    rows.push(["Valid To", c.validTo]);
    rows.push(["Days Remaining", String(c.daysRemaining)]);
    rows.push(["Issuer CN", getIssuerCN(c.issuer)]);
    rows.push(["Serial Number", c.serialNumber]);
    rows.push(["SHA1", c.fingerprint]);
    rows.push(["SHA256", c.fingerprint256]);
    for (const san of c.subjectAltNames) {
      rows.push(["SAN", san]);
    }
    return rows.map((r) => r.map((c2) => `"${c2}"`).join(",")).join("\n");
  }, [result]);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="example.com"
          aria-label="Hostname"
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
          <Skeleton count={6} columns={1} />
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 space-y-6">
          <DashboardSummary
            title={result.host}
            status={result.certificate.daysRemaining > 30 ? "good" : result.certificate.daysRemaining > 0 ? "warning" : "critical"}
            mainFinding={`Grade ${getSecurityGrade(result.certificate).grade} â€” ${result.certificate.daysRemaining > 0 ? `${result.certificate.daysRemaining} days until expiry` : "CERTIFICATE EXPIRED"}`}
            riskLevel={result.certificate.daysRemaining > 30 ? "low" : result.certificate.daysRemaining > 0 ? "medium" : "critical"}
            riskLabel={getSecurityGrade(result.certificate).grade}
            nextAction={result.certificate.daysRemaining <= 0 ? "RENEW IMMEDIATELY. Your certificate is expired â€” visitors will see security warnings." : result.certificate.daysRemaining <= 30 ? "Renew within 2 weeks to avoid disruption. Some clients may already show warnings." : "Certificate is healthy. No action needed."}
          >
            <GradeBadge grade={getSecurityGrade(result.certificate).grade === "A+" ? "A+" : getSecurityGrade(result.certificate).grade === "A" ? "A" : getSecurityGrade(result.certificate).grade === "B" ? "B" : getSecurityGrade(result.certificate).grade === "C" ? "C" : getSecurityGrade(result.certificate).grade === "D" ? "D" : "F"} size={64} />
            <div className="col-span-full">
              <p className="mb-2 text-xs font-medium text-zinc-500">Certificate Validity</p>
              <Timeline events={[
                { date: new Date(result.certificate.validFrom).toLocaleDateString(), label: "Issued", type: "past" as const },
                { date: new Date().toLocaleDateString(), label: "Today", type: "present" as const },
                { date: new Date(result.certificate.validTo).toLocaleDateString(), label: result.certificate.daysRemaining <= 0 ? "Expired" : "Expires", type: (result.certificate.daysRemaining < 90 ? "warning" : "future") as "warning" | "future" },
              ]} />
            </div>
            <StatusBadge status={result.tlsVersion?.includes("1.3") ? "good" : result.tlsVersion ? "warning" : "critical"} label={result.tlsVersion || "Unknown"} />
          </DashboardSummary>

          <div className="flex items-center justify-between gap-2">
            <ResultHistory toolSlug="ssl-certificate" onRestore={(d) => { setResult(d as SslResult); }} />
            <ResultExport rawData={result} fileName={`ssl-certificate-${result.host}`} displayName="SSL Certificate" formatAsText={formatSslText} formatAsCsv={formatSslCsv} />
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Security Grade
                </p>
                <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${getSecurityGrade(result.certificate).className}`}>
                  {getSecurityGrade(result.certificate).grade} â€” {getSecurityGrade(result.certificate).label}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Certificate Chain
              </p>
            </div>
            <div className="px-5 py-4 font-mono text-sm leading-relaxed">
              <div className="flex flex-col gap-1 text-zinc-600 dark:text-zinc-400">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Root CA
                  {getIssuerOrg(result.certificate.issuer) && (
                    <span className="ml-1 text-zinc-600 dark:text-zinc-400">
                      ({getIssuerOrg(result.certificate.issuer)})
                    </span>
                  )}
                </span>
                <span className="ml-6 text-zinc-500 dark:text-zinc-400">
                  â””â”€ Intermediate CA
                  <span className="ml-1 text-zinc-600 dark:text-zinc-400">
                    ({getIssuerCN(result.certificate.issuer)})
                  </span>
                </span>
                <span className="ml-12 text-zinc-700 dark:text-zinc-300 font-semibold">
                  â””â”€ {result.certificate.commonName}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Certificate Details
              </p>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">Valid From</span>
                <span className="text-zinc-600 dark:text-zinc-400">{formatDate(result.certificate.validFrom)}</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">Valid To</span>
                <span className="text-zinc-600 dark:text-zinc-400">{formatDate(result.certificate.validTo)}</span>
              </div>
              {Object.entries(result.certificate.issuer).map(([key, val]) => (
                <div key={`issuer-${key}`} className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">Issuer {key}</span>
                  <span className="text-zinc-600 dark:text-zinc-400">{val}</span>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">Serial Number</span>
                <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{result.certificate.serialNumber}</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">SHA1 Fingerprint</span>
                <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{result.certificate.fingerprint}</span>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">SHA256 Fingerprint</span>
                <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{result.certificate.fingerprint256}</span>
              </div>
            </div>
          </div>

          {result.certificate.subjectAltNames.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Subject Alternative Names ({result.certificate.subjectAltNames.length})
                </p>
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${getSeverityClass(
                  result.certificate.subjectAltNames.length > 0 ? "good" : "warning"
                )}`}>
                  {result.certificate.subjectAltNames.length > 0 ? "Covered" : "None"}
                </span>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {result.certificate.subjectAltNames.map((san, i) => (
                  <div key={i} className="px-5 py-3 font-mono text-sm text-zinc-600 dark:text-zinc-400">
                    {san}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                What This Means
              </p>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm text-zinc-600 dark:text-zinc-400">
              <p>
                {result.certificate.daysRemaining > 30
                  ? `This certificate is valid and in good standing with ${result.certificate.daysRemaining} days remaining before expiration.`
                  : result.certificate.daysRemaining > 0
                    ? `This certificate expires in ${result.certificate.daysRemaining} days. Consider renewing it soon to avoid service disruption.`
                    : result.certificate.daysRemaining === 0
                      ? "This certificate expires today. Renew it immediately to prevent browser security warnings."
                      : `This certificate expired ${Math.abs(result.certificate.daysRemaining)} days ago. Connections to this site may show security warnings.`}
              </p>
              <p>
                {result.certificate.issuer.CN
                  ? `The certificate was issued by ${getIssuerCN(result.certificate.issuer)}, a Certificate Authority that verified the identity of the domain owner.`
                  : `The certificate has limited issuer information, which may indicate a self-signed or less rigorously verified certificate.`}
                {result.certificate.organization && ` The organization "${result.certificate.organization}" has been verified as the certificate holder.`}
              </p>
              <p>
                {result.certificate.subjectAltNames.length > 0
                  ? `This certificate covers ${result.certificate.subjectAltNames.length} domain name${result.certificate.subjectAltNames.length === 1 ? "" : "s"}, including ${result.certificate.subjectAltNames.slice(0, 3).join(", ")}${result.certificate.subjectAltNames.length > 3 ? `, and ${result.certificate.subjectAltNames.length - 3} more` : ""}.`
                  : "This certificate does not list any Subject Alternative Names beyond its common name."}
              </p>
            </div>
          </div>
        </div>
      )}
      {result && !loading && (
        <ToolMethodology sections={METHODOLOGY["ssl-certificate"]} />
      )}
    </div>
  );
}
