import type { Metadata } from "next";
import { AsnLookup } from "@/components/network/asn-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "asn-lookup";
const pageTitle = "ASN Lookup — Find Autonomous System Number & Network Info";
const pageDescription = "Look up ASN (Autonomous System Number) information for any IP address. Find network owner, organization, and registration details via RDAP.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "ASN Lookup" },
];

const beginnerGuide = [
  { title: "What is an ASN?", content: "An Autonomous System Number (ASN) is a unique identifier assigned to a network or group of IP addresses that operates under common routing policies on the internet. ISPs, cloud providers (AWS, Google Cloud, Azure), and large organizations each have their own ASN. ASNs are used in BGP (Border Gateway Protocol) routing between networks." },
  { title: "How ASNs are used", content: "ASNs are essential for internet routing. When data travels between networks, BGP uses ASNs to determine the path. For example, when you visit a website, your ISP's ASN communicates with the hosting provider's ASN to route traffic. ASNs also help identify network ownership for security investigations, CDN configuration, and peering arrangements." },
  { title: "ASN lookup use cases", content: "Security teams use ASN lookups during incident response to identify the network owner of a malicious IP. Network engineers verify BGP routing configurations. Email administrators check if sending IPs belong to known email providers. CDN and cloud engineers use ASN data for traffic optimization and peering decisions." },
];

const faqItems: FaqItem[] = [
  { question: "What is the difference between ASN and IP WHOIS?", answer: "WHOIS provides domain registration information (registrar, registrant, dates). ASN lookups provide network ownership information — which organization controls the IP range, the ASN number, and routing details. ARIN RDAP (Registration Data Access Protocol) is the modern replacement for WHOIS for IP address and ASN data." },
  { question: "Can one organization have multiple ASNs?", answer: "Yes, large organizations often have multiple ASNs. For example, Google has AS15169 (main), but Google Cloud has multiple ASNs for different services and regions. ISPs typically have one ASN for their core network. Multi-homed networks (connected to multiple ISPs) often need their own ASN for BGP routing." },
  { question: "How do I find ASN information from the command line?", answer: "Use 'whois -h whois.arin.net n ASN_NUMBER' or 'whois IP_ADDRESS' on Unix systems. Online, you can use tools like BGP.HE.NET or this ASN Lookup tool. For bulk lookups, RDAP provides a RESTful API at https://rdap.arin.net/registry/ip/ADDRESS." },
];

export default function AsnLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <AsnLookup />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About ASN Lookups" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools tools={[
            { icon: "🔍", title: "IP Lookup", description: "Find IP location and ISP", href: "/ip-lookup" },
            { icon: "🔍", title: "DNS Lookup", description: "Query all DNS record types", href: "/dns-lookup" },
            { icon: "🔍", title: "Blacklist Check", description: "Check IP reputation on DNSBLs", href: "/blacklist-check" },
            { icon: "🔍", title: "Reverse DNS Lookup", description: "Find hostname from IP", href: "/reverse-dns-lookup" },
          ]} title="Related Network Tools" />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
