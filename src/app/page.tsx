import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/shared";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import { BRAND } from "@/lib/nuvora/brand";
import { ToolSuites } from "@/components/tool-suites";
import { WhyToolverse } from "@/components/why-toolverse";
import { RecentlyViewed } from "@/components/shared/recently-viewed";
import { ContinueReading } from "@/components/shared/continue-reading";
import { PopularPaths } from "@/components/shared/popular-paths";
import { getCategories, getToolsByCategory, getAllTools, getRegisteredToolCount } from "@/lib/registry";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Smart Tools for Everything You Do`,
  description: SITE_DESCRIPTION,
  openGraph: { title: `${SITE_NAME} — Smart Tools for Everything You Do`, description: SITE_DESCRIPTION, url: SITE_URL },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} — Smart Tools for Everything You Do`, description: SITE_DESCRIPTION },
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

function Hero() {
  const toolCount = getRegisteredToolCount();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface to-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(35%_35%_at_50%_55%,rgba(99,102,241,0.07),transparent)] dark:bg-[radial-gradient(35%_35%_at_50%_55%,rgba(99,102,241,0.12),transparent)]" />
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-32">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-nuvora-200 bg-nuvora-50/80 px-4 py-1.5 text-xs font-medium text-nuvora-700 backdrop-blur-sm dark:border-nuvora-800 dark:bg-nuvora-950/50 dark:text-nuvora-300">
            <span className="flex size-2 rounded-full bg-nuvora-500" />
            Nuvora — {toolCount} free tools, powered by privacy-first AI
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Smart tools for{" "}
            <span className="bg-gradient-to-r from-nuvora-500 via-nuvora-600 to-aurora-500 bg-clip-text text-transparent dark:from-nuvora-400 dark:via-nuvora-300 dark:to-aurora-400">
              everything you do
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-text-secondary">
            DNS diagnostics, PDF conversion, AI-powered analysis, image editing, security checks, and developer utilities — all in one intelligent workspace. No signup. No tracking. Nothing leaves your browser.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <div className="group relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-text-tertiary">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                placeholder="Search tools... (e.g., DNS Lookup, Merge PDF, Background Remover)"
                className="w-full rounded-2xl border border-border-subtle bg-surface py-4 pl-12 pr-4 text-base shadow-sm outline-none transition-all focus:border-nuvora-400 focus:ring-4 focus:ring-nuvora-100 dark:focus:border-nuvora-600 dark:focus:ring-nuvora-900/30"
                readOnly
              />
              <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-border-subtle bg-surface-secondary px-1.5 py-0.5 text-[11px] text-text-tertiary sm:block">
                Ctrl+K
              </kbd>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-text-tertiary">Quick actions:</span>
            {[
              { href: "/merge-pdf", label: "Merge PDF" },
              { href: "/compress-pdf", label: "Compress PDF" },
              { href: "/background-remover", label: "Remove Background" },
              { href: "/spf-lookup", label: "SPF Lookup" },
              { href: "/dns-lookup", label: "DNS Lookup" },
              { href: "/password-generator", label: "Password Gen" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-full border border-border-subtle bg-surface px-3.5 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-nuvora-300 hover:text-nuvora-600 hover:shadow-sm dark:hover:border-nuvora-700 dark:hover:text-nuvora-400"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-4 gap-6 border-t border-border-subtle pt-8">
          {[
            { value: `${toolCount}+`, label: "Free Tools" },
            { value: "100%", label: "Privacy-First" },
            { value: "7+", label: "Tool Categories" },
            { value: "AI", label: "Smart Analysis" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-tertiary">{stat.label}</p>
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
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-aurora-200 bg-aurora-50 px-4 py-1 text-xs font-medium text-aurora-700 dark:border-aurora-800 dark:bg-aurora-950/50 dark:text-aurora-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5"><path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-2 4h-4s-2-2-2-4a4 4 0 0 1 4-4z" /><path d="M8 14h8" /><path d="M8 18h4" /></svg>
            Powered by Nuvora AI
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              ),
              title: "Smart Analysis",
              desc: "Every tool explains its results — not just what, but why and what to do next.",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6"><path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-2 4h-4s-2-2-2-4a4 4 0 0 1 4-4z" /><path d="M8 14h8" /><path d="M8 18h4" /></svg>
              ),
              title: "AI Explanations",
              desc: "Get plain-English breakdowns of technical results. Beginner mode strips away the jargon.",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
              ),
              title: "Actionable Next Steps",
              desc: "Found an issue? Nuvora tells you how to fix it, step by step.",
            },
          ].map((feature) => (
            <div key={feature.title} className="group rounded-2xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-md hover:-translate-y-0.5">
              <span className="flex size-12 items-center justify-center rounded-xl bg-nuvora-100 text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">
                {feature.icon}
              </span>
              <h3 className="mt-4 font-semibold text-text-primary">{feature.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/nuvora-ai"
            className="inline-flex items-center gap-2 rounded-xl bg-nuvora-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-nuvora-700 active:scale-[0.97]"
          >
            Learn about Nuvora AI
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FlagShipTools() {
  const allTools = getAllTools();
  const flagships = [
    { id: "dns-lookup", icon: "🌐", color: "from-nuvora-500 to-aurora-500" },
    { id: "merge-pdf", icon: "📄", color: "from-red-500 to-rose-500" },
    { id: "compress-pdf", icon: "🗜️", color: "from-orange-500 to-amber-500" },
    { id: "background-remover", icon: "✨", color: "from-purple-500 to-violet-500" },
    { id: "spf-lookup", icon: "📧", color: "from-emerald-500 to-teal-500" },
    { id: "domain-report", icon: "📊", color: "from-cyan-500 to-blue-500" },
    { id: "password-generator", icon: "🔐", color: "from-red-500 to-pink-500" },
    { id: "qr-code-generator", icon: "📱", color: "from-zinc-600 to-zinc-800" },
  ];

  const featured = flagships.map(f => ({ ...f, tool: allTools.find(t => t.id === f.id) })).filter(f => f.tool);

  return (
    <section className="border-b border-border-subtle">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Flagship tools
          </h2>
          <p className="mt-3 text-text-secondary">
            Production-grade tools used by developers, DevOps engineers, and security teams every day
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(({ tool, icon, color }) => (
            <Link
              key={tool!.id}
              href={tool!.url}
              className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
              <span className="text-2xl">{icon}</span>
              <h3 className="mt-3 font-semibold text-text-primary">{tool!.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-text-secondary">{tool!.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-nuvora-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-nuvora-400">
                Open tool
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
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
    <section className="border-b border-border-subtle bg-gradient-to-b from-surface to-background">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Trusted by developers worldwide
          </h2>
          <p className="mt-3 text-text-secondary">
            From solo devs to enterprise teams — Nuvora powers millions of lookups and analysis every month.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              quote: "The DNS propagation checker is my go-to before every deploy. The AI analysis catches misconfigurations I'd miss manually.",
              name: "Alex Chen",
              role: "DevOps Engineer",
            },
            {
              quote: "Having SPF, DKIM, and DMARC checks with AI-powered explanations means I can fix email issues without being a security expert.",
              name: "Sarah Mitchell",
              role: "Full-Stack Developer",
            },
            {
              quote: "Background remover works entirely in-browser — no uploads to a server. That's huge for privacy. The AI model is surprisingly fast.",
              name: "Priya Patel",
              role: "Product Designer",
            },
          ].map(({ quote, name, role }) => (
            <div key={name} className="rounded-2xl border border-border-subtle bg-surface p-6">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="mt-3 text-sm text-text-secondary">&ldquo;{quote}&rdquo;</p>
              <p className="mt-4 text-xs font-medium text-text-primary">{name}</p>
              <p className="text-[11px] text-text-tertiary">{role}</p>
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
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Tools organized by workflow
          </h2>
          <p className="mt-3 text-text-secondary">
            From network diagnostics to image editing — find the right tool in seconds
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.filter(c => c.toolCount > 0).map((cat) => {
            const tools = getToolsByCategory(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group rounded-2xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="text-2xl">{CATEGORY_ICONS[cat.slug] ?? "🔧"}</span>
                <h3 className="mt-3 font-semibold text-text-primary">{cat.label}</h3>
                <p className="mt-1 text-sm text-text-tertiary">{cat.toolCount} tools</p>
                <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{cat.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tools.slice(0, 4).map((tool) => (
                    <span key={tool.id} className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs text-text-secondary">
                      {tool.name}
                    </span>
                  ))}
                  {tools.length > 4 && (
                    <span className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs text-text-tertiary">
                      +{tools.length - 4} more
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-nuvora-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-nuvora-400">
                  Browse all
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="border-b border-border-subtle">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Stay in the loop
        </h2>
        <p className="mt-3 text-text-secondary">
          Get notified about new tools, features, and Nuvora product launches. No spam — ever.
        </p>
        <div className="mx-auto mt-8 flex max-w-md gap-3">
          <input
            type="email"
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-nuvora-400 focus:ring-4 focus:ring-nuvora-100 dark:focus:border-nuvora-600 dark:focus:ring-nuvora-900/30"
            readOnly
          />
          <span className="shrink-0 rounded-xl bg-nuvora-600 px-5 py-3 text-sm font-semibold text-white opacity-60">
            Subscribe
          </span>
        </div>
        <p className="mt-3 text-xs text-text-tertiary">No spam, unsubscribe anytime. 1-2 emails per month.</p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `${SITE_NAME} — Smart Tools for Everything You Do`, description: SITE_DESCRIPTION, url: SITE_URL, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <Hero />
      <AiShowcase />
      <FlagShipTools />
      <CategoryGrid />
      <Testimonials />
      <RecentlyViewed />
      <ContinueReading />
      <PopularPaths />
      <ToolSuites />
      <WhyToolverse />
      <Newsletter />
    </>
  );
}
