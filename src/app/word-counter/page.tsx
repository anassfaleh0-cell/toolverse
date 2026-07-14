import type { Metadata } from "next";
import { WordCounter } from "@/components/word-counter/word-counter";
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

const slug = "word-counter";
const pageTitle = "Word Counter - Count Words, Characters, Sentences, and Paragraphs Online";
const pageDescription =
  "Free online word counter with live statistics. Count words, characters (with and without spaces), sentences, paragraphs, and estimated reading time for any text.";

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
  { label: "Word Counter" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the word counter calculate word count?",
    answer:
      "The word counter splits text by whitespace and filters out empty strings to count individual words. This means any sequence of characters separated by spaces, tabs, or newlines is counted as a word. Numbers, abbreviations, and hyphenated compounds (like 'well-known') each count as one word. This is standard word counting behavior consistent with word processors like Microsoft Word and Google Docs. The count updates in real-time as you type, providing immediate feedback on document length without requiring a button click or page reload.",
  },
  {
    question: "What is the difference between characters with and without spaces?",
    answer:
      "Characters with spaces includes every character you type, including spaces, tabs, and newlines. This is useful for understanding the total text volume, which matters for form fields, database column limits, and storage calculations. Characters without spaces removes all whitespace characters, giving you the count of visible text characters only. This metric is commonly used for social media posts, SMS messages, and platforms that charge or limit by character count. The difference between the two numbers also tells you how much of your text is whitespace, which can indicate formatting density.",
  },
  {
    question: "How is reading time estimated?",
    answer:
      "Reading time is estimated using the average adult reading speed of 200-250 words per minute. The word counter uses 200 words per minute as a conservative baseline, which accounts for comprehension time and accounts for technical or dense material. The estimate is rounded to the nearest minute for texts over one minute, and texts under one minute show '< 1 min'. This is the same methodology used by popular reading time estimators on Medium, blog platforms, and content management systems. Actual reading time varies by reader, text complexity, and familiarity with the subject matter.",
  },
  {
    question: "How are sentences and paragraphs counted?",
    answer:
      "Sentences are counted by detecting sentence-ending punctuation marks (periods, exclamation points, question marks) followed by whitespace or end-of-string. This handles standard sentence boundaries but may undercount sentences using unconventional punctuation or sentences within quoted speech. Paragraphs are counted by splitting on double newlines (blank lines between paragraphs). A single paragraph with no blank lines counts as one paragraph. Note that very short paragraphs or single-line paragraphs may be counted differently than in word processors depending on formatting conventions.",
  },
  {
    question: "Is my text saved or transmitted to any server?",
    answer:
      "No. The word counter processes all text entirely in your browser using client-side JavaScript. No data is sent to any server, stored in any database, or transmitted over the network. Your text remains private and is immediately discarded when you close the page or clear the input. This is consistent with Nuvora's privacy-first approach to all tools. You can paste sensitive or confidential content — including draft contracts, unpublished articles, or personal writing — with complete confidence that it never leaves your device.",
  },
  {
    question: "What is a good reading time for blog posts and articles?",
    answer:
      "The optimal reading time depends on your content type and audience. Blog posts typically perform best at 3-7 minutes (600-1400 words), which provides enough depth for substantive content without excessive commitment. News articles average 1-3 minutes. In-depth guides and tutorials can run 10-20 minutes. SEO research suggests that longer content (1500-2500 words) tends to rank better in search results, but user engagement drops significantly for reading times over 10 minutes unless the content is exceptionally valuable. Use the reading time estimate to match your content length to reader expectations.",
  },
  {
    question: "How can I use word count data for SEO optimization?",
    answer:
      "Search engines tend to favor comprehensive content that thoroughly covers a topic. Studies show the average first-page Google result contains 1400-2000 words. However, word count alone does not determine rankings — content quality, relevance, and user engagement metrics matter more. Use the word counter to ensure your content is appropriately scoped: thin content (under 300 words) rarely ranks for competitive terms, while excessively long content (over 5000 words) may have lower completion rates. Aim for the minimum word count needed to fully satisfy the search intent behind your target keywords.",
  },
  {
    question: "What are typical word counts for different types of content?",
    answer:
      "Social media posts: 15-50 words (Twitter 280 chars). Email subject lines: 5-10 words. News articles: 300-800 words. Blog posts: 800-2500 words. Academic essays: 1500-5000 words. White papers: 2500-10000 words. Product descriptions: 50-200 words. Meta descriptions: 15-30 words (optimal for search snippets). Landing page copy: 300-1000 words. Knowing these benchmarks helps you target appropriate lengths for your specific content type and platform requirements.",
  },
  {
    question: "Can I use the word counter for academic writing requirements?",
    answer:
      "Yes, the word counter is suitable for monitoring word counts on essays, research papers, theses, and other academic assignments. However, note that academic word counts sometimes exclude certain elements like the title page, abstract, footnotes, bibliography, or appendices. Check your institution's specific guidelines for what is included in the word count. Many academic style guides (APA, MLA, Chicago) have specific formatting requirements that should be followed alongside word count limits. The character count with spaces is useful for abstract limits, which are often specified in characters rather than words.",
  },
  {
    question: "How accurate is the character count for social media platforms?",
    answer:
      "The character count with spaces closely matches platform counting for Twitter/X, LinkedIn, and most social media platforms that use Unicode code points for counting. Note that some platforms count differently: Twitter counts most Unicode characters as single characters but may count certain emoji sequences as multiple characters. Instagram and Facebook typically count characters similarly to standard text editors. Use the characters with spaces metric as your baseline, but always verify platform-specific behavior with a test post, as URL shortening, mentions, and hashtags may be counted differently by different platforms.",
  },
];

export default function WordCounterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Word Counter"
            description="Get real-time word count, character count, sentence count, paragraph count, and estimated reading time for any text. Free and private — no data leaves your browser."
            introText="Count words, characters, sentences, and paragraphs in any text. Get real-time statistics including reading time and estimated speaking time. Essential for writers and editors."
            breadcrumbs={breadcrumbs}
          >
            <WordCounter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Word Count Matters for Content Creation
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Word count is one of the most important quantitative metrics in content creation, but it is frequently misunderstood. Rather than being a simple constraint, word count serves as a structural tool that helps writers scope their work appropriately for the medium and audience. A 500-word blog post serves a different purpose than a 3000-word guide; each length implies a different level of depth, research, and reader commitment. Professional writers use word count targets to maintain consistent pacing and ensure they allocate appropriate space to each section of their content.
            </p>
            <p>
              Beyond raw word count, the relationship between word count and other metrics provides deeper insight into writing quality. High character-to-word ratios may indicate overly complex vocabulary. Short sentences relative to word count can indicate choppy writing, while very long sentences might suggest run-on constructions. The paragraph count relative to word count reveals whether content has adequate structural breaks for readability. When combined with the <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link>, you can normalize text formatting before analysis to ensure consistent counting across documents with varying capitalization conventions.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Using Word Count Data to Improve Readability
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Readability is not just about vocabulary choice — it is also about text structure. The relationship between sentence count and word count reveals average sentence length, which should typically range between 15-20 words for accessible writing. Technical writing may average 20-25 words per sentence, while children&apos;s content averages 5-10 words. The paragraph count relative to word count indicates text density: academic writing may have 100-200 words per paragraph, while web content performs better with 40-80 words per paragraph, which creates more white space and scanning-friendly layouts.
            </p>
            <p>
              Reading time estimates help content creators match their material to user intent. A user searching for a quick answer expects a reading time under 2 minutes, while someone reading a comprehensive guide expects 5-15 minutes. Use the word counter to verify that your content length matches the search intent for your target keywords. Short-form content that addresses a specific question should be concise, while long-form pillar content should provide thorough coverage. For analyzing and refining your text structure further, the <Link href="/regex-tester" className="text-blue-600 hover:underline dark:text-blue-400">Regex Tester</Link> helps identify complex sentence patterns and passive voice constructions that affect readability scores.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Word Counting" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "CaseSensitive", title: "Case Converter", description: "Convert text between camelCase, snake_case, kebab-case, and more", href: "/case-converter" },
              { icon: "Search", title: "Regex Tester", description: "Test regular expressions with live matching and capture groups", href: "/regex-tester" },
              { icon: "PenTool", title: "Lorem Ipsum Generator", description: "Generate placeholder text for designs and layouts", href: "/lorem-ipsum-generator" },
              { icon: "FileText", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="word-counter" />
    </>
  );
}
