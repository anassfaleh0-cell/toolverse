import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { REGEX_PATTERNS } from "@/lib/databases";
import { RegexPatternsClient } from "./client";
import { TrustSignal } from "@/components/shared/trust-signal";

export const metadata: Metadata = {
  title: "Regex Patterns Reference — Common Regular Expressions | Nuvora",
  description: "Library of common regex patterns for validation, text processing, security, log analysis, and more. Each pattern includes examples and explanations.",
  openGraph: { title: "Regex Patterns Reference — Common Regular Expressions", description: "Library of common regex patterns with examples and explanations." },
  twitter: { title: "Regex Patterns Reference", description: "Library of common regex patterns with examples and explanations." },
  alternates: { canonical: `${SITE_URL}/regex-patterns` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "References", href: `${SITE_URL}/resources` },
  { label: "Regex Patterns" },
];

const categories = [...new Set(REGEX_PATTERNS.map((p) => p.category))];

export default function RegexPatternsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: "Regex Patterns Reference", description: "Library of common regex patterns with examples.", url: `${SITE_URL}/regex-patterns`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Regex Patterns Reference</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Library of common regex patterns for validation, text processing, and more. Click the copy icon to use any pattern.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <RegexPatternsClient initial={REGEX_PATTERNS} categories={categories} />
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8 text-center sm:px-6">
        <TrustSignal />
      </section>
    </>
  );
}
