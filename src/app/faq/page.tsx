import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Frequently Asked Questions — ${SITE_NAME}`,
  description: `Find answers to common questions about ${SITE_NAME}. Learn how our free browser-based tools work, privacy practices, data handling, and more.`,
  openGraph: {
    title: `Frequently Asked Questions — ${SITE_NAME}`,
    description: `Find answers to common questions about ${SITE_NAME}. Learn how our free browser-based tools work, privacy practices, data handling, and more.`,
    url: `${SITE_URL}/faq`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Frequently Asked Questions — ${SITE_NAME}`,
    description: `Find answers to common questions about ${SITE_NAME}. Learn how our free browser-based tools work, privacy practices, data handling, and more.`,
  },
  alternates: { canonical: `${SITE_URL}/faq` },
};

const faqs = [
  {
    question: "What is Nuvora?",
    answer:
      `${SITE_NAME} is a collection of 300+ free online tools that run entirely in your browser. From SEO analysis and network diagnostics to image editing and PDF manipulation, our tools are designed to help you work smarter without installing software or sharing your data with external servers.`,
  },
  {
    question: "Are the tools really free?",
    answer:
      "Yes, every tool on Nuvora is completely free to use. There are no paid tiers, no credit card required, and no usage limits. We are committed to keeping our tools accessible to everyone.",
  },
  {
    question: "Do I need an account or signup?",
    answer:
      "No account or signup is required. All tools are available instantly without registration. We believe in frictionless access to utility tools.",
  },
  {
    question: "Is my data safe when using Nuvora tools?",
    answer:
      "Yes. Most tools process your data entirely in your browser using client-side JavaScript and WebAssembly. Your files and data are never uploaded to our servers. For tools that require server-side processing (like DNS lookups or WHOIS queries), we only transmit the minimum data needed to perform the lookup, and we do not store query results.",
  },
  {
    question: "Does Nuvora track me or my usage?",
    answer:
      "We use privacy-preserving analytics (Plausible) that does not use cookies or collect personal data. We do not track individual users, and we do not sell or share your data with third parties. Our privacy policy details exactly what data we collect and how it is used.",
  },
  {
    question: "How do browser-based tools work?",
    answer:
      "Our tools use modern web technologies including WebAssembly, Canvas APIs, and client-side JavaScript to process data entirely in your browser. For example, our PDF tools use pdf-lib compiled to WebAssembly, and our video converter uses FFmpeg.wasm. This means your files never leave your device.",
  },
  {
    question: "What browsers are supported?",
    answer:
      "Nuvora works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience. Some advanced features (like WebAssembly-based tools) require a modern browser with WebAssembly support, which all major browsers provide.",
  },
  {
    question: "Can I use Nuvora offline?",
    answer:
      "Some tools require an internet connection to load from our servers. However, once loaded, many tools (especially those using client-side processing) can function without an active connection. We are exploring progressive web app capabilities to improve offline support.",
  },
  {
    question: "Does Nuvora use cookies?",
    answer:
      "We use minimal cookies for essential functionality only: a cookie to remember your theme preference (light/dark) and a cookie to track your cookie consent choice. We do not use tracking cookies, advertising cookies, or third-party analytics cookies. Our analytics provider (Plausible) is cookie-free by design.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "Data processed by client-side tools never leaves your device. For server-processed tools (like DNS or WHOIS lookups), query parameters are transmitted to our API endpoints, but results are not stored long-term. We do not maintain databases of user queries or uploaded content.",
  },
  {
    question: "How can I suggest a new tool?",
    answer:
      "We love hearing from our users! You can suggest new tools or features by visiting our Contact page or emailing us directly at hello@nuvora.dev. We review all suggestions and prioritize tools that benefit the widest audience.",
  },
  {
    question: "How do you ensure tool accuracy?",
    answer:
      "Our tools are built using reliable libraries and APIs with clear provenance. Network tools use established protocols (DNS, WHOIS, RDAP). Cryptographic tools use the Web Crypto API. We test our tools regularly and welcome bug reports to ensure accuracy.",
  },
  {
    question: "Can I use Nuvora tools for commercial purposes?",
    answer:
      "Yes, all tools on Nuvora are free for both personal and commercial use. There are no licensing restrictions or attribution requirements. We only ask that you do not abuse our API endpoints or attempt to reverse-engineer our tools.",
  },
  {
    question: "How do I report a bug or issue?",
    answer:
      "Please use our Contact form or email hello@nuvora.dev with details about the issue you encountered. Include the tool name, your browser and operating system, and steps to reproduce the problem. We aim to respond within 48 hours.",
  },
  {
    question: "Will you ever add paid features?",
    answer:
      "We are committed to keeping the core functionality of all tools free forever. If we introduce any premium features in the future, they will be additive — never replacing existing free functionality.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "FAQ" },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={webPageSchema({ name: "FAQ", description: `Frequently asked questions about ${SITE_NAME}.`, url: `${SITE_URL}/faq`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Everything you need to know about Nuvora tools, privacy, and more.
        </p>
        <div className="mt-12 space-y-8">
          {faqs.map((faq, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {faq.question}
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
