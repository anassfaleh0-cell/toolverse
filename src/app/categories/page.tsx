import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { Icon } from "@/components/shared/icon";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { getCategories } from "@/lib/registry";

export const metadata: Metadata = {
  title: `All Tool Categories`,
  description: `Browse all tool categories on ${SITE_NAME}. Find the right tool for every task — from network diagnostics and security to AI, SEO, and design.`,
  openGraph: { title: `All Tool Categories`, description: `Browse every tool category on ${SITE_NAME} and find the perfect tool.`, url: `${SITE_URL}/categories` },
  alternates: { canonical: `${SITE_URL}/categories` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Categories" },
];

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <>
      <JsonLd data={webPageSchema({ name: `All Tool Categories — ${SITE_NAME}`, description: `Browse all tool categories on ${SITE_NAME}.`, url: `${SITE_URL}/categories`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Tool Categories
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Browse {categories.length} categories to find the perfect tool for every task.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group rounded-2xl border border-border-subtle bg-surface p-6 transition hover:border-nuvora-300 hover:shadow-md dark:hover:border-nuvora-700"
              >
                <Icon name={c.icon} className="size-8 text-nuvora-600 dark:text-nuvora-400" />
                <h2 className="mt-3 text-base font-semibold text-text-primary group-hover:text-nuvora-600 dark:group-hover:text-nuvora-400">
                  {c.label}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">{c.description}</p>
                <span className="mt-3 inline-block text-xs font-medium text-nuvora-600 dark:text-nuvora-400">
                  {c.toolCount} tool{c.toolCount !== 1 ? "s" : ""}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
