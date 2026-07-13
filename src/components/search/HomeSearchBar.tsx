"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { tools } from "@/lib/tools";
import { Icon } from "@/components/shared/icon";
import { CATEGORIES } from "@/lib/categories";

const CATEGORY_ICONS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.slug, c.icon])
);

export function HomeSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof tools>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const q = query.toLowerCase();
      const filtered = tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q),
      );
      setResults(filtered.slice(0, 10));
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSelect = (url: string) => {
    router.push(url);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex].url);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setResults([]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <div className="relative">
        <div className="relative flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="absolute left-4 w-5 h-5 text-text-tertiary"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.length > 0) setIsOpen(true);
            }}
            placeholder="Search 224+ tools..."
            className="w-full pl-12 pr-12 py-4 text-lg bg-surface border-2 border-border-subtle rounded-xl focus:outline-none focus:border-nuvora-400 transition-colors text-text-primary placeholder:text-text-tertiary"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
              }}
              className="absolute right-4 p-1 hover:bg-surface-secondary rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5 text-text-tertiary"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>

        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border-subtle rounded-xl shadow-lg overflow-hidden z-50">
            {results.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => handleSelect(tool.url)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  index === selectedIndex
                    ? "bg-nuvora-50 dark:bg-nuvora-900/30"
                    : "hover:bg-surface-secondary"
                }`}
              >
                <span className="flex items-center justify-center size-8 shrink-0 rounded-lg bg-surface-secondary">
                  <Icon name={CATEGORY_ICONS[tool.category] ?? "Wrench"} className="size-4 text-text-secondary" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-text-primary truncate">
                    {tool.name}
                  </div>
                  <div className="text-sm text-text-tertiary truncate">
                    {tool.description}
                  </div>
                </div>
                <span className="shrink-0 text-xs px-2 py-1 bg-surface-secondary rounded-full text-text-tertiary">
                  {tool.category}
                </span>
              </button>
            ))}
          </div>
        )}

        {isOpen && query.length > 0 && results.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border-subtle rounded-xl shadow-lg p-6 text-center z-50">
            <p className="text-base text-text-primary">
              No tools found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm text-text-tertiary mt-1">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
