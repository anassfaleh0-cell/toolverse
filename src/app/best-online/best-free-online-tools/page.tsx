import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free Online Tools — Complete Directory of Free Utilities | ToolVerse",
  description:
    "The complete directory of free online tools. Compare ToolVerse, iLovePDF, TinyWow, Online-Convert, Convertio, and 123Apps. Find tools for PDF, images, video, audio, and more.",
  openGraph: {
    title: "Best Free Online Tools — Complete Directory of Free Utilities | ToolVerse",
    description:
      "The complete directory of free online tools. Compare ToolVerse, iLovePDF, TinyWow, Online-Convert, Convertio, and 123Apps.",
    url: `${SITE_URL}/best-online/best-free-online-tools`,
  },
  twitter: {
    title: "Best Free Online Tools — Complete Directory of Free Utilities | ToolVerse",
    description:
      "The complete directory of free online tools. Compare ToolVerse, iLovePDF, TinyWow, Online-Convert, Convertio, and 123Apps.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-free-online-tools` },
};

const title = "Best Free Online Tools — Directory";
const description =
  "Your complete guide to the best free online tools. Compare major platforms across PDF, image, video, audio, and developer utilities.";
const canonicalUrl = `${SITE_URL}/best-online/best-free-online-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "Free Online Tools Directory" },
];

const matrixHeaders = ["Feature", "ToolVerse", "iLovePDF", "TinyWow", "Online-Convert", "Convertio", "123Apps"];
const matrixRows = [
  { feature: "PDF Tools", values: ["Coming Soon", true, true, true, true, true] },
  { feature: "Image Tools", values: [true, true, true, true, true, true] },
  { feature: "Video Tools", values: [false, false, true, true, true, true] },
  { feature: "Audio Tools", values: [false, false, true, true, true, true] },
  { feature: "Developer Tools", values: [true, false, false, false, false, true] },
  { feature: "Network/IT Tools", values: [true, false, false, false, false, false] },
  { feature: "Security Tools", values: [true, false, false, false, false, false] },
  { feature: "SEO Tools", values: [true, false, false, false, false, false] },
  { feature: "Text Tools", values: [true, false, true, true, false, true] },
  { feature: "No Daily Limit", values: [true, false, true, false, false, true] },
  { feature: "No Sign-Up Required", values: [true, false, true, true, false, true] },
  { feature: "Dark Mode", values: [true, false, false, false, false, false] },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the best all-around free online tools platform?",
    answer:
      "ToolVerse offers the widest variety of categories — developer, network, security, SEO, text, and image tools — all with no sign-up, no daily limits, and dark mode. For specialized PDF or media conversion, iLovePDF and Convertio are excellent choices.",
  },
  {
    question: "Which free tool platform has no daily usage limits?",
    answer:
      "ToolVerse and TinyWow offer unlimited daily usage on their free tiers. Convertio and Online-Convert impose file size and conversion limits. iLovePDF allows about 25 tasks per day on its free plan.",
  },
  {
    question: "Which platforms do not require registration?",
    answer:
      "ToolVerse, TinyWow, and Online-Convert allow you to use most features without creating an account. Convertio and 123Apps require sign-up for some functionality.",
  },
];

export default function BestFreeOnlineToolsPage() {
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
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Platform Comparison</h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Category Coverage" />
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Tool Category Directory</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">PDF Tools</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Merge, split, compress, and convert PDF documents.</p>
            <Link href="/best-online/best-pdf-tools" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">Compare PDF Tools →</Link>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Image Tools</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Resize, compress, and convert images between formats.</p>
            <Link href="/best-online/best-image-tools" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">Compare Image Tools →</Link>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Developer Tools</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Format code, encode data, test regex, and debug APIs.</p>
            <Link href="/best-online/best-developer-tools" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">Compare Dev Tools →</Link>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">DNS & Network Tools</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">DNS lookup, propagation check, WHOIS, and ping test.</p>
            <Link href="/best-online/best-dns-tools" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">Compare DNS Tools →</Link>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">SEO Tools</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Audit meta tags, schema, sitemaps, and redirects.</p>
            <Link href="/best-online/best-seo-tools" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">Compare SEO Tools →</Link>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Security Tools</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">SSL checker, headers audit, and port scanner.</p>
            <Link href="/best-online/best-security-tools" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">Compare Security Tools →</Link>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Related Tool Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/best-online/best-productivity-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Productivity Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Calculators, converters, and generators.</p>
          </Link>
          <Link href="/best-online/best-ai-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best AI Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">AI text, image, and code generation.</p>
          </Link>
          <Link href="/best-online/best-marketing-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Marketing Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Keyword, content, and social tools.</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Start Using Free Tools</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">All free, no sign-up, no limits. Explore our complete toolkit.</p>
          <Link href="/tools" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Browse All Tools
          </Link>
        </div>
      </section>
    </>
  );
}
