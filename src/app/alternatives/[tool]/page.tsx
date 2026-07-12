import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTools } from "@/lib/registry";
import { getCategoryBySlug } from "@/lib/categories";
import { getAlternativeSlugs } from "@/lib/content/programmatic-slugs";
import { generateAlternativeContent, generateMetaForAlternatives } from "@/lib/content/programmatic-content";
import { Breadcrumbs, JsonLd, FaqSection } from "@/components/shared";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

type Props = { params: Promise<{ tool: string }> };

export function generateStaticParams() {
  return getAlternativeSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const tools = getAllTools();
  const t = tools.find(t => t.id === tool);
  const meta = generateMetaForAlternatives(t?.name ?? tool);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, url: `${SITE_URL}/alternatives/${tool}` },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
    alternates: { canonical: `${SITE_URL}/alternatives/${tool}` },
  };
}

export const dynamicParams = false;

export default async function AlternativesPage({ params }: Props) {
  const { tool } = await params;
  const tools = getAllTools();
  const t = tools.find(t => t.id === tool);
  if (!t) notFound();

  const content = generateAlternativeContent(tool);
  const cat = getCategoryBySlug(t.category);
  const catLabel = cat?.label ?? t.category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const catSlug = cat?.slug ?? t.category;

  const breadcrumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Alternatives", href: `${SITE_URL}/alternatives` },
    { label: `${t.name} Alternatives` },
  ];

  return (
    <>
      <JsonLd data={webPageSchema({ name: content.title, description: content.description, url: `${SITE_URL}/alternatives/${tool}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(content.faqs)} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">{content.title}</h1>
        <p className="mt-4 text-lg text-text-secondary">{content.description}</p>

        <section className="mt-12">
          <p className="text-text-secondary leading-relaxed">{content.intro}</p>
        </section>

        {content.whySection.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-text-primary">Why Look for {t.name} Alternatives?</h2>
            <ul className="mt-6 space-y-4">
              {content.whySection.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-nuvora-100 text-xs font-bold text-nuvora-600 dark:bg-nuvora-900/40 dark:text-nuvora-400">{i + 1}</span>
                  <p className="text-text-secondary">{item}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-text-primary">Best Free Alternatives to {t.name}</h2>
          {content.alternatives.length > 0 ? (
            content.alternatives.map((alt, i) => (
              <div key={alt.name} className="rounded-2xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">{i + 1}. {alt.name}</h3>
                    <p className="mt-2 text-text-secondary">{alt.description}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold text-nuvora-600">Pros</h4>
                    <ul className="mt-2 space-y-1">
                      {alt.pros.map(p => <li key={p} className="text-sm text-text-secondary">+ {p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-500">Cons</h4>
                    <ul className="mt-2 space-y-1">
                      {alt.cons.map(c => <li key={c} className="text-sm text-text-secondary">- {c}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href={alt.url} className="inline-flex items-center text-sm font-medium text-nuvora-600 hover:text-nuvora-700">
                    Try {alt.name} &rarr;
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-text-secondary">No alternatives found for this tool.</p>
          )}
        </section>

        <section className="mt-12 rounded-2xl border border-border-subtle bg-surface p-8">
          <h2 className="text-2xl font-bold text-text-primary">Verdict</h2>
          <p className="mt-4 text-text-secondary leading-relaxed">{content.verdict}</p>
        </section>

        {content.faqs.length > 0 && (
          <section className="mt-12">
            <FaqSection items={content.faqs} title={`${t.name} Alternatives — FAQs`} />
          </section>
        )}

        <section className="mt-12">
          <div className="rounded-2xl border border-border-subtle bg-gradient-to-br from-nuvora-50/30 to-surface p-8 text-center dark:from-nuvora-950/20">
            <h2 className="text-2xl font-bold text-text-primary">Explore More {catLabel} Tools</h2>
            <p className="mt-2 text-text-secondary">
              Browse all free {catLabel.toLowerCase()} tools on {SITE_NAME}. Every tool is private, browser-based, and requires no signup.
            </p>
            <Link
              href={`/category/${catSlug}`}
              className="mt-6 inline-flex items-center rounded-xl bg-nuvora-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-nuvora-600/20 transition-all hover:bg-nuvora-700"
            >
              Explore All {catLabel} Tools
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
