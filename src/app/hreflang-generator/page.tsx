import type { Metadata } from "next";
import { HreflangGenerator } from "@/components/seo-suite/hreflang-generator";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, getRelatedTools, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "hreflang-generator";
const tool = getToolBySlug(slug)!;
const pageTitle = "Hreflang Generator - Create International SEO Tags Free";
const pageDescription = "Generate hreflang tags for international SEO. Specify language and regional URLs so search engines serve the correct language version to users across different countries.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "What are hreflang tags?", answer: "Hreflang tags are HTML attributes that tell search engines which language and regional version of a page to serve to users. They prevent duplicate content issues in multilingual sites and ensure the right language version appears in search results for each user." },
  { question: "How do I implement hreflang for multiple languages?", answer: "Add link rel=&quot;alternate&quot; tags with hreflang attributes for each language version of your page. Each language version must link to all other language versions including itself. Include an x-default tag pointing to your fallback page for users whose language is not supported." },
  { question: "What is the x-default hreflang tag?", answer: "The x-default tag specifies a fallback page for users whose browser language doesn&apos;t match any of your specified hreflang values. Typically it points to your main English page or a language selector page." },
  { question: "How many hreflang tags can I have per page?", answer: "There is no hard limit, but each language-region combination requires its own tag. Common implementations have 2-10 tags. Each language variant must reference all other variants in a mutual fashion (bidirectional linking)." },
  { question: "How do hreflang tags affect international SEO?", answer: "Hreflang tags are essential for international SEO. Without them, Google may serve the wrong language version to users, or treat language variants as duplicate content. Correct hreflang implementation ensures users in Spain see your Spanish page while users in Mexico see your Mexican Spanish variant." },
];

const relatedTools = getRelatedTools(tool);

export default function HreflangGeneratorPage() {
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
            <HreflangGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Why Hreflang Matters for International SEO</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>For multilingual websites, hreflang tags are critical. Without them, search engines may index the same content in multiple languages as duplicate pages, diluting your SEO authority. Hreflang tags signal to Google exactly which page to show based on the user&apos;s language and region, improving user experience and search relevance.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">How to Structure Hreflang Tags</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Each language-region combination needs a self-referencing hreflang tag and must link to all other language variants. Use ISO 639-1 language codes and ISO 3166-1 alpha-2 region codes — for example, en-US for American English, en-GB for British English, es-MX for Mexican Spanish. Always include the x-default fallback tag for users in unsupported regions.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Common Hreflang Implementation Mistakes</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>The most common mistake is missing return tags — if page A links to page B via hreflang, page B must also link back to page A. Another frequent error is using the wrong language codes (e.g., using &quot;en&quot; instead of &quot;en-US&quot; where region targeting matters) or linking to pages that redirect (creating a chain). Use the hreflang validator in Google Search Console to check your implementation.</p>
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
