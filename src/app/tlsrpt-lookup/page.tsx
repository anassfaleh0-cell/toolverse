import type { Metadata } from "next";
import { DnsToolLookup } from "@/components/dns/dns-tool-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "tlsrpt-lookup";
const pageTitle = "TLSRPT Lookup — Check TLS Reporting Records (RFC 8460)";
const pageDescription = "Look up TLSRPT (TLS Reporting) records for any domain. Verify TLS reporting configuration for SMTP and receive reports on TLS connection failures.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "TLSRPT Lookup" },
];

const beginnerGuide = [
  { title: "What is TLS Reporting (TLSRPT)?", content: "TLSRPT (TLS Reporting, RFC 8460) lets domain owners receive reports about TLS connection failures when other mail servers try to deliver email to their domain. If you have MTA-STS enabled, TLSRPT tells you when TLS connections are failing so you can fix issues before they cause email loss. Reports are sent as compressed JSON via email." },
  { title: "TLSRPT record format", content: "TLSRPT records are TXT records at _smtp._tls.yourdomain.com. Format: v=TLSRPTv1; rua=mailto:reports@example.com. The rua= tag specifies where to send TLS failure reports (like DMARC's rua). Multiple rua addresses can be specified, separated by commas. Reports are typically sent daily if failures occurred." },
  { title: "Why use TLSRPT with MTA-STS?", content: "MTA-STS enforces TLS, but if there's a misconfiguration — a wrong MX hostname, a certificate error, or a TLS version mismatch — email will be rejected. TLSRPT tells you about these failures so you can fix them. Without TLSRPT, you won't know that legitimate email is being bounced. Always deploy TLSRPT before switching MTA-STS from testing to enforce." },
];

const faqItems: FaqItem[] = [
  { question: "How does TLSRPT differ from DMARC reporting?", answer: "DMARC reports (rua) tell you about SPF/DKIM authentication results. TLSRPT reports tell you about TLS connection failures — certificate errors, protocol mismatches, failed STARTTLS negotiations. Both use the rua=mailto: format and both send aggregate reports. They complement each other: DMARC for authentication, TLSRPT for transport security." },
  { question: "What format are TLSRPT reports in?", answer: "TLSRPT reports are in JSON format, compressed with GZIP, and attached to an email sent to the rua address. Each report contains: the organization name, contact info, report ID, date range, policy domain, and a list of failure details including failing MX hostname, TLS error type (certificate expired, hostname mismatch, TLS version, etc.), and timestamps." },
  { question: "Do I need TLSRPT if I don't have MTA-STS?", answer: "Without MTA-STS, TLSRPT has limited value because TLS failures don't result in email rejection (STARTTLS is opportunistic). However, TLSRPT can still help you identify TLS configuration issues before deploying MTA-STS. Set up TLSRPT first, monitor reports for a few weeks, fix any issues found, then deploy MTA-STS in testing mode." },
];

export default function TlsrptLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <DnsToolLookup lookupType="tlsrpt" title="TLSRPT Lookup" description="Check TLS reporting records" placeholder="example.com" beginnerGuide={beginnerGuide} />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About TLSRPT Records" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools tools={[
            { icon: "📧", title: "MTA-STS Lookup", description: "Check TLS enforcement policy", href: "/mta-sts-lookup" },
            { icon: "🛡️", title: "DMARC Lookup", description: "Check email authentication policy", href: "/dmarc-lookup" },
            { icon: "📨", title: "MX Lookup", description: "Check mail server records", href: "/mx-lookup" },
            { icon: "🔒", title: "DNSSEC Checker", description: "Verify DNSSEC signing", href: "/dnssec-checker" },
          ]} title="Related Email Security Tools" />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
