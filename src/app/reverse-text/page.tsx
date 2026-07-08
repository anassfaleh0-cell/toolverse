import type { Metadata } from "next";
import { ReverseText } from "@/components/text-suite/reverse-text";
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

const slug = "reverse-text";
const pageTitle = "Reverse Text - Reverse Characters, Words, or Lines Online Free";
const pageDescription = "Reverse text at character, word, or line level. Flip entire strings backwards, reverse word order in sentences, or invert line sequences. Free online text reverser.";

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
  { label: "Reverse Text" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does character-level text reversal work?",
    answer: "Character-level reversal takes every character in the input string and reverses their order. The last character becomes first, the second-to-last becomes second, and so on. This includes all characters: letters, numbers, spaces, punctuation, and special characters. For example, &apos;Hello World&apos; becomes &apos;dlroW olleH&apos;. Character reversal works on the string as a whole, so multi-line text will have each line&apos;s characters reversed but the line order will change because newline characters are also reversed. This is useful for creating puzzles, testing palindromes, or simply experimenting with text transformations.",
  },
  {
    question: "What is word-level reversal and when would I use it?",
    answer: "Word-level reversal splits the text into individual words (by whitespace) and reverses their order while keeping each word&apos;s characters intact. For example, &apos;Hello World from ToolVerse&apos; becomes &apos;ToolVerse from World Hello&apos;. This is different from character reversal because words remain readable but their sequence changes. Word reversal is useful for rearranging sentence structures, creating stylistic effects in writing, analyzing how word order affects meaning, and preparing text for certain types of word games or cryptography puzzles.",
  },
  {
    question: "How does line-level reversal differ from other modes?",
    answer: "Line-level reversal splits the text by newline characters and reverses the order of entire lines. For example, three lines &apos;First&apos;, &apos;Second&apos;, &apos;Third&apos; become &apos;Third&apos;, &apos;Second&apos;, &apos;First&apos;. This preserves the content of each line intact while completely reversing their sequence. Line reversal is useful for reversing chronological logs to show the most recent entries first, reversing the order of steps in a list, preparing data for comparison tools, or any scenario where you need to invert the sequence of multi-line content without modifying the individual lines.",
  },
  {
    question: "Can I reverse Unicode text with emoji or special characters?",
    answer: "The text reverser handles Unicode characters including emoji, accented letters, and special symbols. Character reversal uses JavaScript&apos;s spread operator or Array.from() which correctly handles Unicode code points including surrogate pairs. However, some emoji sequences (like skin tone modifiers or flag sequences) that consist of multiple code points may not visually reverse correctly because the component code points get separated. For most standard text including multilingual content, the reversal works correctly and preserves the integrity of multi-byte characters.",
  },
  {
    question: "What are creative and practical uses for text reversal?",
    answer: "Text reversal has both creative and practical applications. Creatively, it is used in writing ambigrams, creating palindromes, generating text-based art and typography experiments, coding secret messages, and producing stylistic effects in poetry or social media posts. Practically, line reversal helps display log files with most recent entries first, reverses ordered lists for countdowns, prepares text for specialized data processing, tests symmetry in document structures, and helps with certain debugging tasks where understanding the reverse flow of operations is helpful.",
  },
  {
    question: "Does reversal preserve whitespace and formatting?",
    answer: "Character-level reversal preserves all characters including spaces, tabs, and newlines â€” they are simply moved to their reversed positions. Word-level reversal collapses multiple spaces and leading/trailing whitespace words are treated as individual items. Line-level reversal preserves each line exactly as written but reverses their sequence. For maximum formatting preservation, use line-level reversal, which keeps each line&apos;s internal formatting completely unchanged while only altering the sequence of lines.",
  },
];

export default function ReverseTextPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Reverse Text"
            description="Reverse text at the character, word, or line level. Flip strings, rearrange sentences, or invert line orders. Instant and private."
            breadcrumbs={breadcrumbs}
          >
            <ReverseText />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding Text Reversal and Its Applications
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Text reversal is a fundamental string manipulation technique with surprisingly broad applications. At its core, reversal is about changing the linear sequence of elements â€” whether those elements are characters, words, or lines. This simple transformation can reveal patterns that are invisible in the original ordering. In cryptography, reversing text is one of the oldest and simplest enciphering techniques, often used as part of more complex ciphers. In linguistics, studying reversed text and speech has contributed to understanding how the brain processes language and sequential information.
            </p>
            <p>
              In data processing, reversal is particularly useful for working with chronological data. Log files typically append new entries at the end, so reversing by line shows the most recent entries first. Similarly, reversing word order in sentences can help with language learning and translation exercises by breaking habitual reading patterns. When combined with other text transformations, reversal becomes a powerful tool in your text processing toolkit. After reversing text for analysis or presentation, the <Link href="/sort-lines" className="text-blue-600 hover:underline dark:text-blue-400">Sort Lines</Link> tool can organize the results, and the <Link href="/word-counter" className="text-blue-600 hover:underline dark:text-blue-400">Word Counter</Link> can analyze the reversed output&apos;s statistics.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Text Reversal in Programming and Development
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              In programming, string reversal is a classic algorithm problem that appears in technical interviews, coding challenges, and algorithm courses. Understanding how to reverse a string efficiently â€” using built-in methods, loops, recursion, or two-pointer techniques â€” demonstrates mastery of fundamental programming concepts. In JavaScript, reversing characters is as simple as str.split(&apos;&apos;).reverse().join(&apos;&apos;), but understanding what happens at each step reveals important concepts about immutability, array methods, and Unicode handling. Word and line reversal extend these concepts with additional splitting and joining logic.
            </p>
            <p>
              Beyond interviews, text reversal has practical applications in code development. Reversing lines can help debug stack traces or error logs where the most recent error is at the bottom. Reversing words can help analyze sentence structure in natural language processing tasks. For security testing, reversing parts of payloads can sometimes bypass simplistic input filters. When working with data that needs both reversal and other transformations, the <Link href="/text-cleaner" className="text-blue-600 hover:underline dark:text-blue-400">Text Cleaner</Link> can normalize the content first, and the <Link href="/find-and-replace" className="text-blue-600 hover:underline dark:text-blue-400">Find and Replace</Link> tool can make additional modifications to the reversed output.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Text Reversal" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "ðŸ“‹", title: "Remove Duplicate Lines", description: "Remove duplicate lines and keep only unique entries", href: "/remove-duplicate-lines" },
              { icon: "ðŸ”¤", title: "Sort Lines", description: "Sort lines alphabetically A-Z or Z-A", href: "/sort-lines" },
              { icon: "ðŸ§¹", title: "Remove Empty Lines", description: "Remove blank and whitespace-only lines from text", href: "/remove-empty-lines" },
              { icon: "ðŸ”„", title: "Case Converter", description: "Convert text between different letter cases", href: "/case-converter" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
