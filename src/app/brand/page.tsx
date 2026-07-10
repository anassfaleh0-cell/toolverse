import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { BRAND } from "@/lib/nuvora/brand";

export const metadata: Metadata = {
  title: `Brand Guidelines — ${SITE_NAME}`,
  description: `Official ${SITE_NAME} brand guidelines. Logo usage, color palette, typography, voice & tone, and visual identity standards.`,
  openGraph: { title: `Brand Guidelines — ${SITE_NAME}`, description: `${SITE_NAME} brand guidelines covering logo, colors, typography, and tone of voice.`, url: `${SITE_URL}/brand` },
  alternates: { canonical: `${SITE_URL}/brand` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Brand Guidelines" },
];

const palette = [
  { name: "Nuvora Primary", hex: "#6366f1", usage: "Primary brand color. Used for buttons, links, and key UI elements." },
  { name: "Nuvora Dark", hex: "#4338ca", usage: "Hover states, active elements, and darker accents." },
  { name: "Nuvora Light", hex: "#a5b4fc", usage: "Backgrounds, borders, and subtle highlights." },
  { name: "Surface", hex: "#ffffff", usage: "Card backgrounds, page backgrounds in light mode." },
  { name: "Text Primary", hex: "#18181b", usage: "Headings and primary body text." },
  { name: "Text Secondary", hex: "#71717a", usage: "Supporting text, captions, and metadata." },
  { name: "Border Subtle", hex: "#e4e4e7", usage: "Card borders, dividers, and input outlines." },
  { name: "Success", hex: "#10b981", usage: "Positive states, success messages, confirmations." },
  { name: "Warning", hex: "#f59e0b", usage: "Warning states, alerts, caution indicators." },
  { name: "Error", hex: "#ef4444", usage: "Error states, destructive actions, validation issues." },
];

const dosAndDonts = [
  { do: "Use the logo on clean, contrast-friendly backgrounds", dont: "Stretch, rotate, or distort the logo proportions" },
  { do: "Maintain clear space around the logo equal to its height", dont: "Add drop shadows, gradients, or effects to the logo" },
  { do: "Use the Nuvora primary color as the main accent", dont: "Replace the brand color with a different hue" },
  { do: "Write in a professional yet warm tone", dont: "Use corporate jargon or buzzwords" },
  { do: "Keep tool descriptions concise and direct", dont: "Exaggerate claims or use superlatives without evidence" },
];

export default function BrandPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Brand Guidelines — ${SITE_NAME}`, description: `${SITE_NAME} brand identity standards.`, url: `${SITE_URL}/brand`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Brand Guidelines
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            How to use the {SITE_NAME} brand consistently across all channels.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Logo Usage</h2>
          <p className="mt-2 text-sm text-text-secondary">
            The {SITE_NAME} logo consists of the wordmark and the &ldquo;N&rdquo; icon mark. Always use the provided SVG files. Do not modify, rotate, or apply effects.
          </p>
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-nuvora-600 text-4xl font-bold text-white">N</div>
            <div className="flex items-center rounded-2xl border border-border-subtle bg-surface px-8 py-4">
              <span className="text-4xl font-bold text-nuvora-600">{SITE_NAME}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-zinc-900 px-8 py-4 dark:bg-zinc-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nuvora-400 text-xl font-bold text-white">N</div>
              <span className="text-xl font-bold text-white">{SITE_NAME}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Color Palette</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Use these colors consistently across all brand touchpoints.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {palette.map((c) => (
              <div key={c.name} className="rounded-2xl border border-border-subtle bg-surface p-4">
                <div className="h-12 w-full rounded-lg" style={{ backgroundColor: c.hex }} />
                <p className="mt-2 text-sm font-medium text-text-primary">{c.name}</p>
                <p className="text-xs text-text-secondary">{c.hex}</p>
                <p className="mt-1 text-xs text-text-secondary">{c.usage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Typography</h2>
          <p className="mt-2 text-sm text-text-secondary">
            {SITE_NAME} uses system font stacks for optimal performance. No custom fonts are loaded to ensure fast page loads.
          </p>
          <div className="mt-6 rounded-2xl border border-border-subtle bg-surface p-6">
            <p className="text-3xl font-bold text-text-primary">Heading — Inter, system-ui, sans-serif</p>
            <p className="mt-4 text-xl text-text-primary">Subheading — Inter, system-ui, sans-serif</p>
            <p className="mt-4 text-base text-text-secondary">Body text — Inter, system-ui, sans-serif. Regular weight (400) for body, semibold (600) for emphasis.</p>
            <p className="mt-3 text-sm text-text-secondary">Small text / captions — 0.875rem, secondary color.</p>
            <p className="mt-3 font-mono text-sm text-text-secondary">Code — JetBrains Mono / monospace for code snippets and technical content.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Voice &amp; Tone</h2>
          <p className="mt-2 text-sm text-text-secondary">How {SITE_NAME} communicates with its audience.</p>
          <div className="mt-6 rounded-2xl border border-border-subtle bg-surface p-6">
            <p className="text-sm text-text-secondary"><strong className="text-text-primary">Tone:</strong> {BRAND.voice.tone}.</p>
            <h3 className="mt-4 font-semibold text-text-primary">Principles</h3>
            <ul className="mt-2 space-y-1 text-sm text-text-secondary">
              {BRAND.voice.principles.map((p, i) => <li key={i}>&bull; {p}</li>)}
            </ul>
            <h3 className="mt-4 font-semibold text-text-primary">Avoid</h3>
            <ul className="mt-2 space-y-1 text-sm text-text-secondary">
              {BRAND.voice.avoid.map((a, i) => <li key={i}>&bull; {a}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Do&rsquo;s and Don&rsquo;ts</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {dosAndDonts.map((item, i) => (
              <div key={i} className="rounded-2xl border border-border-subtle bg-surface p-6">
                <p className="text-sm"><span className="font-semibold text-emerald-600 dark:text-emerald-400">Do:</span> <span className="text-text-secondary">{item.do}</span></p>
                <p className="mt-2 text-sm"><span className="font-semibold text-red-600 dark:text-red-400">Don&rsquo;t:</span> <span className="text-text-secondary">{item.dont}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
