import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { HTTP_HEADERS } from "@/lib/databases";
import { HttpHeadersClient } from "./client";
import { TrustSignal } from "@/components/shared/trust-signal";

export const metadata: Metadata = {
  title: "HTTP Headers Reference — Complete List of HTTP Headers | Nuvora",
  description: "Complete reference of HTTP request, response, general, entity, CORS, and security headers. Includes descriptions, examples, and RFC specifications.",
  openGraph: { title: "HTTP Headers Reference — Complete List", description: "Complete reference of HTTP headers with descriptions and examples." },
  twitter: { title: "HTTP Headers Reference", description: "Complete reference of HTTP headers with descriptions and examples." },
  alternates: { canonical: `${SITE_URL}/http-headers` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "References", href: `${SITE_URL}/resources` },
  { label: "HTTP Headers" },
];

const categories = [...new Set(HTTP_HEADERS.map((h) => h.category))];

export default function HttpHeadersPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: "HTTP Headers Reference", description: "Complete reference of HTTP headers with descriptions and examples.", url: `${SITE_URL}/http-headers`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">HTTP Headers Reference</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Complete reference of HTTP headers organized by category. Includes descriptions, examples, and RFC specifications.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <HttpHeadersClient initial={HTTP_HEADERS} categories={categories} />
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8 text-center sm:px-6">
        <TrustSignal />
      </section>
    </>
  );
}
