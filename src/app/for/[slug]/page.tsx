import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUseCaseSlugs } from "@/lib/content/programmatic-slugs";
import { generateUseCaseContent, generateMetaForUseCase } from "@/lib/content/programmatic-content";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { FaqSection } from "@/components/shared/faq-section";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

function formatLabel(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function generateStaticParams() {
  return getUseCaseSlugs().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getUseCaseSlugs().find((s) => s.slug === slug);
  if (!entry) return {};
  const { title, description } = generateMetaForUseCase(entry.useCase);
  return {
    title,
    description,
    openGraph: { title, description, url: `${SITE_URL}/for/${slug}` },
    alternates: { canonical: `${SITE_URL}/for/${slug}` },
  };
}

export const dynamicParams = false;

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  const entry = getUseCaseSlugs().find((s) => s.slug === slug);
  if (!entry) notFound();

  const content = generateUseCaseContent(entry.useCase);
  const { title, description } = generateMetaForUseCase(entry.useCase);
  const useCaseLabel = formatLabel(entry.useCase);

  const breadcrumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Use Cases", href: `${SITE_URL}/use-cases` },
    { label: `Tools for ${useCaseLabel}` },
  ];

  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, url: `${SITE_URL}/for/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(content.faqs)} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">{content.title}</h1>
        <p className="mt-4 text-lg text-text-secondary">{content.description}</p>

        <section className="mt-8 space-y-4">
          {content.intro.split(". ").map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-text-secondary">
              {paragraph}{i < content.intro.split(". ").length - 1 ? "." : ""}
            </p>
          ))}
        </section>

        <section className="mt-12 space-y-10">
          <h2 className="text-2xl font-bold text-text-primary">Tool Recommendations for {useCaseLabel}</h2>
          {content.toolGroups.map((group) => (
            <div key={group.category}>
              <h3 className="text-xl font-semibold text-text-primary">{group.category}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.url}
                    className="rounded-xl border border-border-subtle bg-surface p-5 transition-all hover:shadow-lg"
                  >
                    <h4 className="font-semibold text-text-primary">{tool.name}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{tool.why}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Tips for {useCaseLabel}</h2>
          <ul className="mt-4 space-y-3">
            {content.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-text-secondary">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aurora-600" />
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-text-primary">Essential Tool Stack for {useCaseLabel}</h2>
          <p className="mt-3 leading-relaxed text-text-secondary">
            {useCaseLabel} professionals benefit from a well-rounded toolkit that covers multiple
            categories. Start with the tools listed above — they are all free, private, and require
            no signup. Combine a text editor or converter with a validation or analysis tool from
            the same category to create an efficient workflow. As your needs grow, explore
            additional categories to expand your capabilities. All {SITE_URL} tools work seamlessly
            together since they are all browser-based and follow the same privacy-first architecture.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {content.toolGroups.slice(0, 6).map((group) => (
              <span
                key={group.category}
                className="rounded-full bg-surface-secondary px-4 py-2 text-sm text-text-secondary"
              >
                {group.category}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <FaqSection items={content.faqs} title="Frequently Asked Questions" />
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
