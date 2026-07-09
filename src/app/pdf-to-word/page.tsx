import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const PdfToWord = dynamic(() => import("@/components/pdf-suite/pdf-to-word").then((m) => ({ default: m.PdfToWord })), {
  loading: () => (
    <div className="flex items-center justify-center rounded-xl border border-zinc-200 p-12 dark:border-zinc-800" role="status">
      <div className="animate-shimmer h-6 w-48 rounded" />
    </div>
  ),
});

const slug = "pdf-to-word";
const tool = getToolBySlug(slug)!;
const pageTitle = "PDF to Word - Convert PDF to Word Document Online Free";
const pageDescription = "Convert PDF files to editable Word documents (.doc). Extract text content from PDFs and download as a Word-compatible format. Free online PDF to Word converter.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How does the PDF to Word conversion work?", answer: "The tool extracts all text content from your PDF page by page using the pdf.js library. The extracted text is compiled into a Word-compatible HTML document (.doc) that preserves page structure. All processing happens in your browser — your files never leave your device." },
  { question: "Can I convert scanned PDFs or image-based PDFs?", answer: "This tool extracts text from the PDF's text layer. Scanned documents and image-only PDFs do not have a text layer, so the output will show them as empty. For scanned PDFs, you need OCR (Optical Character Recognition) which requires server-side processing." },
  { question: "Does the conversion preserve formatting?", answer: "The conversion extracts raw text content and organizes it by page. Complex formatting like tables, columns, fonts, colors, and exact layouts are not preserved. For best results, use PDFs with standard paragraph text. The output is a clean .doc file with structured content." },
  { question: "Are there limits on PDF file size or page count?", answer: "There is no hard limit, but browser memory constraints affect very large files. Files over 50 MB or with more than 100 pages may cause performance issues. For best results, convert smaller PDFs in batches." },
  { question: "Is my PDF uploaded to a server?", answer: "No. All PDF to Word conversion happens entirely in your browser using the pdf.js library. Your files and extracted text never leave your device." },
  { question: "What Word format is used for the download?", answer: "The tool downloads a .doc file using the Word-compatible HTML format. This opens in Microsoft Word, Google Docs, LibreOffice Writer, and most word processors. For best compatibility with modern Word versions, open the .doc file and re-save as .docx." },
];

export default function PdfToWordPage() {
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
            <PdfToWord />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Convert PDF to Editable Word Documents</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">PDF to Word conversion lets you repurpose content from PDF documents in your word processor of choice. Whether you need to edit a contract, reuse content from a PDF report, or extract text for translation, this tool extracts every page&apos;s text content into a structured Word document. The conversion runs entirely in your browser using the same pdf.js engine that powers Firefox&apos;s built-in PDF viewer, ensuring accurate text extraction.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Real-World Example: Extracting a Contract for Editing</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">A small business received a 12-page vendor contract as a PDF and needed to modify three clauses. The original PDF was created from a scanned signature page appended to an 11-page Word-exported PDF. Using the PDF to Word converter, the text from pages 1-11 (the Word-exported portion) was fully extracted with correct paragraph structure and page breaks. The scanned signature page returned empty, as expected. The resulting .doc file contained 11 pages of clean text with section headers intact. The user opened the .doc in Google Docs, located Section 4.2 (Indemnification) and Section 7.1 (Termination), made the required word changes, re-exported as PDF, and appended a new signature page. The entire workflow took 4 minutes instead of manually retyping the contract.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Troubleshooting: Why Is the Converted Document Empty?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">If the converted Word document appears empty or contains only page headers, your PDF is likely image-based (a scanned document) rather than text-based. This tool extracts the text layer from PDFs — it does not perform OCR. Check your PDF by selecting text with a mouse: if you cannot highlight individual words, the PDF is image-only. Use an OCR-capable tool for scanned documents. If you can select text but the output is still empty, the PDF may use embedded fonts that pdf.js cannot decode. Try opening the PDF in a different viewer and re-saving as a &quot;PDF (optimized for online distribution)&quot; before converting. For PDFs with complex layouts (multi-column, tables, rotated text), the extraction may produce jumbled output — use the page-by-page preview to check quality before downloading.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">References</h2>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>ISO 32000-1 — Document Management — Portable Document Format (PDF 1.7) (<a href="https://www.iso.org/standard/51502.html" className="text-blue-600 hover:underline dark:text-blue-400">iso.org/standard/51502.html</a>)</li>
            <li>pdf.js — Mozilla&apos;s PDF Rendering Library (<a href="https://mozilla.github.io/pdf.js/" className="text-blue-600 hover:underline dark:text-blue-400">mozilla.github.io/pdf.js</a>)</li>
            <li>Microsoft Word DOC Format (<a href="https://learn.microsoft.com/en-us/openspecs/office_standards/ms-word/" className="text-blue-600 hover:underline dark:text-blue-400">learn.microsoft.com/en-us/openspecs/office_standards/ms-word</a>)</li>
          </ul>
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
