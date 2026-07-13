import type { Metadata } from "next";
import { CanonicalGenerator } from "@/components/seo-suite/canonical-generator";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, getRelatedTools, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "canonical-generator";
const tool = getToolBySlug(slug)!;
const pageTitle = "Canonical URL Generator - Create Canonical Tags Free";
const pageDescription = "Generate canonical URL tags to prevent duplicate content issues. Set self-referencing canonicals, handle www vs non-www and trailing slash normalization for better SEO.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "What is a canonical URL?", answer: "A canonical URL is the preferred version of a web page when multiple URLs serve the same or similar content. The rel=canonical tag tells search engines which URL should be treated as the authoritative source and appear in search results." },
  { question: "How do canonical tags prevent duplicate content?", answer: "When identical content is accessible via multiple URLs (e.g., https://example.com and https://www.example.com), the canonical tag tells Google which URL to index. This consolidates ranking signals to the preferred URL and prevents SEO dilution from duplicate content." },
  { question: "What is a self-referencing canonical?", answer: "A self-referencing canonical is a canonical tag that points back to the current page&apos;s own URL. This is considered a best practice for all pages because it helps Google understand the exact URL you want indexed, especially when query parameters or session IDs might create variations." },
  { question: "Canonical vs 301 redirect — which should I use?", answer: "Use 301 redirects when you want to permanently move users and crawlers from one URL to another. Use canonical tags when you want both URLs to remain accessible but tell Google which one to index. Redirects pass more link equity than canonicals." },
  { question: "How does trailing slash affect canonical URLs?", answer: "Trailing slashes can create duplicate content — https://example.com/page and https://example.com/page/ might serve the same content. Choose one convention (with or without trailing slash) and apply it consistently in your canonical tags and internal links." },
];

const relatedTools = getRelatedTools(tool);

export default function CanonicalGeneratorPage() {
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
            <CanonicalGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Why Canonical Tags Are Essential for SEO</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Duplicate content is one of the most common SEO issues. E-commerce sites often have the same product accessible via multiple URLs (different categories, search parameters, color variants). Canonical tags consolidate all these URLs into one preferred version, ensuring your SEO authority isn&apos;t split across multiple URLs.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Self-Referencing Canonicals Best Practice</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Google recommends using self-referencing canonicals on every page. Even if you don&apos;t think you have duplicate content, query parameters, session IDs, tracking tags, and URL fragments can create multiple versions of the same page. A self-referencing canonical tells Google explicitly which URL to index.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Common Canonical Tag Mistakes</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Never point your canonical tag to a redirecting URL or a different content topic. Don&apos;t use canonical tags as a substitute for 301 redirects where appropriate. Ensure your sitemap URLs match your canonical URLs. For paginated content, use rel=&quot;next&quot; and rel=&quot;prev&quot; alongside properly configured canonicals.</p>
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
          <RelatedTools tools={relatedTools?.map(t => ( { icon: "Wrench", title: t.name, description: t.description, href: t.url })) || []} title="Related Tools" />
        </div>
      </section>
    </>
  );
}
