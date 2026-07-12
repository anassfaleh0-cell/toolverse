import type { Metadata } from "next";
import { TextCleaner } from "@/components/text-suite/text-cleaner";
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

const slug = "text-cleaner";
const pageTitle = "Text Cleaner - Clean and Normalize Text Online Free";
const pageDescription = "Clean text with toggles for removing extra spaces, special characters, numbers, HTML tags, URLs, and smart quotes. See live before-and-after preview. Free online text sanitizer.";

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
  { label: "Text Cleaner" },
];

const faqItems: FaqItem[] = [
  {
    question: "What does the text cleaner do?",
    answer: "The Text Cleaner provides seven toggle-able cleaning operations that you can apply individually or together: Collapse extra spaces (reduces multiple consecutive spaces to one), Remove special characters (strips all non-alphanumeric characters except spaces), Remove numbers (deletes all digit characters), Remove HTML tags (strips anything between < and >), Trim leading/trailing whitespace (removes spaces at the start and end of the text), Replace smart quotes (converts curly quotes and apostrophes to straight ones), and Remove URLs (strips http/https links). A live before-and-after preview shows exactly what each combination of options does to your text.",
  },
  {
    question: "When should I replace smart quotes with straight quotes?",
    answer: "Smart quotes (also called curly quotes or typographic quotes) are the curved quotation marks and apostrophes that word processors automatically insert. While they look more polished in printed documents, they can cause problems in digital text: they break JSON and JavaScript string syntax, cause issues in CSV files and databases, can trigger encoding errors in older systems, and may not render correctly in all environments. Replacing them with straight quotes is essential when preparing text for code, data files, web development, or any system that expects standard ASCII quote characters.",
  },
  {
    question: "Why would I remove special characters from text?",
    answer: "Removing special characters is useful when you need clean alphanumeric text for analysis, processing, or display in constrained environments. Special characters include punctuation marks, symbols, mathematical operators, and other non-alphanumeric characters (excluding spaces). This operation is common when: preparing text for machine learning or NLP pipelines that expect clean input, sanitizing user input for database storage, creating clean filenames or identifiers from descriptive text, preparing text for systems with limited character set support, and normalizing text before comparison or deduplication.",
  },
  {
    question: "How does HTML tag removal work?",
    answer: "The HTML removal option strips all content between angle brackets < and >, including opening tags, closing tags, and self-closing tags. This includes standard HTML tags like &lt;div&gt;, &lt;p&gt;, &lt;span&gt;, as well as any other angle-bracket enclosed content. It does not remove HTML entities like &amp; or &nbsp; — those require separate handling. After removing tags, the text content remains but all markup is gone. This is particularly useful when extracting readable text from HTML sources for content analysis, republishing, or text processing. For more specialized HTML work, you might also need the <Link href='/html-entity-encoder' className='text-blue-600 hover:underline dark:text-blue-400'>HTML Entity Encoder</Link> to handle entity conversion.",
  },
  {
    question: "What is the order of cleaning operations?",
    answer: "The cleaning operations are applied in a specific order to ensure consistent results: first HTML tags are removed, then smart quotes are replaced, then URLs are removed, then numbers are removed, then special characters are removed, then extra spaces are collapsed, and finally whitespace is trimmed. This order prevents, for example, removing spaces before collapsing extra spaces would have any effect, or trimming whitespace that is then modified by number removal. The live preview updates in real-time as you toggle options, so you can see exactly how the order affects your specific input.",
  },
  {
    question: "Can I clean text for data analysis or machine learning?",
    answer: "Yes, the Text Cleaner is well-suited for preparing text for data analysis and machine learning pipelines. Text data often contains noise like HTML markup from web scraping, special characters from varied sources, extra whitespace from formatting, and smart quotes from word processing software. Cleaning this noise before feeding text into NLP models, topic classifiers, or text analytics engines significantly improves accuracy. The toggle-based approach lets you apply only the cleaning operations relevant to your specific dataset. For additional preprocessing, consider the <Link href='/remove-empty-lines' className='text-blue-600 hover:underline dark:text-blue-400'>Remove Empty Lines</Link> and <Link href='/remove-duplicate-lines' className='text-blue-600 hover:underline dark:text-blue-400'>Remove Duplicate Lines</Link> tools as complementary steps in your text preprocessing workflow.",
  },
];

export default function TextCleanerPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Text Cleaner"
            description="Clean and normalize text with toggle-able options for extra spaces, special characters, HTML tags, smart quotes, and more. Live before-and-after preview."
            breadcrumbs={breadcrumbs}
          >
            <TextCleaner />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            The Importance of Text Normalization in Data Processing
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Text normalization is the process of transforming text into a canonical form that makes it consistent and comparable. In data science and content management, raw text from diverse sources contains inconsistencies — different quote styles, varying whitespace conventions, embedded markup, and non-standard characters — that interfere with automated processing. Normalization through cleaning operations reduces the variability in text data, allowing algorithms to focus on the semantic content rather than being distracted by formatting artifacts. This is particularly important for search indexing, where normalized text produces better match results, and for machine learning, where clean training data leads to better models.
            </p>
            <p>
              The seven cleaning options in the Text Cleaner represent the most commonly needed normalization operations. Each operation addresses a specific type of text noise: extra spaces from HTML-to-text conversion, special characters from social media or user-generated content, numbers that might be irrelevant for certain analyses, HTML tags from web scraped content, leading/trailing whitespace from extracted text, smart quotes from word processors, and URLs from mixed-content sources. For post-cleaning processing, consider using the <Link href="/word-counter" className="text-blue-600 hover:underline dark:text-blue-400">Word Counter</Link> to verify content metrics, and the <Link href="/find-and-replace" className="text-blue-600 hover:underline dark:text-blue-400">Find and Replace</Link> tool for further targeted modifications.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Cleaning Best Practices for Different Content Types
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Different content types require different cleaning strategies. For web-scraped content, always enable HTML tag removal and smart quote replacement — these two operations handle the most common web formatting artifacts. For user-generated content like comments or reviews, consider removing URLs and special characters to eliminate spam signals and normalize the text. For academic or editorial content, be more conservative — preserve special characters that carry meaning (like em dashes or quotation marks) and only collapse extra spaces and trim whitespace. For code or configuration files, avoid removing special characters and URLs entirely, as they carry functional meaning.
            </p>
            <p>
              The live before-and-after preview is your best tool for developing an appropriate cleaning strategy for each content type. Start with all options disabled, then enable them one by one, observing how each operation affects your specific text. This iterative approach prevents accidentally removing meaningful content. The toggle design makes it easy to experiment with different combinations and develop optimal cleaning profiles for different content sources. After cleaning, the <Link href="/text-splitter" className="text-blue-600 hover:underline dark:text-blue-400">Text Splitter</Link> can help parse structured content, and the <Link href="/excerpt-generator" className="text-blue-600 hover:underline dark:text-blue-400">Excerpt Generator</Link> can create summaries of the cleaned text for metadata or preview purposes.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Text Cleaning" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📏", title: "Remove Empty Lines", description: "Remove blank and whitespace-only lines from text", href: "/remove-empty-lines" },
              { icon: "📋", title: "Remove Duplicate Lines", description: "Remove duplicate lines and keep only unique entries", href: "/remove-duplicate-lines" },
              { icon: "🔍", title: "Find and Replace", description: "Find and replace text with case and regex options", href: "/find-and-replace" },
              { icon: "🔄", title: "Case Converter", description: "Convert text between different letter cases", href: "/case-converter" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
