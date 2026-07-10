import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `How ${SITE_NAME} Works — Privacy-First Browser-Based Tools`,
  description: `Learn how ${SITE_NAME} processes your data entirely in your browser. No uploads, no servers, no tracking — just fast, private, reliable tools.`,
  openGraph: { title: `How ${SITE_NAME} Works`, description: `Privacy-first browser-based tools that never send your data anywhere.`, url: `${SITE_URL}/how-it-works` },
  twitter: { card: "summary_large_image", title: `How ${SITE_NAME} Works`, description: `Privacy-first browser-based tools.` },
  alternates: { canonical: `${SITE_URL}/how-it-works` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "How It Works" },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `How ${SITE_NAME} Works`, description: `Learn how ${SITE_NAME} processes your data entirely in your browser.`, url: `${SITE_URL}/how-it-works`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            How {SITE_NAME} Works
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Every tool runs directly in your browser. Your data never touches our servers.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Browser-First Architecture</h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Unlike most online tool websites that send your data to a server for processing, {SITE_NAME} runs everything locally in your browser using JavaScript and WebAssembly. When you enter text, upload a file, or look up a domain, the processing happens right on your device.
              </p>
              <p className="mt-4 text-text-secondary leading-relaxed">
                This architecture has three major advantages: your data stays private (nothing leaves your computer), the tools work offline (once loaded), and there are no server costs that would force us to charge or show aggressive ads.
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface p-6">
              <h3 className="font-semibold text-text-primary">How PDF Processing Works</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                When you upload a PDF to merge, compress, or convert, our tool reads the file using PDF.js (Mozilla&apos;s open-source PDF engine) entirely in your browser. For PDF-to-Word conversion, we extract the text and recreate a Word document locally using the mammoth library. Your file is never uploaded anywhere.
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface p-6">
              <h3 className="font-semibold text-text-primary">How Network Tools Work</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                DNS lookups, WHOIS queries, and SSL certificate checks require server-side processing because browsers cannot make raw network requests directly. For these tools, we route requests through secure API endpoints that handle the lookup and return the results. No data is logged or stored. We never track which domains you look up.
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface p-6">
              <h3 className="font-semibold text-text-primary">How Image Processing Works</h3>
              <p className="mt-2 text-sm text-secondary leading-relaxed">
                Image editing tools like background removal, resizing, and conversion use Canvas API and WebAssembly-powered libraries right in your browser. The image data is read, processed, and rendered locally. Nothing is uploaded to any server.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary">Our Privacy Commitment</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { title: "No Data Storage", desc: "We never store your files, lookups, or personal data on our servers." },
                  { title: "No Tracking", desc: "We use minimal analytics to improve the site. No cross-site tracking." },
                  { title: "No Signup Required", desc: "Every tool is free to use immediately. No accounts, no logins." },
                  { title: "Open Source", desc: "Our core processing libraries are open source and auditable." },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-border-subtle bg-surface-secondary/50 p-4">
                    <h3 className="font-semibold text-text-primary text-sm">{item.title}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-nuvora-200 bg-nuvora-50 p-6 dark:border-nuvora-800 dark:bg-nuvora-950/30">
              <h3 className="font-semibold text-nuvora-700 dark:text-nuvora-300">Ready to try it?</h3>
              <p className="mt-2 text-sm text-nuvora-600 dark:text-nuvora-400">
                Browse our {""}
                <Link href="/tools" className="underline font-medium hover:text-nuvora-800 dark:hover:text-nuvora-200">
                  full collection of free tools
                </Link>
                {" "}and experience the difference. No data leaves your browser.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
