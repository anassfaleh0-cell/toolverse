import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free AI Tools Online — Text, Image, Code Generation | ToolVerse",
  description:
    "Compare the best free AI tools for text, image, and code generation. We review ChatGPT, Claude AI, Perplexity, Gemini, Copilot, and ToolVerse AI.",
  openGraph: {
    title: "Best Free AI Tools Online — Text, Image, Code Generation | ToolVerse",
    description:
      "Compare the best free AI tools for text, image, and code generation. We review ChatGPT, Claude AI, Perplexity, Gemini, Copilot, and ToolVerse AI.",
    url: `${SITE_URL}/best-online/best-ai-tools`,
  },
  twitter: {
    title: "Best Free AI Tools Online — Text, Image, Code Generation | ToolVerse",
    description:
      "Compare the best free AI tools for text, image, and code generation.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-ai-tools` },
};

const title = "Best Free Online AI Tools";
const description =
  "Compare free AI tools for text generation, image creation, and code assistance. Find the right AI platform for your workflow.";
const canonicalUrl = `${SITE_URL}/best-online/best-ai-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "AI Tools" },
];

const matrixHeaders = ["Feature", "ChatGPT", "Claude AI", "Perplexity", "Gemini", "Copilot", "ToolVerse AI"];
const matrixRows = [
  { feature: "Free Tier Available", values: [true, true, true, true, true, true] },
  { feature: "Text Generation", values: [true, true, true, true, true, true] },
  { feature: "Code Generation", values: [true, true, true, true, true, true] },
  { feature: "Image Generation", values: [true, false, false, true, false, true] },
  { feature: "File Upload Support", values: [true, true, true, true, false, true] },
  { feature: "Web Search (Live)", values: [true, false, true, true, false, true] },
  { feature: "Message Limit (Free)", values: ["50/3h", "20/5h", "5/4h", "60/h", "30/day", "100/day"] },
  { feature: "Context Window", values: ["8K", "100K", "8K", "32K", "2K", "32K"] },
  { feature: "Mobile App", values: [true, true, true, true, true, false] },
  { feature: "API Available", values: [true, true, false, true, true, true] },
  { feature: "Privacy-First", values: [false, false, false, false, false, true] },
  { feature: "Dark Mode", values: [true, true, true, true, true, true] },
];

const faqItems: FaqItem[] = [
  {
    question: "Which free AI tool has the largest context window?",
    answer:
      "Claude AI offers a 100K token context window on its free tier — enough to analyze entire books. ToolVerse AI (coming soon) will offer 32K context with privacy-first processing.",
  },
  {
    question: "What is the best free AI for coding assistance?",
    answer:
      "GitHub Copilot is excellent for in-editor code completion. ChatGPT and Claude AI also excel at code generation and debugging. ToolVerse AI will provide code generation with no account required.",
  },
  {
    question: "Can I use AI tools without creating an account?",
    answer:
      "Most major AI platforms require a free account. ToolVerse AI (coming soon) will offer anonymous usage with privacy-first design — no account or personal data needed.",
  },
];

export default function BestAiToolsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, url: canonicalUrl, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">{title}</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{description}</p>
          <div className="mt-6">
            <SocialShare url={canonicalUrl} title={title} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">AI Tool Comparison</h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Feature Comparison" />
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="AI Tools — Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Related Tool Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/best-online/best-developer-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Developer Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Code formatting, encoding, and testing tools.</p>
          </Link>
          <Link href="/best-online/best-image-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Image Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Compress, resize, and convert images.</p>
          </Link>
          <Link href="/best-online/best-productivity-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Productivity Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Calculators, converters, and generators.</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Try AI-Powered Tools</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Free, no sign-up needed. Coming soon to ToolVerse.</p>
          <Link href="/tools" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Browse Current Tools
          </Link>
        </div>
      </section>
    </>
  );
}
