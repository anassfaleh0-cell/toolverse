import type { Metadata } from "next";
import Link from "next/link";
import { getAllTools, getCategories } from "@/lib/registry";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import type { Thing, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: `All Tools`,
  description: `Browse all free online tools on ${SITE_NAME}. Find the perfect tool for developers, designers, and creators.`,
  openGraph: { title: `All Tools`, description: `Browse all free online tools on ${SITE_NAME}.`, url: `${SITE_URL}/tools` },
  twitter: { title: `All Tools`, description: `Browse all free online tools on ${SITE_NAME}.` },
  alternates: { canonical: `${SITE_URL}/tools` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "All Tools" },
];

export default function ToolsPage() {
  const tools = getAllTools();
  const categories = getCategories();

  return (
    <>
      <JsonLd data={webPageSchema({ name: `All Tools - ${SITE_NAME}`, description: `Browse all free online tools on ${SITE_NAME}.`, url: `${SITE_URL}/tools`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "All Tools",
        itemListElement: tools.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareApplication",
            name: t.name,
            url: `${SITE_URL}${t.url}`,
          },
        })),
      } as WithContext<Thing>} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-zinc-900 dark:text-zinc-50" aria-current="page">All Tools</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            All Tools
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Browse all {tools.length} free tools available on {SITE_NAME}.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/categories"
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              All Categories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {cat.icon} {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.url}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {tool.name}
                  </h3>
                  {tool.isFree && (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Free
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {tool.description}
                </p>
                <span className="mt-3 inline-block text-xs text-zinc-400 dark:text-zinc-500">
                  {categories.find((c) => c.slug === tool.category)?.icon}{" "}
                  {categories.find((c) => c.slug === tool.category)?.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
