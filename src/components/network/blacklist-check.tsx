"use client";

import { useState, useCallback } from "react";
import { Button, Input } from "@/components/ui";
import { ResultExport } from "@/components/shared";

interface BlacklistResult {
  name: string;
  host: string;
  listed: boolean;
}

interface BlacklistResponse {
  type: string;
  ip: string;
  listedCount: number;
  total: number;
  listed: BlacklistResult[];
  results: BlacklistResult[];
}

export function BlacklistCheck() {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<BlacklistResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck() {
    const cleanIp = ip.trim();
    if (!cleanIp) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/dns?type=blacklist&query=${encodeURIComponent(cleanIp)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check failed");
    } finally {
      setLoading(false);
    }
  }

  const formatText = useCallback(() => {
    if (!result) return "";
    const lines = [`Blacklist Check Report`, `IP: ${result.ip}`, `Blacklisted on ${result.listedCount} of ${result.total} DNSBLs`, ""];
    result.results.forEach((r) => lines.push(`${r.listed ? "â˜’" : "â˜"} ${r.name}: ${r.listed ? "LISTED" : "Clean"}`));
    return lines.join("\n");
  }, [result]);

  const formatCsv = useCallback(() => {
    if (!result) return "";
    return `"IP","DNSBL","Status"\n${result.results.map((r) => `"${result.ip}","${r.name}","${r.listed ? "Listed" : "Clean"}"`).join("\n")}`;
  }, [result]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="bl-ip" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">IP Address</label>
          <Input id="bl-ip" type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.1" onKeyDown={(e) => { if (e.key === "Enter") handleCheck(); }} />
        </div>
        <div className="flex items-end">
          <Button onClick={handleCheck} disabled={loading || !ip.trim()}>{loading ? "Checking..." : "Check Blacklists"}</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300" role="alert">{error}</div>
      )}

      {result && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Blacklist Report for {result.ip}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className={`text-2xl font-bold ${result.listedCount === 0 ? "text-green-700" : "text-red-700"}`}>{result.listedCount}</span>
                  <span className="text-sm text-zinc-500">of {result.total} DNSBLs</span>
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${result.listedCount === 0 ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}>
                    {result.listedCount === 0 ? "Clean" : "Listed"}
                  </span>
                </div>
              </div>
              <ResultExport rawData={result} fileName={`blacklist-check-${result.ip}`} displayName={`Blacklist Check - ${result.ip}`} formatAsText={formatText} formatAsCsv={formatCsv} />
            </div>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {result.results.map((bl, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${bl.listed ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"}`}>
                    {bl.listed ? "!" : "âœ“"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{bl.name}</p>
                    <p className="text-xs text-zinc-500">{bl.host}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${bl.listed ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                  {bl.listed ? "LISTED" : "Clean"}
                </span>
              </div>
            ))}
          </div>
          {result.listedCount > 0 && (
            <div className="border-t border-zinc-200 bg-red-50 px-5 py-3 dark:border-zinc-800 dark:bg-red-950">
              <p className="text-xs text-red-700 dark:text-red-300">
                Your IP is listed on {result.listedCount} blacklist{result.listedCount !== 1 ? "s" : ""}. 
                This may affect email deliverability. Check our Email Deliverability Checker for a full audit.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
