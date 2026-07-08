import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free JSON Tools Online — Formatter, Validator, Converter | ToolVerse",
  description:
    "Compare the best free online JSON tools. Format, validate, view tree structures, and convert between CSV, XML, and YAML. We review JSONLint, JSONFormatter, JSONGen, JSON Viewer, JSON Compare, and ToolVerse JSON Formatter.",
  openGraph: {
    title: "Best Free JSON Tools Online — Formatter, Validator, Converter | ToolVerse",
    description:
      "Compare the best free online JSON tools. Format, validate, view tree structures, and convert between CSV, XML, and YAML.",
    url: `${SITE_URL}/best-online/best-json-tools`,
  },
  twitter: {
    title: "Best Free JSON Tools Online — Formatter, Validator, Converter | ToolVerse",
    description:
      "Compare the best free online JSON tools. Format, validate, view tree structures, and convert between CSV, XML, and YAML.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-json-tools` },
};

const title = "Best Free Online JSON Tools";
const description =
  "Compare free JSON formatters, validators, tree viewers, and converters. Format, validate, and transform JSON data online.";
const canonicalUrl = `${SITE_URL}/best-online/best-json-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "JSON Tools" },
];

const matrixHeaders = ["Feature", "JSONLint", "JSONFormatter", "JSONGen", "JSON Viewer", "JSON Compare", "ToolVerse JSON Formatter"];
const matrixRows = [
  { feature: "Free Tier Available", values: [true, true, true, true, true, true] },
  { feature: "JSON Formatting/Beautify", values: [true, true, true, true, false, true] },
  { feature: "JSON Validation", values: [true, true, true, true, true, true] },
  { feature: "Tree View", values: [false, false, false, true, false, true] },
  { feature: "JSON Minification", values: [true, true, true, false, false, true] },
  { feature: "JSON to CSV", values: [false, false, false, false, false, true] },
  { feature: "JSON to XML", values: [false, false, true, false, false, true] },
  { feature: "JSON to YAML", values: [false, false, true, false, false, true] },
  { feature: "JSON Compare (Diff)", values: [false, false, false, false, true, true] },
  { feature: "Search/Path Query", values: [false, false, false, false, false, true] },
  { feature: "Client-Side Processing", values: [true, true, false, true, true, true] },
  { feature: "Dark Mode", values: [false, false, false, false, false, true] },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the best free JSON validator?",
    answer:
      "JSONLint is the most popular free JSON validator — fast and reliable. ToolVerse JSON Formatter also offers validation with detailed error messages plus formatting, tree view, and format conversion in one place.",
  },
  {
    question: "Can I convert JSON to CSV or XML online?",
    answer:
      "Yes. ToolVerse JSON Formatter supports JSON to CSV, XML, and YAML conversion. JSONGen also supports XML and YAML output. These tools handle nested structures intelligently.",
  },
  {
    question: "Which JSON tool works entirely client-side?",
    answer:
      "JSONLint and ToolVerse JSON Formatter both process JSON entirely in your browser — no data is sent to any server. This is important when working with sensitive data.",
  },
];

export default function BestJsonToolsPage() {
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
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">JSON Tool Comparison</h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Feature Comparison" />
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="JSON Tools — Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Related Tool Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/best-online/best-developer-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Developer Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Code formatting, encoding, and testing utilities.</p>
          </Link>
          <Link href="/best-online/best-ai-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best AI Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Text and code generation with AI.</p>
          </Link>
          <Link href="/best-online/best-productivity-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Productivity Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Calculators, converters, and utilities.</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Format Your JSON Now</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Free, no sign-up. Paste and format instantly.</p>
          <Link href="/json-formatter" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Try JSON Formatter
          </Link>
        </div>
      </section>
    </>
  );
}
