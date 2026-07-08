import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the ToolVerse team. Send feedback, report issues, or suggest new tools.",
  openGraph: { title: "Contact", description: "Get in touch with the ToolVerse team.", url: `${SITE_URL}/contact` },
  twitter: { card: "summary_large_image", title: "Contact", description: "Get in touch with the ToolVerse team." },
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function Contact() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Contact Us
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Have a suggestion or question? We would love to hear from you.
      </p>
      <ContactForm />
    </section>
  );
}
