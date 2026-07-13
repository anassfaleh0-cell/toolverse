import type { Metadata } from "next";
import { LineCounter } from "@/components/text-suite/line-counter";
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

const slug = "line-counter";
const pageTitle = "Line Counter - Count Lines With Statistics Online Free";
const pageDescription = "Count lines in text with detailed real-time statistics including total lines, non-empty lines, empty lines, unique lines, and average line length. Free online line counter.";

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
  { label: "Line Counter" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the line counter calculate statistics?",
    answer: "The line counter splits your text by newline characters and computes eight metrics in real-time: Total Lines (total number of lines including empty ones), Non-Empty Lines (lines containing at least one non-whitespace character), Empty Lines (lines with no characters or only whitespace), Unique Lines (number of distinct trimmed lines), Total Characters (total character count across all lines), Average Line Length (total characters divided by non-empty lines), Maximum Line Length (character count of the longest line), and Minimum Line Length (character count of the shortest non-empty line). All statistics update automatically as you type.",
  },
  {
    question: "What is the difference between total lines and non-empty lines?",
    answer: "Total lines counts every single line created by newline characters, including blank lines, lines with only spaces, and the final line if it ends with a newline. Non-empty lines count only lines that contain visible content — characters that are not whitespace. The difference between these two numbers tells you how much of your text is structural whitespace versus actual content. A large gap suggests excessive blank lines that may need cleaning, while a small gap indicates dense, well-formatted text.",
  },
  {
    question: "How is average line length calculated?",
    answer: "Average line length is calculated by dividing the total number of characters across all lines by the number of non-empty lines. This gives a more meaningful average than including empty lines (which would artificially lower the average). The result is rounded to one decimal place. For English prose, the average line length typically ranges from 40-80 characters. Code files average 30-60 characters. Very long average lengths may indicate lines that should be broken for readability, while very short averages might suggest staccato or fragmented writing.",
  },
  {
    question: "What does the unique lines count tell me?",
    answer: "Unique lines counts the number of distinct trimmed lines in your text. A high unique count relative to total lines means most lines are different from each other, which is typical for prose, code, or diverse data. A low unique count suggests many repeated lines, which might indicate duplicate data entries, repeated boilerplate text, or template-like content. The unique count is useful for assessing data diversity and identifying potential deduplication needs.",
  },
  {
    question: "How can I use line count data in my workflow?",
    answer: "Line count data is valuable in many contexts: writers checking manuscript length against submission guidelines (count non-empty lines), developers estimating code file size, data analysts assessing data set row counts, content managers evaluating document density, SEO professionals ensuring meta description line counts, and editors checking for formatting issues. The real-time nature of the counter makes it especially useful during active editing, as you can see how structural changes affect your line statistics immediately.",
  },
  {
    question: "Is the line counter suitable for very large files?",
    answer: "Yes, the Line Counter uses efficient JavaScript operations that handle thousands of lines without performance issues. The statistics are computed using useMemo, which means they only recalculate when the input text changes. For extremely large files (100,000+ lines), there might be a brief calculation pause, but the tool remains responsive because the computations are simple arithmetic operations. All processing happens client-side — no file data is uploaded to any server, making it safe for sensitive content.",
  },
];

export default function LineCounterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Line Counter"
            description="Count lines and analyze text structure with real-time statistics. See total lines, non-empty lines, unique lines, line lengths, and more. Free and instant."
            breadcrumbs={breadcrumbs}
          >
            <LineCounter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Line-Level Statistics Matter for Content Analysis
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              While word and character counts are commonly used metrics, line-level statistics reveal a different dimension of text structure. Line count tells you about the visual density of content — how often the reader encounters line breaks, how much white space exists, and whether the text is organized into digestible chunks. In web content, line density affects readability and user engagement. Short lines are easier to scan on mobile devices, while long lines work better on desktop screens. The relationship between line count and word count tells you the average line length, which is an important usability metric for content design.
            </p>
            <p>
              Line statistics are particularly valuable in code review and data analysis contexts. In programming, lines of code (LOC) is a classic productivity and complexity metric. The ratio of empty to non-empty lines in code indicates commenting and documentation practices. In data files, each line typically represents a record — counting lines tells you your data set size, and comparing total to unique lines reveals data quality issues. For a complete text analysis toolkit, combine the Line Counter with the <Link href="/word-counter" className="text-blue-600 hover:underline dark:text-blue-400">Word Counter</Link> for comprehensive content metrics, and the <Link href="/remove-empty-lines" className="text-blue-600 hover:underline dark:text-blue-400">Remove Empty Lines</Link> tool to clean structural whitespace before analysis.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Using Line Statistics for Quality Assurance
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Line statistics serve as a quality assurance tool for text content. The ratio of empty-to-total lines can reveal formatting problems: too many empty lines suggests excessive whitespace that will create awkward gaps in published content, while too few empty lines suggests dense text blocks that are hard to scan. The unique lines count helps identify potential duplication issues before they affect content quality. The minimum and maximum line lengths help detect outliers — an extremely long line might indicate a missing line break, while a very short maximum line length might suggest the content was formatted for a specific display width that may not transfer well.
            </p>
            <p>
              In team content workflows, line statistics provide objective metrics for editing guidelines. You can establish target ranges for average line length, maximum line length, and empty line ratio based on your publication platform and audience. Automated checking using these metrics can catch formatting issues before content goes live. For deeper text analysis and transformation after reviewing your line statistics, the <Link href="/text-splitter" className="text-blue-600 hover:underline dark:text-blue-400">Text Splitter</Link> can parse structured content by delimiters, and the <Link href="/find-and-replace" className="text-blue-600 hover:underline dark:text-blue-400">Find and Replace</Link> tool can make targeted corrections based on your quality findings.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Line Counting" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "PenTool", title: "Word Counter", description: "Count words, characters, sentences, and reading time", href: "/word-counter" },
              { icon: "Sparkles", title: "Remove Empty Lines", description: "Remove blank and whitespace-only lines from text", href: "/remove-empty-lines" },
              { icon: "FileText", title: "Remove Duplicate Lines", description: "Remove duplicate lines and keep only unique entries", href: "/remove-duplicate-lines" },
              { icon: "TextIcon", title: "Sort Lines", description: "Sort lines alphabetically A-Z or Z-A", href: "/sort-lines" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
