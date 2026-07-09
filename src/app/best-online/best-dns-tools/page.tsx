import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free DNS Tools Online — Lookup, Propagation, WHOIS | Nuvora",
  description:
    "Compare the best free online DNS tools. DNS lookup, propagation checking, reverse DNS, and WHOIS. We review DNS Checker, MXToolbox, WhatIsMyDNS, IntoDNS, DNSSEC Analyzer, and Nuvora DNS Lookup.",
  openGraph: {
    title: "Best Free DNS Tools Online — Lookup, Propagation, WHOIS | Nuvora",
    description:
      "Compare the best free online DNS tools. DNS lookup, propagation checking, reverse DNS, and WHOIS.",
    url: `${SITE_URL}/best-online/best-dns-tools`,
  },
  twitter: {
    title: "Best Free DNS Tools Online — Lookup, Propagation, WHOIS | Nuvora",
    description:
      "Compare the best free online DNS tools. DNS lookup, propagation checking, reverse DNS, and WHOIS.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-dns-tools` },
};

const title = "Best Free Online DNS Tools";
const description =
  "Compare free DNS lookup, propagation checker, reverse DNS, and WHOIS tools. Find the right DNS utility for your needs.";
const canonicalUrl = `${SITE_URL}/best-online/best-dns-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "DNS Tools" },
];

const matrixHeaders = ["Feature", "DNS Checker", "MXToolbox", "WhatIsMyDNS", "IntoDNS", "DNSSEC Analyzer", "Nuvora DNS Lookup"];
const matrixRows = [
  { feature: "Free Tier Available", values: [true, true, true, true, true, true] },
  { feature: "DNS Lookup (A, AAAA, MX, TXT)", values: [true, true, true, false, false, true] },
  { feature: "DNS Propagation Check", values: [true, true, true, false, false, true] },
  { feature: "Reverse DNS (PTR)", values: [true, true, false, false, false, true] },
  { feature: "WHOIS Lookup", values: [true, true, false, true, false, true] },
  { feature: "DNSSEC Validation", values: [false, false, false, true, true, true] },
  { feature: "Blacklist Check", values: [false, true, false, true, false, false] },
  { feature: "Global Resolver Map", values: [true, false, true, false, false, true] },
  { feature: "No Sign-Up Required", values: [true, true, true, true, true, true] },
  { feature: "API Available", values: [false, true, false, false, false, false] },
  { feature: "Dark Mode", values: [false, false, false, false, false, true] },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the best free DNS lookup tool?",
    answer:
      "Nuvora DNS Lookup offers comprehensive DNS record checking (A, AAAA, MX, TXT, CNAME, NS), propagation verification, and reverse DNS — all free with no sign-up. DNS Checker is also excellent for multi-location propagation checks.",
  },
  {
    question: "Can I check DNS propagation globally?",
    answer:
      "Yes. DNS Checker and Nuvora DNS Lookup both query multiple global resolvers to show where your DNS changes have propagated. This is essential after switching hosting or updating DNS records.",
  },
  {
    question: "What is DNSSEC and why should I check it?",
    answer:
      "DNSSEC adds cryptographic signatures to DNS records to prevent spoofing and cache poisoning. DNSSEC Analyzer and Nuvora DNS Lookup both verify whether your domain has valid DNSSEC signatures.",
  },
];

export default function BestDnsToolsPage() {
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
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">DNS Tool Comparison</h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Feature Comparison" />
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="DNS Tools — Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Related Tool Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/best-online/best-website-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Website Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Check uptime, performance, and SEO for any site.</p>
          </Link>
          <Link href="/best-online/best-security-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Security Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">SSL, headers, and port scanning tools.</p>
          </Link>
          <Link href="/best-online/best-developer-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Developer Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Code formatting, encoding, and testing utilities.</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Check Your DNS Now</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Free, no sign-up required. Just enter a domain.</p>
          <Link href="/dns-lookup" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Try DNS Lookup
          </Link>
        </div>
      </section>
    </>
  );
}
