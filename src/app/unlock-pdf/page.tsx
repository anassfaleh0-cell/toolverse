import type { Metadata } from "next";
import { UnlockPdf } from "@/components/pdf-suite/unlock-pdf";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "unlock-pdf";
const tool = getToolBySlug(slug)!;
const pageTitle = "Unlock PDF - Remove PDF Password Online Free";
const pageDescription = "Unlock password-protected PDF files. Provide the document password and download the unlocked version. Free online PDF password remover tool.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How do I unlock a PDF?", answer: "Upload the password-protected PDF and enter the document password in the field provided. Click Unlock. If the password is correct, the tool decrypts the PDF and offers a download of the unlocked version without password protection." },
  { question: "Do I need the original password?", answer: "Yes. The password is required to decrypt the PDF. This tool cannot bypass or crack PDF passwords. It uses the password you provide with pdf-lib to load and re-save the document without encryption." },
  { question: "Does unlocking affect PDF content?", answer: "No. The decryption process preserves all content, formatting, annotations, form fields, and embedded elements. The only change is the removal of password-based security restrictions." },
  { question: "Is it legal to unlock a PDF?", answer: "Unlocking a PDF is legal when you own the document or have the owner&apos;s permission to remove the password. Always ensure you have the right to modify the document before removing its protection." },
  { question: "Can I unlock any password protected PDF?", answer: "This tool works with standard PDF password encryption (RC4 and AES) supported by pdf-lib. Most PDF protection schemes are supported, including those created by Adobe Acrobat, Microsoft Office, and other PDF software." },
  { question: "Are my files uploaded to a server?", answer: "No. All PDF decryption happens entirely in your browser using pdf-lib. Your files and password never leave your device." },
];


export default function UnlockPdfPage() {
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
            <UnlockPdf />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">How to Unlock a PDF</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Upload your password-protected PDF and enter the document password. The tool loads the PDF with the provided password using pdf-lib and re-saves it without encryption. The unlocked PDF is identical in content to the original but no longer requires a password to open.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Why Unlock a PDF?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Password-protected PDFs can be inconvenient for everyday use. Unlocking removes the need to enter a password every time you open the document, making it easier to share with colleagues, process in automated workflows, or merge with other files. It is also necessary when you have forgotten the protection you applied and need to edit or print the document.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">PDF Security Considerations</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">PDF passwords protect sensitive documents from unauthorized access. Before removing a password, consider whether the document still needs protection. For documents shared within a trusted team or archived for personal use, removing the password improves accessibility. For sensitive documents, use the Protect PDF tool to add a new password after making your changes.</p>
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
