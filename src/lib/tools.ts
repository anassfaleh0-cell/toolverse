export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  isFree: boolean;
  isFeatured: boolean;
}


export const tools: Tool[] = [
  {
    id: "port-checker",
    name: "Port Checker",
    description:
      "Check if a network port is open on any host. Scan common ports or test a specific port. Includes service identification and response time.",
    url: "/port-checker",
    category: "network-internet",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "ping-test",
    name: "Ping Test",
    description:
      "Test network latency and packet loss to any host. Perform TCP ping with min, average, and max response time measurements.",
    url: "/ping-test",
    category: "network-internet",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "website-status-checker",
    name: "Website Status Checker",
    description:
      "Check if a website is online and responding. Get HTTP status code, response time, content type, server information, and detailed status reports.",
    url: "/website-status-checker",
    category: "network-internet",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "ssl-certificate-checker",
    name: "SSL Certificate Checker",
    description:
      "Check SSL/TLS certificate details for any domain. View certificate issuer, validity period, fingerprints, subject alternative names, and days until expiration.",
    url: "/ssl-certificate-checker",
    category: "network-internet",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "user-agent-parser",
    name: "User Agent Parser",
    description:
      "Parse any User-Agent string and identify the browser, engine, operating system, device model, and CPU architecture. Detect real-time browser information.",
    url: "/user-agent-parser",
    category: "network-internet",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "http-headers-checker",
    name: "HTTP Headers Checker",
    description:
      "Check HTTP response headers for any URL. View status codes, cache policies, security headers, redirect chains, and response timing.",
    url: "/http-headers-checker",
    category: "network-internet",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "dns-propagation-checker",
    name: "DNS Propagation Checker",
    description:
      "Check DNS propagation across multiple global DNS servers. See if your DNS changes have propagated to Google, Cloudflare, Quad9, OpenDNS, and more.",
    url: "/dns-propagation-checker",
    category: "network-internet",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "reverse-dns-lookup",
    name: "Reverse DNS Lookup",
    description:
      "Find the hostname associated with an IP address using reverse DNS (PTR record) lookup. Supports both IPv4 and IPv6 addresses.",
    url: "/reverse-dns-lookup",
    category: "network-internet",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "dns-lookup",
    name: "DNS Lookup",
    description:
      "Look up DNS records for any domain including A, AAAA, CNAME, MX, NS, TXT, SOA, SRV, and CAA records in one query.",
    url: "/dns-lookup",
    category: "network-internet",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "whois-lookup",
    name: "WHOIS Lookup",
    description:
      "Look up domain registration information including registrar, creation date, expiration date, name servers, and contact details for any domain.",
    url: "/whois-lookup",
    category: "network-internet",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "0",
    name: "What Is My IP",
    description:
      "Find your public IPv4 and IPv6 address instantly. See location, ISP, ASN, timezone, and browser information.",
    url: "/what-is-my-ip",
    category: "productivity",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "1",
    name: "IP Lookup",
    description:
      "Look up any IPv4 or IPv6 address. Get location, ISP, hostname, ASN, and interactive map.",
    url: "/ip-lookup",
    category: "productivity",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "md-editor",
    name: "Markdown Editor Pro",
    description:
      "A powerful real-time Markdown editor with live preview, syntax highlighting, and export to PDF.",
    url: "https://example.com/markdown-editor",
    category: "text-writing",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "color-palette",
    name: "Color Palette Generator",
    description:
      "Generate harmonious color palettes from images, hex codes, or AI-powered suggestions.",
    url: "https://example.com/color-palette",
    category: "image-design",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Regex Builder",
    description:
      "Visual regular expression builder with real-time testing, cheat sheet, and common patterns library.",
    url: "https://example.com/regex-builder",
    category: "code-dev",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "4",
    name: "JSON Formatter",
    description:
      "Format, validate, and minify JSON data with tree view, search, and diff comparison.",
    url: "https://example.com/json-formatter",
    category: "code-dev",
    isFree: true,
    isFeatured: true,
  },
  {
    id: "5",
    name: "Image Optimizer",
    description:
      "Compress and convert images to WebP, AVIF, and other formats without losing quality.",
    url: "https://example.com/image-optimizer",
    category: "image-design",
    isFree: true,
    isFeatured: false,
  },
  {
    id: "6",
    name: "SQL Query Builder",
    description:
      "Build complex SQL queries visually with drag-and-drop table joins and auto-complete.",
    url: "https://example.com/sql-builder",
    category: "data-analytics",
    isFree: false,
    isFeatured: true,
  },
  {
    id: "7",
    name: "Audio Converter",
    description:
      "Convert audio files between MP3, WAV, FLAC, and AAC formats with batch processing.",
    url: "https://example.com/audio-converter",
    category: "audio-video",
    isFree: true,
    isFeatured: false,
  },
  {
    id: "8",
    name: "Pomodoro Timer",
    description:
      "A sleek Pomodoro timer with task tracking, analytics, and customizable work intervals.",
    url: "https://example.com/pomodoro",
    category: "productivity",
    isFree: true,
    isFeatured: false,
  },
  {
    id: "9",
    name: "CSS Gradient Generator",
    description:
      "Create beautiful CSS gradients with an interactive editor, presets, and live preview.",
    url: "https://example.com/css-gradients",
    category: "image-design",
    isFree: true,
    isFeatured: false,
  },
  {
    id: "10",
    name: "API Tester",
    description:
      "Test REST and GraphQL APIs with a beautiful interface, request history, and environment variables.",
    url: "https://example.com/api-tester",
    category: "code-dev",
    isFree: true,
    isFeatured: false,
  },
  {
    id: "11",
    name: "Text Diff Checker",
    description:
      "Compare two texts side by side with highlighted additions, removals, and word-level diff.",
    url: "https://example.com/text-diff",
    category: "text-writing",
    isFree: true,
    isFeatured: false,
  },
  {
    id: "12",
    name: "Chart Maker",
    description:
      "Create interactive charts and graphs from CSV or JSON data with export to PNG and SVG.",
    url: "https://example.com/chart-maker",
    category: "data-analytics",
    isFree: false,
    isFeatured: false,
  },
];

/** @deprecated Use registry.ts functions instead */
export function getFeaturedTools(): Tool[] {
  return tools.filter((t) => t.isFeatured);
}

/** @deprecated Use registry.ts functions instead */
export function getLatestTools(): Tool[] {
  return tools.slice(0, 6);
}

/** @deprecated Use registry.ts functions instead */
export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category);
}
