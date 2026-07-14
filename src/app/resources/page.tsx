import type { Metadata } from "next";
import Link from "next/link";
import { getAllContent, getGuides, getArticles, getComparisons, getBeginnerGuides } from "@/lib/content/registry";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Resources - ${SITE_NAME}`,
  description: `Complete library of network tool guides, tutorials, articles, and comparisons. Everything you need to master DNS, SSL, network diagnostics, and web security.`,
  openGraph: { title: `Resources - ${SITE_NAME}`, description: `Network tool resource library.` },
  twitter: { title: `Resources - ${SITE_NAME}`, description: `Network tool resource library.` },
  alternates: { canonical: `${SITE_URL}/resources` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Resources" }];

export default function ResourcesPage() {
  const total = getAllContent().length;
  const guides = getGuides();
  const articles = getArticles();
  const comparisons = getComparisons();
  const beginner = getBeginnerGuides();

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Resources - ${SITE_NAME}`, description: "Complete network tool resource library.", url: `${SITE_URL}/resources`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Resources</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            A library of {total}+ guides, tutorials, articles, and comparisons to help you master network diagnostics, DNS, SSL/TLS, and web security.
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2">
            <Link href="/guides" className="group rounded-lg border border-zinc-200 p-6 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-700">Guides</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">{guides.length} troubleshooting guides and tutorials</p>
            </Link>
            <Link href="/learn" className="group rounded-lg border border-zinc-200 p-6 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-700">Learn</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">{beginner.length} beginner-friendly guides</p>
            </Link>
            <Link href="/blog" className="group rounded-lg border border-zinc-200 p-6 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-700">Blog</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">{articles.length} technical articles</p>
            </Link>
            <Link href="/compare" className="group rounded-lg border border-zinc-200 p-6 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-700">Comparisons</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">{comparisons.length} tool and protocol comparisons</p>
            </Link>
          </div>
        </div>
      </section>
      <section className="border-t border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Topic Clusters</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/dns-lookup" className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">DNS & Domain Management</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">DNS Lookup, Reverse DNS, Propagation, WHOIS</p>
            </Link>
            <Link href="/what-is-my-ip" className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">IP & Geolocation</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">What Is My IP, IP Lookup</p>
            </Link>
            <Link href="/ssl-certificate-checker" className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Website Security & Performance</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">SSL Checker, HTTP Headers, Status Checker</p>
            </Link>
            <Link href="/ping-test" className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Network Connectivity</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Ping Test, Port Checker</p>
            </Link>
            <Link href="/user-agent-parser" className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Browser & Client Info</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">User Agent Parser</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
