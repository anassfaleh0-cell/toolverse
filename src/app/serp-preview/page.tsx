import type { Metadata } from "next";
import { SerpPreview } from "@/components/seo-suite/serp-preview";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, getRelatedTools, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "serp-preview";
const tool = getToolBySlug(slug)!;
const pageTitle = "SERP Preview Tool - Preview Google Search Results Free";
const pageDescription = "Preview how your webpage looks in Google search results. Optimize title tags and meta descriptions with real-time character counting and mobile preview.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How does Google display search results?", answer: "Google displays search results as snippets typically consisting of a title link, URL breadcrumb, and meta description. The title is usually the first line (blue, clickable), followed by the URL in green, and the meta description below. Titles are typically truncated at 60 characters and descriptions at 160 characters on desktop." },
  { question: "What is the ideal title tag length for SEO?", answer: "While Google does not enforce a strict character limit, titles longer than 60 characters are often truncated in search results. For optimal display, keep titles between 50-60 characters. However, Google may display different lengths depending on the character widths — some shorter titles may also be truncated." },
  { question: "What is the ideal meta description length?", answer: "Meta descriptions should be between 140-160 characters. Descriptions shorter than 140 characters may not provide enough context, while descriptions over 160 characters may be truncated. Google may also choose to display a different snippet from your page content regardless of your meta description." },
  { question: "How does mobile SERP differ from desktop?", answer: "Mobile SERPs typically display one result at a time with larger text and more prominent URLs. The title may appear on fewer lines due to the narrower viewport. Our mobile preview simulates the Google mobile experience so you can ensure your titles and descriptions display well on smartphones." },
  { question: "How can I optimize my search snippet?", answer: "Write compelling titles that include your primary keyword near the beginning. Craft meta descriptions as actionable ad copy with a clear value proposition and call to action. Use your target keyword naturally in the description. Preview your snippet using this tool before publishing." },
];

const relatedTools = getRelatedTools(tool);

export default function SerpPreviewPage() {
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
            <SerpPreview />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Why SERP Preview Matters</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Your search result snippet is the first impression users have of your page. A well-crafted title and description significantly impact click-through rates. By previewing how your page looks in Google search results, you can optimize your snippet to attract more clicks, which indirectly signals relevance to Google and can improve rankings.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Title Tag Optimization</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Title tags are the most important on-page SEO element. Place your primary keyword near the beginning, keep it under 60 characters, and make it compelling enough to drive clicks. Use brand names at the end of titles. Avoid keyword stuffing — write for users first, search engines second. Each page should have a unique, descriptive title.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Meta Description Best Practices</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Write unique meta descriptions for every page. Include the target keyword naturally, add a clear value proposition, and include a call to action. Keep it between 140-160 characters. While Google may rewrite your meta description, well-written ones are more likely to be shown as-is in search results. Preview your description using the mobile and desktop views in this tool.</p>
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
