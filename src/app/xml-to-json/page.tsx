import type { Metadata } from "next";
import { XmlToJsonConverter } from "@/components/xml-to-json/xml-to-json";
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

const slug = "xml-to-json";
const pageTitle = "XML to JSON Converter - Convert XML to JSON and JSON to XML Online";
const pageDescription =
  "Convert XML to JSON and JSON to XML instantly with Nuvora. Parse XML documents to JSON objects or generate XML from JSON data. Free online converter for developers.";

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
  { label: "Data & Analytics", href: `${SITE_URL}/category/data-analytics` },
  { label: "XML to JSON Converter" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between XML and JSON?",
    answer:
      "XML (eXtensible Markup Language) is a markup language that uses tags to define elements and attributes, supporting namespaces, schemas (XSD), and mixed content. JSON (JavaScript Object Notation) is a lightweight data interchange format that maps directly to native data structures in most programming languages. JSON is more compact and faster to parse, while XML is more expressive for document-centric use cases with features like attributes, comments, and processing instructions.",
  },
  {
    question: "When should I convert XML to JSON instead of using XML directly?",
    answer:
      "Convert XML to JSON when working with JavaScript or TypeScript applications where JSON objects integrate natively with the language. JSON is the standard for REST API payloads, configuration files, and NoSQL databases like MongoDB. XML remains the better choice for document markup (XHTML, SVG), SOAP web services, XSLT transformations, and scenarios requiring schema validation with complex content models.",
  },
  {
    question: "How does the XML to JSON conversion handle XML attributes?",
    answer:
      "XML attributes are stored under a special @attributes key in the output JSON object. For example, <item id=\"123\" type=\"product\"> becomes {\"item\": {\"@attributes\": {\"id\": \"123\", \"type\": \"product\"}}}. This preserves the distinction between attributes and child elements while keeping the JSON structure valid. Some converters offer options to merge attributes with child elements, but Nuvora keeps them separate for maximum fidelity.",
  },
  {
    question: "What happens when XML has multiple child elements with the same name?",
    answer:
      "When an XML element contains multiple children with the same tag name, they are converted to a JSON array. For example, <authors><author>John</author><author>Jane</author></authors> becomes {\"authors\": {\"author\": [\"John\", \"Jane\"]}}. A single child is represented as a scalar value rather than an array to keep the output clean and predictable.",
  },
  {
    question: "Can this converter handle XML namespaces?",
    answer:
      "The converter processes namespace prefixes as part of the element name. For example, <ns:element xmlns:ns=\"http://example.com\"> becomes {\"ns:element\": {\"@attributes\": {\"xmlns:ns\": \"http://example.com\"}}}. The namespace URI is preserved as an attribute. For applications that need full namespace resolution, consider using a dedicated XML library that supports namespace-aware processing.",
  },
  {
    question: "How does JSON to XML conversion handle JSON arrays?",
    answer:
      "JSON arrays are converted to repeated XML elements with the same tag name. For example, {\"items\": [\"a\", \"b\"]} becomes <items><item>a</item><item>b</item></items>. The array key in JSON becomes the parent element, and each array element is wrapped in a child element named after the singularized key. Nested objects within arrays are converted recursively, preserving the full structure.",
  },
  {
    question: "What are common use cases for XML to JSON conversion?",
    answer:
      "Common use cases include consuming legacy SOAP APIs in modern JavaScript applications, migrating XML configuration files to JSON format, processing RSS/Atom feeds (XML) in web applications that prefer JSON, transforming XML data from enterprise systems for use in data pipelines, and converting XML database exports for import into JSON-based document stores like MongoDB or Couchbase.",
  },
  {
    question: "Why does my converted XML include an XML declaration?",
    answer:
      "When converting JSON to XML, Nuvora adds the standard XML declaration (<?xml version=\"1.0\" encoding=\"UTF-8\"?>) at the top of the output. This declaration is required by the XML specification and ensures that parsers correctly interpret the document as UTF-8 encoded XML. You can remove the declaration if your application does not need it, but it is best practice to include it for well-formed XML documents.",
  },
  {
    question: "What are the limitations of browser-based XML to JSON conversion?",
    answer:
      "Browser-based conversion uses the DOMParser API, which enforces strict XML parsing rules. Documents with invalid characters, malformed tags, or incorrect encoding will fail. Very large XML documents (over 10 MB) may cause performance issues or memory limits in the browser. For production-scale conversions, use command-line tools like xmlstarlet or dedicated libraries in your backend language.",
  },
  {
    question: "How does XML to JSON differ from converting XML to CSV or YAML?",
    answer:
      "XML to JSON preserves the full hierarchical structure of the original document, including nested elements, attributes, and mixed content. CSV can only represent flat, tabular data and loses all hierarchy. YAML is more human-readable than JSON but less universally supported across programming languages. JSON strikes the best balance of readability, universality, and structural fidelity for most data interchange needs.",
  },
];

export default function XmlToJsonPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="XML to JSON Converter"
            description="Convert XML to JSON or JSON to XML instantly. Parse complex XML documents and transform them into clean JSON objects, or generate valid XML from your JSON data."
            breadcrumbs={breadcrumbs}
          >
            <XmlToJsonConverter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            XML vs JSON: Choosing the Right Format for Your Data
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              XML and JSON represent two different philosophies of data representation. XML emerged from the document management world, where attributes, namespaces, schemas, and mixed content are essential for defining complex document structures. JSON came from the programming language world, where simplicity and direct mapping to language data structures are paramount. XML uses a verbose tag-based syntax that can represent both data and metadata simultaneously, while JSON uses a concise key-value syntax that is immediately familiar to anyone who has worked with JavaScript objects or Python dictionaries.
            </p>
            <p>
              The practical difference appears in how each format handles common scenarios. XML can encode an element with both text content and attributes: &lt;message priority=&quot;high&quot;&gt;Server is down&lt;/message&gt;. JSON would represent the same data as a nested object. XML supports comments and processing instructions; JSON does not. XML has a built-in schema language (XSD) for validation; JSON uses the separate JSON Schema standard. Understanding these differences helps you choose the right format for your specific use case. For structuring and beautifying JSON output after conversion, the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> provides syntax highlighting and validation features.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Practical Applications for XML and JSON Interchange
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Many real-world systems need to bridge the XML and JSON worlds. A common scenario is integrating with enterprise SOAP web services that return XML responses, while your frontend application expects JSON. The conversion layer can live on the server (using a gateway or middleware) or on the client (using this tool for testing and debugging). Another frequent use case is migrating legacy XML configuration files to modern JSON-based tools. Continuous integration pipelines often process XML reports (JUnit, NUnit) and need to convert them to JSON for ingestion by analytics dashboards.
            </p>
            <p>
              In data engineering, ETL pipelines frequently ingest XML data from government sources, financial systems, or healthcare APIs and transform it to JSON for storage in data lakes or processing with Spark. The hierarchical nature of XML maps naturally to JSON&apos;s nested structure, making conversion straightforward for well-formed documents. When your JSON data needs to be transmitted as part of a URL or query parameter, the <Link href="/url-encoder" className="text-blue-600 hover:underline dark:text-blue-400">URL Encoder</Link> ensures special characters are properly percent-encoded for safe transport.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About XML to JSON Conversion" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📋", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data with syntax highlighting", href: "/json-formatter" },
              { icon: "🔗", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
              { icon: "🔐", title: "Base64 Encoder", description: "Encode and decode Base64 strings for data transport", href: "/base64-encoder" },
              { icon: "🪙", title: "JWT Decoder", description: "Decode and inspect JSON Web Token headers and payloads", href: "/jwt-decoder" },
            ]}
            title="Related Data Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="xml-to-json" />
    </>
  );
}
