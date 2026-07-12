"use client";

import { useState } from "react";
import { Button, Alert, Card } from "@/components/ui";

interface DomainResult {
  domain: string;
  score: number;
  scoreInteger: number;
  rank: number | null;
  source: string;
  updated: string;
  note?: string;
}

export function DomainStrength() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<DomainResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = domain.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/tools/domain-strength?domain=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to fetch domain strength");
      } else {
        setResult(json);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function scoreColor(score: number) {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-emerald-500";
    if (score >= 4) return "bg-amber-500";
    if (score >= 2) return "bg-orange-500";
    return "bg-red-500";
  }

  function scoreLabel(score: number) {
    if (score >= 8) return "Very Strong";
    if (score >= 6) return "Strong";
    if (score >= 4) return "Moderate";
    if (score >= 2) return "Weak";
    return "Very Weak";
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          aria-label="Domain name"
          className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
        />
        <Button type="submit" disabled={loading} variant="primary">
          {loading ? "Checking..." : "Check Strength"}
        </Button>
      </form>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {loading && (
        <div className="mt-8 space-y-4">
          <div className="h-6 w-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-3/4 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        </div>
      )}

      {result && !loading && (
        <div className="mt-8">
          <Card variant="default" className="p-8">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Domain Authority Score
              </p>
              <p className="mt-2 text-5xl font-bold text-zinc-900 dark:text-zinc-50">
                {result.score.toFixed(2)}
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {result.note || `out of 10 — ${scoreLabel(result.score)}`}
              </p>
            </div>

            {!result.note && (
              <div className="mt-6">
                <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${scoreColor(result.score)}`}
                    style={{ width: `${(result.score / 10) * 100}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-zinc-400 dark:text-zinc-500">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>
            )}

            {result.rank !== null && !result.note && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-900">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Rank
                  </p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    #{result.rank.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-900">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Integer Score
                  </p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {result.scoreInteger}/10
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 border-t border-zinc-200 pt-4 text-center text-xs text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
              <p>Powered by OpenPageRank (CommonCrawl open data)</p>
              <p className="mt-0.5">Last updated: {result.updated}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
