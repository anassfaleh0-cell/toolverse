import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `DNS Fundamentals Learning Path — From Beginner to Advanced | ${SITE_NAME}`,
  description: `A structured learning path covering DNS from basic concepts to advanced topics. 6 modules: What is DNS, Record Types, Resolution, Security, Troubleshooting, and Advanced DNS.`,
  alternates: { canonical: `${SITE_URL}/learning-paths/dns-fundamentals` },
  openGraph: {
    title: `DNS Fundamentals Learning Path — From Beginner to Advanced | ${SITE_NAME}`,
    description: `Master DNS from the ground up with this structured 6-module learning path. Covers record types, resolution, security, troubleshooting, and advanced topics.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Learning Paths", href: `${SITE_URL}/learning-paths` },
  { label: "DNS Fundamentals" },
];

interface Module {
  number: number;
  title: string;
  description: string;
  topics: string[];
  relatedTools: { label: string; href: string }[];
  estimatedTime: string;
}

const modules: Module[] = [
  {
    number: 1,
    title: "What is DNS?",
    description: "Understand the fundamental role of the Domain Name System in translating human-readable domain names into machine-readable IP addresses. Learn how DNS acts as the phonebook of the internet and why it is critical for every online service.",
    topics: [
      "Purpose and importance of DNS",
      "History and evolution of the DNS system",
      "DNS hierarchy: root, TLD, and authoritative servers",
      "Difference between public and private DNS",
    ],
    relatedTools: [
      { label: "DNS Lookup", href: "/dns-lookup" },
      { label: "WHOIS Lookup", href: "/whois-lookup" },
    ],
    estimatedTime: "20 minutes",
  },
  {
    number: 2,
    title: "DNS Record Types Explained",
    description: "Explore the most common DNS record types and their specific purposes. Learn how A, AAAA, CNAME, MX, TXT, NS, and SOA records work together to define a domain's behavior.",
    topics: [
      "A and AAAA records for IPv4 and IPv6 addressing",
      "CNAME records for domain aliasing",
      "MX records and mail server routing with priority",
      "TXT records for SPF, DKIM, DMARC, and verification",
      "NS records for delegation and SOA records for zone authority",
    ],
    relatedTools: [
      { label: "DNS Record Types Reference", href: "/dns-record-types" },
      { label: "DNS Lookup", href: "/dns-lookup" },
    ],
    estimatedTime: "30 minutes",
  },
  {
    number: 3,
    title: "How DNS Resolution Works",
    description: "Trace the complete journey of a DNS query from browser to resolver to authoritative server. Understand the difference between recursive and authoritative name servers and how caching improves performance.",
    topics: [
      "Recursive vs. authoritative DNS resolution",
      "The query lifecycle: stub resolver to recursive resolver",
      "Caching mechanics and TTL optimization",
      "Anycast routing and its role in DNS performance",
    ],
    relatedTools: [
      { label: "DNS Lookup", href: "/dns-lookup" },
      { label: "DNS Propagation Checker", href: "/dns-propagation-checker" },
    ],
    estimatedTime: "25 minutes",
  },
  {
    number: 4,
    title: "DNS Security",
    description: "Learn about the security challenges facing DNS and the protocols designed to protect it. Covers DNSSEC for data integrity, DNS over HTTPS (DoH) and DNS over TLS (DoT) for privacy, and best practices for securing your DNS infrastructure.",
    topics: [
      "Understanding DNS vulnerabilities: cache poisoning, spoofing, and DDoS",
      "DNSSEC: cryptographic signing and validation",
      "DNS over HTTPS (DoH) and DNS over TLS (DoT)",
      "CAA records for certificate authority authorization",
    ],
    relatedTools: [
      { label: "DNS Lookup", href: "/dns-lookup" },
      { label: "SSL Certificate Checker", href: "/ssl-certificate-checker" },
    ],
    estimatedTime: "30 minutes",
  },
  {
    number: 5,
    title: "DNS Troubleshooting",
    description: "Develop practical skills for diagnosing and resolving common DNS issues. Learn to use nslookup, dig, and online tools to verify record propagation, identify misconfigurations, and debug resolution failures.",
    topics: [
      "Common DNS issues: propagation delays, NXDOMAIN, SERVFAIL",
      "Using nslookup and dig for manual querying",
      "Checking DNS propagation across global nodes",
      "Identifying TTL-related caching problems",
    ],
    relatedTools: [
      { label: "DNS Propagation Checker", href: "/dns-propagation-checker" },
      { label: "Reverse DNS Lookup", href: "/reverse-dns-lookup" },
      { label: "DNS Lookup", href: "/dns-lookup" },
    ],
    estimatedTime: "35 minutes",
  },
  {
    number: 6,
    title: "Advanced DNS",
    description: "Explore advanced DNS concepts used by enterprises and CDNs to achieve high availability, low latency, and intelligent traffic distribution. Covers Anycast, GeoDNS, and traffic management strategies.",
    topics: [
      "Anycast networking for global DNS redundancy",
      "GeoDNS for location-based traffic routing",
      "Load balancing with DNS: weighted records and health checks",
      "DNS-based traffic management with CDNs",
    ],
    relatedTools: [
      { label: "DNS Lookup", href: "/dns-lookup" },
      { label: "DNS Propagation Checker", href: "/dns-propagation-checker" },
    ],
    estimatedTime: "30 minutes",
  },
];

export default function DnsFundamentalsLearningPathPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `DNS Fundamentals Learning Path — From Beginner to Advanced | ${SITE_NAME}`, description: `A structured 6-module learning path covering DNS from basic concepts to advanced topics including resolution, security, troubleshooting, and traffic management.`, url: `${SITE_URL}/learning-paths/dns-fundamentals`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                DNS Fundamentals Learning Path
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                A structured journey from DNS basics to advanced concepts. Complete all 6 modules to build a solid foundation in DNS theory, security, and troubleshooting.
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/learning-paths/dns-fundamentals`} title="DNS Fundamentals Learning Path — From Beginner to Advanced" />
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Modules:</span> 6
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Total Time:</span> ~2 hours 50 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Level:</span> Beginner to Advanced
            </span>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="space-y-8">
            {modules.map((mod) => (
              <div key={mod.number} className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {mod.number}
                    </span>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {mod.title}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {mod.estimatedTime}
                  </span>
                </div>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {mod.description}
                </p>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Topics covered:</h3>
                  <ul className="mt-2 space-y-1">
                    {mod.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="mt-0.5 text-blue-500">&bull;</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">Related tools:</span>
                  {mod.relatedTools.map((tool) => (
                    <Link
                      key={tool.label}
                      href={tool.href}
                      className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-zinc-800 dark:text-blue-400 dark:hover:bg-blue-900"
                    >
                      {tool.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Related Resources</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Complement your learning with these free tools and references:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/dns-lookup" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-zinc-200 hover:bg-blue-50 dark:bg-zinc-700 dark:text-blue-400 dark:ring-zinc-600 dark:hover:bg-zinc-600">DNS Lookup</Link>
              <Link href="/dns-propagation-checker" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-zinc-200 hover:bg-blue-50 dark:bg-zinc-700 dark:text-blue-400 dark:ring-zinc-600 dark:hover:bg-zinc-600">DNS Propagation Checker</Link>
              <Link href="/reverse-dns-lookup" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-zinc-200 hover:bg-blue-50 dark:bg-zinc-700 dark:text-blue-400 dark:ring-zinc-600 dark:hover:bg-zinc-600">Reverse DNS Lookup</Link>
              <Link href="/dns-record-types" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-zinc-200 hover:bg-blue-50 dark:bg-zinc-700 dark:text-blue-400 dark:ring-zinc-600 dark:hover:bg-zinc-600">DNS Record Types</Link>
              <Link href="/cheat-sheets/developer-dns" className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-zinc-200 hover:bg-blue-50 dark:bg-zinc-700 dark:text-blue-400 dark:ring-zinc-600 dark:hover:bg-zinc-600">DNS Cheat Sheet</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
