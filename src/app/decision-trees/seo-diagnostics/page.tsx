import type { Metadata } from "next";
import { DecisionTree, JsonLd, Breadcrumbs, SocialShare, RelatedTools } from "@/components/shared";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "decision-trees/seo-diagnostics";
const pageTitle = "SEO Diagnostic Decision Tree — Find Ranking Issues";
const pageDescription =
  "A step-by-step SEO diagnostic guide. Answer questions about search visibility, indexation, page speed, and content to identify ranking issues and improve organic performance.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${slug}`,
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: `${SITE_URL}/${slug}`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Decision Trees", href: `${SITE_URL}/decision-trees` },
  { label: "SEO Diagnostics" },
];

const nodes: Record<string, { id: string; question?: string; options?: { label: string; next: string }[]; answer?: string; isFinal?: boolean }> = {
  start: {
    id: "start",
    question: "Is your website appearing in Google search results at all?",
    options: [
      { label: "Yes, it appears but ranking could be better", next: "rankingPosition" },
      { label: "No, it does not appear in results", next: "indexationCheck" },
    ],
  },
  rankingPosition: {
    id: "rankingPosition",
    question: "Are your pages ranking on the first page (positions 1-10) for your target keywords?",
    options: [
      { label: "Yes, on the first page", next: "trafficDecline" },
      { label: "No, ranking on page 2 or beyond", next: "onPageSeoCheck" },
    ],
  },
  trafficDecline: {
    id: "trafficDecline",
    question: "Has your organic search traffic declined significantly in the last 1-3 months?",
    options: [
      { label: "Yes, traffic dropped", next: "coreWebVitals" },
      { label: "No, traffic is stable", next: "contentFreshness" },
    ],
  },
  onPageSeoCheck: {
    id: "onPageSeoCheck",
    question: "Are your title tags, meta descriptions, and heading tags optimized for your target keywords?",
    options: [
      { label: "Yes, they are optimized", next: "finalTechnicalSeo" },
      { label: "No, they need improvement", next: "finalOnPageSeo" },
    ],
  },
  indexationCheck: {
    id: "indexationCheck",
    question: "Has Google indexed your site? Check using 'site:yourdomain.com' in Google search.",
    options: [
      { label: "Yes, pages are indexed", next: "finalTechnicalSeo" },
      { label: "No, no pages are indexed", next: "submitSitemap" },
    ],
  },
  coreWebVitals: {
    id: "coreWebVitals",
    question: "Are your Core Web Vitals (LCP, FID/INP, CLS) passing the 'Good' threshold?",
    options: [
      { label: "Yes, Core Web Vitals are good", next: "competitorCheck" },
      { label: "No, Core Web Vitals need improvement", next: "finalPageSpeed" },
    ],
  },
  contentFreshness: {
    id: "contentFreshness",
    question: "Do you regularly update your website with fresh, high-quality content?",
    options: [
      { label: "Yes, content is regularly updated", next: "finalBacklinks" },
      { label: "No, content is outdated or infrequent", next: "finalContentStrategy" },
    ],
  },
  competitorCheck: {
    id: "competitorCheck",
    question: "Have your competitors published better or more comprehensive content on the same topics?",
    options: [
      { label: "Yes, competitors have stronger content", next: "finalContentStrategy" },
      { label: "No, my content is as good or better", next: "finalBacklinks" },
    ],
  },
  submitSitemap: {
    id: "submitSitemap",
    question: "Have you submitted your XML sitemap to Google Search Console?",
    options: [
      { label: "Yes, sitemap was submitted", next: "finalWaitIndex" },
      { label: "No, sitemap not submitted", next: "finalSitemap" },
    ],
  },
  finalOnPageSeo: {
    id: "finalOnPageSeo",
    isFinal: true,
    answer:
      "Optimize your on-page SEO elements. Ensure each page has a unique title tag (50-60 characters), a compelling meta description (150-160 characters), and proper heading hierarchy (H1 for the main title, H2/H3 for subsections). Use semantic HTML and include target keywords naturally. Our Sitemap Generator (Nuvora.dev/sitemap-generator) can help with site structure.",
  },
  finalTechnicalSeo: {
    id: "finalTechnicalSeo",
    isFinal: true,
    answer:
      "Check for technical SEO issues: crawl errors in Google Search Console, broken links, slow page speed, missing canonical tags, improper redirect chains, and blocked resources in robots.txt. Use the Redirect Checker (Nuvora.dev/redirect-checker) to audit redirects and HTTP Headers Checker (Nuvora.dev/http-headers-checker) to review headers. Ensure your SSL certificate (Nuvora.dev/ssl-certificate-checker) is valid.",
  },
  finalPageSpeed: {
    id: "finalPageSpeed",
    isFinal: true,
    answer:
      "Slow page speed directly impacts rankings and user experience. Optimize images, leverage browser caching, minify CSS/JS, and consider a CDN. Use Google PageSpeed Insights and our HTTP Headers Checker (Nuvora.dev/http-headers-checker) to review caching headers. Compress images with our Image Compressor (Nuvora.dev/image-compressor) and minify code.",
  },
  finalBacklinks: {
    id: "finalBacklinks",
    isFinal: true,
    answer:
      "Build high-quality backlinks to improve domain authority and rankings. Create linkable assets (guides, original research, infographics), guest post on relevant sites, and fix broken backlinks. Monitor your backlink profile and disavow toxic links. Use our Redirect Checker (Nuvora.dev/redirect-checker) to ensure any 301 redirects from old URLs pass link equity correctly.",
  },
  finalContentStrategy: {
    id: "finalContentStrategy",
    isFinal: true,
    answer:
      "Develop a consistent content strategy. Publish in-depth, original content that matches search intent. Update existing pages with fresh information and add internal links between related articles. Target long-tail keywords with lower competition. Use our Sitemap Generator (Nuvora.dev/sitemap-generator) to help search engines discover new content faster.",
  },
  finalWaitIndex: {
    id: "finalWaitIndex",
    isFinal: true,
    answer:
      "It can take days to weeks for Google to index new sites after sitemap submission. Ensure your site is accessible to crawlers: check robots.txt is not blocking Googlebot, verify your server returns 200 (not 5xx), and submit individual page URLs in Google Search Console for faster indexing. Use our Website Status Checker (Nuvora.dev/website-status-checker) to verify server response.",
  },
  finalSitemap: {
    id: "finalSitemap",
    isFinal: true,
    answer:
      "Create and submit an XML sitemap to Google Search Console and Bing Webmaster Tools. Your sitemap should include all important pages with lastmod dates and priority hints. Use our Sitemap Generator (Nuvora.dev/sitemap-generator) to create one quickly. After submission, monitor the index coverage report in Search Console for errors.",
  },
};

export default function SeoDiagnosticsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                SEO Diagnostic Decision Tree
              </h1>
              <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                Find and fix SEO ranking issues by answering guided questions about your site&apos;s visibility, indexation, page speed, and content quality.
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/${slug}`} title={pageTitle} />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="sr-only">Decision Tree</h2>
          <DecisionTree title="SEO Diagnostics" nodes={nodes} startId="start" />
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            How to Use This Decision Tree
          </h2>
          <div className="mt-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              This interactive decision tree helps you diagnose SEO ranking issues. Answer each question based on your site&apos;s current performance. The tree covers indexation problems, on-page SEO gaps, technical issues, page speed, content quality, and backlink profiles.
            </p>
            <p>
              Use the <strong>Back</strong> button to revisit previous answers and <strong>Restart</strong> for a fresh session. Each recommendation links to relevant tools on Nuvora for deeper analysis.
            </p>
            <p>
              For best results, verify your findings using tools like Google Search Console, Google Analytics, and our technical SEO tools before implementing changes.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔗", title: "Redirect Checker", description: "Trace and audit URL redirect chains", href: "/redirect-checker" },
              { icon: "🔍", title: "HTTP Headers Checker", description: "Inspect response and caching headers", href: "/http-headers-checker" },
              { icon: "📄", title: "Sitemap Generator", description: "Create XML sitemaps for search engines", href: "/sitemap-generator" },
              { icon: "🔒", title: "SSL Certificate Checker", description: "Verify SSL/TLS certificate validity", href: "/ssl-certificate-checker" },
            ]}
            title="Related SEO Tools"
          />
        </div>
      </section>
    </>
  );
}
