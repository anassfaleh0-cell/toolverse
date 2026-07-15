"use client";

import { useState, useCallback } from "react";
import { Button, Input } from "@/components/ui";
import { ResultExport } from "@/components/shared";

interface AsnResponse {
  type: string;
  ip: string;
  asn?: string;
  name?: string;
  org?: string;
  error?: string;
}

export function AsnLookup() {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<AsnResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLookup() {
    const cleanIp = ip.trim();
    if (!cleanIp) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/dns?type=asn&query=${encodeURIComponent(cleanIp)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  const formatText = useCallback(() => {
    if (!result) return "";
    return `ASN Lookup Report\nIP: ${result.ip}\nASN: ${result.asn || "N/A"}\nOrganization: ${result.org || "N/A"}\nName: ${result.name || "N/A"}`;
  }, [result]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="asn-ip" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">IP Address</label>
          <Input id="asn-ip" type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="8.8.8.8" onKeyDown={(e) => { if (e.key === "Enter") handleLookup(); }} />
        </div>
        <div className="flex items-end">
          <Button onClick={handleLookup} disabled={loading || !ip.trim()}>{loading ? "Looking up..." : "Lookup"}</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300" role="alert">{error}</div>
      )}

      {result && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">ASN Info for {result.ip}</p>
              <ResultExport rawData={result} fileName={`asn-lookup-${result.ip}`} displayName={`ASN Lookup - ${result.ip}`} formatAsText={formatText} />
            </div>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {[
              { label: "IP Address", value: result.ip, mono: true },
              { label: "ASN", value: result.asn || "N/A", mono: true },
              { label: "Organization", value: result.org || "N/A" },
              { label: "Name", value: result.name || "N/A" },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{row.label}</span>
                <span className={`text-sm font-medium text-zinc-900 dark:text-zinc-50 ${row.mono ? "font-mono" : ""}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
