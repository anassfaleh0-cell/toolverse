import type { Metadata } from "next";
import { SearchPageClient, type SearchResult } from "./search-client";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getAllTools } from "@/lib/registry";

export const metadata: Metadata = {
  title: `Search Tools - ${SITE_NAME}`,
  description: `Search all free online tools on ${SITE_NAME}. Find IP lookup, WHOIS, DNS lookup, SSL checker, and more.`,
  alternates: { canonical: `${SITE_URL}/search` },
  openGraph: {
    title: `Search Tools - ${SITE_NAME}`,
    description: `Search all free online tools on ${SITE_NAME}.`,
  },
};

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await props.searchParams;
  const query = q?.trim().toLowerCase() || "";

  let initialResults: SearchResult[] = [];
  let hasSearched = false;

  if (query.length >= 2) {
    initialResults = getAllTools()
      .filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query),
      )
      .slice(0, 8)
      .map((tool) => ({
        slug: tool.slug,
        name: tool.name,
        url: tool.url,
        category: tool.category,
      }));
    hasSearched = true;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        Search Tools
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Find the tool you need from our collection of free online utilities.
      </p>
      <SearchPageClient
        initialQuery={query}
        initialResults={initialResults}
        hasSearched={hasSearched}
      />
    </div>
  );
}
