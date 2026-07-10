import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { getAllTools } from "@/lib/registry";

export const metadata: Metadata = {
  title: `Most Popular Tools — ${SITE_NAME}`,
  description: `Discover the most popular free online tools on ${SITE_NAME}. Featured by thousands of users for network diagnostics, security checks, and more.`,
  openGraph: { title: `Most Popular Tools — ${SITE_NAME}`, description: `Browse the most popular tools on ${SITE_NAME}, handpicked and loved by users worldwide.`, url: `${SITE_URL}/popular` },
  alternates: { canonical: `${SITE_URL}/popular` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Popular Tools" },
];

export default function PopularPage() {
  const popularTools = getAllTools().filter((t) => t.isFeatured);

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Most Popular Tools — ${SITE_NAME}`, description: `Discover the most popular tools on ${SITE_NAME}.`, url: `${SITE_URL}/popular`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Most Popular Tools
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            The most loved tools on {SITE_NAME}, handpicked and trusted by thousands.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((t) => (
              <Link
                key={t.id}
                href={t.url}
                className="group relative rounded-2xl border border-border-subtle bg-surface p-6 transition hover:border-nuvora-300 hover:shadow-md dark:hover:border-nuvora-700"
              >
                <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  Popular
                </span>
                <h3 className="font-semibold text-text-primary group-hover:text-nuvora-600 dark:group-hover:text-nuvora-400">
                  {t.name}
                </h3>
                <p className="mt-1 text-sm text-text-secondary line-clamp-2">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
