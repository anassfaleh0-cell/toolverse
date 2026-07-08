import type { Metadata } from "next";
import { RotatePdf } from "@/components/pdf-suite/rotate-pdf";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "rotate-pdf";
const tool = getToolBySlug(slug)!;
const pageTitle = "Rotate PDF - Rotate PDF Pages Online Free";
const pageDescription = "Rotate individual PDF pages or all pages at once. Choose 90, 180, or 270 degree rotation. Fix scanned document orientation with this free online PDF rotator.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How do I rotate a PDF?", answer: "Upload your PDF. Each page is shown with its current rotation angle. Click the rotate button on any page to cycle through 90, 180, 270 degrees. Use the Rotate All buttons to apply the same rotation to every page at once. Click Apply Rotation to save and download." },
  { question: "Can I rotate individual pages?", answer: "Yes. Each page has its own rotation control. You can set different rotation angles for different pages, which is useful for documents that combine portrait and landscape orientations." },
  { question: "What rotation angles are available?", answer: "You can rotate pages by 90, 180, or 270 degrees in the clockwise direction. The 0 degree option resets the page to its original orientation." },
  { question: "Can I rotate all pages at once?", answer: "Yes. Use the Rotate All buttons (90, 180, 270) at the top of the page list to apply the same rotation to every page simultaneously. The Reset button restores all pages to 0 degrees." },
  { question: "Does rotating a PDF affect quality?", answer: "No. Rotation is a metadata-only operation in PDF. The page content is not re-encoded, so there is no quality loss. Text remains selectable and searchable after rotation." },
  { question: "Are my files uploaded to a server?", answer: "No. All PDF rotation happens entirely in your browser using pdf-lib. Your files never leave your device." },
];


export default function RotatePdfPage() {
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
            <RotatePdf />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">How to Rotate PDF Pages</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Upload your PDF and view a page-by-page preview with current rotation angles. Rotate individual pages by clicking the rotate icon, or apply a uniform rotation to all pages using the batch controls. The Apply Rotation button produces the final PDF with all changes baked in permanently.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Why Rotate a PDF?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Scanned documents, smartphone photos of documents, and incorrectly created PDFs often have pages in the wrong orientation. Rotating fixes these issues so all pages read in the correct direction. This is essential for professional presentations, archival documents, and printed materials where consistent page orientation matters.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Combined Portrait and Landscape Documents</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Many documents contain both portrait and landscape pages. For example, a report might have portrait text pages and landscape spreadsheet pages. This tool lets you set each page to its correct orientation individually, ensuring every page is readable without changing the document structure.</p>
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
