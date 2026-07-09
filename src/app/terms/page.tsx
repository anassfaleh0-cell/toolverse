import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "ToolVerse Terms of Service — rules, disclaimers, and acceptable use for our free online tools and content.",
  openGraph: { title: "Terms of Service", description: "ToolVerse Terms of Service & acceptable use policy.", url: `${SITE_URL}/terms` },
  twitter: { card: "summary_large_image", title: "Terms of Service", description: "ToolVerse Terms of Service & acceptable use policy." },
  alternates: { canonical: `${SITE_URL}/terms` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Terms of Service" },
];

export default function Terms() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: "Terms of Service", description: "ToolVerse Terms of Service — rules, disclaimers, and acceptable use.", url: `${SITE_URL}/terms`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Terms of Service
        </h1>
        <div className="mt-8 space-y-6 text-zinc-600 dark:text-zinc-400">
          <p>By using ToolVerse, you agree to these terms. Please read them carefully.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Use of Service</h2>
          <p>ToolVerse provides a collection of free online tools that process input directly in your browser. Each tool is designed to perform a specific function as described on its page.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">User Conduct</h2>
          <p>You agree not to misuse the service, scrape content, or engage in any activity that disrupts the platform or violates applicable laws.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Disclaimer</h2>
          <p>ToolVerse is provided as-is. We make no warranties regarding the accuracy, reliability, or availability of the tools. We are not responsible for any damages resulting from the use of tools on this platform.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Intellectual Property</h2>
          <p>All content, tool designs, and code on ToolVerse are owned by ToolVerse unless otherwise noted. You may not reproduce, distribute, or create derivative works without permission.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Changes</h2>
          <p>We may update these terms periodically. Continued use after changes constitutes acceptance of the new terms.</p>
          <p className="text-sm text-zinc-400">Last updated: January 1, 2025</p>
        </div>
      </section>
    </>
  );
}
