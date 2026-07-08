import type { Metadata } from "next";
import { MergePdf } from "@/components/pdf-suite/merge-pdf";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "merge-pdf";
const tool = getToolBySlug(slug)!;
const pageTitle = "Merge PDF - Combine PDF Files Online Free";
const pageDescription = "Merge multiple PDF files into one document. Combine PDF pages, reorder them, and download the merged result. Free online PDF merger tool.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How do I merge PDF files?", answer: "Upload up to 10 PDF files by dragging and dropping or clicking the upload area. The files appear in a list where you can remove any you do not need. Click the merge button and the tool combines them into a single PDF document in the order they appear." },
  { question: "Can I merge more than two PDFs at once?", answer: "Yes. You can upload up to 10 PDF files at once and merge them all into a single document. There is no limit on the number of pages from each file." },
  { question: "Does merging PDFs reduce quality?", answer: "No. pdf-lib copies the original page content without re-encoding, so text, images, and vector graphics retain their original quality. The merged file size is approximately the sum of the input files." },
  { question: "Can I reorder pages before merging?", answer: "To reorder pages, use the Reorder PDF tool first, then merge the reordered results. The merger combines files in the order you upload them." },
  { question: "Is there a limit on PDF file size for merging?", answer: "There is no hard limit, but browser memory constraints may affect very large files. Each PDF is loaded entirely in memory, so files over 100 MB may cause performance issues." },
  { question: "Are my PDFs uploaded to a server?", answer: "No. All PDF merging happens entirely in your browser using pdf-lib. Your files never leave your device." },
];


export default function MergePdfPage() {
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
            <MergePdf />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">How to Merge PDF Files</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Merging PDFs is a common task when you need to combine multiple documents into one cohesive file. Whether you are compiling receipts, combining report chapters, or aggregating scanned documents, this tool streamlines the process. Upload your files in any order, remove duplicates, and merge with a single click. The entire operation runs client-side so your documents remain private.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Why Merge PDFs?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Combining PDFs simplifies document management. Instead of emailing multiple attachments, send a single merged file. Instead of printing and manually collating pages, let software do the work. PDF merging saves time and reduces the chance of missing pages. It is especially useful for business proposals, academic submissions, and legal document packages where order and completeness are critical.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">When to Use PDF Merging</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Common use cases include combining invoice PDFs for accounting, merging scanned contract pages into a single document, aggregating multiple research papers into one reference file, and compiling presentation handouts. Any scenario where separate PDFs need to be presented as one document benefits from merging. The tool supports up to 10 files, covering most everyday merging needs.</p>
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
