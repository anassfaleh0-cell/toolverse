"use client";

import { useState, useCallback } from "react";
import { getResultHistory, clearResultHistory, deleteResultEntry } from "@/lib/user-storage";

interface HistoryEntry {
  ts: string;
  data: unknown;
}

interface ResultHistoryProps {
  toolSlug: string;
  onRestore: (data: unknown) => void;
}

export function ResultHistory({ toolSlug, onRestore }: ResultHistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => getResultHistory(toolSlug));
  const [open, setOpen] = useState(false);

  const refresh = useCallback(() => {
    setEntries(getResultHistory(toolSlug));
  }, [toolSlug]);

  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
      >
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 text-zinc-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          Recent Analyses ({entries.length})
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearResultHistory(toolSlug);
              refresh();
            }}
            className="text-xs text-zinc-400 hover:text-red-500"
          >
            Clear
          </button>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`size-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </button>
      {open && (
        <div className="border-t border-zinc-200 dark:border-zinc-800">
          {entries.map((entry) => (
            <div
              key={entry.ts}
              className="flex items-center justify-between border-b border-zinc-100 px-5 py-2.5 last:border-0 dark:border-zinc-800"
            >
              <button
                type="button"
                onClick={() => {
                  onRestore(entry.data);
                  setOpen(false);
                }}
                className="text-left text-xs text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {new Date(entry.ts).toLocaleString()}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteResultEntry(toolSlug, entry.ts);
                  refresh();
                }}
                className="text-[10px] text-zinc-300 hover:text-red-500"
                aria-label="Delete entry"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
