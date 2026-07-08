import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free Marketing Tools Online — SEO, Analytics, Content | ToolVerse",
  description:
    "Compare the best free online marketing tools. Keyword analysis, content optimization, and social media tools. Find free marketing utilities that deliver results.",
  openGraph: {
    title: "Best Free Marketing Tools Online — SEO, Analytics, Content | ToolVerse",
    description:
      "Compare the best free online marketing tools. Keyword analysis, content optimization, and social media tools.",
    url: `${SITE_URL}/best-online/best-marketing-tools`,
  },
  twitter: {
    title: "Best Free Marketing Tools Online — SEO, Analytics, Content | ToolVerse",
    description:
      "Compare the best free online marketing tools. Keyword analysis, content optimization, and social media tools.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-marketing-tools` },
};

const title = "Best Free Online Marketing Tools";
const description =
  "Compare free marketing tools for keyword analysis, content optimization, and social media management. Improve your digital marketing ROI.";
const canonicalUrl = `${SITE_URL}/best-online/best-marketing-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "Marketing Tools" },
];

const matrixHeaders = ["Feature", "ToolVerse", "Ahrefs Free", "SEMrush Free", "Moz Free", "Canva Free", "Buffer Free"];
const matrixRows = [
  { feature: "Free Tier Available", values: [true, true, true, true, true, true] },
  { feature: "Keyword Analysis", values: [true, true, true, true, false, false] },
  { feature: "Content Optimization", values: [true, true, true, true, true, false] },
  { feature: "SEO Audit", values: [true, true, true, true, false, false] },
  { feature: "Social Media Scheduling", values: [false, false, false, false, false, true] },
  { feature: "Graphic Design", values: [false, false, false, false, true, false] },
  { feature: "Website Monitoring", values: [true, true, true, true, false, false] },
  { feature: "Backlink Analysis", values: [true, true, true, true, false, false] },
  { feature: "Competitor Research", values: [true, true, true, true, false, false] },
  { feature: "Page Speed Check", values: [true, false, false, false, false, false] },
  { feature: "No Registration", values: [true, false, false, false, true, false] },
  { feature: "Dark Mode", values: [true, false, false, false, true, false] },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the best free marketing tool suite for small businesses?",
    answer:
      "ToolVerse offers free SEO audits, keyword analysis, website monitoring, and competitor research — all without registration. For social media scheduling, Buffer Free is excellent. Canva Free covers graphic design needs.",
  },
  {
    question: "Can I do keyword research online for free?",
    answer:
      "Yes. Ahrefs Free, SEMrush Free, Moz Free, and ToolVerse all offer free keyword analysis tools. ToolVerse also includes content optimization and SEO auditing in a single free platform.",
  },
  {
    question: "Which free marketing tools work without registration?",
    answer:
      "ToolVerse and Canva Free offer substantial functionality without requiring an account. Most other marketing tools (Ahrefs, SEMrush, Moz, Buffer) require a free registration.",
  },
];

export default function BestMarketingToolsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, url: canonicalUrl, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">{title}</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{description}</p>
          <div className="mt-6">
            <SocialShare url={canonicalUrl} title={title} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Marketing Tool Comparison</h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Feature Comparison" />
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Marketing Tools — Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Related Tool Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/best-online/best-seo-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best SEO Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Meta tags, schema, and sitemap auditing.</p>
          </Link>
          <Link href="/best-online/best-website-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Website Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Uptime, performance, and security monitoring.</p>
          </Link>
          <Link href="/best-online/best-ai-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best AI Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">AI-powered content and text generation.</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Improve Your Marketing Now</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Free, no sign-up. Audit, analyze, and optimize.</p>
          <Link href="/tools" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Browse Marketing Tools
          </Link>
        </div>
      </section>
    </>
  );
}
