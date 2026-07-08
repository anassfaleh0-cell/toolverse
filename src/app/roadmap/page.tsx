import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Roadmap — Product Development Plan | ${SITE_NAME}`,
  description: "See what is coming next to ToolVerse. Our product roadmap shows planned features, tools, and improvements.",
  openGraph: { title: `Roadmap — Product Development Plan`, description: "See what is coming next to ToolVerse." },
  twitter: { title: `Roadmap`, description: "See what is coming next to ToolVerse." },
  alternates: { canonical: `${SITE_URL}/roadmap` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Roadmap" }];

const PHASES = [
  {
    quarter: "Q3 2026 (Current)",
    status: "in-progress",
    items: [
      { name: "Global Growth Engine", done: true, desc: "Content distribution, backlink assets, share engine, brand pages" },
      { name: "Social Share Integration", done: false, desc: "Platform-specific sharing for Twitter, LinkedIn, Facebook" },
      { name: "Result Sharing & Embed", done: false, desc: "Shareable result URLs, embeddable tool widgets" },
      { name: "Community Architecture", done: false, desc: "User profiles, public collections, community templates" },
    ],
  },
  {
    quarter: "Q4 2026",
    status: "planned",
    items: [
      { name: "API Platform Launch", done: false, desc: "Public REST API for all tools with rate limits and API keys" },
      { name: "User Accounts", done: false, desc: "Authentication, saved preferences, tool history sync" },
      { name: "Premium Features", done: false, desc: "Batch processing, higher limits, priority support" },
      { name: "Multi-language Support", done: false, desc: "Top 10 languages, i18n infrastructure" },
    ],
  },
  {
    quarter: "Q1 2027",
    status: "planned",
    items: [
      { name: "Mobile Apps", done: false, desc: "Native iOS and Android apps for key tools" },
      { name: "Enterprise Plans", done: false, desc: "Team accounts, SSO, audit logs, dedicated support" },
      { name: "Analytics Dashboards", done: false, desc: "Usage dashboards, custom reports, data export" },
      { name: "Marketplace", done: false, desc: "Community-contributed tools and templates" },
    ],
  },
  {
    quarter: "Q2 2027+",
    status: "future",
    items: [
      { name: "AI-Powered Tools", done: false, desc: "LLM integration for intelligent data analysis" },
      { name: "Browser Extension", done: false, desc: "Quick-access toolbar with core tools" },
      { name: "White-Label Solutions", done: false, desc: "Custom branding for agencies and enterprises" },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Roadmap — ${SITE_NAME}`, description: "See what is coming next to ToolVerse.", url: `${SITE_URL}/roadmap`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Roadmap</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Our public product roadmap. See what we are building and what is coming next.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="space-y-10">
          {PHASES.map((phase) => (
            <div key={phase.quarter}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{phase.quarter}</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${phase.status === "in-progress" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : phase.status === "planned" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                  {phase.status === "in-progress" ? "In Progress" : phase.status === "planned" ? "Planned" : "Future"}
                </span>
              </div>
              <div className="space-y-3">
                {phase.items.map((item) => (
                  <div key={item.name} className={`rounded-lg border p-4 ${item.done ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"}`}>
                    <div className="flex items-center gap-2">
                      {item.done && <span className="text-green-600 dark:text-green-400">✓</span>}
                      <h3 className={`font-semibold ${item.done ? "text-green-800 dark:text-green-200 line-through" : "text-zinc-900 dark:text-zinc-100"}`}>{item.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
