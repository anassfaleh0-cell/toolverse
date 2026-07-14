"use client";

import Link from "next/link";
import { useSyncExternalStore, useCallback } from "react";
import { getBookmarks, removeBookmark, type StoredTool } from "@/lib/user-storage";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot() {
  return getBookmarks();
}

export function BookmarksContent() {
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const handleRemove = useCallback((slug: string) => {
    removeBookmark(slug);
    window.dispatchEvent(new Event("storage"));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Your Bookmarks
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Tools and resources you&apos;ve saved for quick access.
      </p>

      {bookmarks.length === 0 ? (
        <div className="mt-12 rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">No bookmarks yet.</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Click the <strong>Save</strong> button on any tool to add it here.
          </p>
          <Link
            href="/tools"
            className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-200"
          >
            Browse Tools
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-2">
          {bookmarks.map((tool: StoredTool) => (
            <div
              key={tool.slug}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-5 py-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <Link href={tool.url} className="flex-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {tool.name}
                </p>
                <p className="text-xs text-zinc-500">
                  Saved {new Date(tool.viewedAt).toLocaleDateString()}
                </p>
              </Link>
              <button
                onClick={() => handleRemove(tool.slug)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                aria-label={`Remove ${tool.name} from bookmarks`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookmarksContent;
