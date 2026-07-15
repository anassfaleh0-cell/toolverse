import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getTag, getAllTagSlugs, getToolsForTag } from "@/lib/seo/tags";
import { JsonLd, Breadcrumbs } from "@/components/shared";
import { webPageSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return getAllTagSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTag(slug);
  if (!tag) return {};
  return {
    title: `${tag.name} Tools`,
    description: tag.getDescription(),
    alternates: { canonical: `${SITE_URL}/tag/${tag.slug}` },
    openGraph: { title: `${tag.name} Tools`, description: tag.getDescription() },
    twitter: { card: "summary_large_image", title: `${tag.name} Tools`, description: tag.getDescription() },
  };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = getTag(slug);
  if (!tag) notFound();

  const tools = getToolsForTag(tag);
  const faqs = tag.getFaqs();
  const breadcrumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Tags", href: `${SITE_URL}/tag` },
    { label: tag.name },
  ];

  return (
    <>
      <JsonLd data={webPageSchema({
        name: `${tag.name} Tools - ${SITE_NAME}`,
        description: tag.getDescription(),
        url: `${SITE_URL}/tag/${tag.slug}`,
        breadcrumbs,
      })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {tag.name} Tools
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {tag.getDescription()}
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Tools ({tools.length})
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.url}
                className="group rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-700">
                  {tool.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {faqs.length > 0 && (
          <section className="mt-12 border-t border-zinc-200 pt-10 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Frequently Asked Questions
            </h2>
            <dl className="mt-4 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {faq.question}
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </main>
    </>
  );
}
