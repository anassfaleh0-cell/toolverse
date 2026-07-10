import type { Metadata } from "next";
import { TextToSlug } from "@/components/text-to-slug/text-to-slug";
import {
  ToolLayout,
  ToolHero,
  FaqSection,
  RelatedTools,
  RelatedContent,
  JsonLd,
} from "@/components/shared";
import {
  faqSchema,
  webPageSchema,
  breadcrumbSchema,
  softwareAppSchema,
  type FaqItem,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";

const slug = "text-to-slug";
const pageTitle = "Text to Slug Converter - Generate URL-Friendly Slugs Online";
const pageDescription =
  "Convert any text to a clean, URL-friendly slug instantly. Perfect for blog post URLs, product pages, and SEO-friendly permalinks. Free online slug generator for developers and content creators.";

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
  { label: "Code & Development", href: `${SITE_URL}/category/code-dev` },
  { label: "Text to Slug Converter" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is a URL slug and why does it matter for SEO?",
    answer:
      "A URL slug is the part of a URL that identifies a specific page in a human-readable format, typically derived from the page title. For example, in https://example.com/blog/guide-to-seo, the slug is guide-to-seo. SEO-friendly slugs are short, descriptive, and contain target keywords. Search engines use URL slugs as a ranking signal and display them in search results, making them important for click-through rates. Good slugs improve user experience by telling visitors what the page is about before they click.",
  },
  {
    question: "What characters are allowed in a URL slug?",
    answer:
      "URL slugs should only contain lowercase letters, numbers, hyphens, and underscores. Special characters like spaces, punctuation, and symbols must be removed or replaced. Spaces are typically replaced with hyphens, which are the most widely recommended separator for SEO. Underscores are also valid but less common because search engines treat hyphens as word separators and underscores as word joiners. Some systems allow periods or plus signs, but hyphens are the safest and most universally supported choice.",
  },
  {
    question: "Should I use hyphens or underscores in my URL slugs?",
    answer:
      "Hyphens (-) are strongly recommended over underscores (_) for URL slugs. Google treats hyphens as word separators, so /how-to-bake-cake is interpreted as four words: how, to, bake, cake. Underscores are treated as word joiners, so /how_to_bake_cake is interpreted as a single word. This makes hyphens significantly better for SEO because each word in the slug contributes to the page's relevance for individual search terms. Hyphens are also easier to type and more familiar to users.",
  },
  {
    question: "How long should a URL slug be?",
    answer:
      "The ideal URL slug length is 3-5 words (30-60 characters). Google truncates URLs in search results at around 60 characters, so keep your most important keywords early in the slug. Shorter slugs are easier to read, remember, and share. Remove stop words (a, an, the, and, or, but, of, in) when they are not essential for meaning. Avoid keyword stuffing — a slug should be a clean representation of the content, not a list of keywords.",
  },
  {
    question: "What is the difference between a slug and a URL parameter?",
    answer:
      "A slug is a human-readable identifier in the URL path that describes the content of the page. A URL parameter is a key-value pair in the query string (after the ?) used for filtering, tracking, or pagination. For example, in /blog/my-post?utm_source=twitter, my-post is the slug and utm_source=twitter is a parameter. Slugs are part of the permanent URL structure and should be stable, while parameters are often added dynamically for analytics or session management.",
  },
  {
    question: "How do different content management systems handle slugs?",
    answer:
      "WordPress generates slugs from post titles by default, replacing spaces with hyphens and converting to lowercase. It appends a number to duplicate slugs. Shopify auto-generates product slugs but allows manual overrides. Notion uses numeric IDs alongside slug-like text. Medium uses a combination of text and a unique ID hash. Most modern CMS platforms let you customize the slug independently of the title, which is best practice because titles can change without breaking existing links.",
  },
  {
    question: "Can I change a URL slug after publishing?",
    answer:
      "Yes, but changing a URL slug breaks any existing links to the old URL. If you must change a slug, always set up a 301 redirect from the old URL to the new one. This preserves search engine rankings and ensures that bookmarks and backlinks still work. Most CMS platforms handle redirects automatically when you update a slug. Avoid changing slugs frequently, as each change requires search engines to recrawl and reindex the page under the new URL.",
  },
  {
    question: "What is slug collision and how do I prevent it?",
    answer:
      "Slug collision occurs when two different pages would generate the same URL slug (e.g., two posts titled &quot;Getting Started&quot;). Most CMS platforms handle this by appending a number or UUID to duplicate slugs. To prevent collisions, use unique identifiers like publishing dates (my-post-2026) or include category prefixes (/blog/my-post vs /tutorials/my-post). For APIs, combining a slug with a resource ID (/products/123/my-product-slug) guarantees uniqueness while keeping the URL readable.",
  },
  {
    question: "How do slugs affect website performance?",
    answer:
      "Slugs themselves have minimal direct impact on performance, but the URL structure affects caching efficiency. Consistent slug patterns (like /category/post-slug) enable effective cache key strategies with CDNs and reverse proxies. Short slugs reduce URL string length marginally, which helps with HTTP header sizes in requests. The real performance consideration is that well-structured slugs make debugging and log analysis faster because you can identify pages by reading URLs without parsing query parameters.",
  },
  {
    question: "What is the best practice for localization in URL slugs?",
    answer:
      "For multilingual websites, use localized slugs in each language (e.g., /fr/guide-de-seo for French, /de/seo-leitfaden for German). This improves SEO in each target language and creates a better user experience. Avoid using translated slugs as redirects to a single canonical slug — each language version should be independently indexable. Use hreflang tags to tell search engines which language version to serve to users based on their location and language preferences.",
  },
];

export default function TextToSlugPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Text to Slug Converter"
            description="Convert any text into a clean, SEO-friendly URL slug instantly. Perfect for blog posts, product pages, and any web content that needs human-readable URLs."
            breadcrumbs={breadcrumbs}
          >
            <TextToSlug />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why URL Slugs Matter for SEO and User Experience
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              URL slugs are one of the most visible yet underappreciated elements of web development. A well-crafted slug tells users and search engines exactly what a page contains. Google&apos;s documentation explicitly states that words in URLs are used as ranking signals, and descriptive URLs are displayed in search results, influencing click-through rates. Beyond SEO, clean slugs make URLs easier to read aloud, share verbally, and remember. A slug like /how-to-backup-your-website is immediately understandable; a slug like /p=123 requires context to interpret.
            </p>
            <p>
              The best slugs are short, contain the primary keyword, and remove unnecessary words. Stop words like a, an, the, of, and in are typically omitted unless they are essential for meaning. Numbers that add no value (like 2026 in a blog post title) can be included if they help distinguish content, but avoid appending random IDs that make URLs look cluttered. For structuring content with consistent naming conventions, the <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> helps maintain uniform formatting across your content management workflow.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Slug Best Practices for Different Platforms
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Different platforms have different conventions for slug generation. WordPress uses a simple hyphenated lowercase format and allows manual overrides. E-commerce platforms like Shopify generate slugs from product names and append identifiers for uniqueness. Static site generators like Hugo and Jekyll let you define slugs in front matter. API-driven CMS platforms like Contentful generate slugs from titles but recommend custom implementations for complex content models. Regardless of the platform, the same principles apply: use hyphens, keep it short, include keywords, and ensure uniqueness.
            </p>
            <p>
              For international content, consider that slugs in non-Latin scripts (Cyrillic, Arabic, CJK) may not be indexable by all search engines in their native form. Transliterating non-Latin characters to Latin equivalents is a common approach, though modern search engines increasingly understand URLs in their original scripts. When working with multilingual content, testing your URL patterns with the <Link href="/regex-tester" className="text-blue-600 hover:underline dark:text-blue-400">Regex Tester</Link> ensures your slug validation rules correctly handle the full range of characters your application supports.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About URL Slugs" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔡", title: "Case Converter", description: "Convert text between uppercase, lowercase, camelCase, and more", href: "/case-converter" },
              { icon: "🔍", title: "Regex Tester", description: "Test regular expressions with live matching and capture groups", href: "/regex-tester" },
              { icon: "🔗", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
              { icon: "✂️", title: "HTML Minifier", description: "Minify and optimize HTML for faster page loads", href: "/html-minifier" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="text-to-slug" />
    </>
  );
}
