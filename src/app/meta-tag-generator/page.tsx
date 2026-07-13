import type { Metadata } from "next";
import { MetaTagGenerator } from "@/components/seo-suite/meta-tag-generator";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, getRelatedTools, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "meta-tag-generator";
const tool = getToolBySlug(slug)!;
const pageTitle = "Meta Tag Generator - Create SEO Meta Tags Free";
const pageDescription = "Generate HTML meta tags for SEO including title, description, keywords, viewport, robots, Open Graph, and Twitter Cards. Optimize your website for search engines and social sharing.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "What are HTML meta tags?", answer: "Meta tags are HTML elements that provide structured metadata about a web page. They are placed in the head section and help search engines understand your content, control how your page appears in search results, and define how links look when shared on social media." },
  { question: "What meta tags are important for SEO?", answer: "The title tag is the most important SEO meta tag, followed by meta description. The viewport tag ensures proper mobile rendering. The robots tag controls crawling and indexing. Open Graph and Twitter Card tags control how your page appears when shared on social platforms." },
  { question: "What is the difference between meta description and OG description?", answer: "The meta description appears in search engine result snippets, while og:description controls the description shown when your link is shared on social media platforms like Facebook and Twitter. They can be the same, but you can optimize each for its specific context." },
  { question: "How do I add Twitter Card meta tags?", answer: "Twitter Card tags include twitter:card (summary, summary_large_image, app, or player), twitter:title, twitter:description, and twitter:image. These control how your content appears in Twitter timelines and retweets." },
  { question: "Are meta keywords still important for SEO?", answer: "No, Google stopped using the meta keywords tag for rankings over a decade ago due to spam abuse. Setting it is harmless but has no SEO benefit. Focus your efforts on title tags, meta descriptions, and structured data instead." },
];

const relatedTools = getRelatedTools(tool);

export default function MetaTagGeneratorPage() {
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
            <MetaTagGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Why Meta Tags Matter for Search Rankings</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Meta tags are the foundation of on-page SEO. The title tag is your page&apos;s headline in search results — it directly impacts click-through rates. Meta descriptions serve as ad copy beneath the title, influencing whether users click your result. Open Graph and Twitter Card tags ensure your content looks professional when shared on social media.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Title Tags and Meta Description Best Practices</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Keep title tags under 60 characters and meta descriptions under 160 characters to prevent truncation. Include your primary keyword naturally in both. Make titles compelling and descriptions actionable with a clear value proposition. Each page should have a unique title and description that accurately reflects its content.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Social Media Meta Tags</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Open Graph protocol (og:) and Twitter Cards (twitter:) allow you to control how your content appears when shared. A well-formatted og:image with a 1.91:1 aspect ratio dramatically improves engagement. Always include og:title, og:description, and og:image for every page to ensure optimal social sharing previews across Facebook, Twitter, LinkedIn, and other platforms.</p>
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
