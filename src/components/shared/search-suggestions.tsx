"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

interface SearchResult {
  slug: string;
  name: string;
  url: string;
  category: string;
}

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
          placeholder="Search tools..."
          className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
          aria-label="Search tools"
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
              key={result.slug}
              role="option"
              aria-selected={i === selectedIndex}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                i === selectedIndex
                  ? "bg-zinc-100 dark:bg-zinc-800"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
              onClick={() => select(result)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span className="flex-1 font-medium text-zinc-900 dark:text-zinc-50">
                {result.name}
              </span>
              <span className="text-xs text-zinc-400 capitalize">{result.category}</span>
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
