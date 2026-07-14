"use client";

import { useCallback, useSyncExternalStore } from "react";
import { isBookmarked, toggleBookmark, type StoredTool } from "@/lib/user-storage";

interface Props {
  tool: StoredTool;
  className?: string;
}

function subscribeToBookmarks(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getBookmarkedState(slug: string) {
  return () => isBookmarked(slug);
}

export function BookmarkButton({ tool, className = "" }: Props) {
  const bookmarked = useSyncExternalStore(
    subscribeToBookmarks,
    getBookmarkedState(tool.slug),
    getBookmarkedState(tool.slug),
  );

  const handleToggle = useCallback(() => {
    toggleBookmark(tool);
    window.dispatchEvent(new Event("storage"));
  }, [tool]);

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        bookmarked
          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
      } ${className}`}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      title={bookmarked ? "Remove bookmark" : "Save to bookmarks"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className="size-3.5"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
