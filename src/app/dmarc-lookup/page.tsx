import type { Metadata } from "next";
import { EmailAuthLookup } from "@/components/email-suite/email-auth-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "dmarc-lookup";
const pageTitle = "DMARC Lookup — Check Domain-based Message Authentication Records";
const pageDescription = "Look up DMARC records for any domain. Verify email authentication policies, analyze reporting configuration, and check enforcement levels per RFC 7489.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "DMARC Lookup" },
];

const beginnerGuide = [
  { title: "How DMARC builds on SPF and DKIM", content: "DMARC (Domain-based Message Authentication, Reporting & Conformance, RFC 7489) ties SPF and DKIM together with a policy. Even if SPF or DKIM individually pass, DMARC checks 'alignment' — whether the domain in the From header matches the authenticated domain. DMARC then tells receivers what to do if both checks fail: none (monitor), quarantine (spam), or reject (block)." },
  { title: "Understanding DMARC policies", content: "p=none (monitor): No action taken. Email is delivered normally. Use this to collect data before enforcing. p=quarantine: Suspicious email is sent to the spam/junk folder. p=reject: Email is rejected outright (best protection). Most domains should start at p=none, monitor for 2-4 weeks, then move to p=quarantine, then p=reject." },
  { title: "What are DMARC reports?", content: "DMARC reports come in two types: Aggregate reports (rua) — daily XML summaries showing how many emails passed/failed SPF and DKIM from each source IP. Forensic reports (ruf) — individual details on specific failed messages. Reports are sent to the email address specified in the rua/ruf tags. Services like Postmark, EasyDMARC, and dmarcian can parse these reports." },
];

const faqItems: FaqItem[] = [
  { question: "What is the difference between p= and sp= in DMARC?", answer: "p= sets the policy for the main domain. sp= sets the policy for all subdomains. If sp= is not specified, subdomains inherit the p= policy. Example: p=reject; sp=none means the main domain rejects failures while subdomains only monitor. This is useful for domains with subdomains used for different purposes (e.g., marketing emails from subdomains)." },
  { question: "How do DMARC reports help with email security?", answer: "Aggregate reports (rua) show you which systems send email on your behalf, which IPs are authorized, and whether SPF/DKIM are properly configured. This is crucial before moving to enforcement — you might discover that a legitimate service (CRM, marketing platform, transactional email) fails authentication and would be blocked under p=reject. Review reports for 2-4 weeks before enforcing." },
  { question: "What percentage (pct) should I start with?", answer: "Start with pct=5-10 to test enforcement on a small sample. Gradually increase by 10-20% each week as you verify that legitimate email passes authentication. This phased approach prevents blocking legitimate traffic if SPF or DKIM are not fully configured for all email sources." },
  { question: "What DMARC tags are required vs optional?", answer: "Required: v=DMARC1 (version) and p= (policy for the domain). Strongly recommended: rua= (aggregate report URI) for visibility. Optional but useful: sp= (subdomain policy), pct= (percentage to filter), adkim= (DKIM alignment mode: r=relaxed, s=strict), aspf= (SPF alignment mode), fo= (failure reporting options), rf= (report format, default AFRF), ri= (report interval, default 86400 seconds)." },
];

export default function DmarcLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <EmailAuthLookup lookupType="dmarc" title="DMARC Lookup" description="Check DMARC records for any domain" placeholder="example.com" beginnerGuide={beginnerGuide} />
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
              { icon: "📧", title: "SPF Lookup", description: "Check authorized mail servers", href: "/spf-lookup" },
              { icon: "🔑", title: "DKIM Lookup", description: "Check email signing configuration", href: "/dkim-lookup" },
              { icon: "📨", title: "MX Lookup", description: "Find mail server records", href: "/mx-lookup" },
              { icon: "🏷️", title: "BIMI Lookup", description: "Check brand logo association", href: "/bimi-lookup" },
            ]}
            title="Related Email Authentication Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
