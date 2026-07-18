import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBestOfSlugs } from "@/lib/content/programmatic-slugs";
import { generateBestOfContent, generateMetaForBestOf } from "@/lib/content/programmatic-content";
import { Breadcrumbs, JsonLd, FaqSection } from "@/components/shared";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

function formatLabel(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function generateStaticParams() {
  return getBestOfSlugs().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getBestOfSlugs().find((s) => s.slug === slug);
  if (!entry) return {};
  const { title, description } = generateMetaForBestOf(entry.category, entry.useCase);
  return {
    title,
    description,
    openGraph: { title, description, url: `${SITE_URL}/best/${slug}` },
    alternates: { canonical: `${SITE_URL}/best/${slug}` },
    robots: { index: false, follow: true },
  };
}

export const dynamicParams = false;

export default async function BestToolsPage({ params }: Props) {
  const { slug } = await params;
  const slugs = getBestOfSlugs();
  const entry = slugs.find((s) => s.slug === slug);
  if (!entry) notFound();

  const content = generateBestOfContent(entry.category, entry.useCase);
  const { title, description } = generateMetaForBestOf(entry.category, entry.useCase);
  const catLabel = formatLabel(entry.category);
  const useCaseLabel = formatLabel(entry.useCase);

  const breadcrumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Best Tools", href: `${SITE_URL}/best` },
    { label: `Best ${catLabel} Tools for ${useCaseLabel}` },
  ];

  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, url: `${SITE_URL}/best/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(content.faqs)} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">{content.title}</h1>
        <p className="mt-4 text-lg text-text-secondary">{content.description}</p>

        <section className="mt-8">
          <p className="leading-relaxed text-text-secondary">{content.intro}</p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">How We Selected These Tools</h2>
          <ul className="mt-4 space-y-3">
            {content.criteria.map((criterion, i) => (
              <li key={i} className="flex items-start gap-3 text-text-secondary">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aurora-600" />
                {criterion}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Top {catLabel} Tools for {useCaseLabel}</h2>
          {content.tools.map((tool) => (
            <div key={tool.rank} className="rounded-2xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text-primary">
                    <span className="text-aurora-700">#{tool.rank}.</span> {tool.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-aurora-700">Best for: {tool.bestFor}</p>
                  <p className="mt-2 text-text-secondary">{tool.description}</p>
                  {tool.features.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {tool.features.map((f, fi) => (
                        <li key={fi} className="rounded-full bg-surface-secondary px-3 py-1 text-xs text-text-secondary">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Link
                  href={tool.url}
                  className="shrink-0 rounded-lg bg-aurora-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-aurora-800"
                >
                  Try {tool.name}
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Tips for Choosing the Right Tool</h2>
          <ul className="mt-4 space-y-3">
            {content.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-text-secondary">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aurora-600" />
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <FaqSection items={content.faqs} title="Frequently Asked Questions" />
        </section>

        <section className="mt-12 text-center">
          <Link
            href={`/category/${entry.category}`}
            className="inline-flex items-center rounded-lg bg-aurora-700 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-aurora-800"
          >
            Explore All {catLabel} Tools on {SITE_NAME}
          </Link>
        </section>
      </div>
    </>
  );
}
