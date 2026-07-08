"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { createCollection, deleteCollection } from "@/lib/user-storage";
import type { Collection } from "@/lib/user-storage";

function subscribeToCollections(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot(): Collection[] {
  try {
    return JSON.parse(localStorage.getItem("tv_collections") || "[]");
  } catch {
    return [];
  }
}

export function CollectionsContent() {
  const collections = useSyncExternalStore(subscribeToCollections, getSnapshot, () => []);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleCreate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;
      createCollection(name.trim(), desc.trim());
      setName("");
      setDesc("");
    },
    [name, desc],
  );

  const handleDelete = useCallback((id: string) => {
    deleteCollection(id);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
        Collections
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
        Organize your favorite tools into collections for quick access.
      </p>

      <form onSubmit={handleCreate} className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Create New Collection</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Collection name"
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
            required
          />
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (optional)"
            className="min-w-0 flex-[2] rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Create
          </button>
        </div>
      </form>

      {collections.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">No collections yet. Create one above to get started.</p>
          <Link href="/tools" className="mt-4 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400">
            Browse all tools
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <div key={col.id} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{col.name}</h3>
              <button
                onClick={() => handleDelete(col.id)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
                aria-label={`Delete ${col.name}`}
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
            {col.description && (
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{col.description}</p>
            )}
            <p className="mt-3 text-xs text-zinc-400">{col.toolSlugs.length} tool{col.toolSlugs.length !== 1 ? "s" : ""}</p>
            {col.toolSlugs.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {col.toolSlugs.map((slug) => (
                  <Link
                    key={slug}
                    href={`/${slug}`}
                    className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollectionsContent;
