import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const PdfToJpg = dynamic(() => import("@/components/pdf-suite/pdf-to-jpg").then((m) => ({ default: m.PdfToJpg })), {
  loading: () => (
    <div className="flex items-center justify-center rounded-xl border border-zinc-200 p-12 dark:border-zinc-800" role="status">
      <div className="animate-shimmer h-6 w-48 rounded" />
    </div>
  ),
});

const slug = "pdf-to-jpg";
const tool = getToolBySlug(slug)!;
const pageTitle = "PDF to JPG - Convert PDF Pages to Images Online Free";
const pageDescription = "Convert PDF pages to high-quality JPG images. Select specific pages or convert all pages. Download individual images or as a ZIP archive. Free online PDF to image converter.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How do I convert a PDF to JPG?", answer: "Upload your PDF file. The tool renders each page as a thumbnail preview. Select the pages you want to convert and click the convert button. Single page downloads are direct JPG files; multiple pages are packaged as a ZIP archive." },
  { question: "Can I select which pages to convert?", answer: "Yes. Thumbnail previews are shown for every page. Click a thumbnail to toggle selection, or use the All and None buttons to select or deselect all pages quickly." },
  { question: "What resolution are the JPG images?", answer: "Pages are rendered at 2x scale (144 DPI at default PDF resolution), producing high-quality JPG images suitable for web use, presentations, and document sharing. The JPEG quality is set to 92% for an optimal balance of quality and file size." },
  { question: "Does PDF to JPG conversion lose quality?", answer: "Converting a PDF page to a raster JPG image inherently loses the vector quality of text and graphics. For most use cases like sharing, previewing, or embedding in documents, the output quality is excellent. For print-quality output, increase the render scale." },
  { question: "Can I convert scanned PDF to JPG?", answer: "Yes. Scanned PDFs contain raster images that are extracted and re-encoded as JPG. The conversion works well for any PDF regardless of how it was created." },
  { question: "Are my files uploaded to a server?", answer: "No. All PDF rendering happens entirely in your browser using pdfjs-dist. Your files never leave your device." },
];


export default function PdfToJpgPage() {
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
            <PdfToJpg />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">How to Convert PDF to JPG</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Upload a PDF and browse thumbnail previews of every page. Select the pages you need and convert them to high-quality JPG images. This tool is ideal for extracting charts, diagrams, or text content from PDFs for use in presentations, social media, or other documents that require image formats.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Why Convert PDF to Images?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">PDF pages need to be converted to images when you want to embed them in websites that do not support PDF rendering, share them on social media platforms, include them in presentation slides, or archive visual content from documents. JPG format provides broad compatibility and reasonable file sizes for these use cases.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Browser-Based PDF Rendering</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">This tool uses pdfjs-dist, Mozilla&apos;s PDF rendering engine, to draw each page onto an HTML canvas. The canvas content is then exported as a JPG image. This approach provides accurate, high-quality rendering that matches what you see in a PDF viewer. All processing happens client-side, so your documents remain private.</p>
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
