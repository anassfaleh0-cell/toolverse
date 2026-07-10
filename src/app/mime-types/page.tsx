import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { MIME_TYPES } from "@/lib/databases";
import { MimeTypesClient } from "./client";
import { TrustSignal } from "@/components/shared/trust-signal";

export const metadata: Metadata = {
  title: "MIME Types Reference — Complete List of Media Types | Nuvora",
  description: "Complete reference of MIME types (media types) organized by category. Includes text, image, audio, video, application, and font MIME types with file extensions.",
  openGraph: { title: "MIME Types Reference — Complete List", description: "Complete reference of MIME types organized by category." },
  twitter: { title: "MIME Types Reference", description: "Complete reference of MIME types organized by category." },
  alternates: { canonical: `${SITE_URL}/mime-types` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "References", href: `${SITE_URL}/resources` },
  { label: "MIME Types" },
];

const categories = [...new Set(MIME_TYPES.map((e) => e.category))];

export default function MimeTypesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: "MIME Types Reference", description: "Complete reference of MIME types organized by category.", url: `${SITE_URL}/mime-types`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">MIME Types Reference</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Complete reference of MIME types organized by category. Search by file extension, MIME type, or category.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <MimeTypesClient initial={MIME_TYPES} categories={categories} />
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8 text-center sm:px-6">
        <TrustSignal />
      </section>
    </>
  );
}
