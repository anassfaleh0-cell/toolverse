import { SITE_NAME } from "@/lib/constants";
import { getInternalTools, type Tool } from "@/lib/registry";
import type { FaqItem } from "@/lib/seo";

export interface TagConfig {
  slug: string;
  name: string;
  getDescription: () => string;
  matchTool: (tool: Tool) => boolean;
  getFaqs: () => FaqItem[];
}

function nameOrDescIncludes(...keywords: string[]) {
  return (tool: Tool) =>
    keywords.some((kw) =>
      tool.name.toLowerCase().includes(kw) ||
      tool.description.toLowerCase().includes(kw),
    );
}

function categoryIs(...cats: string[]) {
  return (tool: Tool) => cats.includes(tool.category);
}

export const TAGS: TagConfig[] = [
  {
    slug: "dns",
    name: "DNS",
    getDescription: () =>
      `Free online DNS tools on ${SITE_NAME}. Look up DNS records, check propagation, perform reverse DNS lookups, and troubleshoot domain name resolution issues.`,
    matchTool: nameOrDescIncludes("dns", "domain name"),
    getFaqs: () => [
      {
        question: `What DNS tools does ${SITE_NAME} offer?`,
        answer: `DNS Lookup, Reverse DNS Lookup, and DNS Propagation Checker. These tools help you query and troubleshoot domain name system records.`,
      },
      {
        question: `Are the DNS tools free?`,
        answer: `Yes, all DNS tools on ${SITE_NAME} are free with no usage limits.`,
      },
      {
        question: `How accurate are the DNS results?`,
        answer: `We query authoritative name servers directly in real time, providing the most current DNS records available.`,
      },
    ],
  },
  {
    slug: "ip",
    name: "IP Address",
    getDescription: () =>
      `Free IP address tools on ${SITE_NAME}. Find your public IP, look up any IP address for geolocation and ISP details, and perform reverse DNS lookups.`,
    matchTool: nameOrDescIncludes("ip", "ipv4", "ipv6", "ip address", "what is my ip"),
    getFaqs: () => [
      {
        question: `What IP tools does ${SITE_NAME} offer?`,
        answer: `What Is My IP, IP Lookup, and Reverse DNS Lookup. Find your public IP or look up detailed information about any IP address.`,
      },
      {
        question: `Is my IP address stored?`,
        answer: `No. IP addresses are used only to process your current query and are not stored or logged.`,
      },
      {
        question: `How accurate is the geolocation data?`,
        answer: `Geolocation data is based on public IP allocation databases and ISP information. Accuracy varies by region and IP type.`,
      },
    ],
  },
  {
    slug: "http",
    name: "HTTP",
    getDescription: () =>
      `Free HTTP tools on ${SITE_NAME}. Inspect HTTP response headers, check website status codes, and analyze server configurations for any URL.`,
    matchTool: nameOrDescIncludes("http", "website", "web", "status", "header", "response"),
    getFaqs: () => [
      {
        question: `What HTTP tools does ${SITE_NAME} offer?`,
        answer: `HTTP Headers Checker and Website Status Checker. Inspect response headers, status codes, caching policies, and redirect chains.`,
      },
      {
        question: `Why check HTTP headers?`,
        answer: `HTTP headers reveal critical information about security policies (CSP, HSTS), caching configuration, content negotiation, and redirect chains.`,
      },
      {
        question: `What does Website Status Checker do?`,
        answer: `It checks if a website is online, returns the HTTP status code, measures response time, and provides server information.`,
      },
    ],
  },
  {
    slug: "security",
    name: "Security",
    getDescription: () =>
      `Free security tools on ${SITE_NAME}. Check SSL/TLS certificates, scan ports, inspect HTTP security headers, and perform WHOIS lookups for domain investigation.`,
    matchTool: nameOrDescIncludes("ssl", "tls", "certificate", "security", "secure", "port", "whois"),
    getFaqs: () => [
      {
        question: `What security tools does ${SITE_NAME} offer?`,
        answer: `SSL Certificate Checker, Port Checker, HTTP Headers Checker (for security headers), and WHOIS Lookup for domain investigation.`,
      },
      {
        question: `Can I check if my SSL certificate is valid?`,
        answer: `Yes. Enter your domain to check SSL/TLS certificate details including issuer, validity period, and days until expiration.`,
      },
      {
        question: `How do I scan for open ports?`,
        answer: `Use the Port Checker tool. Enter a host and port number to test if the port is open and what service is running.`,
      },
    ],
  },
  {
    slug: "network",
    name: "Network",
    getDescription: () =>
      `Free network diagnostic tools on ${SITE_NAME}. Test ping latency, scan ports, perform DNS lookups, check WHOIS records, and monitor network connectivity.`,
    matchTool: categoryIs("network-internet"),
    getFaqs: () => [
      {
        question: `What network tools does ${SITE_NAME} offer?`,
        answer: `Ping Test, Port Checker, DNS Lookup, Reverse DNS, DNS Propagation Checker, WHOIS Lookup, and IP tools.`,
      },
      {
        question: `Can I test network latency?`,
        answer: `Yes. Our Ping Test measures latency (min, average, max) and packet loss to any host.`,
      },
      {
        question: `How does the Port Checker work?`,
        answer: `It attempts a TCP connection to the specified host and port. If the connection succeeds, the port is reported as open.`,
      },
    ],
  },
  {
    slug: "json",
    name: "JSON",
    getDescription: () =>
      `Free JSON tools on ${SITE_NAME}. Format, validate, and beautify JSON data for easier debugging and development.`,
    matchTool: nameOrDescIncludes("json"),
    getFaqs: () => [
      {
        question: `What JSON tools does ${SITE_NAME} offer?`,
        answer: `JSON Formatter with tree view, search, and diff comparison for debugging and validating JSON data.`,
      },
      {
        question: `Are JSON files stored on your server?`,
        answer: `No. All JSON processing happens in your browser. Your data never leaves your device.`,
      },
      {
        question: `What formats are supported?`,
        answer: `JSON formatting, validation, minification, and diff comparison between two JSON documents.`,
      },
    ],
  },
  {
    slug: "ssl",
    name: "SSL/TLS",
    getDescription: () =>
      `Free SSL/TLS tools on ${SITE_NAME}. Check SSL certificate details, verify certificate chains, monitor expiration dates, and ensure secure connections.`,
    matchTool: nameOrDescIncludes("ssl", "tls", "certificate"),
    getFaqs: () => [
      {
        question: `What SSL tools does ${SITE_NAME} offer?`,
        answer: `SSL Certificate Checker that validates certificate details, issuer information, expiry dates, supported protocols, and subject alternative names.`,
      },
      {
        question: `How often should I check my SSL certificate?`,
        answer: `Monthly checks are recommended. Set up reminders before the expiration date to avoid unexpected lapses.`,
      },
      {
        question: `Can I check wildcard certificates?`,
        answer: `Yes. Wildcard SSL certificates are fully supported. Enter the root domain to check wildcard certificate details.`,
      },
    ],
  },
  {
    slug: "whois",
    name: "WHOIS",
    getDescription: () =>
      `Free WHOIS lookup tools on ${SITE_NAME}. Look up domain registration details including registrar, creation and expiration dates, name servers, and contact information.`,
    matchTool: nameOrDescIncludes("whois", "domain", "registr"),
    getFaqs: () => [
      {
        question: `What WHOIS information is available?`,
        answer: `Domain registrar, registration and expiration dates, name servers, domain status, and (where public) registrant contact information.`,
      },
      {
        question: `Is WHOIS data always accurate?`,
        answer: `WHOIS data is provided by the domain registrant. Accuracy depends on the registrant keeping their information current. Some registrants use privacy protection services.`,
      },
      {
        question: `Can I look up any domain?`,
        answer: `Yes. Enter any registered domain to perform a WHOIS lookup. Some TLDs may have restricted WHOIS access.`,
      },
    ],
  },
  {
    slug: "ping",
    name: "Ping",
    getDescription: () =>
      `Free ping test tools on ${SITE_NAME}. Test network latency and packet loss to any host. Ideal for network troubleshooting and performance monitoring.`,
    matchTool: nameOrDescIncludes("ping", "latency", "packet loss"),
    getFaqs: () => [
      {
        question: `What does the Ping Test measure?`,
        answer: `Minimum, average, and maximum response time, plus packet loss percentage to the target host.`,
      },
      {
        question: `How does the ping test work?`,
        answer: `We send TCP probes to the target host and measure the round-trip time. Results include min, avg, and max latency.`,
      },
      {
        question: `Is ping testing free?`,
        answer: `Yes, the ping test is completely free with no usage restrictions.`,
      },
    ],
  },
  {
    slug: "port",
    name: "Port",
    getDescription: () =>
      `Free port checking tools on ${SITE_NAME}. Test if network ports are open, identify running services, and troubleshoot connectivity issues.`,
    matchTool: nameOrDescIncludes("port", "open port", "port scan"),
    getFaqs: () => [
      {
        question: `What does the Port Checker do?`,
        answer: `Tests if a specific TCP port is open on a target host and attempts to identify the running service.`,
      },
      {
        question: `What ports can I check?`,
        answer: `Any TCP port from 1 to 65535. Common ports (80, 443, 22, 21, etc.) are available as quick-select options.`,
      },
      {
        question: `Is port scanning legal?`,
        answer: `Scanning your own servers or servers you have permission to test is legal. Scanning arbitrary third-party hosts may be prohibited.`,
      },
    ],
  },
  {
    slug: "geolocation",
    name: "Geolocation",
    getDescription: () =>
      `Free IP geolocation tools on ${SITE_NAME}. Look up the geographic location, ISP, and ASN information for any IP address.`,
    matchTool: nameOrDescIncludes("geolocation", "location", "isp", "asn", "ip"),
    getFaqs: () => [
      {
        question: `What geolocation information is available?`,
        answer: `Country, region, city, latitude/longitude coordinates, ISP name, and ASN for any IP address.`,
      },
      {
        question: `How accurate is IP geolocation?`,
        answer: `Accuracy varies. Country-level is highly reliable. City-level accuracy depends on the IP allocation data and may not be precise for all addresses.`,
      },
      {
        question: `Is geolocation data stored?`,
        answer: `No. IP addresses and lookup results are processed in real time and not retained.`,
      },
    ],
  },
  {
    slug: "password",
    name: "Password",
    getDescription: () =>
      `Free password generation and security tools on ${SITE_NAME}. Generate strong random passwords, check password strength, and create secure credentials for your online accounts.`,
    matchTool: nameOrDescIncludes("password"),
    getFaqs: () => [
      { question: `What password tools does ${SITE_NAME} offer?`, answer: `${SITE_NAME} provides a Password Generator that creates cryptographically strong random passwords with customizable length and character types.` },
      { question: `Are generated passwords stored on your servers?`, answer: `No. Password generation happens entirely in your browser using the Web Crypto API. Generated passwords exist only in memory on your device and are never transmitted.` },
      { question: `What makes a password strong?`, answer: `A strong password has at least 12 characters (16+ recommended), includes uppercase, lowercase, numbers, and symbols, and is randomly generated rather than based on dictionary words or personal information.` },
    ],
  },
  {
    slug: "text",
    name: "Text Processing",
    getDescription: () =>
      `Free text processing tools on ${SITE_NAME}. Count words and characters, generate lorem ipsum, compare text differences, randomize lists, convert case, and encode/decode text.`,
    matchTool: nameOrDescIncludes("lorem ipsum", "word count", "text diff", "randomiz", "case convert", "text"),
    getFaqs: () => [
      { question: `What text processing tools does ${SITE_NAME} offer?`, answer: `Lorem Ipsum Generator, Word Counter, Text Diff Checker, List Randomizer, Case Converter, URL Encoder, and HTML Entity Encoder.` },
      { question: `Is my text data stored or sent to a server?`, answer: `No. All text processing is done client-side in your browser. Your data never leaves your device.` },
      { question: `What is lorem ipsum used for?`, answer: `Lorem ipsum is placeholder text used in design mockups, typesetting, and publishing to demonstrate visual form without meaningful content distracting from the layout.` },
    ],
  },
  {
    slug: "converter",
    name: "Converters",
    getDescription: () =>
      `Free online converter tools on ${SITE_NAME}. Convert between JSON, CSV, YAML, XML, colors, number bases, timestamps, and more. Format transformations for developers and data analysts.`,
    matchTool: nameOrDescIncludes("convert", "json to csv", "yaml", "xml", "timestamp", "number base", "color convert"),
    getFaqs: () => [
      { question: `What converter tools does ${SITE_NAME} offer?`, answer: `JSON to CSV, YAML to JSON, XML to JSON, Color Converter, Number Base Converter, Timestamp Converter, and URL Encoder.` },
      { question: `Are uploaded files stored during conversion?`, answer: `No. All conversions happen entirely in your browser. Your data is never uploaded, stored, or logged.` },
      { question: `What is the difference between JSON and YAML?`, answer: `JSON uses a strict syntax with brackets, quotes, and commas, making it ideal for API data. YAML uses indentation-based structure with minimal punctuation, making it more human-readable for configuration files. Both represent the same data types.` },
    ],
  },
];

export function getTag(slug: string): TagConfig | undefined {
  return TAGS.find((t) => t.slug === slug);
}

export function getAllTagSlugs(): string[] {
  return TAGS.map((t) => t.slug);
}

export function getToolsForTag(tag: TagConfig): Tool[] {
  return getInternalTools().filter(tag.matchTool);
}

export function getAllTagsWithCount(): { slug: string; name: string; count: number }[] {
  return TAGS.map((t) => ({
    slug: t.slug,
    name: t.name,
    count: getInternalTools().filter(t.matchTool).length,
  }));
}
