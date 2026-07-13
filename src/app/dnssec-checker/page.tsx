import type { Metadata } from "next";
import { DnsToolLookup } from "@/components/dns/dns-tool-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "dnssec-checker";
const pageTitle = "DNSSEC Checker — Verify DNS Security Extensions (RFC 4033)";
const pageDescription = "Check if a domain has DNSSEC enabled. Verify DNSKEY, RRSIG, and DS records to confirm cryptographic signing and protection against DNS spoofing and cache poisoning.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "DNSSEC Checker" },
];

const beginnerGuide = [
  { title: "What is DNSSEC and why does it matter?", content: "DNSSEC (DNS Security Extensions, RFC 4033-4035) cryptographically signs DNS records using public-key cryptography. Without DNSSEC, an attacker can intercept DNS queries and return fake IP addresses (DNS spoofing), redirecting users to malicious sites. DNSSEC lets resolvers verify that responses haven't been tampered with. Major TLDs (.com, .org, .net) require DNSSEC support." },
  { title: "How DNSSEC works", content: "The zone administrator generates a Key Signing Key (KSK) and Zone Signing Key (ZSK). The ZSK signs individual DNS records (A, MX, TXT, etc.) producing RRSIG records. The KSK signs the ZSK. The DS record (Delegation Signer) is published in the parent zone (.com, .org, etc.) creating a chain of trust from the root DNS servers down to your domain." },
  { title: "DNSSEC validation chain", content: "The resolver starts at the root DNS servers (trust anchor), then follows the chain: root → .com DS → .com DNSKEY → example.com DS → example.com DNSKEY → example.com RRSIG → example.com A record. If any link is broken, the resolver returns SERVFAIL with validation failure. Our checker verifies that DNSKEY, RRSIG, and DS records are all present." },
];

const faqItems: FaqItem[] = [
  { question: "What is the difference between KSK and ZSK?", answer: "The Key Signing Key (KSK) is the root of trust for the zone. It signs the Zone Signing Key (ZSK) and should have a longer key length (2048+ bits) and longer validity period. The ZSK signs individual DNS records and can be shorter (1024-2048 bits) and rotated more frequently (monthly). KSKs are typically rotated yearly." },
  { question: "What happens if DNSSEC validation fails?", answer: "If DNSSEC validation fails, the resolver returns SERVFAIL to the client. The website or service becomes unreachable even if the underlying A record is correct. This commonly happens when: (1) DNS records are updated but RRSIGs are not regenerated, (2) the DS record in the parent zone doesn't match the current KSK, (3) signatures have expired." },
  { question: "Is DNSSEC required for all domains?", answer: "DNSSEC is not technically required but is strongly recommended for any domain that handles sensitive data or authentication. Google's .app and .dev TLDs require DNSSEC. Many government domains (.gov) require it. DMARC and BIMI do not require DNSSEC, but it adds an important layer of security. Email authentication (SPF/DKIM/DMARC) works without DNSSEC." },
  { question: "How do I enable DNSSEC for my domain?", answer: "(1) Generate KSK and ZSK key pairs using tools like dnssec-keygen (BIND) or your DNS provider's control panel. (2) Sign your zone with the ZSK (creates RRSIG records). (3) Publish the DS record from your KSK in your domain registrar's DNSSEC management section. (4) Wait for parent zone propagation (may take up to 48 hours)." },
];

export default function DnssecCheckerPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <DnsToolLookup lookupType="dnssec" title="DNSSEC Checker" description="Verify DNSSEC signing status" placeholder="example.com" beginnerGuide={beginnerGuide} />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About DNSSEC" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Search", title: "DNS Lookup", description: "Query all DNS record types", href: "/dns-lookup" },
              { icon: "Search", title: "CAA Lookup", description: "Check Certificate Authority Authorization", href: "/caa-lookup" },
              { icon: "Search", title: "Nameserver Analyzer", description: "Analyze nameserver configuration", href: "/nameserver-analyzer" },
              { icon: "Search", title: "DNS Zone Validator", description: "Validate DNS zone configuration", href: "/dns-zone-validator" },
            ]}
            title="Related DNS Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
