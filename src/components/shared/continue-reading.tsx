"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getContinueReading, clearContinueReading, invalidateRecentlyViewed } from "@/lib/user-storage";

function subscribe(cb: () => void) {
  const handler = () => { invalidateRecentlyViewed(); cb(); };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export function ContinueReading() {
  const items = useSyncExternalStore(subscribe, getContinueReading, getContinueReading);
  if (items.length === 0) return null;

  return (
    <section className="py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Continue Reading
          </h2>
          <button
            onClick={() => {
              clearContinueReading();
              window.dispatchEvent(new Event("storage"));
            }}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Clear
          </button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.slug}`}
              href={item.url}
              className="rounded-xl border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {item.typeLabel}
              </span>
              <p className="mt-1 text-sm font-medium text-zinc-900 line-clamp-2 dark:text-zinc-50">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {item.readingTimeMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
