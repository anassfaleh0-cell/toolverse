"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui";
import type { HtmlEntity } from "@/lib/databases";

export function HtmlEntitiesClient({ initial, categories }: { initial: HtmlEntity[]; categories: string[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filtered = useMemo(() => {
    return initial.filter((e) => {
      const matchesSearch = !search || e.entity.toLowerCase().includes(search.toLowerCase()) || e.character === search || e.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, initial]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search entities..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 sm:max-w-md"
          aria-label="Search HTML entities"
        />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedCategory("")} className={`rounded-full px-3 py-1 text-xs font-medium ${!selectedCategory ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"}`}>All</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"}`}>{cat}</button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">Entity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">Character</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">Code Point</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 sm:table-cell">Name</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 sm:table-cell">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
            {filtered.map((e, i) => (
              <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-4 py-3 font-mono text-sm text-blue-600 dark:text-blue-400">{e.entity}</td>
                <td className="px-4 py-3 text-center text-xl text-zinc-900 dark:text-zinc-100">{e.character}</td>
                <td className="px-4 py-3 font-mono text-sm text-zinc-600 dark:text-zinc-400">U+{e.codePoint.toString(16).toUpperCase().padStart(4, "0")}</td>
                <td className="hidden px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 sm:table-cell capitalize">{e.name}</td>
                <td className="hidden px-4 py-3 sm:table-cell"><Badge variant="info">{e.category}</Badge></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">No entities found matching your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-zinc-500">{filtered.length} of {initial.length} entities shown</p>
    </div>
  );
}
