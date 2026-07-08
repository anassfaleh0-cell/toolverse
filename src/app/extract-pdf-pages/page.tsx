import type { Metadata } from "next";
import { ExtractPdfPages } from "@/components/pdf-suite/extract-pdf-pages";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "extract-pdf-pages";
const tool = getToolBySlug(slug)!;
const pageTitle = "Extract PDF Pages - Extract Specific Pages from PDF Online Free";
const pageDescription = "Extract specific pages from a PDF document. Select individual pages using checkboxes and download them as a new PDF. Free online PDF page extraction tool.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How do I extract pages from a PDF?", answer: "Upload your PDF and all pages are displayed with selection buttons. Click each page you want to include. Use All or None to select or deselect everything quickly. Click Extract Selected Pages to create and download a new PDF containing only the chosen pages." },
  { question: "Can I select non-consecutive pages?", answer: "Yes. You can select any combination of pages regardless of their position. Each page has an independent toggle, so you can pick pages 1, 3, and 7 for example." },
  { question: "Does extraction modify the original PDF?", answer: "No. The original PDF is never modified. A new PDF is created containing only the selected pages. Your original file remains unchanged on your device." },
  { question: "What format is the extracted PDF?", answer: "The output is a standard PDF file with the same formatting, content, and quality as the original pages. Text remains selectable and searchable." },
  { question: "Can I extract pages without uploading?", answer: "No. You need to upload the PDF so the tool can read the page structure. However, all processing happens client-side and your file is never transmitted to any server." },
  { question: "Are my files uploaded to a server?", answer: "No. All PDF page extraction happens entirely in your browser using pdf-lib. Your files never leave your device." },
];


export default function ExtractPdfPagesPage() {
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
            <ExtractPdfPages />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">How to Extract PDF Pages</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Upload a PDF and browse the page list. Each page displays a toggle button. Select the pages you want by clicking them, then click Extract Selected Pages. The tool creates a new PDF containing only the selected pages, preserving all content, formatting, and text selectability.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Why Extract Pages?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Extraction is useful when you only need specific pages from a larger document. For example, extracting a signature page from a contract, pulling out reference tables from a report, or creating a summary document with only the key sections. It saves storage space and makes sharing more targeted.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Page Selection Tips</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Use the All button to quickly select every page, then deselect the ones you do not need. Use the None button to start fresh and only select the specific pages you want. The selected page counter at the bottom helps you track how many pages will be included in the extracted PDF.</p>
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
