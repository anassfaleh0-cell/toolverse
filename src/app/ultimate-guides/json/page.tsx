import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema } from "@/lib/seo";
import type { FaqItem } from "@/lib/seo";

export const metadata: Metadata = {
  title: `The Ultimate JSON Guide — Syntax, Validation, and Data Exchange - ${SITE_NAME}`,
  description: "A comprehensive guide to JSON covering syntax (objects, arrays, strings, numbers, booleans, null), JSON vs XML vs YAML comparison, validation and formatting, JSON in APIs, and essential JSON tools.",
  openGraph: {
    title: "The Ultimate JSON Guide — Syntax, Validation, and Data Exchange",
    description: "Master JSON from syntax fundamentals to API integration. Complete coverage of JSON vs XML vs YAML, validation, formatting, and JSON processing tools.",
    url: `${SITE_URL}/ultimate-guides/json`,
  },
  twitter: {
    title: "The Ultimate JSON Guide — Syntax, Validation, and Data Exchange",
    description: "Master JSON from syntax fundamentals to API integration. Complete coverage of JSON vs XML vs YAML, validation, formatting, and JSON processing tools.",
  },
  alternates: { canonical: `${SITE_URL}/ultimate-guides/json` },
};

const pageUrl = `${SITE_URL}/ultimate-guides/json`;
const pageTitle = "The Ultimate JSON Guide — Syntax, Validation, and Data Exchange";
const pageDescription = "A comprehensive guide to JSON covering syntax, JSON vs XML vs YAML, validation and formatting, JSON in APIs, and essential JSON tools.";

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Guides", href: `${SITE_URL}/guides` },
  { label: "Ultimate JSON Guide" },
];

const faqItems: FaqItem[] = [
  {
    question: "What does JSON stand for?",
    answer: "JSON stands for JavaScript Object Notation. It is a lightweight, language-independent data interchange format that is easy for humans to read and write and easy for machines to parse and generate. Despite its origins in JavaScript, JSON is supported by virtually every programming language."
  },
  {
    question: "What is the difference between JSON and XML?",
    answer: "JSON is more concise, faster to parse, and maps directly to programming language data structures (objects, arrays). XML is more verbose, supports attributes and namespaces, and has mature schema validation (XSD). JSON is now the dominant format for web APIs, while XML remains common in enterprise systems and document storage."
  },
  {
    question: "How do I validate JSON?",
    answer: "Use Nuvora's JSON Formatter to validate JSON data. The tool checks for syntax errors, trailing commas, missing quotes, and malformed structures. It formats the output with proper indentation and provides detailed error messages with line numbers for quick debugging."
  },
  {
    question: "Can JSON contain comments?",
    answer: "No, JSON does not support comments by specification. If you need comments, consider using JSON with a pre-processor (like JSON5 or HJSON) that supports comments, or use a separate metadata field. Some configuration systems strip comments before parsing JSON."
  },
  {
    question: "What is the maximum size of a JSON file?",
    answer: "JSON has no official maximum size limit. However, practical limits depend on your parser, available memory, and use case. Most JSON parsers can handle files up to several hundred megabytes. For very large datasets, consider streaming parsers or alternative formats like NDJSON (JSON lines) or protocol buffers."
  }
];

export default function UltimateJsonGuidePage() {
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
            <section id="what-is-json">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">1. What is JSON?</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format that is easy for humans to read and write and easy for machines to parse and generate. It was originally derived from JavaScript object literal syntax but is now language-independent, with parsers available for virtually every programming language.</p>
                <p>JSON was popularized by Douglas Crockford in the early 2000s as a simpler alternative to XML for data exchange. It became the de facto standard for web APIs, configuration files, and data storage. The JSON format is formally defined in RFC 7159 and ECMA-404. Its simplicity, readability, and universal support have made it the most widely used data format on the web.</p>
                <p>JSON&apos;s key advantages include: minimal syntax (no closing tags, fewer characters), native support for structured data (objects and arrays), fast parsing (especially compared to XML), widespread language support, and excellent compatibility with JavaScript (the language of the web). Every major API platform — from Twitter to Stripe to Google — uses JSON as its primary data format.</p>
                <p>JSON is used across virtually every domain of software development: REST and GraphQL APIs, configuration files (package.json, tsconfig.json), NoSQL databases (MongoDB stores BSON, a binary form of JSON), real-time messaging (WebSocket payloads), data export and migration, and machine learning datasets. Understanding JSON is essential for any developer.</p>
              </div>
            </section>

            <section id="json-syntax">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">2. JSON Syntax</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>JSON has a simple but strict syntax. It supports six data types that can be nested to represent complex data structures.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Objects { }</h3>
                <p>Objects are unordered collections of key/value pairs wrapped in curly braces. Keys must be double-quoted strings. Values can be any valid JSON data type. Objects are the most common structure in JSON APIs and represent entities or records.</p>
                <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800"><code>{`{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}`}</code></pre>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Arrays [ ]</h3>
                <p>Arrays are ordered lists of values wrapped in square brackets. Values can be of any type, including mixed types (though homogeneous arrays are more common). Arrays represent lists, collections, or sequences.</p>
                <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800"><code>{`["apple", "banana", "cherry"]

[
  {"id": 1, "name": "Alice"},
  {"id": 2, "name": "Bob"}
]`}</code></pre>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Strings</h3>
                <p>Strings are sequences of Unicode characters wrapped in double quotes. They support escape sequences: \n (newline), \t (tab), \&quot; (double quote), \\ (backslash), and \uXXXX (Unicode code point).</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Numbers</h3>
                <p>Numbers can be integers (42), decimals (3.14), scientific notation (1.5e10), or negative values (-273.15). JSON does not distinguish between integer and floating-point types — that depends on the parser. Leading zeros are not allowed.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Booleans and Null</h3>
                <p>Booleans are the literal values true and false (without quotes). Null represents the absence of a value and is written as null (without quotes). These are distinct from string representations &quot;true&quot; or &quot;null&quot;.</p>
                <p><strong>Critical syntax rules:</strong> Keys and string values must use double quotes (not single quotes). No trailing commas allowed after the last element in an object or array. No comments are permitted. File encoding must be UTF-8. Numbers must be base-10 (no hex or octal).</p>
                <p>Validate your JSON syntax with <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora JSON Formatter</Link>.</p>
              </div>
            </section>

            <section id="json-vs-xml-yaml">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">3. JSON vs XML vs YAML</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>These three data formats are the most common choices for configuration, data exchange, and serialization. Each has strengths and trade-offs.</p>
              </div>
              <ComparisonMatrix
                title="JSON vs XML vs YAML"
                headers={["JSON", "XML", "YAML"]}
                rows={[
                  { feature: "Syntax Style", values: ["Lightweight, braces", "Verbose, angle brackets", "Whitespace-indented"], highlight: false },
                  { feature: "Readability", values: ["Good", "Moderate (verbose)", "Excellent (human-friendly)"], highlight: true },
                  { feature: "Data Types", values: ["6 types (object, array, string, number, bool, null)", "Text-only (typed via schema/XSD)", "Rich types (supports anchors, tags)"], highlight: false },
                  { feature: "Comments", values: ["Not supported", "Supported (<!-- -->)", "Supported (#)"], highlight: false },
                  { feature: "Attributes", values: ["No (use nested objects)", "Yes (attributes on elements)", "No"], highlight: false },
                  { feature: "Schema Validation", values: ["JSON Schema", "XSD, DTD, RelaxNG", "YAML Schema (limited)"], highlight: false },
                  { feature: "Parser Speed", values: ["Fast", "Moderate", "Slow (complex spec)"], highlight: false },
                  { feature: "Namespace Support", values: ["No", "Yes (XML namespaces)", "No"], highlight: false },
                  { feature: "API Ecosystem", values: ["Dominant (REST, GraphQL)", "Legacy (SOAP, RSS)", "Config files (CI/CD, Docker)"], highlight: false },
                  { feature: "File Size", values: ["Compact", "Large (verbose tags)", "Compact (indentation-based)"], highlight: false },
                ]}
              />
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>JSON strikes the best balance for web APIs and data exchange. YAML is preferred for configuration files (Docker Compose, Kubernetes, CI/CD pipelines) because of its readability. XML remains important for document-centric applications, enterprise integration (SOAP), and formats like RSS/Atom feeds. Convert between formats using <Link href="/json-to-csv" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora JSON to CSV</Link>, <Link href="/yaml-to-json" className="text-blue-600 hover:underline dark:text-blue-400">YAML to JSON Converter</Link>, and <Link href="/xml-to-json" className="text-blue-600 hover:underline dark:text-blue-400">XML to JSON Converter</Link>.</p>
              </div>
            </section>

            <section id="json-validation">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">4. JSON Validation and Formatting</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Validating JSON data is critical because malformed JSON will break any parser. Common validation errors include:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>Trailing commas:</strong> A comma after the last item in an object or array causes a parse error. This is the most common JSON mistake.</li>
                  <li><strong>Missing quotes:</strong> Keys and string values must be wrapped in double quotes. Single quotes or unquoted keys are invalid.</li>
                  <li><strong>Incorrect number format:</strong> Leading zeros (like 007), hex literals (0xFF), and octal numbers are not allowed.</li>
                  <li><strong>Unescaped control characters:</strong> Characters like tabs or newlines must be escaped within strings.</li>
                  <li><strong>Duplicate keys:</strong> While some parsers accept duplicate keys (using the last value), they violate the specification.</li>
                </ul>
                <p>Formatting (also called beautifying or pretty-printing) makes JSON human-readable by adding indentation and line breaks. Minification removes unnecessary whitespace to reduce file size for transmission. <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora JSON Formatter</Link> handles both operations with syntax highlighting, line numbers, and detailed error reporting with exact positions of syntax issues.</p>
              </div>
            </section>

            <section id="json-in-apis">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">5. JSON in APIs</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>JSON is the universal language of modern APIs. Here&apos;s how it&apos;s used across different API architectures:</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">REST APIs</h3>
                <p>RESTful APIs use JSON as the primary request and response format. A typical REST response returns a JSON object or array with relevant data, status information, and pagination metadata. HTTP headers (Content-Type: application/json) indicate JSON encoding. Most API frameworks handle JSON serialization and deserialization automatically.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">GraphQL APIs</h3>
                <p>GraphQL uses JSON for both queries and responses. The query is a JSON-like string sent via POST, and the response is always a JSON object with a &quot;data&quot; field (and optionally an &quot;errors&quot; field). GraphQL&apos;s single-endpoint approach relies entirely on JSON structure for communication.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">JSON Web Tokens (JWT)</h3>
                <p>JWTs use JSON to encode claims (authentication data, permissions, metadata) in a compact, URL-safe token format. The token consists of three base64url-encoded JSON segments (header, payload, signature). Decode and inspect JWTs with <Link href="/jwt-decoder" className="text-blue-600 hover:underline dark:text-blue-400">Nuvora JWT Decoder</Link>.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">API Response Best Practices</h3>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Use consistent key naming (camelCase or snake_case, never mix)</li>
                  <li>Include pagination metadata (total, page, per_page) in list responses</li>
                  <li>Use standardized error responses (message, code, details)</li>
                  <li>Avoid deep nesting (flatten where possible)</li>
                  <li>Use arrays for collections, objects for single entities</li>
                  <li>Set Content-Type: application/json and charset=utf-8</li>
                </ul>
              </div>
            </section>

            <section id="json-tools">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">6. JSON Tools</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Nuvora provides a complete set of JSON processing tools for developers:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li><Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> — Format, validate, and minify JSON data with syntax highlighting, error detection, and line numbers.</li>
                  <li><Link href="/json-to-csv" className="text-blue-600 hover:underline dark:text-blue-400">JSON to CSV Converter</Link> — Convert JSON data to CSV format and back. Handles nested objects and arrays with custom delimiters.</li>
                  <li><Link href="/json-path-search" className="text-blue-600 hover:underline dark:text-blue-400">JSON Path Search</Link> — Search and filter JSON data using JSONPath expressions. Navigate complex nested structures and extract specific values instantly.</li>
                  <li><Link href="/yaml-to-json" className="text-blue-600 hover:underline dark:text-blue-400">YAML to JSON Converter</Link> — Convert between YAML and JSON formats bidirectionally with support for complex nested structures.</li>
                  <li><Link href="/xml-to-json" className="text-blue-600 hover:underline dark:text-blue-400">XML to JSON Converter</Link> — Transform XML data to JSON format with attribute, namespace, and nested element handling.</li>
                  <li><Link href="/jwt-decoder" className="text-blue-600 hover:underline dark:text-blue-400">JWT Decoder</Link> — Decode and inspect JSON Web Tokens to view header, payload, and signature.</li>
                </ul>
                <p className="mt-4">Explore all our <Link href="/best-online/best-json-tools" className="text-blue-600 hover:underline dark:text-blue-400">best JSON tools</Link> or browse the <Link href="/tools" className="text-blue-600 hover:underline dark:text-blue-400">full tools directory</Link>.</p>
              </div>
            </section>
          </div>

          <section className="mt-16">
            <FaqSection items={faqItems} title="JSON Frequently Asked Questions" />
          </section>
        </div>
      </article>
    </>
  );
}
