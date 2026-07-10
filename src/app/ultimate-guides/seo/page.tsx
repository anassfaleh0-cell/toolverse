import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema } from "@/lib/seo";
import type { FaqItem } from "@/lib/seo";

export const metadata: Metadata = {
  title: `The Ultimate SEO Guide — Technical SEO, On-Page, and Content Strategy - ${SITE_NAME}`,
  description: "A comprehensive guide to search engine optimization covering technical SEO (site structure, robots.txt, sitemaps, canonical URLs, schema markup), on-page SEO (title tags, meta descriptions, headings, content optimization), content strategy, common mistakes, and SEO tools.",
  openGraph: {
    title: "The Ultimate SEO Guide — Technical SEO, On-Page, and Content Strategy",
    description: "Master SEO from technical foundations to content strategy. Complete coverage of site structure, schema markup, meta tags, topic clusters, and SEO tools.",
    url: `${SITE_URL}/ultimate-guides/seo`,
  },
  twitter: {
    title: "The Ultimate SEO Guide — Technical SEO, On-Page, and Content Strategy",
    description: "Master SEO from technical foundations to content strategy. Complete coverage of site structure, schema markup, meta tags, topic clusters, and SEO tools.",
  },
  alternates: { canonical: `${SITE_URL}/ultimate-guides/seo` },
};

const pageUrl = `${SITE_URL}/ultimate-guides/seo`;
const pageTitle = "The Ultimate SEO Guide — Technical SEO, On-Page, and Content Strategy";
const pageDescription = "A comprehensive guide to search engine optimization covering technical SEO, on-page SEO, content strategy, common mistakes, and SEO tools.";

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Guides", href: `${SITE_URL}/guides` },
  { label: "Ultimate SEO Guide" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the most important SEO factor?",
    answer: "Content quality and relevance are the most important SEO factors. Search engines prioritize pages that provide comprehensive, authoritative, and useful information that matches user intent. Technical SEO ensures your content can be found and indexed, but without high-quality content, technical optimization alone won't drive rankings."
  },
  {
    question: "How do I create an SEO-friendly sitemap?",
    answer: "An XML sitemap lists all important pages on your website for search engines. Include only canonical URLs, use appropriate priorities (0.0–1.0) and change frequencies, keep it under 50,000 URLs (or split into multiple sitemaps), and reference it in your robots.txt file. Use Nuvora's Sitemap Generator to create one instantly."
  },
  {
    question: "What is schema markup and why does it matter?",
    answer: "Schema markup is structured data added to web pages that helps search engines understand your content. It enables rich results like star ratings, FAQ snippets, event listings, and product information in search results. Pages with schema markup typically get higher click-through rates. Use Nuvora's Schema Generator to create JSON-LD markup."
  },
  {
    question: "How long does SEO take to show results?",
    answer: "SEO is a long-term strategy. Most websites see initial improvements within 3–6 months, with significant results taking 6–12 months. Factors include domain age, competition level, content quality, backlink profile, and technical foundation. Consistent effort over 12–18 months typically yields the best results."
  },
  {
    question: "What is the difference between on-page and technical SEO?",
    answer: "On-page SEO focuses on content elements you can directly control: title tags, meta descriptions, headings, keyword usage, internal links, and image optimization. Technical SEO covers the backend: site structure, URL architecture, robots.txt, sitemaps, canonical URLs, schema markup, page speed, mobile-friendliness, and crawlability. Both are essential."
  }
];

export default function UltimateSeoGuidePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: pageUrl, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <article>
        <header className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">{pageTitle}</h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{pageDescription}</p>
            <div className="mt-6">
              <SocialShare url={pageUrl} title={pageTitle} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-16">
            <section id="what-is-seo">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">1. What is SEO?</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Search Engine Optimization (SEO) is the practice of optimizing websites to increase their visibility in search engine results pages (SERPs). The goal is to attract organic (non-paid) traffic from search engines like Google, Bing, and DuckDuckGo by ranking higher for relevant search queries.</p>
                <p>SEO has evolved dramatically since the first search engines appeared in the 1990s. Early SEO involved keyword stuffing and link manipulation. Modern SEO focuses on user experience, content quality, technical excellence, and authority building. Google&apos;s algorithms now use machine learning (RankBrain, BERT, MUM) to understand search intent and evaluate content relevance.</p>
                <p>SEO is typically divided into three pillars: <strong>technical SEO</strong> (ensuring search engines can crawl, index, and render your site), <strong>on-page SEO</strong> (optimizing content and HTML for target keywords), and <strong>off-page SEO</strong> (building authority through backlinks and brand signals). A successful SEO strategy addresses all three pillars.</p>
                <p>The benefits of SEO are substantial: organic traffic is cost-effective (no per-click costs), sustainable (good rankings persist over time), and highly targeted (users searching for your content have clear intent). Unlike paid advertising, SEO compounds — each piece of optimized content continues to generate traffic and leads long after publication.</p>
              </div>
            </section>

            <section id="technical-seo">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">2. Technical SEO</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Technical SEO ensures that search engines can discover, crawl, index, and render your website correctly. It forms the foundation upon which all other SEO efforts are built.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Site Structure and URL Architecture</h3>
                <p>A logical site structure helps search engines understand your content hierarchy. Use descriptive, keyword-rich URLs (e.g., /guides/seo-technical), maintain a shallow nesting depth (ideally 3 clicks from homepage), and use breadcrumb navigation. Implement a flat site architecture where important pages are easily accessible.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Robots.txt</h3>
                <p>The robots.txt file tells search engine crawlers which URLs they can and cannot access. Place it at the root of your domain (e.g., example.com/robots.txt). Block access to admin pages, staging environments, and duplicate content, but never use it to block sensitive content (use authentication instead). Our <Link href="/robots-txt-generator" className="text-blue-600 hover:underline dark:text-blue-400">Robots.txt Generator</Link> helps you create properly formatted robot exclusion rules.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">XML Sitemaps</h3>
                <p>Sitemaps list your website&apos;s important pages for search engines. Include only canonical URLs, set appropriate change frequencies and priorities, and submit them to Google Search Console and Bing Webmaster Tools. Use <Link href="/sitemap-generator" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Sitemap Generator</Link> to create XML sitemaps instantly.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Canonical URLs</h3>
                <p>Canonical tags (rel=&quot;canonical&quot;) tell search engines which URL is the preferred version when duplicate content exists across multiple URLs. This is critical for e-commerce sites (same product in multiple categories), AMP pages, and printer-friendly versions. Our <Link href="/canonical-generator" className="text-blue-600 hover:underline dark:text-blue-400">Canonical URL Generator</Link> helps you create correct canonical tags.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Schema Markup (Structured Data)</h3>
                <p>Schema markup uses JSON-LD format to provide search engines with explicit details about your content. It enables rich results in SERPs: FAQs, how-to steps, product reviews, recipes, events, articles, breadcrumbs, and more. Pages with schema markup average 30% higher click-through rates. Use <Link href="/schema-generator" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Schema Generator</Link> to create schema markup for any content type.</p>
                <p>Other technical SEO considerations include: HTTPS encryption, page speed (Core Web Vitals), mobile-friendliness, proper redirect implementation, hreflang tags for multilingual sites, and structured data validation.</p>
              </div>
            </section>

            <section id="on-page-seo">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">3. On-Page SEO</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>On-page SEO involves optimizing individual web pages to rank higher and earn relevant traffic. Every element on the page signals its relevance to search engines.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Title Tags</h3>
                <p>The title tag is the most important on-page SEO element. It appears as the clickable headline in search results and browser tabs. Keep titles under 60 characters, include primary keywords near the beginning, write unique titles for every page, and make them compelling to drive clicks. Use <Link href="/meta-tag-generator" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Meta Tag Generator</Link> to create optimized title tags.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Meta Descriptions</h3>
                <p>Meta descriptions summarize page content in search results (typically 155–160 characters). While not a direct ranking factor, well-written meta descriptions significantly improve click-through rates. Include target keywords naturally, add a call to action, and ensure they accurately reflect the page content.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Heading Structure (H1–H6)</h3>
                <p>Headings create a hierarchical outline of your content. Use one H1 per page (matching the title tag), organize H2s as major sections, H3s as subsections, and so on. Headings help search engines understand content structure and improve readability for users.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Content Optimization</h3>
                <p>Content should be comprehensive, original, and aligned with search intent. Target 1–2 primary keywords per page with natural inclusion in the H1, first paragraph, and throughout the body. Use related LSI keywords, include multimedia (images, videos, tables), structure content for readability (short paragraphs, bullet points), and aim for comprehensive coverage that satisfies user intent. Preview how your content appears in search results with <Link href="/serp-preview" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora SERP Preview Tool</Link>.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Image Optimization</h3>
                <p>Use descriptive filenames, fill in alt text with keywords (but don&apos;t keyword stuff), compress images for fast loading, and use responsive images with srcset. Properly optimized images can drive significant traffic through Google Image Search.</p>
              </div>
            </section>

            <section id="content-strategy">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">4. Content Strategy</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Content strategy is the planning, creation, and management of content that drives organic traffic and achieves business goals.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Topic Clusters</h3>
                <p>A topic cluster model organizes content around a central pillar page that covers a broad topic comprehensively, with multiple cluster pages linking back to the pillar. For example, a &quot;Technical SEO&quot; pillar page links to cluster pages about robots.txt, sitemaps, canonical URLs, schema markup, and page speed. This structure signals topical authority to search engines and helps them understand your expertise.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Pillar Pages</h3>
                <p>Pillar pages are comprehensive guides (like this one) that cover a broad topic in depth. They should be 2000+ words, include internal links to supporting content, feature a table of contents, and contain multimedia. Pillar pages typically target high-volume, broad keywords and serve as the central hub for a topic cluster.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Internal Linking</h3>
                <p>Strategic internal linking distributes page authority throughout your site, helps search engines discover new content, and establishes content relationships. Use descriptive anchor text, link from high-authority pages to newer content, and maintain a logical link structure. Avoid excessive links (100 per page max recommended) and broken links — check your site with <Link href="/redirect-checker" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Redirect Checker</Link>.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Open Graph and Social Meta</h3>
                <p>Open Graph tags control how your content appears when shared on social media platforms. Set og:title, og:description, og:image, and og:url for every page. Our <Link href="/open-graph-generator" className="text-blue-600 hover:underline dark:text-blue-400">Open Graph Generator</Link> helps create proper social sharing meta tags.</p>
              </div>
            </section>

            <section id="seo-tools">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">5. SEO Tools</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Nuvora offers a complete suite of SEO tools to help you optimize every aspect of your website:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li><Link href="/meta-tag-generator" className="text-blue-600 hover:underline dark:text-blue-400">Meta Tag Generator</Link> — Generate optimized title tags, meta descriptions, viewport tags, and more for better search visibility.</li>
                  <li><Link href="/sitemap-generator" className="text-blue-600 hover:underline dark:text-blue-400">Sitemap Generator</Link> — Create XML sitemaps with custom priorities, change frequencies, and last modified dates.</li>
                  <li><Link href="/schema-generator" className="text-blue-600 hover:underline dark:text-blue-400">Schema Generator</Link> — Generate JSON-LD structured data for articles, FAQs, products, local businesses, events, reviews, and more.</li>
                  <li><Link href="/redirect-checker" className="text-blue-600 hover:underline dark:text-blue-400">Redirect Checker</Link> — Trace URL redirect chains to find broken redirects, redirect loops, and non-optimal status codes.</li>
                  <li><Link href="/serp-preview" className="text-blue-600 hover:underline dark:text-blue-400">SERP Preview Tool</Link> — Preview how your page appears in Google search results with real-time title and description character counts.</li>
                  <li><Link href="/canonical-generator" className="text-blue-600 hover:underline dark:text-blue-400">Canonical URL Generator</Link> — Create canonical tags to prevent duplicate content issues.</li>
                  <li><Link href="/robots-txt-generator" className="text-blue-600 hover:underline dark:text-blue-400">Robots.txt Generator</Link> — Generate robot exclusion rules to control crawler access.</li>
                  <li><Link href="/open-graph-generator" className="text-blue-600 hover:underline dark:text-blue-400">Open Graph Generator</Link> — Create social media preview tags for Facebook, Twitter, LinkedIn, and more.</li>
                  <li><Link href="/hreflang-generator" className="text-blue-600 hover:underline dark:text-blue-400">Hreflang Generator</Link> — Generate hreflang tags for international SEO and multilingual websites.</li>
                </ul>
                <p className="mt-4">Browse our full collection of <Link href="/best-online/best-seo-tools" className="text-blue-600 hover:underline dark:text-blue-400">best SEO tools</Link> or visit the <Link href="/tools" className="text-blue-600 hover:underline dark:text-blue-400">tools directory</Link>.</p>
              </div>
            </section>

            <section id="common-seo-mistakes">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">6. Common SEO Mistakes and Fixes</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>Duplicate content:</strong> Having identical or very similar content on multiple URLs. Fix: Use canonical tags, 301 redirects, or consolidate content.<br /></li>
                  <li><strong>Broken links:</strong> Links pointing to non-existent pages create poor user experience and waste crawl budget. Fix: Use <Link href="/redirect-checker" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Redirect Checker</Link> to find broken links and fix or redirect them.</li>
                  <li><strong>Missing meta descriptions:</strong> Pages without meta descriptions get auto-generated snippets that may not be optimal. Fix: Write unique, compelling meta descriptions for every page using <Link href="/meta-tag-generator" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Meta Tag Generator</Link>.</li>
                  <li><strong>Thin content:</strong> Pages with very little content (under 300 words) rarely rank well. Fix: Expand content to provide comprehensive coverage, combine thin pages, or remove them.</li>
                  <li><strong>Slow page speed:</strong> Google uses Core Web Vitals as a ranking signal. Pages loading in over 3 seconds lose significant traffic. Fix: Optimize images, enable compression, leverage browser caching, and minimize JavaScript.</li>
                  <li><strong>Keyword cannibalization:</strong> Multiple pages targeting the same keyword compete against each other. Fix: Consolidate similar pages and ensure each page targets a unique primary keyword.</li>
                  <li><strong>Ignoring mobile optimization:</strong> Over 60% of searches happen on mobile devices. Fix: Use responsive design, test with Google&apos;s Mobile-Friendly Test, and ensure touch targets are properly sized.</li>
                  <li><strong>No schema markup:</strong> Pages without structured data miss opportunities for rich results. Fix: Add relevant schema markup using <Link href="/schema-generator" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora Schema Generator</Link>.</li>
                </ul>
                <p className="mt-4">For SEO diagnostics, use our <Link href="/decision-trees/seo-diagnostics" className="text-blue-600 hover:underline dark:text-blue-400">SEO Diagnostics Decision Tree</Link> to systematically identify and fix issues.</p>
              </div>
            </section>
          </div>

          <section className="mt-16">
            <FaqSection items={faqItems} title="SEO Frequently Asked Questions" />
          </section>

          <section className="mt-16 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Related Resources</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link href="/best-online/best-seo-tools" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">Best SEO Tools</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Curated collection of the best SEO tools</span>
              </Link>
              <Link href="/decision-trees/seo-diagnostics" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">SEO Diagnostics Tree</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Systematic SEO troubleshooting</span>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
