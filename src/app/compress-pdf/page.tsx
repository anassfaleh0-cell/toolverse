import type { Metadata } from "next";
import { CompressPdf } from "@/components/pdf-suite/compress-pdf";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "compress-pdf";
const tool = getToolBySlug(slug)!;
const pageTitle = "Compress PDF - Reduce PDF File Size Online Free";
const pageDescription = "Compress PDF files to reduce their size for email, storage, and sharing. Optimize PDFs by removing metadata while preserving content quality.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How do I compress a PDF?", answer: "Upload your PDF file and click Compress. The tool reduces file size by optimizing internal structure and removing metadata. You can see the original size, compressed size, and reduction percentage before downloading." },
  { question: "Does PDF compression reduce quality?", answer: "This compression method removes metadata and optimizes object streams without re-encoding page content. Text, images, and vector graphics retain their original quality. For deeper compression, consider using dedicated image compression on embedded images first." },
  { question: "How much can I compress a PDF?", answer: "Typical reduction ranges from 5% to 30% depending on the amount of embedded metadata, fonts, and redundant objects. Files with extensive metadata, multiple embedded fonts, and large XMP data see the greatest reduction." },
  { question: "What is removed during PDF compression?", answer: "The compressor strips metadata (author, title, subject, keywords), removes duplicate objects, and enables cross-reference stream compression. No page content, text, images, or annotations are altered." },
  { question: "Can I control the compression level?", answer: "This tool uses lossless optimization that preserves all visible content. For adjustable compression that trades quality for smaller size, use a dedicated image editor to reduce embedded image resolution before compressing the PDF." },
  { question: "Are my files uploaded to a server?", answer: "No. All PDF compression happens entirely in your browser using pdf-lib. Your files never leave your device." },
];


export default function CompressPdfPage() {
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
            <CompressPdf />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">How to Compress a PDF</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Upload your PDF, click Compress, and download the optimized version. The tool shows you the original size versus the compressed size so you can see exactly how much space was saved. Compression is fully lossless for visible content, making it safe for important documents.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Why Compress PDFs?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Smaller PDFs are faster to email, upload, and download. Many email servers reject attachments over 25 MB, and cloud storage costs add up for large files. PDF compression reduces bandwidth usage and improves page load times when PDFs are embedded on websites. It is an essential step in document workflow optimization.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Lossless PDF Optimization</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Unlike image compression that reduces quality, PDF structural optimization removes redundant data without affecting what you see. Metadata removal, object deduplication, and cross-reference stream compression are all reversible if you re-save the PDF. This makes lossless compression ideal for archival documents where quality preservation is paramount.</p>
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
