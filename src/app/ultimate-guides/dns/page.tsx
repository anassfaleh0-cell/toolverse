import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema } from "@/lib/seo";
import type { FaqItem } from "@/lib/seo";

export const metadata: Metadata = {
  title: `The Ultimate DNS Guide — Everything You Need to Know About the Domain Name System - ${SITE_NAME}`,
  description: "A comprehensive guide to the Domain Name System covering DNS hierarchy, all record types, resolution process, DNSSEC security, performance benchmarks, troubleshooting, and best DNS tools. The definitive DNS reference.",
  openGraph: {
    title: `The Ultimate DNS Guide — Everything About the Domain Name System`,
    description: "Master DNS from the ground up. Complete coverage of hierarchy, record types, resolution flow, DNSSEC, performance data, and troubleshooting.",
    url: `${SITE_URL}/ultimate-guides/dns`,
  },
  twitter: {
    title: `The Ultimate DNS Guide — Everything About the Domain Name System`,
    description: "Master DNS from the ground up. Complete coverage of hierarchy, record types, resolution flow, DNSSEC, performance data, and troubleshooting.",
  },
  alternates: { canonical: `${SITE_URL}/ultimate-guides/dns` },
};

const pageUrl = `${SITE_URL}/ultimate-guides/dns`;
const pageTitle = "The Ultimate DNS Guide — Everything You Need to Know About the Domain Name System";
const pageDescription = "A comprehensive guide to the Domain Name System covering DNS hierarchy, all record types, resolution process, DNSSEC security, performance benchmarks, troubleshooting, and best DNS tools.";

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Guides", href: `${SITE_URL}/guides` },
  { label: "Ultimate DNS Guide" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is DNS and why is it important?",
    answer: "DNS (Domain Name System) is the phonebook of the internet. It translates human-readable domain names like example.com into machine-readable IP addresses like 192.0.2.1. Without DNS, you would need to memorize numeric IP addresses for every website you visit. It is one of the most critical infrastructure components of the internet."
  },
  {
    question: "How long does DNS propagation take?",
    answer: "DNS propagation typically takes anywhere from a few minutes to 48 hours, though most changes propagate within 1–2 hours. The time depends on the TTL (Time to Live) value set on your DNS records and how frequently recursive resolvers cache those records. You can check propagation status using Nuvora's DNS Propagation Checker."
  },
  {
    question: "What is the difference between A and AAAA records?",
    answer: "A records map a domain name to an IPv4 address (e.g., 192.0.2.1), while AAAA records map a domain name to an IPv6 address (e.g., 2001:db8::1). AAAA records are sometimes called 'quad-A' records. Most modern websites have both record types to support dual-stack networking."
  },
  {
    question: "What is DNSSEC and do I need it?",
    answer: "DNSSEC (DNS Security Extensions) adds cryptographic signatures to DNS records to prevent spoofing and cache poisoning attacks. It ensures that the DNS responses you receive are authentic and haven't been tampered with. Any organization concerned about DNS security should implement DNSSEC."
  },
  {
    question: "Which DNS resolver is the fastest?",
    answer: "Based on independent benchmarks, Cloudflare's 1.1.1.1 typically offers the fastest query times globally, followed closely by Google DNS (8.8.8.8) and Quad9 (9.9.9.9). However, performance varies by geographic region and ISP. Use Nuvora's DNS Lookup tool to compare response times from different resolvers."
  }
];

export default function UltimateDnsGuidePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: pageUrl, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <article>
        <header className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                The Ultimate DNS Guide — Everything You Need to Know About the Domain Name System
              </h1>
            </div>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {pageDescription}
            </p>
            <div className="mt-6">
              <SocialShare url={pageUrl} title={pageTitle} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-16">
            {/* Section 1 */}
            <section id="what-is-dns">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">1. What is DNS?</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>The Domain Name System (DNS) is the decentralized naming system that connects domain names to their corresponding IP addresses. Think of it as the internet&apos;s phonebook — when you type a domain like <strong>example.com</strong> into your browser, DNS translates it into a machine-readable IP address like <strong>93.184.216.34</strong> so your browser can load the website.</p>
                <p>Before DNS, the internet relied on a single <strong>HOSTS.TXT</strong> file maintained by the Stanford Research Institute (SRI). As the network grew, this approach became unsustainable. In 1983, Paul Mockapetris invented the Domain Name System, introducing a hierarchical, distributed database that could scale with the internet&apos;s explosive growth. RFC 882 and RFC 883 laid the foundation, and DNS has been evolving ever since.</p>
                <p>At a high level, DNS works like a massive distributed database. When your device needs to resolve a domain, it queries a chain of DNS servers — starting with a recursive resolver, then moving to root servers, TLD servers, and finally authoritative nameservers — each providing a piece of the puzzle until the final IP address is returned. This entire process happens in milliseconds, invisible to the user.</p>
                <p>DNS is critical for more than just web browsing. Every email delivery, API call, database connection, CDN request, and cloud service interaction depends on DNS resolution. A properly configured DNS infrastructure ensures reliability, performance, and security for all internet-connected services.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="dns-hierarchy">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">2. DNS Hierarchy Explained</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>The DNS system is organized in a strict hierarchy. Understanding each layer is essential for troubleshooting and optimization.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Root Servers (The Top Level)</h3>
                <p>There are 13 logical root server authorities (named A through M) operated by organizations like ICANN, Verisign, USC, and others. These servers are globally distributed using anycast routing, with hundreds of physical instances worldwide. When a recursive resolver doesn&apos;t have a cached answer, it first queries a root server to learn which TLD server to contact next.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">TLD Servers (Top-Level Domain)</h3>
                <p>TLD servers manage the next level of the hierarchy for each top-level domain extension. There are generic TLDs (gTLDs) like .com, .org, .net and country-code TLDs (ccTLDs) like .uk, .de, .jp. The TLD server doesn&apos;t know the final IP address — it directs the resolver to the authoritative nameservers for the specific domain.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Authoritative Nameservers</h3>
                <p>These are the final authority for a domain. When you register a domain and configure its DNS records (A, CNAME, MX, etc.), those records live on authoritative nameservers. They provide the definitive answer to DNS queries. Most domain registrars provide default nameservers, but services like Cloudflare, AWS Route 53, and Google Cloud DNS offer managed authoritative DNS.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recursive Resolvers</h3>
                <p>Recursive resolvers (also called DNS caches) sit between your device and the DNS hierarchy. Your ISP provides one by default, but you can use public resolvers like Google DNS (8.8.8.8), Cloudflare DNS (1.1.1.1), or Quad9 (9.9.9.9). The recursive resolver does the heavy lifting of traversing the hierarchy and caches results to speed up future queries.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="dns-record-types">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">3. All DNS Record Types</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>DNS records define how your domain behaves for different types of queries. Below is a comprehensive comparison of all major DNS record types you need to know.</p>
              </div>
              <ComparisonMatrix
                title="DNS Record Types Comparison"
                headers={["Purpose", "Example Usage", "Priority"]}
                rows={[
                  { feature: "A", values: ["Maps domain to IPv4 address", "example.com → 93.184.216.34", "N/A"] },
                  { feature: "AAAA", values: ["Maps domain to IPv6 address", "example.com → 2606:2800:220:1:248:1893:25c8:1946", "N/A"] },
                  { feature: "CNAME", values: ["Alias one domain to another", "www.example.com → example.com", "N/A"] },
                  { feature: "MX", values: ["Mail exchange server routing", "example.com → mail.example.com", "10 mail.server.com"] },
                  { feature: "TXT", values: ["Arbitrary text data (verification, SPF, DKIM)", "SPF: v=spf1 include:_spf.google.com ~all", "N/A"] },
                  { feature: "NS", values: ["Authoritative nameservers", "example.com → ns1.cloudflare.com", "N/A"] },
                  { feature: "SOA", values: ["Zone authority and serial number", "Start of Authority record", "N/A"] },
                  { feature: "SRV", values: ["Service location (SIP, XMPP, LDAP)", "_sip._tcp.example.com → 10 5 5060 sipserver.com", "10 5"] },
                  { feature: "CAA", values: ["Certificate Authority authorization", "Which CAs can issue SSL certs", "0 issue letsencrypt.org"] },
                  { feature: "PTR", values: ["Reverse DNS (IP → hostname)", "34.216.184.93.in-addr.arpa → example.com", "N/A"] },
                  { feature: "DS", values: ["DNSSEC delegation signer", "Hash of DNSKEY for chain of trust", "N/A"] },
                  { feature: "DNSKEY", values: ["DNSSEC public key (zone signing)", "Public key for DNSSEC validation", "N/A"] },
                  { feature: "RRSIG", values: ["DNSSEC digital signature", "Signature verifying a record set", "N/A"] },
                  { feature: "NSEC", values: ["DNSSEC denial of existence", "Shows which names don't exist", "N/A"] },
                  { feature: "NSEC3", values: ["NSEC with hashed names", "Privacy-preserving denial of existence", "N/A"] },
                ]}
              />
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Use <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora DNS Lookup</Link> to query any of these record types for your domain. Our tool supports all 16 record types listed above in a single query.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="dns-resolution">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">4. How DNS Resolution Works</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>When you type a domain into your browser, a complex but lightning-fast chain of queries takes place. Here is the complete 8-step resolution process:</p>
                <ol className="list-decimal space-y-3 pl-5">
                  <li><strong>Browser Check:</strong> Your browser checks its local DNS cache. If the domain was recently resolved, the cached IP is used immediately (step 0, effectively).</li>
                  <li><strong>OS Cache Check:</strong> If the browser doesn&apos;t have a cached entry, the operating system checks its own DNS resolver cache (via the stub resolver).</li>
                  <li><strong>Router Cache:</strong> If the OS doesn&apos;t have it, the request typically goes to your router&apos;s DNS forwarder, which may have cached results from other devices on your network.</li>
                  <li><strong>ISP Recursive Resolver:</strong> The request reaches your ISP&apos;s recursive resolver (or a custom resolver like 1.1.1.1). If it has the record cached, it returns the answer immediately.</li>
                  <li><strong>Root Server Query:</strong> If no cache exists, the recursive resolver queries a root server (e.g., a.root-servers.net) to find which TLD server handles .com.</li>
                  <li><strong>TLD Server Query:</strong> The resolver queries the .com TLD server, which responds with the authoritative nameservers for the domain (e.g., ns1.cloudflare.com).</li>
                  <li><strong>Authoritative Server Query:</strong> The resolver queries the authoritative nameserver for the specific DNS record (e.g., A record for example.com), receiving the final IP address.</li>
                  <li><strong>Response and Caching:</strong> The resolver returns the IP address to your device, caches it according to the TTL, and your browser connects to the server to load the page.</li>
                </ol>
                <p className="mt-4">This entire process typically completes in 10–50 milliseconds. You can trace this flow yourself using <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora DNS Lookup</Link> to see which records are returned and identify potential bottlenecks.</p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="dns-security">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">5. DNS Security</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>DNS was originally designed without security in mind. Modern extensions and protocols address these vulnerabilities.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">DNSSEC (DNS Security Extensions)</h3>
                <p>DNSSEC adds cryptographic signatures to DNS records, allowing resolvers to verify that responses are authentic. The validation chain works as follows: the root zone signs the .com TLD key, the .com TLD signs your domain&apos;s key, and your domain&apos;s key signs individual records (via RRSIG records). This chain of trust ensures that no one has tampered with your DNS records in transit. DNSSEC prevents cache poisoning and DNS spoofing attacks.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">DNS over HTTPS (DoH)</h3>
                <p>DoH encrypts DNS queries using HTTPS, preventing eavesdroppers from seeing which domains you visit. By sending DNS queries over port 443 (same as regular HTTPS traffic), DoH makes it difficult for network observers to distinguish DNS traffic from other web traffic. Major browsers support DoH natively. Providers include Cloudflare (https://cloudflare-dns.com/dns-query), Google (https://dns.google/dns-query), and Quad9 (https://dns.quad9.net/dns-query).</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">DNS over TLS (DoT)</h3>
                <p>DoT encrypts DNS queries over a dedicated TLS connection on port 853. Unlike DoH, DoT uses a separate port, making it easier to monitor DNS traffic at the network level. DoT is commonly used by network administrators who want the privacy benefits of encryption while maintaining visibility into DNS traffic patterns.</p>
                <p>For a deeper dive, see our <Link href="/protocols/dns-protocols" className="text-blue-600 hover:underline dark:text-blue-400">DNS Protocols comparison</Link> and check your domain&apos;s security posture with our <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup tool</Link>.</p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="common-dns-issues">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">6. Common DNS Issues</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Propagation Delay</h3>
                <p>After updating DNS records, changes must propagate across the global DNS infrastructure. This can take anywhere from minutes to 48 hours depending on your TTL settings. Always lower TTL to 300 seconds (5 minutes) before making changes, then raise it back after propagation. Use <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora DNS Propagation Checker</Link> to monitor propagation in real time across multiple global locations.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Misconfigured Records</h3>
                <p>Common mistakes include: missing trailing dots in fully qualified domain names, incorrect MX priority values, CNAME records at the zone apex (which violates RFC standards), and conflicting TXT records for SPF/DKIM/DMARC. Validate your configuration with <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora DNS Lookup</Link>.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">TTL Problems</h3>
                <p>TTL (Time to Live) determines how long resolvers cache your DNS records. High TTL values (86400 seconds / 24 hours) improve performance but slow down propagation. Low TTL values increase query load on your nameservers. Balance is key — we recommend 300–3600 seconds for production.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">DNS Hijacking</h3>
                <p>DNS hijacking occurs when an attacker redirects DNS queries to malicious servers. This can happen through malware, compromised routers, or ISP-level interception. Symptoms include visiting legitimate websites but being redirected to phishing pages. Using DNSSEC, DoH, and reputable public resolvers mitigates this risk.</p>
                <p>For systematic troubleshooting, use our <Link href="/troubleshooting/dns-propagation" className="text-blue-600 hover:underline dark:text-blue-400">DNS Troubleshooter</Link> and <Link href="/decision-trees/dns-troubleshooting" className="text-blue-600 hover:underline dark:text-blue-400">DNS Decision Tree</Link>.</p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="dns-performance">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">7. DNS Performance Benchmarks</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Choosing the right DNS resolver can significantly impact your browsing speed. Below is benchmark data comparing the four most popular public DNS resolvers.</p>
              </div>
              <ComparisonMatrix
                title="Public DNS Resolver Performance Comparison"
                headers={["Avg Query Time", "Global Uptime", "Privacy Policy", "DNSSEC Support"]}
                rows={[
                  { feature: "Google DNS (8.8.8.8)", values: ["10–15ms", "99.99%", "Logs anonymized after 24h", "Yes"], highlight: false },
                  { feature: "Cloudflare DNS (1.1.1.1)", values: ["8–12ms", "99.99%", "No logs, privacy-first", "Yes"], highlight: true },
                  { feature: "Quad9 (9.9.9.9)", values: ["12–18ms", "99.97%", "No personally identifiable logs", "Yes"], highlight: false },
                  { feature: "OpenDNS (208.67.222.222)", values: ["15–25ms", "99.95%", "Logs retained for security", "Yes"], highlight: false },
                ]}
              />
              <div className="mt-4 text-zinc-600 dark:text-zinc-400">
                <p>Cloudflare&apos;s 1.1.1.1 consistently leads in global average query time thanks to its massive anycast network. However, performance varies by region — always test from your location. See our detailed <Link href="/benchmarks/dns-performance" className="text-blue-600 hover:underline dark:text-blue-400">DNS Benchmarks</Link> for comprehensive data.</p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="dns-tools">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">8. Best DNS Tools</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Nuvora provides a complete suite of DNS diagnostic and management tools. Here are the most essential ones:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li><Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> — Query all DNS record types (A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, CAA, PTR, DS, DNSKEY, RRSIG, NSEC, NSEC3) for any domain in a single request.</li>
                  <li><Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> — Verify that your DNS changes have propagated to servers worldwide, including Google, Cloudflare, Quad9, and OpenDNS.</li>
                  <li><Link href="/reverse-dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Reverse DNS Lookup</Link> — Find the hostname associated with any IP address using PTR record queries. Supports both IPv4 and IPv6.</li>
                  <li><Link href="/domain-report" className="text-blue-600 hover:underline dark:text-blue-400">Domain Report Card</Link> — Get a comprehensive A–F report for any domain covering DNS health, SSL, HTTP headers, WHOIS, and more.</li>
                  <li><Link href="/whois-lookup" className="text-blue-600 hover:underline dark:text-blue-400">WHOIS Lookup</Link> — View domain registration details including registrar, creation and expiration dates, and name servers.</li>
                </ul>
                <p className="mt-4">For a complete list, visit our <Link href="/tools" className="text-blue-600 hover:underline dark:text-blue-400">all tools page</Link> or browse our curated collection of <Link href="/best-online/best-dns-tools" className="text-blue-600 hover:underline dark:text-blue-400">best DNS tools</Link>.</p>
              </div>
            </section>
          </div>

          {/* FAQ */}
          <section className="mt-16">
            <FaqSection items={faqItems} title="DNS Frequently Asked Questions" description="Common questions about the Domain Name System answered by networking experts." />
          </section>

          {/* Related Resources */}
          <section className="mt-16 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Related Resources</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link href="/cheat-sheets/developer-dns" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">DNS Cheat Sheet</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Quick reference for all DNS record types and commands</span>
              </Link>
              <Link href="/technical-flow/dns-resolution" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">DNS Resolution Flow</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Visual diagram of the DNS resolution process</span>
              </Link>
              <Link href="/compare/dns-providers" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">DNS Provider Comparison</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Compare major DNS providers side by side</span>
              </Link>
              <Link href="/dns-record-types" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">DNS Record Types Reference</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Detailed reference for every DNS record type</span>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
