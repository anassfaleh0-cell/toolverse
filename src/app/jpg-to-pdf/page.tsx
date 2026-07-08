import type { Metadata } from "next";
import { JpgToPdf } from "@/components/pdf-suite/jpg-to-pdf";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "jpg-to-pdf";
const tool = getToolBySlug(slug)!;
const pageTitle = "JPG to PDF - Convert Images to PDF Online Free";
const pageDescription = "Convert JPG, PNG, and WebP images to PDF documents. Upload multiple images, reorder them, and download as a single PDF. Free online image to PDF converter.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How do I convert JPG to PDF?", answer: "Upload one or more images by dragging and dropping or clicking the upload area. Reorder them using the up and down buttons, remove any you do not want, and click Convert to PDF. The result is a single PDF with each image on its own page." },
  { question: "Can I convert multiple images to one PDF?", answer: "Yes. Upload as many images as you need and they are all combined into a single PDF document. Each image becomes one page in the order you specify." },
  { question: "What image formats are supported?", answer: "The tool supports JPG, PNG, and WebP image formats. These cover the vast majority of use cases for converting photos, screenshots, and graphics to PDF." },
  { question: "Can I reorder images before conversion?", answer: "Yes. Each uploaded image has up and down arrow buttons to change its position in the list. The PDF pages correspond to the image order shown." },
  { question: "Does image to PDF conversion reduce quality?", answer: "No. Images are embedded at their full resolution in the PDF. There is no recompression or quality loss during conversion. The PDF page size matches the image dimensions." },
  { question: "Are my files uploaded to a server?", answer: "No. All conversion happens entirely in your browser using pdf-lib. Your images never leave your device." },
];


export default function JpgToPdfPage() {
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
            <JpgToPdf />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">How to Convert Images to PDF</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Converting images to PDF is useful for creating photo albums, compiling scanned documents, turning screenshots into shareable documents, and preparing image-based reports. Upload your images, arrange them in the desired order, and click convert. The output PDF has each image on its own page at full resolution.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Why Convert Images to PDF?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">PDF is a universal format that preserves layout across devices and operating systems. Converting images to PDF makes them easier to share, print, and archive. PDFs can be password-protected, merged with other documents, and embedded in professional reports. Unlike loose image files, a PDF keeps all pages together as one coherent document.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Supported Image Formats</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">JPG images are ideal for photographs with smooth color transitions. PNG images support transparency and are better for graphics, logos, and screenshots with sharp edges. WebP offers superior compression for both photos and graphics. All three formats are embedded losslessly into the output PDF, preserving their original quality.</p>
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
