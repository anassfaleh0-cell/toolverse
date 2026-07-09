import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Security — ${SITE_NAME}`,
  description: `${SITE_NAME} takes your security and privacy seriously. All processing happens in your browser. No data is ever sent to our servers.`,
  openGraph: { title: `Security — ${SITE_NAME}`, description: "All Nuvora tools process data entirely in your browser. No server uploads, no tracking, no data storage.", url: `${SITE_URL}/security` },
  alternates: { canonical: `${SITE_URL}/security` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Security" },
];

export default function SecurityPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Security — ${SITE_NAME}`, description: "Nuvora security and privacy practices.", url: `${SITE_URL}/security`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Security at {SITE_NAME}
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Your data belongs to you. We built Nuvora so it never leaves your device.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-8">
            {[
              {
                title: "Browser-Local Processing",
                body: "Every Nuvora tool runs entirely in your browser using client-side JavaScript. When you enter a domain, upload a file, or type text, that data is processed by your own computer — not our servers. This means your sensitive information never traverses the network.",
              },
              {
                title: "No Data Collection",
                body: "We don't collect, store, or transmit your tool inputs or results. We don't use tracking cookies, analytics scripts that monitor your behavior, or third-party services that could capture your data. Our analytics are privacy-preserving and anonymized.",
              },
              {
                title: "No User Accounts Required",
                body: "You don't need to create an account, sign up for a newsletter, or provide any personal information to use Nuvora. There's no database of user data to leak because there's no user data to store.",
              },
              {
                title: "Secure Connections",
                body: "All Nuvora pages are served over HTTPS with modern TLS encryption. Our API endpoints (for tools that require server-side operations like DNS lookups) are also encrypted and never log request payloads.",
              },
              {
                title: "Open Source Ethos",
                body: "We believe in transparency. Our core tool logic is available for inspection. You can verify our privacy claims by examining the code that runs in your browser. There are no hidden trackers, no data collection scripts, no surprises.",
              },
              {
                title: "Regular Audits",
                body: "We regularly review our codebase for security vulnerabilities and privacy compliance. We follow security best practices including Content Security Policy headers, strict Subresource Integrity checks, and dependency auditing.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-2xl border border-border-subtle bg-surface p-6">
                <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                <p className="mt-3 text-text-secondary leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
