import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs, JsonLd, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug } from "@/lib/registry";
import { generateAllProgrammaticPages } from "@/lib/programmatic/generator";

const PAGES = generateAllProgrammaticPages();

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES.find((p) => p.slug === slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/best/${slug}` },
    twitter: { card: "summary_large_image", title: page.title, description: page.description },
    alternates: { canonical: `${SITE_URL}/best/${slug}` },
  };
}

export default async function BestToolsPage({ params }: Props) {
  const { slug } = await params;
  const page = PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  const tools = page.toolIds.map((id) => getToolBySlug(id)).filter(Boolean);
  const breadcrumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Tools", href: `${SITE_URL}/tools` },
    { label: page.h1 },
  ];
  const faqItems: FaqItem[] = page.faqItems;

  return (
    <>
      <JsonLd data={webPageSchema({ name: page.h1, description: page.description, url: `${SITE_URL}/best/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {faqItems.length > 0 && <JsonLd data={faqSchema(faqItems)} />}

      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">{page.h1}</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{page.intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {page.sections.map((section, i) => (
          <div key={i} className="mb-8 last:mb-0">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{section.heading}</h2>
            <p className="text-zinc-600 dark:text-zinc-400">{section.body}</p>
          </div>
        ))}
      </section>

      {tools.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Tools on This Page</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => tool && (
              <Link key={tool.id} href={tool.url} className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{tool.name}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions" />
        </section>
      )}
    </>
  );
}
