import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { BRAND } from "@/lib/nuvora/brand";

export const metadata: Metadata = {
  title: `Brand Guidelines — ${SITE_NAME}`,
  description: `${SITE_NAME} brand identity, visual system, and design guidelines.`,
  alternates: { canonical: `${SITE_URL}/brand` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Brand Guidelines" },
];

const colors = [
  { name: "Nuvora 50", hex: "#eef2ff", css: "bg-nuvora-50", text: "text-zinc-900" },
  { name: "Nuvora 100", hex: "#e0e7ff", css: "bg-nuvora-100", text: "text-zinc-900" },
  { name: "Nuvora 200", hex: "#c7d2fe", css: "bg-nuvora-200", text: "text-zinc-900" },
  { name: "Nuvora 300", hex: "#a5b4fc", css: "bg-nuvora-300", text: "text-zinc-900" },
  { name: "Nuvora 400", hex: "#818cf8", css: "bg-nuvora-400", text: "text-white" },
  { name: "Nuvora 500", hex: "#6366f1", css: "bg-nuvora-500", text: "text-white" },
  { name: "Nuvora 600", hex: "#4f46e5", css: "bg-nuvora-600", text: "text-white" },
  { name: "Nuvora 700", hex: "#4338ca", css: "bg-nuvora-700", text: "text-white" },
  { name: "Nuvora 800", hex: "#3730a3", css: "bg-nuvora-800", text: "text-white" },
  { name: "Nuvora 900", hex: "#312e81", css: "bg-nuvora-900", text: "text-white" },
];

const aurora = [
  { name: "Aurora 50", hex: "#ecfdf5", css: "bg-aurora-50", text: "text-zinc-900" },
  { name: "Aurora 100", hex: "#d1fae5", css: "bg-aurora-100", text: "text-zinc-900" },
  { name: "Aurora 200", hex: "#a7f3d0", css: "bg-aurora-200", text: "text-zinc-900" },
  { name: "Aurora 300", hex: "#6ee7b7", css: "bg-aurora-300", text: "text-zinc-900" },
  { name: "Aurora 400", hex: "#34d399", css: "bg-aurora-400", text: "text-white" },
  { name: "Aurora 500", hex: "#10b981", css: "bg-aurora-500", text: "text-white" },
  { name: "Aurora 600", hex: "#059669", css: "bg-aurora-600", text: "text-white" },
  { name: "Aurora 700", hex: "#047857", css: "bg-aurora-700", text: "text-white" },
  { name: "Aurora 800", hex: "#065f46", css: "bg-aurora-800", text: "text-white" },
  { name: "Aurora 900", hex: "#064e3b", css: "bg-aurora-900", text: "text-white" },
];

export default function BrandPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Brand Guidelines — ${SITE_NAME}`, description: `${SITE_NAME} brand identity and design guidelines.`, url: `${SITE_URL}/brand`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary">
            {SITE_NAME} Brand Guidelines
          </h1>
          <p className="mt-4 text-lg text-text-secondary">{BRAND.tagline}</p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-bold text-text-primary">Logo</h2>
          <div className="mt-8 flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-8">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-nuvora-500 to-nuvora-700 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="size-9">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </span>
              <p className="text-sm font-medium text-text-primary">N Symbol</p>
              <p className="text-xs text-text-tertiary">64px • Rounded corners</p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-nuvora-500 to-nuvora-700">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="size-6">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                </span>
                <span className="text-2xl font-bold tracking-tight text-text-primary">Nuvora</span>
              </div>
              <p className="text-sm font-medium text-text-primary">Full Logo</p>
              <p className="text-xs text-text-tertiary">Icon + Wordmark</p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-nuvora-500 to-nuvora-700">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="size-6">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                </span>
                <span className="text-2xl font-bold tracking-tight text-white">Nuvora</span>
              </div>
              <p className="text-sm font-medium text-text-primary">Dark Variant</p>
              <p className="text-xs text-text-tertiary">On dark backgrounds</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-bold text-text-primary">Color System</h2>
          <p className="mt-3 text-text-secondary">Nuvora uses a deep indigo primary palette with an aurora green accent for AI features.</p>

          <h3 className="mt-8 text-lg font-semibold text-text-primary">Primary — Nuvora</h3>
          <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-10">
            {colors.map((c) => (
              <div key={c.name} className="text-center">
                <div className={`h-12 w-full rounded-lg ${c.css} border border-border-subtle`} />
                <p className={`mt-1 text-[10px] ${c.text === "text-white" ? "text-text-tertiary" : "text-text-primary"}`}>{c.name}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-semibold text-text-primary">Accent — Aurora</h3>
          <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-10">
            {aurora.map((c) => (
              <div key={c.name} className="text-center">
                <div className={`h-12 w-full rounded-lg ${c.css} border border-border-subtle`} />
                <p className="mt-1 text-[10px] text-text-tertiary">{c.name}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-semibold text-text-primary">Semantic Tokens</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { token: "--surface", desc: "Card backgrounds, elevated areas", light: "#ffffff", dark: "#111113" },
              { token: "--surface-secondary", desc: "Hover states, subtle backgrounds", light: "#f5f5f5", dark: "#18181b" },
              { token: "--border-subtle", desc: "Dividers, card borders", light: "#e5e5e5", dark: "#27272a" },
              { token: "--text-primary", desc: "Headings, body text", light: "#0a0a0a", dark: "#f5f5f5" },
              { token: "--text-secondary", desc: "Subheadings, metadata", light: "#525252", dark: "#a1a1aa" },
              { token: "--text-tertiary", desc: "Placeholder, captions", light: "#a3a3a3", dark: "#52525b" },
            ].map((t) => (
              <div key={t.token} className="rounded-xl border border-border-subtle bg-surface p-4">
                <code className="text-xs font-mono text-nuvora-600 dark:text-nuvora-400">{t.token}</code>
                <p className="mt-1 text-sm text-text-secondary">{t.desc}</p>
                <div className="mt-2 flex gap-4 text-xs text-text-tertiary">
                  <span>Light: {t.light}</span>
                  <span>Dark: {t.dark}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-bold text-text-primary">Typography</h2>
          <p className="mt-3 text-text-secondary">Geist Sans (headings + body) and Geist Mono (code). Already included via next/font.</p>
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-4xl font-bold tracking-tight text-text-primary">Heading 1 — 36px Bold</p>
              <p className="text-xs text-text-tertiary mt-1">font-bold tracking-tight text-text-primary</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">Heading 2 — 24px Bold</p>
              <p className="text-xs text-text-tertiary mt-1">text-2xl font-bold text-text-primary</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">Heading 3 — 18px Semibold</p>
              <p className="text-xs text-text-tertiary mt-1">text-lg font-semibold text-text-primary</p>
            </div>
            <div>
              <p className="text-base leading-relaxed text-text-secondary">Body text — 16px. Nuvora is an intelligent digital workspace that provides powerful AI-powered tools and utilities for everyone. Every tool runs entirely in your browser.</p>
              <p className="text-xs text-text-tertiary mt-1">text-base leading-relaxed text-text-secondary</p>
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Small text — 14px. Used for metadata, captions, and tertiary information.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-bold text-text-primary">Voice & Tone</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {BRAND.voice.principles.map((p) => (
              <div key={p} className="rounded-xl border border-border-subtle bg-surface p-5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-nuvora-100 text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <p className="mt-3 text-sm text-text-primary">{p}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-semibold text-text-primary">Brand Values</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {BRAND.values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border-subtle bg-surface p-5">
                <h4 className="font-semibold text-text-primary">{v.title}</h4>
                <p className="mt-1 text-sm text-text-secondary">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
