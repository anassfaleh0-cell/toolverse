import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Changelog — Release Notes | ${SITE_NAME}`,
  description: `Track every update, improvement, and new tool added to ${SITE_NAME}. Full release history and changelog.`,
  openGraph: { title: `Changelog — Release Notes`, description: `Full release history for ${SITE_NAME}.`, url: `${SITE_URL}/changelog` },
  twitter: { title: `Changelog`, description: `Full release history for ${SITE_NAME}.` },
  alternates: { canonical: `${SITE_URL}/changelog` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Changelog" }];

const RELEASES = [
  {
    version: "Sprint 16",
    date: "July 7, 2026",
    type: "major",
    title: "Global Growth Engine",
    description: "Content distribution system, backlink engine, share engine, brand pages, and community architecture. New pages: /whats-new, /trending, /editor-picks, /changelog, /roadmap, /open-source, /research.",
  },
  {
    version: "Sprint 15",
    date: "July 7, 2026",
    type: "major",
    title: "Authority & Scale Engine",
    description: "Knowledge base system (792 pages), 5 new reference databases, programmatic SEO (16 pages), AI Overview optimization, EEAT signals, scale audit. Pages grew from 247 to 961.",
  },
  {
    version: "Sprint 14",
    date: "July 2026",
    type: "major",
    title: "High-Traffic Tool Suites",
    description: "40 new tools across 4 suites (PDF, Image, Text, SEO). Each suite has 10 production-quality, client-side tools. 88 total tools now available.",
  },
  {
    version: "Sprint 13",
    date: "June 2026",
    type: "major",
    title: "Enterprise Features & Data APIs",
    description: "Domain Report Card, visual dashboards, DNS data APIs, revenue system, universal workspace, result history, collections, bookmarks, command palette.",
  },
  {
    version: "Sprint 12",
    date: "June 2026",
    type: "major",
    title: "Landing Pages & Content Cluster Architecture",
    description: "20 use-case landing pages, content clusters, topic authority model, internal linking optimization, resources hub.",
  },
  {
    version: "Sprint 11",
    date: "June 2026",
    type: "major",
    title: "Compare & Multi-Format System",
    description: "Comparison engine, Diff Checker, Compare DNS, batch IP processing, JSON/XML/YAML multi-format tools, JWT decoder, text diff.",
  },
  {
    version: "Sprint 10",
    date: "May 2026",
    type: "major",
    title: "Content Cluster & Taxonomy Expansion",
    description: "74 content pages organized into clusters, expanded category system with 7 categories, tag system with 14 tags, DSP audit dashboard.",
  },
  {
    version: "Sprint 9",
    date: "May 2026",
    type: "major",
    title: "DSP & Search Infrastructure",
    description: "Website status monitoring, IndexNow integration, DNS propagation checker, SSL certificate details, search API, command palette.",
  },
  {
    version: "Sprint 8",
    date: "April 2026",
    type: "major",
    title: "Network Tools Foundation",
    description: "Ping test, WHOIS lookup, port checker, reverse DNS, HTTP headers checker, consolidated IP lookup page, tool hero, tool layout system.",
  },
  {
    version: "Sprint 7",
    date: "April 2026",
    type: "major",
    title: "Tool Ecosystem",
    description: "CSS gradient generator, URL encoder/decoder, UUID generator, list randomizer, word counter, timestamp converter, UX mobile improvements.",
  },
];

export default function ChangelogPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Changelog — ${SITE_NAME}`, description: `Full release history for ${SITE_NAME}.`, url: `${SITE_URL}/changelog`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Changelog</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Every update, improvement, and new tool. Track the evolution of Nuvora.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-zinc-200 dark:bg-zinc-700" />
          <div className="space-y-8">
            {RELEASES.map((release, i) => (
              <div key={i} className="relative pl-10">
                <div className={`absolute left-2.5 top-1.5 size-3 rounded-full border-2 ${release.type === "major" ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : "border-zinc-400 bg-zinc-100 dark:bg-zinc-800"}`} />
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">{release.version}</span>
                    <span className="text-xs text-zinc-500">{release.date}</span>
                  </div>
                  <h3 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">{release.title}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{release.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
