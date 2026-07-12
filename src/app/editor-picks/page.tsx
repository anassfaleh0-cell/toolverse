import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getFeaturedTools } from "@/lib/registry";

export const metadata: Metadata = {
  title: `Editor&apos;s Picks — Curated Selection of Best Tools`,
  description: "Hand-picked selection of the best free online tools. Our editors curate the most useful tools for developers, designers, and IT professionals.",
  openGraph: { title: `Editor&apos;s Picks — Curated Tools`, description: "Hand-picked selection of best free online tools." },
  twitter: { title: `Editor&apos;s Picks`, description: "Hand-picked selection of best free online tools." },
  alternates: { canonical: `${SITE_URL}/editor-picks` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Editor&apos;s Picks" }];

const CATEGORIES = [
  { name: "Network & Internet", slug: "network-internet", color: "border-l-blue-500" },
  { name: "Code & Development", slug: "code-dev", color: "border-l-green-500" },
  { name: "Image & Design", slug: "image-design", color: "border-l-purple-500" },
  { name: "Text & Writing", slug: "text-writing", color: "border-l-yellow-500" },
  { name: "Productivity", slug: "productivity", color: "border-l-orange-500" },
  { name: "Data & Analytics", slug: "data-analytics", color: "border-l-red-500" },
];

export default function EditorPicksPage() {
  const featured = getFeaturedTools();

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Editor&apos;s Picks — ${SITE_NAME}`, description: "Hand-picked selection of best free online tools.", url: `${SITE_URL}/editor-picks`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Editor&apos;s Picks</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Our team hand-picks the most useful free tools across every category. These are the tools we use ourselves.</p>
        </div>
      </section>

      {CATEGORIES.map((cat) => {
        const catTools = featured.filter((t) => t.category === cat.slug);
        if (catTools.length === 0) return null;
        return (
          <section key={cat.slug} className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
            <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">{cat.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {catTools.map((tool) => (
                <Link key={tool.id} href={tool.url} className={`rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700`}>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{tool.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
