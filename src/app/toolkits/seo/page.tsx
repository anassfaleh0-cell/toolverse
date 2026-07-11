import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import { JsonLd, Breadcrumbs, FaqSection } from "@/components/shared";
import { webPageSchema, breadcrumbSchema, faqSchema, type FaqItem } from "@/lib/seo";

const slug = "toolkits/seo";
const pageTitle = "SEO Toolkit — Free SEO Tools for Website Optimization — Nuvora";
const pageDescription =
  "Curated collection of free SEO tools for technical analysis, content optimization, and website performance monitoring. Improve your search rankings today.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${slug}`,
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const icons: Record<string, string> = {
  "ssl-certificate-checker": "🔒",
  "http-headers-checker": "📧",
  "website-status-checker": "💡",
  "dns-lookup": "🌐",
  "dns-propagation-checker": "🔄",
  "whois-lookup": "🔍",
  "text-to-slug": "🕹️",
  "ping-test": "📡",
};

const tools = [
  {
    id: "ssl-certificate-checker",
    name: "SSL Certificate Checker",
    description:
      "Check SSL/TLS certificate details for any domain. Ensure HTTPS is properly configured with valid certificates.",
    href: "/ssl-certificate-checker",
  },
  {
    id: "http-headers-checker",
    name: "HTTP Headers Checker",
    description:
      "Analyze HTTP response headers for any URL. Check cache policies, security headers, and redirect chains that affect SEO.",
    href: "/http-headers-checker",
  },
  {
    id: "website-status-checker",
    name: "Website Status Checker",
    description:
      "Check if a website is online and responding. Monitor uptime, HTTP status codes, and response times for SEO-critical pages.",
    href: "/website-status-checker",
  },
  {
    id: "dns-lookup",
    name: "DNS Lookup",
    description:
      "Look up DNS records including A, AAAA, CNAME, MX, and TXT records. Verify DNS configuration affects domain authority.",
    href: "/dns-lookup",
  },
  {
    id: "dns-propagation-checker",
    name: "DNS Propagation Checker",
    description:
      "Check DNS propagation across global servers. Verify that DNS changes have reached major resolvers worldwide.",
    href: "/dns-propagation-checker",
  },
  {
    id: "whois-lookup",
    name: "WHOIS Lookup",
    description:
      "Look up domain registration details including registrar, expiration date, and name servers for domain authority research.",
    href: "/whois-lookup",
  },
  {
    id: "text-to-slug",
    name: "Text to Slug Converter",
    description:
      "Convert any text to an SEO-friendly URL slug. Generate clean, keyword-rich URLs optimized for search engines.",
    href: "/text-to-slug",
  },
  {
    id: "ping-test",
    name: "Ping Test",
    description:
      "Test network latency to any host. Measure response times that affect Core Web Vitals and user experience metrics.",
    href: "/ping-test",
  },
];

const sections = [
  {
    title: "Technical SEO",
    description:
      "Audit the technical foundation of your website including SSL configuration, HTTP headers, DNS records, and domain registration. A technically sound site is the first step toward higher rankings.",
    tools: tools.filter((t) =>
      [
        "ssl-certificate-checker",
        "http-headers-checker",
        "dns-lookup",
        "dns-propagation-checker",
        "whois-lookup",
      ].includes(t.id),
    ),
  },
  {
    title: "Content SEO",
    description:
      "Optimize your content with clean, keyword-rich URL slugs. Ensure your content is accessible and properly structured for both users and search engine crawlers.",
    tools: tools.filter((t) => t.id === "text-to-slug"),
  },
  {
    title: "Website Performance",
    description:
      "Monitor website uptime, response times, and server latency. Fast-loading pages rank higher and provide better user experiences. Track these metrics with our performance tools.",
    tools: tools.filter((t) =>
      ["website-status-checker", "ping-test"].includes(t.id),
    ),
  },
];

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Toolkits" },
  { label: "SEO Toolkit" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the SEO Toolkit?",
    answer:
      "The SEO Toolkit is a curated set of free online tools for search engine optimization. It covers technical SEO audits, content URL optimization, and website performance monitoring.",
  },
  {
    question: "How can I check if my SSL certificate affects SEO?",
    answer:
      "Google uses HTTPS as a ranking signal. Use the SSL Certificate Checker to verify your certificate is valid, trusted, and not expired. A valid SSL certificate is essential for good search rankings.",
  },
  {
    question: "Why are HTTP headers important for SEO?",
    answer:
      "HTTP headers control caching, redirects, and security policies. Improper headers can cause duplicate content issues, slow page loads, and security warnings that hurt rankings.",
  },
  {
    question: "How does DNS propagation affect my website?",
    answer:
      "After changing DNS records, propagation delays can cause intermittent downtime across different regions. The DNS Propagation Checker helps you monitor when changes go live globally.",
  },
  {
    question: "What makes a good URL slug for SEO?",
    answer:
      "A good URL slug is short, descriptive, and includes relevant keywords. Use hyphens between words, avoid special characters, and keep it readable for both users and search engines.",
  },
  {
    question: "How does website speed affect SEO?",
    answer:
      "Page speed is a direct ranking factor in Google's algorithm. Use the Website Status Checker and Ping Test to monitor response times and identify performance bottlenecks.",
  },
  {
    question: "Are these SEO tools completely free?",
    answer:
      "Yes, every tool in the SEO Toolkit is completely free to use with no limits, registration, or hidden fees.",
  },
];

export default function SeoToolkitPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: pageTitle,
          description: pageDescription,
          url: `${SITE_URL}/${slug}`,
          breadcrumbs,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          SEO Toolkit
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {pageDescription}
        </p>

        {sections.map((section) => (
          <section key={section.title} className="mt-16">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {section.title}
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {section.description}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-xl border border-zinc-200 p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{icons[tool.id]}</span>
                    <div>
                      <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                        {tool.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-16">
          <FaqSection items={faqItems} />
        </section>
      </div>
    </>
  );
}
