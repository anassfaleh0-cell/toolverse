import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { BRAND } from "@/lib/nuvora/brand";

export const metadata: Metadata = {
  title: `Our Mission — ${SITE_NAME}`,
  description: `${SITE_NAME}'s mission: to empower everyone with intelligent, private, and free tools that make complex tasks simple.`,
  openGraph: { title: `Our Mission — ${SITE_NAME}`, description: BRAND.mission, url: `${SITE_URL}/our-mission` },
  alternates: { canonical: `${SITE_URL}/our-mission` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Our Mission" },
];

export default function OurMissionPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Our Mission — ${SITE_NAME}`, description: BRAND.mission, url: `${SITE_URL}/our-mission`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Our Mission
          </h1>
          <p className="mt-4 text-xl text-text-secondary leading-relaxed max-w-3xl">{BRAND.mission}</p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-12">
            {[
              {
                title: "Why Nuvora Exists",
                body: "The internet runs on infrastructure — DNS, SSL, email authentication, network protocols — but the tools to understand and debug that infrastructure are often scattered, outdated, or require installing software. We believe everyone should have access to professional-grade diagnostic tools without barriers.",
              },
              {
                title: "Privacy is Non-Negotiable",
                body: "In a world where every click is tracked and every input is harvested, Nuvora takes a different approach: all processing happens in your browser. Your data never touches a server. We don't track, we don't log, we don't sell. Privacy isn't a feature — it's the foundation.",
              },
              {
                title: "AI for Understanding, Not for Gimmicks",
                body: "Artificial intelligence should make tools more useful, not more complicated. Nuvora AI analyzes your results to explain what they mean, flag potential issues, and suggest concrete next steps. It's like having an expert looking over your shoulder — without the subscription fee.",
              },
              {
                title: "Built for the Long Term",
                body: "Nuvora is not a startup looking for a quick exit. We're building a sustainable, independent platform that will serve users for decades. Our Pro, API, and Enterprise offerings will fund free access for everyone else — forever.",
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
                <p className="mt-4 text-text-secondary leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
