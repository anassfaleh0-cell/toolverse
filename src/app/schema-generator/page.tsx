import type { Metadata } from "next";
import { SchemaGenerator } from "@/components/seo-suite/schema-generator";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, getRelatedTools, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "schema-generator";
const tool = getToolBySlug(slug)!;
const pageTitle = "Schema Generator - Create JSON-LD Structured Data Free";
const pageDescription = "Generate JSON-LD schema markup for your website. Create structured data for articles, products, local businesses, FAQs, events, reviews, and more schema types.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "What is JSON-LD schema markup?", answer: "JSON-LD (JavaScript Object Notation for Linked Data) is a structured data format that helps search engines understand your content. By adding JSON-LD to your pages, you enable rich results in search like star ratings, prices, FAQs, events, and breadcrumbs." },
  { question: "How does schema markup affect search results?", answer: "Schema markup can enable rich snippets, knowledge panels, carousels, and other enhanced search features. Pages with structured data often rank higher in search results because they provide clear context about content type and relevance." },
  { question: "What schema types should I use for SEO?", answer: "Article for blog posts, Product for e-commerce, LocalBusiness for physical stores, FAQ for question pages, BreadcrumbList for navigation, Organization for company pages, Person for author pages, Event for events, Review for ratings, and Recipe for cooking content." },
  { question: "What is the difference between JSON-LD and microdata?", answer: "JSON-LD keeps structured data in a separate script tag, making it easier to implement and maintain. Microdata embeds schema properties directly in HTML attributes. Google recommends JSON-LD as the preferred format for structured data." },
  { question: "How do I validate my schema markup?", answer: "Use Google&apos;s Rich Results Test or the Schema Markup Validator. Both tools will check your JSON-LD for errors and show you which rich results features are eligible based on your markup." },
];

const relatedTools = getRelatedTools(tool);

export default function SchemaGeneratorPage() {
  const breadcrumbs = generateToolBreadcrumbs(tool);
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <SchemaGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Why Structured Data Matters for SEO</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Structured data is a powerful SEO tool that helps search engines understand your content in depth. Pages with properly implemented JSON-LD are eligible for rich results — enhanced search listings with star ratings, prices, images, and other visual elements that dramatically improve click-through rates.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Schema Types and Their Use Cases</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Different schema types serve different purposes. Article schema can generate headline-rich results. Product schema enables price and availability displays. LocalBusiness schema helps with local SEO and maps presence. FAQ schema creates expandable Q&A results. Event schema enables event listings in search. Choose the schema type that best matches your content.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">JSON-LD Best Practices</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Always validate your JSON-LD with the Rich Results Test. Use valid JSON syntax — trailing commas and unquoted keys are common errors. Include only one schema type per script tag, but you can have multiple script tags on a page. Keep structured data up to date, especially for time-sensitive types like Events and Products with prices.</p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title={`${tool.name} FAQ`} />
        </div>
      </section>

      <section className="border-t border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools tools={relatedTools?.map(t => ({ icon: "Wrench", title: t.name, description: t.description, href: t.url })) || []} title="Related Tools" />
        </div>
      </section>
    </>
  );
}
