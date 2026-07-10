import type { Thing, WithContext } from "schema-dts";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type BreadcrumbList = BreadcrumbItem[];

export function faqSchema(items: FaqItem[]): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } as WithContext<Thing>;
}

export function breadcrumbSchema(
  items: BreadcrumbList,
): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  } as WithContext<Thing>;
}

export function webPageSchema({
  name,
  description,
  url,
  breadcrumbs,
}: {
  name: string;
  description: string;
  url: string;
  breadcrumbs: BreadcrumbList;
}): WithContext<Thing> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
  };

  if (breadcrumbs.length > 0) {
    schema.breadcrumb = breadcrumbSchema(breadcrumbs);
  }

  return schema as WithContext<Thing>;
}

export function videoSchema({
  name,
  description,
  url,
  thumbnailUrl,
  duration,
  uploadDate,
  publisherName = "Nuvora",
  publisherUrl = "https://nuvora.tools",
}: {
  name: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  duration: string;
  uploadDate: string;
  publisherName?: string;
  publisherUrl?: string;
}): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    contentUrl: url,
    embedUrl: url,
    publisher: {
      "@type": "Organization",
      name: publisherName,
      url: publisherUrl,
    },
  } as WithContext<Thing>;
}

export function howToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
    })),
  } as WithContext<Thing>;
}

export function qaPageSchema({
  question,
  answer,
}: {
  question: string;
  answer: string;
}): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    },
  } as WithContext<Thing>;
}

export function articleSchema({
  type,
  headline,
  description,
  url,
  publishedAt,
  updatedAt,
  authorName,
  authorUrl,
  imageUrl,
}: {
  type: "Article" | "TechArticle" | "NewsArticle";
  headline: string;
  description: string;
  url: string;
  publishedAt: string;
  updatedAt: string;
  authorName?: string;
  authorUrl?: string;
  imageUrl?: string;
}): WithContext<Thing> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    headline,
    description,
    url,
    datePublished: publishedAt,
    dateModified: updatedAt,
    mainEntityOfPage: url,
    publisher: {
      "@type": "Organization",
      name: "Nuvora",
      url: "https://nuvora.tools",
      logo: { "@type": "ImageObject", url: "https://nuvora.tools/icon.svg" },
    },
  };
  if (imageUrl) {
    schema.image = { "@type": "ImageObject", url: imageUrl };
  }
  if (authorName) {
    schema.author = {
      "@type": "Person",
      name: authorName,
      ...(authorUrl ? { url: authorUrl } : {}),
    };
  }
  return schema as WithContext<Thing>;
}

export function softwareAppSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  } as WithContext<Thing>;
}
