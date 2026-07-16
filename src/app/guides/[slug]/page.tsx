import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHowToSlugs } from "@/lib/content/programmatic-slugs";
import { generateHowToGuide, generateMetaForGuide } from "@/lib/content/programmatic-content";
import { getGuides } from "@/lib/content/registry";
import { ArticleLayout } from "@/components/blog/article-layout";
import { Breadcrumbs, JsonLd, FaqSection } from "@/components/shared";
import { breadcrumbSchema, faqSchema, howToSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

function formatLabel(text: string): string {
  return text.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function generateStaticParams() {
  const howTo = getHowToSlugs().map((p) => ({ slug: p.slug }));
  const content = getGuides().map((g) => ({ slug: g.slug }));
  return [...howTo, ...content];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const contentGuide = getGuides().find((g) => g.slug === slug);
  if (contentGuide) {
    return {
      title: contentGuide.title,
      description: contentGuide.description,
      openGraph: { title: contentGuide.title, description: contentGuide.description, url: `${SITE_URL}/guides/${slug}` },
      alternates: { canonical: `${SITE_URL}/guides/${slug}` },
      robots: { index: true, follow: true },
    };
  }
  const entry = getHowToSlugs().find((s) => s.slug === slug);
  if (!entry) return {};
  const topic = entry.topic ?? slug.replace(/-/g, " ");
  const meta = generateMetaForGuide(topic);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, url: `${SITE_URL}/guides/${slug}` },
    alternates: { canonical: `${SITE_URL}/guides/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;

  const contentGuide = getGuides().find((g) => g.slug === slug);
  if (contentGuide) {
    return <ArticleLayout piece={contentGuide} basePath="guides" />;
  }

  const slugs = getHowToSlugs();
  const entry = slugs.find((s) => s.slug === slug);
  if (!entry) notFound();

  const steps = generateHowToGuide(entry.topic, entry.tool);
  const topicDisplay = formatLabel(entry.topic);
  const meta = generateMetaForGuide(entry.topic);

  const breadcrumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Guides", href: `${SITE_URL}/guides` },
    { label: `How to ${topicDisplay}` },
  ];

  const howToSchemaSteps = steps.map((s) => ({ name: s.title, text: s.body }));

  const faqItems = [
    { question: `How do I ${formatLabel(entry.topic).toLowerCase()} online for free?`, answer: `Follow the step-by-step instructions above. ${SITE_NAME} provides a free, browser-based tool that requires no signup and processes everything locally on your device.` },
    { question: `Is it safe to ${formatLabel(entry.topic).toLowerCase()} using online tools?`, answer: `Yes. ${SITE_NAME} tools process everything locally in your browser — your data never leaves your device. No files are uploaded to any server, ensuring complete privacy and security.` },
    { question: `Do I need any special software or skills?`, answer: `No special software or technical skills are required. The tool is designed for everyone, from beginners to experts. Simply follow the steps above and you will get the job done in minutes.` },
    { question: `Can I use this tool on mobile devices?`, answer: `Yes, all ${SITE_NAME} tools are fully responsive and work on smartphones, tablets, and desktop browsers with the same functionality.` },
  ];

  return (
    <>
      <JsonLd data={webPageSchema({ name: meta.title, description: meta.description, url: `${SITE_URL}/guides/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={howToSchema({ name: meta.title, description: meta.description, steps: howToSchemaSteps })} />
      <JsonLd data={faqSchema(faqItems)} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">{meta.title}</h1>
        <p className="mt-4 text-lg text-text-secondary">{meta.description}</p>

        <section className="mt-8">
          <p className="leading-relaxed text-text-secondary">
            Follow this step-by-step guide to {entry.topic.replace(/-/g, " ")} online for free using {SITE_NAME}.
            All processing happens in your browser — no signup, no uploads, and no data leaves your device.
            Whether you are a beginner or an experienced user, these instructions will help you get the job done quickly.
          </p>
        </section>

        <section className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-text-primary">Step-by-Step Instructions</h2>
          {steps.map((step) => (
            <div key={step.step} className="rounded-2xl border border-border-subtle bg-surface p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-aurora-700 text-lg font-bold text-white">
                  {step.step}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-text-secondary">{step.body}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-bold text-text-primary">Tips for Best Results</h2>
          <ul className="mt-4 space-y-2 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aurora-600" />
              Ensure your input data is clean and properly formatted before starting
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aurora-600" />
              Use the preview option to verify results before downloading
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aurora-600" />
              Bookmark the tool for quick access to repeat the process in the future
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aurora-600" />
              Combine this tool with other {SITE_NAME} tools for a complete workflow
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <FaqSection
            items={faqItems}
            title="Frequently Asked Questions"
          />
        </section>

        <section className="mt-12 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center rounded-lg bg-aurora-700 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-aurora-800"
          >
            Explore All {SITE_NAME} Tools
          </Link>
        </section>
      </div>
    </>
  );
}
