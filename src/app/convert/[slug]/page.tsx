import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getConverterSlugs } from "@/lib/content/programmatic-slugs";
import { Icon } from "@/components/shared/icon";
import { generateConverterContent, generateMetaForConverter } from "@/lib/content/programmatic-content";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { FaqSection } from "@/components/shared/faq-section";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getConverterSlugs().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pairs = getConverterSlugs();
  const pair = pairs.find(p => p.slug === slug);
  if (!pair) return {};
  const meta = generateMetaForConverter(pair.source, pair.target);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, url: `${SITE_URL}/convert/${slug}` },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
    alternates: { canonical: `${SITE_URL}/convert/${slug}` },
    robots: { index: false, follow: false },
  };
}

export const dynamicParams = false;

export default async function ConvertPage({ params }: Props) {
  const { slug } = await params;
  const pairs = getConverterSlugs();
  const pair = pairs.find(p => p.slug === slug);
  if (!pair) notFound();

  const content = generateConverterContent(pair.source, pair.target);
  const label = `${pair.source.toUpperCase()} to ${pair.target.toUpperCase()}`;

  const breadcrumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Converters", href: `${SITE_URL}/convert` },
    { label: label },
  ];

  return (
    <>
      <JsonLd data={webPageSchema({ name: content.title, description: content.description, url: `${SITE_URL}/convert/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(content.faqs)} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">{content.title}</h1>
        <p className="mt-4 text-lg text-text-secondary">{content.description}</p>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">How to Convert {pair.source.toUpperCase()} to {pair.target.toUpperCase()}</h2>
          <div className="mt-6 space-y-6">
            {content.steps.map((step) => (
              <div key={step.step} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-nuvora-100 text-sm font-bold text-nuvora-600 dark:bg-nuvora-900/40 dark:text-nuvora-400">
                  {step.step}
                </span>
                <div>
                  <h3 className="font-semibold text-text-primary">{step.title}</h3>
                  <p className="mt-1 text-text-secondary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Benefits of Using Nuvora&apos;s {label} Converter</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {content.benefits.map((benefit, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-border-subtle bg-surface p-4">
                <Icon name="CheckCircle2" className="size-5 text-nuvora-600 shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Tips for Best Results</h2>
          <ul className="mt-6 space-y-3">
            {content.tips.map((tip, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-border-subtle bg-surface p-4">
                <span className="mt-0.5 shrink-0 text-nuvora-600">&#9655;</span>
                <span className="text-sm text-text-secondary">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Why Convert {pair.source.toUpperCase()} to {pair.target.toUpperCase()}?</h2>
          <ul className="mt-6 space-y-4">
            {content.whyConvert.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-nuvora-100 text-xs font-bold text-nuvora-600 dark:bg-nuvora-900/40 dark:text-nuvora-400">{i + 1}</span>
                <p className="text-text-secondary">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {content.faqs.length > 0 && (
          <section className="mt-12">
            <FaqSection items={content.faqs} title={`${label} Converter — FAQs`} />
          </section>
        )}

        <section className="mt-12">
          <div className="rounded-2xl border border-border-subtle bg-gradient-to-br from-nuvora-50/30 to-surface p-8 text-center dark:from-nuvora-950/20">
            <h2 className="text-2xl font-bold text-text-primary">Try Nuvora&apos;s Free {label} Converter</h2>
            <p className="mt-2 text-text-secondary">
              Fast, private, and reliable. No signup required, no file uploads to servers, no limits. Simply paste your {pair.source.toUpperCase()} data and convert it to {pair.target.toUpperCase()} instantly in your browser.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href={`/convert`}
                className="inline-flex items-center rounded-xl bg-nuvora-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-nuvora-600/20 transition-all hover:bg-nuvora-700"
              >
                Browse All Converters
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
