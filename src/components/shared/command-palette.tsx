"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getRecentlyViewed, getBookmarks, getSearchHistory, addSearchQuery, type StoredTool } from "@/lib/user-storage";
import { Icon } from "@/components/shared/icon";

interface SearchResult {
  slug: string;
  name: string;
  url: string;
  category: string;
  type: "tool" | "guide" | "article" | "comparison" | "learn" | "faq" | "category";
  match: string;
}

const TYPE_LABELS: Record<string, string> = {
  tool: "Tool", guide: "Guide", article: "Article",
  comparison: "Compare", learn: "Learn", faq: "FAQ", category: "Category",
};

const TYPE_COLORS: Record<string, string> = {
  tool: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  guide: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  article: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  comparison: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  learn: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  faq: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  category: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const GROUP_ORDER = ["Tools", "Content", "FAQs", "Categories"];
const TRENDING_KEY = "tv_trending_searches";

function getTrendingSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TRENDING_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function recordTrending(query: string): void {
  if (typeof window === "undefined" || query.length < 2) return;
  try {
    const trending = getTrendingSearches();
    const updated = trending.filter((t) => t !== query);
    updated.unshift(query);
    localStorage.setItem(TRENDING_KEY, JSON.stringify(updated.slice(0, 15)));
  } catch {
    /* ignore */
  }
}

function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function fuzzyScore(text: string, query: string): number {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  if (lower === q) return 100;
  if (lower.startsWith(q)) return 80;
  if (lower.includes(q)) return 60;
  if (fuzzyMatch(text, query)) return 40;
  return 0;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<StoredTool[]>([]);
  const [bookmarked, setBookmarked] = useState<StoredTool[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const localData = useRef<SearchResult[] | null>(null);

  useEffect(() => {
    if (localData.current) return;
    import("@/lib/registry").then((mod) => {
      const tools = mod.getAllTools().map((t: { slug: string; name: string; url: string; category: string }) => ({
        slug: t.slug,
        name: t.name,
        url: t.url,
        category: t.category,
        type: "tool" as const,
        match: t.name,
      }));
      localData.current = tools;
    });
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) {
          setQuery("");
          setResults([]);
          setSelectedIndex(0);
          setRecentSearches(getSearchHistory());
          setRecentlyViewed(getRecentlyViewed());
          setBookmarked(getBookmarks());
          setTimeout(() => inputRef.current?.focus(), 50);
        }
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (!open || !query.trim()) {
      return;
    }
    const q = query.trim();
    const index = localData.current;
    if (!index) return;

    const scored: SearchResult[] = [];
    for (const item of index) {
      const nameScore = fuzzyScore(item.name, q);
      if (nameScore > 0) {
        scored.push({ ...item, match: item.name });
      }
    }

    scored.sort((a, b) => {
      const scoreA = fuzzyScore(a.name, q);
      const scoreB = fuzzyScore(b.name, q);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return a.name.length - b.name.length;
    });

    setResults(scored.slice(0, 12));
    setSelectedIndex(0);
  }, [query, open]);

  const groups = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    for (const r of results) {
      let group = "";
      if (r.type === "tool") group = "Tools";
      else if (r.type === "faq") group = "FAQs";
      else if (r.type === "category") group = "Categories";
      else group = "Content";
      if (!map[group]) map[group] = [];
      map[group].push(r);
    }
    return map;
  }, [results]);

  const flatResults = useMemo(() => {
    const ordered: SearchResult[] = [];
    for (const g of GROUP_ORDER) {
      if (groups[g]) ordered.push(...groups[g]);
    }
    return ordered;
  }, [groups]);

  function select(result: SearchResult) {
    addSearchQuery(query.trim() || result.name);
    recordTrending(query.trim() || result.name);
    setOpen(false);
    setQuery("");
    router.push(result.url);
  }

  function selectRecentSearch(sq: string) {
    setQuery(sq);
  }

  function selectLocal(item: { slug: string; name: string; url: string }) {
    addSearchQuery(item.name);
    recordTrending(item.name);
    setOpen(false);
    setQuery("");
    router.push(item.url);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const total = query.trim().length > 0 ? flatResults.length : 0;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, Math.max(total - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (flatResults[selectedIndex]) {
        e.preventDefault();
        select(flatResults[selectedIndex]);
      }
    }
  }

  if (!open) return null;

  const showRecent = query.trim().length === 0;
  const hasLocalResults = recentlyViewed.length > 0 || bookmarked.length > 0;
  const totalResults = flatResults.length;
  const trending = getTrendingSearches();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[15vh]" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-4 dark:border-zinc-700">
          <Icon name="Search" className="size-5 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
            autoFocus
          />
          <kbd className="hidden shrink-0 rounded-md border border-zinc-200 px-2 py-0.5 text-xs text-zinc-400 sm:inline-block dark:border-zinc-600">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-96 overflow-y-auto">
          {showRecent && (
            <>
              {recentSearches.length > 0 && (
                <div className="px-4 pt-3">
                  <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wider text-zinc-400">Recent Searches</p>
                  {recentSearches.slice(0, 8).map((sq) => (
                    <button
                      key={sq}
                      onClick={() => selectRecentSearch(sq)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                      <svg className="size-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" /><path d="M12 7v5l3 3" />
                      </svg>
                      {sq}
                    </button>
                  ))}
                </div>
              )}

              {trending.length > 0 && (
                <div className="px-4 pt-3">
                  <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wider text-zinc-400">Trending</p>
                  {trending.slice(0, 5).map((sq) => (
                    <button
                      key={sq}
                      onClick={() => selectRecentSearch(sq)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                      <svg className="size-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                      </svg>
                      {sq}
                    </button>
                  ))}
                </div>
              )}

              {recentlyViewed.length > 0 && (
                <div className="px-4 pt-3">
                  <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wider text-zinc-400">Recently Viewed</p>
                  {recentlyViewed.slice(0, 5).map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => selectLocal(item)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                      <svg className="size-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="flex-1 truncate text-left font-medium text-zinc-900 dark:text-zinc-50">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {bookmarked.length > 0 && (
                <div className="px-4 pb-3 pt-3">
                  <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wider text-zinc-400">Bookmarks</p>
                  {bookmarked.slice(0, 5).map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => selectLocal(item)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                      <svg className="size-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="flex-1 truncate text-left font-medium text-zinc-900 dark:text-zinc-50">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {!hasLocalResults && recentSearches.length === 0 && trending.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-zinc-400">
                  Press <kbd className="rounded border border-zinc-200 px-1.5 py-0.5 dark:border-zinc-600">K</kbd> to start searching
                </div>
              )}
            </>
          )}

          {!showRecent && totalResults > 0 && (
            <div className="px-4 py-3">
              {GROUP_ORDER.map((group) => {
                const items = groups[group];
                if (!items || items.length === 0) return null;
                return (
                  <div key={group}>
                    <p className="mb-1 px-2 pt-1 text-xs font-medium uppercase tracking-wider text-zinc-400">{group} ({items.length})</p>
                    {items.map((result) => {
                      const flatIdx = flatResults.indexOf(result);
                      return (
                        <button
                          key={`${result.type}-${result.slug}`}
                          onClick={() => select(result)}
                          onMouseEnter={() => setSelectedIndex(flatIdx)}
                          className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm ${
                            flatIdx === selectedIndex ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                          }`}
                        >
                          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[result.type] || "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                            {TYPE_LABELS[result.type] || result.type}
                          </span>
                          <span className="flex-1 truncate text-left font-medium text-zinc-900 dark:text-zinc-50">{result.name}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {!showRecent && totalResults === 0 && (
            <div className="px-4 py-8 text-center text-sm text-zinc-400">No results found for &quot;{query}&quot;</div>
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-zinc-200 px-5 py-3 text-xs text-zinc-400 dark:border-zinc-700">
          <span><kbd className="rounded border border-zinc-200 px-1.5 py-0.5 dark:border-zinc-600">T</kbd><kbd className="ml-0.5 rounded border border-zinc-200 px-1.5 py-0.5 dark:border-zinc-600">T</kbd> Navigate</span>
          <span><kbd className="rounded border border-zinc-200 px-1.5 py-0.5 dark:border-zinc-600">Enter</kbd> Open</span>
          <span><kbd className="rounded border border-zinc-200 px-1.5 py-0.5 dark:border-zinc-600">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}