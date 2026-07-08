"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
    </div>
  );
}

export function LineCounter() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => {
    const lines = input.split("\n");
    const total = lines.length;
    const nonEmpty = lines.filter((l) => l.trim() !== "").length;
    const empty = total - nonEmpty;
    const charCounts = lines.map((l) => l.length);
    const totalChars = charCounts.reduce((a, b) => a + b, 0);
    const avgLineLength = nonEmpty > 0 ? Math.round((totalChars / nonEmpty) * 10) / 10 : 0;
    const unique = new Set(lines.map((l) => l.trim())).size;
    const maxLineLength = Math.max(...charCounts, 0);
    const minLineLength = Math.min(...charCounts.filter((c) => c > 0), 0);
    return { total, nonEmpty, empty, unique, avgLineLength, maxLineLength, minLineLength, totalChars };
  }, [input]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to count lines..."
          rows={6}
          aria-label="Input text"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total Lines" value={stats.total} />
        <StatCard label="Non-Empty Lines" value={stats.nonEmpty} />
        <StatCard label="Empty Lines" value={stats.empty} />
        <StatCard label="Unique Lines" value={stats.unique} />
        <StatCard label="Total Characters" value={stats.totalChars} />
        <StatCard label="Avg Line Length" value={`${stats.avgLineLength}`} />
        <StatCard label="Max Line Length" value={stats.maxLineLength} />
        <StatCard label="Min Line Length" value={stats.minLineLength} />
      </div>
    </div>
  );
}
