import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Open Source — Nuvora Is Built in Public`,
  description: "Nuvora is built in public. View our open source philosophy, contributing guidelines, and how we build free online tools transparently.",
  openGraph: { title: `Open Source — Built in Public`, description: "Nuvora is built in public. View our open source philosophy." },
  twitter: { title: `Open Source`, description: "Nuvora is built in public." },
  alternates: { canonical: `${SITE_URL}/open-source` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Open Source" }];

const REPOS = [
  { name: "Nuvora Core", url: "https://github.com/Nuvora/Nuvora", desc: "Main repository with all tools, pages, and infrastructure. Next.js 16 + TypeScript + Tailwind v4.", stars: "1.2k", language: "TypeScript" },
  { name: "DNS Libraries", url: "#", desc: "Shared DNS resolution libraries used by DNS Lookup, Propagation Checker, and other network tools.", language: "TypeScript" },
  { name: "IP Utilities", url: "#", desc: "IP address parsing, validation, and geolocation utilities.", language: "TypeScript" },
  { name: "SSL/TLS Tooling", url: "#", desc: "Certificate parsing, validation, and chain verification libraries.", language: "TypeScript" },
  { name: "Image Processing", url: "#", desc: "Client-side image manipulation utilities for the Image Suite tools.", language: "TypeScript" },
];

export default function OpenSourcePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Open Source — ${SITE_NAME}`, description: "Nuvora is built in public.", url: `${SITE_URL}/open-source`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Open Source</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Nuvora is built in public. Every tool, every component, every line of code is open for the world to see, use, and improve.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">Our Philosophy</h2>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">We believe tools should be free, transparent, and auditable. By building in public, we ensure our tools are trustworthy, our code is reviewed by the community, and anyone can contribute improvements. No proprietary secrets, no hidden data collection, no vendor lock-in.</p>

        <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">Repositories</h2>
        <div className="space-y-4">
          {REPOS.map((repo) => (
            <a key={repo.name} href={repo.url} target="_blank" rel="noopener" className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400">{repo.name}</h3>
                {"stars" in repo && <span className="text-sm text-zinc-500">★ {(repo as { stars: string }).stars}</span>}
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{repo.desc}</p>
              <span className="mt-2 inline-block rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{repo.language}</span>
            </a>
          ))}
        </div>

        <h2 className="mb-4 mt-12 text-xl font-bold text-zinc-900 dark:text-zinc-100">Contributing</h2>
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">We welcome contributions of all kinds — bug fixes, new tools, documentation improvements, and feature suggestions.</p>
        <ol className="ml-6 list-decimal space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Fork the repository</li>
          <li>Create a feature branch</li>
          <li>Make your changes</li>
          <li>Run lint and build checks</li>
          <li>Submit a pull request</li>
        </ol>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Licensed under the MIT License. See the LICENSE file in each repository for details.
          </p>
        </div>
      </section>
    </>
  );
}
