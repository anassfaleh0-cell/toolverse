import type { Metadata } from "next";
import { RobotsTxtGenerator } from "@/components/seo-suite/robots-txt-generator";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, getRelatedTools, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "robots-txt-generator";
const tool = getToolBySlug(slug)!;
const pageTitle = "Robots.txt Generator - Create robots.txt Files Free";
const pageDescription = "Generate robots.txt files for your website. Allow or block search engine crawlers, set crawl delay, and specify sitemap URLs to control crawler access.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "What is a robots.txt file?", answer: "A robots.txt file is a text file placed at the root of your website that instructs search engine crawlers which pages or sections they can or cannot crawl and index. It respects the Robots Exclusion Protocol and is the first file crawlers check when visiting your site." },
  { question: "How do I create a robots.txt file?", answer: "Use this generator to define User-agent rules, Disallow and Allow paths, Crawl-delay, and Sitemap URLs. Download the output and place the robots.txt file in the root directory of your website (e.g., https://example.com/robots.txt)." },
  { question: "What is the difference between Disallow and Allow?", answer: "Disallow tells crawlers which URLs they should not access. Allow overrides a disallow for a specific path within a disallowed directory. For example, you can disallow an entire directory but allow a specific file within it." },
  { question: "How do I set Crawl-delay in robots.txt?", answer: "Add the Crawl-delay directive (value in seconds) to tell crawlers to wait between successive requests. This helps prevent server overload. Not all crawlers respect this directive — Googlebot ignores it and uses Google Search Console settings instead." },
  { question: "Where should I place my robots.txt file?", answer: "The robots.txt file must be placed in the root directory of your website. It must be accessible at the top level — for example, https://example.com/robots.txt. It cannot be placed in subdirectories." },
];

const relatedTools = getRelatedTools(tool);

export default function RobotsTxtGeneratorPage() {
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
            <RobotsTxtGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">How Robots.txt Controls Crawler Access</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Robots.txt is the first file search engine crawlers check when they visit your site. It tells them which URLs they can access and which they should ignore. A well-configured robots.txt helps crawlers discover your important pages while conserving your crawl budget by excluding admin sections, staging environments, and duplicate content.</p>
            <p>The file uses User-agent directives to target specific crawlers, Disallow and Allow to control access, and Crawl-delay to rate-limit aggressive bots. Always include a Sitemap directive pointing to your XML sitemap so crawlers can discover all your content efficiently.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Common Robots.txt Mistakes</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>One of the most common errors is accidentally blocking important resources like CSS and JavaScript files. Google needs to render pages fully, and blocking CSS/JS with Disallow can harm your search rankings. Another frequent mistake is using uppercase in paths when the file system is case-sensitive, or forgetting to add a trailing slash on directory paths.</p>
            <p>Always test your robots.txt using Google Search Console&apos;s robots.txt Tester before deploying. Verify that your sitemap URL is correct and accessible, and that you haven&apos;t accidentally blocked your entire site with Disallow: /.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Robots.txt Best Practices</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Keep your robots.txt file clean and minimal. Only block URLs that genuinely need to be hidden from search results. Use Allow to override Disallow for specific pages within blocked directories. Always include your sitemap URL at the end of the file. Remember that robots.txt is a public file — anyone can view it, so don&apos;t use it to hide sensitive information.</p>
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
