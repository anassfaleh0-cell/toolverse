import type { Metadata } from "next";
import { DnsToolLookup } from "@/components/dns/dns-tool-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "email-deliverability-checker";
const pageTitle = "Email Deliverability Checker — SPF, DKIM, DMARC & MX Audit";
const pageDescription = "Check email deliverability health for any domain. Audit SPF, DKIM, DMARC, MX, and PTR records. Get a deliverability score with actionable recommendations to improve inbox placement.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "Email Deliverability Checker" },
];

const beginnerGuide = [
  { title: "What affects email deliverability?", content: "Six factors determine whether your email lands in the inbox vs spam folder: (1) SPF record — authorizes which servers can send email. (2) DKIM signature — verifies email integrity and sender. (3) DMARC policy — tells receivers how to handle unauthenticated email. (4) MX records — ensures the domain can receive email. (5) PTR record — reverse DNS for sending IPs. (6) Blacklist status — whether your IP or domain is on any blocklists." },
  { title: "The email authentication trifecta", content: "SPF + DKIM + DMARC form the email authentication trifecta. SPF validates the sending server. DKIM validates the message integrity and sender. DMARC ties them together with a policy. According to Google's 2024 sender guidelines, bulk senders sending more than 5,000 messages per day to Gmail addresses must have SPF, DKIM, and DMARC configured. Yahoo has similar requirements." },
  { title: "What is a good deliverability score?", content: "70-100: Good. Your domain has proper email authentication configured. 40-69: Needs improvement. Some authentication mechanisms are missing or misconfigured. 0-39: Poor. Your domain is vulnerable to spoofing and email delivery is likely affected. Review the issues found and fix them in order of importance: SPF first, DKIM second, DMARC third." },
];

const faqItems: FaqItem[] = [
  { question: "Why does PTR (reverse DNS) matter for email deliverability?", answer: "Many receiving mail servers perform a PTR lookup on the sending IP address and verify it matches the HELO/EHLO hostname. If the PTR record is missing or doesn't match, your email is more likely to be flagged as spam. RFC 1912 recommends that every SMTP server should have a PTR record matching the hostname used in the HELO command. This is essential for outbound mail servers." },
  { question: "Can I send email without DMARC?", answer: "Yes, but it's risky and increasingly required. Google and Yahoo now require DMARC for bulk senders (5,000+ messages/day to their platforms). Even for small senders, DMARC gives you visibility into who is sending email from your domain and lets you control what happens to unauthenticated email. Without DMARC, attackers can spoof your domain and recipients can't distinguish real from fake." },
  { question: "What is the impact of missing SPF on deliverability?", answer: "Missing SPF means your domain has no SPF status (none). DMARC alignment for SPF will always fail. Many receiving servers (Gmail, Outlook, Yahoo) add a spam score for missing SPF. Even if your email is legitimate, it may be delivered to spam or rejected. SPF is the easiest authentication mechanism to implement and should be the first one you configure." },
  { question: "How often should I check my deliverability?", answer: "Check after any configuration change (new email provider, new sending platform, DNS migration). Monitor monthly to ensure records haven't been accidentally removed during other DNS changes. Set up DMARC reporting (rua) for continuous monitoring — reports will alert you to authentication failures before they become deliverability problems." },
];

export default function EmailDeliverabilityCheckerPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <DnsToolLookup lookupType="email-deliverability" title="Email Deliverability Checker" description="Audit email authentication health" placeholder="example.com" beginnerGuide={beginnerGuide} />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Email Deliverability" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Mail", title: "SPF Lookup", description: "Check SPF records", href: "/spf-lookup" },
              { icon: "Shield", title: "DMARC Lookup", description: "Check DMARC policies", href: "/dmarc-lookup" },
              { icon: "Key", title: "DKIM Lookup", description: "Check DKIM signing", href: "/dkim-lookup" },
              { icon: "Send", title: "MX Lookup", description: "Check mail servers", href: "/mx-lookup" },
            ]}
            title="Related Email Authentication Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
