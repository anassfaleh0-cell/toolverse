import type { Metadata } from "next";
import { JsonPathSearch } from "@/components/json-path-search/json-path-search";
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

const slug = "json-path-search";
const pageTitle = "JSONPath Search - Query JSON Data with JSONPath Expressions Online";
const pageDescription =
  "Search and query JSON data using JSONPath expressions. Extract specific values, filter arrays, and navigate nested JSON structures. Free online JSONPath tester for developers.";

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
  { label: "JSONPath Search" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is JSONPath and how does it compare to XPath?",
    answer:
      "JSONPath is a query language for JSON data, analogous to XPath for XML. It uses a compact syntax to navigate and extract elements from JSON structures. The root is represented by $, child access uses dot notation (.key) or bracket notation (['key']), and wildcards use [*]. Unlike XPath, JSONPath does not support complex axes, namespaces, or functions, but it is simpler and maps directly to JSON&apos;s nested object/array structure. JSONPath is implemented in most programming languages through libraries like jsonpath-plus (JavaScript), jsonpath (Python), and Jayway JsonPath (Java).",
  },
  {
    question: "What is the difference between $, @, and * in JSONPath expressions?",
    answer:
      "$ represents the root object of the JSON document. Every absolute JSONPath expression starts with $. @ represents the current node being processed, typically used inside filter expressions like ?(@.price > 10). * is a wildcard that selects all elements at the current level. For objects, [*] returns all property values. For arrays, [*] returns all elements. Combining them enables powerful queries like $.store.book[*].author, which returns all author names from every book in the store array.",
  },
  {
    question: "How do JSONPath filter expressions work?",
    answer:
      "Filter expressions use the syntax ?(@.property operator value) to select elements that match a condition. Supported operators include == (equals), != (not equals), < (less than), > (greater than), <= (less than or equal), and >= (greater than or equal). For example, $.store.book[?(@.price < 10)] returns all books priced under 10. Filters can be combined by nesting paths, and string comparisons use single or double quotes around the value. Filter expressions work on both object properties and array elements.",
  },
  {
    question: "What happens when a JSONPath expression matches multiple results?",
    answer:
      "JSONPath always returns an array of matching results, even if only one or zero results match. For example, $.store.book[*].author returns an array of all author names. If there are three books, you get three authors. If the path matches nothing, an empty array is returned. This consistent behavior makes JSONPath expressions predictable and easy to handle in code — you always iterate over an array and check its length.",
  },
  {
    question: "What are the most common JSONPath expressions used in practice?",
    answer:
      "The most frequently used JSONPath expressions include: $.key — access a root property; $.obj.key — access nested properties; $.arr[*] — list all array elements; $.arr[0] — access a specific array index; $.arr[*].prop — extract a property from all array elements; $..prop — deep search for a property at any depth (recursive descent); $.arr[?(@.prop > val)] — filter array elements; and $.arr[0,1,2] — access multiple array indices. These cover the vast majority of real-world JSON querying needs.",
  },
  {
    question: "How does recursive descent ($..) differ from regular child access?",
    answer:
      "The recursive descent operator (..) searches for matching property names at any depth in the JSON tree, not just direct children. For example, $.store..price returns all price values found anywhere under store, regardless of nesting level. This is useful when you need to find all instances of a property without knowing its exact location in the hierarchy. The trade-off is that recursive descent is less efficient than explicit path notation on large documents and may return unexpected matches from nested structures.",
  },
  {
    question: "Can JSONPath handle deeply nested JSON documents?",
    answer:
      "Yes, JSONPath can navigate JSON documents of any depth. The expression syntax is recursive, so $.a.b.c.d.e[0].name is valid as long as the structure exists. However, very deep paths are brittle and break if the structure changes. For production queries against deeply nested documents, consider using the recursive descent operator ($..) or breaking complex queries into smaller, independent expressions. Browser-based JSONPath tools work well for documents up to several megabytes in size.",
  },
  {
    question: "What are the limitations of browser-based JSONPath querying?",
    answer:
      "Browser-based implementations parse the entire JSON document in memory, so extremely large documents (over 50 MB) may cause performance issues. Some advanced JSONPath features like script expressions or custom functions may not be supported in lightweight browser implementations. If you need to query very large JSON datasets or use advanced JSONPath features, consider using a dedicated command-line tool like jq with its own query syntax, or a backend library that supports streaming JSONPath evaluation.",
  },
  {
    question: "How does JSONPath differ from JavaScript bracket notation?",
    answer:
      "JSONPath and JavaScript bracket notation look similar but serve different purposes. JavaScript bracket notation (obj['key']) accesses a property value directly in the programming language. JSONPath ($.key or $['key']) is a string expression that is parsed and evaluated by a query engine to extract data from a JSON document. JSONPath supports features like wildcards, recursive descent, and filters that JavaScript bracket notation does not. Additionally, JSONPath always returns an array of results, while JavaScript returns a single value or undefined.",
  },
  {
    question: "What are some practical use cases for JSONPath in development?",
    answer:
      "JSONPath is invaluable for API testing and integration. You can validate API responses by extracting specific fields with path expressions, verify that array responses contain expected elements using filter expressions, and assert that deeply nested values match expected types. JSONPath is also used in CI/CD pipelines for extracting values from JSON configuration files, in data transformation workflows for selecting subsets of large JSON payloads, and in debugging tools for inspecting complex JSON structures without writing custom parsing code.",
  },
];

export default function JsonPathSearchPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="JSONPath Search"
            description="Query and extract data from JSON documents using JSONPath expressions. Navigate nested structures, filter arrays, and find specific values instantly."
            breadcrumbs={breadcrumbs}
          >
            <JsonPathSearch />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why JSONPath Is Essential for Modern API Development
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Modern applications consume deeply nested JSON from REST APIs, GraphQL endpoints, configuration files, and event streams. Manually traversing these structures with nested loops and conditionals is error-prone and time-consuming. JSONPath provides a declarative way to extract exactly the data you need with a single, readable expression. It is particularly valuable in test automation, where you need to assert that specific values exist at specific paths in API responses, or in data pipelines, where you need to extract and transform fields from complex JSON payloads.
            </p>
            <p>
              JSONPath is also the foundation for more advanced JSON processing tools. JSON Schema uses similar path notation for referencing subschemas. OpenAPI specifications use JSONPath-like expressions for examples and documentation. Many NoSQL databases support JSONPath-like queries for document retrieval. Mastering JSONPath gives you a transferable skill that applies across languages, databases, and API frameworks. For validating and beautifying your JSON data before writing JSONPath queries, the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> helps ensure your input is syntactically correct.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            JSONPath vs jq: Choosing the Right JSON Query Tool
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              While JSONPath and jq both query JSON, they differ significantly in expressiveness and use cases. JSONPath is focused on selection — extracting elements that match a path pattern. It is simpler to learn and read, making it ideal for API testing and documentation. jq is a full stream-oriented JSON processor with its own DSL that supports filtering, mapping, grouping, arithmetic, and custom functions. jq is better suited for complex data transformations in shell scripts and CI/CD pipelines, while JSONPath is more approachable for ad-hoc querying and debugging.
            </p>
            <p>
              In practice, many developers use both. JSONPath for quick exploration and validation in tools like this one, and jq for scripted processing of large JSON files. The JSONPath expressions you develop and test with this tool can be directly applied in your code using libraries like jsonpath-plus (JavaScript) or jsonpath-ng (Python). For encoding and transporting the extracted data, the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> helps prepare JSON payloads for use in data URIs or JWT tokens.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About JSONPath Search" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📋", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data with syntax highlighting", href: "/json-formatter" },
              { icon: "🔄", title: "XML to JSON Converter", description: "Convert XML to JSON and JSON to XML for cross-format queries", href: "/xml-to-json" },
              { icon: "🔗", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
              { icon: "🪙", title: "JWT Decoder", description: "Decode and inspect JSON Web Token headers and payloads", href: "/jwt-decoder" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="json-path-search" />
    </>
  );
}
