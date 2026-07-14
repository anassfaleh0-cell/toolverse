"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Icon } from "@/components/shared/icon";
import { SEARCH_INDEX, type SearchEntry } from "@/lib/search-index";

const fuse = new Fuse(SEARCH_INDEX, {
  keys: ["title", "description", "keywords"],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
});

function groupResults(results: SearchEntry[]) {
  const groups: Record<string, SearchEntry[]> = {};
  for (const r of results) {
    if (!groups[r.type]) groups[r.type] = [];
    if (groups[r.type].length < 5) groups[r.type].push(r);
  }
  return groups;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof groupResults>>({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults({});
    }
  }, [open]);

  const flatResults = useCallback(() => {
    const all: SearchEntry[] = [];
    for (const group of Object.values(results)) all.push(...group);
    return all;
  }, [results]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({});
      return;
    }
    const raw = fuse.search(query).map(r => r.item);
    setResults(groupResults(raw));
    setSelectedIndex(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const flat = flatResults();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flat[selectedIndex]) {
      e.preventDefault();
      router.push(flat[selectedIndex].url);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-border-subtle bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border-subtle px-4">
          <Icon name="Search" className="size-5 shrink-0 text-text-tertiary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search tools..."
            className="flex-1 bg-transparent py-4 text-base outline-none text-text-primary placeholder:text-text-tertiary"
            autoComplete="off"
          />
          <kbd className="shrink-0 rounded-md border border-border-subtle bg-surface-secondary px-2 py-0.5 text-xs text-text-tertiary">ESC</kbd>
        </div>
        {Object.keys(results).length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {Object.entries(results).map(([type, items]) => (
              <div key={type}>
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  {type === "tool" ? "Tools" : type === "article" ? "Articles" : "Guides"}
                </div>
                {items.map((entry, i) => {
                  const globalIdx = Object.values(results).flat().indexOf(entry);
                  return (
                    <Link
                      key={entry.id}
                      href={entry.url}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                        globalIdx === selectedIndex ? "bg-nuvora-50 dark:bg-nuvora-950/50" : "hover:bg-surface-secondary"
                      }`}
                    >
                      {entry.icon && <span className="text-lg shrink-0">{entry.icon}</span>}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary truncate">{entry.title}</p>
                        <p className="text-xs text-text-tertiary truncate">{entry.description}</p>
                      </div>
                      <span className="shrink-0 rounded-md bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-text-tertiary">
                        {entry.type}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        )}
        {query.trim() && Object.keys(results).length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-text-tertiary">
            No results found for &ldquo;{query}&rdquo;
          </div>
        )}
        {!query.trim() && (
          <div className="px-4 py-8 text-center text-sm text-text-tertiary">
            Search across {SEARCH_INDEX.length} tools, articles, and guides
          </div>
        )}
        <div className="border-t border-border-subtle px-4 py-2 flex items-center gap-4 text-xs text-text-tertiary">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}
