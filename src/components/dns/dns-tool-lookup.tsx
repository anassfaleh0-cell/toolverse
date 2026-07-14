"use client";

import { useState, useCallback, useMemo } from "react";
import { Button, Input } from "@/components/ui";
import { ResultExport, AIExplanationCard } from "@/components/shared";
import { Icon } from "@/components/shared/icon";

interface BatchResult { input: string; output: Record<string, unknown> }
interface NameserverInfo { hostname: string; ips: string[]; reachable: boolean }
interface DnsResult { type?: string; domain?: string; signed?: boolean; records?: string[]; nameservers?: NameserverInfo[]; dnskeys?: string[]; dsRecords?: string[]; issues?: string[]; score?: number; spf?: string[]; dkim?: string[]; dmarc?: string[]; mx?: string[]; ptr?: string[]; error?: string }

interface DnsToolLookupProps {
  lookupType: string;
  title: string;
  description: string;
  placeholder?: string;
  beginnerGuide?: { title: string; content: string }[];
  extraFields?: { label: string; key: string; placeholder: string }[];
}

export function DnsToolLookup({ lookupType, title, description, placeholder, beginnerGuide, extraFields }: DnsToolLookupProps) {
  const [domain, setDomain] = useState("");
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [result, setResult] = useState<DnsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBeginner, setShowBeginner] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [batchText, setBatchText] = useState("");
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  async function handleLookup() {
    const cleanDomain = domain.trim().toLowerCase();
    if (!cleanDomain) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const params = new URLSearchParams({ type: lookupType, domain: cleanDomain });
      for (const [k, v] of Object.entries(extra)) { if (v) params.set(k, v); }
      const res = await fetch(`/api/dns?${params}`);
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
    return JSON.stringify(result, null, 2);
  }, [result]);

  const formatCsv = useCallback(() => {
    if (!result) return "";
    return JSON.stringify(result);
  }, [result]);

  const resultsArray = useMemo(() => {
    if (!result) return [];
    if (result.records) return result.records;
    if (result.nameservers) return (result.nameservers as NameserverInfo[]).map((n) => `${n.hostname} (${n.ips.join(", ") || "unreachable"})`);
    if (result.dnskeys) return result.dnskeys;
    if (result.dsRecords) return result.dsRecords;
    if (result.issues) return result.issues;
    return [];
  }, [result]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Domain</label>
          <Input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder={placeholder || "example.com"} onKeyDown={(e) => { if (e.key === "Enter") handleLookup(); }} />
        </div>
        {extraFields?.map((f) => (
          <div key={f.key} className="sm:w-48">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{f.label}</label>
            <Input type="text" value={extra[f.key] || ""} onChange={(e) => setExtra({ ...extra, [f.key]: e.target.value })} placeholder={f.placeholder} onKeyDown={(e) => { if (e.key === "Enter") handleLookup(); }} />
          </div>
        ))}
        <div className="flex items-end">
          <Button onClick={handleLookup} disabled={loading || !domain.trim()}>{loading ? "Loading..." : "Lookup"}</Button>
        </div>
      </div>

      <button type="button" onClick={() => setShowBatch(!showBatch)} className="self-start text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400" aria-expanded={showBatch}>
        {showBatch ? "Hide" : "Show"} batch mode
      </button>

      {showBatch && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Batch Mode — one per line</p>
          </div>
          <div className="space-y-3 px-5 py-4">
            <textarea
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              rows={4}
              placeholder={"example.com\ngmail.com\ngithub.com"}
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              aria-label="Batch input — one domain per line"
            />
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  const items = batchText.trim().split("\n").map((s) => s.trim()).filter(Boolean);
                  if (items.length === 0) return;
                  setBatchLoading(true);
                  setBatchProgress(0);
                  const results: BatchResult[] = [];
                  for (let i = 0; i < items.length; i++) {
                    try {
                      const params = new URLSearchParams({ type: lookupType, domain: items[i] });
                      for (const [k, v] of Object.entries(extra)) { if (v) params.set(k, v); }
                      const res = await fetch(`/api/dns?${params}`);
                      const data = await res.json();
                      results.push({ input: items[i], output: res.ok ? data : { error: data.error } });
                    } catch { results.push({ input: items[i], output: { error: "Request failed" } }); }
                    setBatchProgress(i + 1);
                  }
                  setBatchResults(results);
                  setBatchLoading(false);
                }}
                disabled={batchLoading || !batchText.trim()}
              >
                {batchLoading ? `Batch ${batchProgress}/${batchText.trim().split("\n").filter(Boolean).length}` : `Run Batch`}
              </Button>
              {batchLoading && (
                <div className="flex items-center gap-2" role="progressbar" aria-valuenow={batchProgress} aria-valuemin={0} aria-valuemax={batchText.trim().split("\n").filter(Boolean).length}>
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${(batchProgress / Math.max(1, batchText.trim().split("\n").filter(Boolean).length)) * 100}%` }} />
                  </div>
                  <span className="text-xs text-zinc-500">{batchProgress}</span>
                </div>
              )}
            </div>
            {batchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                {batchResults.map((r, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-zinc-200 px-3 py-2 text-xs last:border-b-0 dark:border-zinc-800">
                    <span className="font-mono text-zinc-900 dark:text-zinc-50">{r.input}</span>
                    <span className={(r.output as Record<string, unknown>).error ? "text-red-500" : "text-green-500"}>{(r.output as Record<string, unknown>).error as string || "OK"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {beginnerGuide && beginnerGuide.length > 0 && (
          <button type="button" onClick={() => setShowBeginner(!showBeginner)} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {showBeginner ? "Hide" : "Show"} beginner guide
          </button>
        )}
        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
          {showAdvanced ? "Hide" : "Show"} raw response
        </button>
      </div>

      {showBeginner && beginnerGuide && beginnerGuide.length > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-800 dark:bg-blue-950">
          <div className="space-y-2">
            {beginnerGuide.map((g, i) => (
              <details key={i} className="group">
                <summary className="cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">{g.title}</summary>
                <p className="mt-1 pl-4 text-sm text-blue-800 dark:text-blue-200">{g.content}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      {showAdvanced && result && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">API Response</p>
          <pre className="overflow-x-auto text-xs text-zinc-600 dark:text-zinc-400">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300" role="alert">{error}</div>
      )}

      {result && (<>
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{result.type} for {result.domain}</p>
                <p className="mt-0.5 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{resultsArray.length}</p>
                <p className="text-xs text-zinc-500">{resultsArray.length === 1 ? "result" : "results"}</p>
              </div>
              {result && (
                <ResultExport
                  rawData={result}
                  fileName={`${lookupType}-${result.domain}`}
                  displayName={`${title} - ${result.domain}`}
                  formatAsText={formatText}
                  formatAsCsv={formatCsv}
                />
              )}
            </div>
          </div>

          {result.issues && result.issues.length > 0 && (
            <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
              <div className="space-y-1.5">
                {result.issues.map((issue: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
                    <span className="mt-0.5 shrink-0">!</span>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {result.nameservers ? (
              (result.nameservers as NameserverInfo[]).map((ns, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`size-2 rounded-full ${ns.reachable ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="font-mono text-sm text-zinc-900 dark:text-zinc-50">{ns.hostname}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{ns.ips.join(", ") || "Unreachable"}</span>
                </div>
              ))
            ) : result.records ? (
              result.records.map((rec: string, i: number) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <pre className="flex-1 overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm text-zinc-900 dark:text-zinc-50">{rec}</pre>
                  <button type="button" onClick={() => navigator.clipboard.writeText(rec)} className="ml-2 shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Copy">
                    <Icon name="Copy" className="size-4" />
                  </button>
                </div>
              ))
            ) : result.dnskeys ? (
              <>
                <div className="px-5 py-3">
                  <p className="text-xs font-medium text-zinc-500">DNSKEY Records</p>
                  {result.dnskeys.map((k: string, i: number) => <pre key={i} className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-50">{k}</pre>)}
                </div>
                <div className="px-5 py-3">
                  <p className="text-xs font-medium text-zinc-500">DS Records</p>
                  {result.dsRecords && result.dsRecords.length === 0 ? <p className="mt-1 text-sm text-zinc-400">No DS records in parent zone</p> : result.dsRecords?.map((d: string, i: number) => <pre key={i} className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-50">{d}</pre>)}
                </div>
                <div className="px-5 py-3">
                  <p className="text-xs font-medium text-zinc-500">DNSSEC Status</p>
                  <p className={`mt-1 text-sm font-semibold ${result.signed ? "text-green-600" : "text-red-600"}`}>{result.signed ? "Zone is signed" : "Zone is NOT signed"}</p>
                </div>
              </>
            ) : result.score !== undefined ? (
              <>
                <div className="px-5 py-4">
                  <p className="text-xs font-medium text-zinc-500">Deliverability Score</p>
                  <p className={`mt-1 text-3xl font-bold ${result.score >= 70 ? "text-green-600" : result.score >= 40 ? "text-amber-600" : "text-red-600"}`}>{result.score}/100</p>
                </div>
                <div className="grid grid-cols-2 gap-4 px-5 py-4">
                  <div><p className="text-xs text-zinc-500">SPF</p><p className={`font-medium ${result.spf?.length ? "text-green-600" : "text-red-600"}`}>{result.spf?.length ? "Found" : "Missing"}</p></div>
                  <div><p className="text-xs text-zinc-500">DKIM</p><p className={`font-medium ${result.dkim?.length ? "text-green-600" : "text-amber-600"}`}>{result.dkim?.length ? "Found" : "Not found"}</p></div>
                  <div><p className="text-xs text-zinc-500">DMARC</p><p className={`font-medium ${result.dmarc?.length ? "text-green-600" : "text-red-600"}`}>{result.dmarc?.length ? "Found" : "Missing"}</p></div>
                  <div><p className="text-xs text-zinc-500">MX</p><p className={`font-medium ${result.mx?.length ? "text-green-600" : "text-red-600"}`}>{result.mx?.length ? "Found" : "Missing"}</p></div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs font-medium text-zinc-500">PTR Record</p>
                  <p className={`mt-1 text-sm ${result.ptr?.length ? "text-green-600" : "text-amber-600"}`}>{result.ptr?.length ? "Valid PTR record found" : "No PTR record"}</p>
                </div>
              </>
            ) : null}

            {result.records !== undefined && result.records.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-zinc-500">No records found.</div>
            )}
          </div>
        </div>

          {result.issues && result.issues.length > 0 && (
            <div className="mt-5">
              <AIExplanationCard
                toolName={lookupType}
                toolCategory="network-internet"
                result={{
                  status: "warn",
                  issues: result.issues.map((i: string) => ({ severity: "warning" as const, message: i })),
                }}
              />
            </div>
          )}
        </>)}
    </div>
  );
}
