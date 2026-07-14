"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui";
import type { RegexPattern } from "@/lib/databases";

export function RegexPatternsClient({ initial, categories }: { initial: RegexPattern[]; categories: string[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return initial.filter((e) => {
      const s = search.toLowerCase();
      const matchesSearch = !search || e.name.toLowerCase().includes(s) || e.pattern.toLowerCase().includes(s) || e.description.toLowerCase().includes(s) || e.matches.toLowerCase().includes(s);
      const matchesCategory = !selectedCategory || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, initial]);

  function copyPattern(pattern: string) {
    navigator.clipboard.writeText(pattern);
    setCopied(pattern);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patterns by name or description..." className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 sm:max-w-md" aria-label="Search regex patterns" />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedCategory("")} className={`rounded-full px-3 py-1 text-xs font-medium ${!selectedCategory ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"}`}>All</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"}`}>{cat}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map((e, i) => (
          <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{e.name}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{e.description}</p>
              </div>
              <Badge variant="info">{e.category}</Badge>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 overflow-x-auto rounded bg-zinc-100 px-3 py-2 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">{e.pattern}</code>
              <button onClick={() => copyPattern(e.pattern)} className="shrink-0 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950" aria-label="Copy pattern">{copied === e.pattern ? "Copied!" : "Copy"}</button>
            </div>
            <div className="mt-2 text-xs text-zinc-500">Matches: <span className="font-mono text-zinc-700 dark:text-zinc-300">{e.matches}</span></div>
          </div>
        ))}
        {filtered.length === 0 && <div className="rounded-lg border border-zinc-200 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">No patterns found.</div>}
      </div>
      <p className="mt-4 text-sm text-zinc-500">{filtered.length} of {initial.length} patterns shown</p>
    </div>
  );
}
