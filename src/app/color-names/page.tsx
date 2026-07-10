import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { ColorNamesClient } from "./client";

export const metadata: Metadata = {
  title: "CSS Color Names — Full List of Named Colors | Nuvora",
  description: "Complete list of CSS named colors with hex codes, RGB values, and color previews. Search and filter 147+ CSS color names including all CSS3/4 named colors.",
  openGraph: { title: "CSS Color Names — Full List of Named Colors", description: "Complete list of CSS named colors with hex codes and RGB values." },
  twitter: { title: "CSS Color Names", description: "Complete list of CSS named colors with hex codes and RGB values." },
  alternates: { canonical: `${SITE_URL}/color-names` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "References", href: `${SITE_URL}/resources` },
  { label: "CSS Color Names" },
];

export default function ColorNamesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: "CSS Color Names", description: "Complete list of CSS named colors with hex codes and RGB values.", url: `${SITE_URL}/color-names`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            CSS Color Names
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Complete list of 147+ CSS named colors with hex codes, RGB values, and interactive color previews. Search and filter by name, hex, or color family.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <ColorNamesClient />
      </section>
    </>
  );
}
