import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { JsonLd } from "@/components/shared";
import { Hero } from "@/components/shared/hero";
import { HomeSearchBar } from "@/components/search/HomeSearchBar";
import { webPageSchema, breadcrumbSchema, faqSchema, organizationSchema, webSiteSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, FAQ_ITEMS, HERO_TAGLINE } from "@/lib/constants";
import { getCategories, getToolsByCategory, getAllTools } from "@/lib/registry";

const ToolSuites = dynamic(() => import("@/components/tool-suites").then((m) => ({ default: m.ToolSuites })));
const WhyNuvora = dynamic(() => import("@/components/why-nuvora").then((m) => ({ default: m.WhyNuvora })));
const RecentlyViewed = dynamic(() => import("@/components/shared/recently-viewed").then((m) => ({ default: m.RecentlyViewed })));
const ContinueReading = dynamic(() => import("@/components/shared/continue-reading").then((m) => ({ default: m.ContinueReading })));
const PopularPaths = dynamic(() => import("@/components/shared/popular-paths").then((m) => ({ default: m.PopularPaths })));

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${HERO_TAGLINE}`,
  description: SITE_DESCRIPTION,
  openGraph: { title: `${SITE_NAME} — ${HERO_TAGLINE}`, description: SITE_DESCRIPTION, url: SITE_URL },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} — ${HERO_TAGLINE}`, description: SITE_DESCRIPTION },
  alternates: { canonical: SITE_URL },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }];

const CATEGORY_ICONS: Record<string, string> = {
  "network-internet": "🌐",
  "code-dev": "💻",
  "image-design": "🎨",
  "text-writing": "📝",
  "productivity": "⚡",
  "data-analytics": "📊",
  "security": "🛡️",
  "ai": "🤖",
};

const FEATURED_TOOLS = [
  { id: "dns-lookup", icon: "🌐", gradient: "from-nuvora-500 to-aurora-500", label: "Network" },
  { id: "merge-pdf", icon: "📄", gradient: "from-red-500 to-rose-500", label: "PDF" },
  { id: "compress-pdf", icon: "🗜️", gradient: "from-orange-500 to-amber-500", label: "PDF" },
  { id: "background-remover", icon: "✨", gradient: "from-purple-500 to-violet-500", label: "Image" },
  { id: "spf-lookup", icon: "📧", gradient: "from-emerald-500 to-teal-500", label: "Email" },
  { id: "domain-report", icon: "📊", gradient: "from-cyan-500 to-blue-500", label: "Security" },
  { id: "password-generator", icon: "🔐", gradient: "from-red-500 to-pink-500", label: "Security" },
  { id: "qr-code-generator", icon: "📱", gradient: "from-zinc-500 to-slate-700", label: "Utility" },
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
            { icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>), title: "Smart Analysis", desc: "Every tool explains its results — not just what, but why and what to do next." },
            { icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6"><path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-2 4h-4s-2-2-2-4a4 4 0 0 1 4-4z" /><path d="M8 14h8" /><path d="M8 18h4" /></svg>), title: "AI Explanations", desc: "Plain-English breakdowns of technical results. Beginner mode strips away the jargon." },
            { icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>), title: "Actionable Next Steps", desc: "Found an issue? Nuvora tells you how to fix it, step by step." },
          ].map((feature) => (
            <div key={feature.title} className="group rounded-2xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-lg hover:-translate-y-0.5">
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
            <Link key={tool!.id} href={tool!.url} className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />
              <div className="absolute -right-6 -top-6 size-16 rounded-full bg-gradient-to-br from-nuvora-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-nuvora-950/50" />
              <div className="flex items-center justify-between">
                <span className="text-2xl">{icon}</span>
                <span className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-[11px] font-medium text-text-tertiary">{label}</span>
              </div>
              <h3 className="mt-4 font-semibold text-text-primary">{tool!.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-text-secondary leading-relaxed">{tool!.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-nuvora-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-nuvora-400">
                Open tool <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section-below-fold border-b border-border-subtle bg-gradient-to-b from-surface to-background">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Trusted by developers worldwide</h2>
          <p className="mt-3 text-lg text-text-secondary">From solo devs to enterprise teams — Nuvora powers millions of lookups and analysis every month.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { quote: "The DNS propagation checker is my go-to before every deploy. The AI analysis catches misconfigurations I'd miss manually.", name: "Alex Chen", role: "DevOps Engineer", initials: "AC" },
            { quote: "Having SPF, DKIM, and DMARC checks with AI-powered explanations means I can fix email issues without being a security expert.", name: "Sarah Mitchell", role: "Full-Stack Developer", initials: "SM" },
            { quote: "Background remover works entirely in-browser — no uploads to a server. That's huge for privacy.", name: "Priya Patel", role: "Product Designer", initials: "PP" },
          ].map(({ quote, name, role, initials }) => (
            <div key={name} className="group rounded-2xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-nuvora-100 text-xs font-bold text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">{initials}</div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{name}</p>
                  <p className="text-xs text-text-tertiary">{role}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (<svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>))}
                </div>
              </div>
              <p className="mt-4 text-sm text-text-secondary leading-relaxed">&ldquo;{quote}&rdquo;</p>
            </div>
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
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="absolute -right-8 -top-8 size-20 rounded-full bg-nuvora-50 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-nuvora-950/30" />
                <span className="text-2xl">{CATEGORY_ICONS[cat.slug] ?? "🔧"}</span>
                <h3 className="mt-3 font-semibold text-text-primary">{cat.label}</h3>
                <p className="mt-1 text-sm text-text-tertiary">{cat.toolCount} tools</p>
                <p className="mt-2 line-clamp-2 text-sm text-text-secondary leading-relaxed">{cat.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tools.slice(0, 4).map((tool) => (<span key={tool.id} className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs font-medium text-text-secondary">{tool.name}</span>))}
                  {tools.length > 4 && <span className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs text-text-tertiary">+{tools.length - 4} more</span>}
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-nuvora-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-nuvora-400">
                  Browse all <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
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
            <details key={i} className="group rounded-2xl border border-border-subtle bg-surface transition-all hover:shadow-sm [&[open]]:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-text-primary">
                {item.question}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 shrink-0 text-text-tertiary transition-transform group-open:rotate-180"><path d="m6 9 6 6 6-6" /></svg>
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
          <input type="email" placeholder="you@example.com" readOnly
            className="min-w-0 flex-1 rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-nuvora-400 focus:ring-4 focus:ring-nuvora-100 dark:focus:border-nuvora-600 dark:focus:ring-nuvora-900/30" />
          <span className="shrink-0 rounded-xl bg-nuvora-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-nuvora-700">Subscribe</span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `${SITE_NAME} — Smart Tools for Everything You Do`, description: SITE_DESCRIPTION, url: SITE_URL, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema()} />
      <JsonLd data={faqSchema(FAQ_ITEMS.map((item, i) => ({ question: item.question, answer: item.answer })))} />
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
      <Testimonials />
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