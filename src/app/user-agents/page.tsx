import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { USER_AGENTS } from "@/lib/databases";
import { UserAgentsClient } from "./client";
import { TrustSignal } from "@/components/shared/trust-signal";

export const metadata: Metadata = {
  title: "User Agent Database — Browser UA String Reference | ToolVerse",
  description: "Comprehensive database of user agent strings for browsers, bots, mobile devices, and tools. Search by browser name, engine, OS, or category.",
  openGraph: { title: "User Agent Database — Browser UA String Reference", description: "Comprehensive database of user agent strings for browsers, bots, and mobile devices." },
  twitter: { title: "User Agent Database", description: "Comprehensive database of user agent strings." },
  alternates: { canonical: `${SITE_URL}/user-agents` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "References", href: `${SITE_URL}/resources` },
  { label: "User Agent Database" },
];

const categories = [...new Set(USER_AGENTS.map((u) => u.category))];

export default function UserAgentsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: "User Agent Database", description: "Comprehensive database of user agent strings.", url: `${SITE_URL}/user-agents`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">User Agent Database</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Comprehensive database of user agent strings for browsers, bots, mobile devices, and tools. Filter by category or browser.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <UserAgentsClient initial={USER_AGENTS} categories={categories} />
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
        <TrustSignal />
      </section>
    </>
  );
}
