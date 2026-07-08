import type { Metadata } from "next";
import { RedirectChecker } from "@/components/seo-suite/redirect-checker";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, getRelatedTools, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "redirect-checker";
const tool = getToolBySlug(slug)!;
const pageTitle = "Redirect Checker - Trace URL Redirect Chains Free";
const pageDescription = "Check URL redirect chains and HTTP redirect status codes. Trace the full redirect path from initial request to final destination. Identify 301, 302, and redirect loops.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "What is a URL redirect?", answer: "A URL redirect is a technique for making a web page available under more than one URL address. When a browser or crawler tries to access a redirected URL, the server responds with an HTTP status code (like 301 or 302) pointing to the new location." },
  { question: "What is the difference between 301 and 302 redirects?", answer: "A 301 redirect is permanent — it tells search engines that the page has moved permanently and to transfer link equity to the new URL. A 302 redirect is temporary — the original URL should remain in the index. Use 301 for permanent moves and 302 for A/B testing or temporary content." },
  { question: "How does a redirect chain affect SEO?", answer: "Long redirect chains (three or more hops) waste crawl budget and slow down page load times. Each redirect adds latency and may dilute link equity. Google recommends keeping redirect chains to a maximum of 2-3 hops. A direct redirect from old URL to final destination is always best." },
  { question: "What is a redirect loop?", answer: "A redirect loop occurs when URL A redirects to URL B which redirects back to URL A (or forms a longer cycle). Browsers detect and break these loops by showing an error. Search engines cannot index pages caught in redirect loops. Always test redirects after implementation." },
];

const relatedTools = getRelatedTools(tool);

export default function RedirectCheckerPage() {
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
            <RedirectChecker />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Why Redirect Checking Matters for SEO</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Redirects are essential when restructuring your website, migrating domains, or changing URL structures. However, misconfigured redirects can harm your SEO through redirect chains, loops, or incorrect status codes. Regular redirect audits help maintain crawl efficiency and ensure users and search engines reach the right content.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">HTTP Status Codes for Redirects</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>301 Moved Permanently is the most common redirect for SEO. 302 Found is for temporary redirects. 303 See Other redirects POST to GET. 307 Temporary Redirect preserves the HTTP method. 308 Permanent Redirect is the newer standard for permanent moves. Using the wrong status code can signal to Google that your move is temporary when it&apos;s permanent.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Redirect Chain Optimization</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Each redirect in a chain adds latency and may slow down page load times. Modern browsers and crawlers follow multiple redirects, but long chains (5+) can cause timeouts and indexing issues. When migrating URLs, update all internal links to point directly to the final destination rather than relying on redirect chains to resolve intermediate URLs.</p>
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
