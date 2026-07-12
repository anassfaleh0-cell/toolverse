import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, PrintButton } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Card, Badge } from "@/components/ui";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `DNS Developer Cheat Sheet — Commands, Record Types, Troubleshooting`,
  description: `Complete DNS cheat sheet for developers. Quick reference for nslookup, dig, host commands, DNS record types (A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, PTR, CAA), response codes, TTL values, and troubleshooting tips.`,
  alternates: { canonical: `${SITE_URL}/cheat-sheets/developer-dns` },
  openGraph: {
    title: `DNS Developer Cheat Sheet`,
    description: `Quick reference for common DNS commands, record types, response codes, and developer troubleshooting tips.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Cheat Sheets", href: `${SITE_URL}/cheat-sheets` },
  { label: "DNS Developer Cheat Sheet" },
];

const dnsCommands = [
  { command: "nslookup example.com", description: "Look up DNS records for a domain (basic)", example: "nslookup google.com" },
  { command: "nslookup -type=MX example.com", description: "Query a specific record type", example: "nslookup -type=MX gmail.com" },
  { command: "nslookup example.com 8.8.8.8", description: "Query a specific DNS server", example: "nslookup example.com 1.1.1.1" },
  { command: "dig example.com", description: "Detailed DNS query (Linux/macOS)", example: "dig github.com" },
  { command: "dig example.com ANY", description: "Query all record types", example: "dig google.com ANY" },
  { command: "dig @8.8.8.8 example.com", description: "Query a specific DNS server", example: "dig @1.1.1.1 example.com" },
  { command: "dig +trace example.com", description: "Trace the full DNS resolution path", example: "dig +trace example.com" },
  { command: "dig -x 8.8.8.8", description: "Reverse DNS lookup (PTR)", example: "dig -x 8.8.8.8" },
  { command: "host example.com", description: "Simple DNS lookup (Linux/macOS)", example: "host google.com" },
  { command: "host -t MX example.com", description: "Query specific record type", example: "host -t TXT google.com" },
];

const recordTypes = [
  { type: "A", purpose: "IPv4 address mapping", ttl: "300–86400s", usage: "Maps domain to an IPv4 address" },
  { type: "AAAA", purpose: "IPv6 address mapping", ttl: "300–86400s", usage: "Maps domain to an IPv6 address" },
  { type: "CNAME", purpose: "Canonical name alias", ttl: "600–86400s", usage: "Alias one domain to another (e.g. www → @)" },
  { type: "MX", purpose: "Mail exchange server", ttl: "300–86400s", usage: "Routes email to mail servers with priority" },
  { type: "TXT", purpose: "Text metadata", ttl: "300–86400s", usage: "SPF, DKIM, DMARC, domain verification" },
  { type: "NS", purpose: "Name server delegation", ttl: "86400–172800s", usage: "Delegates subdomains to authoritative servers" },
  { type: "SOA", purpose: "Start of authority", ttl: "86400s", usage: "Zone transfer parameters, primary NS, admin contact" },
  { type: "SRV", purpose: "Service locator", ttl: "300–86400s", usage: "Locates specific services (SIP, LDAP, XMPP)" },
  { type: "PTR", purpose: "Reverse DNS pointer", ttl: "86400s", usage: "Maps IP address back to hostname" },
  { type: "CAA", purpose: "CA authorization", ttl: "86400s", usage: "Restricts which CAs can issue certificates for domain" },
];

const responseCodes = [
  { code: "NOERROR", name: "No Error", meaning: "Query completed successfully", action: "Normal response" },
  { code: "NXDOMAIN", name: "Non-Existent Domain", meaning: "The domain does not exist", action: "Check domain spelling, verify DNS records are published" },
  { code: "SERVFAIL", name: "Server Failure", meaning: "DNS server encountered an internal failure", action: "Check authoritative NS health, retry later" },
  { code: "REFUSED", name: "Query Refused", meaning: "Server refused to answer", action: "Check if server is authoritative for zone, verify ACLs" },
  { code: "FORMERR", name: "Format Error", meaning: "Server could not parse the query", action: "Check DNS client implementation, verify query format" },
  { code: "NOTIMP", name: "Not Implemented", meaning: "Operation not supported by server", action: "Use a different query type or DNS server" },
  { code: "NOTAUTH", name: "Not Authoritative", meaning: "Server is not authoritative for the zone", action: "Query the authoritative NS directly" },
  { code: "YXDOMAIN", name: "Domain Exists", meaning: "Domain already exists when it should not", action: "Used in dynamic update — remove duplicate record" },
  { code: "NXRRSET", name: "RR Set Exists", meaning: "Record set does not exist when it should", action: "Add the missing resource record" },
];

const quickRefRows = [
  { property: "Default TTL", value: "3600 seconds (1 hour)" },
  { property: "Minimum TTL (SOA)", value: "Typically 300–900 seconds" },
  { property: "Max TTL", value: "604800 seconds (7 days)" },
  { property: "DNS Port (UDP)", value: "53" },
  { property: "DNS Port (TCP)", value: "53 (zone transfers, large responses)" },
  { property: "Max hostname length", value: "253 characters" },
  { property: "Max label length", value: "63 characters" },
  { property: "Max UDP response", value: "512 bytes (without EDNS)" },
  { property: "EDNS max payload", value: "4096 bytes (typical)" },
  { property: "Root servers", value: "13 logical root servers (lettered A–M)" },
];

export default function DeveloperDnsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `DNS Developer Cheat Sheet — Commands, Record Types, Troubleshooting | ${SITE_NAME}`, description: `Quick reference for nslookup, dig, host commands, DNS record types, response codes, TTL values, and troubleshooting tips.`, url: `${SITE_URL}/cheat-sheets/developer-dns`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                DNS Developer Cheat Sheet
              </h1>
              <p className="mt-2 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                Commands, record types, response codes, and troubleshooting tips.
              </p>
              <PrintButton />
            </div>
            <SocialShare url={`${SITE_URL}/cheat-sheets/developer-dns`} title="DNS Developer Cheat Sheet — Commands, Record Types, Troubleshooting" />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Common DNS Commands</h2>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Command</th>
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Description</th>
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {dnsCommands.map((cmd) => (
                    <tr key={cmd.command} className="font-mono text-xs">
                      <td className="whitespace-nowrap px-4 py-2.5 font-medium text-zinc-900 dark:text-zinc-100">
                        {cmd.command}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                        {cmd.description}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-zinc-500 dark:text-zinc-500">
                        {cmd.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">DNS Record Types</h2>
            <ComparisonMatrix
              headers={["Type", "Purpose", "Typical TTL", "Usage"]}
              rows={recordTypes.map((r) => ({
                feature: r.type,
                values: [r.purpose, r.ttl, r.usage],
              }))}
            />
            <p className="mt-4 text-sm text-zinc-500">
              Use our <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup tool</Link> or{" "}
              <Link href="/dns-record-types" className="text-blue-600 hover:underline dark:text-blue-400">DNS Record Types</Link> reference for more details.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">DNS Response Codes</h2>
            <ComparisonMatrix
              headers={["Code", "Name", "Meaning", "Action"]}
              rows={responseCodes.map((r) => ({
                feature: r.code,
                values: [r.name, r.meaning, r.action],
                highlight: r.code === "NXDOMAIN" || r.code === "SERVFAIL",
              }))}
            />
          </div>

          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Quick Reference</h2>
            <ComparisonMatrix
              headers={["Property", "Value"]}
              rows={quickRefRows.map((r) => ({
                feature: r.property,
                values: [r.value],
              }))}
            />
          </div>

          <Card variant="default">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Related Tools</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/dns-lookup"><Badge variant="info">DNS Lookup</Badge></Link>
              <Link href="/dns-propagation-checker"><Badge variant="info">DNS Propagation Checker</Badge></Link>
              <Link href="/reverse-dns-lookup"><Badge variant="info">Reverse DNS Lookup</Badge></Link>
              <Link href="/compare-dns"><Badge variant="info">DNS Comparison</Badge></Link>
              <Link href="/dns-record-types"><Badge variant="info">DNS Record Types Reference</Badge></Link>
            </div>
          </Card>
        </div>
      </section>
      <style>{`
        @media print {
          nav, button, .dark\\:bg-zinc-800, .dark\\:border-zinc-700 { background: white !important; color: black !important; border-color: #ccc !important; }
          .border-zinc-200 { border-color: #ccc !important; }
        }
      `}</style>
    </>
  );
}
