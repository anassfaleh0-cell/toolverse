import type { Metadata } from "next";
import { DnsToolLookup } from "@/components/dns/dns-tool-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "srv-lookup";
const pageTitle = "SRV Lookup — Query Service Records (RFC 2782)";
const pageDescription = "Look up SRV (Service) records for any domain. Find service locations for SIP, LDAP, XMPP, Kerberos, and more. Specify service and protocol.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "SRV Lookup" },
];

const beginnerGuide = [
  { title: "What are SRV records?", content: "SRV (Service) records, defined in RFC 2782, specify the location of servers for specific services. Format: _service._protocol.domain.com. Each SRV record contains priority (lower = preferred), weight (for load balancing), port number, and target hostname. Common services: _sip (VoIP), _ldap (directory), _xmpp (chat), _kerberos (authentication)." },
  { title: "SRV record format explained", content: "An SRV record has four numeric fields before the target hostname: Priority (lower number = higher priority, try this server first), Weight (when priorities are equal, higher weight = more traffic), Port (the TCP/UDP port for the service), and Target (the hostname providing the service). Example: '0 10 5060 sipserver.example.com' means priority 0, weight 10, port 5060." },
  { title: "Common SRV record lookups", content: "_sip._tcp.example.com — SIP VoIP services. _ldap._tcp.example.com — LDAP directory services. _xmpp-client._tcp.example.com — XMPP chat (client-to-server). _xmpp-server._tcp.example.com — XMPP server-to-server. _kerberos._tcp.example.com — Kerberos authentication. _autodiscover._tcp.example.com — Microsoft Exchange autodiscover." },
];

const faqItems: FaqItem[] = [
  { question: "How do SRV records differ from MX records?", answer: "MX records only handle email routing and don't include ports. SRV records handle any TCP/UDP service and include a port number, priority, and weight. SRV records are more flexible: they can redirect to different ports and support weighted load balancing between servers with equal priority." },
  { question: "What is SRV record weight used for?", answer: "Weight distributes traffic among servers with the same priority. A server with weight 50 gets 5x the traffic of a server with weight 10. When all servers have weight 0, traffic is distributed evenly. Weight-based routing is randomized (probabilistic) — each client gets a random server based on weight distribution." },
  { question: "Do modern applications still use SRV records?", answer: "Yes, SRV records are still widely used. Microsoft Teams and Skype for Business use SRV for discovery. Matrix (decentralized chat) uses SRV. Many enterprise services (LDAP, Kerberos, SIP) rely on SRV. Some newer protocols like DNS-over-HTTPS (DoH) have moved away from SRV in favor of simpler A record discovery." },
];

export default function SrvLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <DnsToolLookup lookupType="srv" title="SRV Lookup" description="Query SRV service records" placeholder="example.com" beginnerGuide={beginnerGuide} extraFields={[
              { label: "Service", key: "service", placeholder: "sip" },
              { label: "Protocol", key: "protocol", placeholder: "tcp" },
            ]} />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About SRV Records" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools tools={[
            { icon: "🔍", title: "DNS Lookup", description: "Query all DNS record types", href: "/dns-lookup" },
            { icon: "🔍", title: "CAA Lookup", description: "Check Certificate Authority Authorization", href: "/caa-lookup" },
            { icon: "🔒", title: "DNSSEC Checker", description: "Verify DNSSEC signing", href: "/dnssec-checker" },
            { icon: "🔍", title: "Nameserver Analyzer", description: "Analyze nameserver setup", href: "/nameserver-analyzer" },
          ]} title="Related DNS Tools" />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
