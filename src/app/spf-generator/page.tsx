import type { Metadata } from "next";
import { SpfGenerator } from "@/components/email-suite/spf-generator";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "spf-generator";
const pageTitle = "SPF Record Generator — Create Sender Policy Framework Records (RFC 7208)";
const pageDescription = "Generate SPF records for your domain with live DNS lookup counter. Configure authorized senders, IP ranges, and policy to prevent email spoofing. Includes BIND zone export and verification commands.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "SPF Record Generator" },
];

const faqItems: FaqItem[] = [
  { question: "What is the difference between ~all and -all?", answer: "~all (SoftFail, RFC 7208 section 5.5) marks unauthorized email as suspicious but delivers it. Use during testing. -all (Fail, RFC 7208 section 5.6) rejects unauthorized email. Use in production after verifying all legitimate senders are included. The key difference: ~all still delivers (to spam often), -all rejects permanently." },
  { question: "Why does the 10 DNS lookup limit matter?", answer: "RFC 7208 section 4.6.4 mandates a maximum of 10 DNS lookups during SPF evaluation. Each include:, a:, mx:, ptr:, and exists: counts as one lookup. If exceeded, receiving servers return a PermError and treat the email as if no SPF exists. ip4: and ip6: don't count. Our generator shows your current count and warns when approaching the limit." },
  { question: "How do I add Google Workspace to my SPF record?", answer: "Add an 'include' mechanism with value '_spf.google.com'. This delegates authorization to Google's SPF record, which covers all Google Workspace IPs. Similarly, for Microsoft 365 use 'include:spf.protection.outlook.com', for Amazon SES use 'include:amazonses.com', and for Mailchimp use 'include:servers.mcsv.net'." },
  { question: "What's the correct SPF record for multiple email providers?", answer: "Add multiple include: statements — one per provider. Example: 'v=spf1 include:_spf.google.com include:spf.protection.outlook.com include:_spf.salesforce.com ~all'. Each include counts toward the 10-lookup limit. If you have many providers, consider using subdomains for less critical services to stay under the limit." },
];

export default function SpfGeneratorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <SpfGenerator />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About SPF Records" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📧", title: "SPF Lookup", description: "Check existing SPF records", href: "/spf-lookup" },
              { icon: "🛡️", title: "DMARC Generator", description: "Create DMARC policies", href: "/dmarc-generator" },
              { icon: "🔑", title: "DKIM Validator", description: "Validate DKIM records", href: "/dkim-validator" },
              { icon: "📨", title: "MX Lookup", description: "Find mail servers", href: "/mx-lookup" },
            ]}
            title="Related Email Authentication Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
