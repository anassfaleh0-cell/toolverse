import { getAllTools, getToolsByCategory, getRelatedTools, getToolBySlug } from "@/lib/registry";
import { getContentForTool } from "@/lib/content/registry";
import { CATEGORIES } from "@/lib/categories";

export interface InternalLink {
  href: string;
  label: string;
  type: "tool" | "guide" | "article" | "category" | "comparison" | "glossary" | "author" | "learn" | "ultimateguide";
}

export interface ContextualLink {
  href: string;
  label: string;
  type: "guide" | "comparison" | "reference" | "learn" | "tool" | "category" | "troubleshooting";
  relevance: number;
}

export interface WorkflowStep {
  toolSlug: string;
  label: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  steps: WorkflowStep[];
  category: string;
}

const ULTIMATE_GUIDES: Record<string, InternalLink[]> = {
  "network-internet": [
    { href: "/ultimate-guides/dns", label: "Ultimate DNS Guide", type: "ultimateguide" },
    { href: "/ultimate-guides/networking", label: "Ultimate Networking Guide", type: "ultimateguide" },
    { href: "/ultimate-guides/ssl-tls", label: "Ultimate SSL/TLS Guide", type: "ultimateguide" },
  ],
  "code-dev": [
    { href: "/ultimate-guides/json", label: "Ultimate JSON Guide", type: "ultimateguide" },
    { href: "/ultimate-guides/http", label: "Ultimate HTTP Guide", type: "ultimateguide" },
  ],
};

const CONTENT_ROUTE: Record<string, string> = {
  guide: "guides",
  comparison: "compare",
  reference: "reference",
  learn: "learn",
  errors: "errors",
  article: "blog",
  tutorial: "learn",
  examples: "examples",
  "cheat-sheet": "cheat-sheets",
  "best-practices": "best-practices",
  commands: "commands",
  "use-cases": "use-cases",
};

export const POPULAR_WORKFLOWS: Workflow[] = [
  {
    id: "secure-your-email",
    title: "Secure Your Email",
    description: "Verify your email authentication configuration end-to-end",
    steps: [
      { toolSlug: "dns-lookup", label: "MX & SPF Records" },
      { toolSlug: "dns-lookup", label: "DKIM Signature Check" },
      { toolSlug: "dns-lookup", label: "DMARC Policy" },
      { toolSlug: "reverse-dns-lookup", label: "PTR Record (rDNS)" },
    ],
    category: "network-internet",
  },
  {
    id: "website-health-check",
    title: "Website Health Check",
    description: "Complete website diagnostics from DNS to security",
    steps: [
      { toolSlug: "domain-report", label: "Domain Report Card" },
      { toolSlug: "ssl-certificate-checker", label: "SSL Certificate Check" },
      { toolSlug: "http-headers-checker", label: "HTTP Headers Audit" },
      { toolSlug: "dns-lookup", label: "DNS Records" },
    ],
    category: "network-internet",
  },
  {
    id: "slow-website-debug",
    title: "Slow Website Debug",
    description: "Pinpoint why your website is loading slowly",
    steps: [
      { toolSlug: "ping-test", label: "Latency Test" },
      { toolSlug: "website-status-checker", label: "Response Time" },
      { toolSlug: "http-headers-checker", label: "Cache Headers" },
      { toolSlug: "dns-lookup", label: "DNS Resolution Speed" },
    ],
    category: "network-internet",
  },
  {
    id: "domain-investigation",
    title: "Domain Investigation",
    description: "Full domain ownership and configuration audit",
    steps: [
      { toolSlug: "whois-lookup", label: "WHOIS Ownership" },
      { toolSlug: "dns-lookup", label: "DNS Records" },
      { toolSlug: "reverse-dns-lookup", label: "Reverse DNS" },
      { toolSlug: "ssl-certificate-checker", label: "SSL Certificate" },
    ],
    category: "network-internet",
  },
  {
    id: "security-headers-audit",
    title: "Security Headers Audit",
    description: "Verify your website's security posture",
    steps: [
      { toolSlug: "http-headers-checker", label: "Security Headers" },
      { toolSlug: "ssl-certificate-checker", label: "TLS Configuration" },
      { toolSlug: "dns-lookup", label: "CAA & DNSSEC" },
    ],
    category: "network-internet",
  },
  {
    id: "json-api-debug",
    title: "API Response Debug",
    description: "Debug JSON API responses from end to end",
    steps: [
      { toolSlug: "json-formatter", label: "Format JSON" },
      { toolSlug: "jwt-decoder", label: "Decode JWT Tokens" },
      { toolSlug: "base64-encoder", label: "Decode Base64 Payloads" },
    ],
    category: "code-dev",
  },
  {
    id: "code-optimization",
    title: "Code Optimization Pipeline",
    description: "Minify and optimize your web assets",
    steps: [
      { toolSlug: "html-minifier", label: "Minify HTML" },
      { toolSlug: "css-minifier", label: "Minify CSS" },
      { toolSlug: "js-minifier", label: "Minify JS" },
    ],
    category: "code-dev",
  },
  {
    id: "hash-verify-chain",
    title: "Hash & Integrity Check",
    description: "Generate and verify file integrity hashes",
    steps: [
      { toolSlug: "md5-hash-generator", label: "MD5 Hash" },
      { toolSlug: "sha-hash-generator", label: "SHA Hash" },
      { toolSlug: "base64-encoder", label: "Base64 Encode" },
    ],
    category: "code-dev",
  },
  {
    id: "ip-network-diagnostics",
    title: "IP & Network Diagnostics",
    description: "Troubleshoot connectivity from your IP outward",
    steps: [
      { toolSlug: "what-is-my-ip", label: "What Is My IP" },
      { toolSlug: "ip-lookup", label: "IP Lookup" },
      { toolSlug: "ping-test", label: "Ping Test" },
      { toolSlug: "port-checker", label: "Port Checker" },
    ],
    category: "productivity",
  },
  {
    id: "text-processing-pipeline",
    title: "Clean & Transform Text",
    description: "Process and normalize text data",
    steps: [
      { toolSlug: "text-cleaner", label: "Clean Text" },
      { toolSlug: "case-converter", label: "Convert Case" },
      { toolSlug: "remove-duplicate-lines", label: "Remove Duplicates" },
      { toolSlug: "sort-lines", label: "Sort Lines" },
    ],
    category: "text-writing",
  },
];

export function getToolInternalLinks(toolSlug: string): InternalLink[] {
  const links: InternalLink[] = [];
  const tool = getToolBySlug(toolSlug);
  if (!tool) return links;

  const category = CATEGORIES.find((c) => c.slug === tool.category);
  if (category) {
    links.push({ href: `/category/${category.slug}`, label: `All ${category.label} Tools`, type: "category" });
  }

  const relatedTools = getRelatedTools(tool, 4);
  for (const rt of relatedTools) {
    links.push({ href: rt.url, label: rt.name, type: "tool" });
  }

  const content = getContentForTool(toolSlug);
  const seen = new Set<string>();
  for (const c of content.slice(0, 6)) {
    const route = c.type === "article" ? "blog" : c.type === "guide" ? "guides" : c.type === "comparison" ? "compare" : c.type === "learn" ? "learn" : c.type;
    const key = `${route}/${c.slug}`;
    if (!seen.has(key)) {
      seen.add(key);
      links.push({ href: `/${key}`, label: c.title, type: c.type === "article" ? "article" : c.type === "guide" ? "guide" : c.type === "comparison" ? "comparison" : c.type === "learn" ? "learn" : "guide" });
    }
  }

  const guides = ULTIMATE_GUIDES[tool.category];
  if (guides) {
    for (const g of guides) {
      if (!links.find((l) => l.href === g.href)) {
        links.push(g);
      }
    }
  }

  links.push({ href: "/glossary", label: "Technical Glossary", type: "glossary" });

  return links;
}

export function getContentInternalLinks(contentSlug: string): InternalLink[] {
  const links: InternalLink[] = [];
  const content = getContentForTool(contentSlug);
  if (content.length === 0) {
    const allContent = getContentForTool(contentSlug);
    if (allContent.length > 0) {
      for (const c of allContent.slice(0, 3)) {
        const route = c.type === "article" ? "blog" : c.type === "guide" ? "guides" : c.type === "comparison" ? "compare" : c.type;
        links.push({ href: `/${route}/${c.slug}`, label: c.title, type: c.type === "article" ? "article" : "guide" });
      }
    }
  }

  const tools = getAllTools().filter((t) => t.slug === contentSlug || contentSlug.includes(t.slug));
  for (const t of tools.slice(0, 3)) {
    links.push({ href: t.url, label: t.name, type: "tool" });
  }

  return links;
}

export function getContextualLinks(toolSlug: string): ContextualLink[] {
  const tool = getToolBySlug(toolSlug);
  if (!tool) return [];

  const links: ContextualLink[] = [];
  const seen = new Set<string>();

  const categoryTools = getToolsByCategory(tool.category).filter((t) => t.slug !== toolSlug);
  for (const ct of categoryTools) {
    if (!seen.has(ct.url)) {
      seen.add(ct.url);
      links.push({ href: ct.url, label: ct.name, type: "tool", relevance: 80 });
    }
  }

  const content = getContentForTool(toolSlug);
  for (const c of content) {
    const route = CONTENT_ROUTE[c.type] ?? c.type;
    const key = `/${route}/${c.slug}`;
    if (!seen.has(key)) {
      seen.add(key);
      const linkType = c.type === "errors" ? "troubleshooting" : (c.type === "guide" || c.type === "comparison" || c.type === "reference" || c.type === "learn" ? c.type : "guide");
      links.push({
        href: key,
        label: c.title,
        type: linkType as ContextualLink["type"],
        relevance: c.type === "errors" ? 90 : c.type === "guide" ? 80 : c.type === "comparison" ? 75 : c.type === "reference" ? 70 : 65,
      });
    }
  }

  return links.sort((a, b) => b.relevance - a.relevance);
}

export function getSuggestedNextTool(currentSlug: string): { tool: import("@/lib/registry").Tool; reason: string } | null {
  const tool = getToolBySlug(currentSlug);
  if (!tool) return null;

  const categoryTools = getToolsByCategory(tool.category).filter((t) => t.slug !== currentSlug);
  if (categoryTools.length === 0) return null;

  const idx = Math.abs(currentSlug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % categoryTools.length;
  const next = categoryTools[idx];
  return { tool: next, reason: `Continue exploring with ${next.name}` };
}
