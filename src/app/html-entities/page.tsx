import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { HTML_ENTITIES } from "@/lib/databases";
import { HtmlEntitiesClient } from "./client";
import { TrustSignal } from "@/components/shared/trust-signal";

export const metadata: Metadata = {
  title: "HTML Entities Reference — Complete List of HTML Character Entities | Nuvora",
  description: "Complete reference of HTML named character entities including punctuation, Latin letters, Greek letters, math symbols, arrows, and special characters with code points.",
  openGraph: { title: "HTML Entities Reference — Complete List", description: "Complete reference of HTML named character entities." },
  twitter: { title: "HTML Entities Reference", description: "Complete reference of HTML named character entities." },
  alternates: { canonical: `${SITE_URL}/html-entities` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "References", href: `${SITE_URL}/resources` },
  { label: "HTML Entities" },
];

const categories = [...new Set(HTML_ENTITIES.map((e) => e.category))];

export default function HtmlEntitiesPage() {
  const initial = HTML_ENTITIES;
  return (
    <>
      <JsonLd data={webPageSchema({ name: "HTML Entities Reference", description: "Complete reference of HTML named character entities.", url: `${SITE_URL}/html-entities`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            HTML Entities Reference
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Complete list of HTML named character entities. Search by entity name, character, or category.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <HtmlEntitiesClient initial={initial} categories={categories} />
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 text-center sm:px-6">
        <TrustSignal />
      </section>
    </>
  );
}
