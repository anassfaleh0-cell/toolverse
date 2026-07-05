import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getAllTagsWithCount } from "@/lib/seo/tags";
import { JsonLd, Breadcrumbs } from "@/components/shared";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Tags - ${SITE_NAME}`,
  description: `Browse all tags on ${SITE_NAME}. Find tools by category — DNS, IP, HTTP, SSL, security, network, JSON, and more.`,
  alternates: { canonical: `${SITE_URL}/tag` },
  openGraph: { title: `Tags - ${SITE_NAME}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Tags" },
];

export default function TagIndexPage() {
  const tags = getAllTagsWithCount();

  return (
    <>
      <JsonLd data={webPageSchema({
        name: `Tags - ${SITE_NAME}`,
        description: `Browse all tags on ${SITE_NAME}. Find tools by category.`,
        url: `${SITE_URL}/tag`,
        breadcrumbs,
      })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Tags</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Browse tools by topic. {tags.length} tags available.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-50">{tag.name}</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
