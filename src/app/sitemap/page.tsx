"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getAllTools } from "@/lib/registry";
import { getAllContent } from "@/lib/content/registry";
import { TOPIC_CLUSTERS } from "@/lib/content/clusters";
import type { TopicCluster } from "@/lib/content/types";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo";

interface GroupedItem {
  label: string;
  href: string;
  type: "tool" | "guide" | "article" | "comparison" | "learn" | "page";
}

interface ClusterGroup {
  cluster: TopicCluster;
  tools: GroupedItem[];
  guides: GroupedItem[];
  articles: GroupedItem[];
  comparisons: GroupedItem[];
  learn: GroupedItem[];
}

const BREADCRUMBS = [
  { label: "Home", href: SITE_URL },
  { label: "Sitemap" },
];

const MAIN_PAGES: GroupedItem[] = [
  { label: "Home", href: "/", type: "page" },
  { label: "All Tools", href: "/tools", type: "page" },
  { label: "Categories", href: "/categories", type: "page" },
  { label: "Resources", href: "/resources", type: "page" },
  { label: "Guides", href: "/guides", type: "page" },
  { label: "Learn", href: "/learn", type: "page" },
  { label: "Blog", href: "/blog", type: "page" },
  { label: "Comparisons", href: "/compare", type: "page" },
  { label: "About", href: "/about", type: "page" },
  { label: "About Our Research", href: "/about-our-research", type: "page" },
  { label: "How We Test Tools", href: "/how-we-test-tools", type: "page" },
  { label: "Editorial Guidelines", href: "/editorial-guidelines", type: "page" },
  { label: "Transparency", href: "/transparency", type: "page" },
  { label: "Contact", href: "/contact", type: "page" },
  { label: "Privacy Policy", href: "/privacy", type: "page" },
  { label: "Terms of Service", href: "/terms", type: "page" },
];

const FEED_PAGES: GroupedItem[] = [
  { label: "RSS Feed", href: "/feed.xml", type: "page" },
  { label: "XML Sitemap", href: "/sitemap.xml", type: "page" },
];

export default function SitemapPage() {
  const [query, setQuery] = useState("");

  const tools = useMemo(() => getAllTools().filter((t) => t.url.startsWith("/")), []);
  const content = useMemo(() => getAllContent(), []);

  const clusterGroups: ClusterGroup[] = useMemo(() => {
    return TOPIC_CLUSTERS.map((cluster) => {
      const clusterTools = tools
        .filter((t) => cluster.toolSlugs.includes(t.slug))
        .map((t) => ({ label: t.name, href: t.url, type: "tool" as const }));

      const clusterContent = content.filter((c) =>
        c.toolSlugs.some((ts) => cluster.toolSlugs.includes(ts)),
      );

      return {
        cluster,
        tools: clusterTools,
        guides: clusterContent
          .filter((c) => c.type === "guide")
          .map((c) => ({ label: c.title, href: `/guides/${c.slug}`, type: "guide" as const })),
        articles: clusterContent
          .filter((c) => c.type === "article")
          .map((c) => ({ label: c.title, href: `/blog/${c.slug}`, type: "article" as const })),
        comparisons: clusterContent
          .filter((c) => c.type === "comparison")
          .map((c) => ({ label: c.title, href: `/compare/${c.slug}`, type: "comparison" as const })),
        learn: clusterContent
          .filter((c) => c.type === "learn")
          .map((c) => ({ label: c.title, href: `/learn/${c.slug}`, type: "learn" as const })),
      };
    });
  }, [tools, content]);

  function matchesQuery(text: string): boolean {
    if (!query.trim()) return true;
    return text.toLowerCase().includes(query.toLowerCase());
  }

  function sectionHasMatch(items: GroupedItem[]): boolean {
    if (!query.trim()) return true;
    return items.some((i) => matchesQuery(i.label));
  }

  return (
    <>
      <JsonLd data={webPageSchema({
        name: `Sitemap - ${SITE_NAME}`,
        description: `Complete sitemap for ${SITE_NAME}. Browse all network tools, guides, articles, and resources.`,
        url: `${SITE_URL}/sitemap`,
        breadcrumbs: BREADCRUMBS,
      })} />
      <JsonLd data={breadcrumbSchema(BREADCRUMBS)} />
      <main className="mx-auto px-4 py-12 sm:px-6 lg:max-w-6xl">
        <Breadcrumbs items={BREADCRUMBS} />

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Sitemap</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Complete index of all {tools.length} tools and {content.length} content pages.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter pages..."
              className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
              aria-label="Filter sitemap pages"
            />
          </div>
        </div>

        {query && (
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
            Showing results matching &ldquo;{query}&rdquo;
          </p>
        )}

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Main Pages</h2>
          <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2 md:grid-cols-3">
            {MAIN_PAGES.filter((p) => matchesQuery(p.label)).map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </section>

        {clusterGroups.map((group) => {
          const hasTools = sectionHasMatch(group.tools);
          const hasGuides = sectionHasMatch(group.guides);
          const hasArticles = sectionHasMatch(group.articles);
          const hasComparisons = sectionHasMatch(group.comparisons);
          const hasLearn = sectionHasMatch(group.learn);
          const hasAny = hasTools || hasGuides || hasArticles || hasComparisons || hasLearn;

          if (query && !hasAny && !matchesQuery(group.cluster.name)) return null;

          return (
            <section key={group.cluster.slug} className="mt-10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {group.cluster.name}
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
                {group.cluster.description}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hasTools && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Tools
                    </h3>
                    <ul className="space-y-1">
                      {group.tools.filter((t) => matchesQuery(t.label)).map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasGuides && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Guides
                    </h3>
                    <ul className="space-y-1">
                      {group.guides.filter((g) => matchesQuery(g.label)).map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasArticles && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Articles
                    </h3>
                    <ul className="space-y-1">
                      {group.articles.filter((a) => matchesQuery(a.label)).map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasComparisons && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Comparisons
                    </h3>
                    <ul className="space-y-1">
                      {group.comparisons.filter((c) => matchesQuery(c.label)).map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasLearn && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Beginner Guides
                    </h3>
                    <ul className="space-y-1">
                      {group.learn.filter((l) => matchesQuery(l.label)).map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          );
        })}

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Feeds</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {FEED_PAGES.filter((p) => matchesQuery(p.label)).map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-12 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          Sitemap generated by {SITE_NAME} &mdash; {new Date().getFullYear()}
        </p>
      </main>
    </>
  );
}
