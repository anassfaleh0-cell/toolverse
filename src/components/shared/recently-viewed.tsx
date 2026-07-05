"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getRecentlyViewed, clearRecentlyViewed } from "@/lib/user-storage";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

export function RecentlyViewed() {
  const tools = useSyncExternalStore(subscribe, getRecentlyViewed, getRecentlyViewed);

  if (tools.length === 0) return null;

  return (
    <section className="py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Recently Viewed
          </h2>
          <button
            onClick={() => {
              clearRecentlyViewed();
              window.dispatchEvent(new Event("storage"));
            }}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Clear
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.url}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
