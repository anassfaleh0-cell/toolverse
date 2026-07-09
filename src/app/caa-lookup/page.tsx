import type { Metadata } from "next";
import { DnsToolLookup } from "@/components/dns/dns-tool-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "caa-lookup";
const pageTitle = "CAA Lookup — Check Certificate Authority Authorization (RFC 8659)";
const pageDescription = "Look up CAA (Certificate Authority Authorization) records for any domain. Verify which CAs are authorized to issue SSL/TLS certificates and prevent certificate mis-issuance.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "CAA Lookup" },
];

const beginnerGuide = [
  { title: "What is a CAA record?", content: "A CAA (Certificate Authority Authorization, RFC 8659) record lets domain owners specify which Certificate Authorities (CAs) are allowed to issue SSL/TLS certificates for their domain. Without a CAA record, any CA can issue a certificate for your domain (if they validate ownership). CAA records act as a whitelist, preventing unauthorized certificate issuance." },
  { title: "CAA record format", content: "CAA records have three components: flags, tag, and value. The most common tags are: 'issue' (which CA can issue for this domain), 'issuewild' (which CA can issue wildcard certificates), and 'iodef' (where to send CAA violation reports). Flags are typically 0 (critical). Example: 0 issue 'letsencrypt.org' means only Let's Encrypt can issue certificates." },
  { title: "Why CAA is important for security", content: "CAA records prevent certificate mis-issuance. If a malicious actor tries to get a certificate from a non-authorized CA, the CA must refuse (if they comply with RFC 8659). All major CAs (Let's Encrypt, DigiCert, Sectigo, GlobalSign) check CAA records before issuance. Since September 2017, CAA checking is mandatory for all CAs under the CA/Browser Forum baseline requirements." },
];

const faqItems: FaqItem[] = [
  { question: "Can CAA records prevent all certificate mis-issuance?", answer: "No. CAA records only prevent issuance from non-authorized CAs. If an authorized CA is compromised or makes a mistake, they can still issue fraudulent certificates. CAA is one layer of defense: combine it with Certificate Transparency (CT) monitoring to detect unauthorized certificates from authorized CAs. Use tools like crt.sh to monitor CT logs." },
  { question: "How do I set up CAA records for my domain?", answer: "Add CAA records in your DNS zone. Example: '0 issue letsencrypt.org' for Let's Encrypt, '0 issue digicert.com' for DigiCert. To authorize multiple CAs, add multiple CAA records. Add '0 iodef mailto:security@example.com' to receive reports of CAA violations. Set '0 issuewild ;' with no value to block wildcard certificates entirely." },
  { question: "What happens if no CAA record exists?", answer: "If no CAA record exists, any CA that follows RFC 8659 will perform a non-authoritative lookup. When no records are found, the CA proceeds with issuance as normal. A missing CAA record does NOT block certificate issuance — it simply means you haven't specified restrictions. Adding CAA records is purely a security best practice." },
  { question: "Do CAA records affect existing certificates?", answer: "No. CAA records only affect new certificate issuance and renewal requests. Already-issued certificates remain valid until expiration. When a certificate is up for renewal, the CA will check CAA records again. If you've removed a CA from your CAA records before renewal, the CA will refuse to reissue." },
];

export default function CaaLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <DnsToolLookup lookupType="caa" title="CAA Lookup" description="Check CAA records for any domain" placeholder="example.com" beginnerGuide={beginnerGuide} />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About CAA Records" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔍", title: "DNS Lookup", description: "Query all DNS record types", href: "/dns-lookup" },
              { icon: "🔒", title: "DNSSEC Checker", description: "Verify DNSSEC signing status", href: "/dnssec-checker" },
              { icon: "🔍", title: "Nameserver Analyzer", description: "Analyze nameserver configuration", href: "/nameserver-analyzer" },
              { icon: "🔍", title: "DNS Zone Validator", description: "Validate DNS zone configuration", href: "/dns-zone-validator" },
            ]}
            title="Related DNS Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
