import type { Metadata } from "next";
import { TextDiffChecker } from "@/components/text-diff-checker/text-diff-checker";
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

const slug = "text-diff-checker";
const pageTitle = "Text Diff Checker - Compare Text Differences Online";
const pageDescription =
  "Compare two texts and find differences with our free online diff checker. Visual line-by-line comparison with added, removed, and unchanged text highlighted in color.";

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
  { label: "Text Diff Checker" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the diff checker algorithm work?",
    answer:
      "The diff checker uses a longest common subsequence (LCS) algorithm to compute the optimal difference between two texts. It compares both texts line by line, identifying lines that are common to both (unchanged), lines that exist only in the modified text (added), and lines that exist only in the original text (removed). The LCS approach guarantees the most intuitive diff by finding the maximum number of matching lines in order, which produces the smallest and most readable set of changes. This is the same algorithmic foundation used by Git, diff tools, and version control systems.",
  },
  {
    question: "What is the difference between unified diff and side-by-side diff?",
    answer:
      "A unified diff shows all changes in a single view with prefixes indicating additions (+) and removals (-), making it compact and easy to scan. A side-by-side diff shows original and modified versions in adjacent columns, which can be easier to understand for complex changes because you see both versions in full context. This tool uses a merged view that combines elements of both approaches: all lines appear in a single scrollable list with clear color coding and line number tracking for each version, providing the benefits of both formats.",
  },
  {
    question: "Can I use this diff checker for code comparison?",
    answer:
      "Yes, the text diff checker works well for comparing source code files, configuration files, and any text-based content. The line-by-line comparison is particularly effective for code because developers naturally organize code as discrete lines. For code reviews, the diff helps identify which lines were added, removed, or modified between versions. Note that the current implementation compares lines literally and does not perform semantic code analysis — it will highlight an entire line as changed even if only a single character differs, which is standard for line-based diffs.",
  },
  {
    question: "What types of content can I compare with this tool?",
    answer:
      "You can compare any text-based content including: source code, configuration files, JSON or XML documents, articles and essays, CSV data, log files, CSS stylesheets, HTML markup, markdown documents, and plain text files. The tool preserves whitespace and handles large documents efficiently. For structured data formats like JSON, the diff shows structural changes at the line level. If you need to validate JSON structure before comparing, use the <Link href='/json-formatter' className='text-blue-600 hover:underline dark:text-blue-400'>JSON Formatter</Link> to ensure both versions are properly formatted.",
  },
  {
    question: "Is my text uploaded to any server during comparison?",
    answer:
      "No. The diff checker runs entirely in your browser using client-side JavaScript. Both the original and modified texts remain on your device throughout the entire comparison process. No data is transmitted to ToolVerse servers, stored in databases, or logged. This makes the tool safe for comparing sensitive content including proprietary code, confidential documents, legal contracts, and unpublished drafts. You can verify this by disconnecting from the internet after loading the page — the tool will continue to work normally.",
  },
  {
    question: "How should I interpret the diff results?",
    answer:
      "The diff results display all lines from both texts in a single view. Lines highlighted in green with a + prefix are additions that appear only in the modified text. Lines highlighted in red with a - prefix are removals that appear only in the original text. Unhighlighted lines with no prefix are unchanged and appear in both versions. Line numbers on the left show the position in the original text (for unchanged and removed lines) or the modified text (for added lines). The summary bar at the top shows the count of each change type for quick assessment.",
  },
  {
    question: "What is a longest common subsequence in text comparison?",
    answer:
      "The longest common subsequence (LCS) is the longest sequence of lines that appears in both texts in the same relative order, though not necessarily consecutively. Finding the LCS is the key to computing a minimal diff: once you identify which lines are common to both texts, everything else must be either an insertion or deletion. The LCS approach produces diffs that align with how humans naturally perceive changes because it preserves the maximum amount of matching content. This is mathematically optimal but computationally O(n*m), which is efficient for most practical document sizes.",
  },
  {
    question: "Can I compare texts of different lengths?",
    answer:
      "Yes, the diff checker handles texts of any length difference efficiently. If one text is significantly longer, the extra lines will appear as additions (if the modified text is longer) or removals (if the original text is longer). The algorithm correctly handles line shifts caused by insertions or deletions earlier in the document, ensuring that matching lines are aligned even when surrounding content has changed. This makes it suitable for comparing document revisions where substantial portions of text have been added, removed, or reorganized.",
  },
  {
    question: "How is this different from using Git diff?",
    answer:
      "Git diff provides similar functionality but is designed for version-controlled repositories and operates within the Git command line or GUI tools. This web-based diff checker offers advantages for ad-hoc comparisons: no repository setup required, no command-line knowledge needed, works on any device with a browser, and compares any text regardless of whether it is version-controlled. Git diff is more powerful for large codebases with branching histories, while this tool is ideal for quick comparisons of clipboard content, document drafts, configuration snippets, and any text that is not part of a Git repository.",
  },
  {
    question: "Can I use the diff checker for plagiarism detection?",
    answer:
      "The diff checker can help identify verbatim similarities between two texts by showing which lines are identical. However, it is not a dedicated plagiarism detection tool. The line-by-line comparison only finds exact line matches — it does not detect paraphrased content, restructured sentences, or synonym substitution. For thorough plagiarism checking, use specialized services that employ fuzzy matching, semantic analysis, and large database cross-referencing. The diff checker is best suited for verifying that two versions of a document have the intended changes and for reviewing edits made to a single document.",
  },
];

export default function TextDiffCheckerPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Text Diff Checker"
            description="Compare two texts and instantly see the differences. Added, removed, and unchanged lines are clearly color-coded for easy review. Perfect for code reviews, document revisions, and content audits."
            breadcrumbs={breadcrumbs}
          >
            <TextDiffChecker />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Text Comparison Is Essential in Collaborative Workflows
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Collaborative writing and development workflows generate multiple versions of documents, code, and configuration files. Tracking changes between versions is essential for reviewing contributions, identifying regressions, and maintaining quality control. While version control systems like Git handle code changes at scale, there are countless scenarios where a quick web-based diff is more practical: comparing two drafts of a contract, verifying that copy edits were applied correctly, reviewing configuration changes before deployment, or checking that a text transformation produced the expected output.
            </p>
            <p>
              The diff checker fills the gap between heavyweight version control tools and manual comparison. It requires no setup, no installation, and no technical knowledge beyond pasting text. This makes it valuable for non-technical team members — editors, writers, project managers — who need to review changes without learning Git or other version control systems. For developers who work with structured data formats, the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> complements the diff checker by ensuring JSON documents are consistently formatted before comparison, eliminating spurious diffs caused by formatting differences rather than content changes.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding Line-Based Diff Algorithms
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Line-based diff algorithms operate by dividing both texts into lines and finding the optimal alignment between the two sequences. The longest common subsequence (LCS) approach guarantees that the diff output shows the maximum possible number of matching lines, producing a minimal edit script. This is computationally equivalent to solving a dynamic programming problem on a 2D grid where each cell represents the state of comparing one line from each text. The result is a mathematically optimal set of insertions and deletions that transform the original text into the modified text.
            </p>
            <p>
              While line-based diffing is standard for most text comparison, it has limitations. Whole-line comparison means that if even one character in a line differs, the entire line is marked as a removal and addition. For detecting finer-grained changes within lines, word-level or character-level diffing would be needed. For code review purposes, line-based diffing is appropriate because changes typically affect entire logical lines. When you need to normalize text casing before comparison to reduce spurious diffs, the <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> helps standardize capitalization across both versions.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Text Diff Checking" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📋", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
              { icon: "🔡", title: "Case Converter", description: "Convert text between camelCase, snake_case, kebab-case, and more", href: "/case-converter" },
              { icon: "🔍", title: "Regex Tester", description: "Test regular expressions with live matching and capture groups", href: "/regex-tester" },
              { icon: "🔗", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="text-diff-checker" />
    </>
  );
}
