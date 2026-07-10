import type { Metadata } from "next";
import { YamlToJsonConverter } from "@/components/yaml-to-json/yaml-to-json";
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

const slug = "yaml-to-json";
const pageTitle = "YAML to JSON Converter - Convert YAML to JSON & JSON to YAML Online";
const pageDescription =
  "Convert between YAML and JSON formats instantly. Write YAML configuration and get formatted JSON, or paste JSON and get clean YAML output.";

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
  { label: "YAML to JSON Converter" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between YAML and JSON?",
    answer:
      "YAML (YAML Ain&apos;t Markup Language) is a human-readable data serialization format that uses indentation-based structure, supports comments, and has a cleaner syntax than JSON. JSON is a stricter format that requires double-quoted keys and strings, uses braces and brackets for structure, and does not support comments. YAML is preferred for configuration files because it is easier for humans to read and write, while JSON is the standard for API communication and data interchange between systems.",
  },
  {
    question: "Why would I need to convert between YAML and JSON?",
    answer:
      "Common scenarios include migrating configuration files from YAML to JSON for systems that only support JSON, importing YAML configuration data into a JavaScript application that expects JSON, converting API responses (JSON) to YAML for documentation or configuration examples, and cross-referencing data between tools that use different formats. The ability to convert bidirectionally ensures you can work with data regardless of the target format requirements.",
  },
  {
    question: "Does YAML support all JSON data types?",
    answer:
      "Yes. YAML is a superset of JSON, meaning any valid JSON document is also valid YAML. YAML supports strings, numbers, booleans, null, arrays, and objects (dictionaries in YAML terminology). YAML also supports additional types like timestamps and special numeric formats that JSON does not natively support. When converting YAML to JSON, these extended types are serialized to their JSON-compatible string representations.",
  },
  {
    question: "Can YAML files be parsed as JSON?",
    answer:
      "Yes. Because YAML is a superset of JSON, any valid JSON file can be parsed by a YAML parser. However, the reverse is not true: YAML files with features like comments, anchors, aliases, multi-line strings, and custom data types cannot be parsed by a JSON parser. Nuvora handles these conversions by using the js-yaml library, which properly converts YAML-specific features to their JSON equivalents.",
  },
  {
    question: "What are YAML anchors and aliases?",
    answer:
      "YAML anchors (&) and aliases (*) let you define a value once and reference it multiple times throughout the document. For example, you can define a default database configuration with an anchor and reuse it across multiple environments. When converting to JSON, the anchor-aliased structure is expanded inline, meaning the converted JSON contains the full duplicated values. This is why the conversion is one-way for documents that use anchors.",
  },
  {
    question: "What happens to YAML comments during conversion?",
    answer:
      "YAML comments (lines starting with #) are lost during conversion to JSON because the JSON specification does not support comments. This is a fundamental limitation of the JSON format. If you need to preserve comments, consider using JSONC (JSON with Comments) supported by VS Code and some other editors, or keep the original YAML file as the source of truth and generate JSON from it as part of your build process.",
  },
  {
    question: "How does the JSON to YAML conversion handle nested objects?",
    answer:
      "Deeply nested JSON objects are converted to YAML using consistent indentation, typically two spaces per nesting level. Arrays are represented as YAML list items with dashes. Nested objects within arrays use additional indentation levels. The js-yaml library formats the output to be maximally readable while maintaining the structural integrity of the original data. Very deep nesting (beyond 5-6 levels) may produce less readable YAML.",
  },
  {
    question: "What are common YAML formatting pitfalls?",
    answer:
      "The most common YAML pitfalls include mixing tabs and spaces for indentation (YAML requires spaces), inconsistent indentation levels, misunderstanding string quoting rules (some values like yes, no, true, false are interpreted as booleans), and incorrect multi-line string syntax. Always validate your YAML before converting to JSON, and use the error messages from the converter to identify and fix syntax issues.",
  },
  {
    question: "Is YAML only used for configuration files?",
    answer:
      "While YAML is most commonly associated with configuration files for Kubernetes, Docker Compose, Ansible, GitHub Actions, and CI/CD pipelines, it is also used for data serialization, documentation metadata (frontmatter in static site generators), API specifications (OpenAPI/Swagger), database migrations, and test fixture data. Its readability makes it a good choice for any scenario where humans need to create or review structured data.",
  },
  {
    question: "Which is better for API responses: YAML or JSON?",
    answer:
      "JSON is better for API responses because it is more compact, faster to parse, and universally supported by all programming languages and HTTP libraries. YAML is slower to parse and produces larger payloads due to verbose indentation. However, YAML is better for API documentation and specification files (like OpenAPI specs) because humans read and edit them more frequently than the actual API responses travel over the wire.",
  },
];

export default function YamlToJsonPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="YAML to JSON Converter"
            description="Convert between YAML and JSON formats instantly. Perfect for configuration files, API data, and cross-format data exchange."
            breadcrumbs={breadcrumbs}
          >
            <YamlToJsonConverter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why YAML Has Become the Standard for Configuration Files
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              YAML has emerged as the dominant format for configuration files in modern DevOps and application development because it prioritizes human readability. Unlike JSON with its braces, brackets, and mandatory double quotes, YAML uses indentation to represent structure, making it feel more like a natural document than a data serialization format. Tools like Kubernetes, Docker Compose, Ansible, GitHub Actions, and CircleCI all use YAML for their configuration files, cementing its place in the developer toolchain.
            </p>
            <p>
              The readability advantage of YAML is significant for configuration files that are frequently edited by humans. Comments let you document why particular values are set, which is critical for infrastructure-as-code where the reasoning behind configuration choices matters as much as the values themselves. Multi-line strings are handled naturally without escaping, and the ability to use anchors and aliases reduces duplication in complex configurations. When you need to convert these YAML configurations to JSON for consumption by tools that require it, Nuvora makes the transformation seamless. For validating the converted JSON output, use the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> to ensure structural correctness.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Choose YAML Over JSON for Your Next Project
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Choose YAML when the primary consumers of your data files are humans who need to read, write, and review them regularly. Configuration files, pipeline definitions, deployment manifests, and documentation metadata are all excellent use cases for YAML. The ability to add comments is the single most compelling reason to choose YAML for configuration. A well-commented YAML file serves as both configuration and documentation, reducing the need for separate setup guides.
            </p>
            <p>
              Choose JSON when your data is being transmitted over a network, processed by automated systems, or consumed by JavaScript applications. JSON&apos;s stricter syntax makes it faster to parse and less error-prone in automated pipelines. JSON also produces smaller payloads than equivalent YAML because it omits whitespace indentation. For data that serves both human and machine consumers, maintain the source in YAML and generate JSON as part of your build process. The <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> helps handle binary data that may be embedded in either format during conversion.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            YAML in DevOps and CI/CD Pipelines
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              YAML is the backbone of modern CI/CD and infrastructure-as-code. GitHub Actions workflows are defined in .yml files in the .github/workflows directory. GitLab CI uses .gitlab-ci.yml. CircleCI uses .circleci/config.yml. Docker Compose uses docker-compose.yml. Kubernetes uses YAML for every resource definition from Pods to Deployments to Services. Understanding YAML is no longer optional for developers working in cloud-native environments.
            </p>
            <p>
              When migrating between CI/CD platforms or converting infrastructure definitions between tools, you often need to translate YAML configuration into JSON or vice versa. Nuvora&apos;s bidirectional converter handles this translation while preserving data integrity. For debugging complex pipeline configurations, convert your YAML to JSON and use the JSON Formatter to inspect the parsed structure. The <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> helps normalize property names if your target platform uses a different naming convention than your source files.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About YAML and JSON Conversion" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📋", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
              { icon: "🔐", title: "Base64 Encoder", description: "Encode and decode Base64 strings for data URIs and JWT payloads", href: "/base64-encoder" },
              { icon: "🔤", title: "HTML Entity Encoder", description: "Encode HTML special characters to prevent XSS and rendering issues", href: "/html-entity-encoder" },
              { icon: "🔡", title: "Case Converter", description: "Convert text between uppercase, lowercase, camelCase, and more", href: "/case-converter" },
            ]}
            title="Related Data Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="yaml-to-json" />
    </>
  );
}
