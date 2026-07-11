import type { Metadata } from "next";
import { RemoveDuplicateLines } from "@/components/text-suite/remove-duplicate-lines";
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

const slug = "remove-duplicate-lines";
const pageTitle = "Remove Duplicate Lines - Delete Duplicate Text Lines Online Free";
const pageDescription = "Remove duplicate lines from text instantly. Delete repeated lines, keep unique entries, sort results. Free online duplicate line remover.";

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
  { label: "Remove Duplicate Lines" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the duplicate line remover work?",
    answer: "The tool splits your input text into individual lines, then uses a Set data structure to track which lines have already been seen. Each line is compared against the set of previously seen lines â€” if a line already exists in the set, it is filtered out as a duplicate. The remaining unique lines are then joined back together and displayed. You can optionally enable case-sensitive matching (where &apos;Hello&apos; and &apos;hello&apos; are treated as different lines), trim whitespace from each line before comparison, and sort the results alphabetically for a clean, organized output.",
  },
  {
    question: "What is the difference between case-sensitive and case-insensitive deduplication?",
    answer: "With case-insensitive deduplication (default), the tool converts all lines to lowercase before comparing them, so &apos;Hello&apos;, &apos;HELLO&apos;, and &apos;hello&apos; are all treated as duplicates. Only the first occurrence is kept. With case-sensitive deduplication, each line is compared exactly as written â€” &apos;Hello&apos; and &apos;hello&apos; become two separate unique lines. Case-sensitive mode is useful when case carries meaning, such as in code, passwords, or data where capitalization matters for identification.",
  },
  {
    question: "Does the tool preserve the original line order?",
    answer: "By default, the tool preserves the first occurrence of each unique line, maintaining the original order in which unique lines appear. When you enable the &apos;Sort Results&apos; option, the unique lines are sorted alphabetically, which changes the order but makes the output easier to scan. For most data cleaning tasks, keeping the original order is preferred so the meaning and structure of the text is preserved. Sorting is best used when you want to group similar content or prepare data for comparison.",
  },
  {
    question: "How do I handle whitespace variations in duplicate detection?",
    answer: "The &apos;Trim Whitespace&apos; option (enabled by default) removes leading and trailing whitespace from each line before comparison. This prevents lines that differ only by indentation or trailing spaces from being incorrectly treated as unique entries. For example, &apos;hello &apos; and &apos;  hello&apos; would be considered duplicates when trimming is enabled, which is typically the desired behavior. If whitespace within lines matters â€” such as in code or formatted text â€” you can disable the trim option to preserve those differences.",
  },
  {
    question: "Can I use the duplicate line remover for large files?",
    answer: "Yes, the tool processes text entirely in your browser using client-side JavaScript. For very large files with thousands of lines, the deduplication is efficient because it uses a Set for O(n) lookup times. However, extremely large files may cause performance limitations based on your browser&apos;s memory constraints. For files over several megabytes, consider splitting them into smaller batches. No data is ever sent to a server, so your content remains private regardless of file size.",
  },
  {
    question: "What are common use cases for removing duplicate lines?",
    answer: "Common use cases include cleaning up mailing lists and email address collections, deduplicating product SKUs or inventory lists, removing repeated entries from CSV or log files, cleaning up scraped data that contains duplicates, preparing unique keyword lists for SEO analysis, deduplicating survey responses, cleaning up configuration files with repeated entries, and merging multiple lists into a single unique set. The tool is also useful for writers who want to remove repeated ideas or phrases from brainstorming lists.",
  },
];

export default function RemoveDuplicateLinesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Remove Duplicate Lines"
            description="Remove duplicate lines from text instantly. Delete repeated lines, keep unique entries, and optionally sort results. Free and private."
            breadcrumbs={breadcrumbs}
          >
            <RemoveDuplicateLines />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Duplicate Lines Matter in Data Quality
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Duplicate lines in text data are more than just a nuisance â€” they represent a real data quality issue that can skew analysis, inflate counts, and lead to incorrect business decisions. When you import data from multiple sources, merge spreadsheets, or aggregate information from different team members, duplicates inevitably appear. A mailing list with duplicate email addresses means customers receive the same message multiple times. An inventory list with duplicate SKUs leads to overcounting stock. A keyword list with repeated terms dilutes SEO analysis. Removing duplicates is the first step in any data cleaning workflow.
            </p>
            <p>
              Beyond simple deduplication, understanding why duplicates occur helps prevent them in the future. Common causes include copy-paste errors, merging data from multiple sources, automated data collection processes that record the same entry multiple times, and inconsistent data entry conventions. By regularly deduplicating your data, you maintain cleaner datasets that produce more reliable results. For further text processing after deduplication, the <Link href="/sort-lines" className="text-blue-600 hover:underline dark:text-blue-400">Sort Lines</Link> tool can arrange your unique lines alphabetically, and the <Link href="/remove-empty-lines" className="text-blue-600 hover:underline dark:text-blue-400">Remove Empty Lines</Link> tool ensures no blank lines remain in your cleaned data.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Deduplication Strategies for Different Data Types
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Different data types require different deduplication strategies. For email addresses, case-insensitive matching is essential because &apos;User@Example.com&apos; and &apos;user@example.com&apos; refer to the same mailbox. For product codes or SKUs, case-sensitive matching is usually required because &apos;ABC-123&apos; and &apos;abc-123&apos; might represent different products. For log files, timestamps and line content must match exactly for a line to be considered duplicate. For survey responses, you may want to trim whitespace and ignore minor formatting differences before comparing entries. The flexibility of toggle-able options makes this tool suitable for all these scenarios.
            </p>
            <p>
              When working with structured data like CSV exports, consider the context of your duplicates. A row might be unique when considering all columns but appear as a duplicate when looking at a single field. The line-level deduplication approach works best for simple lists and single-column data. For multi-field deduplication, consider using a dedicated data cleaning tool or spreadsheet application. After deduplication, the <Link href="/text-joiner" className="text-blue-600 hover:underline dark:text-blue-400">Text Joiner</Link> tool can help reformat your cleaned data with custom separators, and the <Link href="/line-counter" className="text-blue-600 hover:underline dark:text-blue-400">Line Counter</Link> provides statistics on how many lines were removed.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Automating Deduplication in Your Workflow
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              While this tool provides a quick interactive way to deduplicate text, incorporating deduplication into your automated workflows can save hours of manual cleaning. Command-line tools like sort -u on Unix systems, awk &apos;!seen[$0]++&apos; for one-liner deduplication, and PowerShell&apos;s Sort-Object -Unique for Windows users offer automated alternatives. For data pipelines, deduplication can be built into ETL processes using tools like dbt, Pandas (drop_duplicates()), or SQL (SELECT DISTINCT or ROW_NUMBER() with PARTITION BY).
            </p>
            <p>
              For web applications and content management systems, consider implementing deduplication at the input level using JavaScript Set objects or database-level UNIQUE constraints to prevent duplicates from being stored in the first place. When migrating data between systems, always run a deduplication pass to ensure clean data in the target system. For analyzing patterns in your data before and after cleaning, the <Link href="/word-counter" className="text-blue-600 hover:underline dark:text-blue-400">Word Counter</Link> provides detailed text statistics, and the <Link href="/regex-tester" className="text-blue-600 hover:underline dark:text-blue-400">Regex Tester</Link> helps identify patterns that might indicate systematic duplicate generation.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Removing Duplicate Lines" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔤", title: "Sort Lines", description: "Sort lines alphabetically A-Z or Z-A with various options", href: "/sort-lines" },
              { icon: "📏", title: "Line Counter", description: "Count lines with detailed real-time statistics", href: "/line-counter" },
              { icon: "🧹", title: "Remove Empty Lines", description: "Remove blank and whitespace-only lines from text", href: "/remove-empty-lines" },
              { icon: "🔗", title: "Text Joiner", description: "Join multiple lines with custom separators", href: "/text-joiner" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
