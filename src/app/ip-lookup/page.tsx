import type { Metadata } from "next";
import { Suspense } from "react";
import { IpLookup } from "@/components/ip-lookup/ip-lookup";
import {
  ToolLayout,
  ToolHero,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
  RelatedContent,
  JsonLd,
} from "@/components/shared";
import {
  faqSchema,
  webPageSchema,
  breadcrumbSchema,
  softwareAppSchema,
  type FaqItem,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";

const slug = "ip-lookup";
const pageTitle = "IP Lookup — Trace Any IP Address Location & ISP Details";
const pageDescription =
  "Trace any IP address to its geographic origin, ISP, and ASN. Detect proxies, VPNs, and hosting providers. Essential for security audits and network debugging.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${slug}`,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: `${SITE_URL}/${slug}`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "IP Lookup" },
];

const faqItems: FaqItem[] = [
  {
    question: "How accurate is IP geolocation at the city level?",
    answer:
      "Commercial databases achieve 85-95% city-level accuracy for residential IPs in developed countries. Accuracy drops to 50-70% for mobile IPs and 60-80% for developing regions. Datacenter IPs resolve to the facility location. Results vary between providers because each uses different measurement methodologies and update frequencies.",
  },
  {
    question: "What does ASN information tell me about an IP?",
    answer:
      "The ASN identifies the autonomous system owning the IP block, typically an ISP, hosting provider, or enterprise. This reveals whether the IP is residential, on a cloud platform (AWS, Azure, GCP), or part of a CDN. ASN data also helps detect BGP hijacking when the announced ASN does not match WHOIS records.",
  },
  {
    question: "Can an IP lookup detect VPN or proxy usage?",
    answer:
      "Partially. IP databases maintain lists of known VPN exit nodes, Tor relays, and open proxies. However, residential proxy networks and rotating VPN IPs from large providers are harder to detect. Detection accuracy depends on how frequently the database updates its node lists, with some updating daily and others weekly.",
  },
  {
    question: "Why does my IP show a different city than my actual location?",
    answer:
      "Possible causes include your ISP routing through a central Point of Presence, carrier-grade NAT pooling IPs regionally, mobile networks routing through core gateways, or geolocation databases not catching up after routing changes. It rarely indicates compromise, it is typically a database accuracy limitation.",
  },
  {
    question: "What is the difference between a public and private IP lookup?",
    answer:
      "Public IPs return geolocation, ASN, and ISP data from internet routing tables. Private IPs (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are non-routable and return no public data because they exist only within your local network. Any tool querying a private IP can only identify it as an RFC 1918 address.",
  },
  {
    question: "How often do geolocation databases update?",
    answer:
      "Major providers update monthly, with some offering weekly or daily updates on premium tiers. Data changes when ISPs renumber networks, open new Points of Presence, or merge carriers. Real-time geolocation services use BGP feed analysis and active probing for more current data but still cannot match GPS precision.",
  },
  {
    question: "Can IP lookup find someone's exact street address?",
    answer:
      "No. IP geolocation databases lack street-level data. Consumer lookup resolves to city or postal code at best. Only the ISP has the mapping between IP and service address, requiring a court order to disclose. Any service claiming street-level IP geolocation is misleading you.",
  },
  {
    question: "What is IP reputation and how is it determined?",
    answer:
      "IP reputation is a risk score based on historical behavior: spam blacklist presence, malware distribution history, brute-force attack frequency, and whether the IP belongs to a known hosting range. Email servers and WAFs use reputation scores to block or flag traffic before it reaches applications.",
  },
  {
    question: "Why do some IPs show hosting or business classification?",
    answer:
      "Classification databases assign usage types based on WHOIS registration and BGP announcements. Blocks registered to datacenter companies, cloud providers, or commercial ISPs are classified as hosting or business. Residential ISPs are classified separately. This distinction is a primary signal for bot detection and fraud prevention systems.",
  },
  {
    question: "How do IP lookup tools source their data?",
    answer:
      "They aggregate from Regional Internet Registries (WHOIS allocation data), BGP route collectors (ASN and prefix info), active latency measurements from global probe networks (geolocation), and third-party threat feeds (reputation). Each source is cross-referenced to build a complete IP profile.",
  },
  {
    question: "What is anycast and how does it affect IP lookups?",
    answer:
      "Anycast announces the same IP from multiple geographic locations simultaneously. DNS root servers, CDNs (Cloudflare, Fastly), and DDoS protection services use it. When you look up an anycast IP, the geolocation may show one location while your traffic is actually handled by a closer node in a different region.",
  },
  {
    question: "Can different websites show different geolocations for my IP?",
    answer:
      "Yes. Different lookup services subscribe to different databases (MaxMind, Neustar, IP2Location), each with unique update schedules and methodologies. City-level discrepancies of 50-200 miles between providers are common. For critical decisions, cross-reference at least three independent sources.",
  },
];

export default function IpLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="IP Lookup"
            description={pageDescription}
            introText="Trace any IP address to its geographic location, ISP, and ASN. Detect proxies, VPNs, and hosting providers. Essential for network troubleshooting and security analysis."
            breadcrumbs={breadcrumbs}
          >
            <Suspense fallback={<ToolSkeleton count={4} columns={1} />}>
              <IpLookup />
            </Suspense>
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            What IP Geolocation Data Actually Reveals
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              IP geolocation is not magic. It is built on BGP routing tables, WHOIS allocation records, and latency measurements from distributed probe networks. When you run an <Link href="/ip-lookup" className="text-blue-600 hover:underline dark:text-blue-400">IP Lookup</Link>, results trace through Regional Internet Registries (ARIN, RIPE, APNIC, LACNIC, AFRINIC) to identify the allocated netblock owner. From there, geolocation databases from providers like MaxMind and IP2Location triangulate city-level coordinates using routing topology and active measurements rather than GPS.
            </p>
            <p>
              Accuracy varies dramatically by address type. Residential IPs from major ISPs resolve to the correct city with 85-95% accuracy. Datacenter IPs from cloud providers show the physical region of the facility, not your location. Mobile IPs are notoriously inaccurate because they route through carrier core networks that may be hundreds of miles from the subscriber. Proxies and VPN exit nodes bounce geolocation to the server&apos;s location, which is why combining this with a <Link href="/whois-lookup" className="text-blue-600 hover:underline dark:text-blue-400">WHOIS Lookup</Link> for netblock ownership provides much richer context for security investigations.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Using IP Metadata for Threat Intelligence
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Beyond latitude and longitude, every IP carries metadata that security teams use for threat scoring. ASN identification reveals the network operator, distinguishing residential ISPs from hosting providers and corporate networks. Proxy and VPN detection databases cross-reference known exit node lists from Tor, commercial VPN providers, and open proxy scanners. An IP&apos;s presence on threat intelligence feeds like Spamhaus, AlienVault OTX, and AbuseIPDB can flag historical malicious activity.
            </p>
            <p>
              Even without a direct blacklist hit, anomalous signals matter. Mismatched ISP and geolocation, recent WHOIS changes, or hosting-provider ranges are strong fraud indicators. Cross-referencing with <Link href="/reverse-dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Reverse DNS Lookup</Link> adds another layer: a PTR record like <code>cpe-74-123-45-67.residential.isp.net</code> confirms a consumer connection, while <code>server123.hosting-provider.com</code> indicates datacenter infrastructure. For SOC analysts, correlating these signals transforms a simple IP lookup from a &quot;where is this&quot; query into a &quot;what is this&quot; threat assessment tool.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Errors in Interpreting IP Location Data
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The biggest mistake is treating IP geolocation as precise GPS coordinates. City-level data is directional, not definitive. A &quot;Washington, DC&quot; result may mean the ISP&apos;s regional router is in DC while the subscriber is in suburban Maryland. Never use IP geolocation for physical dispatch or law enforcement targeting. A mismatched geolocation does not necessarily mean an attack, mobile carriers frequently route through different markets. Always cross-reference multiple sources before drawing conclusions.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Run an IP Address Lookup
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Perform an IP lookup during security incident investigations to identify the originating network and ISP of suspicious traffic. Use it when reviewing web server logs to distinguish organic traffic from bots hitting from datacenter IPs. E-commerce platforms should check IP metadata during checkout flows to flag high-risk transactions. Network engineers use IP lookups to verify BGP announcements and traceroute paths during peering troubleshooting.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Security Best Practices for IP Investigation
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Always correlate IP geolocation with at least two independent data sources before making access control decisions. Automate threat intelligence feed lookups for IPs that trigger security alerts. Set up alerts for traffic originating from datacenter IP ranges targeting your administrative interfaces. For e-commerce fraud detection, combine IP metadata with device fingerprinting and behavioral analysis rather than relying on geolocation alone. Document all IP investigation findings with timestamps and source references for compliance and audit trails.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="IP Lookup Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Globe", title: "What Is My IP", description: "Check your own public IPv4 and IPv6 addresses", href: "/what-is-my-ip" },
              { icon: "Search", title: "WHOIS Lookup", description: "Check domain registration and ownership info", href: "/whois-lookup" },
              { icon: "Search", title: "Reverse DNS Lookup", description: "Find hostnames from IP addresses via PTR records", href: "/reverse-dns-lookup" },
              { icon: "Search", title: "DNS Lookup", description: "Query all DNS record types for any domain", href: "/dns-lookup" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="ip-lookup" />
    </>
  );
}
