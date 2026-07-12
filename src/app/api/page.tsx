import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { BRAND } from "@/lib/nuvora/brand";

export const metadata: Metadata = {
  title: `Nuvora API — Coming Soon`,
  description: `${SITE_NAME} API is coming soon. Programmatic access to all tools — DNS lookup, SSL checker, WHOIS, PDF conversion, and more. RESTful endpoints with simple authentication.`,
  robots: { index: false },
  openGraph: { title: `Nuvora API`, description: `${SITE_NAME} API for developers. Programmatic access to all free online tools. Coming soon.`, url: `${SITE_URL}/api` },
  alternates: { canonical: `${SITE_URL}/api` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Nuvora API" },
];

const apiFeatures = [
      { title: "RESTful Endpoints", description: `Clean, predictable REST API for every tool on ${SITE_NAME}. Consistent request/response formats across all endpoints.` },
  { title: "Simple Authentication", description: "API key-based authentication. Generate keys from your dashboard with granular permissions and usage limits." },
      { title: "All Tools Accessible", description: `Every tool available on ${SITE_NAME} is accessible via API. DNS lookup, SSL checker, WHOIS, PDF tools, image converters, and more.` },
  { title: "Batch Operations", description: "Submit up to 1,000 items in a single batch request. Process entire lists efficiently without rate limiting." },
  { title: "Webhook Support", description: "Receive results via webhooks for asynchronous processing. Perfect for CI/CD pipelines and automated workflows." },
  { title: "SDKs & Libraries", description: "Official client libraries for JavaScript/TypeScript, Python, Go, and Rust. Open-source and community-maintained." },
  { title: "Usage Analytics", description: "Monitor your API usage, response times, error rates, and monthly quotas from your developer dashboard." },
  { title: "Free Tier Included", description: "Every API plan includes a generous free tier. Pay only when you need higher limits or priority throughput." },
];

export default function ApiPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `${SITE_NAME} API — Coming Soon`, description: `${SITE_NAME} API for developers. Coming soon.`, url: `${SITE_URL}/api`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <span className="inline-block rounded-full bg-nuvora-100 px-3 py-1 text-xs font-semibold text-nuvora-700 dark:bg-nuvora-900/40 dark:text-nuvora-300">
            Coming Soon
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            {SITE_NAME} API
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            {BRAND.products.api.description}
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">API Features</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apiFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border-subtle bg-surface p-6">
                <h3 className="font-semibold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-text-primary">Documentation</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Full API documentation is coming soon. It will include endpoint references, code examples in multiple languages, authentication guides, and rate limiting details.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border-subtle bg-surface p-4 text-center">
                <p className="text-2xl font-bold text-nuvora-600">30+</p>
                <p className="text-xs text-text-secondary">Endpoints</p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-surface p-4 text-center">
                <p className="text-2xl font-bold text-nuvora-600">4</p>
                <p className="text-xs text-text-secondary">SDK Languages</p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-surface p-4 text-center">
                <p className="text-2xl font-bold text-nuvora-600">99.9%</p>
                <p className="text-xs text-text-secondary">Uptime SLA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center">
            <h2 className="text-2xl font-bold text-text-primary">Get Early Access</h2>
            <p className="mt-2 text-sm text-text-secondary">Sign up to receive API documentation, SDK releases, and launch updates directly to your inbox.</p>
            <form className="mx-auto mt-6 flex max-w-md gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-border-subtle bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-nuvora-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-nuvora-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-nuvora-700"
              >
                Notify Me
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
