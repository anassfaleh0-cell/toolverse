import { SITE_NAME } from "@/lib/constants";

export interface Category {
  slug: string;
  label: string;
  icon: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "text-writing",
    label: "Text & Writing",
    icon: "✍️",
    description: "Writing assistants, grammar checkers, markdown editors, and text analysis tools.",
    seoTitle: `Text & Writing Tools - ${SITE_NAME}`,
    seoDescription: `Free online text and writing tools for ${SITE_NAME}. Markdown editors, text diff checkers, and more to supercharge your writing workflow.`,
  },
  {
    slug: "image-design",
    label: "Image & Design",
    icon: "🎨",
    description: "Image editors, color palette generators, CSS gradient tools, and design utilities.",
    seoTitle: `Image & Design Tools - ${SITE_NAME}`,
    seoDescription: `Free online image and design tools for ${SITE_NAME}. Color palette generators, image optimizers, CSS gradient tools, and design resources.`,
  },
  {
    slug: "code-dev",
    label: "Code & Development",
    icon: "💻",
    description: "Code formatters, regex builders, API testers, JSON tools, and developer utilities.",
    seoTitle: `Developer Tools - ${SITE_NAME}`,
    seoDescription: `Free online developer tools for ${SITE_NAME}. JSON formatters, regex builders, API testers, and code utilities for developers.`,
  },
  {
    slug: "data-analytics",
    label: "Data & Analytics",
    icon: "📊",
    description: "SQL builders, chart makers, data visualization, and analytics tools.",
    seoTitle: `Data & Analytics Tools - ${SITE_NAME}`,
    seoDescription: `Free online data and analytics tools for ${SITE_NAME}. SQL query builders, chart makers, and data visualization utilities.`,
  },
  {
    slug: "audio-video",
    label: "Audio & Video",
    icon: "🎵",
    description: "Audio converters, video editors, media tools, and multimedia utilities.",
    seoTitle: `Audio & Video Tools - ${SITE_NAME}`,
    seoDescription: `Free online audio and video tools for ${SITE_NAME}. Audio converters, media editors, and multimedia processing utilities.`,
  },
  {
    slug: "productivity",
    label: "Productivity",
    icon: "⚡",
    description: "IP tools, timers, and utilities that help you work smarter and faster.",
    seoTitle: `Productivity Tools - ${SITE_NAME}`,
    seoDescription: `Free online productivity tools for ${SITE_NAME}. IP lookup, timers, and utilities designed to help you work smarter.`,
  },
  {
    slug: "network-internet",
    label: "Network & Internet",
    icon: "🌐",
    description: "WHOIS lookup, DNS tools, SSL checkers, and network diagnostic utilities.",
    seoTitle: `Network & Internet Tools - ${SITE_NAME}`,
    seoDescription: `Free online network and internet tools for ${SITE_NAME}. WHOIS lookup, DNS checkers, SSL certificate validators, and network diagnostics.`,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const CATEGORY_SLUG_TO_URL: Record<string, string> = {
  "text-writing": "/text-tools",
  "code-dev": "/developer-tools",
  "data-analytics": "/data-tools",
  "image-design": "/design-tools",
  "audio-video": "/media-tools",
  "productivity": "/productivity-tools",
};
