import type { Metadata } from "next";
import { EmailAuthLookup } from "@/components/email-suite/email-auth-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd, FeaturedSnippet, ComparisonTable } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "spf-lookup";
const pageTitle = "SPF Lookup — Check Sender Policy Framework Records";
const pageDescription = "Look up SPF (Sender Policy Framework) records for any domain. Verify which mail servers are authorized to send email and detect spoofing vulnerabilities.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "SPF Lookup" },
];

const beginnerGuide = [
  { title: "How does SPF work?", content: "When a mail server receives an incoming message, it checks the domain in the Return-Path address. It then looks up the SPF record for that domain. If the sending server's IP address matches one of the authorized IPs in the SPF record, the check passes. If not, the server applies the policy defined in the record (softfail, fail, or neutral)." },
  { title: "What do SPF mechanisms mean?", content: "ip4: allows specific IPv4 addresses or ranges. include: delegates authorization to another domain's SPF record. a: allows the domain's A record IP. mx: allows the domain's MX server IPs. all at the end defines the default policy: -all (fail, reject), ~all (softfail, mark as suspicious), ?all (neutral)." },
  { title: "Common SPF mistakes", content: "Using +all (pass all) makes SPF useless. Exceeding 10 DNS lookups causes SPF to fail permanently. Including too many third-party services like Google, Microsoft, Salesforce, and Mailchimp can exceed the lookup limit. Always end with -all for production domains." },
];

const faqItems: FaqItem[] = [
  { question: "What is the SPF DNS lookup limit?", answer: "SPF has a hard limit of 10 DNS lookups per check, as defined in RFC 7208 section 4.6.4. Each include:, a:, mx:, ptr:, and exists: counts as one lookup. ip4: and ip6: do not count. Exceeding 10 causes a permanent error (PermError), and receiving servers will treat the email as if no SPF record exists. Use our Lookup tool to check the lookup count and our Generator to create optimized records." },
  { question: "Does SPF alone prevent email spoofing?", answer: "No. SPF alone is insufficient because it only checks the envelope sender (Return-Path), not the From header that users see. An attacker can spoof the From header while using their own domain in the Return-Path, passing SPF. This is called 'SPF bypass' or 'From header spoofing'. You must combine SPF with DKIM and DMARC (p=quarantine or p=reject) for full protection." },
  { question: "Why does my SPF record show multiple include: statements?", answer: "Each third-party email service requires its own include: statement. For example, Google Workspace uses include:_spf.google.com, Microsoft 365 uses include:spf.protection.outlook.com, and Salesforce uses include:_spf.salesforce.com. Each include counts toward the 10-lookup limit. Use SPF macros or consider using a subdomain for less critical services to stay within limits." },
  { question: "What does a missing SPF record mean for deliverability?", answer: "Without an SPF record, your domain has no SPF status (none), which means DMARC cannot align on SPF. This reduces your email authentication score and can cause delivery to spam folders. Many receiving servers (Gmail, Outlook, Yahoo) now require SPF + DKIM + DMARC for inbox delivery. According to Google's 2024 email sender requirements, bulk senders must have valid SPF records." },
];

export default function SpfLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <EmailAuthLookup lookupType="spf" title="SPF Lookup" description="Check SPF records for any domain" placeholder="example.com" beginnerGuide={beginnerGuide} />
          </ToolHero>
        </ToolLayout>
      </section>

      <FeaturedSnippet
        toolName="SPF Lookup"
        answer="SPF (Sender Policy Framework) is an email authentication protocol that specifies which mail servers are authorized to send email on behalf of a domain, published as a TXT record. SPF alone is insufficient to prevent spoofing because it only checks the envelope sender, not the From header. Full email authentication requires combining SPF with DKIM (digital signatures) and DMARC (policy enforcement) for comprehensive protection against spoofing and phishing."
        keyTakeaways={[
          "SPF specifies authorized mail servers via a TXT record with ip4, include, a, mx mechanisms",
          "SPF alone cannot prevent From-header spoofing — DKIM and DMARC are required",
          "Hard limit of 10 DNS lookups per SPF check (RFC 7208) — exceeding causes PermError",
          "Combine SPF, DKIM, and DMARC with p=quarantine or p=reject for full protection",
        ]}
      />

      <ComparisonTable
        title="Email Authentication Protocol Comparison"
        headers={["Protocol", "What It Checks", "Protects Against", "Requirement Level"]}
        rows={[
          ["SPF", "Envelope sender (Return-Path) IP authorization", "Direct envelope spoofing", "Minimum — required by Gmail/Outlook"],
          ["DKIM", "Cryptographic signature on email headers/body", "Content tampering, replay attacks", "Recommended — required for DMARC alignment"],
          ["DMARC", "Policy enforcement based on SPF/DKIM alignment", "From-header spoofing, phishing", "Strongly recommended — p=reject for full protection"],
        ]}
        caption="SPF, DKIM, and DMARC work together. Missing any one protocol leaves a gap that attackers can exploit."
      />

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About SPF Records" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Mail", title: "DKIM Lookup", description: "Check email signing configuration", href: "/dkim-lookup" },
              { icon: "Shield", title: "DMARC Lookup", description: "Verify email authentication policy", href: "/dmarc-lookup" },
              { icon: "Send", title: "MX Lookup", description: "Find mail server records", href: "/mx-lookup" },
              { icon: "Tag", title: "BIMI Lookup", description: "Check brand logo association", href: "/bimi-lookup" },
            ]}
            title="Related Email Authentication Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
