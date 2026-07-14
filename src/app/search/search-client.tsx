"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";

export interface SearchResult {
  slug: string;
  name: string;
  url: string;
  category: string;
}

interface Props {
  initialQuery: string;
  initialResults: SearchResult[];
  hasSearched: boolean;
}

function SearchForm({
  query,
  setQuery,
  results,
  loading,
  searched,
}: {
  query: string;
  setQuery: (v: string) => void;
  results: SearchResult[];
  loading: boolean;
  searched: boolean;
}) {
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    },
    [query, router],
  );

  return (
    <>
      <form
        onSubmit={handleSubmit}
        role="search"
        className="mt-8 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 shadow-sm transition-all focus-within:border-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-blue-500"
      >
        <Icon name="Search" className="size-5 shrink-0 text-zinc-400" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any tool..."
          className="flex-1 bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
          aria-label="Search tools"
          autoFocus
        />
      </form>

      {loading && (
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">Searching...</p>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            No tools found for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Try a different search term or browse{" "}
            <Link href="/tools" className="text-blue-600 hover:underline dark:text-blue-400">
              all tools
            </Link>
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.url}
              className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                {tool.name}
              </h2>
              <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {tool.category.replace("-", " & ")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function SearchResults({ initialQuery, initialResults, hasSearched }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [results] = useState<SearchResult[]>(initialResults);
  const loading = false;
  const searched = hasSearched;

  return (
    <SearchForm
      query={query}
      setQuery={setQuery}
      results={results}
      loading={loading}
      searched={searched}
    />
  );
}

export function SearchPageClient(props: Props) {
  return (
    <Suspense fallback={<p className="mt-6 text-sm text-zinc-500">Loading...</p>}>
      <SearchResults
        key={props.initialQuery}
        initialQuery={props.initialQuery}
        initialResults={props.initialResults}
        hasSearched={props.hasSearched}
      />
    </Suspense>
  );
}
