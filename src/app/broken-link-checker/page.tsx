import type { Metadata } from "next";
import { BrokenLinkChecker } from "@/components/seo-suite/broken-link-checker";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, getRelatedTools, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "broken-link-checker";
const tool = getToolBySlug(slug)!;
const pageTitle = "Broken Link Checker - Find Broken Links on Your Website Free";
const pageDescription = "Check multiple URLs for broken links. Test HTTP status codes, response times, and identify dead links. Server-side implementation recommended for production use.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "What is a broken link?", answer: "A broken link (dead link) is a hyperlink that points to a URL that no longer exists or is no longer accessible. When clicked, the server returns a 404 Not Found, 410 Gone, or other error status code. Broken links create poor user experiences and harm SEO." },
  { question: "How do broken links affect SEO?", answer: "Broken links waste search engine crawl budget — Googlebot spends time and resources on URLs that lead nowhere. They also create a poor user experience, which can increase bounce rates. Internal broken links can prevent search engines from discovering other important pages on your site." },
  { question: "What causes broken links?", answer: "Common causes include: pages that have been deleted or moved without redirects, URL structure changes without proper redirects, websites going offline, external sites removing or restructuring their content, and typos in hardcoded links." },
  { question: "How often should I check for broken links?", answer: "Monthly checks are recommended for most websites. Large sites with thousands of pages should run weekly checks. After any major site restructuring, run a full scan to ensure no internal links are broken. External links should be checked quarterly." },
  { question: "What is the difference between a 404 and a 410 status?", answer: "A 404 Not Found means the URL is temporarily unavailable — the server doesn&apos;t know if the resource will return. A 410 Gone is a permanent signal that the resource has been intentionally removed. Google treats 410 as a stronger signal that the page should be removed from the index faster." },
];

const relatedTools = getRelatedTools(tool);

export default function BrokenLinkCheckerPage() {
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
            <BrokenLinkChecker />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Why Broken Link Detection Matters</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Broken links damage your website&apos;s credibility and SEO performance. Search engines interpret too many dead links as a sign of poor maintenance, which can lower your rankings. Users who encounter broken links are more likely to leave your site, increasing bounce rates and reducing conversions.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Client-Side vs Server-Side Link Checking</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Due to browser CORS (Cross-Origin Resource Sharing) restrictions, client-side link checkers can only fully check same-origin URLs. Cross-origin URLs require a server-side proxy to bypass CORS limitations. For production use, implement a server-side crawling tool or integrate with a dedicated link checking API or service.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">How to Fix Broken Links</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>When you find a broken link, the best fix depends on the situation: update the link to point to the correct URL, set up a 301 redirect from the broken URL to the nearest relevant page, or remove the link entirely. For external sites that have permanently removed content, consider linking to an archived version or finding an alternative source.</p>
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
