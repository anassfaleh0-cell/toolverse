"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getContinueReading, clearContinueReading, invalidateContinueReading } from "@/lib/user-storage";

function subscribe(cb: () => void) {
  const handler = () => { invalidateContinueReading(); cb(); };
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
          <h2 className="text-sm font-semibold text-text-primary">
            Continue Reading
          </h2>
          <button
            onClick={() => {
              clearContinueReading();
              window.dispatchEvent(new Event("storage"));
            }}
            className="text-xs text-text-tertiary hover:text-text-secondary"
          >
            Clear
          </button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.slug}`}
              href={item.url}
              className="rounded-xl border border-border-subtle bg-surface p-4 transition-all hover:shadow-sm"
            >
              <span className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                {item.typeLabel}
              </span>
              <p className="mt-1 text-sm font-medium text-text-primary line-clamp-2">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-text-tertiary">
                {item.readingTimeMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
