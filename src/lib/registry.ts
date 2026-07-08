import { tools as rawTools, type Tool as ToolBase } from "@/lib/tools";
import { CATEGORIES, type Category } from "@/lib/categories";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import type { FaqItem } from "@/lib/seo";

export interface Tool extends ToolBase {
  slug: string;
}

export interface ToolWithCategory extends Tool {
  categoryData: Category | undefined;
}

const enriched: Tool[] = rawTools.map((t) => ({
  ...t,
  slug: t.url.startsWith("/") ? t.url.slice(1) : t.url,
}));

const slugCounts = new Map<string, number>();
for (const t of enriched) {
  slugCounts.set(t.slug, (slugCounts.get(t.slug) || 0) + 1);
}
const duplicateSlugs = [...slugCounts.entries()].filter(([, c]) => c > 1);
if (duplicateSlugs.length > 0) {
  console.warn(`[Scale Audit] Duplicate slugs found: ${duplicateSlugs.map(([s, c]) => `${s} (${c}x)`).join(", ")}`);
}

export function getAllTools(): Tool[] {
  return enriched;
}

export function getRegisteredToolCount(): number {
  return enriched.length;
}

export function getInternalTools(): Tool[] {
  return enriched.filter((t) => t.url.startsWith("/"));
}

export function getExternalTools(): Tool[] {
  return enriched.filter((t) => !t.url.startsWith("/"));
}

export function getFeaturedTools(): Tool[] {
  return enriched.filter((t) => t.isFeatured);
}

export function getLatestTools(count = 6): Tool[] {
  return enriched.slice(0, count);
}

export function getToolsByCategory(slug: string): Tool[] {
  return enriched.filter((t) => t.category === slug);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return enriched.find((t) => t.slug === slug);
}

export function getToolByPath(path: string): Tool | undefined {
  return enriched.find((t) => t.url === path);
}

export function getRelatedTools(tool: Tool, count = 4): Tool[] {
  const same = enriched.filter(
    (t) => t.category === tool.category && t.id !== tool.id,
  );
  if (same.length >= count) return same.slice(0, count);
  const others = enriched.filter(
    (t) => t.category !== tool.category && t.id !== tool.id,
  );
  return [...same, ...others].slice(0, count);
}

export function getPopularTools(count = 4): Tool[] {
  return enriched.filter((t) => t.isFeatured).slice(0, count);
}

export function getCategories(): (Category & { toolCount: number })[] {
  return CATEGORIES.map((c) => ({
    ...c,
    toolCount: enriched.filter((t) => t.category === c.slug).length,
  }));
}

export function getCategoryWithTools(
  slug: string,
): (Category & { tools: Tool[] }) | undefined {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return undefined;
  return { ...cat, tools: enriched.filter((t) => t.category === slug) };
}

export function generateToolBreadcrumbs(tool: Tool) {
  const cat = CATEGORIES.find((c) => c.slug === tool.category);
  return [
    { label: "Home", href: SITE_URL },
    ...(cat ? [{ label: cat.label, href: `${SITE_URL}/category/${tool.category}` }] : []),
    { label: tool.name },
  ];
}

export function generateToolMetadata(tool: Tool): Metadata {
  const title = tool.name.includes(SITE_NAME)
    ? tool.name
    : `${tool.name} - ${SITE_NAME}`;
  return {
    title,
    description: tool.description,
    openGraph: { title, description: tool.description, url: `${SITE_URL}${tool.url}` },
    twitter: { card: "summary_large_image", title, description: tool.description },
    alternates: { canonical: `${SITE_URL}${tool.url}` },
    robots: { index: true, follow: true },
  };
}

export function generateCategoryMetadata(category: Category): Metadata {
  return {
    title: category.seoTitle,
    description: category.seoDescription,
    openGraph: { title: category.seoTitle, description: category.seoDescription },
    twitter: { title: category.seoTitle, description: category.seoDescription },
    alternates: { canonical: `${SITE_URL}/category/${category.slug}` },
  };
}

export function generateToolFaq(tool: Tool): FaqItem[] {
  return [
    {
      question: `What is ${tool.name}?`,
      answer: `${tool.name} is a free online tool available on ${SITE_NAME}. ${tool.description}`,
    },
    {
      question: `Is ${tool.name} free to use?`,
      answer: `Yes, ${tool.name} is completely free to use on ${SITE_NAME}. There are no hidden fees or usage limits.`,
    },
    {
      question: `How does ${tool.name} work?`,
      answer: `${tool.name} processes your input directly in your browser or through our secure server. No data is stored or shared with third parties.`,
    },
  ];
}

export function generateCategoryFaq(category: Category): FaqItem[] {
  return [
    {
      question: `What ${category.label.toLowerCase()} tools are available?`,
      answer: `${SITE_NAME} offers a curated collection of ${category.label.toLowerCase()} tools. Browse the category to find the right tool for your needs.`,
    },
    {
      question: `Are the ${category.label.toLowerCase()} tools free?`,
      answer: `All tools in the ${category.label.toLowerCase()} category on ${SITE_NAME} are free to use. We believe in providing accessible utilities for everyone.`,
    },
  ];
}

export function generateCategoryBreadcrumbs(category: Category) {
  return [
    { label: "Home", href: SITE_URL },
    { label: "Categories", href: `${SITE_URL}/categories` },
    { label: category.label },
  ];
}

export const SITEMAP_PATHS = [
  ...enriched.filter((t) => t.url.startsWith("/")).map((t) => t.url),
  "/tools",
  "/categories",
  ...CATEGORIES.map((c) => `/category/${c.slug}`),
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/glossary",
  "/case-studies",
  "/community-templates",
  "/roadmap",
  "/changelog",
  "/whats-new",
  "/trending",
  "/editor-picks",
  "/research",
  "/open-source",
  "/choose-the-right-tool",
  "/best-online/best-free-online-tools",
  "/best-online/best-dns-tools",
  "/best-online/best-image-tools",
  "/best-online/best-seo-tools",
  "/best-online/best-json-tools",
  "/best-online/best-developer-tools",
  "/best-online/best-website-tools",
  "/best-online/best-security-tools",
  "/best-online/best-ai-tools",
  "/best-online/best-productivity-tools",
  "/best-online/best-marketing-tools",
  "/best-online/best-pdf-tools",
  "/decision-trees/dns-troubleshooting",
  "/decision-trees/ssl-troubleshooting",
  "/decision-trees/seo-diagnostics",
  "/compare/dns-providers",
  "/compare/ssl-certificate-types",
  "/tool-comparisons/network-diagnostics",
  "/technical-flow/dns-resolution",
  "/technical-flow/ssl-tls-handshake",
  "/troubleshooting/dns-propagation",
  "/troubleshooting/ssl-certificate",
  "/cheat-sheets/developer-dns",
  "/cheat-sheets/developer-ssl-tls",
  "/protocols/http-versus-https",
  "/protocols/dns-protocols",
  "/benchmarks/dns-performance",
  "/learning-paths/dns-fundamentals",
  "/100m-roadmap",
  "/500-tool-roadmap",
];
