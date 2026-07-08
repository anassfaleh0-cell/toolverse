import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free Security Tools Online — SSL, Headers, Scanner | ToolVerse",
  description:
    "Compare the best free online security tools. SSL certificate checking, HTTP headers auditing, and port scanning. We review SSL Labs, Mozilla Observatory, SecurityHeaders, Hardenize, ImmuniWeb, and ToolVerse Security.",
  openGraph: {
    title: "Best Free Security Tools Online — SSL, Headers, Scanner | ToolVerse",
    description:
      "Compare the best free online security tools. SSL certificate checking, HTTP headers auditing, and port scanning.",
    url: `${SITE_URL}/best-online/best-security-tools`,
  },
  twitter: {
    title: "Best Free Security Tools Online — SSL, Headers, Scanner | ToolVerse",
    description:
      "Compare the best free online security tools. SSL certificate checking, HTTP headers auditing, and port scanning.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-security-tools` },
};

const title = "Best Free Online Security Tools";
const description =
  "Compare free website security tools for SSL checking, HTTP headers auditing, port scanning, and overall security posture assessment.";
const canonicalUrl = `${SITE_URL}/best-online/best-security-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "Security Tools" },
];

const matrixHeaders = ["Feature", "SSL Labs", "Mozilla Observatory", "SecurityHeaders", "Hardenize", "ImmuniWeb", "ToolVerse Security"];
const matrixRows = [
  { feature: "Free Tier Available", values: [true, true, true, true, true, true] },
  { feature: "SSL/TLS Certificate Check", values: [true, true, false, true, true, true] },
  { feature: "Certificate Chain Analysis", values: [true, true, false, true, true, true] },
  { feature: "HTTP Security Headers", values: [false, true, true, true, true, true] },
  { feature: "Port Scanning", values: [false, false, false, true, true, true] },
  { feature: "DNS Security Check", values: [false, true, false, true, true, true] },
  { feature: "Security Grade/Rating", values: [true, true, true, true, true, true] },
  { feature: "Cipher Suite Details", values: [true, true, false, true, true, true] },
  { feature: "TLS Protocol Support", values: [true, true, false, true, true, true] },
  { feature: "No Registration Required", values: [true, true, true, false, false, true] },
  { feature: "Dark Mode", values: [false, false, false, false, false, true] },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the most comprehensive free SSL checker?",
    answer:
      "SSL Labs offers the most detailed SSL/TLS analysis including certificate chain, cipher suites, and protocol support. ToolVerse Security provides a quick SSL check with grade, expiration, and chain details — no registration needed.",
  },
  {
    question: "Which free tool audits HTTP security headers?",
    answer:
      "SecurityHeaders.com and Mozilla Observatory both provide excellent free HTTP security header audits. ToolVerse Security also includes security headers inspection alongside SSL and port checks.",
  },
  {
    question: "Can I scan my website for open ports for free?",
    answer:
      "Yes. Hardenize, ImmuniWeb, and ToolVerse Security all include port scanning in their free tiers. Port scanning helps identify unnecessary open ports that could be attack vectors.",
  },
];

export default function BestSecurityToolsPage() {
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
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Security Tool Comparison</h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Feature Comparison" />
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Security Tools — Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Related Tool Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/best-online/best-website-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Website Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Uptime, performance, and security monitoring.</p>
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
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Check Your Website Security</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Free, no sign-up. SSL, headers, and port check in one place.</p>
          <Link href="/ssl-certificate-checker" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Check SSL Certificate
          </Link>
        </div>
      </section>
    </>
  );
}
