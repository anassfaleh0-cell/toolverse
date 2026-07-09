import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/registry";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Categories - ${SITE_NAME}`,
  description: `Browse tool categories on ${SITE_NAME}. Find tools for text, design, code, data, audio, video, and productivity.`,
  openGraph: { title: `Categories - ${SITE_NAME}`, description: `Browse tool categories on ${SITE_NAME}.`, url: `${SITE_URL}/categories` },
  twitter: { card: "summary_large_image", title: `Categories - ${SITE_NAME}`, description: `Browse tool categories on ${SITE_NAME}.` },
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
      <JsonLd data={webPageSchema({ name: `Categories - ${SITE_NAME}`, description: `Browse tool categories on ${SITE_NAME}.`, url: `${SITE_URL}/categories`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-zinc-900 dark:text-zinc-50" aria-current="page">Categories</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Tool Categories
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Browse tools by category to find exactly what you need.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="text-3xl">{cat.icon}</span>
                <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {cat.label}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {cat.description}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {cat.toolCount} tool{cat.toolCount !== 1 ? "s" : ""}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
