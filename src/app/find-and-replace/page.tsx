import type { Metadata } from "next";
import { FindAndReplace } from "@/components/text-suite/find-and-replace";
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

const slug = "find-and-replace";
const pageTitle = "Find and Replace - Search and Replace Text Online Free";
const pageDescription = "Find and replace text instantly with case-sensitive, whole word, and regex options. See how many replacements were made. Free online search and replace tool.";

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
  { label: "Find and Replace" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the find and replace tool work?",
    answer: "The tool takes your input text and searches for occurrences of the &apos;Find&apos; string, then replaces them with the &apos;Replace with&apos; string. The replacement is computed in real-time and displayed live as you type or change options. You can enable Case Sensitive mode (matches capitalization exactly), Whole Word mode (only matches complete words, not partial matches within other words), and Regex Mode (allows regular expression patterns for advanced searching). The tool automatically counts the number of replacements made and displays the result text with a copy button for easy export.",
  },
  {
    question: "What is the difference between normal and regex mode?",
    answer: "In normal mode, the tool searches for the literal text you enter â€” it treats the &apos;Find&apos; field as plain text to match exactly (after escaping special regex characters automatically). In Regex mode, the &apos;Find&apos; field is treated as a regular expression pattern, allowing for powerful pattern matching. For example, in normal mode searching for &apos;\\d+&apos; would look for the literal characters backslash, d, plus. In regex mode, &apos;\\d+&apos; matches one or more digits. Regex mode is more powerful but requires knowledge of regular expression syntax. It also enables the use of capture groups and backreferences in the replacement string.",
  },
  {
    question: "How does whole word matching work?",
    answer: "Whole word matching ensures that the search pattern only matches complete words, not words that contain the search string as a substring. For example, searching for &apos;cat&apos; with whole word enabled matches &apos;cat&apos; in &apos;The cat sat&apos; but not &apos;cat&apos; in &apos;catalog&apos; or &apos;concatenate&apos;. The tool uses word boundary anchors (\\\\b in regex) around your search term to ensure it only matches at word boundaries. This is useful for replacing specific terms without accidentally modifying related words, which is particularly important when editing code or technical documentation where partial matches could break functionality.",
  },
  {
    question: "Can I undo a find and replace operation?",
    answer: "Since the tool updates the result in real-time, there is no undo history built in. However, your original input text is always preserved in the input textarea, so you can copy it back or modify it freely. The tool provides a live preview showing the result of the replacement, so you can verify the changes before using them. We recommend copying the result to your clipboard and only replacing the original text after confirming the output looks correct. For critical documents, always keep a backup of the original text before performing replacements.",
  },
  {
    question: "What happens if my regex pattern has an error?",
    answer: "If a regex pattern has a syntax error (e.g., unclosed parentheses, invalid escape sequences), the tool gracefully handles it by returning the original text without modification and showing zero replacements. The tool catches regex exceptions silently, so you won&apos;t see an error message â€” just the unchanged input and a count of 0. This means you can experiment with regex patterns without worrying about crashes or error dialogs. If your regex doesn&apos;t seem to be matching, double-check the pattern syntax and try testing it in the <Link href=&apos;/regex-tester&apos; className=&apos;text-blue-600 hover:underline dark:text-blue-400&apos;>Regex Tester</Link> tool first for detailed debugging.",
  },
  {
    question: "How accurate is the replacement count?",
    answer: "The replacement count shows the total number of non-overlapping matches found in your input text. Each match is counted once, and overlapping matches are not double-counted. The count updates in real-time as you modify the find string, replacement string, or toggle options. This gives you immediate feedback on the scope of changes before you commit to them. A zero count means the find string was not found in the input â€” check for spelling, case sensitivity, or special characters that might need escaping.",
  },
];

export default function FindAndReplacePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Find and Replace"
            description="Find and replace text instantly with case-sensitive, whole word, and regex options. Live preview shows replacements in real-time. Free and private."
            breadcrumbs={breadcrumbs}
          >
            <FindAndReplace />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            The Power of Find and Replace in Text Processing
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Find and replace is one of the most fundamental and powerful text processing operations. Beyond simple word substitution, it enables bulk text transformations that would be tedious and error-prone to perform manually. In content creation, find and replace allows you to update terminology across an entire document, correct systematic spelling errors, or reformat text to meet style guide requirements. In data processing, it helps standardize inconsistent data entries, remove or replace unwanted characters, and transform raw data into structured formats. The addition of regex mode elevates find and replace from a simple text tool to a pattern-matching engine capable of sophisticated text transformations.
            </p>
            <p>
              Effective use of find and replace requires understanding the scope of your replacements. A seemingly simple search can match unintended text if options like case sensitivity and whole word matching are not properly configured. For example, replacing &apos;US&apos; with &apos;United States&apos; without whole word matching would turn &apos;MUSIC&apos; into &apos;MUnited StatesIC&apos; and &apos;CAUSE&apos; into &apos;CAUnited StatesE&apos;. The tool&apos;s options give you fine-grained control: case-sensitive matching for precise replacements, whole word matching to avoid partial matches, and regex mode for complex pattern-based transformations. For cleaning text before performing replacements, consider the <Link href="/text-cleaner" className="text-blue-600 hover:underline dark:text-blue-400">Text Cleaner</Link> to normalize whitespace and special characters first.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Advanced Find and Replace with Regular Expressions
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Regular expressions transform find and replace from a simple text tool into a powerful text processing engine. With regex, you can match patterns rather than fixed strings â€” find all email addresses, phone numbers, or URLs in a document and replace them in a single operation. You can use capture groups to rearrange text: for example, the pattern &apos;(\\w+), (\\w+)&apos; with replacement &apos;$2 $1&apos; swaps last-name-first to first-name-last. You can normalize whitespace by matching &apos;\\s+&apos; and replacing with a single space. Regex patterns can be complex, but they enable transformations that would be impossible with plain text matching.
            </p>
            <p>
              When working with regex in find and replace, test your patterns on a small sample before applying them broadly. Edge cases like empty strings, special characters, and Unicode content can produce unexpected results. The real-time preview makes it easy to verify your regex is working correctly â€” the result updates as you type, so you can see immediately if your pattern matches too much, too little, or not at all. For developing and debugging complex regex patterns before using them in find and replace, the <Link href="/regex-tester" className="text-blue-600 hover:underline dark:text-blue-400">Regex Tester</Link> provides detailed match information including capture groups and match positions. The <Link href="/text-splitter" className="text-blue-600 hover:underline dark:text-blue-400">Text Splitter</Link> can also help break down complex text into manageable segments for targeted replacements.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Find and Replace" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "\uD83D\uDD0D", title: "Regex Tester", description: "Test regular expressions with live matching and capture groups", href: "/regex-tester" },
              { icon: "\uD83E\uDDF9", title: "Text Cleaner", description: "Clean text with extra spaces, special chars, and HTML tags", href: "/text-cleaner" },
              { icon: "\uD83D\uDD04", title: "Case Converter", description: "Convert text between different letter cases", href: "/case-converter" },
              { icon: "\uD83D\uDD17", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
