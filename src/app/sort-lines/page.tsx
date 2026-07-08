import type { Metadata } from "next";
import { SortLines } from "@/components/text-suite/sort-lines";
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

const slug = "sort-lines";
const pageTitle = "Sort Lines - Alphabetical Line Sorter A-Z and Z-A Online Free";
const pageDescription = "Sort lines of text alphabetically (A-Z or Z-A) with options for numeric sorting, case-insensitive sorting, and duplicate removal. Free online line sorter.";

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
  { label: "Sort Lines" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the line sorter work?",
    answer: "The line sorter takes your multi-line text and sorts each line using JavaScript&apos;s Array.sort() method. By default, it sorts alphabetically from A to Z using lexicographic comparison, which means each line is compared character by character based on Unicode code point values. You can switch to Z-A for descending order, enable case-insensitive sorting to ignore capitalization differences, activate numeric sort for proper numerical ordering (where 2 comes before 10), deduplicate to remove identical lines during sorting, and reverse the final order for additional flexibility.",
  },
  {
    question: "What is the difference between alphabetical and numeric sorting?",
    answer: "Alphabetical sorting compares lines as strings, character by character. With alphabetical sorting, &apos;10&apos; comes before &apos;2&apos; because the character &apos;1&apos; has a lower Unicode value than &apos;2&apos;. Numeric sorting parses each line as a number and sorts by numerical value, so &apos;2&apos; correctly comes before &apos;10&apos;. Numeric sort is essential for lists of numbers, version numbers, measurements, or any data where the numerical value matters. Lines that cannot be parsed as numbers are treated as 0 in numeric sort mode, so it works best when all lines in your input are numeric.",
  },
  {
    question: "Why should I use case-insensitive sorting?",
    answer: "Case-insensitive sorting treats uppercase and lowercase letters equally when determining order. Without it, all uppercase lines sort before lowercase ones because uppercase letters (A-Z, Unicode 65-90) have lower code point values than lowercase letters (a-z, Unicode 97-122). This means &apos;Apple&apos;, &apos;Banana&apos;, &apos;apple&apos;, &apos;banana&apos; would sort as &apos;Apple&apos;, &apos;Banana&apos;, &apos;apple&apos;, &apos;banana&apos; with case-sensitive sorting, which is often not the intended alphabetical order. With case-insensitive sorting enabled, the result becomes &apos;Apple&apos;, &apos;apple&apos;, &apos;Banana&apos;, &apos;banana&apos; â€” grouping related terms together.",
  },
  {
    question: "Can I sort and deduplicate at the same time?",
    answer: "Yes, the &apos;Remove Duplicates&apos; option can be used alongside sorting. When enabled, the tool removes consecutive or non-consecutive duplicate lines from the sorted output. This is useful for preparing clean reference lists, creating unique keyword collections, or merging multiple lists into a single sorted, unique set. The deduplication happens after sorting, which means it uses the sorted order for comparison. Case-insensitive deduplication can be combined with case-insensitive sorting for maximum flexibility.",
  },
  {
    question: "What are common use cases for sorting lines?",
    answer: "Sorting lines is useful for organizing reference lists like glossaries and indexes, alphabetizing names in directories or contact lists, sorting product or SKU codes for inventory management, arranging log entries by timestamp or category, preparing data for comparison by aligning similar entries, creating sorted keyword lists for SEO and content strategy, organizing configuration file entries alphabetically, sorting to-do lists and brainstorming outputs, and arranging bibliographies and citation lists. Sorting makes large text datasets more scannable and easier to work with.",
  },
  {
    question: "How does the reverse order option work?",
    answer: "The &apos;Reverse Order&apos; option reverses the final sorted output after all other sorting and deduplication operations have been applied. This is different from simply switching between A-Z and Z-A modes. For example, with A-Z sort and numerical values, the order would be [1, 2, 3, 4], and enabling reverse would produce [4, 3, 2, 1]. This is useful when you want the benefits of sorting (grouping, deduplication) but need the items in reverse order for a specific display or export requirement.",
  },
];

export default function SortLinesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Sort Lines"
            description="Sort lines of text alphabetically A-Z or Z-A with numeric sorting, case-insensitive options, and duplicate removal. Free and instant."
            breadcrumbs={breadcrumbs}
          >
            <SortLines />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Sorting Lines Improves Data Usability
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Sorted data is fundamentally more usable than unsorted data. When lines are arranged alphabetically or numerically, patterns emerge, duplicates become obvious, and information can be found much faster. In data analysis, sorting is often the first step in understanding the distribution and range of values. A sorted list immediately shows minimum and maximum values, reveals outliers at the extremes, and makes it easy to spot gaps or inconsistencies. For reference materials like glossaries, indexes, or directories, alphabetical sorting is not just helpful â€” it is expected by readers who need to find specific entries quickly.
            </p>
            <p>
              The choice between ascending and descending order depends on your use case. A-Z sorting is standard for reference lists and directories where users look up specific items. Z-A sorting is useful for recent-first displays, reverse chronological lists, or when you want to highlight the end of the alphabet. For versions, dates formatted as YYYY-MM-DD sort chronologically when sorted alphabetically, making A-Z order the natural chronological order. For building comprehensive word lists or keyword collections, the <Link href="/remove-duplicate-lines" className="text-blue-600 hover:underline dark:text-blue-400">Remove Duplicate Lines</Link> tool can clean your data before sorting, and the <Link href="/text-splitter" className="text-blue-600 hover:underline dark:text-blue-400">Text Splitter</Link> helps prepare input from different formats.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding Sort Algorithms and Performance
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The line sorter uses JavaScript&apos;s built-in Array.sort() algorithm, which in modern browsers implements TimSort â€” a hybrid stable sorting algorithm derived from merge sort and insertion sort. TimSort has O(n log n) time complexity in the average case and O(n) in the best case (already sorted data). Stable sorting means that items with equal sort keys maintain their original relative order, preserving the input sequence for equivalent lines. This is important when you sort by one criterion but want other differences to remain visible in the sorted output.
            </p>
            <p>
              For most text sorting tasks with thousands of lines, the performance is essentially instantaneous in modern browsers. If you are sorting very large files (tens of thousands of lines), the algorithm&apos;s O(n log n) complexity means performance degrades gracefully. The web worker model is not needed because sorting happens synchronously and completes within a single render frame for typical text volumes. For preparing data before sorting, the <Link href="/text-cleaner" className="text-blue-600 hover:underline dark:text-blue-400">Text Cleaner</Link> can normalize whitespace and special characters, ensuring consistent sorting results across varied input formats.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Sorting Lines" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "ðŸ“‹", title: "Remove Duplicate Lines", description: "Remove duplicate lines and keep only unique entries", href: "/remove-duplicate-lines" },
              { icon: "ðŸ§¹", title: "Remove Empty Lines", description: "Remove blank and whitespace-only lines from text", href: "/remove-empty-lines" },
              { icon: "ðŸ“", title: "Line Counter", description: "Count lines with detailed real-time statistics", href: "/line-counter" },
              { icon: "ðŸ”—", title: "Text Joiner", description: "Join multiple lines with custom separators", href: "/text-joiner" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
