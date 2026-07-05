import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryWithTools, generateCategoryBreadcrumbs } from "@/lib/registry";
import { JsonLd, FaqSection, RelatedTools } from "@/components/shared";
import { faqSchema, webPageSchema, type FaqItem } from "@/lib/seo";
import { generateCategoryFaq, getCategories, getPopularTools } from "@/lib/registry";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: cat.seoTitle,
    description: cat.seoDescription,
    alternates: { canonical: `${SITE_URL}/category/${slug}` },
    openGraph: { title: cat.seoTitle, description: cat.seoDescription },
    twitter: { title: cat.seoTitle, description: cat.seoDescription },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryWithTools(slug);

  if (!category) notFound();

  const breadcrumbs = generateCategoryBreadcrumbs(category);
  const faqItems: FaqItem[] = generateCategoryFaq(category);
  const popular = getPopularTools(4);

  return (
    <>
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd
        data={webPageSchema({
          name: category.seoTitle,
          description: category.seoDescription,
          url: `${SITE_URL}/category/${slug}`,
          breadcrumbs,
        })}
      />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
            <ol className="flex items-center gap-2">
              {breadcrumbs.map((item, i) => (
                <li key={item.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {item.href && i < breadcrumbs.length - 1 ? (
                    <Link href={item.href} className="hover:text-zinc-900 dark:hover:text-zinc-50">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-zinc-900 dark:text-zinc-50" aria-current="page">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {category.icon} {category.label} Tools
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            {category.description}
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.url}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {tool.name}
                  </h2>
                  {tool.isFree && (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Free
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title={`${category.label} Tools - FAQ`} />
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Related Categories
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getCategories()
              .filter((c) => c.slug !== slug)
              .slice(0, 3)
              .map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="rounded-xl border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50">
                    {cat.label}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {cat.toolCount} tools
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            title="Popular Tools"
            tools={popular.map((t) => ({
              icon: "⭐",
              title: t.name,
              description: t.description,
              href: t.url,
            }))}
          />
        </div>
      </section>
    </>
  );
}
