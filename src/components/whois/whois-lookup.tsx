"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
import { Input, Button, Alert, Skeleton } from "@/components/ui";
import { CopyButton, DashboardSummary, ExpiryBar, Timeline, ResultExport, ResultHistory, ToolMethodology } from "@/components/shared";
import { METHODOLOGY } from "@/lib/methodology";
import { saveResult } from "@/lib/user-storage";

interface WhoisResult {
  domain: string;
  data: string;
}

function parseWhoisData(raw: string): { label: string; value: string }[] {
  const lines = raw.split("\n");
  const fields: { label: string; value: string }[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const label = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (!label || !value || label.startsWith("%") || label.startsWith(">")) continue;
    if (seen.has(label)) continue;
    seen.add(label);
    fields.push({ label, value });
  }

  return fields;
}

export function WhoisLookup() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<WhoisResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = domain.trim().toLowerCase();
    if (!trimmed) return;

    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!domainRegex.test(trimmed)) {
      setError("Enter a valid domain name (e.g., example.com)");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/whois?domain=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to fetch WHOIS data");
      } else {
        startTransition(() => {
          setResult(json);
          saveResult("whois", json);
        });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const formatWhoisText = useCallback(() => {
    if (!result) return "";
    const parsed = parseWhoisData(result.data);
    const lines = [
      `WHOIS Lookup Results for: ${result.domain}`,
      `Generated: ${new Date().toISOString()}`,
      "",
      ...parsed.map((f) => `${f.label}: ${f.value}`),
      "",
      "--- Raw WHOIS Data ---",
      result.data,
    ];
    return lines.join("\n");
  }, [result]);

  const formatWhoisCsv = useCallback(() => {
    if (!result) return "";
    const parsed = parseWhoisData(result.data);
    const rows = [["Field", "Value"]];
    for (const f of parsed) {
      rows.push([f.label, f.value.replace(/"/g, '""')]);
    }
    return rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  }, [result]);

  const fields = result ? parseWhoisData(result.data) : [];
  const [now] = useState(() => Date.now());

  function findField(label: string): string | undefined {
    return fields.find((f) => f.label.toLowerCase() === label.toLowerCase())?.value;
  }

  function parseDate(raw: string): Date | null {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  }

  const createdDate = findField("creation_date") || findField("created date") || findField("created") || findField("domain created");
  const expiryDate = findField("expiration_date") || findField("expiry date") || findField("registry expiry date") || findField("registrar registration expiration date");
  const registrar = findField("registrar") || findField("sponsoring registrar");

  const { domainAge, daysUntilExpiry } = useMemo(() => {
    let age: string | null = null;
    let expiry: number | null = null;

    if (createdDate) {
      const parsed = parseDate(createdDate);
      if (parsed) {
        const ageMs = now - parsed.getTime();
        const days = Math.floor(ageMs / (1000 * 60 * 60 * 24));
        const years = Math.floor(days / 365);
        const remainingDays = days % 365;
        age = `${years}y ${remainingDays}d`;
      }
    }

    if (expiryDate) {
      const parsed = parseDate(expiryDate);
      if (parsed) {
        expiry = Math.ceil((parsed.getTime() - now) / (1000 * 60 * 60 * 24));
      }
    }

    return { domainAge: age, daysUntilExpiry: expiry };
  }, [createdDate, expiryDate, now]);

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          aria-label="Domain name"
        />
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
        >
          {loading ? "Looking up..." : "Lookup"}
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

      {result && fields.length > 0 && !loading && (
        <div aria-live="polite" className="mt-8 space-y-6">
          <DashboardSummary
            title={result.domain}
            status={daysUntilExpiry !== null && daysUntilExpiry > 90 ? "good" : daysUntilExpiry !== null && daysUntilExpiry > 0 ? "warning" : "critical"}
            mainFinding={daysUntilExpiry !== null && daysUntilExpiry > 90 ? "Domain is active with plenty of time until expiry" : daysUntilExpiry !== null && daysUntilExpiry > 0 ? `Domain expires in ${daysUntilExpiry} days — renew soon` : daysUntilExpiry !== null ? "Domain has expired or expires today" : "WHOIS data retrieved"}
            riskLevel={daysUntilExpiry !== null && daysUntilExpiry > 90 ? "low" : daysUntilExpiry !== null && daysUntilExpiry > 0 ? "medium" : daysUntilExpiry !== null ? "critical" : "medium"}
            nextAction={daysUntilExpiry !== null && daysUntilExpiry < 90 ? "Renew your domain as soon as possible to avoid service disruption or loss of the domain." : "Your domain registration looks healthy. No immediate action needed."}
          >
            {domainAge && <div className="text-center"><p className="text-xs text-zinc-500">Domain Age</p><p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{domainAge}</p></div>}
            {daysUntilExpiry !== null && <ExpiryBar daysRemaining={daysUntilExpiry} />}
            {registrar && <div className="text-center"><p className="text-xs text-zinc-500">Registrar</p><p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{registrar}</p></div>}
            <div className="col-span-full">
              <p className="mb-2 text-xs font-medium text-zinc-500">Domain Lifecycle</p>
              <Timeline events={[
                ...(createdDate ? [{ date: new Date(createdDate).toLocaleDateString(), label: "Registered", type: "past" as const }] : []),
                { date: new Date().toLocaleDateString(), label: "Today", type: "present" as const },
                ...(expiryDate ? [{ date: new Date(expiryDate).toLocaleDateString(), label: daysUntilExpiry !== null && daysUntilExpiry < 0 ? "Expired" : "Expires", type: (daysUntilExpiry !== null && daysUntilExpiry < 90 ? "warning" : "future") as "warning" | "future" }] : []),
              ]} />
            </div>
          </DashboardSummary>
          <div className="flex items-center justify-between gap-2">
            <ResultHistory toolSlug="whois" onRestore={(d) => { setResult(d as WhoisResult); }} />
            <ResultExport rawData={result} fileName={`whois-${result.domain}`} displayName="WHOIS Lookup" formatAsText={formatWhoisText} formatAsCsv={formatWhoisCsv} />
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                WHOIS Data for {result.domain}
              </p>
              <CopyButton text={result.data} label="Copy raw" />
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {fields.map((field) => (
                <div
                  key={field.label}
                  className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {field.label}
                  </span>
                  <span className="break-words text-zinc-600 dark:text-zinc-400">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {result && fields.length > 0 && !loading && (
        <ToolMethodology sections={METHODOLOGY["whois"]} />
      )}
      {result && fields.length === 0 && !loading && (
        <div className="mt-8 rounded-lg border border-zinc-200 p-6 text-center text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <pre className="whitespace-pre-wrap break-words text-left text-xs">
            {result.data}
          </pre>
        </div>
      )}
    </div>
  );
}
