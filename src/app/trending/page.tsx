import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getInternalTools } from "@/lib/registry";

export const metadata: Metadata = {
  title: `Trending Tools — Most Popular Online Tools`,
  description: "Discover the most popular tools on Nuvora. See what other users are using for DNS lookup, IP lookup, SSL checks, and more.",
  openGraph: { title: `Trending Tools — Most Popular Online Tools`, description: "Most popular tools on Nuvora.", url: `${SITE_URL}/trending` },
  twitter: { card: "summary_large_image", title: `Trending Tools — Most Popular Online Tools`, description: "Most popular tools on Nuvora." },
  alternates: { canonical: `${SITE_URL}/trending` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Trending Tools" }];

export default function TrendingPage() {
  const tools = getInternalTools();
  const featured = tools.filter((t) => t.isFeatured);
  const rest = tools.filter((t) => !t.isFeatured);

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Trending Tools — ${SITE_NAME}`, description: "Most popular tools on Nuvora.", url: `${SITE_URL}/trending`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Trending Tools</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">The most popular tools on Nuvora, ranked by usage and community favorites.</p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Trending Now</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tool, i) => (
              <Link key={tool.id} href={tool.url} className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">#{i + 1}</span>
                <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">{tool.name}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">All Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((tool) => (
            <Link key={tool.id} href={tool.url} className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{tool.name}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
