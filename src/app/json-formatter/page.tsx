import type { Metadata } from "next";
import { JsonFormatter } from "@/components/json-formatter/json-formatter";
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

const slug = "json-formatter";
const pageTitle = "JSON Formatter - Validate, Beautify, and Minify JSON Online";
const pageDescription =
  "Format, validate, and minify JSON with Nuvora&apos;s free online JSON formatter. Beautify messy JSON, catch syntax errors, and copy clean output for API debugging and development.";

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
  { label: "JSON Formatter" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between JSON formatting and JSON validation?",
    answer:
      "Validation checks whether a JSON string conforms to the JSON specification by testing syntax, structure, and data types. Formatting (beautifying) applies indentation and line breaks for human readability. A valid JSON string can be minified or pretty-printed interchangeably, but an invalid string cannot be formatted at all. Nuvora runs validation automatically when you format or minify, so you always know if your JSON is structurally sound.",
  },
  {
    question: "Why does my JSON fail validation when it looks correct?",
    answer:
      "The most common causes are trailing commas after the last element in an object or array, unquoted keys, single quotes instead of double quotes, and missing commas between properties. JSON is strict by design. A trailing comma is legal in JavaScript but throws a SyntaxError in JSON.parse. Use this formatter to pinpoint the exact line and character where the parser fails.",
  },
  {
    question: "Can JSON handle comments like JavaScript objects?",
    answer:
      "No. The JSON specification (RFC 7159) does not support comments. If you need comments, consider using JSONC (JSON with Comments) supported by VS Code and other editors, or switch to a format like YAML or TOML that natively supports comments. Many build tools strip comments from JSONC before parsing it as standard JSON.",
  },
  {
    question: "What is the difference between JSON and JavaScript objects?",
    answer:
      "JSON is a language-independent data interchange format that uses a strict subset of JavaScript object literal syntax. JSON keys must be double-quoted strings. Values can only be strings, numbers, booleans, null, objects, or arrays. Functions, undefined, symbols, dates, and undefined are not valid JSON. A JavaScript object literal can contain all of these, which is why JSON.parse cannot handle them.",
  },
  {
    question: "How do I handle large JSON files in a browser formatter?",
    answer:
      "Browser-based formatters parse the entire JSON string in memory, so extremely large files (over 50 MB) may cause performance issues or tab crashes. For production-scale JSON, use command-line tools like jq or the built-in formatter in VS Code. Nuvora works well for API responses, configuration files, and data samples up to several megabytes.",
  },
  {
    question: "Why would I minify JSON instead of formatting it?",
    answer:
      "Minified JSON removes all whitespace, reducing file size for transmission over the network. APIs return minified JSON by default to save bandwidth. Minification is also useful when storing JSON in database fields with size limits or embedding it in source code. You can round-trip between formatted and minified JSON without losing any data.",
  },
  {
    question: "What are common JSON errors in API responses?",
    answer:
      "The most frequent errors include unexpected tokens (often from HTML or error pages returned instead of JSON), unterminated strings containing unescaped control characters, deeply nested objects exceeding parser limits, and encoding mismatches where the response claims UTF-8 but contains Latin-1 characters. Always validate your API responses with a tool like this before building integrations.",
  },
  {
    question: "How does JSON differ from XML for data interchange?",
    answer:
      "JSON is more compact, easier to parse, and maps directly to native data structures in most programming languages. XML supports attributes, namespaces, schemas (XSD), and mixed content, making it more expressive for document-centric use cases. JSON has largely replaced XML in REST APIs, while XML remains dominant in SOAP, SVG, and document markup.",
  },
  {
    question: "What is pretty-printing and why is it useful?",
    answer:
      "Pretty-printing applies consistent indentation and line breaks to JSON so that nested structures are visually apparent. This is essential for debugging API responses, reviewing configuration files, and collaborating on data schemas. Most formatters use 2-space indentation as the convention, though 4-space and tab indentation are also common depending on team preferences.",
  },
  {
    question: "Can JSON contain duplicate keys and how are they handled?",
    answer:
      "The JSON specification does not prohibit duplicate keys, but it strongly recommends against them. Parsers handle duplicates differently: most browsers and Node.js keep the last occurrence, while some parsers reject them or merge values. Nuvora does not silently drop duplicates, so you can identify them manually during formatting.",
  },
  {
    question: "How do I escape special characters in JSON strings?",
    answer:
      "JSON requires escaping of double quotes (\"), backslashes (\\), and control characters using backslash sequences. Newlines become \\n, tabs become \\t, and carriage returns become \\r. Unicode characters can be escaped with \\uXXXX notation. Most stringify functions handle this automatically, but when constructing JSON manually, missing escapes are a frequent source of validation errors.",
  },
  {
    question: "What is the relationship between JSON and Base64 encoding?",
    answer:
      "JSON natively supports strings, so binary data must be encoded as text for transport. Base64 is the standard way to embed binary data like images, file contents, or cryptographic keys inside a JSON payload. Use Nuvora&apos;s <Link href=\"/base64-encoder\" className=\"text-blue-600 hover:underline dark:text-blue-400\">Base64 Encoder</Link> to encode binary data before including it in JSON structures.",
  },
];

export default function JsonFormatterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="JSON Formatter"
            description="Format, validate, beautify, and minify any JSON string instantly. Paste your JSON and get clean, readable output with error highlighting."
            breadcrumbs={breadcrumbs}
          >
            <JsonFormatter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why JSON Formatting Matters for API Debugging
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              JSON is the lingua franca of modern web APIs. Every time your frontend fetches data from a REST endpoint, the response arrives as a single-line, minified JSON blob. Reading that blob directly is like trying to find a typo in a wall of text. A JSON formatter restores structure with proper indentation, making it immediately obvious where objects begin and end, which keys exist at each nesting level, and whether the data shape matches your schema expectations.
            </p>
            <p>
              Beyond readability, formatting forces validation. If the JSON is malformed, you get an error at the exact position of the problem. This is invaluable when integrating with third-party APIs that sometimes return HTML error pages instead of JSON, truncate responses, or include stray characters. Pair this tool with a <Link href="/jwt-decoder" className="text-blue-600 hover:underline dark:text-blue-400">JWT Decoder</Link> to inspect authentication payloads, or use it alongside the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> when working with embedded binary data in your API contracts.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            JSON Validation vs Formatting: Two Sides of the Same Coin
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Validation and formatting are often conflated, but they serve distinct purposes. Validation answers the question: &quot;Is this string valid JSON?&quot; It checks for proper syntax, correct data types, and structural conformance to the JSON specification. Formatting answers: &quot;Can this be made readable?&quot; It takes a valid JSON string and applies indentation, line breaks, and consistent spacing. Every format operation implicitly validates first, because you cannot pretty-print invalid JSON.
            </p>
            <p>
              The practical implication is that you should validate JSON at every boundary where data enters your system. Validate responses from external APIs before processing them. Validate configuration files before loading them into your application. Validate user-submitted JSON payloads before storing them. A quick trip through this formatter catches structural issues before they become runtime errors. When debugging complex payloads, the <Link href="/url-encoder" className="text-blue-600 hover:underline dark:text-blue-400">URL Encoder</Link> helps you inspect query string data that often contains URL-encoded JSON fragments.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common JSON Errors and How to Fix Them
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The most frequent JSON error is the &quot;unexpected token&quot; message. This nearly always means the parser encountered a character it did not expect at that position. Common causes include: copy-pasting a JavaScript object literal with unquoted keys, leaving a trailing comma after the last array element, using single quotes instead of double quotes, or forgetting to escape a double quote inside a string. Less obvious sources are BOM characters in UTF-8 files, zero-width spaces inserted by rich text editors, and line endings that confuse strict parsers.
            </p>
            <p>
              Another category of errors involves numeric precision. JSON numbers are arbitrary-precision, but JavaScript implementations parse them as 64-bit floats. Very large integers lose precision silently. Strings that look like numbers but include leading zeros, underscores, or thousand separators will also fail validation. When generating JSON programmatically, always use a serializer rather than string concatenation to avoid these pitfalls. For encoding special characters in your JSON values, the <Link href="/html-entity-encoder" className="text-blue-600 hover:underline dark:text-blue-400">HTML Entity Encoder</Link> can help sanitize text content that contains HTML-sensitive characters.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Best Practices for Working with JSON
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Always use a serializer rather than manual string building. Every language has a built-in JSON library or a well-maintained third-party alternative. Manual string concatenation is the leading cause of malformed JSON in production. Use consistent key naming conventions across your API and configuration files: camelCase is standard in JavaScript ecosystems, while snake_case is common in Python and Ruby. Avoid deeply nested structures more than four or five levels deep, as they impair readability and increase parsing overhead.
            </p>
            <p>
              Use JSON Schema for validation and documentation whenever possible. A well-defined schema catches type mismatches, missing required fields, and value constraints before bad data enters your system. For configuration files, consider JSONC if you need comments, or switch to YAML for human-authored configs that benefit from reduced syntax overhead. When transmitting JSON over HTTP, ensure your server sets the Content-Type header to application/json so clients know how to interpret the response before parsing begins.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About JSON Formatting" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "LockKeyhole", title: "Base64 Encoder", description: "Encode and decode Base64 strings for data URIs and JWT payloads", href: "/base64-encoder" },
              { icon: "Link", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
              { icon: "Circle", title: "JWT Decoder", description: "Decode and inspect JSON Web Token headers and payloads", href: "/jwt-decoder" },
              { icon: "TextIcon", title: "HTML Entity Encoder", description: "Encode HTML special characters to prevent XSS and rendering issues", href: "/html-entity-encoder" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="json-formatter" />
    </>
  );
}
