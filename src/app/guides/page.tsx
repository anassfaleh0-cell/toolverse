import type { Metadata } from "next";
import Link from "next/link";
import { getGuides } from "@/lib/content/registry";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Guides - ${SITE_NAME}`,
  description: `In-depth troubleshooting guides and technical tutorials for network diagnostics, DNS configuration, SSL certificates, and web security. ${SITE_DESCRIPTION}`,
  openGraph: { title: `Guides - ${SITE_NAME}`, description: `Network troubleshooting guides and tutorials.`, url: `${SITE_URL}/guides` },
  twitter: { card: "summary_large_image", title: `Guides - ${SITE_NAME}`, description: `Network troubleshooting guides and tutorials.` },
  alternates: { canonical: `${SITE_URL}/guides` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Guides" }];

export default function GuidesPage() {
  const guides = getGuides();
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Guides - ${SITE_NAME}`, description: "Network troubleshooting guides and tutorials.", url: `${SITE_URL}/guides`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Guides</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">In-depth troubleshooting guides and technical tutorials for network diagnostics and web security.</p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {guide.difficulty}
                </span>
                <h2 className="mt-2 font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                  {guide.description}
                </p>
                <span className="mt-3 block text-sm text-zinc-500">{guide.readingTimeMinutes} min read</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
