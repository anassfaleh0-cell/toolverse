import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import type { Thing, WithContext } from "schema-dts";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Nuvora team. Send feedback, report issues, or suggest new tools.",
  openGraph: { title: "Contact", description: "Get in touch with the Nuvora team.", url: `${SITE_URL}/contact` },
  twitter: { card: "summary_large_image", title: "Contact", description: "Get in touch with the Nuvora team." },
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
        <ContactForm />
      </section>
    </>
  );
}
