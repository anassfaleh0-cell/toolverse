import type { Metadata } from "next";
import { SplitPdf } from "@/components/pdf-suite/split-pdf";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "split-pdf";
const tool = getToolBySlug(slug)!;
const pageTitle = "Split PDF - Separate PDF Pages Online Free";
const pageDescription = "Split a PDF into individual pages or page ranges. Extract specific pages, split by every N pages, and download as separate files. Free online PDF splitter.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How do I split a PDF into separate pages?", answer: "Upload your PDF, choose a split mode (all pages, page ranges, or every N pages). Click Split and download your files. If you choose All Pages, each page becomes its own PDF. If you choose Every N Pages, the tool groups pages into sets of N." },
  { question: "Can I split a PDF by custom page ranges?", answer: "Yes. Select the Page Ranges mode and enter ranges like 1-3,5,7-9. Each range becomes a separate PDF. Single page numbers are also supported." },
  { question: "Does splitting a PDF affect quality?", answer: "No. The split operation copies page content without re-encoding, preserving the original quality of text, images, and vector elements." },
  { question: "What is every N pages splitting?", answer: "This mode divides the PDF into chunks of N consecutive pages. For example, with N=3, pages 1-3 become one file, 4-6 another, and so on. Useful for breaking large documents into manageable sections." },
  { question: "How are multiple split files delivered?", answer: "When the split produces more than one file, they are packaged into a ZIP archive for convenient download. A single-file split downloads directly as a PDF." },
  { question: "Are my files uploaded to a server?", answer: "No. All PDF splitting happens entirely in your browser using pdf-lib. Your files never leave your device." },
];


export default function SplitPdfPage() {
  const breadcrumbs = generateToolBreadcrumbs(tool);
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <SplitPdf />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">How to Split a PDF</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Splitting a PDF lets you break a large document into smaller, more manageable pieces. Choose a split mode that fits your needs: extract every page individually for granular access, define custom page ranges to extract specific sections, or split by every N pages for uniform chunks. The tool processes your PDF client-side, ensuring your documents stay private.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Why Split a PDF?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Sharing an entire large PDF can be impractical. Splitting allows you to send only relevant sections, reduce email attachment sizes, and organize documents by chapter or topic. It is essential for extracting specific pages from contracts, reports, scanned books, and multi-page forms where you only need a subset of the content.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Split Modes Explained</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">All Pages mode creates one PDF per page, ideal for extracting every page individually. Page Ranges mode accepts comma-separated ranges (e.g., 1-3,5,7-9) for selective extraction. Every N Pages mode groups pages into fixed-size chunks, perfect for breaking a 100-page document into 10-page sections. Choose the mode that matches your workflow.</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title={`${tool.name} FAQ`} />
        </div>
      </section>

      <section className="border-t border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedContent toolSlug={slug} />
        </div>
      </section>
    </>
  );
}
