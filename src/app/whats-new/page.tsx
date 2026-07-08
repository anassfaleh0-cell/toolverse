import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getLatestContent } from "@/lib/content/registry";
import { getAllTools } from "@/lib/registry";

export const metadata: Metadata = {
  title: `What&apos;s New — Latest Tools & Content | ${SITE_NAME}`,
  description: "Discover the latest tools, guides, and content added to ToolVerse. Stay updated with new releases and improvements.",
  openGraph: { title: `What&apos;s New — Latest Tools & Content | ${SITE_NAME}`, description: "Discover the latest tools, guides, and content added to ToolVerse. Stay updated with new releases and improvements.", url: `${SITE_URL}/whats-new` },
  twitter: { card: "summary_large_image", title: `What&apos;s New — Latest Tools & Content | ${SITE_NAME}`, description: "Discover the latest tools and content on ToolVerse." },
  alternates: { canonical: `${SITE_URL}/whats-new` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "What&apos;s New" }];

export default function WhatsNewPage() {
  const allTools = getAllTools();
  const latestContent = getLatestContent(10);
  const latestTools = [...allTools].reverse().slice(0, 10);

  return (
    <>
      <JsonLd data={webPageSchema({ name: `What&apos;s New — ${SITE_NAME}`, description: "Discover the latest tools and content on ToolVerse.", url: `${SITE_URL}/whats-new`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">What&apos;s New</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Latest tools, guides, and improvements on ToolVerse.</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Recently Added Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {latestTools.map((tool) => (
            <Link key={tool.id} href={tool.url} className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{tool.name}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {latestContent.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Recently Published Content</h2>
          <div className="space-y-4">
            {latestContent.map((item) => (
              <Link key={item.slug} href={`/${item.type}/${item.slug}`} className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
                <p className="mt-2 text-xs text-zinc-500">{new Date(item.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
