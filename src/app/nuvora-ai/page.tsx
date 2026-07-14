import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Nuvora AI — Intelligent Result Analysis & Explanations`,
  description: "Nuvora AI analyzes your tool results to provide intelligent explanations, detect configuration issues, and suggest actionable next steps — all processed locally in your browser.",
  openGraph: { title: `Nuvora AI — Intelligent Result Analysis`, description: "AI-powered explanations for every tool result. Privacy-first, processed locally.", url: `${SITE_URL}/nuvora-ai` },
  alternates: { canonical: `${SITE_URL}/nuvora-ai` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Nuvora AI" },
];

export default function NuvoraAiPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Nuvora AI — Intelligent Result Analysis & Explanations`, description: "AI-powered tool result analysis with privacy-first local processing.", url: `${SITE_URL}/nuvora-ai`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/40 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-aurora-200 bg-aurora-50 px-4 py-1.5 text-xs font-medium text-aurora-700 dark:border-aurora-800 dark:bg-aurora-950/50 dark:text-aurora-300">
            Coming soon
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Nuvora <span className="bg-gradient-to-r from-nuvora-500 to-aurora-500 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            Every tool explains its results — not just what happened, but why it matters and what to do next. Powered by AI that runs entirely in your browser.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { title: "Explain", desc: "Get plain-English breakdowns of technical results. DNS records, security headers, SSL certificates — Nuvora AI tells you what each value means." },
              { title: "Detect Issues", desc: "AI automatically flags misconfigurations, missing records, expired certificates, and security vulnerabilities in your results." },
              { title: "Fix It", desc: "Found a problem? Nuvora AI walks you through the exact steps to resolve it, from DNS record fixes to security header configuration." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border-subtle bg-surface p-6">
                <h2 className="text-lg font-semibold text-text-primary">{f.title}</h2>
                <p className="mt-2 text-sm text-text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">How It Works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              { step: "01", title: "Run a tool", desc: "Use any Nuvora tool — DNS lookup, SSL checker, SPF lookup, etc." },
              { step: "02", title: "AI analyzes results", desc: "Nuvora AI inspects every value against known best practices and common issues." },
              { step: "03", title: "Get explanations", desc: "Each result is explained in plain language. Beginner mode removes all technical jargon." },
              { step: "04", title: "Take action", desc: "Issues come with step-by-step fix guides. Export results for documentation." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-nuvora-100 text-sm font-bold text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">{step}</span>
                <div>
                  <h2 className="text-base font-semibold text-text-primary">{title}</h2>
                  <p className="mt-1 text-sm text-text-secondary">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
