import type { Metadata } from "next";
import { JsonToCsvConverter } from "@/components/json-to-csv/json-to-csv";
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

const slug = "json-to-csv";
const pageTitle = "JSON to CSV Converter - Convert JSON to CSV & CSV to JSON Online";
const pageDescription =
  "Convert JSON arrays of objects to CSV format with a preview table, or convert CSV data back to JSON. Free online converter with copy and download support.";

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
  { label: "JSON to CSV Converter" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between JSON and CSV formats?",
    answer:
      "JSON (JavaScript Object Notation) is a hierarchical data format that supports nested objects, arrays, and multiple data types including strings, numbers, booleans, and null. CSV (Comma-Separated Values) is a flat tabular format where each line represents a row and commas separate columns. CSV is simpler and universally supported by spreadsheet applications like Excel and Google Sheets, but it cannot represent nested structures or complex data types. JSON is better for APIs and programmatic data interchange, while CSV excels at data analysis and reporting.",
  },
  {
    question: "What kind of JSON structures can be converted to CSV?",
    answer:
      "Only JSON arrays of flat objects can be meaningfully converted to CSV. Each object in the array becomes a row, and the keys become column headers. Nested objects and arrays within individual objects are stringified during conversion. For example, a JSON array of user objects with name, email, and age properties converts cleanly to CSV. Deeply nested JSON or JSON with inconsistent key structures may lose information during conversion.",
  },
  {
    question: "How does the CSV to JSON conversion work?",
    answer:
      "The converter parses the CSV by treating the first line as headers and each subsequent line as a data row. Values containing commas, quotes, or newlines are properly handled using standard CSV quoting rules (double-quote escaping). The output is a JSON array of objects where each object&apos;s keys are the column headers and values are strings. Numbers are not automatically parsed to preserve precision - you can convert types after importing the JSON into your application.",
  },
  {
    question: "Why does my CSV data show incorrect column alignment?",
    answer:
      "Column alignment issues in CSV usually stem from unescaped commas within quoted values, inconsistent quoting, or mismatched header and data column counts. Some CSV exports do not properly quote fields containing commas, causing parsers to split the field into multiple columns. Nuvora follows the RFC 4180 CSV standard and properly handles quoted fields with embedded commas, newlines, and double-quotes to ensure correct data mapping.",
  },
  {
    question: "Can I convert large JSON files to CSV in the browser?",
    answer:
      "Browser-based conversion is limited by available memory. JSON files up to several megabytes work well, but very large files (over 50 MB) may cause performance issues. For production-scale data conversion, consider using command-line tools like jq combined with csvkit, or write a script using your language of choice. Nuvora is ideal for API responses, configuration data, and moderate datasets that need quick conversion.",
  },
  {
    question: "What are common use cases for JSON to CSV conversion?",
    answer:
      "Common use cases include exporting API response data to Excel for analysis by non-technical team members, preparing data for machine learning training pipelines, converting database query results to CSV for import into analytics tools, transforming configuration data into a human-readable table format, and archiving structured data in a universally accessible format. The reverse direction (CSV to JSON) is useful for importing spreadsheet data into web applications and APIs.",
  },
  {
    question: "How does the preview table help with data validation?",
    answer:
      "The preview table displays the converted data in a tabular format that lets you visually inspect rows and columns before downloading. This helps catch issues like missing headers, inconsistent data types, empty cells, and unexpected values. You can verify that the column mapping is correct and that all data has been properly transformed. The row count also confirms that no records were lost during conversion.",
  },
  {
    question: "What is RFC 4180 and why does it matter for CSV?",
    answer:
      "RFC 4180 is the formal specification for CSV format published by the Internet Engineering Task Force. It defines standards for field quoting, escaping, line termination, and header handling. Not all CSV producers and consumers follow this standard, leading to compatibility issues. Nuvora follows RFC 4180 for both reading and writing CSV, ensuring maximum compatibility with spreadsheet applications and data processing tools.",
  },
  {
    question: "Can I convert JSON with nested objects to CSV?",
    answer:
      "JSON with nested objects can be converted by flattening the nested structure, but Nuvora handles this by stringifying nested values as JSON strings within the CSV cells. For proper conversion, you should preprocess your JSON to flatten nested structures before conversion, or use a tool that supports nested path flattening (e.g., converting address.city to a separate column). Flat arrays of flat objects produce the cleanest CSV output.",
  },
  {
    question: "What encoding does the CSV output use?",
    answer:
      "Nuvora outputs CSV as UTF-8 encoded text. UTF-8 supports all Unicode characters, including international characters, emojis, and special symbols. Some older spreadsheet applications on Windows expect CSV in the system&apos;s default encoding (e.g., Windows-1252 or Shift-JIS) and may display UTF-8 characters incorrectly. In such cases, you can open the CSV in a text editor and re-save with the appropriate encoding, or import it into the spreadsheet using the Data Import wizard rather than double-clicking the file.",
  },
];

export default function JsonToCsvPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="JSON to CSV Converter"
            description="Convert JSON arrays of objects to CSV with an interactive preview table, or convert CSV data back to JSON. Supports copy, download, and bidirectional conversion."
            breadcrumbs={breadcrumbs}
          >
            <JsonToCsvConverter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why JSON to CSV Conversion Matters in Data Workflows
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              JSON and CSV serve different but complementary roles in the data ecosystem. JSON is the standard format for APIs, configuration files, and programmatic data exchange because it preserves data types and hierarchical structure. CSV is the universal format for data analysis, reporting, and spreadsheet processing because it is flat, simple, and compatible with every analytics tool from Excel to Pandas to Google Sheets. The ability to convert between these formats is essential for data engineers, analysts, and developers who need to move data between systems.
            </p>
            <p>
              A typical workflow involves fetching JSON data from a REST API, converting it to CSV for analysis in a spreadsheet or data visualization tool, sharing the results with stakeholders, and potentially importing the cleaned data back into a system as JSON. Without a reliable converter, this workflow requires writing custom scripts for each transformation. Nuvora eliminates that overhead with a browser-based converter that handles both directions. For validating the JSON before conversion, use the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> to check for syntax errors and structure inconsistencies.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Use JSON vs CSV for Data Storage and Exchange
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Choose JSON when you need to represent complex data structures with nested objects, arrays, and mixed data types. JSON is the best choice for API responses, configuration files, document databases, and any scenario where the data schema may evolve over time. JSON&apos;s flexibility allows adding new fields without breaking existing consumers, making it ideal for systems where the producer and consumer are developed independently.
            </p>
            <p>
              Choose CSV when the data is tabular, the schema is stable, and the consumers are data analysts, business intelligence tools, or legacy systems. CSV files are human-readable in any text editor, can be opened directly in Excel without import procedures, and are the standard input format for machine learning libraries. CSV also produces smaller files than JSON for equivalent tabular data because it omits repeated key names. For encoding binary data that might appear in your JSON payloads, the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> helps prepare data for embedding in JSON structures before conversion.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Converting Between CSV and Other Data Formats
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              While JSON and CSV are the two most common data interchange formats, modern workflows often involve multiple formats. YAML is frequently used for configuration files because it supports comments and is more human-readable than JSON. XML remains important in enterprise systems and document markup. TSV (Tab-Separated Values) is an alternative to CSV that avoids comma-escaping issues. Understanding how to move data between these formats is a core skill for data professionals.
            </p>
            <p>
              Nuvora&apos;s bidirectional JSON↔CSV converter complements the YAML↔JSON converter to cover the most common format conversion scenarios. For deeply nested JSON data that needs to be flattened before conversion to CSV, preprocessing with the JSON Formatter helps you understand the structure and plan the flattening strategy. The <Link href="/yaml-to-json" className="text-blue-600 hover:underline dark:text-blue-400">YAML to JSON Converter</Link> extends your data transformation toolkit to cover configuration file formats commonly used in DevOps and application development.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About JSON to CSV Conversion" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "FileText", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
              { icon: "LockKeyhole", title: "Base64 Encoder", description: "Encode and decode Base64 strings for data URIs and JWT payloads", href: "/base64-encoder" },
              { icon: "File", title: "YAML to JSON Converter", description: "Convert between YAML and JSON formats", href: "/yaml-to-json" },
              { icon: "TextIcon", title: "HTML Entity Encoder", description: "Encode HTML special characters to prevent XSS and rendering issues", href: "/html-entity-encoder" },
            ]}
            title="Related Data Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="json-to-csv" />
    </>
  );
}
