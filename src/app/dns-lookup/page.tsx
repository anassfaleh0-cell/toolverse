import type { Metadata } from "next";
import { DnsLookup, DnsVisualization } from "@/components/dns-lookup";
import {
  ToolLayout,
  ToolHero,
  FaqSection,
  RelatedTools,
  RelatedContent,
  JsonLd,
  FeaturedSnippet,
  ComparisonTable,
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

const slug = "dns-lookup";
const pageTitle = "DNS Lookup — Query All DNS Record Types for Any Domain";
const pageDescription =
  "Perform detailed DNS lookups to retrieve A, AAAA, MX, NS, CNAME, TXT, and SOA records. Troubleshoot resolution failures and verify DNS configuration.";

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
  { label: "DNS Lookup" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between recursive and authoritative DNS?",
    answer:
      "A recursive query asks a resolver to traverse the DNS hierarchy on your behalf. An authoritative query goes directly to the domain's designated name servers. This tool performs recursive lookups by default to simulate real-world resolution, but you can specify authoritative servers for direct zone data queries.",
  },
  {
    question: "Why do different resolvers return different results for the same domain?",
    answer:
      "Each resolver maintains an independent cache with its own TTL tracking. Recent zone updates may propagate to some resolvers but not others. Anycast routing also plays a role: queries to 8.8.8.8 may hit different physical Google servers depending on your location, each with slightly different cache states.",
  },
  {
    question: "What does a SERVFAIL response actually mean?",
    answer:
      "SERVFAIL means the authoritative server encountered an internal failure or the resolver could not reach any authority for the domain. Common causes include DNSSEC validation failure (cryptographic signatures could not be verified), overloaded authoritative servers, or network issues between the resolver and the authority.",
  },
  {
    question: "How do CNAME records impact resolution performance?",
    answer:
      "CNAMEs add an extra resolution step: the resolver must follow the alias to its target and perform another lookup. Each hop adds latency equivalent to one query. Chains of three or more hops can increase resolution time by 50-200ms. For performance-critical applications, minimize CNAME depth and prefer A or AAAA records where possible.",
  },
  {
    question: "What is DNSSEC and how does it protect lookups?",
    answer:
      "DNSSEC cryptographically signs DNS records using public-key cryptography, letting resolvers verify responses have not been tampered with. It protects against DNS spoofing and cache poisoning. With DNSSEC enabled, lookups return RRSIG, DNSKEY, and DS records. A SERVFAIL with DNSSEC often means signature validation failed.",
  },
  {
    question: "Why would a domain have an A record but no AAAA record?",
    answer:
      "The administrator has not configured IPv6 resolution. Many legacy servers and older hosting platforms lack AAAA records because the server lacks a public IPv6 address, the provider does not support IPv6, or the admin has not deployed it. The domain is reachable only via IPv4 until a AAAA record is added.",
  },
  {
    question: "What is the purpose of the SOA serial number?",
    answer:
      "The SOA serial number is a version counter for the zone file. Secondary (slave) servers check it to decide whether to initiate a zone transfer (AXFR or IXFR). If the primary's serial is higher, the secondary requests an update. Forgetting to increment this is the number one cause of DNS changes not working.",
  },
  {
    question: "How do I verify email configuration using DNS?",
    answer:
       "Query all TXT records for your domain and verify SPF (starting with v=spf1), DKIM (selectors like default._domainkey.yourdomain.com), and DMARC (_dmarc.yourdomain.com). Check MX records for correct mail server hostnames and preference values. Confirm HELO hostnames match PTR records via Reverse DNS Lookup.",
  },
  {
    question: "What is NXDOMAIN and when is it legitimate?",
    answer:
      "NXDOMAIN (Non-Existent Domain) means the queried hostname has no DNS record of any type. It is legitimate when you have not created a record for a subdomain. It signals a problem when it occurs for your main A or MX records, indicating a configuration gap or that the domain expired and the registry removed DNS delegation.",
  },
  {
    question: "How do TTL values affect DNS propagation?",
    answer:
      "TTL values (in seconds) tell resolvers how long to cache responses. A 300-second TTL means resolvers re-query every 5 minutes. Lower TTLs speed propagation for changes but increase authoritative server load. Higher TTLs reduce load but delay propagation. For planned changes, reduce TTL to 60-300 seconds 48 hours beforehand.",
  },
  {
    question: "What are glue records and why do they matter?",
    answer:
      "Glue records are A or AAAA records provided by the parent zone (e.g., .com) for a domain's authoritative name servers when those servers are within the same domain (e.g., ns1.example.com for example.com). Without glue, a circular dependency occurs: resolving example.com requires ns1.example.com, but finding ns1.example.com requires example.com.",
  },
  {
    question: "Can DNS records be used for load balancing?",
    answer:
      "Yes, through multiple A records for round-robin, GeoDNS for geographic distribution, and weighted records for proportional traffic allocation. However, DNS load balancing is coarse: resolver caching means traffic distribution depends on resolver behavior and TTLs. It works best combined with an actual hardware or software load balancer for fine-grained control.",
  },
];

export default function DnsLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="DNS Lookup"
            description={pageDescription}
            introText="Look up DNS records for any domain. Query A, AAAA, MX, NS, TXT, CNAME, and SOA records to troubleshoot connectivity and verify configuration."
            breadcrumbs={breadcrumbs}
          >
            <DnsLookup />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            DNS Record Types Every Engineer Must Master
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              DNS is the internet&apos;s distributed phonebook, translating domain names into machine-routable IPs. But it is far more than A records and CNAMEs. When you run a comprehensive <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link>, you are querying authoritative name servers across a dozen record types, each serving a distinct function. A records map hostnames to IPv4; AAAA records handle IPv6. MX records define mail exchanger priorities where lower preference numbers indicate higher priority. NS records declare authoritative name servers for the zone. TXT records carry SPF, DKIM, and DMARC policies critical for email deliverability and anti-spoofing.
            </p>
            <p>
              Each record type plays a specific role in resolution. A missing SPF TXT record will not cause a website outage but will silently destroy email deliverability. An incorrectly configured CNAME chain can create a resolution loop that takes minutes to debug. Pair your results with <Link href="/reverse-dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Reverse DNS Lookup</Link> to verify forward and reverse resolution are consistent, a common source of email authentication failures that is easily overlooked.
            </p>
          </div>
        </div>
      </section>

      <DnsVisualization />

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Real-World Example: Debugging a Migration with dig
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              A real estate company migrating from AWS to Google Cloud needed to verify DNS was correct before flipping the switch. Using the DNS Lookup tool, the team queried the A record for www.example-realty.com and found it still resolving to the old AWS IP (54.123.45.67). After updating the zone file at the new provider, they ran a lookup with the Google Public DNS resolver (8.8.8.8) — the record still showed the old IP due to TTL caching. The original TTL was set to 86400 seconds (24 hours), which would delay propagation. The team lowered the TTL to 300 seconds (5 minutes) 48 hours before the planned cutover. Two hours after the final change, the dig output confirmed the new IP (35.123.45.67) was resolving consistently across all queried resolvers. The MX records, checked simultaneously, showed the new Google Workspace mail server configuration was already propagating, confirming email would not be disrupted.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Troubleshooting: DNS Propagation Has Not Completed
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              If you have updated a DNS record but some users still see the old value, your change has not fully propagated. First, verify the SOA serial number has been incremented — this is the most common cause of changes not taking effect. Use the DNS Lookup tool to query different resolvers: Google (8.8.8.8), Cloudflare (1.1.1.1), and your ISP&apos;s resolver. If some resolvers show the new record and others show the old, propagation is in progress. Check the TTL of the previous record — changes can take up to the full TTL value to propagate globally. Use the <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> to see propagation status across multiple global locations simultaneously. If propagation has not started after 24 hours, verify the DNS change was saved at your registrar (not just your hosting provider) and that the NS records at the registrar point to the correct name servers.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            References
          </h2>
          <div className="mt-8 space-y-2 text-zinc-600 dark:text-zinc-400">
            <p>RFC 1034 — Domain Names - Concepts and Facilities (<a href="https://datatracker.ietf.org/doc/html/rfc1034" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc1034</a>)</p>
            <p>RFC 1035 — Domain Names - Implementation and Specification (<a href="https://datatracker.ietf.org/doc/html/rfc1035" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc1035</a>)</p>
            <p>RFC 2181 — Clarifications to the DNS Specification (<a href="https://datatracker.ietf.org/doc/html/rfc2181" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc2181</a>)</p>
            <p>RFC 6891 — Extension Mechanisms for DNS (EDNS(0)) (<a href="https://datatracker.ietf.org/doc/html/rfc6891" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc6891</a>)</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="DNS Lookup Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Search", title: "Reverse DNS Lookup", description: "Find hostnames from IP addresses via PTR records", href: "/reverse-dns-lookup" },
              { icon: "Search", title: "DNS Propagation Checker", description: "Verify DNS changes have propagated worldwide", href: "/dns-propagation-checker" },
              { icon: "Search", title: "WHOIS Lookup", description: "Check domain registration and ownership info", href: "/whois-lookup" },
              { icon: "Search", title: "IP Lookup", description: "Trace any IP address location and ISP details", href: "/ip-lookup" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="dns-lookup" />
    </>
  );
}
