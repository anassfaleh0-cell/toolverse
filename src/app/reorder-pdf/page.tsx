import type { Metadata } from "next";
import { ReorderPdf } from "@/components/pdf-suite/reorder-pdf";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "reorder-pdf";
const tool = getToolBySlug(slug)!;
const pageTitle = "Reorder PDF - Rearrange PDF Pages Online Free";
const pageDescription = "Reorder pages in a PDF document. Move pages up or down to rearrange the page order. Free online PDF page organizer tool.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How do I reorder pages in a PDF?", answer: "Upload your PDF. Each page is displayed in a grid with its current position number and up/down buttons. Use the arrow buttons to move pages into your desired order, then click Apply New Order to generate and download the reorganized PDF." },
  { question: "Can I move multiple pages at once?", answer: "Currently, pages are moved one at a time using the up and down controls. For complex reordering, you can move pages sequentially to achieve the desired arrangement." },
  { question: "Does reordering affect PDF content?", answer: "No. Reordering only changes the page sequence. All content, text, images, annotations, and form fields remain intact on their respective pages." },
  { question: "Can I see thumbnails while reordering?", answer: "Each page is represented by a document icon and labeled with its original page number and current position. This visual feedback helps you identify which page you are moving." },
  { question: "How many pages can I reorder?", answer: "There is no practical limit. The tool handles PDFs of any length, though very large documents may take longer to process during the reorder operation." },
  { question: "Are my files uploaded to a server?", answer: "No. All PDF reordering happens entirely in your browser using pdf-lib. Your files never leave your device." },
];


export default function ReorderPdfPage() {
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
            <ReorderPdf />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">How to Reorder PDF Pages</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Upload your PDF and use the up and down arrow buttons on each page card to rearrange the order. The current position number updates as you move pages. Once the order matches your requirements, click Apply New Order to generate the reorganized PDF. The operation preserves all content and formatting.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Why Reorder Pages?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Documents often need reorganization after creation. Scanned pages may be out of order, chapters may need resequencing, or specific sections should be moved to the front. Reordering helps create a logical flow without recreating the document from scratch. It is essential for compiling reports, books, and presentations.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Page Organization Strategies</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Start by identifying the correct page sequence before moving pages. Move pages one step at a time, working from the beginning to the end of the document. Use the position number (#) indicator to track the current order. For large documents, consider extracting sections, reordering them individually, then merging the results.</p>
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
