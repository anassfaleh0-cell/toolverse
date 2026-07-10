import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { BRAND } from "@/lib/nuvora/brand";

export const metadata: Metadata = {
  title: `Press Kit — ${SITE_NAME}`,
  description: `Download the ${SITE_NAME} press kit. Includes brand logo (SVG), color palette, brand guidelines, and media contact information.`,
  openGraph: { title: `Press Kit — ${SITE_NAME}`, description: `Download ${SITE_NAME} press kit with logo, brand colors, and guidelines.`, url: `${SITE_URL}/press` },
  alternates: { canonical: `${SITE_URL}/press` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Press Kit" },
];

const BRAND_COLORS = [
  { name: "Nuvora Primary", hex: "#6366f1", css: "var(--color-nuvora-600)" },
  { name: "Nuvora Dark", hex: "#4338ca", css: "var(--color-nuvora-700)" },
  { name: "Nuvora Light", hex: "#a5b4fc", css: "var(--color-nuvora-400)" },
  { name: "Surface", hex: "#ffffff", css: "var(--color-surface)" },
  { name: "Text Primary", hex: "#18181b", css: "var(--color-text-primary)" },
  { name: "Text Secondary", hex: "#71717a", css: "var(--color-text-secondary)" },
];

export default function PressPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Press Kit — ${SITE_NAME}`, description: `${SITE_NAME} press kit with logo, brand colors, and media contact.`, url: `${SITE_URL}/press`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Press Kit
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Resources for journalists, bloggers, and media covering {SITE_NAME}.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Logo</h2>
          <p className="mt-2 text-sm text-text-secondary">Download our logo in SVG format. Please do not modify, rotate, or add effects to the logo.</p>
          <div className="mt-6 flex items-center gap-6 rounded-2xl border border-border-subtle bg-surface p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-nuvora-600 text-3xl font-bold text-white">
              N
            </div>
            <div>
              <p className="font-semibold text-text-primary">{SITE_NAME}</p>
              <p className="text-xs text-text-secondary">Nuvora logo mark</p>
              <a
                href="/logo.svg"
                download
                className="mt-2 inline-block rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700"
              >
                Download SVG
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Brand Colors</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {BRAND_COLORS.map((c) => (
              <div key={c.name} className="rounded-2xl border border-border-subtle bg-surface p-4">
                <div className="h-12 w-full rounded-lg" style={{ backgroundColor: c.hex }} />
                <p className="mt-2 text-sm font-medium text-text-primary">{c.name}</p>
                <p className="text-xs text-text-secondary">{c.hex}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Brand Guidelines Summary</h2>
          <ul className="mt-4 space-y-3 text-text-secondary">
            <li><strong className="text-text-primary">Tone:</strong> {BRAND.voice.tone}.</li>
            <li><strong className="text-text-primary">Tagline:</strong> &ldquo;{BRAND.tagline}&rdquo;</li>
            <li><strong className="text-text-primary">Mission:</strong> {BRAND.mission}</li>
            <li><strong className="text-text-primary">Logo usage:</strong> Always use the provided SVG. Do not stretch, rotate, or apply filters.</li>
            <li><strong className="text-text-primary">Color usage:</strong> Use the Nuvora primary color (#6366f1) as the main brand accent. Maintain accessible contrast ratios.</li>
          </ul>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Media Contact</h2>
          <p className="mt-4 text-text-secondary">
            For press inquiries, interviews, or brand partnership requests, please contact us at <a href={`mailto:${BRAND.email}`} className="text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400">{BRAND.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
