import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free Productivity Tools Online — Calculators, Converters | Nuvora",
  description:
    "Compare the best free online productivity tools. IP lookup, password generators, calculators, unit converters, and more. Find tools that boost your daily workflow.",
  openGraph: {
    title: "Best Free Productivity Tools Online — Calculators, Converters | Nuvora",
    description:
      "Compare the best free online productivity tools. IP lookup, password generators, calculators, unit converters, and more.",
    url: `${SITE_URL}/best-online/best-productivity-tools`,
  },
  twitter: {
    title: "Best Free Productivity Tools Online — Calculators, Converters | Nuvora",
    description:
      "Compare the best free online productivity tools. IP lookup, password generators, calculators, unit converters, and more.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-productivity-tools` },
};

const title = "Best Free Online Productivity Tools";
const description =
  "Compare free online productivity tools including what-is-my-IP, password generators, calculators, and unit converters. Boost your daily efficiency.";
const canonicalUrl = `${SITE_URL}/best-online/best-productivity-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "Productivity Tools" },
];

const matrixHeaders = ["Feature", "Nuvora", "Calculator.net", "UnitConverters.net", "Online-Convert", "RapidTables", "PureCalculators"];
const matrixRows = [
  { feature: "Free Tier Available", values: [true, true, true, true, true, true] },
  { feature: "What Is My IP", values: [true, false, false, false, false, false] },
  { feature: "Password Generator", values: [true, true, false, false, false, true] },
  { feature: "Scientific Calculator", values: [true, true, false, true, true, true] },
  { feature: "Unit Converter", values: [true, true, true, true, true, true] },
  { feature: "Currency Converter", values: [false, true, true, true, true, true] },
  { feature: "Date/Time Calculator", values: [true, true, false, false, false, true] },
  { feature: "UUID Generator", values: [true, false, false, false, false, false] },
  { feature: "Text Utilities", values: [true, false, false, false, false, false] },
  { feature: "Bulk Operations", values: [true, false, false, true, false, false] },
  { feature: "No Registration", values: [true, true, true, true, true, true] },
  { feature: "Dark Mode", values: [true, false, false, false, false, false] },
];

const faqItems: FaqItem[] = [
  {
    question: "What are the most useful free productivity tools?",
    answer:
      "A What-Is-My-IP tool, password generator, unit converter, and scientific calculator cover the most common daily needs. Nuvora combines all of these with text utilities and UUID generation — all free with no sign-up.",
  },
  {
    question: "Which free tool suite includes a password generator?",
    answer:
      "Nuvora and Calculator.net both include free password generators. Nuvora offers customizable length, character types, and bulk generation options.",
  },
  {
    question: "Can I find my public IP address online for free?",
    answer:
      "Yes. Nuvora What Is My IP shows your public IPv4 and IPv6 address, ISP, location, and user agent — instantly with no ads or tracking.",
  },
];

export default function BestProductivityToolsPage() {
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
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Productivity Tool Comparison</h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Feature Comparison" />
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Productivity Tools — Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Related Tool Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/best-online/best-json-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best JSON Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Format, validate, and convert JSON data.</p>
          </Link>
          <Link href="/best-online/best-developer-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Developer Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Code formatting, encoding, and testing.</p>
          </Link>
          <Link href="/best-online/best-free-online-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">All Free Online Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Complete directory of free utilities.</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Boost Your Productivity Now</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Free, no sign-up. Calculators, converters, generators, and more.</p>
          <Link href="/tools" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Browse Productivity Tools
          </Link>
        </div>
      </section>
    </>
  );
}
