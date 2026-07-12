import type { Metadata } from "next";
import Link from "next/link";
import { getComparisons } from "@/lib/content/registry";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Comparisons`,
  description: `Side-by-side comparisons of network tools, protocols, and technologies. Make informed decisions with our detailed comparison guides. ${SITE_DESCRIPTION}`,
  openGraph: { title: `Comparisons`, description: `Network tool and protocol comparisons.`, url: `${SITE_URL}/compare` },
  twitter: { card: "summary_large_image", title: `Comparisons`, description: `Network tool and protocol comparisons.` },
  alternates: { canonical: `${SITE_URL}/compare` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Comparisons" }];

export default function ComparePage() {
  const comparisons = getComparisons();
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Comparisons - ${SITE_NAME}`, description: "Network tool and protocol comparisons.", url: `${SITE_URL}/compare`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Comparisons</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Side-by-side comparisons of network tools, protocols, and technologies.</p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">vs</span>
                <h2 className="mt-2 font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">{item.description}</p>
                <span className="mt-3 block text-sm text-zinc-500">{item.readingTimeMinutes} min read</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
