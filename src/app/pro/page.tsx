import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { BRAND } from "@/lib/nuvora/brand";

export const metadata: Metadata = {
  title: `${SITE_NAME} Pro — Coming Soon`,
  description: `${SITE_NAME} Pro is coming soon. Advanced features, priority support, team workspaces, and custom integrations. Join the waitlist.`,
  robots: { index: false },
  openGraph: { title: `${SITE_NAME} Pro`, description: `${SITE_NAME} Pro — advanced tools, priority support, and team features. Coming soon.`, url: `${SITE_URL}/pro` },
  alternates: { canonical: `${SITE_URL}/pro` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Nuvora Pro" },
];

const proFeatures = [
  { title: "Batch Processing", description: "Run up to 100 tools at once with batch input. Process entire lists of domains, IPs, or URLs in seconds." },
  { title: "Priority Speed", description: "Dedicated processing queues for Pro users. No waiting during peak times with priority throughput." },
  { title: "Advanced Analytics", description: "Access historical data, trend charts, export reports, and custom dashboards for all your tool results." },
  { title: "API Access", description: `Full programmatic access to every tool via REST API. Integrate ${SITE_NAME} into your workflows and CI/CD pipelines.` },
  { title: "Team Workspaces", description: "Share tools, saved results, and custom configurations with your team. Role-based access and audit logging included." },
      { title: "Custom Branding", description: `Remove ${SITE_NAME} branding from tool results and embed widgets. Add your own logo and colors for client-facing use.` },
  { title: "Priority Support", description: "Get help within 4 hours via email or live chat. Dedicated account manager for Enterprise plans." },
  { title: "Extended History", description: "Unlimited result history with advanced search, tagging, and export. Never lose a past lookup again." },
  { title: "Custom Integrations", description: `Connect ${SITE_NAME} tools with Slack, Discord, Zapier, and custom webhooks. Automate your tool workflows.` },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    features: ["500 API calls/month", "Batch processing (up to 10)", "7-day history", "Email support"],
    cta: "Join Waitlist",
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    features: ["5,000 API calls/month", "Batch processing (up to 100)", "Unlimited history", "Priority support", "API access"],
    cta: "Join Waitlist",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: ["Unlimited API calls", "Team workspaces (up to 25 seats)", "Custom branding", "Custom integrations", "Dedicated account manager", "SLA guarantee"],
    cta: "Contact Us",
  },
];

export default function ProPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `${SITE_NAME} Pro — Coming Soon`, description: `${SITE_NAME} Pro advanced features coming soon.`, url: `${SITE_URL}/pro`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <span className="inline-block rounded-full bg-nuvora-100 px-3 py-1 text-xs font-semibold text-nuvora-700 dark:bg-nuvora-900/40 dark:text-nuvora-300">
            Coming Soon
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            {SITE_NAME} Pro
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Powerful features for professionals and teams. {BRAND.products.pro.description}
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Features</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border-subtle bg-surface p-6">
                <h3 className="font-semibold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Pricing</h2>
          <p className="mt-2 text-sm text-text-secondary">Choose the plan that fits your needs. All prices are in USD.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-6 ${
                  tier.highlighted
                    ? "border-nuvora-500 bg-nuvora-50/50 shadow-lg dark:border-nuvora-600 dark:bg-nuvora-950/30"
                    : "border-border-subtle bg-surface"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-nuvora-600 px-3 py-0.5 text-xs font-semibold text-white">
                    Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-text-primary">{tier.name}</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-text-primary">{tier.price}</span>
                  <span className="text-sm text-text-secondary">{tier.period}</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {tier.features.map((f) => <li key={f} className="text-sm text-text-secondary">&bull; {f}</li>)}
                </ul>
                <button className="mt-6 w-full rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center">
            <h2 className="text-2xl font-bold text-text-primary">Join the Waitlist</h2>
            <p className="mt-2 text-sm text-text-secondary">Be the first to know when {SITE_NAME} Pro launches. Get early access and a special launch discount.</p>
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
