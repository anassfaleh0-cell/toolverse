import type { Metadata } from "next";
import { ListRandomizer } from "@/components/list-randomizer/list-randomizer";
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

const slug = "list-randomizer";
const pageTitle = "List Randomizer - Randomize Any List Online";
const pageDescription =
  "Randomize the order of any list with our free online list randomizer. Enter items, shuffle them with the Fisher-Yates algorithm, and get a fully randomized numbered list. Fast and fair randomization.";

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
  { label: "List Randomizer" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the Fisher-Yates shuffle algorithm work?",
    answer:
      "The Fisher-Yates shuffle (also known as the Knuth shuffle) is the gold standard algorithm for generating unbiased random permutations of a finite sequence. It works by iterating through the list from the last element to the first, swapping each element with a randomly chosen element from the portion of the list that has not yet been processed. This produces every possible permutation with equal probability, assuming the random number generator is unbiased. The algorithm runs in O(n) time and O(1) additional space, making it optimal for shuffling lists of any size. It is the same algorithm used by card shuffling software, lottery drawing systems, and statistical sampling tools.",
  },
  {
    question: "What types of items can I randomize with this tool?",
    answer:
      "You can randomize any text-based items including names, numbers, tasks, quiz questions, team members, prize entries, playlist songs, study topics, gift exchange participants, seating assignments, and any other list of discrete items. Each line or comma-separated value is treated as a single item. The tool preserves the exact text of each item, including special characters, numbers, and formatting. For best results, ensure each item is clearly separated — either one per line or separated by commas within a single line.",
  },
  {
    question: "What is the difference between one-per-line and comma-separated input?",
    answer:
      "One-per-line input treats each line of text as a separate item, which is ideal for longer lists or items containing commas (like addresses). Comma-separated input allows you to enter items on a single line separated by commas, which is faster for simple lists. The tool automatically detects which format you are using: if you enter text with multiple lines, it uses line-based parsing; otherwise, it falls back to comma-separated parsing. Empty lines and trailing commas are ignored. You can also mix formats, though the tool will default to line-based parsing if any line breaks are present.",
  },
  {
    question: "Is the randomization truly random and unbiased?",
    answer:
      "The Fisher-Yates algorithm, when paired with a high-quality pseudo-random number generator like Math.random(), produces an unbiased shuffle where every possible permutation of the input list is equally likely. Math.random() in modern browsers uses algorithms like XorShift128+ that pass standard statistical randomness tests. For applications requiring cryptographically secure randomness (such as lottery drawings or security-critical random selection), the list randomizer should be used with a cryptographically secure RNG. For everyday use cases like team assignments, study order, or drawing winners, Math.random() provides sufficient randomness quality.",
  },
  {
    question: "Can I re-randomize the same list multiple times?",
    answer:
      "Yes, you can click the Randomize button as many times as you like. Each click re-shuffles the original list independently using the Fisher-Yates algorithm, producing a new random permutation each time. The input text remains unchanged between shuffles, so you can generate multiple different random orderings of the same items for comparison. This is useful when you want to run multiple rounds of random selection or explore different possible orderings before committing to one result.",
  },
  {
    question: "What are common use cases for a list randomizer?",
    answer:
      "Common use cases include: randomizing the order of presentation topics or speakers, drawing contest winners from a list of entrants, shuffling study flashcards or quiz questions, randomizing team assignments or seating charts, selecting daily standup order in agile teams, randomizing playlist order for events, conducting A/B test group assignments, shuffling gift exchange participants, randomizing data for statistical sampling, ordering items for blind taste tests, and creating randomized running orders for events or tournaments.",
  },
  {
    question: "How many items can I randomize at once?",
    answer:
      "There is no hard limit on the number of items you can randomize. The Fisher-Yates algorithm operates in linear time O(n) and linear space O(n), so performance is excellent even for lists with thousands of items. For extremely large lists (10,000+ items), the textarea input may become the practical constraint rather than the shuffling algorithm itself. The randomized output is displayed as a numbered list for easy reference, making it practical to work with lists of any size up to what the browser can comfortably handle in a text input.",
  },
  {
    question: "How does this randomizer compare to using a random number generator?",
    answer:
      "Using a list randomizer is significantly more convenient than manually assigning random numbers to items and sorting them. Manual approaches require: assigning a random number to each item, recording those numbers, sorting by the random values, and then reordering the original list — a tedious multi-step process prone to errors and ties. The Fisher-Yates shuffle accomplishes the same result in a single step with guaranteed unbiased distribution. Additionally, the tool displays the results with clear numbering and provides a copy button to easily transfer the randomized list to other applications.",
  },
  {
    question: "Can I randomize a list that contains duplicate items?",
    answer:
      "Yes, the tool treats each input line or comma-separated value as a distinct item, even if multiple items have the same text. Duplicate entries are preserved and shuffled independently. For example, if your list contains 'Apple' twice and you randomize it, both 'Apple' entries will appear in the output at different positions. If you want to avoid duplicates, deduplicate your list before pasting it into the tool. Each occurrence is treated as a separate element, which is appropriate for contexts like raffle tickets where each entry is distinct regardless of the name written on it.",
  },
  {
    question: "Is my list data stored or transmitted during randomization?",
    answer:
      "No. The entire randomization process happens in your browser using client-side JavaScript. Your list items are never sent to any server, stored in any database, or transmitted over the network. This means you can use the list randomizer for sensitive data like contest entries, confidential team assignments, or any other information you want to keep private. Close the page or refresh, and all trace of your data is gone. This is consistent with Nuvora's commitment to user privacy across all tools.",
  },
];

export default function ListRandomizerPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="List Randomizer"
            description="Enter your items and randomize their order instantly. Using the Fisher-Yates shuffle algorithm, every permutation is equally likely. Perfect for drawings, team assignments, study order, and any list that needs fair randomization."
            breadcrumbs={breadcrumbs}
          >
            <ListRandomizer />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            The Mathematics of Fair Randomization
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Not all shuffling methods produce fair results. The naive approach of assigning random numbers to items and sorting produces biased permutations because sorting algorithms handle ties non-randomly and the distribution of random number assignments is not uniform across all permutations. The Fisher-Yates algorithm avoids these pitfalls by ensuring that at each step, the element being placed in position i is chosen uniformly from the remaining unshuffled elements. This guarantees that every permutation of n items has exactly 1/n! probability of being selected — the definition of a perfectly unbiased shuffle.
            </p>
            <p>
              Understanding the mathematics of randomization helps in choosing the right approach for your use case. For simple reordering tasks like shuffling a playlist or randomizing presentation order, the Fisher-Yates shuffle with Math.random() provides perfectly adequate randomness. For applications with legal or financial implications — such as lottery drawings, audited random sampling, or cryptographic key generation — cryptographically secure randomness should be used. The algorithm itself is identical; the difference lies in the quality of the underlying random number source. For creating well-formatted lists before randomization, the <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> helps normalize text formatting across entries.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Practical Applications for List Randomization
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              List randomization has far more applications than most people realize. In education, teachers randomize student presentation orders, quiz question sequences, and study group assignments to ensure fairness and reduce predictability. In project management, daily standup order randomization prevents the same people from speaking first or last every day, promoting more balanced participation. In event planning, randomizing the order of performances, speeches, or award presentations creates a more dynamic experience and avoids the perception of favoritism in scheduling.
            </p>
            <p>
              In research and data analysis, randomization is fundamental to experimental design. Randomizing the order of treatments, survey questions, or A/B test variants eliminates order effects and selection bias. Product teams use list randomization for blind taste tests, usability study task orders, and feature rollout sequences. For content creators, randomizing the order of blog post topics, social media content calendars, or email newsletter items can improve audience engagement by breaking predictable patterns. When you need to analyze patterns in shuffled data, the <Link href="/regex-tester" className="text-blue-600 hover:underline dark:text-blue-400">Regex Tester</Link> helps identify patterns and validate the formatting of items in your randomized lists.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About List Randomization" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔡", title: "Case Converter", description: "Convert text between camelCase, snake_case, kebab-case, and more", href: "/case-converter" },
              { icon: "🔢", title: "Number Base Converter", description: "Convert numbers between binary, octal, decimal, and hexadecimal", href: "/number-base-converter" },
              { icon: "🔍", title: "Regex Tester", description: "Test regular expressions with live matching and capture groups", href: "/regex-tester" },
              { icon: "🔗", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
            ]}
            title="Related Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="list-randomizer" />
    </>
  );
}
