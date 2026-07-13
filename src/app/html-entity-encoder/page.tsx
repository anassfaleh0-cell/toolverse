import type { Metadata } from "next";
import { HtmlEntityEncoder } from "@/components/html-entity-encoder/html-entity-encoder";
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

const slug = "html-entity-encoder";
const pageTitle = "HTML Entity Encoder Decoder - Encode HTML Special Characters Online";
const pageDescription =
  "Encode and decode HTML entities online. Convert special characters like <, >, &, and quotes to HTML-safe entities to prevent XSS and rendering issues in web pages.";

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
  { label: "HTML Entity Encoder Decoder" },
];

const faqItems: FaqItem[] = [
  {
    question: "What are HTML entities and why are they needed?",
    answer:
       "HTML entities are special codes that represent characters with specific meanings in HTML. The characters <, >, &, \", and ' are part of HTML syntax, so if you want to display them as literal text, you must use their entity equivalents: &lt;, &gt;, &amp;, &quot;, and &apos;. Without encoding, the browser interprets these characters as markup, which breaks page rendering and creates cross-site scripting vulnerabilities.",
  },
  {
    question: "What is the difference between named entities and numeric entities?",
    answer:
      "Named entities use descriptive names like &amp; for ampersand, &lt; for less-than, and &eacute; for é. They are easier to read in source code but not every Unicode character has a named entity. Numeric entities use decimal or hexadecimal references like &#8212; or &#x2014; for an em dash. They can represent any Unicode character, making them more comprehensive. Browsers render both forms identically. Nuvora supports both encoding styles in its output.",
  },
  {
    question: "How does HTML entity encoding prevent XSS attacks?",
    answer:
      "Cross-site scripting (XSS) occurs when an attacker injects malicious scripts into web pages viewed by other users. If user-generated content containing <script> tags is rendered without encoding, the browser executes the injected script. HTML entity encoding converts < to &lt; and > to &gt;, so the browser displays the tags as text rather than executing them. This is the primary defense against stored and reflected XSS, though context-sensitive encoding is also needed for JavaScript, CSS, and URL contexts.",
  },
  {
    question: "Should I encode &apos; (apostrophe/single quote) in HTML?",
    answer:
      "Yes, when the apostrophe appears inside HTML attribute values delimited by single quotes. The HTML5 specification defines &apos; for this purpose, but some older browsers do not support it. For maximum compatibility, use &#39; (decimal) or &#x27; (hex) instead, or avoid the issue altogether by using double quotes for attribute delimiters. In text content, the raw apostrophe character is perfectly safe and does not require encoding.",
  },
  {
    question: "What characters should always be HTML-encoded in user input?",
    answer:
      `The five canonical HTML metacharacters should always be encoded: & (encode as &amp;), < (encode as &lt;), > (encode as &gt;), " (encode as &quot;), and ' (encode as &#39; or &apos;). Beyond these, encode any character that might be misinterpreted based on your output context. In text content, this set is sufficient. In attribute values, also encode the quote character that delimitates the attribute. In script blocks, more aggressive encoding is necessary to prevent injection.`,
  },
  {
    question: "What is the difference between HTML encoding and URL encoding?",
    answer:
      "HTML encoding uses entity syntax (&amp;) to make text safe for HTML documents. URL encoding uses percent syntax (%26) to make data safe for URLs. They address different attack surfaces and use different escaping mechanisms. A common mistake is applying the wrong encoding for the context. For example, HTML-encoding a URL parameter value before inserting it into a query string does not protect against URL-based injection. Use <Link href=\"/url-encoder\" className=\"text-blue-600 hover:underline dark:text-blue-400\">URL Encoder</Link> for URL contexts and this tool for HTML contexts.",
  },
  {
    question: "How do I display code snippets in HTML without breaking the page?",
    answer:
      "To display code snippets containing < and > characters in an HTML page, you must HTML-encode those characters. Wrap the encoded content in a <pre><code> block for monospace rendering with preserved whitespace. Most static site generators and CMS platforms do this automatically, but if you are writing raw HTML or building a custom template, you must encode manually. This is also where double-encoding becomes a problem: if your template engine already encodes, applying additional encoding produces &amp;lt; instead of &lt;.",
  },
  {
    question: "What is double HTML encoding and why is it bad?",
    answer:
      "Double encoding happens when HTML entities are encoded a second time, turning &lt; into &amp;lt;. The browser renders this as the literal text &lt; instead of <. This typically occurs when data passes through multiple encoding layers: a database or API may store encoded text, and then the template engine applies another round of encoding. Always track which layer is responsible for encoding and ensure it happens exactly once, at the point where data enters the HTML context.",
  },
  {
    question: "How does HTML entity encoding handle Unicode and emoji?",
    answer:
      "HTML can represent any Unicode character using numeric character references. Emoji like 😀 can be written as &#128512; or &#x1F600;. Modern HTML5 documents served with UTF-8 encoding typically include the raw Unicode characters, which browsers handle natively. Entity encoding is most important for ASCII characters that have syntactic meaning in HTML. For non-ASCII text, entity encoding is optional and primarily useful when the document encoding might not support the character directly.",
  },
  {
    question: "When should I use a server-side template engine vs client-side encoding?",
    answer:
      "Server-side template engines like Pug, Handlebars, and server-rendered React have auto-escaping built in, which prevents XSS by default. Client-side encoding via JavaScript is necessary when dynamically inserting content into the DOM, especially with innerHTML assignments. Even with frameworks like React and Vue that escape by default, using dangerouslySetInnerHTML or v-html bypasses protection, requiring manual encoding. Always prefer framework-safe rendering methods and use entity encoding as a defensive layer when inserting raw HTML.",
  },
  {
    question: "Can HTML entities be used in email and plain text contexts?",
    answer:
      "HTML entities are only interpreted in HTML contexts. In plain text emails or text/plain HTTP responses, the literal entity string is shown. This is why multipart email messages include both text/plain and text/html alternatives: the plain text version should contain raw characters, while the HTML version uses entities for special characters. Some email clients render HTML entities even in supposedly plain text modes, but you should not rely on this behavior.",
  },
  {
    question: "What is the difference between escape, encode, and sanitize?",
    answer:
      "Escaping and encoding are interchangeable terms referring to converting special characters to their safe representations. Sanitization is a broader process that includes encoding but also removes or rejects dangerous content entirely. Sanitization libraries like DOMPurify strip malicious HTML tags and attributes while preserving safe markup. For most applications, encode input at the output stage (context-aware escaping) rather than sanitizing input, because encoding preserves data while sanitization may discard it.",
  },
];

export default function HtmlEntityEncoderPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="HTML Entity Encoder Decoder"
            description="Convert special HTML characters like <, >, &, and quotes to HTML entities and back. Essential for preventing XSS and ensuring proper character rendering."
            breadcrumbs={breadcrumbs}
          >
            <HtmlEntityEncoder />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding HTML Entities and Why They Matter
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
               HTML entities are the backbone of safe text rendering on the web. Every character that holds special meaning in HTML syntax must be represented as an entity when it appears in text content. The less-than symbol ({'<'}) starts a tag, the greater-than symbol ({'>'}) closes one, and the ampersand (&) starts an entity itself. Without encoding, these characters create ambiguous markup that browsers interpret unpredictably, often resulting in broken pages or, worse, security vulnerabilities that attackers can exploit.
            </p>
            <p>
              The severity of this issue depends on context. In blog comments, forum posts, and user profiles, unencoded special characters can completely break the page layout. In e-commerce product descriptions, a forgotten encoding in a &amp; character turns &amp; into an invalid entity reference. In CMS-managed content, the line between safe rendering and XSS vulnerability is often a single missing encoding function. Server-side rendering frameworks typically auto-escape, but raw HTML insertion and dynamic content updates bypass these protections. For managing text transformations across different contexts, the <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> can help normalize text before encoding it for HTML output.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            XSS Prevention Through Proper Encoding
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Cross-site scripting remains one of the most common web security vulnerabilities, and missing HTML encoding is its primary enabler. When user-supplied data lands in an HTML context without encoding, an attacker can inject script tags, event handlers, or javascript: URLs that execute in the context of your application. The solution is context-aware output encoding: different rules apply for HTML body, HTML attributes, JavaScript, CSS, and URL contexts. HTML entity encoding covers the HTML body and attribute contexts, but other contexts require different encoding strategies.
            </p>
            <p>
              For example, user data placed inside a JavaScript string literal must be JavaScript-escaped (backslashes, quotes, newlines), not HTML-encoded. Data inside a CSS value must be CSS-escaped. The OWASP XSS Prevention Cheat Sheet provides the definitive guidance for each context. Layering HTML entity encoding provides defense-in-depth for most content scenarios, but it is not a silver bullet. For detecting XSS vulnerabilities in your application, use automated scanners and manual penetration testing alongside proper encoding. The <Link href="/url-encoder" className="text-blue-600 hover:underline dark:text-blue-400">URL Encoder</Link> covers a different context: it prevents injection through URL parameters, which HTML encoding alone does not address.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Special Characters, Unicode, and International Text in HTML
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Beyond the five basic HTML metacharacters, entity encoding is useful for displaying any character that might not render correctly due to document encoding issues. Curly quotes, em dashes, trademark symbols, mathematical operators, and accented letters all have named or numeric entity representations. Using entities for these characters ensures consistent rendering regardless of the user&apos;s system encoding settings. This was critical in the pre-UTF-8 era, and it remains relevant for legacy systems, email rendering, and XML-based formats that mandate ASCII-safe content.
            </p>
            <p>
              Modern HTML5 documents should use UTF-8 encoding, which handles the full Unicode repertoire directly. In a UTF-8 page, you can include é, —, or 😎 as raw characters without entity encoding. The exception is when your data might be re-encoded or transformed downstream, such as in RSS feeds, XML exports, or email newsletters where charset handling varies unpredictably. In those cases, encoding special characters as entities adds a layer of robustness. For binary-safe representations of data alongside your text, the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> provides a complementary encoding scheme for non-text content.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common HTML Entity Encoding Mistakes
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The most common mistake is double encoding: applying HTML entity encoding to text that is already encoded. This produces visible entity strings in the browser output. Another frequent issue is inconsistent encoding across a page, where some dynamic content is encoded and some is not, leading to both security vulnerabilities and visual inconsistencies. Developers also frequently forget to encode inside HTML attribute values, especially title, alt, and data attributes, leaving the page vulnerable to injection through attributes that can include JavaScript event handlers.
            </p>
            <p>
               A subtle but critical mistake is using the wrong encoding for the wrong context. HTML encoding inside a {'<'}script{'>'} tag does not prevent JavaScript injection because the HTML parser decodes entities before the JavaScript parser runs. Script content must use JavaScript escaping instead. Similarly, HTML encoding inside a URL href attribute does not prevent URL-based attacks; that requires URL encoding. Understanding these context boundaries is the difference between effective defense and a false sense of security. The <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> helps when debugging JSON structures that include HTML content, letting you verify that encoding is applied correctly within nested data.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About HTML Entity Encoding" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Link", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
              { icon: "LockKeyhole", title: "Base64 Encoder", description: "Encode and decode Base64 strings for data URIs and JWT payloads", href: "/base64-encoder" },
              { icon: "File", title: "HTML Minifier", description: "Minify HTML by removing whitespace and comments", href: "/html-minifier" },
              { icon: "FileText", title: "JS Minifier", description: "Minify JavaScript code to reduce file size and improve load times", href: "/js-minifier" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="html-entity-encoder" />
    </>
  );
}
