import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import { JsonLd, Breadcrumbs, FaqSection } from "@/components/shared";
import { webPageSchema, breadcrumbSchema, faqSchema, type FaqItem } from "@/lib/seo";

const slug = "toolkits/security";
const pageTitle = "Security Toolkit \u2014 Free Online Security Tools \u2014 Nuvora";
const pageDescription =
  "Curated collection of free online security tools for SSL checking, port scanning, WHOIS lookups, and password generation. Secure your infrastructure with ease.";

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
  "ssl-certificate-checker": "\uD83D\uDD12",
  "port-checker": "\uD83D\uDD0C",
  "subnet-calculator": "\uD83C\uDF10",
  "whois-lookup": "\uD83D\uDD0D",
  "http-headers-checker": "\uD83D\uDCE7",
  "dns-lookup": "\uD83C\uDF10",
  "password-generator": "\uD83D\uDD11",
};

const tools = [
  {
    id: "ssl-certificate-checker",
    name: "SSL Certificate Checker",
    description:
      "Check SSL/TLS certificate details for any domain. View issuer, validity period, fingerprints, and days until expiration.",
    href: "/ssl-certificate-checker",
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
    id: "http-headers-checker",
    name: "HTTP Headers Checker",
    description:
      "Check HTTP response headers for any URL. View security headers, cache policies, redirect chains, and timing.",
    href: "/http-headers-checker",
  },
  {
    id: "dns-lookup",
    name: "DNS Lookup",
    description:
      "Look up DNS records for any domain including A, AAAA, CNAME, MX, NS, TXT, SOA, SRV, and CAA records.",
    href: "/dns-lookup",
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description:
      "Generate strong, random passwords with customizable length and character types for your online accounts.",
    href: "/password-generator",
  },
];

const sections = [
  {
    title: "Certificate & SSL Security",
    description:
      "Verify and monitor SSL/TLS certificates for any domain. Ensure your certificates are valid, properly configured, and not approaching expiration to maintain trust and compliance.",
    tools: tools.filter((t) => t.id === "ssl-certificate-checker"),
  },
  {
    title: "Network Security",
    description:
      "Assess your network perimeter with port scanning and subnet analysis. Identify open ports, detect exposed services, and plan IP allocations with precision.",
    tools: tools.filter((t) => ["port-checker", "subnet-calculator"].includes(t.id)),
  },
  {
    title: "Domain Security",
    description:
      "Investigate domain ownership, DNS configuration, and HTTP security posture. These tools help you verify domain legitimacy, detect misconfigurations, and audit security headers.",
    tools: tools.filter((t) =>
      ["whois-lookup", "http-headers-checker", "dns-lookup"].includes(t.id),
    ),
  },
  {
    title: "Password Security",
    description:
      "Generate strong, cryptographically random passwords for your accounts and systems. Customize length and character sets to meet any password policy requirement.",
    tools: tools.filter((t) => t.id === "password-generator"),
  },
];

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Toolkits" },
  { label: "Security Toolkit" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the Security Toolkit?",
    answer:
      "The Security Toolkit is a curated collection of free online security tools covering SSL certificate checking, port scanning, WHOIS lookups, HTTP header analysis, DNS inspection, and password generation.",
  },
  {
    question: "Are the security tools free to use?",
    answer:
      "Yes, all tools in the Security Toolkit are completely free. No registration, payment, or usage limits apply.",
  },
  {
    question: "Can I check the SSL certificate of any domain?",
    answer:
      "Yes, the SSL Certificate Checker works with any publicly accessible domain. It retrieves and displays the full certificate chain including issuer, validity dates, and subject alternative names.",
  },
  {
    question: "What information does the WHOIS Lookup provide?",
    answer:
      "The WHOIS Lookup returns domain registration details including registrar name, creation and expiration dates, name servers, and domain status codes.",
  },
  {
    question: "How does the Port Checker work?",
    answer:
      "The Port Checker attempts to establish a TCP connection to the specified host and port. It reports whether the port is open, closed, or filtered, and identifies the common service associated with each port.",
  },
  {
    question: "Are the generated passwords secure?",
    answer:
      "Yes. The Password Generator creates passwords using cryptographically random values directly in your browser. Passwords are never sent to any server.",
  },
  {
    question: "Do you store any data from my security checks?",
    answer:
      "No. All lookups and checks are processed in real time. We do not log, store, or share any domain names, IP addresses, or results from your security scans.",
  },
];

export default function SecurityToolkitPage() {
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
          Security Toolkit
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
