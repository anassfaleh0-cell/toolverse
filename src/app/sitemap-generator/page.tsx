import type { Metadata } from "next";
import { SitemapGenerator } from "@/components/seo-suite/sitemap-generator";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, getRelatedTools, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "sitemap-generator";
const tool = getToolBySlug(slug)!;
const pageTitle = "XML Sitemap Generator - Create Sitemap Files Free";
const pageDescription = "Generate XML sitemaps for your website. Add URLs with priority, change frequency, and last modified dates to help search engines index your content efficiently.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "What is an XML sitemap?", answer: "An XML sitemap is a file that lists all important URLs on your website, along with optional metadata like when each URL was last modified, how often it changes, and its relative priority. Search engines use sitemaps to discover and index your content more efficiently." },
  { question: "How do I create a sitemap for my website?", answer: "Use this sitemap generator to enter your URLs and configure priority, change frequency, and last modified date. The tool generates a properly formatted XML sitemap that you can download and upload to your website&apos;s root directory." },
  { question: "What are priority and changefreq in sitemaps?", answer: "Priority (0.0 to 1.0) indicates the relative importance of a URL compared to other URLs on your site. Changefreq tells search engines how often the content changes — always, hourly, daily, weekly, monthly, yearly, or never. These are hints, not directives." },
  { question: "How many URLs can a sitemap contain?", answer: "A single sitemap can contain up to 50,000 URLs and must not exceed 50MB (uncompressed). If you have more URLs, you must create multiple sitemap files and use a sitemap index file to reference them all." },
  { question: "How do I submit my sitemap to Google?", answer: "Submit your sitemap URL (e.g., https://example.com/sitemap.xml) to Google Search Console. You can also reference it in your robots.txt file using the Sitemap directive so crawlers discover it automatically." },
];

const relatedTools = getRelatedTools(tool);

export default function SitemapGeneratorPage() {
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
            <SitemapGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Why XML Sitemaps Matter for SEO</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>XML sitemaps are essential for helping search engines discover and index your content. While crawlers can find pages through internal links, a sitemap ensures every important URL is known, especially for new sites, pages buried deep in your navigation, or content that changes infrequently. Sitemaps are particularly critical for large e-commerce sites with thousands of product pages.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Sitemap Priority and Change Frequency</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Priority values help search engines understand which pages are most important on your site. Set your homepage to 1.0, key landing pages to 0.9, and less important pages lower. Change frequency hints at how often content is updated — use &quot;daily&quot; for news sites, &quot;weekly&quot; for blogs, and &quot;monthly&quot; for evergreen content. Remember these are hints only; Google may ignore them entirely.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Sitemap Best Practices</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Always use absolute URLs in your sitemap. Include only canonical URLs, not duplicate or parameterized versions. Keep your sitemap up to date by regenerating it whenever you add or remove pages. Validate your sitemap using our generator or Google Search Console to ensure it follows the XML schema correctly.</p>
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
          <RelatedTools tools={relatedTools?.map(t => ({ icon: "🔧", title: t.name, description: t.description, href: t.url })) || []} title="Related Tools" />
        </div>
      </section>
    </>
  );
}
