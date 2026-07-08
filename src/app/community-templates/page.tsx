import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Community Templates — Reusable Configurations | ${SITE_NAME}`,
  description: "Community-contributed templates and configurations for DNS, SSL, SEO, and network tools. Save time with pre-built setups from the ToolVerse community.",
  openGraph: { title: `Community Templates`, description: "Community-contributed templates for DNS, SSL, SEO, and network tools." },
  twitter: { title: `Community Templates`, description: "Community-contributed templates." },
  alternates: { canonical: `${SITE_URL}/community-templates` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Community Templates" }];

const TEMPLATES = [
  {
    title: "Quick SSL Certificate Checker",
    tool: "SSL Checker",
    toolHref: "/ssl-checker",
    description: "Monitor your domain's SSL certificate status. Check expiry, issuer, and chain validity. Run weekly to avoid certificate-related downtime.",
    author: "tls-admin",
    uses: 847,
  },
  {
    title: "DNS Propagation Watchlist",
    tool: "DNS Lookup",
    toolHref: "/dns-lookup",
    description: "Track DNS records across multiple record types (A, AAAA, MX, NS, TXT, CNAME) after making changes. Verify propagation globally.",
    author: "netops",
    uses: 612,
  },
  {
    title: "WHOIS Domain Research",
    tool: "WHOIS Lookup",
    toolHref: "/whois-lookup",
    description: "Complete domain intelligence lookup: registrar info, creation/expiry dates, name servers, and raw WHOIS data. Useful for domain acquisition research.",
    author: "domaintools",
    uses: 534,
  },
  {
    title: "Security Headers Audit",
    tool: "HTTP Headers Checker",
    toolHref: "/http-headers-check",
    description: "Scan your website for critical security headers: CSP, HSTS, X-Frame-Options, Permissions-Policy. Includes pass/fail scoring and recommendations.",
    author: "sec-eng",
    uses: 423,
  },
  {
    title: "DNSSEC Validation Check",
    tool: "DNSSEC Analyzer",
    toolHref: "/dnssec-analyzer",
    description: "Verify DNSSEC chain of trust for your domain. Ensure DS records, RRSIG signatures, and DNSKEY records are correctly configured.",
    author: "dns-ops",
    uses: 389,
  },
  {
    title: "HTTP/2 & HTTP/3 Protocol Check",
    tool: "HTTP/2 Checker",
    toolHref: "/http2-checker",
    description: "Verify HTTP/2 and HTTP/3 (QUIC) protocol support. Check ALPN negotiation, server push support, and protocol downgrade protection.",
    author: "webperf",
    uses: 312,
  },
  {
    title: "Email Server Configuration Check",
    tool: "Email Analyzer",
    toolHref: "/email-analyzer",
    description: "Validate SPF, DKIM, DMARC email authentication records. Check MX configuration and email delivery security. Essential before major email campaigns.",
    author: "email-ops",
    uses: 278,
  },
  {
    title: "Ping & Latency Baseline",
    tool: "Ping Tool",
    toolHref: "/ping-tool",
    description: "Establish latency baselines for your critical infrastructure. Run from multiple test locations to detect regional performance issues.",
    author: "neteng",
    uses: 245,
  },
];

export default function CommunityTemplatesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Community Templates — ${SITE_NAME}`, description: "Community-contributed templates.", url: `${SITE_URL}/community-templates`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Community Templates</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Pre-built templates contributed by the ToolVerse community. Use them to speed up your workflow.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="space-y-4">
          {TEMPLATES.map((tpl) => (
            <div key={tpl.title} className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">{tpl.title}</h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{tpl.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                    <Link href={tpl.toolHref} className="text-blue-600 hover:underline dark:text-blue-400">Use with {tpl.tool}</Link>
                    <span>by {tpl.author}</span>
                  </div>
                </div>
                <div className="shrink-0 text-center">
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{tpl.uses}</div>
                  <div className="text-xs text-zinc-500">uses</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Want to contribute a template?</p>
          <p className="mt-1 text-xs text-zinc-500">Community template submission coming soon.</p>
        </div>
      </section>
    </>
  );
}
