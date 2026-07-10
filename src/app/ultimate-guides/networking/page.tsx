import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema } from "@/lib/seo";
import type { FaqItem } from "@/lib/seo";

export const metadata: Metadata = {
  title: `The Ultimate Networking Guide — DNS, TCP/IP, Ports, and Diagnostics - ${SITE_NAME}`,
  description: "A comprehensive guide to computer networking covering the OSI model, TCP/IP stack, IPv4 and IPv6 addressing, CIDR and subnetting, DNS, common ports and protocols, network diagnostics (ping, traceroute, DNS lookup, port checking), and network security.",
  openGraph: {
    title: "The Ultimate Networking Guide — DNS, TCP/IP, Ports, and Diagnostics",
    description: "Master computer networking from the OSI model to practical diagnostics. Complete coverage of IP addressing, DNS, ports, protocols, and network security tools.",
    url: `${SITE_URL}/ultimate-guides/networking`,
  },
  twitter: {
    title: "The Ultimate Networking Guide — DNS, TCP/IP, Ports, and Diagnostics",
    description: "Master computer networking from the OSI model to practical diagnostics. Complete coverage of IP addressing, DNS, ports, protocols, and network security tools.",
  },
  alternates: { canonical: `${SITE_URL}/ultimate-guides/networking` },
};

const pageUrl = `${SITE_URL}/ultimate-guides/networking`;
const pageTitle = "The Ultimate Networking Guide — DNS, TCP/IP, Ports, and Diagnostics";
const pageDescription = "A comprehensive guide to computer networking covering the OSI model, TCP/IP stack, IPv4 and IPv6 addressing, CIDR and subnetting, DNS, common ports and protocols, network diagnostics, and network security.";

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Guides", href: `${SITE_URL}/guides` },
  { label: "Ultimate Networking Guide" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the OSI model and why is it important?",
    answer: "The OSI (Open Systems Interconnection) model is a conceptual framework that standardizes networking functions into seven layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. It helps network professionals understand, troubleshoot, and design network systems by isolating issues to specific layers."
  },
  {
    question: "What is the difference between IPv4 and IPv6?",
    answer: "IPv4 uses 32-bit addresses (4.3 billion possible) written as four decimal octets like 192.168.1.1. IPv6 uses 128-bit addresses (340 undecillion possible) written as eight hexadecimal groups like 2001:db8::1. IPv6 was created to solve IPv4 address exhaustion and includes built-in security (IPsec) and improved routing efficiency."
  },
  {
    question: "What is CIDR notation?",
    answer: "CIDR (Classless Inter-Domain Routing) notation specifies an IP address and its subnet mask using a suffix like /24 (IPv4) or /64 (IPv6). For example, 192.168.1.0/24 means the first 24 bits are the network portion, leaving 8 bits for host addresses (256 total, 254 usable). Use Nuvora's Subnet Calculator to compute network ranges."
  },
  {
    question: "What port does HTTPS use?",
    answer: "HTTPS uses port 443 by default. HTTP uses port 80. Other common ports include: 22 (SSH), 25 (SMTP), 53 (DNS), 110 (POP3), 143 (IMAP), 3306 (MySQL), and 5432 (PostgreSQL). The Internet Assigned Numbers Authority (IANA) maintains the official port number registry."
  },
  {
    question: "How do I test if a port is open on a remote server?",
    answer: "Use Nuvora's Port Checker to test if any port is open on a remote host. Enter the hostname or IP address and port number, and the tool will attempt a TCP connection and report whether the port is open, closed, or filtered. You can also scan common ports to identify running services."
  }
];

export default function UltimateNetworkingGuidePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: pageUrl, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <article>
        <header className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">{pageTitle}</h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{pageDescription}</p>
            <div className="mt-6">
              <SocialShare url={pageUrl} title={pageTitle} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-16">
            <section id="networking-fundamentals">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">1. Networking Fundamentals</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Computer networking is the practice of connecting computers and devices to share data and resources. Understanding the fundamental models that describe how networks operate is essential for anyone working with the internet or network infrastructure.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">The OSI Model</h3>
                <p>The Open Systems Interconnection (OSI) model is a seven-layer conceptual framework developed by ISO in 1984. It divides network communication into distinct layers, each with specific responsibilities:</p>
                <ol className="list-decimal space-y-2 pl-5">
                  <li><strong>Layer 1 — Physical:</strong> Transmits raw bit streams over physical media (cables, fiber, radio waves). Hardware includes hubs, repeaters, and network interfaces.</li>
                  <li><strong>Layer 2 — Data Link:</strong> Provides node-to-node data transfer and error detection. Handles MAC addresses, frames, and switches. Ethernet and Wi-Fi operate here.</li>
                  <li><strong>Layer 3 — Network:</strong> Routes data between different networks. Handles IP addresses, routing protocols (BGP, OSPF), and routers. IP (IPv4 and IPv6) operates at this layer.</li>
                  <li><strong>Layer 4 — Transport:</strong> Ensures reliable or unreliable data delivery between applications. TCP (reliable, connection-oriented) and UDP (unreliable, connectionless) operate here.</li>
                  <li><strong>Layer 5 — Session:</strong> Manages sessions between applications, including establishment, maintenance, and termination.</li>
                  <li><strong>Layer 6 — Presentation:</strong> Translates data between application and network formats. Handles encryption, compression, and encoding (SSL/TLS operates partly here).</li>
                  <li><strong>Layer 7 — Application:</strong> Provides network services directly to applications. HTTP, FTP, SMTP, and DNS operate at this layer.</li>
                </ol>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">The TCP/IP Stack</h3>
                <p>The TCP/IP model (also called the Internet Protocol Suite) is a more practical four-layer model that maps to real-world internet protocols. It consists of: Network Interface (physical + data link), Internet (IP routing), Transport (TCP, UDP), and Application (HTTP, DNS, SMTP). While the OSI model is useful for learning and reference, TCP/IP is what actually powers the internet.</p>
              </div>
            </section>

            <section id="ip-addressing">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">2. IP Addressing</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>An IP address is a unique identifier assigned to each device on a network. There are two versions of IP addresses in use today.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">IPv4</h3>
                <p>IPv4 addresses are 32-bit numbers written as four decimal octets separated by dots (e.g., 192.168.1.1). This provides approximately 4.3 billion unique addresses. Due to address exhaustion, IPv4 addresses are now a scarce resource managed through NAT (Network Address Translation), which allows multiple devices to share a single public IP address. Private IPv4 address ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are used for internal networks.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">IPv6</h3>
                <p>IPv6 addresses are 128-bit numbers written as eight hexadecimal groups separated by colons (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334). Leading zeros can be omitted, and consecutive zero groups can be replaced with :: (once per address). IPv6 provides 340 undecillion addresses — enough for every device on earth to have billions of addresses each. IPv6 also includes mandatory IPsec support and eliminates the need for NAT.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">CIDR and Subnetting</h3>
                <p>Classless Inter-Domain Routing (CIDR) notation specifies a network prefix length: 192.168.1.0/24 means the first 24 bits are the network identifier. Common IPv4 CIDR prefixes: /32 (single host), /24 (254 hosts), /16 (65,534 hosts), /8 (~16 million hosts). Subnetting divides a network into smaller subnetworks for better management and security. Use <Link href="/subnet-calculator" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Subnet Calculator</Link> to compute network addresses, broadcast addresses, usable host ranges, and subnet masks.</p>
                <p>Find your own IP address with <Link href="/what-is-my-ip" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora What Is My IP</Link> or look up any IP with <Link href="/ip-lookup" className="text-blue-600 hover:underline dark:text-blue-400">IP Lookup</Link> to get location, ISP, and ASN information.</p>
              </div>
            </section>

            <section id="dns">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">3. DNS Quick Reference</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>The Domain Name System (DNS) translates human-readable domain names into IP addresses. For a complete deep dive, see our <Link href="/ultimate-guides/dns" className="text-blue-600 hover:underline dark:text-blue-400">Ultimate DNS Guide</Link>. Here are the essentials:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>Recursive resolver:</strong> The server that handles DNS queries from clients (e.g., 1.1.1.1, 8.8.8.8).</li>
                  <li><strong>Root servers:</strong> 13 logical authorities (A–M) that direct queries to TLD servers.</li>
                  <li><strong>TLD servers:</strong> Manage top-level domains (.com, .org, .net, .uk, etc.).</li>
                  <li><strong>Authoritative nameservers:</strong> The final authority for a domain&apos;s DNS records.</li>
                  <li><strong>Common record types:</strong> A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (text), NS (nameserver), SOA (zone authority).</li>
                </ul>
                <p>Use <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora DNS Lookup</Link> to query any DNS record type or <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> to verify worldwide propagation.</p>
              </div>
            </section>

            <section id="ports-and-protocols">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">4. Ports and Protocols</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Network ports are virtual endpoints for communication identified by 16-bit numbers (0–65535). The Internet Assigned Numbers Authority (IANA) assigns well-known ports (0–1023), registered ports (1024–49151), and dynamic/private ports (49152–65535). Below are the most commonly used ports.</p>
              </div>
              <ComparisonMatrix
                title="Common Network Ports and Protocols"
                headers={["Transport", "Service", "Purpose"]}
                rows={[
                  { feature: "20/21", values: ["TCP", "FTP", "File Transfer Protocol (data + control)"], highlight: false },
                  { feature: "22", values: ["TCP", "SSH", "Secure Shell (remote administration)"], highlight: false },
                  { feature: "23", values: ["TCP", "Telnet", "Unencrypted remote terminal access"], highlight: false },
                  { feature: "25", values: ["TCP", "SMTP", "Simple Mail Transfer Protocol (email sending)"], highlight: false },
                  { feature: "53", values: ["TCP/UDP", "DNS", "Domain Name System queries"], highlight: true },
                  { feature: "80", values: ["TCP", "HTTP", "Hypertext Transfer Protocol (web)"], highlight: false },
                  { feature: "110", values: ["TCP", "POP3", "Post Office Protocol v3 (email retrieval)"], highlight: false },
                  { feature: "143", values: ["TCP", "IMAP", "Internet Message Access Protocol (email)"], highlight: false },
                  { feature: "443", values: ["TCP", "HTTPS", "HTTP over TLS/SSL (secure web)"], highlight: true },
                  { feature: "465", values: ["TCP", "SMTPS", "SMTP over TLS/SSL"], highlight: false },
                  { feature: "587", values: ["TCP", "SMTP Submission", "Mail submission with STARTTLS"], highlight: false },
                  { feature: "993", values: ["TCP", "IMAPS", "IMAP over TLS/SSL"], highlight: false },
                  { feature: "995", values: ["TCP", "POP3S", "POP3 over TLS/SSL"], highlight: false },
                  { feature: "3306", values: ["TCP", "MySQL", "MySQL database connection"], highlight: false },
                  { feature: "3389", values: ["TCP", "RDP", "Remote Desktop Protocol"], highlight: false },
                  { feature: "5432", values: ["TCP", "PostgreSQL", "PostgreSQL database connection"], highlight: false },
                  { feature: "27017", values: ["TCP", "MongoDB", "MongoDB database connection"], highlight: false },
                ]}
              />
              <div className="mt-4 text-zinc-600 dark:text-zinc-400">
                <p>Test if a port is open on any host with <Link href="/port-checker" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Port Checker</Link>. Browse our complete <Link href="/port-numbers" className="text-blue-600 hover:underline dark:text-blue-400">port numbers reference</Link> for all assigned ports.</p>
              </div>
            </section>

            <section id="network-diagnostics">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">5. Network Diagnostics</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Network diagnostics help identify connectivity issues, performance bottlenecks, and configuration problems. Nuvora provides a complete set of diagnostic tools for every layer of the network stack.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Ping Test</h3>
                <p>Ping measures network latency and packet loss by sending ICMP echo requests to a target host. It reports minimum, average, and maximum round-trip times. High latency indicates network congestion or distance. Packet loss indicates connectivity issues. Use <Link href="/ping-test" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Ping Test</Link> to test connectivity to any host.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">DNS Lookup</h3>
                <p>DNS diagnostics verify that domain names resolve correctly. Use <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora DNS Lookup</Link> to test all record types and identify misconfiguration, missing records, or propagation delays.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Port Checking</h3>
                <p>Port scanning verifies which services are accessible on a remote host. Use <Link href="/port-checker" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Port Checker</Link> to test if specific ports are open and responding. This is essential for firewall testing and service deployment verification.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">HTTP Headers Check</h3>
                <p>Inspect HTTP response headers to verify web server configuration, security headers, caching policies, and redirect chains. Use <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora HTTP Headers Checker</Link> for comprehensive header analysis.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Website Status</h3>
                <p>Check if a website is online, measure response time, and get detailed status information including server software, content type, and response headers. Use <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Website Status Checker</Link>.</p>
              </div>
            </section>

            <section id="network-security">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">6. Network Security</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Network security protects the integrity, confidentiality, and accessibility of network data and resources. Key components include:</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Firewalls</h3>
                <p>Firewalls control incoming and outgoing network traffic based on security rules. They can be hardware-based (network firewall), software-based (host firewall), or cloud-based (WAF — Web Application Firewall). Firewalls filter traffic by IP address, port number, protocol, and application layer content. Modern firewalls include intrusion detection and prevention (IDS/IPS) capabilities.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">VPNs (Virtual Private Networks)</h3>
                <p>VPNs create encrypted tunnels between devices and remote networks, providing privacy and security over public networks. Common VPN protocols include WireGuard (fastest, modern), OpenVPN (widely supported), IPsec (enterprise standard), and IKEv2 (mobile-friendly). VPNs protect against eavesdropping on public Wi-Fi and allow secure remote access to corporate networks.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">SSL/TLS</h3>
                <p>TLS encrypts data in transit for web traffic, email, and other application protocols. Every website should use HTTPS with a valid TLS certificate. Check your certificate with <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora SSL Certificate Checker</Link>. For a complete treatment, see our <Link href="/ultimate-guides/ssl-tls" className="text-blue-600 hover:underline dark:text-blue-400">Ultimate SSL/TLS Guide</Link>.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Best Practices</h3>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Close unnecessary ports and disable unused services</li>
                  <li>Use strong encryption (TLS 1.2/1.3, AES, ChaCha20)</li>
                  <li>Implement network segmentation (VLANs, subnets)</li>
                  <li>Use DNSSEC to protect DNS integrity</li>
                  <li>Enable logging and monitoring (SIEM systems)</li>
                  <li>Apply the principle of least privilege for network access</li>
                  <li>Regularly audit network configuration with tools like <Link href="/domain-report" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Domain Report Card</Link></li>
                </ul>
              </div>
            </section>

            <section id="network-tools">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">7. Network Tools</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Nuvora offers the most comprehensive collection of free network diagnostic tools available online. Here are all our network tools:</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link href="/dns-lookup" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">DNS Lookup</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">Query all DNS record types</span>
                  </Link>
                  <Link href="/dns-propagation-checker" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">DNS Propagation Checker</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">Check global DNS propagation</span>
                  </Link>
                  <Link href="/reverse-dns-lookup" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">Reverse DNS Lookup</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">IP to hostname resolution</span>
                  </Link>
                  <Link href="/whois-lookup" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">WHOIS Lookup</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">Domain registration details</span>
                  </Link>
                  <Link href="/ssl-certificate-checker" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">SSL Certificate Checker</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">TLS certificate inspection</span>
                  </Link>
                  <Link href="/ping-test" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">Ping Test</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">Network latency and packet loss</span>
                  </Link>
                  <Link href="/port-checker" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">Port Checker</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">Test open ports on any host</span>
                  </Link>
                  <Link href="/http-headers-checker" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">HTTP Headers Checker</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">Inspect HTTP response headers</span>
                  </Link>
                  <Link href="/website-status-checker" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">Website Status Checker</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">Check if a site is online</span>
                  </Link>
                  <Link href="/redirect-checker" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">Redirect Checker</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">Trace URL redirect chains</span>
                  </Link>
                  <Link href="/what-is-my-ip" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">What Is My IP</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">Find your public IP address</span>
                  </Link>
                  <Link href="/ip-lookup" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">IP Lookup</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">Detailed IP geolocation</span>
                  </Link>
                  <Link href="/subnet-calculator" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">Subnet Calculator</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">CIDR and subnet calculations</span>
                  </Link>
                  <Link href="/domain-report" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">Domain Report Card</span>
                    <span className="block text-zinc-600 dark:text-zinc-400">Complete domain health audit</span>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <section className="mt-16">
            <FaqSection items={faqItems} title="Networking Frequently Asked Questions" />
          </section>

          <section className="mt-16 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Related Resources</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link href="/ultimate-guides/dns" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">Ultimate DNS Guide</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Deep dive into the Domain Name System</span>
              </Link>
              <Link href="/ultimate-guides/ssl-tls" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">Ultimate SSL/TLS Guide</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Complete SSL/TLS reference</span>
              </Link>
              <Link href="/ultimate-guides/http" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">Ultimate HTTP Guide</span>
                <span className="block text-zinc-600 dark:text-zinc-400">HTTP methods, status codes, and headers</span>
              </Link>
              <Link href="/port-numbers" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">Port Numbers Reference</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Complete list of network port numbers</span>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
