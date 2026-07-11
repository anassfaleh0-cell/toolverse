import type { Metadata } from "next";
import { ExcerptGenerator } from "@/components/text-suite/excerpt-generator";
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

const slug = "excerpt-generator";
const pageTitle = "Excerpt Generator - Create Text Excerpts By Word or Character Count";
const pageDescription = "Generate text excerpts and summaries by word or character count. Add ellipsis, break at sentence boundaries, see original vs excerpt length. Free online excerpt generator.";

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
  { label: "Excerpt Generator" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the excerpt generator work?",
    answer: "The Excerpt Generator takes your input text and truncates it to a specified length using either word count or character count mode. In word count mode, it splits the text by whitespace and selects the specified number of words. In character count mode, it truncates to the specified number of characters. You can enable &apos;Add Ellipsis&apos; to append &apos;...&apos; when the text is truncated, and &apos;Break at Sentence&apos; to extend the truncation to the nearest sentence boundary for more natural excerpts. A comparison shows the original text length versus the excerpt length.",
  },
  {
    question: "What is the difference between word and character limits?",
    answer: "Word limits (e.g., 50 words) produce excerpts that are natural for reading and are commonly used for blog post summaries, meta descriptions, and preview text. Character limits (e.g., 160 characters) are used for constrained space environments like SMS messages, social media posts, URL preview snippets, and fixed-length database fields. Word-based truncation is more readable because it preserves whole words, while character-based truncation gives precise control over the exact output length. Choose word limits for human-readable excerpts and character limits for technical constraints.",
  },
  {
    question: "How does the Break at Sentence option work?",
    answer: "When Break at Sentence is enabled, the excerpt generator extends the truncation to the end of the nearest sentence if the truncation point falls beyond the midpoint of the text. This prevents excerpts from ending mid-sentence, which can be confusing for readers. The tool looks for sentence-ending punctuation (periods, exclamation marks, question marks) near the truncation point and adjusts the cutoff to the nearest sentence boundary. This produces more natural, readable excerpts even when the exact word or character limit slightly exceeds the specified value.",
  },
  {
    question: "Should I add an ellipsis to my excerpts?",
    answer: "Adding an ellipsis (&apos;...&apos;) at the end of truncated text is a standard convention that signals to readers that the text continues beyond what is shown. It is particularly important for: meta descriptions in search results (helps users know there is more content), blog post excerpts and previews (encourages clicking through), truncated article summaries, and any context where the excerpt may be displayed alongside a &apos;read more&apos; link. The ellipsis is automatically appended only when the text has actually been truncated â€” if the excerpt covers the entire original text, no ellipsis is added.",
  },
  {
    question: "What is the ideal excerpt length for SEO meta descriptions?",
    answer: "For SEO meta descriptions, the optimal length is typically 150-160 characters, though Google&apos;s displayed snippet length can vary based on device and context. Within this character range, you should include your target keyword, a compelling value proposition, and a call to action. The Excerpt Generator&apos;s character limit mode makes it easy to craft meta descriptions that fit within these constraints. Start with the full description, set the character limit to 155, enable Break at Sentence for natural breaks, and enable Add Ellipsis for standard formatting.",
  },
  {
    question: "Can I generate excerpts for multiple articles or content pieces?",
    answer: "The Excerpt Generator processes one text at a time for focused editing. For batch processing, you would need to run each article through the tool individually. The real-time feedback makes this efficient â€” paste the text, set your preferred limit and options, generate the excerpt, copy it, and move to the next piece. For a more automated approach, consider using the tool to establish your preferred settings and parameters, then apply similar logic in your content management system or static site generator. The <Link href=&apos;/word-counter&apos; className=&apos;text-blue-600 hover:underline dark:text-blue-400&apos;>Word Counter</Link> can help you analyze original content length before generating excerpts.",
  },
];

export default function ExcerptGeneratorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Excerpt Generator"
            description="Generate clean excerpts and truncated text by word or character count. Add ellipsis, break at sentence boundaries, and compare lengths. Free and instant."
            breadcrumbs={breadcrumbs}
          >
            <ExcerptGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            The Art and Science of Writing Effective Excerpts
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              An excerpt is more than just truncated text â€” it is a carefully crafted preview that must convey the essence of the full content while enticing readers to engage further. The best excerpts are complete thoughts that stand alone, accurately representing the main content without misleading the reader. They focus on the most compelling elements: the problem addressed, the solution offered, the key insight, or the surprising finding. Every word in an excerpt earns its place â€” there is no room for filler, weak verbs, or redundant phrases. The Excerpt Generator helps you experiment with different lengths and boundaries to find the optimal balance between completeness and concision.
            </p>
            <p>
              The length of your excerpt should match its context and purpose. Search engine meta descriptions should be 150-160 characters to avoid truncation in search results. Social media previews vary by platform (Twitter: 70-100 characters for headlines, Facebook: 150-200 characters for descriptions). Blog index pages typically show 30-50 word excerpts. Email newsletter preview text (preheader) should be 50-100 characters. RSS feed summaries commonly use 200-500 characters. The Excerpt Generator&apos;s flexible word and character limits make it easy to produce excerpts optimized for each specific platform and use case. For additional text analysis, the <Link href="/word-counter" className="text-blue-600 hover:underline dark:text-blue-400">Word Counter</Link> provides detailed metrics on your original text.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Excerpt Best Practices for Different Platforms
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Each platform has its own conventions for how excerpts are displayed and how they perform. For Google search results, the meta description should include the target keyword near the beginning, a clear value proposition, and end with a call to action â€” all within 155-160 characters. The Break at Sentence option ensures your meta description doesn&apos;t cut off mid-phrase, which looks unprofessional and reduces click-through rates. For social media, platform-specific best practices apply: Twitter/X posts work best with 70-100 character excerpts that leave room for commentary, while LinkedIn articles benefit from slightly longer 200-300 character excerpts that provide substantive previews.
            </p>
            <p>
              For blog and CMS platforms, excerpt quality directly affects engagement metrics. A well-crafted excerpt increases click-through rates from category pages by 20-40% compared to auto-generated truncations. Best practices include: starting with an active verb or compelling question, avoiding clichÃ©s and generic phrases, including specific numbers or data points when relevant, matching the tone of the full article, and ending at a natural pause point. The Break at Sentence option is particularly valuable here â€” it prevents the jarring experience of an excerpt ending mid-word or mid-phrase. For cleaning source text before generating excerpts, the <Link href="/text-cleaner" className="text-blue-600 hover:underline dark:text-blue-400">Text Cleaner</Link> can remove HTML tags and normalize whitespace, and the <Link href="/find-and-replace" className="text-blue-600 hover:underline dark:text-blue-400">Find and Replace</Link> tool can make targeted improvements to the excerpt text.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Excerpt Generation" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📝", title: "Word Counter", description: "Count words, characters, sentences, and reading time", href: "/word-counter" },
              { icon: "🧹", title: "Text Cleaner", description: "Clean text with extra spaces, special chars, and HTML tags", href: "/text-cleaner" },
              { icon: "🔍", title: "Find and Replace", description: "Find and replace text with case and regex options", href: "/find-and-replace" },
              { icon: "🔗", title: "Text to Slug Converter", description: "Convert text to URL-friendly slugs", href: "/text-to-slug" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
