import type { Metadata } from "next";
import { DnsToolLookup } from "@/components/dns/dns-tool-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "dns-zone-validator";
const pageTitle = "DNS Zone Validator — Check DNS Configuration Integrity";
const pageDescription = "Validate DNS zone configuration for any domain. Scan A, AAAA, MX, NS, TXT, CNAME, and SOA records. Detect missing records, misconfigurations, and potential issues.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "DNS Zone Validator" },
];

const beginnerGuide = [
  { title: "What does a DNS zone validation check?", content: "A zone validation checks that all essential DNS record types are properly configured for your domain. It verifies that A/AAAA records resolve, MX records exist for email delivery, nameservers are properly delegated, TXT records carry SPF/DKIM/DMARC, and the SOA record has correct serial numbering. Think of it as a health check for your entire DNS configuration." },
  { title: "Why zone validation matters", content: "DNS misconfigurations are a leading cause of website outages and email delivery failures. A missing A record makes your website invisible. A wrong MX record redirects email to the wrong server. Forgetting to increment the SOA serial number means secondary nameservers never see your changes. A zone validator catches these issues before they cause problems." },
  { title: "Common zone validation failures", content: "Missing A/AAAA records (website unreachable), missing MX records (can't receive email), CNAME at zone apex (invalid configuration according to RFC 1034 section 3.6.2), inconsistent NS records between registrars and zone, outdated SOA serial numbers, and missing SPF/DKIM/DMARC TXT records." },
];

const faqItems: FaqItem[] = [
  { question: "What is a zone apex and why can't it have a CNAME?", answer: "The zone apex is the root of your domain (example.com without www). RFC 1034 section 3.6.2 prohibits CNAME records at the apex because a CNAME must be the only record type for a name, but the apex requires SOA and NS records. Use an A/AAAA record, an ALIAS/ANAME record (supported by some providers), or a URL redirect instead." },
  { question: "How do SOA serial numbers work?", answer: "The SOA serial number is a version counter incremented whenever zone data changes. Secondary nameservers check it to decide whether to initiate a zone transfer. Common formats: YYYYMMDDNN (date + revision, e.g., 2026070801) or a simple incremental number. If the serial doesn't increase after a change, secondaries won't update and old records remain active." },
  { question: "What is the difference between an A record and a CNAME?", answer: "An A record directly maps a hostname to an IP address (e.g., www.example.com → 192.0.2.1). A CNAME maps a hostname to another hostname (e.g., www.example.com → example.com). CNAMEs add an extra resolution step and cannot coexist with other record types at the same name. A records are simpler and slightly faster." },
];

export default function DnsZoneValidatorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <DnsToolLookup lookupType="zone" title="DNS Zone Validator" description="Validate DNS zone configuration" placeholder="example.com" beginnerGuide={beginnerGuide} />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About DNS Zone Validation" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Search", title: "DNS Lookup", description: "Query all DNS record types", href: "/dns-lookup" },
              { icon: "Lock", title: "DNSSEC Checker", description: "Verify DNSSEC signing", href: "/dnssec-checker" },
              { icon: "Search", title: "Nameserver Analyzer", description: "Analyze nameserver setup", href: "/nameserver-analyzer" },
              { icon: "Search", title: "CAA Lookup", description: "Check CA Authorization", href: "/caa-lookup" },
            ]}
            title="Related DNS Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
