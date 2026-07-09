import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Nuvora API — Programmatic Access to Smart Tools`,
  description: "Integrate Nuvora tools and analysis engines into your own applications with a simple, RESTful API. DNS lookups, SSL checks, WHOIS, and more.",
  openGraph: { title: `Nuvora API — Developer Tools API`, description: "RESTful API for all Nuvora tools. DNS, SSL, WHOIS, and analysis engines.", url: `${SITE_URL}/nuvora-api` },
  alternates: { canonical: `${SITE_URL}/nuvora-api` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Nuvora API" },
];

export default function NuvoraApiPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Nuvora API — Programmatic Access`, description: "RESTful API for Nuvora tools.", url: `${SITE_URL}/nuvora-api`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-medium text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300">
            Coming soon
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Nuvora <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">API</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            Integrate Nuvora's intelligent tool engine into your own applications. Simple REST endpoints, generous free tier, and comprehensive documentation.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { method: "GET", endpoint: "/v1/dns/lookup", desc: "Look up any DNS record type for a domain." },
              { method: "GET", endpoint: "/v1/ssl/check", desc: "Check SSL certificate details for any host." },
              { method: "GET", endpoint: "/v1/whois/lookup", desc: "Retrieve WHOIS registration data." },
              { method: "GET", endpoint: "/v1/email/auth", desc: "Check SPF, DKIM, and DMARC records." },
              { method: "POST", endpoint: "/v1/analyze", desc: "AI-powered result analysis and explanations." },
              { method: "GET", endpoint: "/v1/ping", desc: "Test latency and connectivity to any host." },
            ].map(({ method, endpoint, desc }) => (
              <div key={endpoint} className="rounded-2xl border border-border-subtle bg-surface p-5">
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-mono font-bold ${method === "GET" ? "bg-aurora-100 text-aurora-700 dark:bg-aurora-900/50 dark:text-aurora-300" : "bg-nuvora-100 text-nuvora-700 dark:bg-nuvora-900/50 dark:text-nuvora-300"}`}>{method}</span>
                  <code className="text-xs font-mono text-text-secondary">{endpoint}</code>
                </div>
                <p className="mt-2 text-sm text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
