import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "ToolVerse Terms of Service — rules, disclaimers, and acceptable use for our free online tools and content.",
  openGraph: { title: "Terms of Service", description: "ToolVerse Terms of Service & acceptable use policy.", url: `${SITE_URL}/terms` },
  twitter: { card: "summary_large_image", title: "Terms of Service", description: "ToolVerse Terms of Service & acceptable use policy." },
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function Terms() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Terms of Service
      </h1>
      <div className="mt-8 space-y-6 text-zinc-600 dark:text-zinc-400">
        <p>
          By using ToolVerse, you agree to these terms. Please read them
          carefully.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Use of Service
        </h2>
        <p>
          ToolVerse provides a directory of online tools. We do not host or
          operate the listed tools. Each tool is provided by its respective
          owner and subject to their own terms.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          User Conduct
        </h2>
        <p>
          You agree not to misuse the service, scrape content, or engage in any
          activity that disrupts the platform or violates applicable laws.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Disclaimer
        </h2>
        <p>
          ToolVerse is provided as-is. We make no warranties regarding the
          accuracy, reliability, or availability of the listed tools. We are not
          responsible for any damages resulting from the use of third-party
          tools.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Changes
        </h2>
        <p>
          We reserve the right to update these terms at any time. Continued use
          of the site after changes constitutes acceptance of the new terms.
        </p>
      </div>
    </section>
  );
}
