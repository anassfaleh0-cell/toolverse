import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free Developer Tools Online — Code, Format, Convert | ToolVerse",
  description:
    "Compare the best free online developer tools. Format code, encode data, convert formats, and test APIs. We review DevToys, Beautifier.io, CodeBeautify, FreeFormatter, OnlineTools.dev, and ToolVerse.",
  openGraph: {
    title: "Best Free Developer Tools Online — Code, Format, Convert | ToolVerse",
    description:
      "Compare the best free online developer tools. Format code, encode data, convert formats, and test APIs.",
    url: `${SITE_URL}/best-online/best-developer-tools`,
  },
  twitter: {
    title: "Best Free Developer Tools Online — Code, Format, Convert | ToolVerse",
    description:
      "Compare the best free online developer tools. Format code, encode data, convert formats, and test APIs.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-developer-tools` },
};

const title = "Best Free Online Developer Tools";
const description =
  "Compare free developer utilities for code formatting, data encoding, format conversion, and API testing. Find your ideal dev toolkit.";
const canonicalUrl = `${SITE_URL}/best-online/best-developer-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "Developer Tools" },
];

const matrixHeaders = ["Feature", "DevToys", "Beautifier.io", "CodeBeautify", "FreeFormatter", "OnlineTools.dev", "ToolVerse"];
const matrixRows = [
  { feature: "Free Tier Available", values: [true, true, true, true, true, true] },
  { feature: "JSON Formatter", values: [true, true, true, true, true, true] },
  { feature: "HTML/CSS/JS Minifier", values: [true, true, true, true, true, true] },
  { feature: "Base64 Encoder/Decoder", values: [true, true, true, true, true, true] },
  { feature: "URL Encoder/Decoder", values: [true, true, true, true, true, true] },
  { feature: "SQL Formatter", values: [true, false, true, true, false, true] },
  { feature: "JWT Decoder", values: [true, false, false, false, false, true] },
  { feature: "Regex Tester", values: [true, false, false, true, false, true] },
  { feature: "UUID Generator", values: [true, false, false, true, false, true] },
  { feature: "Hash Generator (MD5/SHA)", values: [true, false, true, true, true, true] },
  { feature: "Markdown Preview", values: [true, false, false, false, false, true] },
  { feature: "Client-Side Only", values: [false, true, true, true, true, true] },
  { feature: "Dark Mode", values: [true, false, false, false, false, true] },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the most comprehensive free developer tools platform?",
    answer:
      "DevToys (Windows app) and ToolVerse offer the widest range of developer utilities. DevToys works as a desktop app with over 20 tools. ToolVerse provides browser-based tools including JSON formatter, JWT decoder, regex tester, hash generator, and more — all client-side.",
  },
  {
    question: "Which developer tools work offline or client-side?",
    answer:
      "Beautifier.io, CodeBeautify, FreeFormatter, OnlineTools.dev, and ToolVerse all process data client-side in the browser. ToolVerse also offers dark mode and a unified experience across all its tools.",
  },
  {
    question: "Can I decode JWT tokens online without security risks?",
    answer:
      "Yes. ToolVerse JWT Decoder processes everything in your browser using the Web Crypto API. Your token never leaves your device.",
  },
];

export default function BestDeveloperToolsPage() {
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
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Developer Tool Comparison</h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Feature Comparison" />
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Developer Tools — Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Related Tool Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/best-online/best-json-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best JSON Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Format, validate, and convert JSON.</p>
          </Link>
          <Link href="/best-online/best-dns-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best DNS Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">DNS lookup, propagation, and WHOIS.</p>
          </Link>
          <Link href="/best-online/best-seo-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best SEO Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Audit and optimize for search engines.</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Format Your Code Now</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Free, no sign-up. Choose from 20+ developer tools.</p>
          <Link href="/tools" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Browse All Dev Tools
          </Link>
        </div>
      </section>
    </>
  );
}
