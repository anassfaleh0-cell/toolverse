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
  { question: "How do I merge PDF files?", answer: "Upload up to 10 PDF files by dragging and dropping or clicking the upload area. The files appear in a list where you can remove any you do not need. Click the merge button and the tool combines them into a single PDF document in the order they appear. The entire process takes seconds and happens locally in your browser." },
  { question: "Can I merge more than two PDFs at once?", answer: "Yes. You can upload up to 10 PDF files at once and merge them all into a single document. There is no limit on the number of pages from each file. For larger batch jobs, repeat the process with the remaining files and merge the intermediate results together." },
  { question: "Does merging PDFs reduce quality?", answer: "No. pdf-lib copies the original page content without re-encoding, so text, images, and vector graphics retain their original quality. The merged file size is approximately the sum of the input files. There is no compression or quality loss during the merge operation." },
  { question: "Can I reorder pages before merging?", answer: "To reorder pages, use the Reorder PDF tool first, then merge the reordered results. The merger combines files in the order you upload them. For best results, verify the page order of each source file before merging." },
  { question: "Is there a limit on PDF file size for merging?", answer: "There is no hard limit, but browser memory constraints may affect very large files. Each PDF is loaded entirely in memory, so files over 100 MB may cause performance issues. For large files, we recommend merging in smaller batches of 2-3 files at a time." },
  { question: "Are my PDFs uploaded to a server?", answer: "No. All PDF merging happens entirely in your browser using pdf-lib. Your files never leave your device. This makes the tool suitable for sensitive documents including contracts, financial records, and personal files." },
  { question: "What PDF versions are supported?", answer: "The tool supports all standard PDF versions including PDF 1.4 through PDF 2.0. Files created by different applications (Adobe Acrobat, Preview, Google Docs, Microsoft Word, web browsers) are all compatible." },
  { question: "Can I merge password-protected PDFs?", answer: "Password-protected PDFs cannot be merged directly. Use the Unlock PDF tool to remove protection first, then merge the unlocked files. This ensures security of protected documents." },
  { question: "Can I merge scanned PDFs or image-based PDFs?", answer: "Yes. Scanned PDFs contain embedded images and merge the same way as text-based PDFs. Each page is treated as a page object, so scanned pages are preserved exactly as they appear in the original file." },
  { question: "Will hyperlinks and bookmarks be preserved after merging?", answer: "Hyperlinks embedded in the original PDF pages are preserved since pdf-lib copies page content as-is. However, the tool does not merge the PDF outline/bookmark trees. For link-heavy documents, verify navigation after merging." },
  { question: "What happens if I upload a corrupted PDF?", answer: "The tool validates each PDF before merging. If a file is corrupted or invalid, it will be flagged and excluded from the merge operation, and you will receive a clear error message. Replace the corrupted file with a valid copy and try again." },
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
          <ToolHero title={pageTitle} description={pageDescription} introText="Combine multiple PDF documents into a single file quickly and securely. All processing happens locally in your browser — your files never leave your device." breadcrumbs={breadcrumbs}>
            <MergePdf />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">How to Merge PDF Files</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Merging PDFs is a common task when you need to combine multiple documents into one cohesive file. Whether you are compiling receipts, combining report chapters, or aggregating scanned documents, this tool streamlines the process. Upload your files by dragging and dropping them into the upload area or clicking to select them from your file system. You can upload up to 10 files at once with no limit on the number of pages per file.</p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Once uploaded, each file appears in a list showing its filename and page count. You can remove any file you do not need by clicking the remove button. When you are satisfied with the selection, click the Merge button. The tool processes the files in the order they appear and produces a single combined PDF. The entire operation runs client-side using pdf-lib compiled to WebAssembly, so your documents never leave your device. Download the merged result instantly.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Why Merge PDFs?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Combining PDFs simplifies document management in numerous ways. Instead of emailing multiple attachments, send a single merged file. Instead of printing and manually collating pages, let software do the work. PDF merging saves time, reduces the chance of missing pages, and ensures recipients see documents in the correct order. For businesses, merged PDFs streamline client deliverables, internal reporting, and regulatory submissions.</p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Privacy is another key advantage of browser-based PDF merging. Because your files are processed locally, you can merge sensitive documents like contracts, tax forms, and legal filings without worrying about third-party servers storing copies. This makes our PDF merger suitable for confidential document workflows where data security is a priority.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">When to Use PDF Merging</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Common use cases include combining invoice PDFs for accounting, merging scanned contract pages into a single document, aggregating multiple research papers into one reference file, and compiling presentation handouts. Any scenario where separate PDFs need to be presented as one document benefits from merging. The tool supports up to 10 files, covering most everyday merging needs.</p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Additional scenarios include combining multiple chapters of an eBook, creating a single portfolio PDF from separate design files, merging bank statements for financial reviews, and compiling application packages with supporting documents. For educators, merging student submissions into a single grading file saves time. For real estate agents, combining property documents into one package streamlines client presentations. The tool is versatile enough to handle any document combination task.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Step-by-Step Guide: How to Merge PDFs</h2>
          <ol className="mt-6 list-decimal space-y-4 pl-5 text-zinc-600 dark:text-zinc-400">
            <li><strong>Prepare your files:</strong> Gather all the PDFs you want to combine. Ensure each file is a valid PDF that opens correctly on your device. Rename files in the order you want them merged (e.g., 01-intro.pdf, 02-body.pdf, 03-appendix.pdf) to keep track of the sequence.</li>
            <li><strong>Upload to the tool:</strong> Drag and drop your PDF files into the upload area, or click to browse and select them from your file system. You can upload up to 10 files at once. Each file appears in a list showing its filename and total page count for easy reference.</li>
            <li><strong>Review and adjust:</strong> Check the file order in the list. If a file is in the wrong position, remove it and re-upload in the correct sequence. You can remove any file by clicking the remove button next to it without affecting the other uploads.</li>
            <li><strong>Start the merge:</strong> Click the Merge button to begin processing. The tool loads each PDF into browser memory using pdf-lib and creates a new document containing all pages from the uploaded files in order. A progress indicator shows the current operation status.</li>
            <li><strong>Download the result:</strong> Once merging completes, the combined PDF downloads automatically. Open it in your PDF reader to verify all pages are present and in the correct order. If something is wrong, adjust your file selection and merge again.</li>
          </ol>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Tips for Better PDF Merging</h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p><strong>Standardize file sizes:</strong> Merging files of vastly different sizes (e.g., a 1-page file with a 500-page file) works fine, but very large file size differences can slow down processing on low-memory devices. For consistent performance, try to keep individual file sizes within an order of magnitude of each other.</p>
            <p><strong>Use consistent formatting:</strong> If your source PDFs use different fonts, page sizes, or margin settings, the merged document will reflect each original file's formatting. For a uniform result, standardize source PDFs before merging by converting them to the same page size using an intermediate step.</p>
            <p><strong>Check page orientation:</strong> Mixing portrait and landscape pages is fully supported. Each page retains its original orientation in the merged output. If you need consistent orientation, rotate individual pages using a dedicated PDF rotation tool before merging.</p>
            <p><strong>Merge incrementally for large projects:</strong> If you need to combine more than 10 files or very large documents, merge in stages. Combine batches of 3-5 files first, download the intermediate merged PDFs, then merge those intermediate files together in a second pass.</p>
            <p><strong>Name your output file thoughtfully:</strong> After the download completes, the merged PDF uses a generic filename. Rename it immediately to something descriptive (e.g., &ldquo;Q3-Report-Combined.pdf&rdquo; or &ldquo;Contract-Package-2026.pdf&rdquo;) to keep your file system organized.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Common Use Cases for PDF Merging</h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p><strong>Business reporting:</strong> Combine monthly sales reports, quarterly financial statements, and annual summaries into a single comprehensive document for stakeholders. Merged PDFs make it easy to distribute complete reporting packages as a single attachment.</p>
            <p><strong>Legal document management:</strong> Law firms frequently merge contract addenda, exhibits, and signature pages into a single agreement file. Real estate transactions often involve merging inspection reports, title documents, and disclosure forms into one property package.</p>
            <p><strong>Academic research:</strong> Graduate students and researchers merge multiple journal articles, conference papers, and supplementary materials into a single reference file for their literature review. This simplifies citation management and offline reading.</p>
            <p><strong>Healthcare administration:</strong> Medical offices merge patient intake forms, lab results, imaging reports, and insurance documents into unified patient records. Keeping all related documents in one PDF simplifies record-keeping and sharing with specialists.</p>
            <p><strong>Creative portfolios:</strong> Designers, photographers, and artists merge individual project PDFs into a single portfolio document for client presentations and job applications. A merged portfolio is easier to email and provides a cohesive viewing experience.</p>
          </div>
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
