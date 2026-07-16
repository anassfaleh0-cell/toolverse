import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGlossarySlugs } from "@/lib/content/programmatic-slugs";
import { generateGlossaryContent, generateGlossaryMeta } from "@/lib/content/programmatic-content";
import { getAllTools } from "@/lib/registry";
import { Breadcrumbs, JsonLd, FaqSection } from "@/components/shared";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

type Props = { params: Promise<{ term: string }> };

export function generateStaticParams() {
  return getGlossarySlugs().map((t) => ({ term: t.term }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params;
  const { title, description } = generateGlossaryMeta(term);
  return {
    title,
    description,
    openGraph: { title, description, url: `${SITE_URL}/glossary/${term}` },
    alternates: { canonical: `${SITE_URL}/glossary/${term}` },
  };
}

export const dynamicParams = false;

export default async function GlossaryTermPage({ params }: Props) {
  const { term } = await params;
  const allTerms = getGlossarySlugs();
  const valid = allTerms.some((t) => t.term === term);
  if (!valid) notFound();

  const content = generateGlossaryContent(term);
  const { title, description } = generateGlossaryMeta(term);
  const termLabel = term.replace(/-/g, " ").toUpperCase();
  const termDisplay = term.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const allTools = getAllTools();
  const toolLinks = content.relatedTools
    .map((name) => {
      const tool = allTools.find(
        (t) => t.name.toLowerCase() === name.toLowerCase() || t.id.toLowerCase() === name.toLowerCase(),
      );
      return tool ? { name: tool.name, url: tool.url } : null;
    })
    .filter(Boolean) as { name: string; url: string }[];

  const breadcrumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Glossary", href: `${SITE_URL}/glossary` },
    { label: termLabel },
  ];

  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, url: `${SITE_URL}/glossary/${term}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(content.faqs)} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          What Is {termLabel}?
        </h1>
        <p className="mt-4 text-lg text-text-secondary">{content.description}</p>

        <section className="mt-8 space-y-4">
          {content.definition.split(". ").map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-text-secondary">
              {paragraph}{i < content.definition.split(". ").length - 1 ? "." : ""}
            </p>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Examples of {termLabel}</h2>
          <ul className="mt-4 space-y-4">
            {content.examples.map((example, i) => (
              <li key={i} className="flex items-start gap-3 text-text-secondary">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aurora-600" />
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Common Use Cases</h2>
          <ul className="mt-4 space-y-4">
            {content.useCases.map((useCase, i) => (
              <li key={i} className="flex items-start gap-3 text-text-secondary">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aurora-600" />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </section>

        {toolLinks.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-text-primary">Related Tools</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {toolLinks.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.url}
                  className="rounded-xl border border-border-subtle bg-surface p-5 transition-all hover:shadow-lg"
                >
                  <h3 className="font-semibold text-text-primary">{tool.name}</h3>
                  <p className="mt-1 text-sm text-aurora-700">Try it free on {SITE_NAME}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Related Terms</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {content.relatedTerms.map((relatedTerm) => {
              const slug = relatedTerm.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
              return (
                <Link
                  key={relatedTerm}
                  href={`/glossary/${slug}`}
                  className="rounded-full bg-surface-secondary px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-aurora-600 hover:text-white"
                >
                  {relatedTerm}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <FaqSection items={content.faqs} title={`Frequently Asked Questions About ${termLabel}`} />
        </section>

        <section className="mt-12 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center rounded-lg bg-aurora-700 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-aurora-800"
          >
            Explore All Tools
          </Link>
        </section>
      </div>
    </>
  );
}
