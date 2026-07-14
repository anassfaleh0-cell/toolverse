import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import type { Thing, WithContext } from "schema-dts";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us â€” Nuvora",
  description: "Get in touch with the Nuvora team. Send feedback, report issues, or suggest new tools. Email: hello@nuvora.dev.",
  openGraph: { title: "Contact Us â€” Nuvora", description: "Get in touch with the Nuvora team. Send feedback, report issues, or suggest new tools.", url: `${SITE_URL}/contact` },
  twitter: { card: "summary_large_image", title: "Contact Us â€” Nuvora", description: "Get in touch with the Nuvora team." },
  alternates: { canonical: `${SITE_URL}/contact` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Contact" },
];

export default function Contact() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: "Contact", description: "Get in touch with the Nuvora team.", url: `${SITE_URL}/contact`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact",
        description: "Get in touch with the Nuvora team.",
        url: `${SITE_URL}/contact`,
      } as WithContext<Thing>} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Contact Us
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Have a suggestion or question? We would love to hear from you.
        </p>
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Email us directly at <a href="mailto:hello@nuvora.dev" className="font-medium text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">hello@nuvora.dev</a>
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Find us on{" "}
            <a href="https://twitter.com/NuvoraHQ" className="font-medium text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600" target="_blank" rel="noopener noreferrer">Twitter/X</a>
            {", "}
            <a href="https://github.com/NuvoraHQ" className="font-medium text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600" target="_blank" rel="noopener noreferrer">GitHub</a>
            {" & "}
            <a href="https://linkedin.com/company/NuvoraHQ" className="font-medium text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
          </p>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
