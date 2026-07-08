import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free Website Tools Online — Check, Audit, Fix | ToolVerse",
  description:
    "Compare the best free website monitoring and analysis tools. Uptime monitoring, performance testing, SEO audits, and security checks. We review GTmetrix, Pingdom, Google PageSpeed, Site24x7, UptimeRobot, and ToolVerse Website Check.",
  openGraph: {
    title: "Best Free Website Tools Online — Check, Audit, Fix | ToolVerse",
    description:
      "Compare the best free website monitoring and analysis tools. Uptime monitoring, performance testing, SEO audits, and security checks.",
    url: `${SITE_URL}/best-online/best-website-tools`,
  },
  twitter: {
    title: "Best Free Website Tools Online — Check, Audit, Fix | ToolVerse",
    description:
      "Compare the best free website monitoring and analysis tools. Uptime monitoring, performance testing, SEO audits, and security checks.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-website-tools` },
};

const title = "Best Free Online Website Tools";
const description =
  "Compare free website monitoring, performance testing, SEO auditing, and security checking tools. Keep your site healthy.";
const canonicalUrl = `${SITE_URL}/best-online/best-website-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "Website Tools" },
];

const matrixHeaders = ["Feature", "GTmetrix", "Pingdom", "Google PageSpeed", "Site24x7", "UptimeRobot", "ToolVerse Website Check"];
const matrixRows = [
  { feature: "Free Tier Available", values: [true, true, true, true, true, true] },
  { feature: "Uptime Monitoring (Free)", values: ["—", true, "—", true, true, "—"] },
  { feature: "Performance Score", values: [true, true, true, true, false, true] },
  { feature: "Core Web Vitals", values: [true, true, true, false, false, true] },
  { feature: "HTTP Headers Check", values: [true, false, true, true, false, true] },
  { feature: "SSL Certificate Check", values: [true, false, false, true, false, true] },
  { feature: "DNS Analysis", values: [false, false, false, false, false, true] },
  { feature: "Redirect Chain Audit", values: [true, false, false, false, false, true] },
  { feature: "Mobile Report", values: [true, true, true, false, false, true] },
  { feature: "Waterfall Chart", values: [true, true, false, true, false, false] },
  { feature: "No Registration", values: [false, false, true, false, false, true] },
  { feature: "Dark Mode", values: [false, false, false, false, false, true] },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the best free website performance testing tool?",
    answer:
      "Google PageSpeed Insights provides authoritative Core Web Vitals data directly from Chrome UX reports. GTmetrix offers detailed waterfall charts. ToolVerse Website Check combines performance, HTTP headers, SSL, and DNS checks in one place with no registration.",
  },
  {
    question: "Which free tool monitors website uptime?",
    answer:
      "Site24x7 (1 monitor free) and UptimeRobot (50 monitors free) both offer free uptime monitoring with email alerts. ToolVerse Website Check provides on-demand status checks without ongoing monitoring.",
  },
  {
    question: "Can I check HTTP headers and SSL certificates for free?",
    answer:
      "Yes. ToolVerse Website Check includes HTTP headers inspection, SSL certificate validation, and DNS analysis in a single free tool — no account needed.",
  },
];

export default function BestWebsiteToolsPage() {
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
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Website Tool Comparison</h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Feature Comparison" />
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Website Tools — Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Related Tool Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/best-online/best-seo-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best SEO Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Meta tags, schema, and sitemap auditing.</p>
          </Link>
          <Link href="/best-online/best-security-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Security Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">SSL, headers, and port scanning.</p>
          </Link>
          <Link href="/best-online/best-dns-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best DNS Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">DNS lookup, propagation, and WHOIS.</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Check Your Website Now</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Free, no sign-up. Get performance, SSL, headers, and DNS analysis.</p>
          <Link href="/website-status-checker" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Check Website
          </Link>
        </div>
      </section>
    </>
  );
}
