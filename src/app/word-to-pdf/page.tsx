import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const WordToPdf = dynamic(() => import("@/components/pdf-suite/word-to-pdf").then((m) => ({ default: m.WordToPdf })), {
  loading: () => (
    <div className="flex items-center justify-center rounded-xl border border-zinc-200 p-12 dark:border-zinc-800" role="status">
      <div className="animate-shimmer h-6 w-48 rounded" />
    </div>
  ),
});

const slug = "word-to-pdf";
const tool = getToolBySlug(slug)!;
const pageTitle = "Word to PDF - Convert Word Documents to PDF Online Free";
const pageDescription = "Convert Microsoft Word documents (.docx) to PDF format instantly in your browser. Free online Word to PDF converter with formatting preserved.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How does the Word to PDF conversion work?", answer: "The tool reads your .docx file using the Mammoth library to extract content and formatting, then generates a proper PDF using the PDF-Lib library. All processing happens in your browser — your files never leave your device." },
  { question: "What Word formats are supported?", answer: "The tool supports .docx files created by Microsoft Word, Google Docs, LibreOffice Writer, and most modern word processors. Legacy .doc files are not supported — please convert them to .docx first." },
  { question: "Does the conversion preserve formatting?", answer: "The conversion preserves text content, paragraphs, and basic structure. Complex formatting like tables, columns, headers, footers, and embedded images may not be perfectly preserved. For best results, use documents with standard paragraph text." },
  { question: "Are there limits on file size or page count?", answer: "There is no hard limit, but browser memory constraints affect very large files. Files over 50 MB or with more than 200 pages may cause performance issues. For best results, convert smaller documents." },
  { question: "Is my document uploaded to a server?", answer: "No. All Word to PDF conversion happens entirely in your browser using client-side libraries. Your documents never leave your device." },
  { question: "Can I convert multiple Word files at once?", answer: "Currently the tool converts one document at a time. Batch conversion support is planned for a future update." },
];

export default function WordToPdfPage() {
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
            <WordToPdf />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Convert Word Documents to Professional PDFs</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Word to PDF conversion lets you share your documents in a universally compatible format. Whether you need to submit a report, share a contract, or distribute meeting notes, converting your .docx files to PDF ensures they look the same on every device. The conversion runs entirely in your browser, so your documents stay private and secure.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">When to Use Word to PDF Conversion</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Common scenarios include sharing documents with people who may not have Word installed, submitting resumes and applications in a universally accepted format, archiving important documents in a stable format, and preparing documents for printing or professional distribution. PDF files maintain their layout across all platforms and devices.</p>
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
