import type { Metadata } from "next";
import { DnsToolLookup } from "@/components/dns/dns-tool-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "nameserver-analyzer";
const pageTitle = "Nameserver Analyzer — Check DNS Nameserver Configuration";
const pageDescription = "Analyze nameserver configuration for any domain. Verify NS records, check nameserver reachability, identify configuration issues, and ensure DNS redundancy.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "Nameserver Analyzer" },
];

const beginnerGuide = [
  { title: "What are nameservers?", content: "Nameservers are the DNS servers that host the authoritative DNS records for your domain. When someone types your domain, the resolver asks the root servers 'who is the authority for this domain?', gets your nameserver names from the registry, then queries your nameservers for the actual records (A, MX, TXT, etc.). Without properly configured nameservers, your domain is invisible on the internet." },
  { title: "How many nameservers should a domain have?", content: "ICANN requires at least two nameservers for domain delegation. Best practice is 2-4 nameservers on different networks (different ASNs, different providers). Having nameservers on the same provider creates a single point of failure. Some providers offer anycast nameservers that are automatically redundant." },
  { title: "What nameserver configurations cause problems?", content: "Common issues: (1) Missing glue records for in-zone nameservers (ns1.yourdomain.com for yourdomain.com). (2) Nameservers that don't resolve to an IP. (3) Nameservers on the same subnet (no network diversity). (4) Slow nameservers causing resolution delays. (5) Inconsistent zones between primary and secondary nameservers." },
];

const faqItems: FaqItem[] = [
  { question: "Why do my nameservers show as unreachable?", answer: "Unreachable nameservers mean the NS hostname doesn't resolve to an IP address. This happens when: (1) The nameserver hostname has no A or AAAA record. (2) The glue record at the registrar is missing or incorrect. (3) The nameserver is down or firewalled. Check our DNS Lookup tool to verify the NS records resolve correctly." },
  { question: "What is a glue record and when is it needed?", answer: "A glue record is an A or AAAA record provided by the parent zone (.com, .org, etc.) for nameservers that are within the delegated domain. Example: if your domain is example.com and your nameserver is ns1.example.com, the .com registry needs a glue record mapping ns1.example.com to an IP. Without glue, resolvers can't bootstrap the resolution." },
  { question: "Should my nameservers be on different networks?", answer: "Yes. Nameservers on the same provider or same physical network create a single point of failure. If that network goes down, all your nameservers become unreachable and your domain stops resolving. Use nameservers from at least two different providers (e.g., Cloudflare + AWS Route53 + your own servers)." },
];

export default function NameserverAnalyzerPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <DnsToolLookup lookupType="nameserver" title="Nameserver Analyzer" description="Analyze nameserver configuration" placeholder="example.com" beginnerGuide={beginnerGuide} />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Nameservers" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔍", title: "DNS Lookup", description: "Query all DNS record types", href: "/dns-lookup" },
              { icon: "🔒", title: "DNSSEC Checker", description: "Verify DNSSEC signing", href: "/dnssec-checker" },
              { icon: "🔍", title: "CAA Lookup", description: "Check CA Authorization", href: "/caa-lookup" },
              { icon: "🔍", title: "DNS Zone Validator", description: "Validate DNS zone", href: "/dns-zone-validator" },
            ]}
            title="Related DNS Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
