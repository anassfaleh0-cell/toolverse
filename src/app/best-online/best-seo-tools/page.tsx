import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free SEO Tools Online — Audit, Optimize, Analyze | Nuvora",
  description:
    "Compare the best free online SEO tools. Audit meta tags, headers, schema markup, sitemaps, and redirects. We review Google Search Console, Ahrefs Free, SEMrush Free, Moz Free, SEO Site Checkup, and Nuvora SEO Suite.",
  openGraph: {
    title: "Best Free SEO Tools Online — Audit, Optimize, Analyze | Nuvora",
    description:
      "Compare the best free online SEO tools. Audit meta tags, headers, schema markup, sitemaps, and redirects.",
    url: `${SITE_URL}/best-online/best-seo-tools`,
  },
  twitter: {
    title: "Best Free SEO Tools Online — Audit, Optimize, Analyze | Nuvora",
    description:
      "Compare the best free online SEO tools. Audit meta tags, headers, schema markup, sitemaps, and redirects.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-seo-tools` },
};

const title = "Best Free Online SEO Tools";
const description =
  "Compare free SEO audit tools to analyze meta tags, headers, schema markup, sitemaps, and redirects. Improve your search rankings.";
const canonicalUrl = `${SITE_URL}/best-online/best-seo-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "SEO Tools" },
];

const matrixHeaders = ["Feature", "Google Search Console", "Ahrefs Free", "SEMrush Free", "Moz Free", "SEO Site Checkup", "Nuvora SEO Suite"];
const matrixRows = [
  { feature: "Free Tier Available", values: [true, true, true, true, true, true] },
  { feature: "Meta Tag Analysis", values: [true, true, true, true, true, true] },
  { feature: "Header (H1-H6) Audit", values: [true, true, true, true, true, true] },
  { feature: "Schema Markup Checker", values: [true, true, true, true, true, true] },
  { feature: "Sitemap Validation", values: [true, true, true, true, true, true] },
  { feature: "Redirect Chain Check", values: [true, true, true, true, true, true] },
  { feature: "Keyword Research", values: [true, true, true, true, false, true] },
  { feature: "Backlink Analysis", values: [true, true, true, true, false, true] },
  { feature: "Mobile-Friendly Test", values: [true, false, false, false, true, true] },
  { feature: "Core Web Vitals", values: [true, false, false, false, false, true] },
  { feature: "No Account Required", values: [false, false, false, false, true, true] },
  { feature: "Dark Mode", values: [false, false, false, false, false, true] },
];

const faqItems: FaqItem[] = [
  {
    question: "Which free SEO tool is best for technical audits?",
    answer:
      "Nuvora SEO Suite (coming soon) and SEO Site Checkup are excellent for quick technical audits without requiring an account. Google Search Console is essential for Core Web Vitals and index coverage data.",
  },
  {
    question: "Can I check schema markup for free?",
    answer:
      "Yes. Google Search Console's Rich Results report, Ahrefs Free Webmaster Tools, and Nuvora SEO Suite all provide free schema markup validation.",
  },
  {
    question: "Do I need an account to use free SEO tools?",
    answer:
      "SEO Site Checkup and Nuvora SEO Suite allow instant checks without registration. Others like Ahrefs Free, SEMrush Free, and Google Search Console require a free account.",
  },
];

export default function BestSeoToolsPage() {
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
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">SEO Tool Comparison</h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Feature Comparison" />
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="SEO Tools — Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Related Tool Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/best-online/best-website-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Website Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Uptime, performance, and security monitoring.</p>
          </Link>
          <Link href="/best-online/best-marketing-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Marketing Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Keyword analysis, content optimization.</p>
          </Link>
          <Link href="/best-online/best-developer-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Developer Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Code formatting and testing utilities.</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Audit Your Website SEO</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Free, no sign-up. Check your meta tags, headers, and more.</p>
          <Link href="/tools" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Browse SEO Tools
          </Link>
        </div>
      </section>
    </>
  );
}
