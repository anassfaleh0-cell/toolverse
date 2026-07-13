import type { Metadata } from "next";
import { TextSplitter } from "@/components/text-suite/text-splitter";
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

const slug = "text-splitter";
const pageTitle = "Text Splitter - Split Text by Delimiter Online Free";
const pageDescription = "Split text by newline, comma, space, or custom delimiter. Preview split items, trim, deduplicate, and output as newline-separated, comma-separated, or JSON array. Free online text splitter.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Text & Writing", href: `${SITE_URL}/category/text-writing` },
  { label: "Text Splitter" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the text splitter work?",
    answer: "The Text Splitter divides your input text into separate items based on a chosen delimiter. Available delimiters include Newline (splits on line breaks), Comma (splits on commas), Space (splits on whitespace), and Custom (you define the delimiter). You can trim whitespace from each item, remove empty entries, and deduplicate the results. The output can be formatted as newline-separated, comma-separated, or a JSON array. All processing happens in your browser in real-time as you type or change settings.",
  },
  {
    question: "What delimiters can I use?",
    answer: "The tool offers four delimiter options: Newline splits your text at each line break (\\n), ideal for processing multi-line lists. Comma splits at each comma, perfect for CSV data or comma-separated values. Space splits at any whitespace (spaces, tabs), useful for space-delimited data. Custom lets you enter any string as the delimiter â€” this could be a pipe character (|), a semicolon (;), a tab (\\t), or any other separator your data uses. The Custom option provides maximum flexibility for unusual or application-specific data formats.",
  },
  {
    question: "What output formats are available?",
    answer: "Three output formats are supported. Newline format lists each item on its own line, which is the most readable format for reviewing and editing split items. Comma-Separated format joins items with commas, producing a compact single-line output suitable for database queries, CSV fields, or configuration values. JSON Array format outputs the items as a valid JSON array (e.g., [&apos;item1&apos;, &apos;item2&apos;, &apos;item3&apos;]), which can be directly used in JavaScript or JSON-based applications. Each format is designed for different downstream uses, so choose the one that best fits your workflow.",
  },
  {
    question: "How does the deduplicate option work?",
    answer: "The Deduplicate option removes duplicate items after splitting, ensuring each item appears only once in the output. It uses case-sensitive comparison (so &apos;Apple&apos; and &apos;apple&apos; are treated as different items). Deduplication is useful when processing lists that may contain repeated entries, such as merged keyword lists, email address collections, or aggregated data from multiple sources. Combined with the Trim option, deduplication ensures that items differing only by whitespace are correctly identified as duplicates.",
  },
  {
    question: "What are common use cases for the text splitter?",
    answer: "Common use cases include: parsing CSV data into individual values, splitting multi-line keyword lists for analysis, breaking apart tag or category strings, converting comma-separated configuration values into a list, processing log files by custom delimiters, preparing data for spreadsheet import, extracting items from pipe-delimited exports, converting between different list formats, and splitting user input for validation or processing. The ability to output as JSON array also makes it useful for developers who need to quickly convert text data into JavaScript array format.",
  },
  {
    question: "Can I split text by multiple delimiters at once?",
    answer: "The current version splits by a single delimiter at a time. To split by multiple delimiters, consider using the <Link href=&apos;/regex-tester&apos; className=&apos;text-blue-600 hover:underline dark:text-blue-400&apos;>Regex Tester</Link> with a character class pattern like [;,|] to match semicolons, commas, or pipes simultaneously. Alternatively, you can run the text through the splitter multiple times with different delimiters. If you need to join items after splitting, the <Link href=&apos;/text-joiner&apos; className=&apos;text-blue-600 hover:underline dark:text-blue-400&apos;>Text Joiner</Link> provides complementary functionality for the reverse operation with various separator and formatting options.",
  },
];

export default function TextSplitterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Text Splitter"
            description="Split text by newline, comma, space, or custom delimiter. Trim items, remove empty entries, deduplicate, and output in your preferred format. Free and instant."
            breadcrumbs={breadcrumbs}
          >
            <TextSplitter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Text Splitting is Essential for Data Processing
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Splitting text into component parts is a fundamental data processing operation that underlies many workflows. Whether you are parsing CSV exports from spreadsheets, breaking apart user-generated tag lists, processing API responses, or preparing data for database import, the ability to reliably split text by delimiters is essential. The Text Splitter makes this operation accessible without writing code, with real-time feedback that shows you exactly how your data breaks apart. The item count indicator gives you immediate validation â€” if you expect 100 items but see 95, you know something needs adjustment.
            </p>
            <p>
              The quality of split operations depends heavily on data consistency. Inconsistent delimiter usage, trailing whitespace, and empty entries are common problems that the tool&apos;s options address. The Trim option normalizes whitespace around items, the Remove Empty option filters out blank entries, and the Deduplicate option eliminates repeats. These options transform messy, inconsistent data into clean, structured output. For complementary operations, the <Link href="/text-joiner" className="text-blue-600 hover:underline dark:text-blue-400">Text Joiner</Link> can reassemble items with different separators, and the <Link href="/sort-lines" className="text-blue-600 hover:underline dark:text-blue-400">Sort Lines</Link> tool can organize the split items alphabetically or numerically.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Choosing the Right Output Format for Your Workflow
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The output format you choose determines how easily the split data can be used in downstream applications. Newline-separated output is the most human-readable and is ideal for reviewing split results, pasting into spreadsheet columns, or saving as text files. Comma-separated output produces compact lines that work well in CSV files, SQL IN clauses, and configuration strings. JSON array output is designed for developers â€” it produces valid JSON that can be directly pasted into JavaScript code, API payloads, or JSON configuration files. Each format preserves the options you selected (trimming, deduplication), so you don&apos;t have to re-apply them after output.
            </p>
            <p>
              When processing data for multiple destinations, consider performing the split once with the desired cleaning options (trim, remove empty, deduplicate), then switching the output format to generate different representations of the same clean data. This approach ensures consistency across all downstream uses. For converting between text and JSON formats in broader contexts, the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> provides additional JSON manipulation capabilities, and the <Link href="/find-and-replace" className="text-blue-600 hover:underline dark:text-blue-400">Find and Replace</Link> tool can make further refinements to the split items.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Text Splitting" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Link", title: "Text Joiner", description: "Join multiple lines with custom separators", href: "/text-joiner" },
              { icon: "RefreshCw", title: "Case Converter", description: "Convert text between different letter cases", href: "/case-converter" },
              { icon: "TextIcon", title: "Sort Lines", description: "Sort lines alphabetically A-Z or Z-A", href: "/sort-lines" },
              { icon: "FileText", title: "Remove Duplicate Lines", description: "Remove duplicate lines and keep only unique entries", href: "/remove-duplicate-lines" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
