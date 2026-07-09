import type { Metadata } from "next";
import { EmailAuthLookup } from "@/components/email-suite/email-auth-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "bimi-lookup";
const pageTitle = "BIMI Lookup — Check Brand Indicators for Message Identification";
const pageDescription = "Look up BIMI records for any domain. Verify brand logo association, check Verified Mark Certificate (VMC) status, and validate SVG logo configuration for email display.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "BIMI Lookup" },
];

const beginnerGuide = [
  { title: "What is BIMI and why is it important?", content: "BIMI (Brand Indicators for Message Identification) lets you display your brand logo next to authenticated emails in Gmail, Apple Mail, Yahoo, and Fastmail. When users see your logo in their inbox, they immediately recognize legitimate emails from your brand, reducing phishing risk and improving engagement. BIMI requires DMARC enforcement (p=quarantine or p=reject) to work." },
  { title: "BIMI requirements checklist", content: "To deploy BIMI: (1) DMARC must be set to p=quarantine or p=reject (not p=none). (2) Your logo must be an SVG Tiny 1.2 file hosted at a public URL. (3) For the blue verified checkmark in Gmail, you need a Verified Mark Certificate (VMC) from a trusted Certificate Authority (CA). (4) The BIMI DNS record is a TXT record at default._bimi.yourdomain.com." },
  { title: "What is a Verified Mark Certificate (VMC)?", content: "A VMC is a digital certificate that proves you own the trademark for your logo. It's issued by a CA like DigiCert or Entrust after a trademark validation process. VMCs cost around $1,000-1,500/year. Without a VMC, your logo can still appear in Gmail (but without the blue checkmark), Apple Mail, and Fastmail. Yahoo requires DMARC enforcement but not a VMC." },
];

const faqItems: FaqItem[] = [
  { question: "Which email clients support BIMI?", answer: "Gmail (with or without VMC, logo appears next to authenticated emails), Apple Mail (iOS 16+, macOS Ventura+), Yahoo Mail, and Fastmail. Outlook and Microsoft 365 do not currently support BIMI. Support is expanding — check the BIMI Group for the latest list. Gmail requires DMARC p=quarantine or p=reject; p=none won't display the logo." },
  { question: "What is the BIMI record format?", answer: "BIMI records are TXT records at default._bimi.yourdomain.com. Format: v=BIMI1; l=https://example.com/logo.svg; a=https://example.com/vmc.pem. The l= tag points to your SVG logo (required). The a= tag points to your VMC PEM file (optional but required for the blue checkmark in Gmail). The SVG must conform to the BIMI SVG profile (SVG Tiny 1.2, no scripts, specific structure)." },
  { question: "How does BIMI improve email security?", answer: "BIMI provides a visual indicator that email is authenticated and from a legitimate brand. This makes it significantly harder for phishers to impersonate your brand because: (1) The logo only appears on authenticated email (passing SPF + DKIM + DMARC). (2) Phishing emails without the logo are immediately suspicious. (3) The blue checkmark with VMC adds a trusted visual cue." },
  { question: "Can I test BIMI before purchasing a VMC?", answer: "Yes. You can set up BIMI without a VMC by publishing just the l= tag (logo URL). Your logo will display in Apple Mail and Fastmail without a VMC. Gmail will show the logo but without the blue checkmark. This lets you verify everything is working before investing in a VMC. Use our BIMI Lookup tool to verify your record is published correctly." },
];

export default function BimiLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <EmailAuthLookup lookupType="bimi" title="BIMI Lookup" description="Check BIMI records for any domain" placeholder="example.com" beginnerGuide={beginnerGuide} />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About BIMI Records" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📧", title: "SPF Lookup", description: "Check authorized mail servers", href: "/spf-lookup" },
              { icon: "🔑", title: "DKIM Lookup", description: "Check email signing configuration", href: "/dkim-lookup" },
              { icon: "🛡️", title: "DMARC Lookup", description: "Verify email authentication policy", href: "/dmarc-lookup" },
              { icon: "📨", title: "MX Lookup", description: "Find mail server records", href: "/mx-lookup" },
            ]}
            title="Related Email Authentication Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
