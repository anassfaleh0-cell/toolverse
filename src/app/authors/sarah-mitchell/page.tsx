import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Sarah Mitchell — Web Security Researcher at ${SITE_NAME} | ${SITE_NAME}`,
  description: `Sarah Mitchell is a Web Security Researcher at ${SITE_NAME} with 8 years of experience, OWASP contributor. She builds SSL Certificate Checker, HTTP Headers Checker, and TLS tools.`,
  alternates: { canonical: `${SITE_URL}/authors/sarah-mitchell` },
  openGraph: {
    title: `Sarah Mitchell — Web Security Researcher at ${SITE_NAME}`,
    description: `Learn about Sarah Mitchell, the security researcher behind ${SITE_NAME}'s SSL, TLS, and HTTP security checking tools.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Authors", href: `${SITE_URL}/authors` },
  { label: "Sarah Mitchell" },
];

const contributions = [
  { name: "SSL Certificate Checker", href: "/ssl-checker" },
  { name: "HTTP Headers Checker", href: "/http-headers-checker" },
  { name: "TLS Versions", href: "/tls-versions" },
];

export default function SarahMitchellPage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Sarah Mitchell",
        jobTitle: "Web Security Researcher",
        worksFor: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        url: `${SITE_URL}/authors/sarah-mitchell`,
        description: "Web Security Researcher at Nuvora with 8 years of experience, OWASP contributor. Builds SSL, TLS, and HTTP security checking tools.",
        knowsAbout: ["SSL/TLS", "Web Security", "Cryptography", "OWASP", "HTTP Security Headers"],
      }} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-6 flex items-start gap-6">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600 dark:bg-green-900 dark:text-green-400">
              SM
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Sarah Mitchell
              </h1>
              <p className="mt-1 text-lg font-medium text-green-600 dark:text-green-400">
                Web Security Researcher
              </p>
              <div className="mt-4">
                <SocialShare url={`${SITE_URL}/authors/sarah-mitchell`} title={`Sarah Mitchell — Web Security Researcher at ${SITE_NAME}`} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-6 text-zinc-600 dark:text-zinc-400">
            <p>
              Sarah Mitchell is a Web Security Researcher at Nuvora with 8 years of experience in web application security, SSL/TLS protocols, and cryptographic standards. She is an active contributor to the Open Web Application Security Project (OWASP), where she has contributed to the OWASP Top Ten, the OWASP Testing Guide, and several security cheat sheets that are referenced by security professionals worldwide.
            </p>
            <p>
              Before joining Nuvora, Sarah worked as a security engineer at several fintech companies, where she conducted penetration testing, security audits, and vulnerability assessments for web applications handling sensitive financial data. She holds the Certified Information Systems Security Professional (CISSP) certification and has presented at security conferences including BSides and OWASP AppSec on topics ranging from TLS 1.3 adoption to HTTP security headers.
            </p>
            <p>
              At Nuvora, Sarah is responsible for all security-related tools and content. She built the SSL Certificate Checker from the ground up, implementing raw TLS connections that validate certificate chains, check expiration dates, and verify Subject Alternative Names against industry standards. She also developed the HTTP Headers Checker, which evaluates security headers like Content-Security-Policy, Strict-Transport-Security, and X-Frame-Options against OWASP recommendations.
            </p>
            <p>
              Sarah is committed to demystifying web security for developers and system administrators. Through her guides on SSL/TLS best practices, security header configuration, and certificate lifecycle management, she helps teams build more secure web applications. Her work at Nuvora reflects her belief that security tools should be accessible, accurate, and free for everyone.
            </p>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Contributions
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              Tools built and maintained by Sarah at Nuvora:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {contributions.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="rounded-lg border border-zinc-200 p-4 text-sm transition-colors hover:border-green-300 dark:border-zinc-800 dark:hover:border-green-700"
                >
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">{tool.name}</span>
                  <span className="mt-1 block text-zinc-600 dark:text-zinc-400">Use the {tool.name} tool →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
