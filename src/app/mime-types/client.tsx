"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui";
import type { MimeType } from "@/lib/databases";

export function MimeTypesClient({ initial, categories }: { initial: MimeType[]; categories: string[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filtered = useMemo(() => {
    return initial.filter((e) => {
      const s = search.toLowerCase();
      const matchesSearch = !search || e.extension.toLowerCase().includes(s) || e.mime.toLowerCase().includes(s) || e.description.toLowerCase().includes(s);
      const matchesCategory = !selectedCategory || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, initial]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by extension, MIME type, or description..." className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 sm:max-w-md" aria-label="Search MIME types" />
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Extension</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">MIME Type</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 sm:table-cell">Description</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 sm:table-cell">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
            {filtered.map((e, i) => (
              <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-4 py-3 font-mono text-sm text-zinc-900 dark:text-zinc-100">.{e.extension}</td>
                <td className="px-4 py-3 font-mono text-sm text-blue-600 dark:text-blue-400">{e.mime}</td>
                <td className="hidden px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 sm:table-cell">{e.description}</td>
                <td className="hidden px-4 py-3 sm:table-cell"><Badge variant="info">{e.category}</Badge></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-zinc-500">No MIME types found.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-zinc-500">{filtered.length} of {initial.length} MIME types shown</p>
    </div>
  );
}
