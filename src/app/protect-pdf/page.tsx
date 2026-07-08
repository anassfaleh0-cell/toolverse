import type { Metadata } from "next";
import { ProtectPdf } from "@/components/pdf-suite/protect-pdf";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "protect-pdf";
const tool = getToolBySlug(slug)!;
const pageTitle = "Protect PDF - Password Protect PDF Files Online Free";
const pageDescription = "Add password protection to PDF files. Encrypt your PDF with a user password to prevent unauthorized access. Free online PDF encryption tool.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "How do I password protect a PDF?", answer: "Upload your PDF, enter a password, confirm it, and click Protect PDF. The tool encrypts your document and offers a download of the password-protected version. Anyone opening the file will need to enter the password you set." },
  { question: "What is the difference between user and owner password?", answer: "A user password (also called document open password) is required to open and view the PDF. An owner password restricts printing, editing, and copying. This tool applies a user password for full protection." },
  { question: "Can I remove password protection later?", answer: "Yes. Use the Unlock PDF tool with the same password to remove protection. It is important to remember your password, as there is no password recovery mechanism." },
  { question: "Is PDF encryption secure?", answer: "pdf-lib uses standard PDF encryption algorithms (RC4 and AES) supported by all major PDF readers. While not as strong as specialized encryption tools, it provides adequate protection for everyday document security needs." },
  { question: "What if I forget the password?", answer: "There is no recovery option. If you forget the password, the PDF cannot be opened. Store your password in a password manager and consider keeping a backup copy of the unencrypted file." },
  { question: "Are my files uploaded to a server?", answer: "No. All PDF encryption happens entirely in your browser using pdf-lib. Your files and password never leave your device." },
];


export default function ProtectPdfPage() {
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
            <ProtectPdf />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">How to Protect a PDF with a Password</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Upload your PDF, enter a strong password, confirm it to avoid typos, and click Protect PDF. The tool encrypts the document so that anyone trying to open it must provide the password. The password must be at least 4 characters long, but longer passwords with a mix of character types are recommended for better security.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Why Password Protect a PDF?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Password protection prevents unauthorized access to sensitive documents. Use it for confidential business reports, personal financial documents, legal contracts, and medical records. Password protection is the simplest and most widely supported PDF security mechanism, compatible with all major PDF readers including Adobe Acrobat, Chrome, and Edge.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Password Security Best Practices</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Use a unique password for each protected PDF. Avoid dictionary words, personal information, and common phrases. A good password is at least 12 characters long and includes uppercase letters, lowercase letters, numbers, and symbols. Store your PDF passwords in a password manager so you do not lose access to your own documents.</p>
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
