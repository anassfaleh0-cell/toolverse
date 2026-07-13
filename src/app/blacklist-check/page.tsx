import type { Metadata } from "next";
import { BlacklistCheck } from "@/components/network/blacklist-check";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "blacklist-check";
const pageTitle = "Blacklist Check — IP & Domain Reputation on 10+ DNSBLs";
const pageDescription = "Check if your IP address or domain is listed on 10+ DNS blacklists including Spamhaus, SpamCop, Barracuda, SORBS, and more. Free DNSBL reputation lookup.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "Blacklist Check" },
];

const beginnerGuide = [
  { title: "What are DNS blacklists (DNSBLs)?", content: "DNSBLs (DNS-based Blackhole Lists) are databases of IP addresses known to send spam or engage in malicious activity. Mail servers query DNSBLs in real time to decide whether to accept or reject incoming email. Being listed on a major DNSBL like Spamhaus or SpamCop can severely impact email deliverability — your emails may be bounced or sent directly to spam folders." },
  { title: "Why would my IP be blacklisted?", content: "Common reasons: (1) An open mail relay on your network. (2) A compromised machine sending spam. (3) Shared hosting IPs that were blacklisted by another tenant. (4) Misconfigured reverse DNS (PTR). (5) Sending to spam trap addresses. (6) Sudden high volume from a new IP (cold IP warming required). Most blacklists have removal procedures once you fix the issue." },
  { title: "How to get delisted from a DNSBL", answer: "Each DNSBL has its own delisting process. Spamhaus: visit https://www.spamhaus.org/lookup/ and request removal after securing your server. SpamCop: file a removal request after fixing the issue. Barracuda: contact their support. The most important step is fixing the root cause (closing open relays, removing malware, etc.) before requesting delisting, or you'll be re-listed quickly." },
];

const faqItems: FaqItem[] = [
  { question: "What is the most authoritative DNSBL?", answer: "Spamhaus (zen.spamhaus.org) is the most widely used DNSBL, consulted by most major email providers including Gmail, Outlook, and Yahoo. Spamhaus ZEN combines multiple Spamhaus blocklists (SBL, XBL, PBL) into a single query. If you're listed on Spamhaus, your email deliverability will be severely impacted. Check and resolve Spamhaus listings first." },
  { question: "How often do DNSBLs update?", answer: "Most DNSBLs update within minutes to a few hours. Spamhaus updates its blocklists continuously based on their spam trap network and user reports. SpamCop updates based on user submissions. When you fix the issue causing the listing and request delisting, propagation typically takes 1-24 hours across all servers querying the DNSBL." },
  { question: "Can shared hosting IPs be blacklisted?", answer: "Yes. If another website on the same shared IP sends spam, the entire IP can be blacklisted. Your email will be affected even though you did nothing wrong. Solutions: (1) Request a dedicated IP from your hosting provider. (2) Use a transactional email service (SendGrid, Amazon SES, Mailgun) which manages IP reputation. (3) Monitor your IP reputation regularly with this tool." },
  { question: "What is the difference between IP-based and domain-based blacklists?", answer: "IP-based blacklists (DNSBLs) list IP addresses known for spamming, checked via DNS queries. Domain-based blacklists (DBLs) list domains associated with spam in email content or URLs. Spamhaus DBL is a domain-based list. Both operate via DNS queries. This tool checks IP-based lists. For email delivery, both IP and domain reputation matter." },
];

export default function BlacklistCheckPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <BlacklistCheck />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Blacklist Checks" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools tools={[
            { icon: "Mail", title: "Email Deliverability Check", description: "Full email health audit", href: "/email-deliverability-checker" },
            { icon: "Search", title: "DNS Lookup", description: "Query all DNS record types", href: "/dns-lookup" },
            { icon: "Send", title: "MX Lookup", description: "Check mail server records", href: "/mx-lookup" },
            { icon: "Search", title: "ASN Lookup", description: "Find ASN for any IP", href: "/asn-lookup" },
          ]} title="Related Network Security Tools" />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
