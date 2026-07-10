import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, CopyCode } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { BRAND } from "@/lib/nuvora/brand";

export const metadata: Metadata = {
  title: `Link to ${SITE_NAME} — Share Our Free Tools`,
  description: `Link to ${SITE_NAME} from your website. Use our pre-made HTML banners, buttons, and text links to share free online tools with your audience.`,
  openGraph: { title: `Link to ${SITE_NAME}`, description: `Add a ${SITE_NAME} link or banner to your site. Free embeddable buttons and HTML snippets.`, url: `${SITE_URL}/link-to-us` },
  alternates: { canonical: `${SITE_URL}/link-to-us` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Link to Us" },
];

const htmlSnippets = [
  {
    title: "Text Link",
    code: `<a href="${SITE_URL}" target="_blank" rel="noopener noreferrer">${SITE_NAME} — Free Online Tools</a>`,
  },
  {
    title: "Button Link",
    code: `<a href="${SITE_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;text-decoration:none;">Try ${SITE_NAME} Free Tools</a>`,
  },
  {
    title: "Banner Ad (728×90)",
    code: `<a href="${SITE_URL}" target="_blank" rel="noopener noreferrer"><img src="${SITE_URL}/banner-728x90.png" alt="${SITE_NAME} — Free Online Tools" width="728" height="90" style="border:0;border-radius:8px;"></a>`,
  },
  {
    title: "Wide Skyscraper (160×600)",
    code: `<a href="${SITE_URL}" target="_blank" rel="noopener noreferrer"><img src="${SITE_URL}/banner-160x600.png" alt="${SITE_NAME} — Free Online Tools" width="160" height="600" style="border:0;border-radius:8px;"></a>`,
  },
  {
    title: "SEO-Friendly Link",
    code: `<a href="${SITE_URL}/tools" target="_blank" rel="noopener noreferrer">Free Online ${SITE_NAME} Tools — No Signup Required</a>`,
  },
];

export default function LinkToUsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Link to ${SITE_NAME}`, description: `Share ${SITE_NAME} free tools with your audience. Pre-made HTML link and banner snippets.`, url: `${SITE_URL}/link-to-us`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Link to {SITE_NAME}
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Share {SITE_NAME} with your audience. Copy and paste the HTML below.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">HTML Snippets</h2>
          <p className="mt-2 text-sm text-text-secondary">Click &ldquo;Copy code&rdquo; to copy each snippet to your clipboard.</p>
          <div className="mt-8 space-y-6">
            {htmlSnippets.map((snippet) => (
              <div key={snippet.title} className="rounded-2xl border border-border-subtle bg-surface p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-text-primary">{snippet.title}</h3>
                  <CopyCode code={snippet.code} />
                </div>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-100 dark:bg-zinc-950">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Why Link to {SITE_NAME}?</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border-subtle bg-surface p-6">
              <h3 className="font-semibold text-text-primary">100% Free Tools</h3>
              <p className="mt-2 text-sm text-text-secondary">Every tool on {SITE_NAME} is completely free — no signups, no paywalls, no limits. Your audience gets instant value.</p>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface p-6">
              <h3 className="font-semibold text-text-primary">Privacy First</h3>
              <p className="mt-2 text-sm text-text-secondary">All tools run in the browser. No data is uploaded, stored, or shared. Peace of mind for your visitors.</p>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface p-6">
              <h3 className="font-semibold text-text-primary">Broad Appeal</h3>
              <p className="mt-2 text-sm text-text-secondary">From DNS lookups to PDF conversion, our tools serve developers, designers, students, and professionals alike.</p>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface p-6">
              <h3 className="font-semibold text-text-primary">No Attribution Required</h3>
              <p className="mt-2 text-sm text-text-secondary">Use our links and banners freely. No attribution or backlink required — though we always appreciate it!</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
