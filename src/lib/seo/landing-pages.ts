import { SITE_NAME } from "@/lib/constants";
import { getInternalTools, type Tool } from "@/lib/registry";
import type { FaqItem } from "@/lib/seo";

export interface LandingPageConfig {
  slug: string;
  getTitle: () => string;
  getDescription: () => string;
  getH1: () => string;
  getIntro: () => string;
  getTools: () => Tool[];
  getFaqs: () => FaqItem[];
  getSubtitle: () => string;
}

function byCategory(...cats: string[]) {
  return () => getInternalTools().filter((t) => cats.includes(t.category));
}

function byIds(...ids: string[]) {
  return () => getInternalTools().filter((t) => ids.includes(t.id));
}

export const LANDING_PAGES: LandingPageConfig[] = [
  {
    slug: "tools-for-developers",
    getTitle: () => `Free Developer Tools Online - ${SITE_NAME}`,
    getDescription: () =>
      `Essential online tools for developers: DNS lookup, SSL checker, HTTP headers inspector, WHOIS, ping test, and more. Free developer utilities for web professionals.`,
    getH1: () => "Developer Tools",
    getSubtitle: () => "Essential utilities for web developers and engineers",
    getIntro: () =>
      `Whether you are debugging DNS issues, inspecting SSL certificates, or checking HTTP response headers, ${SITE_NAME} provides a comprehensive suite of free developer tools. Every tool is designed to give you accurate results instantly, right in your browser.`,
    getTools: byIds(
      "dns-lookup",
      "reverse-dns-lookup",
      "dns-propagation-checker",
      "ssl-certificate-checker",
      "http-headers-checker",
      "website-status-checker",
      "whois-lookup",
      "user-agent-parser",
      "ping-test",
      "port-checker",
      "ip-lookup",
      "what-is-my-ip",
      "json-formatter",
      "regex-builder",
      "api-tester",
    ),
    getFaqs: () => [
      {
        question: `What developer tools does ${SITE_NAME} offer?`,
        answer: `${SITE_NAME} offers DNS lookup, reverse DNS, SSL certificate checking, HTTP headers inspection, WHOIS lookup, ping testing, port scanning, IP geolocation, user agent parsing, and more. All tools are free and browser-based.`,
      },
      {
        question: `Are these developer tools free to use?`,
        answer: `Yes, every tool on ${SITE_NAME} is completely free. No registration, no API keys, and no usage limits.`,
      },
      {
        question: `How accurate are the DNS and network tools?`,
        answer: `Our tools query authoritative sources directly — DNS records from live name servers, SSL certificates from the actual server handshake, and WHOIS data from registry databases. Results are as accurate as the source data.`,
      },
      {
        question: `Can I use these tools for production debugging?`,
        answer: `Absolutely. Developers use ${SITE_NAME} daily for production debugging, DNS troubleshooting, SSL certificate verification, and network diagnostics. The tools provide real-time, accurate data.`,
      },
    ],
  },
  {
    slug: "tools-for-designers",
    getTitle: () => `Free Design Tools Online - ${SITE_NAME}`,
    getDescription: () =>
      `Online tools for designers: color palette generator, CSS gradient tools, image optimizer, and more. Free design utilities for creative professionals.`,
    getH1: () => "Design Tools",
    getSubtitle: () => "Creative utilities for designers and artists",
    getIntro: () =>
      `${SITE_NAME} helps designers with color palette generation, CSS gradients, image optimization, and more. Our tools are fast, intuitive, and designed to integrate seamlessly into your creative workflow.`,
    getTools: byCategory("image-design", "text-writing"),
    getFaqs: () => [
      {
        question: `What design tools does ${SITE_NAME} offer?`,
        answer: `${SITE_NAME} provides tools for color palette generation, CSS gradient creation, image optimization, and text formatting.`,
      },
      {
        question: `Are the design tools free to use?`,
        answer: `Yes, all design tools on ${SITE_NAME} are completely free with no hidden charges or watermarks.`,
      },
      {
        question: `Can I use the generated colors and gradients commercially?`,
        answer: `Yes, all content generated using ${SITE_NAME} tools can be used in commercial projects without attribution.`,
      },
    ],
  },
  {
    slug: "tools-for-marketers",
    getTitle: () => `Free Marketing Tools Online - ${SITE_NAME}`,
    getDescription: () =>
      `Online tools for digital marketers: website status checker, HTTP headers inspector, SSL checker, DNS lookup, and more. Free marketing utilities.`,
    getH1: () => "Marketing Tools",
    getSubtitle: () => "Smart utilities for digital marketers",
    getIntro: () =>
      `Monitor your website's availability, inspect HTTP headers for SEO issues, verify SSL certificates, and check DNS propagation — all the tools you need to ensure your digital campaigns run smoothly.`,
    getTools: byIds(
      "website-status-checker",
      "http-headers-checker",
      "ssl-certificate-checker",
      "dns-propagation-checker",
      "dns-lookup",
      "reverse-dns-lookup",
      "whois-lookup",
    ),
    getFaqs: () => [
      {
        question: `How can marketers use ${SITE_NAME} tools?`,
        answer: `Marketers can monitor website uptime, check SSL certificate validity for campaign landing pages, inspect HTTP headers for redirect chains, and verify DNS propagation after domain changes.`,
      },
      {
        question: `Are these tools useful for SEO?`,
        answer: `Yes. HTTP headers inspection reveals redirect chains and caching policies. SSL checker ensures secure connections. Website status monitoring tracks uptime — all critical for SEO performance.`,
      },
      {
        question: `Can I check competitor websites?`,
        answer: `Yes, our tools work on any publicly accessible domain. You can inspect HTTP headers, SSL certificates, and DNS records for any website.`,
      },
    ],
  },
  {
    slug: "network-tools",
    getTitle: () => `Free Network Tools Online - ${SITE_NAME}`,
    getDescription: () =>
      `Complete collection of free network tools. DNS lookup, ping test, port checker, WHOIS lookup, reverse DNS, IP geolocation, and network diagnostics.`,
    getH1: () => "Network Tools",
    getSubtitle: () => "Professional network diagnostic utilities",
    getIntro: () =>
      `${SITE_NAME} offers a full suite of network diagnostic tools used by system administrators, network engineers, and IT professionals worldwide. From DNS resolution to port scanning, every tool delivers accurate results in real time.`,
    getTools: byCategory("network-internet"),
    getFaqs: () => [
      {
        question: `What network tools does ${SITE_NAME} offer?`,
        answer: `DNS lookup, reverse DNS lookup, DNS propagation checker, ping test, port checker, WHOIS lookup, IP geolocation, and more.`,
      },
      {
        question: `Are the network tools free?`,
        answer: `Yes, all network tools are free with no usage limits.`,
      },
      {
        question: `Do you store network queries?`,
        answer: `No. DNS lookups, pings, port scans, and other network queries are processed in real time and not stored. Your privacy is protected.`,
      },
    ],
  },
  {
    slug: "developer-tools",
    getTitle: () => `Free Developer Utilities Online - ${SITE_NAME}`,
    getDescription: () =>
      `Developer utilities including DNS tools, SSL certificate checker, HTTP headers inspector, JSON formatter, regex builder, and API tester. Free online dev tools.`,
    getH1: () => "Developer Utilities",
    getSubtitle: () => "Everyday tools for software engineers",
    getIntro: () =>
      `From formatting JSON to building regular expressions, from debugging API responses to inspecting SSL certificates, ${SITE_NAME} provides the utilities that make your development workflow faster and more efficient.`,
    getTools: byIds(
      "dns-lookup",
      "reverse-dns-lookup",
      "ssl-certificate-checker",
      "http-headers-checker",
      "website-status-checker",
      "user-agent-parser",
      "ip-lookup",
      "json-formatter",
      "regex-builder",
      "api-tester",
    ),
    getFaqs: () => [
      {
        question: `What developer utilities does ${SITE_NAME} provide?`,
        answer: `DNS tools, SSL checking, HTTP debugging, JSON formatting, regex building, API testing, user agent parsing, and IP geolocation — all in one place.`,
      },
      {
        question: `Is there an API for these tools?`,
        answer: `Many of our network tools are available via API endpoints. Check the individual tool pages for API details.`,
      },
      {
        question: `Can I use these tools in CI/CD pipelines?`,
        answer: `Our tools are designed for interactive use in the browser. For automated pipeline integration, consider our API endpoints.`,
      },
    ],
  },
  {
    slug: "seo-tools",
    getTitle: () => `Free SEO Tools Online - ${SITE_NAME}`,
    getDescription: () =>
      `SEO tools for website optimization: SSL certificate checker, HTTP headers inspector, DNS lookup, website status monitor, and WHOIS lookup. Improve your search rankings.`,
    getH1: () => "SEO Tools",
    getSubtitle: () => "Optimize your website for search engines",
    getIntro: () =>
      `Technical SEO requires the right tools. ${SITE_NAME} helps you audit SSL certificates, inspect HTTP headers for redirect issues, monitor website uptime, and verify DNS configuration — all critical factors that influence search engine rankings.`,
    getTools: byIds(
      "ssl-certificate-checker",
      "http-headers-checker",
      "website-status-checker",
      "dns-lookup",
      "dns-propagation-checker",
      "whois-lookup",
      "reverse-dns-lookup",
    ),
    getFaqs: () => [
      {
        question: `How do these tools help with SEO?`,
        answer: `SSL certificates impact rankings. HTTP headers reveal redirect chains and canonical issues. Website uptime affects crawl budget. DNS configuration determines site accessibility.`,
      },
      {
        question: `Can I check my competitor's SSL certificate?`,
        answer: `Yes. Enter any domain to inspect its SSL certificate details, including issuer, validity period, and supported protocols.`,
      },
      {
        question: `How often should I check my website's SEO health?`,
        answer: `We recommend monitoring SSL certificate expiration weekly, checking HTTP headers after any site changes, and verifying DNS propagation immediately after domain configuration updates.`,
      },
    ],
  },
  {
    slug: "security-tools",
    getTitle: () => `Free Security Tools Online - ${SITE_NAME}`,
    getDescription: () =>
      `Security tools for web professionals: SSL certificate checker, port scanner, WHOIS lookup, DNS lookup, and HTTP security headers inspector. Free online security utilities.`,
    getH1: () => "Security Tools",
    getSubtitle: () => "Audit and monitor your web security",
    getIntro: () =>
      `Stay on top of your website security with ${SITE_NAME}'s security audit tools. Check SSL/TLS certificate validity, scan for open ports, inspect HTTP security headers, and verify domain ownership details through WHOIS.`,
    getTools: byIds(
      "ssl-certificate-checker",
      "port-checker",
      "whois-lookup",
      "http-headers-checker",
      "dns-lookup",
      "reverse-dns-lookup",
      "website-status-checker",
    ),
    getFaqs: () => [
      {
        question: `What security tools does ${SITE_NAME} offer?`,
        answer: `SSL certificate checking, port scanning, WHOIS lookup, HTTP security headers inspection, DNS analysis, and website status monitoring.`,
      },
      {
        question: `Can I scan my network for open ports?`,
        answer: `Yes. Use our Port Checker to test specific ports on any host. We support common ports as well as custom port scanning.`,
      },
      {
        question: `Is SSL certificate checking secure?`,
        answer: `Yes. We perform standard TLS handshakes to retrieve certificate details. No sensitive data is transmitted or stored.`,
      },
    ],
  },
  {
    slug: "text-tools",
    getTitle: () => `Free Online Text Tools - ${SITE_NAME}`,
    getDescription: () =>
      `Text tools for writers and editors: markdown editor, text diff checker, and formatting utilities. Free online text processing tools.`,
    getH1: () => "Text Tools",
    getSubtitle: () => "Writing and text processing utilities",
    getIntro: () =>
      `${SITE_NAME} provides a curated selection of text processing tools for writers, editors, and content creators. Write markdown, compare text differences, and format content with our free online utilities.`,
    getTools: byCategory("text-writing"),
    getFaqs: () => [
      {
        question: `What text tools are available?`,
        answer: `Markdown editing, text diff comparison, and formatting tools. More text utilities are being added regularly.`,
      },
      {
        question: `Can I use these tools offline?`,
        answer: `Our text tools run in your browser and require an internet connection to load. Some functionality may work offline after the initial page load.`,
      },
      {
        question: `Are there any file size limits?`,
        answer: `Text processing is done in your browser, so limits depend on your device's available memory. Most standard use cases work without issues.`,
      },
    ],
  },
  {
    slug: "image-tools",
    getTitle: () => `Free Online Image Tools - ${SITE_NAME}`,
    getDescription: () =>
      `Image tools for designers and creators: color palette generator, CSS gradient editor, and image optimization utilities. Free online image processing tools.`,
    getH1: () => "Image Tools",
    getSubtitle: () => "Design and image processing utilities",
    getIntro: () =>
      `${SITE_NAME} helps designers and content creators with color palette generation, CSS gradient creation, and image optimization. All tools run directly in your browser with no uploads to external servers.`,
    getTools: byCategory("image-design"),
    getFaqs: () => [
      {
        question: `What image tools does ${SITE_NAME} offer?`,
        answer: `Color palette generation from images or hex codes, CSS gradient creation, and image optimization for web formats like WebP and AVIF.`,
      },
      {
        question: `Are uploaded images stored?`,
        answer: `No. All image processing happens locally in your browser. Your images are never uploaded to any server.`,
      },
      {
        question: `Can I use the generated colors commercially?`,
        answer: `Yes. Color palettes and gradients generated with our tools are free for any use, including commercial projects.`,
      },
    ],
  },
];

export function getLandingPage(slug: string): LandingPageConfig | undefined {
  return LANDING_PAGES.find((lp) => lp.slug === slug);
}

export function getAllLandingSlugs(): string[] {
  return LANDING_PAGES.map((lp) => lp.slug);
}
