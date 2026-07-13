import type { Metadata } from "next";
import { HtmlMinifier } from "@/components/html-minifier/html-minifier";
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

const slug = "html-minifier";
const pageTitle = "HTML Minifier - Minify and Beautify HTML Code Online";
const pageDescription =
  "Minify HTML code by removing whitespace, comments, and redundant markup. Beautify and format HTML for readability. Free online HTML minifier for faster page loads and smaller file sizes.";

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
  { label: "HTML Minifier" },
];

const faqItems: FaqItem[] = [
  {
    question: "What exactly does an HTML minifier do to my code?",
    answer:
      "An HTML minifier removes all characters from your HTML that are unnecessary for correct rendering but consume bandwidth and parse time. This includes leading and trailing whitespace, line breaks, tab characters, HTML comments, conditional comments, redundant attribute quotes (where HTML5 allows omission), and sometimes removes default attribute values. The minifier also condenses multiple spaces into single spaces and removes optional closing tags where the HTML5 spec permits. The output is functionally identical to the original when parsed by a browser, but typically 15-40% smaller in file size.",
  },
  {
    question: "Can HTML minification break my JavaScript or CSS?",
    answer:
      "HTML minification can break inline JavaScript and CSS if the minifier is not context-aware. For example, removing whitespace inside a <script> tag can break JavaScript if it relies on whitespace for automatic semicolon insertion (ASI) between specific tokens. Similarly, CSS within <style> tags may have whitespace-dependent selectors. A good HTML minifier parses the HTML tree and preserves whitespace inside <script>, <style>, <pre>, and <textarea> elements by default. It also respects CSS/CDATA declarations and conditional comments that affect script execution.",
  },
  {
    question: "How much bandwidth can HTML minification save?",
    answer:
      "HTML minification typically reduces file size by 15-40% depending on how much whitespace and comments the original contains. For a typical 50 KB HTML page, that translates to 7-20 KB saved per page load. On a site with 100,000 monthly page views, this can save 1-2 GB of monthly bandwidth. When combined with Gzip or Brotli compression (which many CDNs apply automatically), the savings from minification are partially redundant since compression handles repetitive whitespace efficiently. However, minification still reduces the uncompressed size that the browser must parse and reduces the compressed size further.",
  },
  {
    question: "What is the difference between HTML minification and HTML compression?",
    answer:
      "Minification removes characters from the source code without changing its meaning — it strips whitespace and comments that are unnecessary for rendering. Compression (Gzip, Brotli, Deflate) is a lossless data compression algorithm applied at the transport level by the web server. Minification and compression are complementary: minification reduces the number of unique tokens in the file, which improves compression ratios. A minified HTML file typically compresses 5-10% better than the original. Both should be applied in production for optimal performance.",
  },
  {
    question: "Is HTML minification safe for single-page applications (SPAs)?",
    answer:
      "Yes, but with caveats. SPAs often use client-side frameworks (React, Vue, Angular) that render HTML through JavaScript. The initial HTML shell served by the server is typically minimal already. Minifying that shell provides marginal benefit. However, if your SPA uses server-side rendering (SSR) or static site generation (SSG), the full HTML output can benefit significantly from minification. Watch out for Angular template syntax inside script tags and Vue's template refs that might use HTML-like syntax in JavaScript strings — these should not be minified.",
  },
  {
    question: "How does HTML beautification differ from minification?",
    answer:
      "Beautification (or prettification) is the inverse operation: it takes minified or poorly formatted HTML and adds consistent indentation, line breaks, and spacing to make the code readable by humans. While minification focuses on file size reduction, beautification focuses on developer experience. A good HTML tool supports both modes, allowing developers to minify for production and beautify for debugging. Beautification is particularly useful when inspecting rendered HTML from server-side frameworks or analyzing third-party markup embedded in your pages.",
  },
  {
    question: "What HTML elements should never be minified?",
    answer:
      "Elements that preserve whitespace semantics should never have their content minified. These include <pre> (preformatted text), <textarea> (multi-line text input), <code> inside <pre> blocks, and SVG elements where whitespace can affect rendering. The <style> and <script> elements should have their internal whitespace preserved for the CSS/JS minifier to handle separately. XHTML documents that require strict XML formatting may also break if self-closing tags and namespace declarations are altered. Always verify your minified output renders correctly across target browsers.",
  },
  {
    question: "How does HTML minification affect Core Web Vitals?",
    answer:
      "HTML minification primarily improves the Largest Contentful Paint (LCP) metric by reducing the number of bytes the browser must download and parse before rendering the above-fold content. Smaller HTML also improves Time to First Byte (TTFB) if the server spends less time generating or compressing the response, though the effect is usually marginal. The biggest Core Web Vitals impact comes from combining HTML minification with CSS/JS minification, image optimization, and efficient caching strategies. A 20% reduction in HTML size translates to roughly a 20% faster initial HTML download, which is most noticeable on slow 3G connections.",
  },
  {
    question: "Can I minify HTML that contains PHP, ASP, or other server-side code?",
    answer:
      "Yes, but the minifier must be template-aware. Server-side code blocks (<?php ?>, <% %>, {{ }}) should be preserved verbatim because removing whitespace could change the output of the server-side logic, especially inside string literals and echo statements. A dedicated template minifier parses the server-side directives separately from the HTML markup. For most use cases, it is safer to minify the final HTML output after the server has processed it, rather than minifying the template source files.",
  },
  {
    question: "What are optional closing tags in HTML5 and will minification handle them?",
    answer:
      "HTML5 specifies that certain tags have optional closing tags: &lt;li&gt;, &lt;dt&gt;, &lt;dd&gt;, &lt;p&gt;, &lt;rt&gt;, &lt;rp&gt;, &lt;optgroup&gt;, &lt;option&gt;, &lt;thead&gt;, &lt;tbody&gt;, &lt;tfoot&gt;, &lt;tr&gt;, &lt;td&gt;, &lt;th&gt;. Advanced HTML minifiers remove these closing tags because browsers infer them automatically from the DOM structure. This can save a significant number of bytes in list-heavy or table-heavy documents. However, removing optional closing tags can confuse developers debugging the rendered output and may cause issues with some HTML parsers and screen readers.",
  },
  {
    question: "Should I minify HTML during development or only in production?",
    answer:
      "Only minify HTML in production builds or deployment pipelines. During development, readable HTML with proper indentation is essential for debugging, inspecting DOM output, and collaborating with team members. Use build tools like Webpack, Vite, or Parcel to configure HTML minification for the production build step. This approach ensures that developers work with readable source while users benefit from optimized delivery. Most modern frameworks include HTML minification plugins or built-in support for production builds.",
  },
  {
    question: "How does HTML minification affect SEO and search engine indexing?",
    answer:
      "HTML minification does not negatively affect SEO. Search engine crawlers parse the rendered DOM, not the raw HTML source. As long as the minified HTML produces the correct DOM structure, search engines will index the page identically to the unminified version. In fact, smaller HTML files can improve crawl efficiency because search engines can download and process pages faster, potentially leading to more pages being crawled within your crawl budget. The key is ensuring that meta tags, structured data (JSON-LD), and semantic HTML elements are preserved and correct in the minified output.",
  },
];

export default function HtmlMinifierPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="HTML Minifier"
            description="Minify HTML code by stripping whitespace, comments, and redundant markup. Beautify unformatted HTML for debugging. Free and privacy-safe."
            breadcrumbs={breadcrumbs}
          >
            <HtmlMinifier />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why HTML Minification Still Matters in the Age of HTTP/2 and Compression
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Some developers assume that Gzip compression and HTTP/2 multiplexing make HTML minification unnecessary. This is not entirely accurate. Gzip compresses repetitive patterns efficiently, and whitespace is highly repetitive, so much of the gain from minification is indeed recaptured by compression. However, minification reduces the raw byte count that the browser must parse and construct into a DOM tree. Parse time scales with the number of tokens in the HTML, not just the compressed transfer size. On mobile devices with limited CPU, a 40% reduction in HTML tokens can meaningfully improve Time to Interactive (TTI).
            </p>
            <p>
              HTTP/2 multiplexing also changes the calculus somewhat. With HTTP/1.1, inlining CSS and JavaScript reduced the number of round trips. With HTTP/2, multiple files can be sent concurrently over a single connection, reducing the incentive for inlining. But HTML itself still needs to be delivered as the initial payload, and the browser cannot start rendering until it has enough HTML to construct the critical rendering path. A smaller, minified HTML file reaches the browser faster, especially on high-latency connections. For optimizing your frontend assets beyond HTML, Nuvora&apos;s <Link href="/css-minifier" className="text-blue-600 hover:underline dark:text-blue-400">CSS Minifier</Link> and <Link href="/js-minifier" className="text-blue-600 hover:underline dark:text-blue-400">JS Minifier</Link> can extend the optimization to your stylesheets and scripts.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding What HTML Minification Removes
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              HTML minification operates on multiple levels of the markup. At the character level, it removes whitespace between tags where the HTML spec does not require it for rendering. For example, <code>&lt;div&gt;\n  &lt;p&gt;Text&lt;/p&gt;\n&lt;/div&gt;</code> becomes <code>&lt;div&gt;&lt;p&gt;Text&lt;/p&gt;&lt;/div&gt;</code> because the whitespace between &lt;div&gt; and &lt;p&gt; produces anonymous text nodes containing only whitespace, which browsers collapse. At the structural level, minifiers remove HTML comments, including conditional comments in most cases. At the attribute level, they can remove quotes around attribute values when the HTML5 parser does not require them, such as <code>&lt;div class=foo&gt;</code> instead of <code>&lt;div class=&quot;foo&quot;&gt;</code>.
            </p>
            <p>
              Advanced minification options include removing boolean attribute values (e.g., <code>&lt;input disabled&gt;</code> instead of <code>&lt;input disabled=&quot;disabled&quot;&gt;</code>), collapsing whitespace inside attribute values, removing the XML declaration and doctype whitespace, and sorting attribute names for better compression. Some minifiers also remove unnecessary attributes like <code>type=&quot;text/javascript&quot;</code> on script tags and <code>type=&quot;text/css&quot;</code> on style tags, since these are the default values in HTML5 and the browser infers them automatically. The cumulative effect of these optimizations often reaches 30-50% size reduction on verbose or generated HTML. For formatting structured data embedded in HTML, the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> helps clean up JSON-LD blocks within script tags.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            HTML Minification in Build Pipelines and CI/CD
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Integrating HTML minification into your build pipeline ensures that every deployment serves optimized HTML without manual effort. For Webpack-based projects, html-webpack-plugin compresses HTML templates and injects the hashed asset references. Vite uses @vitejs/plugin-html for HTML minification during production builds. Next.js applications have built-in HTML minification through the underlying compression middleware. For static site generators like Hugo, Jekyll, or 11ty, HTML minification is added as a post-processing step using tools like html-minifier-terser or purge-html.
            </p>
            <p>
              In CI/CD pipelines, HTML minification typically runs as part of the build step, after asset compilation but before deployment. The minified files are written to the output directory alongside the hashed assets. It is important to configure source maps and error tracking integrations before minification, because minified HTML (like minified JavaScript) changes line numbers and column positions. For debugging production issues, serving a beautified version of the HTML can help — the <Link href="/html-entity-encoder" className="text-blue-600 hover:underline dark:text-blue-400">HTML Entity Encoder</Link> is useful for encoding special characters when embedding code samples or debugging output in HTML.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When HTML Beautification Saves the Day
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              HTML beautification is the unsung hero of debugging sessions. When you inspect the rendered source of a server-side rendered application, the HTML is often a single line or deeply nested mess. Beautifying it with proper indentation reveals the DOM structure, making it easy to spot unclosed tags, incorrect nesting, or missing elements. This is especially valuable when debugging output from CMS platforms, WYSIWYG editors, or email HTML templates where the generated markup is notoriously messy. Beautification also helps when comparing two versions of rendered HTML to find regressions.
            </p>
            <p>
              Email HTML is a particularly common use case for beautification. Email clients strip CSS and JavaScript, so email markup relies entirely on inline styles and table-based layouts from the 1990s. This produces deeply nested, unreadable HTML that benefits greatly from beautification for debugging. When building email templates, combine beautified HTML output with the <Link href="/url-encoder" className="text-blue-600 hover:underline dark:text-blue-400">URL Encoder</Link> to properly encode tracking URLs and query parameters embedded in email links, ensuring they survive the encoding gauntlet of email clients.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About HTML Minification" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Palette", title: "CSS Minifier", description: "Minify and beautify CSS stylesheets for production", href: "/css-minifier" },
              { icon: "FileText", title: "JS Minifier", description: "Minify and beautify JavaScript code for faster loading", href: "/js-minifier" },
              { icon: "TextIcon", title: "HTML Entity Encoder", description: "Encode HTML special characters to prevent XSS", href: "/html-entity-encoder" },
              { icon: "Link", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="html-minifier" />
    </>
  );
}
