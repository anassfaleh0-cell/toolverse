import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { BRAND } from "@/lib/nuvora/brand";

export const metadata: Metadata = {
  title: `About ${SITE_NAME} — Our Story & Mission`,
  description: `${SITE_NAME} is an intelligent digital workspace providing powerful AI-powered tools for everyone. Learn about our mission, values, and team.`,
  openGraph: { title: `About ${SITE_NAME}`, description: `Learn about ${SITE_NAME}'s mission to make powerful tools accessible to everyone.`, url: `${SITE_URL}/about-nuvora` },
  alternates: { canonical: `${SITE_URL}/about-nuvora` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "About Nuvora" },
];

export default function AboutNuvoraPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `About ${SITE_NAME}`, description: `${SITE_NAME} story and mission.`, url: `${SITE_URL}/about-nuvora`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            About {SITE_NAME}
          </h1>
          <p className="mt-4 text-xl text-text-secondary">{BRAND.tagline}.</p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-text-primary">Our Story</h2>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Nuvora started with a simple observation: the most useful tools on the web were scattered across dozens of sites, each with different interfaces, different quality standards, and different privacy policies. Developers and designers had to hunt for the right tool, learn yet another interface, and hope their data stayed private.
            </p>
            <p className="mt-4 text-text-secondary leading-relaxed">
              We built Nuvora to fix that. One workspace. One design language. One privacy promise: your data never leaves your device. Every tool — from DNS lookup to PDF conversion to AI-powered analysis — is designed with the same attention to detail, the same respect for privacy, and the same commitment to quality.
            </p>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Today, Nuvora is used by developers, DevOps engineers, security professionals, designers, and students around the world. We remain 100% free, 100% browser-local, and 100% committed to our mission.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Our Values</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {BRAND.values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border-subtle bg-surface p-6">
                <h3 className="font-semibold text-text-primary">{v.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-text-primary">Why the name Nuvora?</h2>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Nuvora combines &ldquo;nova&rdquo; — a star that suddenly becomes incredibly bright — with &ldquo;nuvem,&rdquo; the Portuguese word for cloud. Together, they represent a bright, accessible constellation of tools in the cloud: powerful, visible, and always there when you need them.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
