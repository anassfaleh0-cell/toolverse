import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free PDF Tools Online — Merge, Split, Compress, Convert | ToolVerse",
  description:
    "Compare the best free online PDF tools. Merge, split, compress, and convert PDFs. We review iLovePDF, SmallPDF, PDF24, Sejda, PDF Candy, and ToolVerse.",
  openGraph: {
    title: "Best Free PDF Tools Online — Merge, Split, Compress, Convert | ToolVerse",
    description:
      "Compare the best free online PDF tools. Merge, split, compress, and convert PDFs. We review iLovePDF, SmallPDF, PDF24, Sejda, PDF Candy, and ToolVerse.",
    url: `${SITE_URL}/best-online/best-pdf-tools`,
  },
  twitter: {
    title: "Best Free PDF Tools Online — Merge, Split, Compress, Convert | ToolVerse",
    description:
      "Compare the best free online PDF tools. Merge, split, compress, and convert PDFs. We review iLovePDF, SmallPDF, PDF24, Sejda, PDF Candy, and ToolVerse.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-pdf-tools` },
};

const title = "Best Free Online PDF Tools";
const description =
  "Find the perfect free online PDF tool for merging, splitting, compressing, and converting PDFs. We compare the top platforms side by side.";
const canonicalUrl = `${SITE_URL}/best-online/best-pdf-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "PDF Tools" },
];

const matrixHeaders = ["Feature", "iLovePDF", "SmallPDF", "PDF24", "Sejda", "PDF Candy", "ToolVerse (soon)"];
const matrixRows = [
  { feature: "Free Tier Available", values: [true, true, true, true, true, true] },
  { feature: "Max File Size (Free)", values: ["10 MB", "5 MB", "50 MB", "50 MB", "100 MB", "25 MB"] },
  { feature: "Daily Limit (Free)", values: ["25/day", "2/day", "Unlimited", "3/day", "Unlimited", "Unlimited"] },
  { feature: "Merge PDFs", values: [true, true, true, true, true, true] },
  { feature: "Split PDFs", values: [true, true, true, true, true, true] },
  { feature: "Compress PDFs", values: [true, true, true, true, true, true] },
  { feature: "PDF to Word", values: [true, true, true, true, true, true] },
  { feature: "PDF to Image", values: [true, true, true, true, true, true] },
  { feature: "Batch Processing", values: [true, false, true, true, true, true] },
  { feature: "No Upload Required", values: [false, false, false, false, false, true] },
  { feature: "Dark Mode", values: ["N/A", "N/A", "N/A", "N/A", "N/A", "Coming"] },
];

const faqItems: FaqItem[] = [
  {
    question: "Which free PDF tool has the highest file size limit?",
    answer:
      "PDF Candy offers up to 100 MB per file on its free tier, followed by PDF24 and Sejda at 50 MB. ToolVerse (coming soon) will support up to 25 MB with no daily limit.",
  },
  {
    question: "Are there completely unlimited free PDF tools?",
    answer:
      "PDF24 and PDF Candy offer unlimited daily processing on their free tiers. Most others, like SmallPDF (2/day) and iLovePDF (25/day), impose daily caps on free usage.",
  },
  {
    question: "Can I edit PDFs online without uploading to a server?",
    answer:
      "Most online PDF tools require file uploads to their servers. ToolVerse (coming soon) will process PDFs entirely client-side — no uploads needed for basic operations like merging and splitting.",
  },
];

export default function BestPdfToolsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, url: canonicalUrl, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{description}</p>
          <div className="mt-6">
            <SocialShare url={canonicalUrl} title={title} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          PDF Tool Comparison
        </h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Feature Comparison" />
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="PDF Tools — Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Related Tool Comparisons
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/best-online/best-image-tools"
            className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Image Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Compress, resize, and convert images online free.</p>
          </Link>
          <Link
            href="/best-online/best-developer-tools"
            className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Developer Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Format, encode, and convert data online.</p>
          </Link>
          <Link
            href="/best-online/best-free-online-tools"
            className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">All Free Online Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Complete directory of free online utilities.</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Need a Free PDF Tool Right Now?
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Try our other free tools while we finish our PDF suite. No sign-up required.
          </p>
          <Link
            href="/tools"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Browse All Free Tools
          </Link>
        </div>
      </section>
    </>
  );
}
