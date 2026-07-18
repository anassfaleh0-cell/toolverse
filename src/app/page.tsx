import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { JsonLd } from "@/components/shared";
import { Hero } from "@/components/shared/hero";
import { Icon } from "@/components/shared/icon";
import { HomeSearchBar } from "@/components/search/HomeSearchBar";
import { webPageSchema, breadcrumbSchema, faqSchema, webSiteSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, FAQ_ITEMS, HERO_TAGLINE } from "@/lib/constants";
import { getCategories, getToolsByCategory, getAllTools } from "@/lib/registry";

const ToolSuites = dynamic(() => import("@/components/tool-suites").then((m) => ({ default: m.ToolSuites })));
const WhyNuvora = dynamic(() => import("@/components/why-nuvora").then((m) => ({ default: m.WhyNuvora })));
const RecentlyViewed = dynamic(() => import("@/components/shared/recently-viewed").then((m) => ({ default: m.RecentlyViewed })));
const ContinueReading = dynamic(() => import("@/components/shared/continue-reading").then((m) => ({ default: m.ContinueReading })));
const PopularPaths = dynamic(() => import("@/components/shared/popular-paths").then((m) => ({ default: m.PopularPaths })));

export const metadata: Metadata = {
  title: `${SITE_NAME} — Free Online Tools for Developers & IT Pros`,
  description: `${SITE_DESCRIPTION} DNS lookup, IP lookup, WHOIS, SSL checker, password generator, and 250+ more.`,
  openGraph: { title: `${SITE_NAME} — Free Online Tools for Developers & IT Pros`, description: SITE_DESCRIPTION, url: SITE_URL },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} — Free Online Tools`, description: SITE_DESCRIPTION },
  alternates: { canonical: SITE_URL },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }];

const FEATURED_TOOLS = [
  { id: "dns-lookup", icon: "Globe", gradient: "from-nuvora-500 to-aurora-500", label: "Network" },
  { id: "ip-lookup", icon: "MapPin", gradient: "from-blue-500 to-indigo-500", label: "Network" },
  { id: "whois-lookup", icon: "Search", gradient: "from-teal-500 to-cyan-500", label: "Network" },
  { id: "merge-pdf", icon: "FileText", gradient: "from-red-500 to-rose-500", label: "PDF" },
  { id: "compress-pdf", icon: "FileArchive", gradient: "from-orange-500 to-amber-500", label: "PDF" },
  { id: "background-remover", icon: "Sparkles", gradient: "from-purple-500 to-violet-500", label: "Image" },
  { id: "spf-lookup", icon: "Mail", gradient: "from-emerald-500 to-teal-500", label: "Email" },
  { id: "domain-report", icon: "BarChart3", gradient: "from-cyan-500 to-blue-500", label: "Security" },
  { id: "password-generator", icon: "LockKeyhole", gradient: "from-red-500 to-pink-500", label: "Security" },
  { id: "qr-code-generator", icon: "QrCode", gradient: "from-zinc-500 to-slate-700", label: "Utility" },
];

function TrustBar() {
  const logos = [
    { name: "TypeScript", icon: "TS" },
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "▽" },
    { name: "Tailwind", icon: "🌊" },
    { name: "WebAssembly", icon: "⚙️" },
    { name: "Web Workers", icon: "⚡" },
  ];
  return (
    <section className="border-b border-border-subtle bg-surface-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-text-tertiary">
          Built with modern technology stack
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((logo) => (
            <div key={logo.name} className="flex items-center gap-2 text-sm text-text-tertiary">
              <span className="text-base">{logo.icon}</span>
              <span className="font-medium">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiShowcase() {
  return (
    <section className="border-b border-border-subtle bg-gradient-to-br from-nuvora-50/50 to-surface dark:from-nuvora-950/20 dark:to-surface">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-aurora-200 bg-aurora-50 px-4 py-1 text-xs font-medium text-aurora-700 dark:border-aurora-800 dark:bg-aurora-950/50 dark:text-aurora-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5"><path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-2 4h-4s-2-2-2-4a4 4 0 0 1 4-4z" /><path d="M8 14h8" /><path d="M8 18h4" /></svg>
            Powered by Nuvora AI
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Every tool comes with built-in AI
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Results aren't just numbers — they come with plain-English explanations, actionable fixes, and next steps.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { icon: (<Icon name="PenSquare" className="size-6" />), title: "Smart Analysis", desc: "Every tool explains its results — not just what, but why and what to do next." },
            { icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6"><path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-2 4h-4s-2-2-2-4a4 4 0 0 1 4-4z" /><path d="M8 14h8" /><path d="M8 18h4" /></svg>), title: "AI Explanations", desc: "Plain-English breakdowns of technical results. Beginner mode strips away the jargon." },
            { icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>), title: "Actionable Next Steps", desc: "Found an issue? Nuvora tells you how to fix it, step by step." },
          ].map((feature) => (
            <div key={feature.title} className="nuvora-card p-6">
              <span className="flex size-12 items-center justify-center rounded-xl bg-nuvora-100 text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">{feature.icon}</span>
              <h3 className="mt-4 font-semibold text-text-primary">{feature.title}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlagShipTools() {
  const allTools = getAllTools();
  const featured = FEATURED_TOOLS.map(f => ({ ...f, tool: allTools.find(t => t.id === f.id) })).filter(f => f.tool);
  return (
    <section className="border-b border-border-subtle">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Most popular tools</h2>
          <p className="mt-3 text-lg text-text-secondary">Production-grade tools used by developers, DevOps engineers, and security teams every day</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(({ tool, icon, gradient, label }) => (
            <Link key={tool!.id} href={tool!.url} className="group relative overflow-hidden nuvora-card p-6">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />
              <div className="absolute -right-6 -top-6 size-16 rounded-full bg-gradient-to-br from-nuvora-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-nuvora-950/50" />
              <div className="flex items-center justify-between">
                <Icon name={icon} className="size-6 text-nuvora-600 dark:text-nuvora-400" />
                <span className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-[11px] font-medium text-text-tertiary">{label}</span>
              </div>
              <h3 className="mt-4 font-semibold text-text-primary">{tool!.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-text-secondary leading-relaxed">{tool!.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-nuvora-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-nuvora-400">
                Open tool <Icon name="ArrowRight" className="size-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}



function CategoryGrid() {
  const categories = getCategories();
  return (
    <section className="border-b border-border-subtle">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Tools organized by workflow</h2>
          <p className="mt-3 text-lg text-text-secondary">From network diagnostics to image editing — find the right tool in seconds</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.filter(c => c.toolCount > 0).map((cat) => {
            const tools = getToolsByCategory(cat.slug);
            return (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="group relative overflow-hidden nuvora-card p-6">
                <div className="absolute -right-8 -top-8 size-20 rounded-full bg-nuvora-50 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-nuvora-950/30" />
                <Icon name={cat.icon} className="size-6 text-nuvora-600 dark:text-nuvora-400" />
                <h3 className="mt-3 font-semibold text-text-primary">{cat.label}</h3>
                <p className="mt-1 text-sm text-text-tertiary">{cat.toolCount} tools</p>
                <p className="mt-2 line-clamp-2 text-sm text-text-secondary leading-relaxed">{cat.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tools.slice(0, 4).map((tool) => (<span key={tool.id} className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs font-medium text-text-secondary">{tool.name}</span>))}
                  {tools.length > 4 && <span className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs text-text-tertiary">+{tools.length - 4} more</span>}
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-nuvora-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-nuvora-400">
                  Browse all <Icon name="ArrowRight" className="size-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="section-below-fold border-b border-border-subtle">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-3 text-lg text-text-secondary">Everything you need to know about Nuvora</p>
        </div>
        <div className="mt-12 space-y-4">
          {FAQ_ITEMS.slice(0, 5).map((item, i) => (
            <details key={i} className="group nuvora-card [&[open]]:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-text-primary">
                {item.question}
                <Icon name="ChevronDown" className="size-4 shrink-0 text-text-tertiary transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-border-subtle px-6 pb-4 pt-3">
                <p className="text-sm text-text-secondary leading-relaxed">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="section-below-fold border-b border-border-subtle bg-gradient-to-b from-nuvora-50/80 to-surface dark:from-nuvora-950/20 dark:to-surface">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-nuvora-200 bg-nuvora-50 px-4 py-1 text-xs font-medium text-nuvora-700 dark:border-nuvora-800 dark:bg-nuvora-950/50 dark:text-nuvora-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
          Stay updated
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Get notified about new tools</h2>
        <p className="mt-3 text-lg text-text-secondary">New tools, features, and product launches. No spam — ever. Unsubscribe anytime.</p>
        <div className="mx-auto mt-8 flex max-w-md gap-3">
          <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
          <input id="newsletter-email" type="email" placeholder="you@example.com" readOnly
            className="min-w-0 flex-1 rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-nuvora-400 focus:ring-4 focus:ring-nuvora-100 dark:focus:border-nuvora-600 dark:focus:ring-nuvora-900/30" />
          <button type="button" className="shrink-0 cursor-pointer rounded-xl bg-nuvora-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-nuvora-700 disabled:opacity-50">Subscribe</button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `${SITE_NAME} — Your Browser Can Do More — 255+ Free Tools`, description: SITE_DESCRIPTION, url: SITE_URL, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <JsonLd data={webSiteSchema()} />
      <JsonLd data={faqSchema(FAQ_ITEMS.slice(0, 5).map((item) => ({ question: item.question, answer: item.answer })))} />
      <Hero />
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <HomeSearchBar />
        </div>
      </section>
      <TrustBar />
      <AiShowcase />
      <FlagShipTools />
      <CategoryGrid />
      <FAQSection />
      <Suspense fallback={null}><RecentlyViewed /></Suspense>
      <Suspense fallback={null}><ContinueReading /></Suspense>
      <Suspense fallback={null}><PopularPaths /></Suspense>
      <Suspense fallback={null}><ToolSuites /></Suspense>
      <Suspense fallback={null}><WhyNuvora /></Suspense>
      <Newsletter />
    </>
  );
}