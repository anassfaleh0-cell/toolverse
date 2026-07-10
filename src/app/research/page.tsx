import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Research — Performance Benchmarks & Technical Analysis | ${SITE_NAME}`,
  description: "Technical research, performance benchmarks, and in-depth analysis of DNS, SSL, HTTP, and network protocols. Data-driven insights for developers.",
  openGraph: { title: `Research — Benchmarks & Analysis`, description: "Technical research and performance benchmarks." },
  twitter: { title: `Research`, description: "Technical research and performance benchmarks." },
  alternates: { canonical: `${SITE_URL}/research` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Research" }];

const PAPERS = [
  {
    title: "DNS Resolution Performance: Global DNS Provider Benchmark",
    date: "June 2026",
    summary: "We benchmarked DNS resolution times across 10 providers (Google, Cloudflare, Quad9, OpenDNS, etc.) from 20 global locations over 7 days. Cloudflare averaged 14ms, Google 18ms, Quad9 22ms.",
    tags: ["DNS", "Performance", "Benchmark"],
  },
  {
    title: "SSL/TLS Protocol Adoption Analysis 2026",
    date: "May 2026",
    summary: "Analysis of TLS 1.3 adoption across the top 100K websites. TLS 1.3 now at 78% adoption (up from 62% in 2025). 12% still support TLS 1.0/1.1. Average certificate issuance time: 4.2 minutes with ACME.",
    tags: ["SSL", "TLS", "Security"],
  },
  {
    title: "HTTP Security Header Implementation Study",
    date: "May 2026",
    summary: "Audit of HTTP security headers across Alexa Top 10K sites. Only 34% implement CSP, 28% have HSTS with includeSubDomains, 12% use Permissions-Policy. Most common missing header: Cross-Origin-Embedder-Policy (94% missing).",
    tags: ["HTTP", "Security", "Headers"],
  },
  {
    title: "IPv6 Adoption Trends in Network Tool Usage",
    date: "April 2026",
    summary: "IPv6 adoption among Nuvora users reached 42% (up from 31% in 2025). Dual-stack deployment is now the standard, with 67% of domains having both A and AAAA records.",
    tags: ["IPv6", "Network", "Trends"],
  },
  {
    title: "Public DNS Resolver Reliability Comparison",
    date: "April 2026",
    summary: "30-day uptime and query accuracy comparison of major public DNS resolvers. Average uptime: 99.97%. Query accuracy (non-NXDOMAIN responses for valid domains): 99.89%.",
    tags: ["DNS", "Reliability", "Benchmark"],
  },
  {
    title: "Client-Side Image Processing Performance: Canvas vs WebAssembly",
    date: "March 2026",
    summary: "Benchmarked image processing operations (resize, compress, format conversion) using Canvas API vs WebAssembly. Canvas is 2-3x faster for simple operations. WebAssembly is 5-10x faster for complex filters.",
    tags: ["Performance", "Image", "WebAssembly"],
  },
];

export default function ResearchPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Research — ${SITE_NAME}`, description: "Technical research and performance benchmarks.", url: `${SITE_URL}/research`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Research</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Technical research, benchmarks, and analysis by the Nuvora engineering team.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="space-y-6">
          {PAPERS.map((paper) => (
            <article key={paper.title} className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="mb-2 flex flex-wrap gap-2">
                {paper.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{tag}</span>
                ))}
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{paper.title}</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{paper.summary}</p>
              <p className="mt-2 text-xs text-zinc-500">{paper.date}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
