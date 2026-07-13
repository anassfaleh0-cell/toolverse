import type { Metadata } from "next";
import { TextJoiner } from "@/components/text-suite/text-joiner";
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

const slug = "text-joiner";
const pageTitle = "Text Joiner - Join Lines With Separator Online Free";
const pageDescription = "Join multiple lines of text with comma, space, pipe, or custom separator. Add quotes around items with optional prefix and suffix. Free online text joiner.";

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
  { label: "Text Joiner" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the text joiner work?",
    answer: "The Text Joiner takes multi-line text (one item per line) and joins all the lines together into a single string with your chosen separator. You can select from preset separators (Comma + space, Space, Pipe) or define a custom separator. Additional options include adding double quotes around each item, adding a prefix string before each item, and adding a suffix string after each item. The result updates in real-time as you type or change options, giving you immediate feedback on how the joined output will look.",
  },
  {
    question: "What separators are available and when should I use each?",
    answer: "Comma + space (&apos;, &apos;) is the most common separator, useful for creating English-language lists, CSV data, and parameter strings. Space (&apos; &apos;) is ideal for creating space-delimited lists or simple concatenation. Pipe (&apos; | &apos;) is common in configuration files, log formats, and data exports where commas might appear within values. Custom separator lets you use any string â€” such as semicolon (;), tab (\\t), or a custom character sequence â€” giving you complete flexibility for application-specific formatting needs.",
  },
  {
    question: "When would I use the Add Quotes option?",
    answer: "Adding quotes around each item is essential for generating CSV-compatible output where values may contain commas, spaces, or special characters. It is also useful for creating SQL INSERT statements where string values need to be quoted, generating JSON string arrays, preparing data for template engines that expect quoted values, creating quoted parameter lists for command-line tools, and formatting data for display in environments where values are visually distinguished by quotation marks. The quotes are standard double quotes (\"item\") ensuring broad compatibility.",
  },
  {
    question: "What are the prefix and suffix options for?",
    answer: "Prefix and suffix allow you to add text before and after each individual item (after quoting if enabled). For example, a prefix of &apos;$&apos; with a suffix of &apos;.00&apos; would turn &apos;50&apos; into &apos;$50.00&apos;. Common uses include: adding currency symbols to numbers, wrapping items in HTML tags (prefix: &apos;<li>&apos;, suffix: &apos;</li>&apos;), creating Markdown list items (prefix: &apos;- &apos;), adding CSS class prefixes, generating formula patterns, and any scenario where each item needs consistent surrounding text. Unlike the separator that goes between items, prefix and suffix are applied to every item individually.",
  },
  {
    question: "How is this different from the Text Splitter?",
    answer: "The Text Joiner and Text Splitter are complementary tools that perform opposite operations. The Text Joiner takes multiple items (one per line) and combines them into a single string with separators. The Text Splitter takes a delimited string and breaks it apart into individual items. Together, they cover the full spectrum of text assembly and disassembly operations. You might use the Splitter to parse incoming data, process the individual items (sort, deduplicate, clean), and then use the Joiner to reassemble them in a different format.",
  },
  {
    question: "Can I join items that already contain commas or special characters?",
    answer: "Yes, but you should choose a separator that does not conflict with characters in your items. If your items contain commas, use Pipe or a custom separator instead of Comma. The Add Quotes option provides additional protection â€” when items are wrapped in quotes, embedded commas and special characters are clearly delimited and less likely to cause confusion in downstream processing. This is the same approach used in standard CSV formatting where quoted fields can safely contain commas and line breaks.",
  },
];

export default function TextJoinerPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Text Joiner"
            description="Join multiple lines with comma, space, pipe, or custom separator. Add quotes, prefix, and suffix to each item. Free and instant."
            breadcrumbs={breadcrumbs}
          >
            <TextJoiner />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Joining Text Data for Different Output Formats
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The ability to join text items into formatted output is essential for data export, report generation, and content assembly. Different output formats require different joining strategies: CSV exports typically use comma separators with possible quoting, SQL queries use comma-separated quoted values, configuration files use specific delimiter conventions, and human-readable output requires natural-language formatting. The Text Joiner&apos;s flexible options let you produce all these formats from the same input data, simply by adjusting the separator, quoting, and prefix/suffix settings. This eliminates the need for separate tools or scripting for each output format.
            </p>
            <p>
              In data pipeline workflows, joining is often the final step after data has been extracted, cleaned, transformed, and analyzed. Starting with a well-structured list of items (one per line), you can sort them with the <Link href="/sort-lines" className="text-blue-600 hover:underline dark:text-blue-400">Sort Lines</Link> tool, deduplicate with the <Link href="/remove-duplicate-lines" className="text-blue-600 hover:underline dark:text-blue-400">Remove Duplicate Lines</Link> tool, clean each item with the <Link href="/text-cleaner" className="text-blue-600 hover:underline dark:text-blue-400">Text Cleaner</Link>, and finally join them into the desired output format. This four-step pipeline covers the most common text data processing workflow from raw input to formatted output.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Practical Applications of Text Joining
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Text joining has numerous practical applications across content creation, data management, and development. Content creators use joining to compile bullet-point lists into comma-separated tag fields for CMS platforms. Developers join array elements into SQL IN clauses, CSS class lists, or HTML attribute strings. Data analysts join cleaned data into CSV rows for export to spreadsheet applications. Marketers join keyword lists into comma-separated strings for ad platform imports. In each case, the joiner transforms human-readable line-by-line data into the compact, machine-readable format required by the target system.
            </p>
            <p>
              The prefix and suffix options extend joining beyond simple concatenation into structured content generation. By adding HTML tags as prefix and suffix, you can generate complete HTML list structures from plain text. By adding Markdown formatting syntax, you can create formatted documents from raw text lines. By adding programming language syntax (array brackets, object wrappers), you can generate code structures from data. This makes the Text Joiner not just a data formatting tool but a lightweight code and content generator. For further text transformations after joining, the <Link href="/find-and-replace" className="text-blue-600 hover:underline dark:text-blue-400">Find and Replace</Link> tool can modify the joined output, and the <Link href="/excerpt-generator" className="text-blue-600 hover:underline dark:text-blue-400">Excerpt Generator</Link> can create summaries of the result.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Text Joining" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Scissors", title: "Text Splitter", description: "Split text by delimiter and output in various formats", href: "/text-splitter" },
              { icon: "TextIcon", title: "Sort Lines", description: "Sort lines alphabetically A-Z or Z-A", href: "/sort-lines" },
              { icon: "FileText", title: "Remove Duplicate Lines", description: "Remove duplicate lines and keep only unique entries", href: "/remove-duplicate-lines" },
              { icon: "Link", title: "Text to Slug Converter", description: "Convert text to URL-friendly slugs", href: "/text-to-slug" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
