import type { Metadata } from "next";
import { OpenGraphGenerator } from "@/components/seo-suite/open-graph-generator";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, getRelatedTools, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "open-graph-generator";
const tool = getToolBySlug(slug)!;
const pageTitle = "Open Graph Generator - Create Social Media Meta Tags Free";
const pageDescription = "Generate Open Graph meta tags and Twitter Cards for social sharing. Preview how your links display on Facebook, Twitter, LinkedIn, and other social platforms.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "What is Open Graph protocol?", answer: "Open Graph is a protocol that enables any web page to become a rich object in social graphs. By adding OG meta tags to your pages, you control how your content appears when shared on Facebook, Twitter, LinkedIn, Discord, and other platforms that support the protocol." },
  { question: "What OG tags are required for social sharing?", answer: "At minimum, you need og:title, og:description, og:image, and og:url. The og:type tag (defaulting to &quot;website&quot;) and og:site_name are also strongly recommended. For optimal display, use a 1200x630 pixel image (1.91:1 aspect ratio) under 5MB." },
  { question: "How do I preview my link on social media?", answer: "This tool provides a built-in card preview. You can also use the Facebook Sharing Debugger, Twitter Card Validator, or LinkedIn Post Inspector by entering your page URL to see exactly how it will appear when shared." },
  { question: "What is the difference between og:image and twitter:image?", answer: "og:image is used by Facebook, LinkedIn, and most platforms. twitter:image is specifically for Twitter. While Twitter falls back to og:image if twitter:image is missing, it&apos;s best to include both for optimal display on each platform." },
];

const relatedTools = getRelatedTools(tool);

export default function OpenGraphGeneratorPage() {
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
            <OpenGraphGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Why Open Graph Tags Matter</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>When you share a link on social media without OG tags, platforms automatically scrape your page and often pick the wrong image, title, or description. This results in broken-looking shares that reduce engagement. By specifying OG tags, you control exactly how your brand appears — the title, description, image, and URL — ensuring consistent, professional-looking social shares every time.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Image Size and Quality Guidelines</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>For best results, use OG images that are 1200x630 pixels. This 1.91:1 aspect ratio displays correctly on all platforms. Keep images under 5MB and use JPEG or PNG format. Include text overlays sparingly — platforms may crop images differently. Test your OG image using this tool&apos;s preview or the Facebook Sharing Debugger.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Platform-Specific Considerations</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Facebook caches OG data aggressively. Use the Sharing Debugger to refresh the cache after updating tags. Twitter uses twitter:card tags but falls back to og: when Twitter-specific tags are missing. LinkedIn uses og:title and og:description but generates its own image preview. Discord and Slack also support OG tags with varying image size requirements.</p>
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
