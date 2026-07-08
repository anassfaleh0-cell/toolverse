"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

interface SearchResult {
  slug: string;
  name: string;
  url: string;
  category: string;
  type: "tool" | "guide" | "article" | "comparison" | "learn" | "faq" | "category";
  match: string;
}

const TYPE_LABELS: Record<string, string> = {
  tool: "Tool",
  guide: "Guide",
  article: "Article",
  comparison: "Compare",
  learn: "Learn",
  faq: "FAQ",
  category: "Category",
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

export function SearchSuggestions() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      startTransition(() => {
        setResults([]);
        setOpen(false);
      });
      return;
    }
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: SearchResult[]) => {
        startTransition(() => {
          setResults(data);
          setOpen(data.length > 0);
          setSelectedIndex(-1);
        });
      })
      .catch(() => {});
    return () => controller.abort();
  }, [query, startTransition]);

  function select(result: SearchResult) {
    setOpen(false);
    setQuery("");
    addToRecentlyViewed({ slug: result.slug, name: result.name, url: result.url });
    router.push(result.url);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      select(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative w-full max-w-xl" role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-controls="search-suggestions-listbox">
      <div className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-3 shadow-sm transition-colors focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-zinc-500 dark:focus-within:ring-zinc-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="size-5 shrink-0 text-zinc-400"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Search tools, guides, articles..."
          className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
          aria-label="Search tools, guides, articles"
          aria-autocomplete="list"
          role="searchbox"
        />
      </div>
      {open && results.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          role="listbox"
          id="search-suggestions-listbox"
        >
          {results.map((result, i) => (
            <li
              key={`${result.type}-${result.slug}`}
              role="option"
              aria-selected={i === selectedIndex}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                i === selectedIndex
                  ? "bg-zinc-100 dark:bg-zinc-800"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
              onClick={() => select(result)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[result.type] || "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                {TYPE_LABELS[result.type] || result.type}
              </span>
              <span className="flex-1 truncate font-medium text-zinc-900 dark:text-zinc-50">
                {result.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function addToRecentlyViewed(tool: { slug: string; name: string; url: string }) {
  import("@/lib/user-storage").then((m) => m.addRecentlyViewed(tool));
}
