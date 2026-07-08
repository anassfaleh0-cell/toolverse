import { SITE_NAME } from "@/lib/constants";
import { getInternalTools, type Tool } from "@/lib/registry";
import type { FaqItem } from "@/lib/seo";

export interface LandingPageConfig {
  slug: string;
  category: string;
  getTitle: () => string;
  getDescription: () => string;
  getH1: () => string;
  getIntro: () => string;
  getTools: () => Tool[];
  getFaqs: () => FaqItem[];
  getSubtitle: () => string;
  getRelatedSlugs: () => string[];
}

function byCategory(...cats: string[]) {
  return () => getInternalTools().filter((t) => cats.includes(t.category));
}

function byIds(...ids: string[]) {
  return () => getInternalTools().filter((t) => ids.includes(t.id));
}

interface LandingPageData {
  slug: string;
  h1: string;
  subtitle: string;
  description: string;
  intro: string;
  category: string;
  relatedSlugs: string[];
  tools: () => Tool[];
  faqs: FaqItem[];
}

function createPage(data: LandingPageData): LandingPageConfig {
  return {
    slug: data.slug,
    category: data.category,
    getTitle: () => `${data.h1} - ${SITE_NAME}`,
    getDescription: () => data.description,
    getH1: () => data.h1,
    getSubtitle: () => data.subtitle,
    getIntro: () => data.intro,
    getTools: data.tools,
    getFaqs: () => data.faqs,
    getRelatedSlugs: () => data.relatedSlugs,
  };
}

export const LANDING_PAGES: LandingPageConfig[] = [
  createPage({
    slug: "tools-for-developers",
    h1: "Developer Tools",
    subtitle: "Essential utilities for web developers and engineers",
    category: "code-dev",
    relatedSlugs: ["developer-utilities", "api-development-tools", "encoding-hashing-tools", "seo-tools"],
    description: `Essential online tools for developers: DNS lookup, SSL checker, HTTP headers inspector, WHOIS, ping test, and more. Free developer utilities for web professionals on ${SITE_NAME}.`,
    intro: `Whether you are debugging DNS issues, inspecting SSL certificates, or checking HTTP response headers, ${SITE_NAME} provides a comprehensive suite of free developer tools. Every tool is designed to give you accurate results instantly, right in your browser.`,
    tools: byIds("dns-lookup", "reverse-dns-lookup", "dns-propagation-checker", "ssl-certificate-checker", "http-headers-checker", "website-status-checker", "whois-lookup", "user-agent-parser", "ping-test", "port-checker", "ip-lookup", "what-is-my-ip", "json-formatter", "regex-tester", "jwt-decoder", "markdown-preview", "sql-formatter", "html-preview", "text-to-slug", "url-parser", "json-path-search"),
    faqs: [
      { question: `What developer tools does ${SITE_NAME} offer?`, answer: `${SITE_NAME} offers DNS lookup, reverse DNS, SSL certificate checking, HTTP headers inspection, WHOIS lookup, ping testing, port scanning, IP geolocation, user agent parsing, JSON formatting, regex testing, JWT decoding, Markdown preview, SQL formatting, HTML preview, URL parsing, JSON path search, and more. All tools are free and browser-based.` },
      { question: `Are these developer tools free to use?`, answer: `Yes, every tool on ${SITE_NAME} is completely free. No registration, no API keys, and no usage limits.` },
      { question: `How accurate are the DNS and network tools?`, answer: `Our tools query authoritative sources directly — DNS records from live name servers, SSL certificates from the actual server handshake, and WHOIS data from registry databases. Results are as accurate as the source data.` },
    ],
  }),
  createPage({
    slug: "tools-for-designers",
    h1: "Design Tools",
    subtitle: "Creative utilities for designers and artists",
    category: "image-design",
    relatedSlugs: ["text-tools", "developer-utilities"],
    description: `Online tools for designers: color palette generator, CSS gradient tools, image optimizer, and more. Free design utilities for creative professionals on ${SITE_NAME}.`,
    intro: `${SITE_NAME} helps designers with color palette generation, CSS gradients, image optimization, and more. Our tools are fast, intuitive, and designed to integrate seamlessly into your creative workflow.`,
    tools: byIds("color-converter", "css-gradient-generator", "qr-code-generator", "image-resizer", "barcode-generator", "case-converter", "json-formatter", "base64-encoder", "url-encoder", "regex-tester"),
    faqs: [
      { question: `What design tools does ${SITE_NAME} offer?`, answer: `${SITE_NAME} provides tools for color palette generation, CSS gradient creation, QR code generation, image resizing, barcode generation, and text formatting.` },
      { question: `Are the design tools free to use?`, answer: `Yes, all design tools on ${SITE_NAME} are completely free with no hidden charges or watermarks.` },
      { question: `Can I use the generated colors and gradients commercially?`, answer: `Yes, all content generated using ${SITE_NAME} tools can be used in commercial projects without attribution.` },
    ],
  }),
  createPage({
    slug: "tools-for-marketers",
    h1: "Marketing Tools",
    subtitle: "Smart utilities for digital marketers",
    category: "productivity",
    relatedSlugs: ["seo-tools", "website-performance-tools", "website-troubleshooting-toolkit"],
    description: `Online tools for digital marketers: website status checker, HTTP headers inspector, SSL checker, DNS lookup, and more. Free marketing utilities on ${SITE_NAME}.`,
    intro: `Monitor your website's availability, inspect HTTP headers for SEO issues, verify SSL certificates, and check DNS propagation — all the tools you need to ensure your digital campaigns run smoothly.`,
    tools: byIds("website-status-checker", "http-headers-checker", "ssl-certificate-checker", "dns-propagation-checker", "dns-lookup", "reverse-dns-lookup", "whois-lookup", "password-generator", "qr-code-generator", "text-to-slug"),
    faqs: [
      { question: `How can marketers use ${SITE_NAME} tools?`, answer: `Marketers can monitor website uptime, check SSL certificate validity for campaign landing pages, inspect HTTP headers for redirect chains, generate QR codes for print materials, create SEO-friendly URL slugs, and verify DNS propagation after domain changes.` },
      { question: `Are these tools useful for SEO?`, answer: `Yes. HTTP headers inspection reveals redirect chains and caching policies. SSL checker ensures secure connections. Website status monitoring tracks uptime — all critical for SEO performance.` },
      { question: `Can I check competitor websites?`, answer: `Yes, our tools work on any publicly accessible domain. You can inspect HTTP headers, SSL certificates, and DNS records for any website.` },
    ],
  }),
  createPage({
    slug: "network-tools",
    h1: "Network Tools",
    subtitle: "Professional network diagnostic utilities",
    category: "network-internet",
    relatedSlugs: ["network-diagnostics-tools", "dns-troubleshooting-tools", "website-troubleshooting-toolkit"],
    description: `Complete collection of free network tools. DNS lookup, ping test, port checker, WHOIS lookup, reverse DNS, IP geolocation, and network diagnostics on ${SITE_NAME}.`,
    intro: `${SITE_NAME} offers a full suite of network diagnostic tools used by system administrators, network engineers, and IT professionals worldwide. From DNS resolution to port scanning, every tool delivers accurate results in real time.`,
    tools: byCategory("network-internet"),
    faqs: [
      { question: `What network tools does ${SITE_NAME} offer?`, answer: `DNS lookup, reverse DNS lookup, DNS propagation checker, ping test, port checker, subnet calculator, WHOIS lookup, IP geolocation, and more.` },
      { question: `Are the network tools free?`, answer: `Yes, all network tools are free with no usage limits.` },
      { question: `Do you store network queries?`, answer: `No. DNS lookups, pings, port scans, and other network queries are processed in real time and not stored. Your privacy is protected.` },
    ],
  }),
  createPage({
    slug: "developer-utilities",
    h1: "Developer Utilities",
    subtitle: "Everyday tools for software engineers",
    category: "code-dev",
    relatedSlugs: ["tools-for-developers", "api-development-tools", "encoding-hashing-tools"],
    description: `Developer utilities including DNS tools, SSL certificate checker, HTTP headers inspector, JSON formatter, regex builder, and API tester. Free online dev tools on ${SITE_NAME}.`,
    intro: `From formatting JSON to building regular expressions, from debugging API responses to inspecting SSL certificates, ${SITE_NAME} provides the utilities that make your development workflow faster and more efficient.`,
    tools: byIds("dns-lookup", "reverse-dns-lookup", "ssl-certificate-checker", "http-headers-checker", "website-status-checker", "user-agent-parser", "ip-lookup", "json-formatter", "regex-tester", "jwt-decoder", "markdown-preview", "sql-formatter", "html-preview", "text-to-slug", "url-parser", "json-path-search"),
    faqs: [
      { question: `What developer utilities does ${SITE_NAME} provide?`, answer: `DNS tools, SSL checking, HTTP debugging, JSON formatting, regex building, API testing, user agent parsing, Markdown preview, SQL formatting, HTML preview, URL parsing, JSON path search, and IP geolocation — all in one place.` },
      { question: `Can I use these tools in CI/CD pipelines?`, answer: `Our tools are designed for interactive use in the browser. For automated pipeline integration, consider our API endpoints.` },
    ],
  }),
  createPage({
    slug: "seo-tools",
    h1: "SEO Tools",
    subtitle: "Optimize your website for search engines",
    category: "network-internet",
    relatedSlugs: ["website-performance-tools", "tools-for-marketers", "website-troubleshooting-toolkit", "security-testing-toolkit"],
    description: `SEO tools for website optimization: SSL certificate checker, HTTP headers inspector, DNS lookup, website status monitor, and WHOIS lookup. Improve your search rankings with ${SITE_NAME}.`,
    intro: `Technical SEO requires the right tools. ${SITE_NAME} helps you audit SSL certificates, inspect HTTP headers for redirect issues, monitor website uptime, and verify DNS configuration — all critical factors that influence search engine rankings.`,
    tools: byIds("ssl-certificate-checker", "http-headers-checker", "website-status-checker", "dns-lookup", "dns-propagation-checker", "whois-lookup", "reverse-dns-lookup"),
    faqs: [
      { question: `How do these tools help with SEO?`, answer: `SSL certificates impact rankings. HTTP headers reveal redirect chains and canonical issues. Website uptime affects crawl budget. DNS configuration determines site accessibility.` },
      { question: `Can I check my competitor's SSL certificate?`, answer: `Yes. Enter any domain to inspect its SSL certificate details, including issuer, validity period, and supported protocols.` },
      { question: `How often should I check my website's SEO health?`, answer: `We recommend monitoring SSL certificate expiration weekly, checking HTTP headers after any site changes, and verifying DNS propagation immediately after domain configuration updates.` },
    ],
  }),
  createPage({
    slug: "security-tools",
    h1: "Security Tools",
    subtitle: "Audit and monitor your web security",
    category: "network-internet",
    relatedSlugs: ["security-testing-toolkit", "ssl-tls-tools", "website-performance-tools", "tools-for-developers"],
    description: `Security tools for web professionals: SSL certificate checker, port scanner, WHOIS lookup, DNS lookup, and HTTP security headers inspector. Free online security utilities on ${SITE_NAME}.`,
    intro: `Stay on top of your website security with ${SITE_NAME}'s security audit tools. Check SSL/TLS certificate validity, scan for open ports, inspect HTTP security headers, and verify domain ownership details through WHOIS.`,
    tools: byIds("ssl-certificate-checker", "port-checker", "subnet-calculator", "whois-lookup", "http-headers-checker", "dns-lookup", "reverse-dns-lookup", "website-status-checker", "password-generator"),
    faqs: [
      { question: `What security tools does ${SITE_NAME} offer?`, answer: `SSL certificate checking, port scanning, subnet calculator, WHOIS lookup, HTTP security headers inspection, DNS analysis, password generation, and website status monitoring.` },
      { question: `Can I scan my network for open ports?`, answer: `Yes. Use our Port Checker to test specific ports on any host. We support common ports as well as custom port scanning.` },
      { question: `Is SSL certificate checking secure?`, answer: `Yes. We perform standard TLS handshakes to retrieve certificate details. No sensitive data is transmitted or stored.` },
    ],
  }),
  createPage({
    slug: "text-tools",
    h1: "Text Tools",
    subtitle: "Writing and text processing utilities",
    category: "text-writing",
    relatedSlugs: ["tools-for-designers", "developer-utilities"],
    description: `Text tools for writers and editors: case converter, URL encoder, HTML entity encoder, and formatting utilities. Free online text processing tools on ${SITE_NAME}.`,
    intro: `${SITE_NAME} provides a curated selection of text processing tools for writers, editors, and content creators. Convert text case, encode URLs, escape HTML entities, and format content with our free online utilities.`,
    tools: byIds("case-converter", "url-encoder", "html-entity-encoder", "base64-encoder", "json-formatter", "regex-tester", "lorem-ipsum-generator", "word-counter", "text-diff-checker", "list-randomizer"),
    faqs: [
      { question: `What text tools are available?`, answer: `Case conversion, URL encoding, HTML entity encoding, Base64 encoding, JSON formatting, regex testing, lorem ipsum generation, word counting, text diff checking, and list randomization.` },
      { question: `Can I use these tools offline?`, answer: `Our text tools run in your browser after initial page load. Most functionality works without server interaction.` },
    ],
  }),
  createPage({
    slug: "image-tools",
    h1: "Image & Color Tools",
    subtitle: "Design and color utilities",
    category: "image-design",
    relatedSlugs: ["tools-for-designers", "text-tools"],
    description: `Image and color tools for designers and creators: color converter, QR code generator, image resizer, CSS gradient generator, barcode generator, and formatting utilities. Free online design tools on ${SITE_NAME}.`,
    intro: `${SITE_NAME} helps designers and content creators with color conversion between HEX, RGB, and HSL formats, QR code and barcode generation, image resizing, CSS gradient creation, Base64 encoding for assets, and text formatting utilities. All tools run directly in your browser.`,
    tools: byIds("color-converter", "qr-code-generator", "image-resizer", "css-gradient-generator", "barcode-generator", "base64-encoder", "case-converter", "json-formatter"),
    faqs: [
      { question: `What image tools does ${SITE_NAME} offer?`, answer: `Color conversion between HEX, RGB, and HSL.` },
      { question: `Are uploaded images stored?`, answer: `No. All processing happens locally in your browser.` },
    ],
  }),
  createPage({
    slug: "website-troubleshooting-toolkit",
    h1: "Website Troubleshooting Toolkit",
    subtitle: "Diagnose and fix website issues step by step",
    category: "network-internet",
    relatedSlugs: ["dns-troubleshooting-tools", "network-diagnostics-tools", "website-performance-tools", "seo-tools"],
    description: `Complete website troubleshooting toolkit. Diagnose DNS issues, check SSL certificates, inspect HTTP headers, test ping and ports. Free website diagnostic tools on ${SITE_NAME}.`,
    intro: `When your website is down or slow, you need the right diagnostic tools to find the root cause fast. ${SITE_NAME}'s Website Troubleshooting Toolkit walks you through each layer of the stack — DNS resolution, SSL/TLS handshake, HTTP response headers, server connectivity, and network latency. Start with a DNS lookup to verify resolution, check the SSL certificate for expiry or misconfiguration, inspect HTTP headers for redirect issues, and finish with a ping test and port scan to confirm network reachability.`,
    tools: byIds("dns-lookup", "ssl-certificate-checker", "http-headers-checker", "website-status-checker", "ping-test", "port-checker"),
    faqs: [
      { question: `What is the first step when a website is down?`, answer: `Start with a DNS Lookup to verify the domain resolves correctly, then check the Website Status to confirm the server is responding. If DNS fails, use DNS Propagation Checker. If the server responds with errors, inspect HTTP Headers.` },
      { question: `How do I check if an SSL certificate is causing issues?`, answer: `Use the SSL Certificate Checker to verify the certificate is valid, not expired, and covers the correct domain name. Check the days remaining and subject alternative names.` },
      { question: `What tools help diagnose slow website performance?`, answer: `Use Ping Test to measure network latency, HTTP Headers Checker to review caching headers and response time, and Website Status Checker to confirm uptime.` },
      { question: `Can I check if a firewall is blocking traffic?`, answer: `Yes. Use the Port Checker to test whether specific ports (80, 443, 22) are open and reachable from our servers. Closed ports may indicate firewall rules blocking traffic.` },
    ],
  }),
  createPage({
    slug: "dns-troubleshooting-tools",
    h1: "DNS Troubleshooting Tools",
    subtitle: "Diagnose and resolve DNS issues quickly",
    category: "network-internet",
    relatedSlugs: ["network-diagnostics-tools", "website-troubleshooting-toolkit", "domain-management-tools", "email-troubleshooting-tools"],
    description: `DNS troubleshooting tools for system administrators. DNS lookup, reverse DNS, propagation checker, and WHOIS. Diagnose resolution failures and verify DNS configuration with ${SITE_NAME}.`,
    intro: `DNS issues are among the most common — and most frustrating — problems in web operations. A domain that doesn't resolve can take down websites, email, and APIs. ${SITE_NAME}'s DNS troubleshooting toolkit gives you everything you need: DNS Lookup to verify A, AAAA, MX, and TXT records; Reverse DNS to confirm PTR records match; DNS Propagation Checker to see if recent changes have reached global resolvers; and WHOIS Lookup to verify domain registration and expiry.`,
    tools: byIds("dns-lookup", "reverse-dns-lookup", "dns-propagation-checker", "whois-lookup"),
    faqs: [
      { question: `Why is my domain not resolving?`, answer: `Check DNS Lookup to see if the domain has A or AAAA records. If records exist but you still can't reach it, the issue may be propagation delay or a local DNS cache problem. Use DNS Propagation Checker to verify global resolution.` },
      { question: `How do I check if my DNS changes have propagated?`, answer: `Use the DNS Propagation Checker to query multiple global resolvers (Google, Cloudflare, Quad9, OpenDNS). If some show the old records and others show the new ones, propagation is still in progress.` },
      { question: `What is the difference between forward and reverse DNS?`, answer: `Forward DNS maps a domain name to an IP address (A or AAAA record). Reverse DNS maps an IP address back to a hostname (PTR record). Both must match for email servers to trust your outbound mail.` },
      { question: `How often should I check my DNS configuration?`, answer: `After any DNS change, verify all record types. Monitor MX records before switching email providers. Check TXT/SPF records monthly for email authentication.` },
    ],
  }),
  createPage({
    slug: "network-diagnostics-tools",
    h1: "Network Diagnostics Tools",
    subtitle: "Professional network analysis and troubleshooting",
    category: "network-internet",
    relatedSlugs: ["dns-troubleshooting-tools", "website-troubleshooting-toolkit", "website-performance-tools"],
    description: `Comprehensive network diagnostics tools. Ping test, traceroute, port checker, DNS lookup, and IP geolocation. Free network analysis tools for IT professionals on ${SITE_NAME}.`,
    intro: `Network problems can be elusive — intermittent packet loss, high latency on specific routes, or firewalls silently dropping connections. ${SITE_NAME}'s Network Diagnostics Tools give you visibility into each layer: Ping Test measures real-time latency and packet loss; Port Checker verifies service availability; DNS Lookup confirms name resolution; and IP Lookup provides geolocation and ISP data. Use these tools together to isolate whether the problem is in your local network, your ISP, or the remote server.`,
    tools: byIds("ping-test", "port-checker", "dns-lookup", "reverse-dns-lookup", "ip-lookup", "what-is-my-ip", "website-status-checker", "subnet-calculator"),
    faqs: [
      { question: `What is the difference between ping and port check?`, answer: `Ping Test measures round-trip latency to a host (network layer). Port Checker tests whether a specific service is listening (application layer). A host may respond to ping but have the web server port closed.` },
      { question: `How do I diagnose packet loss?`, answer: `Run the Ping Test and check the packet loss percentage. Zero percent loss means all probes reached the target. Loss above 5\% indicates network congestion or a faulty link. Use multiple tests at different times to confirm.` },
      { question: `Can I find the location of an IP address?`, answer: `Yes. Use IP Lookup to get geolocation data including country, city, ISP, and ASN for any IPv4 or IPv6 address.` },
      { question: `What does a closed port mean?`, answer: `A closed port means the host responded but no service is listening on that port. A filtered port means the request timed out — likely a firewall dropped the packet.` },
      { question: `How do I calculate subnets from an IP address?`, answer: `Use the Subnet Calculator to enter an IP address and CIDR prefix length. The tool calculates network address, broadcast address, usable host range, subnet mask, and total hosts — essential for network planning and firewall rules.` },
    ],
  }),
  createPage({
    slug: "security-testing-toolkit",
    h1: "Security Testing Toolkit",
    subtitle: "Audit your website security posture",
    category: "network-internet",
    relatedSlugs: ["security-tools", "ssl-tls-tools", "website-troubleshooting-toolkit", "website-performance-tools"],
    description: `Website security testing toolkit. SSL certificate checker, port scanner, HTTP security headers audit, DNS analysis, and WHOIS lookup. Free security audit tools on ${SITE_NAME}.`,
    intro: `A comprehensive security audit covers multiple layers: the SSL/TLS certificate must be valid and properly configured; HTTP security headers must protect against common attacks; open ports must be minimized; and DNS records must not leak information. ${SITE_NAME}'s Security Testing Toolkit includes an SSL Certificate Checker (validity, issuer, SANs), HTTP Headers Checker (HSTS, CSP, XFO audit), Port Checker (open port discovery), DNS Lookup (record verification), and WHOIS Lookup (domain ownership verification).`,
    tools: byIds("ssl-certificate-checker", "http-headers-checker", "port-checker", "dns-lookup", "whois-lookup", "website-status-checker"),
    faqs: [
      { question: `What security headers should every website have?`, answer: `At minimum: Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, and Content-Security-Policy. Use HTTP Headers Checker to audit your current configuration.` },
      { question: `How do I check if my SSL certificate is properly configured?`, answer: `Use SSL Certificate Checker to verify the certificate is not expired, matches the domain name, has a trusted issuer, and includes all required subject alternative names.` },
      { question: `Why should I scan for open ports?`, answer: `Every open port is a potential attack surface. Use Port Checker to verify only the necessary ports (80, 443) are open. Close unused ports to reduce your vulnerability footprint.` },
      { question: `How does WHOIS data relate to security?`, answer: `WHOIS data reveals domain ownership, registration dates, and expiry status. Expired domains can be hijacked. Verify your domain registration is current and contact information is accurate.` },
    ],
  }),
  createPage({
    slug: "website-performance-tools",
    h1: "Website Performance Tools",
    subtitle: "Measure and optimize your website speed",
    category: "network-internet",
    relatedSlugs: ["seo-tools", "website-troubleshooting-toolkit", "network-diagnostics-tools", "security-testing-toolkit"],
    description: `Website performance measurement tools. Check response time, HTTP headers, SSL handshake speed, DNS resolution time, and network latency. Free performance tools on ${SITE_NAME}.`,
    intro: `Website performance directly impacts user experience, conversion rates, and SEO rankings. ${SITE_NAME}'s performance toolkit helps you measure every component of page load time: DNS resolution latency (DNS Lookup), SSL/TLS handshake speed (SSL Certificate Checker), HTTP response time and caching headers (HTTP Headers Checker), server response time (Website Status Checker), and network round-trip latency (Ping Test).`,
    tools: byIds("http-headers-checker", "website-status-checker", "ssl-certificate-checker", "dns-lookup", "ping-test", "dns-propagation-checker"),
    faqs: [
      { question: `What is a good HTTP response time?`, answer: `Under 200ms is excellent, 200-500ms is good, 500ms-1s needs improvement, above 1s is poor. Use HTTP Headers Checker to measure your server's response time.` },
      { question: `How does DNS affect website performance?`, answer: `DNS resolution typically takes 20-120ms. Slow DNS adds to every page load. Use DNS Lookup to measure resolution time and ensure you're using fast DNS providers.` },
      { question: `Does SSL/TLS add latency?`, answer: `Yes, the TLS handshake adds one round trip (TLS 1.3) or two (TLS 1.2). This typically adds 50-200ms. Use SSL Certificate Checker to verify TLS 1.3 support.` },
      { question: `How do caching headers impact performance?`, answer: `Proper Cache-Control and Expires headers let browsers cache resources locally, reducing repeat load times from seconds to milliseconds. HTTP Headers Checker reveals your current caching policy.` },
    ],
  }),
  createPage({
    slug: "ssl-tls-tools",
    h1: "SSL/TLS Tools",
    subtitle: "Manage and audit SSL/TLS certificates",
    category: "network-internet",
    relatedSlugs: ["security-testing-toolkit", "security-tools", "website-performance-tools", "website-troubleshooting-toolkit"],
    description: `SSL/TLS certificate management tools. Check certificate details, verify expiration dates, inspect certificate chains, and audit TLS versions. Free SSL tools on ${SITE_NAME}.`,
    intro: `SSL/TLS certificates are the foundation of web security. ${SITE_NAME}'s SSL/TLS tools help you verify certificate validity, inspect certificate chains, check for upcoming expirations, and audit TLS protocol versions. An expired or misconfigured certificate causes browser security warnings that erode user trust and hurt SEO rankings.`,
    tools: byIds("ssl-certificate-checker", "http-headers-checker", "website-status-checker", "dns-lookup"),
    faqs: [
      { question: `How do I check when my SSL certificate expires?`, answer: `Use SSL Certificate Checker and enter your domain. The report shows days remaining until expiration, the exact valid-to date, and a security grade.` },
      { question: `What is a certificate chain?`, answer: `A certificate chain links your server's certificate through intermediate certificates to a trusted root CA. SSL Certificate Checker displays the full chain: Root CA → Intermediate → Your Certificate.` },
      { question: `Why is TLS 1.3 better than TLS 1.2?`, answer: `TLS 1.3 reduces the handshake from two round trips to one, improving connection setup time by 30-50\%. It also removes insecure cipher suites. Check your TLS version support with SSL Certificate Checker.` },
      { question: `What are Subject Alternative Names (SANs)?`, answer: `SANs list all domains and subdomains a certificate covers. A single certificate can secure multiple domains. SSL Certificate Checker shows all SANs — verify all your domains are included.` },
    ],
  }),
  createPage({
    slug: "email-troubleshooting-tools",
    h1: "Email Troubleshooting Tools",
    subtitle: "Diagnose email delivery and configuration issues",
    category: "network-internet",
    relatedSlugs: ["dns-troubleshooting-tools", "domain-management-tools", "security-testing-toolkit"],
    description: `Email troubleshooting tools for IT administrators. Check MX records, verify SPF/DKIM/DMARC, test reverse DNS, and validate email server configuration. Free email diagnostic tools on ${SITE_NAME}.`,
    intro: `Email delivery problems are notoriously hard to debug — bounced messages, spam folder placement, and silent failures each have different root causes. ${SITE_NAME}'s Email Troubleshooting Tools help you verify every DNS layer that affects email: MX records (mail server routing), TXT/SPF records (sender authorization), DKIM selectors (message signing), DMARC policies (delivery instructions), and PTR records (reverse DNS matching for receiving server validation).`,
    tools: byIds("dns-lookup", "reverse-dns-lookup", "whois-lookup"),
    faqs: [
      { question: `Why are my emails going to spam?`, answer: `The most common cause is missing or misconfigured SPF, DKIM, or DMARC DNS records. Use DNS Lookup to verify TXT records contain proper v=spf1, v=DKIM1, and v=DMARC1 policies.` },
      { question: `How do I check my MX records?`, answer: `Use DNS Lookup and filter by MX type. The results show mail server hostnames and priority values (lower numbers are preferred). Verify the hostnames resolve to A records.` },
      { question: `What is reverse DNS and why does it matter for email?`, answer: `Reverse DNS (PTR record) maps your mail server's IP back to its hostname. Receiving servers check this — if the PTR doesn't match the HELO hostname, email is more likely to be rejected or flagged. Use Reverse DNS Lookup to verify.` },
      { question: `How do DMARC records improve email security?`, answer: `DMARC tells receiving servers what to do when SPF or DKIM fails: none (monitor only), quarantine (spam folder), or reject (block). Use DNS Lookup to check _dmarc.yourdomain.com TXT records.` },
    ],
  }),
  createPage({
    slug: "domain-management-tools",
    h1: "Domain Management Tools",
    subtitle: "Manage and monitor your domain portfolio",
    category: "network-internet",
    relatedSlugs: ["dns-troubleshooting-tools", "email-troubleshooting-tools", "security-testing-toolkit"],
    description: `Domain management tools for website owners. WHOIS lookup, DNS lookup, reverse DNS, and DNS propagation checker. Monitor domain expiry, DNS changes, and registration details with ${SITE_NAME}.`,
    intro: `Managing a domain portfolio requires monitoring registration dates, DNS configuration, and propagation status. ${SITE_NAME}'s Domain Management Tools help you track domain expiry (WHOIS Lookup), verify DNS records after changes (DNS Lookup), confirm propagation to global resolvers (DNS Propagation Checker), and validate reverse DNS for email servers (Reverse DNS Lookup).`,
    tools: byIds("whois-lookup", "dns-lookup", "dns-propagation-checker", "reverse-dns-lookup"),
    faqs: [
      { question: `How do I check when my domain expires?`, answer: `Use WHOIS Lookup and find the expiration_date field. We recommend renewing at least 30 days before expiry to avoid any service disruption.` },
      { question: `How long does DNS propagation take?`, answer: `Most DNS changes propagate within 24 hours, but many resolvers update within 5-30 minutes for records with short TTLs. Use DNS Propagation Checker to monitor real-time progress.` },
      { question: `What happens if my domain expires?`, answer: `During the grace period (typically 30 days), you can renew at the standard price. After that, the domain enters redemption status (higher cost to recover). Once released, anyone can register it.` },
      { question: `How do I transfer my domain to another registrar?`, answer: `First, unlock the domain at your current registrar and obtain an authorization code. Use DNS Lookup to verify the domain is active. Use WHOIS Lookup to confirm contact email is accessible for the transfer confirmation.` },
    ],
  }),
  createPage({
    slug: "api-development-tools",
    h1: "API Development Tools",
    subtitle: "Build, test, and debug APIs efficiently",
    category: "code-dev",
    relatedSlugs: ["tools-for-developers", "developer-utilities", "encoding-hashing-tools"],
    description: `API development and debugging tools. JWT decoder, JSON formatter, HTTP headers checker, DNS lookup, and SSL certificate checker. Free API tools for developers on ${SITE_NAME}.`,
    intro: `API development involves multiple layers — authentication tokens, request/response formatting, DNS resolution, and secure connections. ${SITE_NAME}'s API Development Tools help decode JWT tokens for authentication debugging, format JSON responses for readability, inspect HTTP headers for API responses, verify DNS resolution for API endpoints, and check SSL certificates for secure API connections.`,
    tools: byIds("jwt-decoder", "json-formatter", "http-headers-checker", "dns-lookup", "ssl-certificate-checker", "base64-encoder", "url-encoder"),
    faqs: [
      { question: `Can I decode JWT tokens without sending them to a server?`, answer: `Yes. Our JWT Decoder runs entirely in your browser using the Web Crypto API. Your token data never leaves your device — no server-side decoding or logging.` },
      { question: `How do I inspect API response headers?`, answer: `Enter your API endpoint URL in the HTTP Headers Checker. The tool shows all response headers including content-type, caching policies, rate-limit headers, and CORS settings.` },
      { question: `Is the JSON formatter safe for sensitive data?`, answer: `Yes. All JSON formatting happens client-side in your browser. No data is transmitted to any server.` },
    ],
  }),
  createPage({
    slug: "encoding-hashing-tools",
    h1: "Encoding & Hashing Tools",
    subtitle: "Encode, hash, and transform data",
    category: "code-dev",
    relatedSlugs: ["api-development-tools", "developer-utilities", "tools-for-developers", "text-tools"],
    description: `Encoding and hashing tools for developers. Base64 encoder/decoder, URL encoder, HTML entity encoder, MD5 hash, SHA hash, and UUID generator. Free data transformation tools on ${SITE_NAME}.`,
    intro: `Data encoding, hashing, and transformation are everyday tasks for developers. ${SITE_NAME}'s Encoding & Hashing Tools cover the most common operations: Base64 encoding for binary-to-text conversion, URL encoding for query string preparation, HTML entity encoding for safe rendering, MD5 and SHA hashing for integrity verification, and UUID generation for unique identifiers. All operations run in your browser using native Web Crypto APIs — no server involvement.`,
    tools: byIds("base64-encoder", "url-encoder", "html-entity-encoder", "md5-hash-generator", "sha-hash-generator", "uuid-generator", "password-generator"),
    faqs: [
      { question: `What is the difference between MD5 and SHA-256?`, answer: `MD5 produces a 128-bit hash (32 characters), while SHA-256 produces a 256-bit hash (64 characters). SHA-256 is cryptographically stronger and recommended for security-sensitive applications. MD5 is suitable for non-security checksums like file integrity verification.` },
      { question: `When should I use Base64 encoding?`, answer: `Base64 encodes binary data into ASCII text, making it safe for JSON, XML, URLs, and email. Common uses include embedding images in HTML/CSS, storing binary data in databases, and encoding authentication tokens.` },
      { question: `Can I generate multiple UUIDs at once?`, answer: `Yes. Our UUID Generator supports bulk generation — specify the count and get RFC 4122 v4 UUIDs instantly. All generation uses the browser's Crypto API.` },
    ],
  }),
  createPage({
    slug: "data-transformation-tools",
    h1: "Data Transformation Tools",
    subtitle: "Convert and transform data between formats",
    category: "data-analytics",
    relatedSlugs: ["developer-utilities", "api-development-tools", "encoding-hashing-tools", "tools-for-developers"],
    description: `Convert data between JSON, CSV, YAML, and XML formats. Transform timestamps and more. Free online data conversion tools on ${SITE_NAME}.`,
    intro: `Working with data means juggling multiple formats — JSON from APIs, CSV for spreadsheets, YAML for configuration files, and XML for legacy systems. ${SITE_NAME}'s Data Transformation Tools let you convert between these formats instantly, right in your browser. No uploads, no servers, no data leaving your machine. Also includes a timestamp converter for Unix epoch and human-readable date transformations.`,
    tools: byIds("json-to-csv", "yaml-to-json", "xml-to-json", "timestamp-converter"),
    faqs: [
      { question: `What data format conversions are available?`, answer: `JSON to CSV, JSON to YAML, YAML to JSON, XML to JSON, and JSON to XML. All conversions happen client-side with no data uploaded to servers.` },
      { question: `How do I convert a JSON array to a CSV spreadsheet?`, answer: `Use the JSON to CSV Converter. Paste your JSON array of objects, click convert, and download the resulting CSV. Nested objects are flattened with dot-notation keys.` },
      { question: `Can I convert YAML configuration files to JSON?`, answer: `Yes. Paste your YAML content into the YAML to JSON Converter. The tool parses YAML with support for anchors, aliases, and complex nested structures.` },
      { question: `What timestamp formats are supported?`, answer: `The Timestamp Converter supports Unix timestamps in seconds or milliseconds and converts to ISO 8601, UTC, and local time formats. It also converts dates in reverse — from any date format to a Unix timestamp.` },
    ],
  }),
];

export function getLandingPage(slug: string): LandingPageConfig | undefined {
  return LANDING_PAGES.find((lp) => lp.slug === slug);
}

export function getAllLandingSlugs(): string[] {
  return LANDING_PAGES.map((lp) => lp.slug);
}

export function getRelatedLandingPages(slug: string): LandingPageConfig[] {
  const page = getLandingPage(slug);
  if (!page) return [];
  return page.getRelatedSlugs()
    .map((s) => getLandingPage(s))
    .filter((p): p is LandingPageConfig => p !== undefined);
}
