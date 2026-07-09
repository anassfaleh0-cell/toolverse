import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `100M Monthly Visits Roadmap — Growth Strategy | ${SITE_NAME}`,
  description: "A data-driven plan to scale Nuvora from 1M to 100M monthly visits through content, SEO, product, and distribution strategies.",
  openGraph: { title: `100M Monthly Visits Roadmap`, description: "A data-driven plan to scale Nuvora from 1M to 100M monthly visits." },
  twitter: { title: `100M Monthly Visits Roadmap`, description: "A data-driven plan to scale Nuvora." },
  alternates: { canonical: `${SITE_URL}/100m-roadmap` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "100M Roadmap" }];

const MILESTONES = [
  {
    period: "Now — Q4 2026",
    target: "1M → 5M / mo",
    color: "green",
    strategies: [
      "Complete programmatic SEO: 5K+ pages across all content verticals",
      "Launch content distribution system (Whats New, Trending, Editor Picks)",
      "Build backlink engine: comparison matrices, decision trees, embeddable references",
      "Aggregate domain authority via strategic guest posting and tool roundups",
      "Implement social share engine to drive viral loops from tool results",
    ],
    metrics: "200+ tools, 5K+ pages, 5K+ referring domains, 30K+ social shares/mo",
    rationale: "Programmatic SEO at scale (5K+ pages) alone can drive 3-5M visits with proper keyword targeting. Backlinks from 5K+ domains will push DR from current to 50+.",
  },
  {
    period: "Q1 — Q2 2027",
    target: "5M → 15M / mo",
    color: "blue",
    strategies: [
      "Launch public API platform — opens integration and embed use cases",
      "User accounts with saved preferences, history sync, collections",
      "Community templates marketplace drives UGC and repeat visits",
      "Multi-language support (top 10 languages) via i18n infrastructure",
      "Mobile-responsive PWA with app-like experience",
      "Monetization introduces premium tiers without degrading free tier",
    ],
    metrics: "10K+ API keys issued, 100K+ registered users, 10 languages, 50% international traffic",
    rationale: "API platform adds developer audience (new segment). Internationalization doubles TAM. User accounts increase retention from 1.2 to 3+ pages/visit. 15M at 2.5 pages/visit = 37.5M pageviews.",
  },
  {
    period: "Q3 — Q4 2027",
    target: "15M → 40M / mo",
    color: "purple",
    strategies: [
      "Launch native mobile apps (iOS + Android) for top 20 tools",
      "Browser extension with quick-access toolbar",
      "Enterprise plans with SSO, audit logs, team management",
      "Advanced analytics dashboards for power users",
      "Content syndication partnerships with major dev publications",
      "Video content strategy: tool tutorials, comparisons, benchmarks",
    ],
    metrics: "1M+ app installs, 500K+ extension users, 100+ enterprise accounts, 40% mobile traffic",
    rationale: "Mobile apps + browser extension create always-on distribution channels. Enterprise accounts add B2B revenue and sticky usage. Video content captures search features and YouTube traffic.",
  },
  {
    period: "2028",
    target: "40M → 70M / mo",
    color: "amber",
    strategies: [
      "AI-powered tools and recommendations (LLM integration)",
      "Marketplace for community-contributed tools and templates",
      "White-label solutions for agencies and enterprises",
      "Strategic acquisitions of complementary free tool sites",
      "Global CDN expansion with edge computing for zero-latency tools",
      "Advanced NLP for multi-language content generation at scale",
    ],
    metrics: "50+ AI-enhanced tools, 5K+ community tools, 1K+ white-label deployments, 80% global traffic",
    rationale: "AI features create differentiation and media buzz. Marketplace leverages community for exponential tool growth without internal cost. White-label opens enterprise channel with 10x per-user value.",
  },
  {
    period: "2029+",
    target: "70M → 100M / mo",
    color: "emerald",
    strategies: [
      "Full suite of 500+ professionally maintained tools",
      "Education platform: certifications, courses, learning paths",
      "Developer platform: SDKs, CLI tools, GitHub Actions, VS Code extension",
      "Strategic SEO: dominate 10K+ high-volume keywords across 50+ tool categories",
      "Brand recognition as the default destination for online utilities globally",
      "Recurring revenue from premium, API, enterprise, and white-label sustains team of 100+",
    ],
    metrics: "500+ tools, 100K+ pages indexed, 50K+ referring domains, 5+ languages fully supported",
    rationale: "At this scale, compounding effects of brand recognition, backlink equity, and returning users drive organic growth. 100M visits/mo at $3-5 RPM = $3-5M/mo revenue, funding continued growth.",
  },
];

function MilestoneCard({ period, target, color, strategies, metrics, rationale }: typeof MILESTONES[number]) {
  const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
    green: { border: "border-green-200 dark:border-green-800", bg: "bg-green-50 dark:bg-green-950", text: "text-green-800 dark:text-green-200", badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
    blue: { border: "border-blue-200 dark:border-blue-800", bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-800 dark:text-blue-200", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
    purple: { border: "border-purple-200 dark:border-purple-800", bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-800 dark:text-purple-200", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
    amber: { border: "border-amber-200 dark:border-amber-800", bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-800 dark:text-amber-200", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
    emerald: { border: "border-emerald-200 dark:border-emerald-800", bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-800 dark:text-emerald-200", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" },
  };
  const c = colorMap[color];

  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} p-6`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{period}</h2>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${c.badge}`}>{target}</span>
      </div>

      <h3 className={`mb-2 text-sm font-semibold uppercase tracking-wider ${c.text}`}>Strategies</h3>
      <ul className="mb-4 space-y-1.5">
        {strategies.map((s) => (
          <li key={s} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="mt-0.5 shrink-0 text-zinc-400">&#8227;</span>
            {s}
          </li>
        ))}
      </ul>

      <div className="mb-3">
        <span className={`text-xs font-semibold uppercase tracking-wider ${c.text}`}>Key Metrics</span>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{metrics}</p>
      </div>

      <div>
        <span className={`text-xs font-semibold uppercase tracking-wider ${c.text}`}>Rationale</span>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{rationale}</p>
      </div>
    </div>
  );
}

export default function HundredMRoadmapPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `100M Monthly Visits Roadmap — ${SITE_NAME}`, description: "A data-driven plan to scale Nuvora from 1M to 100M monthly visits.", url: `${SITE_URL}/100m-roadmap`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">100M Monthly Visits Roadmap</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            A phased, data-driven plan to scale Nuvora from 1M to 100M monthly visits through content, SEO, product, and distribution.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-8 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Traffic Growth Trajectory</h2>
          </div>
          <div className="p-5">
            <div className="relative h-48">
              <svg viewBox="0 0 600 200" className="h-full w-full" aria-hidden="true">
                <polyline
                  points="0,190 60,170 120,150 180,130 240,110 300,90 360,65 420,40 480,20 540,10 600,5"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {[
                  { x: 0, label: "Now", value: "1M" },
                  { x: 60, label: "Q4 26", value: "5M" },
                  { x: 180, label: "Q2 27", value: "15M" },
                  { x: 300, label: "Q4 27", value: "40M" },
                  { x: 420, label: "2028", value: "70M" },
                  { x: 540, label: "2029+", value: "100M" },
                ].map(({ x, label, value }) => (
                  <g key={label}>
                    <circle cx={x} cy={200 - (parseInt(value) / 1000000) * 1.9} r="4" fill="#3b82f6" />
                    <text x={x} y="20" textAnchor="middle" className="text-[10px] fill-zinc-500 dark:fill-zinc-400">{value}</text>
                    <text x={x} y="196" textAnchor="middle" className="text-[9px] fill-zinc-400 dark:fill-zinc-500">{label}</text>
                  </g>
                ))}
                <line x1="0" y1="195" x2="600" y2="195" stroke="#e4e4e7" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {MILESTONES.map((ms) => (
            <MilestoneCard key={ms.period} {...ms} />
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">Benchmark Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="py-2 pr-4 font-semibold text-zinc-700 dark:text-zinc-300">Site</th>
                  <th className="py-2 pr-4 font-semibold text-zinc-700 dark:text-zinc-300">Monthly Visits</th>
                  <th className="py-2 pr-4 font-semibold text-zinc-700 dark:text-zinc-300">Tools</th>
                  <th className="py-2 font-semibold text-zinc-700 dark:text-zinc-300">DR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                <tr><td className="py-2 pr-4 text-zinc-900 dark:text-zinc-100">iLovePDF</td><td className="py-2 pr-4 text-zinc-600">~60M</td><td className="py-2 pr-4 text-zinc-600">25+</td><td className="py-2 text-zinc-600">86</td></tr>
                <tr><td className="py-2 pr-4 text-zinc-900 dark:text-zinc-100">CloudConvert</td><td className="py-2 pr-4 text-zinc-600">~25M</td><td className="py-2 pr-4 text-zinc-600">200+</td><td className="py-2 text-zinc-600">74</td></tr>
                <tr><td className="py-2 pr-4 text-zinc-900 dark:text-zinc-100">TinyWow</td><td className="py-2 pr-4 text-zinc-600">~15M</td><td className="py-2 pr-4 text-zinc-600">100+</td><td className="py-2 text-zinc-600">68</td></tr>
                <tr><td className="py-2 pr-4 text-zinc-900 dark:text-zinc-100">Nuvora (target)</td><td className="py-2 pr-4 font-bold text-blue-600 dark:text-blue-400">100M</td><td className="py-2 pr-4 text-zinc-600">500+</td><td className="py-2 text-blue-600 dark:text-blue-400">75+</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-zinc-500">Traffic estimates from Similarweb (2026). Nuvora targets exceed current benchmarks through broader tool catalog, programmatic SEO at scale, API platform, and community marketplace — strategies no single competitor combines.</p>
        </div>
      </section>
    </>
  );
}
