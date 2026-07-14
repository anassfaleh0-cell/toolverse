"use client";

import { useState, useMemo } from "react";
import { Input, Button, Alert } from "@/components/ui";
import { CompareResults, ResultExport } from "@/components/shared";

interface DnsRecord {
  type: string;
  values: string[];
}

interface DnsResult {
  hostname: string;
  records: DnsRecord[];
}

export default function CompareDnsPage() {
  const [leftDomain, setLeftDomain] = useState("");
  const [rightDomain, setRightDomain] = useState("");
  const [leftResult, setLeftResult] = useState<DnsResult | null>(null);
  const [rightResult, setRightResult] = useState<DnsResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    if (!leftDomain.trim() || !rightDomain.trim()) return;

    setLoading(true);
    setError("");

    try {
      const [leftRes, rightRes] = await Promise.all([
        fetch(`/api/dns-lookup?hostname=${encodeURIComponent(leftDomain.trim().toLowerCase())}`),
        fetch(`/api/dns-lookup?hostname=${encodeURIComponent(rightDomain.trim().toLowerCase())}`),
      ]);
      const left = await leftRes.json();
      const right = await rightRes.json();
      if (!leftRes.ok || left.error) throw new Error(left.error || "Left lookup failed");
      if (!rightRes.ok || right.error) throw new Error(right.error || "Right lookup failed");
      setLeftResult(left);
      setRightResult(right);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compare failed");
    } finally {
      setLoading(false);
    }
  }

  const compareFields = useMemo(() => {
    if (!leftResult || !rightResult) return [];
    const leftTypes = new Map(leftResult.records.map((r) => [r.type, r.values]));
    const rightTypes = new Map(rightResult.records.map((r) => [r.type, r.values]));
    const allTypes = [...new Set([...leftTypes.keys(), ...rightTypes.keys()])].sort();

    return allTypes.map((type) => {
      const leftVals = (leftTypes.get(type) || []).join("; ");
      const rightVals = (rightTypes.get(type) || []).join("; ");
      return {
        label: type,
        left: leftVals || "â€”",
        right: rightVals || "â€”",
        diff: leftVals !== rightVals,
      };
    });
  }, [leftResult, rightResult]);

  const formatCompareText = () => {
    if (!leftResult || !rightResult) return "";
    const lines = [
      `DNS Comparison: ${leftResult.hostname} vs ${rightResult.hostname}`,
      `Generated: ${new Date().toISOString()}`,
      "",
      ...compareFields.map((f) => `[${f.diff ? "DIFF" : "SAME"}] ${f.label}: ${f.left} | ${f.right}`),
    ];
    return lines.join("\n");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">Compare</p>
      <h1 className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Compare DNS Records
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Enter two domains to compare their DNS records side by side.
      </p>

      <form onSubmit={handleCompare} className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <Input
          type="text"
          value={leftDomain}
          onChange={(e) => setLeftDomain(e.target.value)}
          placeholder="example.com"
          aria-label="First domain"
        />
        <div className="flex items-center justify-center text-sm font-medium text-zinc-600">vs</div>
        <Input
          type="text"
          value={rightDomain}
          onChange={(e) => setRightDomain(e.target.value)}
          placeholder="google.com"
          aria-label="Second domain"
        />
        <div className="sm:col-span-3">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Comparing..." : "Compare"}
          </Button>
        </div>
      </form>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {leftResult && rightResult && compareFields.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              {compareFields.filter((f) => f.diff).length} differences found
            </p>
            <ResultExport rawData={{ left: leftResult, right: rightResult }} fileName={`dns-compare-${leftResult.hostname}-vs-${rightResult.hostname}`} displayName="DNS Compare" formatAsText={formatCompareText} />
          </div>
          <CompareResults
            title={`${leftResult.hostname} vs ${rightResult.hostname}`}
            leftLabel={leftResult.hostname}
            rightLabel={rightResult.hostname}
            fields={compareFields}
          />
        </div>
      )}
    </div>
  );
}
