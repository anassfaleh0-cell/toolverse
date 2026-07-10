import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Alex Chen — Senior Network Engineer at ${SITE_NAME} | ${SITE_NAME}`,
  description: `Alex Chen is a Senior Network Engineer at ${SITE_NAME} with 12 years of infrastructure experience, ex-Cloudflare. He builds DNS Lookup, Ping Test, Port Checker, and more.`,
  alternates: { canonical: `${SITE_URL}/authors/alex-chen` },
  openGraph: {
    title: `Alex Chen — Senior Network Engineer at ${SITE_NAME}`,
    description: `Learn about Alex Chen, the network engineer behind ${SITE_NAME}'s DNS, network diagnostic, and infrastructure tools.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Authors", href: `${SITE_URL}/authors` },
  { label: "Alex Chen" },
];

const contributions = [
  { name: "DNS Lookup", href: "/dns-lookup" },
  { name: "DNS Propagation Checker", href: "/dns-propagation" },
  { name: "Reverse DNS", href: "/reverse-dns" },
  { name: "Ping Test", href: "/ping-test" },
  { name: "Port Checker", href: "/port-checker" },
  { name: "Subnet Calculator", href: "/subnet-calculator" },
];

export default function AlexChenPage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Alex Chen",
        jobTitle: "Senior Network Engineer",
        worksFor: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        url: `${SITE_URL}/authors/alex-chen`,
        description: "Senior Network Engineer at Nuvora with 12 years of infrastructure experience, ex-Cloudflare. Builds DNS, network diagnostic, and infrastructure tools.",
        knowsAbout: ["DNS", "BGP Routing", "Network Security", "Infrastructure", "Cloudflare"],
      }} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-6 flex items-start gap-6">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              AC
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Alex Chen
              </h1>
              <p className="mt-1 text-lg font-medium text-blue-600 dark:text-blue-400">
                Senior Network Engineer
              </p>
              <div className="mt-4">
                <SocialShare url={`${SITE_URL}/authors/alex-chen`} title={`Alex Chen — Senior Network Engineer at ${SITE_NAME}`} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-6 text-zinc-600 dark:text-zinc-400">
            <p>
              Alex Chen is a Senior Network Engineer at Nuvora with over 12 years of experience designing, building, and maintaining large-scale network infrastructure. Before joining Nuvora, Alex spent five years at Cloudflare, where he worked on the global Anycast network, DNS infrastructure, and DDoS mitigation systems that handle millions of requests per second.
            </p>
            <p>
              Alex&apos;s expertise spans the full stack of network protocols — from DNS resolution and BGP routing to TCP/IP tuning and TLS termination. He has designed and implemented monitoring systems for multi-region network deployments and has contributed to open-source networking tools used by thousands of engineers worldwide.
            </p>
            <p>
              At Nuvora, Alex leads the development of all network diagnostic tools. He is the engineer behind the DNS Lookup tool, ensuring it returns accurate results that match authoritative name servers, and the Ping Test tool, which measures real-world latency across multiple geographic regions. Every tool Alex builds undergoes rigorous validation against reference command-line tools like <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">dig</code>, <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">nslookup</code>, <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">ping</code>, and <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">traceroute</code>.
            </p>
            <p>
              Alex is passionate about making complex networking concepts accessible to everyone. He regularly writes guides on DNS fundamentals, network troubleshooting, and performance optimization — translating years of hands-on experience into practical advice for developers, sysadmins, and IT professionals.
            </p>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Contributions
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              Tools built and maintained by Alex at Nuvora:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {contributions.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="rounded-lg border border-zinc-200 p-4 text-sm transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700"
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
