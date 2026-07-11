import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import { JsonLd, Breadcrumbs, FaqSection } from "@/components/shared";
import { webPageSchema, breadcrumbSchema, faqSchema, type FaqItem } from "@/lib/seo";

const slug = "toolkits/network";
const pageTitle = "Network Toolkit — Free Network Diagnostic Tools — Nuvora";
const pageDescription =
  "Curated collection of free network diagnostic tools for DNS lookup, ping testing, port checking, IP lookup, and more. Troubleshoot network issues like a pro.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${slug}`,
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const icons: Record<string, string> = {
  "dns-lookup": "🌐",
  "reverse-dns-lookup": "🔄",
  "dns-propagation-checker": "🔄",
  "ping-test": "📡",
  "port-checker": "🔌",
  "subnet-calculator": "🌐",
  "whois-lookup": "🔍",
  "ip-lookup": "🌍",
  "what-is-my-ip": "🔑",
  "website-status-checker": "💡",
  "user-agent-parser": "🤖",
};

const tools = [
  {
    id: "dns-lookup",
    name: "DNS Lookup",
    description:
      "Look up DNS records for any domain including A, AAAA, CNAME, MX, NS, TXT, SOA, SRV, and CAA records.",
    href: "/dns-lookup",
  },
  {
    id: "reverse-dns-lookup",
    name: "Reverse DNS Lookup",
    description:
      "Find the hostname associated with an IP address using reverse DNS PTR record lookup. Supports IPv4 and IPv6.",
    href: "/reverse-dns-lookup",
  },
  {
    id: "dns-propagation-checker",
    name: "DNS Propagation Checker",
    description:
      "Check DNS propagation across multiple global DNS servers including Google, Cloudflare, Quad9, and OpenDNS.",
    href: "/dns-propagation-checker",
  },
  {
    id: "ping-test",
    name: "Ping Test",
    description:
      "Test network latency and packet loss to any host. TCP ping with min, average, and max response time measurements.",
    href: "/ping-test",
  },
  {
    id: "port-checker",
    name: "Port Checker",
    description:
      "Check if a network port is open on any host. Scan common ports or test a specific port with service identification.",
    href: "/port-checker",
  },
  {
    id: "subnet-calculator",
    name: "Subnet Calculator",
    description:
      "Calculate subnet details from IP and CIDR notation. Get network address, broadcast address, host range, and subnet mask.",
    href: "/subnet-calculator",
  },
  {
    id: "whois-lookup",
    name: "WHOIS Lookup",
    description:
      "Look up domain registration information including registrar, creation date, expiration date, and name servers.",
    href: "/whois-lookup",
  },
  {
    id: "ip-lookup",
    name: "IP Lookup",
    description:
      "Look up any IPv4 or IPv6 address. Get location, ISP, hostname, ASN, and interactive map visualization.",
    href: "/ip-lookup",
  },
  {
    id: "what-is-my-ip",
    name: "What Is My IP",
    description:
      "Find your public IPv4 and IPv6 address instantly. See location, ISP, ASN, timezone, and browser information.",
    href: "/what-is-my-ip",
  },
  {
    id: "website-status-checker",
    name: "Website Status Checker",
    description:
      "Check if a website is online and responding. Get HTTP status code, response time, content type, and server information.",
    href: "/website-status-checker",
  },
  {
    id: "user-agent-parser",
    name: "User Agent Parser",
    description:
      "Parse any User-Agent string and identify the browser, engine, operating system, device model, and CPU architecture.",
    href: "/user-agent-parser",
  },
];

const sections = [
  {
    title: "DNS Tools",
    description:
      "Query and troubleshoot DNS records across the internet. From standard lookups to propagation checking, these tools give you full visibility into domain name resolution.",
    tools: tools.filter((t) =>
      ["dns-lookup", "reverse-dns-lookup", "dns-propagation-checker"].includes(t.id),
    ),
  },
  {
    title: "Connectivity Tools",
    description:
      "Test network connectivity and accessibility. Measure latency, check open ports, and verify subnet configurations to diagnose connectivity issues quickly.",
    tools: tools.filter((t) =>
      ["ping-test", "port-checker", "subnet-calculator"].includes(t.id),
    ),
  },
  {
    title: "IP Tools",
    description:
      "Discover and investigate IP addresses and domain ownership. Find your own IP, look up any address, or research domain registration details with WHOIS.",
    tools: tools.filter((t) =>
      ["whois-lookup", "ip-lookup", "what-is-my-ip"].includes(t.id),
    ),
  },
  {
    title: "Analysis Tools",
    description:
      "Analyze web infrastructure and client information. Check website availability, parse user agent strings, and understand the devices visiting your services.",
    tools: tools.filter((t) =>
      ["website-status-checker", "user-agent-parser"].includes(t.id),
    ),
  },
];

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Toolkits" },
  { label: "Network Toolkit" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the Network Toolkit?",
    answer:
      "The Network Toolkit is a curated collection of free network diagnostic tools covering DNS resolution, connectivity testing, IP investigation, and web infrastructure analysis.",
  },
  {
    question: "What is the difference between DNS Lookup and Reverse DNS Lookup?",
    answer:
      "DNS Lookup resolves a domain name to its IP addresses and associated records. Reverse DNS Lookup does the opposite — it takes an IP address and returns the associated hostname.",
  },
  {
    question: "How does the Ping Test work?",
    answer:
      "The Ping Test sends TCP packets to the target host and measures the round-trip time. It reports minimum, average, and maximum latency, helping you identify network performance issues.",
  },
  {
    question: "What ports does the Port Checker scan?",
    answer:
      "You can scan any specific port or choose from common ports including HTTP (80), HTTPS (443), SSH (22), FTP (21), SMTP (25), and many more.",
  },
  {
    question: "Can I look up any IP address?",
    answer:
      "Yes, the IP Lookup tool works with any public IPv4 or IPv6 address and returns geolocation, ISP, ASN, and hostname information.",
  },
  {
    question: "What is DNS propagation and why does it matter?",
    answer:
      "DNS propagation is the time it takes for DNS changes to spread across all global DNS servers. The DNS Propagation Checker shows you which resolvers have picked up your changes and which haven't.",
  },
  {
    question: "Are all network tools free?",
    answer:
      "Yes, all tools in the Network Toolkit are completely free. No registration, usage limits, or hidden costs.",
  },
];

export default function NetworkToolkitPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: pageTitle,
          description: pageDescription,
          url: `${SITE_URL}/${slug}`,
          breadcrumbs,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Network Toolkit
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {pageDescription}
        </p>

        {sections.map((section) => (
          <section key={section.title} className="mt-16">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {section.title}
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {section.description}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-xl border border-zinc-200 p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{icons[tool.id]}</span>
                    <div>
                      <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                        {tool.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-16">
          <FaqSection items={faqItems} />
        </section>
      </div>
    </>
  );
}
