"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { getHistory, clearHistory, getFlagEmoji, type HistoryEntry } from "@/lib/ip-lookup-utils";
import { Button } from "@/components/ui";

interface IpLookupHistoryProps {
  onSelect: (ip: string) => void;
  currentIp?: string;
}

export function IpLookupHistory({ onSelect, currentIp }: IpLookupHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const refresh = useCallback(() => {
    startTransition(() => {
      setHistory(getHistory());
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [currentIp, refresh]);

  if (history.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white/60 p-5 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Recent Lookups
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            clearHistory();
            setHistory([]);
          }}
        >
          Clear
        </Button>
      </div>
      <ul className="mt-3 space-y-1">
        {history.map((entry) => (
          <li key={entry.ip}>
            <button
              type="button"
              onClick={() => onSelect(entry.ip)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                entry.ip === currentIp
                  ? "bg-zinc-100 dark:bg-zinc-800"
                  : ""
              }`}
            >
              <span className="text-base" aria-hidden="true">
                {getFlagEmoji(entry.countryCode)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs font-medium text-zinc-900 dark:text-zinc-50">
                  {entry.ip}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {entry.city}, {entry.country}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
