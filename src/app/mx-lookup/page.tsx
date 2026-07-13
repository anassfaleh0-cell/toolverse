import type { Metadata } from "next";
import { EmailAuthLookup } from "@/components/email-suite/email-auth-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "mx-lookup";
const pageTitle = "MX Lookup — Check Mail Exchange Records";
const pageDescription = "Look up MX (Mail Exchange) records for any domain. Find mail servers, verify priority order, detect configuration issues, and troubleshoot email delivery per RFC 5321.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "MX Lookup" },
];

const beginnerGuide = [
  { title: "How MX records work", content: "MX (Mail Exchange) records tell the internet which servers handle email for your domain. Each MX record has a priority number (lower = higher priority). When someone sends an email to user@yourdomain.com, the sending server looks up your MX records, tries the lowest priority server first, and falls back to higher priority servers if the primary is unavailable. This provides redundancy." },
  { title: "MX record priority explained", content: "Priority values range from 0 to 65535. The server with the lowest number is tried first (primary). Example: priority 10 mail1.example.com, priority 20 mail2.example.com. If the primary (priority 10) is down, mail goes to the backup (priority 20). Never use the same priority for multiple servers unless they're configured in a load-balanced pool." },
  { title: "Common MX configuration patterns", content: "Google Workspace: ASPMX.L.GOOGLE.COM (priority 1) with ALT1-ALT4 as backups (priorities 5-30). Microsoft 365: yourdomain.mail.protection.outlook.com (priority 0). Self-hosted: mail.yourdomain.com. Always have at least two MX records for redundancy so email queuing doesn't delay delivery if your primary server is temporarily unavailable." },
];

const faqItems: FaqItem[] = [
  { question: "Can I have MX records pointing to different providers?", answer: "Yes, but this is risky. You can have MX records pointing to Google Workspace and Microsoft 365 simultaneously, but each receiving server accepts email independently. If both accept the same email, there will be duplicate deliveries. If only one accepts, messages may be split between providers. Most organizations route all mail to one provider and use the other only for backup during outages." },
  { question: "What is the difference between A records and MX records?", answer: "An A record maps a hostname to an IP address (e.g., mail.example.com → 192.0.2.1). An MX record specifies which hostname handles email for the domain, along with a priority. MX records must point to hostnames (not IP addresses), and those hostnames must have corresponding A or AAAA records. You can test this with our DNS Lookup tool." },
  { question: "Why does my MX lookup show no results?", answer: "No MX records means the domain cannot receive email. Common causes: the domain has never configured email, MX records were accidentally deleted, or DNS propagation hasn't completed (can take up to 48 hours). Even if MX records are missing, some senders may attempt delivery to the domain's A record as a last resort, but this is not guaranteed." },
  { question: "Do I need MX records if I use Google Workspace?", answer: "Yes. Google Workspace requires MX records pointing to their servers (ASPMX.L.GOOGLE.COM and alternates). Without correct MX records, email sent to your domain will be rejected or delivered to an unconfigured server. Google provides specific MX records to add to your DNS zone — verify them with this lookup tool after making changes." },
];

export default function MxLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <EmailAuthLookup lookupType="mx" title="MX Lookup" description="Check MX records for any domain" placeholder="example.com" beginnerGuide={beginnerGuide} />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About MX Records" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Mail", title: "SPF Lookup", description: "Check authorized mail servers", href: "/spf-lookup" },
              { icon: "Key", title: "DKIM Lookup", description: "Check email signing configuration", href: "/dkim-lookup" },
              { icon: "Shield", title: "DMARC Lookup", description: "Verify email authentication policy", href: "/dmarc-lookup" },
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
