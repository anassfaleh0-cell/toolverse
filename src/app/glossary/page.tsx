import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: `Technical Glossary — Network, Security, and Developer Terms`,
  description: `Comprehensive A-Z glossary of 60+ technical terms covering DNS, SSL/TLS, HTTP, networking, security, web performance, and developer concepts. Free reference for IT professionals.`,
  openGraph: {
  title: `Technical Glossary — Network, Security, and Developer Terms`,
    description: `A-Z reference of 60+ essential technical terms for developers, network engineers, and security professionals.`,
    url: `${SITE_URL}/glossary`,
  },
  twitter: { card: "summary_large_image", title: `Technical Glossary — Network, Security, and Developer Terms`, description: `A-Z reference of essential technical terms.` },
  alternates: { canonical: `${SITE_URL}/glossary` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Glossary" },
];

interface Term {
  term: string;
  definition: string;
}

const glossary: Record<string, Term[]> = {
  "A-E": [
    { term: "A Record", definition: "A DNS record that maps a domain name to an IPv4 address. The most fundamental DNS record type used to direct traffic to web servers." },
    { term: "AAAA Record", definition: "A DNS record that maps a domain name to an IPv6 address, the modern successor to the A Record for IPv6-enabled networks." },
    { term: "API", definition: "Application Programming Interface — a set of protocols and tools that allows different software applications to communicate and exchange data with each other." },
    { term: "ARP", definition: "Address Resolution Protocol — a protocol used to map IP network addresses to the physical hardware addresses (MAC) of devices on a local network segment." },
    { term: "Base64", definition: "A binary-to-text encoding scheme that represents binary data in an ASCII string format using 64 characters, commonly used for embedding images or attachments in data formats like JSON." },
    { term: "CAA", definition: "Certification Authority Authorization — a DNS record that specifies which certificate authorities are authorized to issue SSL/TLS certificates for a domain, adding a layer of security." },
    { term: "CDN", definition: "Content Delivery Network — a geographically distributed network of proxy servers that delivers cached content to users from the nearest server, reducing latency and improving load times." },
    { term: "CIDR", definition: "Classless Inter-Domain Routing — a method for allocating IP addresses and IP routing that replaces classful addressing, written as a base IP followed by a prefix length (e.g., 192.168.1.0/24)." },
    { term: "CLS", definition: "Cumulative Layout Shift — a Core Web Vital metric measuring visual stability by tracking unexpected layout shifts during a page's lifespan. Lower scores mean better user experience." },
    { term: "CNAME", definition: "Canonical Name Record — a DNS record that aliases one domain name to another, allowing multiple domain names to resolve to the same IP address via a single A or AAAA record." },
    { term: "CORS", definition: "Cross-Origin Resource Sharing — a browser security mechanism that allows a web page from one origin to request resources from a different origin, controlled via HTTP headers." },
    { term: "CSRF", definition: "Cross-Site Request Forgery — a security vulnerability where an attacker tricks a user into executing unwanted actions on a web application where they are authenticated." },
    { term: "CSP", definition: "Content Security Policy — a browser security standard that uses HTTP headers to specify which sources of content (scripts, styles, images) are allowed to execute on a web page." },
    { term: "CSS", definition: "Cascading Style Sheets — a stylesheet language used to describe the presentation and layout of HTML documents, controlling colors, fonts, spacing, and responsive design." },
    { term: "CSV", definition: "Comma-Separated Values — a simple file format for storing tabular data where each line is a row and values are separated by commas, widely used for data exchange." },
    { term: "DANE", definition: "DNS-Based Authentication of Named Entities — a protocol that uses DNSSEC to bind TLS certificates to domain names, reducing reliance on public certificate authorities." },
    { term: "DHCP", definition: "Dynamic Host Configuration Protocol — a network protocol that automatically assigns IP addresses, subnet masks, gateways, and DNS servers to devices on a network." },
    { term: "DKIM", definition: "DomainKeys Identified Mail — an email authentication method that uses digital signatures to verify that an email was not tampered with during transit." },
    { term: "DMARC", definition: "Domain-based Message Authentication, Reporting, and Conformance — an email authentication protocol that tells receiving servers how to handle emails that fail SPF or DKIM checks." },
    { term: "DNS", definition: "Domain Name System — the hierarchical naming system that translates human-readable domain names (like example.com) into machine-readable IP addresses." },
    { term: "DNSSEC", definition: "DNS Security Extensions — a suite of security extensions that add cryptographic signatures to DNS records, protecting against forged or manipulated DNS data." },
    { term: "DOM", definition: "Document Object Model — a programming interface for HTML and XML documents that represents the page structure as a tree of objects that can be manipulated with JavaScript." },
  ],
  "F-J": [
    { term: "FID", definition: "First Input Delay — a Core Web Vital metric that measures the time from when a user first interacts with a page to when the browser can respond to that interaction." },
    { term: "FTP", definition: "File Transfer Protocol — a standard network protocol used to transfer files between a client and a server on a computer network." },
    { term: "HSTS", definition: "HTTP Strict Transport Security — a web security policy mechanism that forces browsers to connect to a website only over HTTPS, preventing downgrade attacks." },
    { term: "HTTP", definition: "Hypertext Transfer Protocol — the foundation protocol of the World Wide Web, defining how messages are formatted and transmitted between web servers and browsers." },
    { term: "ICMP", definition: "Internet Control Message Protocol — a network protocol used by network devices to send error messages and operational information, such as in ping and traceroute." },
    { term: "IMAP", definition: "Internet Message Access Protocol — an email protocol that allows a client to access and manage emails stored on a mail server without downloading them locally." },
    { term: "INP", definition: "Interaction to Next Paint — a Core Web Vital metric that measures the responsiveness of a page by observing the latency of all click, tap, and keyboard interactions." },
    { term: "IP", definition: "Internet Protocol — the principal communications protocol in the Internet protocol suite for relaying datagrams across network boundaries, the foundation of internet addressing." },
    { term: "JSON", definition: "JavaScript Object Notation — a lightweight, language-independent data interchange format that uses human-readable text to store and transmit data objects." },
    { term: "JWT", definition: "JSON Web Token — a compact, URL-safe token format used for securely transmitting information between parties as a JSON object, commonly used for authentication and authorization." },
  ],
  "K-O": [
    { term: "LCP", definition: "Largest Contentful Paint — a Core Web Vital metric that measures the render time of the largest visible content element on a page, indicating perceived load speed." },
    { term: "LFI", definition: "Local File Inclusion — a security vulnerability that allows an attacker to include local files on a server through a web application, potentially exposing sensitive data." },
    { term: "MX Record", definition: "Mail Exchange Record — a DNS record that specifies the mail server responsible for accepting email messages on behalf of a domain, with priority values for failover." },
    { term: "NAT", definition: "Network Address Translation — a method that maps private IP addresses within a local network to a single public IP address, conserving global IP address space." },
    { term: "NS Record", definition: "Name Server Record — a DNS record that delegates a domain or subdomain to a set of authoritative name servers that host its DNS zone data." },
    { term: "OAuth", definition: "Open Authorization — an open standard for token-based authentication and authorization that allows third-party applications to access user data without sharing passwords." },
  ],
  "P-T": [
    { term: "POP3", definition: "Post Office Protocol version 3 — an email protocol used by clients to download emails from a mail server to a local device, typically deleting them from the server." },
    { term: "PTR Record", definition: "Pointer Record — a DNS record that maps an IP address to a domain name, used for reverse DNS lookups to verify the identity of mail servers and network hosts." },
    { term: "PWA", definition: "Progressive Web App — a web application that uses modern web capabilities to deliver an app-like experience, including offline support, push notifications, and home screen installation." },
    { term: "RFI", definition: "Remote File Inclusion — a security vulnerability that allows an attacker to include remote files from external servers into a web application, often leading to code execution." },
    { term: "SEO", definition: "Search Engine Optimization — the practice of improving a website's visibility and ranking in search engine results pages through technical optimization, content quality, and link building." },
    { term: "SERP", definition: "Search Engine Results Page — the page displayed by search engines in response to a user query, listing organic and paid results relevant to the search terms." },
    { term: "SMTP", definition: "Simple Mail Transfer Protocol — the standard protocol for sending email messages between servers, responsible for outgoing mail transmission on the internet." },
    { term: "SOA Record", definition: "Start of Authority Record — a DNS record that provides authoritative information about a DNS zone, including the primary name server, admin contact, and timing parameters." },
    { term: "SPF", definition: "Sender Policy Framework — an email authentication method that specifies which mail servers are authorized to send email on behalf of a domain via DNS TXT records." },
    { term: "SQLi", definition: "SQL Injection — a security vulnerability where an attacker inserts malicious SQL statements into application queries, potentially accessing or destroying database data." },
    { term: "SRV Record", definition: "Service Record — a DNS record that specifies the location (hostname and port) of specific services such as SIP, LDAP, or XMPP for a domain." },
    { term: "SSH", definition: "Secure Shell — a cryptographic network protocol for operating network services securely over an unsecured network, commonly used for remote server administration." },
    { term: "SSL", definition: "Secure Sockets Layer — the predecessor of TLS, a cryptographic protocol that provides secure communication over a computer network. Superseded by TLS but the term is still widely used." },
    { term: "TCP", definition: "Transmission Control Protocol — a connection-oriented transport protocol that provides reliable, ordered, and error-checked delivery of data between applications on a network." },
    { term: "TLS", definition: "Transport Layer Security — the modern cryptographic protocol that secures communications over a computer network, the successor to SSL, used in HTTPS connections." },
    { term: "TTFB", definition: "Time to First Byte — a performance metric that measures the time between a browser's request and the first byte of response from the server, reflecting backend latency." },
    { term: "TTL", definition: "Time to Live — a value in DNS records that specifies how long a resolver should cache the record before requesting a fresh copy, measured in seconds." },
  ],
  "U-Z": [
    { term: "UDP", definition: "User Datagram Protocol — a connectionless transport protocol that provides fast, lightweight data transmission without guaranteed delivery, used for DNS queries and streaming." },
    { term: "UI", definition: "User Interface — the visual elements and interactive components of a software application that users see and interact with, including buttons, menus, and layouts." },
    { term: "URI", definition: "Uniform Resource Identifier — a string of characters that identifies a resource on the internet, encompassing both URLs and URNs as subsets." },
    { term: "URL", definition: "Uniform Resource Locator — the full web address used to access a resource on the internet, including the protocol, domain name, path, and optional query parameters." },
    { term: "URN", definition: "Uniform Resource Name — a type of URI that uses a persistent, location-independent identifier for a resource, such as ISBN numbers for books." },
    { term: "UX", definition: "User Experience — the overall experience a user has when interacting with a product or service, encompassing usability, accessibility, and satisfaction." },
    { term: "VPN", definition: "Virtual Private Network — a service that creates an encrypted tunnel between a device and a remote server, protecting internet traffic from eavesdropping and masking the user's IP." },
    { term: "WASM", definition: "WebAssembly — a low-level binary instruction format that runs in modern web browsers at near-native speed, allowing languages like C, C++, and Rust to run on the web." },
    { term: "WHOIS", definition: "A query and response protocol used to look up registration information about domain names, IP address blocks, and autonomous system numbers." },
    { term: "XML", definition: "eXtensible Markup Language — a markup language that defines rules for encoding documents in a format that is both human-readable and machine-readable, used for data exchange." },
    { term: "XSS", definition: "Cross-Site Scripting — a security vulnerability where an attacker injects malicious scripts into web pages viewed by other users, potentially stealing data or session tokens." },
    { term: "XXE", definition: "XML External Entity Injection — a security vulnerability that exploits XML parsers to process external entity references, potentially exposing internal files or enabling SSRF attacks." },
    { term: "YAML", definition: "YAML Ain't Markup Language — a human-readable data serialization language that uses indentation to represent structured data, commonly used for configuration files." },
  ],
};

const sectionOrder = ["A-E", "F-J", "K-O", "P-T", "U-Z"] as const;

export default function GlossaryPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Technical Glossary — Network, Security, and Developer Terms | ${SITE_NAME}`, description: `A-Z glossary of 60+ technical terms covering DNS, SSL, TLS, HTTP, networking, security, and developer concepts.`, url: `${SITE_URL}/glossary`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Technical Glossary
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                An A-Z reference of 60+ essential technical terms for developers, network engineers, security professionals, and IT enthusiasts. Each term includes a clear, concise definition.
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/glossary`} title="Technical Glossary — Network, Security, and Developer Terms" />
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap gap-2">
            {sectionOrder.map((section) => {
              const first = glossary[section][0];
              const anchor = first ? first.term.toLowerCase() : section.toLowerCase();
              return (
                <a
                  key={section}
                  href={`#${anchor}`}
                  className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                >
                  {section}
                </a>
              );
            })}
          </div>
          {sectionOrder.map((section) => {
            const anchor = glossary[section][0].term.toLowerCase();
            return (
              <details key={section} className="group mb-6 last:mb-0" id={anchor} open>
                <summary className="cursor-pointer rounded-lg bg-zinc-100 px-4 py-3 text-xl font-bold text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700">
                  <span className="inline-block transition-transform group-open:rotate-90">&gt;</span>{" "}
                  {section}
                </summary>
                <div className="mt-4 space-y-4">
                  {glossary[section].map(({ term, definition }) => (
                    <div key={term}>
                      <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {term}
                      </div>
                      <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                        {definition}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
          <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Related Resources</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/dns-record-types" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-zinc-200 hover:bg-blue-50 dark:bg-zinc-700 dark:text-blue-400 dark:ring-zinc-600 dark:hover:bg-zinc-600">DNS Record Types</Link>
              <Link href="/http-status-codes" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-zinc-200 hover:bg-blue-50 dark:bg-zinc-700 dark:text-blue-400 dark:ring-zinc-600 dark:hover:bg-zinc-600">HTTP Status Codes</Link>
              <Link href="/tls-versions" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-zinc-200 hover:bg-blue-50 dark:bg-zinc-700 dark:text-blue-400 dark:ring-zinc-600 dark:hover:bg-zinc-600">TLS/SSL Versions</Link>
              <Link href="/cheat-sheets/developer-dns" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-zinc-200 hover:bg-blue-50 dark:bg-zinc-700 dark:text-blue-400 dark:ring-zinc-600 dark:hover:bg-zinc-600">DNS Cheat Sheet</Link>
              <Link href="/http-headers" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-zinc-200 hover:bg-blue-50 dark:bg-zinc-700 dark:text-blue-400 dark:ring-zinc-600 dark:hover:bg-zinc-600">HTTP Headers</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
