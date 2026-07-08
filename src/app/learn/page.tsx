import type { Metadata } from "next";
import Link from "next/link";
import { getContentByType } from "@/lib/content/registry";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Learn - ${SITE_NAME}`,
  description: `Beginner-friendly guides and tutorials for network tools, DNS, SSL, and web security. Start learning the fundamentals. ${SITE_DESCRIPTION}`,
  openGraph: { title: `Learn - ${SITE_NAME}`, description: `Beginner-friendly network tool guides.` },
  twitter: { title: `Learn - ${SITE_NAME}`, description: `Beginner-friendly network tool guides.` },
  alternates: { canonical: `${SITE_URL}/learn` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Learn" }];

export default function LearnPage() {
  const items = getContentByType("learn");
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Learn - ${SITE_NAME}`, description: "Beginner-friendly network tool guides.", url: `${SITE_URL}/learn`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Learn</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Beginner-friendly guides and tutorials for network tools, DNS, SSL, and web security fundamentals.</p>
        </div>
      </section>
      {items.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
              <Link
                key={item.slug}
                href={`/learn/${item.slug}`}
                className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-green-600 dark:text-green-400">Beginner</span>
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
      )}
    </>
  );
}
