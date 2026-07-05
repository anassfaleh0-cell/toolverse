"use client";

import { useState, useTransition } from "react";

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
        startTransition(() => setResult(json));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

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
        <div className="mt-8 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className={`h-4 flex-1 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 ${i % 2 === 0 ? "w-2/3" : "w-1/2"}`} />
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Common Name</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {result.certificate.commonName}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Days Remaining</p>
              <p className={`mt-1 text-sm font-semibold ${
                result.certificate.daysRemaining <= 0 ? "text-red-600 dark:text-red-400" :
                result.certificate.daysRemaining <= 30 ? "text-amber-600 dark:text-amber-400" :
                "text-green-600 dark:text-green-400"
              }`}>
                {result.certificate.daysRemaining > 0 ? `${result.certificate.daysRemaining} days` : "Expired"}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Organization</p>
              <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                {result.certificate.organization || "N/A"}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
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
              <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Subject Alternative Names ({result.certificate.subjectAltNames.length})
                </p>
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
        </div>
      )}
    </div>
  );
}
