"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui";
import type { UserAgentEntry } from "@/lib/databases";

export function UserAgentsClient({ initial, categories }: { initial: UserAgentEntry[]; categories: string[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filtered = useMemo(() => {
    return initial.filter((e) => {
      const s = search.toLowerCase();
      const matchesSearch = !search || e.browser.toLowerCase().includes(s) || e.engine.toLowerCase().includes(s) || e.os.toLowerCase().includes(s) || e.ua.toLowerCase().includes(s);
      const matchesCategory = !selectedCategory || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, initial]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by browser, engine, or OS..." className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 sm:max-w-md" aria-label="Search user agents" />
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{e.browser}</span>
              <Badge variant="info">{e.engine}</Badge>
              <Badge variant="default">{e.os}</Badge>
              <Badge variant={e.category === "bot" ? "warning" : "neutral"}>{e.category}</Badge>
            </div>
            <div className="mt-2 overflow-x-auto">
              <code className="block whitespace-pre-wrap break-all rounded bg-zinc-100 px-3 py-2 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{e.ua}</code>
            </div>
            <div className="mt-1 text-xs text-zinc-500">Year: {e.year}</div>
          </div>
        ))}
        {filtered.length === 0 && <div className="rounded-lg border border-zinc-200 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">No user agents found.</div>}
      </div>
      <p className="mt-4 text-sm text-zinc-500">{filtered.length} of {initial.length} user agents shown</p>
    </div>
  );
}
