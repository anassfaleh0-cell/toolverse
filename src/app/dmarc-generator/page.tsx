import type { Metadata } from "next";
import { DmarcGenerator } from "@/components/email-suite/dmarc-generator";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "dmarc-generator";
const pageTitle = "DMARC Record Generator — Create Domain-based Authentication Policies (RFC 7489)";
const pageDescription = "Generate DMARC records for your domain with deployment strategy guide. Configure policies, reporting addresses, alignment settings, and receive recommendations. Includes BIND zone export and tag reference.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "DMARC Record Generator" },
];

const faqItems: FaqItem[] = [
  { question: "What DMARC policy should I start with?", answer: "Start with p=none and set rua to receive aggregate reports. Monitor for 2-4 weeks to identify all legitimate email senders. Check reports for SPF/DKIM failures from your own systems. Fix any issues, then progress to p=quarantine, and finally p=reject. This phased approach (RFC 7489 section 6.6) prevents blocking legitimate email." },
  { question: "What is the difference between adkim and aspf?", answer: "adkim (DKIM alignment) controls whether the DKIM d= domain must exactly match the From header domain. s=strict requires exact match; r=relaxed allows subdomains. aspf (SPF alignment) controls the same for the envelope Return-Path domain. Relaxed is recommended for most setups because third-party senders often use subdomains or different domains for the Return-Path." },
  { question: "How do I read DMARC aggregate reports?", answer: "Aggregate reports (rua) are XML files sent daily or weekly. Each report shows: the reporting organization, the policies applied, and per-record data for each source IP including SPF/DKIM results, disposition (pass/fail), and message count. Use a DMARC report parser like dmarcian, Postmark, or EasyDMARC to visualize this data. Reports are critical for identifying misconfigured senders before enforcing." },
  { question: "What should my DMARC pct value be?", answer: "Start at pct=5-10 to test enforcement on a small sample. Gradually increase by 10-20% each week while monitoring reports. If pct=10 shows no issues, move to 20%, then 40%, 60%, 80%, and finally 100%. Each increase should be validated against reports to ensure no legitimate email is blocked. This gradual rollout is recommended by RFC 7489 section 13.2." },
];

export default function DmarcGeneratorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <DmarcGenerator />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About DMARC Records" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📧", title: "SPF Generator", description: "Create SPF records", href: "/spf-generator" },
              { icon: "🔑", title: "DKIM Validator", description: "Validate DKIM records", href: "/dkim-validator" },
              { icon: "📨", title: "MX Lookup", description: "Find mail servers", href: "/mx-lookup" },
              { icon: "🏷️", title: "DMARC Lookup", description: "Check existing DMARC policy", href: "/dmarc-lookup" },
            ]}
            title="Related Email Authentication Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
