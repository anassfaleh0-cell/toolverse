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
