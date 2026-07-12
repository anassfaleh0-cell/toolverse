import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: `DNS Record Types — Complete Reference`,
  description: `Complete reference of all DNS record types including A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, CAA, PTR, and more. Each type with purpose, format, examples, and when to use it.`,
  alternates: { canonical: `${SITE_URL}/dns-record-types` },
  openGraph: {
    title: `DNS Record Types Reference`,
    description: `Every DNS record type explained with purpose, format, examples, and use cases.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "DNS Record Types" },
];

interface DnsRecordType {
  type: string;
  fullName: string;
  purpose: string;
  format: string;
  example: string;
  whenToUse: string;
  rfc: string;
}

const DNS_RECORD_TYPES: DnsRecordType[] = [
  { type: "A", fullName: "Address Record", purpose: "Maps a domain name to an IPv4 address.", format: "example.com.  IN  A  192.0.2.1", example: "example.com → 192.0.2.1", whenToUse: "Every website or service that needs to be reachable via IPv4.", rfc: "RFC 1035" },
  { type: "AAAA", fullName: "IPv6 Address Record", purpose: "Maps a domain name to an IPv6 address.", format: "example.com.  IN  AAAA  2001:db8::1", example: "example.com → 2001:db8::1", whenToUse: "Every website or service that needs to be reachable via IPv6. Essential for modern networks.", rfc: "RFC 3596" },
  { type: "CNAME", fullName: "Canonical Name Record", purpose: "Aliases one domain name to another. The target domain must have its own A/AAAA record.", format: "www.example.com.  IN  CNAME  example.com.", example: "www.example.com → example.com", whenToUse: "Subdomain aliasing (www → root), CDN integration, load balancing across domains.", rfc: "RFC 1035" },
  { type: "MX", fullName: "Mail Exchange Record", purpose: "Specifies mail servers responsible for receiving email on behalf of a domain.", format: "example.com.  IN  MX  10 mail.example.com.", example: "Priority 10: mail.example.com, Priority 20: backup.example.com", whenToUse: "Any domain that needs to receive email. Include multiple entries with different priorities for redundancy.", rfc: "RFC 1035" },
  { type: "TXT", fullName: "Text Record", purpose: "Holds arbitrary text data. Used for domain verification, email security policies, and general metadata.", format: "example.com.  IN  TXT  \"v=spf1 include:_spf.example.com ~all\"", example: "SPF: v=spf1 include:_spf.example.com ~all", whenToUse: "SPF records, DKIM keys, DMARC policies, domain ownership verification (Google, Microsoft), other machine-readable metadata.", rfc: "RFC 1035" },
  { type: "NS", fullName: "Name Server Record", purpose: "Delegates a domain or subdomain to a set of authoritative name servers.", format: "example.com.  IN  NS  ns1.example.com.", example: "ns1.example.com, ns2.example.com", whenToUse: "Required for every domain. Points to the servers that host the DNS zone for that domain.", rfc: "RFC 1035" },
  { type: "SOA", fullName: "Start of Authority Record", purpose: "Provides administrative information about the DNS zone, including the primary name server, responsible email, and timing parameters.", format: "example.com.  IN  SOA  ns1.example.com. admin.example.com. 2026010101 3600 900 604800 86400", example: "Primary NS: ns1.example.com, Serial: 2026010101, Refresh: 3600s", whenToUse: "Required at the top of every DNS zone file. Automatically managed by DNS hosting providers.", rfc: "RFC 1035" },
  { type: "SRV", fullName: "Service Record", purpose: "Specifies the location (hostname and port) of specific services.", format: "_sip._tcp.example.com.  IN  SRV  10 5 5060 sip.example.com.", example: "_sip._tcp.example.com priority 10, weight 5, port 5060 → sip.example.com", whenToUse: "VoIP (SIP), Microsoft Exchange (LDAP, Kerberos), XMPP chat, CalDAV/CardDAV autodiscovery.", rfc: "RFC 2782" },
  { type: "CAA", fullName: "Certification Authority Authorization", purpose: "Restricts which Certificate Authorities (CAs) are allowed to issue SSL/TLS certificates for the domain.", format: "example.com.  IN  CAA  0 issue \"letsencrypt.org\"", example: "Only Let's Encrypt can issue certificates for example.com", whenToUse: "Any domain with SSL/TLS certificates. Helps prevent unauthorized certificate issuance.", rfc: "RFC 6844" },
  { type: "PTR", fullName: "Pointer Record", purpose: "Maps an IP address to a domain name (reverse DNS lookup).", format: "1.2.0.192.in-addr.arpa.  IN  PTR  example.com.", example: "192.0.2.1 → example.com", whenToUse: "Email server identification (anti-spam), network troubleshooting, logging, server identification.", rfc: "RFC 1035" },
  { type: "SPF", fullName: "Sender Policy Framework", purpose: "Specifies which mail servers are authorized to send email on behalf of the domain. (Deprecated in favor of TXT records.)", format: "example.com.  IN  SPF  \"v=spf1 ip4:192.0.2.0/24 ~all\"", example: "v=spf1 ip4:192.0.2.0/24 ~all", whenToUse: "Historical use. Modern deployments should use TXT records for SPF data.", rfc: "RFC 7208" },
  { type: "DKIM", fullName: "DomainKeys Identified Mail", purpose: "Provides a public key for verifying email signatures. Implemented as a TXT record under a specific selector subdomain.", format: "selector1._domainkey.example.com.  IN  TXT  \"v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3...\"", example: "selector1._domainkey.example.com contains the DKIM public key", whenToUse: "Any domain sending email. Helps prevent email spoofing and improves deliverability.", rfc: "RFC 6376" },
  { type: "DMARC", fullName: "Domain-based Message Authentication, Reporting & Conformance", purpose: "Publishes email authentication policies (how receivers handle SPF/DKIM failures) and provides reporting.", format: "_dmarc.example.com.  IN  TXT  \"v=DMARC1; p=reject; rua=mailto:dmarc@example.com\"", example: "v=DMARC1; p=reject; rua=mailto:dmarc@example.com", whenToUse: "Any domain sending email. Policies: none (monitor), quarantine (spam folder), reject (block).", rfc: "RFC 7489" },
  { type: "NAPTR", fullName: "Naming Authority Pointer", purpose: "Used for dynamic delegation and rewriting of domain names, often in conjunction with SRV records.", format: "example.com.  IN  NAPTR  100 10 \"u\" \"E2U+sip\" \"!^.*$!sip:info@example.com!i\" .", example: "ENUM telephone number mapping, SIP URI resolution", whenToUse: "ENUM (telephone number mapping), SIP routing, UPNP service discovery.", rfc: "RFC 3403" },
  { type: "LOC", fullName: "Location Record", purpose: "Specifies the physical location (latitude, longitude, altitude) of a domain or network.", format: "example.com.  IN  LOC  51 30 12 N 0 7 40 W 10m", example: "51°30'12\"N 0°7'40\"W at 10m elevation", whenToUse: "Geographic network mapping, data center location documentation, DNS-based location services.", rfc: "RFC 1876" },
  { type: "HINFO", fullName: "Host Information Record", purpose: "Provides information about the host hardware and operating system.", format: "example.com.  IN  HINFO  \"INTEL\" \"Linux\"", example: "CPU: INTEL, OS: Linux", whenToUse: "Rarely used due to security concerns (exposes system details). Legacy purpose only.", rfc: "RFC 1035" },
  { type: "RP", fullName: "Responsible Person Record", purpose: "Identifies the person responsible for the domain or host.", format: "example.com.  IN  RP  admin.example.com. contact.example.com.", example: "Responsible: admin@example.com, Contact info at contact.example.com", whenToUse: "Administrative documentation, zone maintenance contact information.", rfc: "RFC 1183" },
  { type: "SSHFP", fullName: "SSH Fingerprint Record", purpose: "Publishes SSH host key fingerprints in DNS to allow verification of SSH host keys.", format: "example.com.  IN  SSHFP  2 1 1234567890abcdef1234567890abcdef12345678", example: "Algorithm: RSA (2), Fingerprint type: SHA-1 (1)", whenToUse: "SSH host key verification, SSHFP lookup for secure SSH connections, avoiding host key warnings.", rfc: "RFC 4255" },
  { type: "RRSIG", fullName: "Resource Record Signature", purpose: "Contains a cryptographic signature for a DNSSEC-signed record set.", format: "example.com.  IN  RRSIG  A 5 2 86400 20260101000000 20251201000000 12345 example.com. ...", example: "Signature for A record set, valid from Dec 2025 to Jan 2026", whenToUse: "Automatic part of DNSSEC; generated and managed by DNS hosting providers when DNSSEC is enabled.", rfc: "RFC 4034" },
  { type: "DNSKEY", fullName: "DNS Public Key Record", purpose: "Holds the public key used to verify DNSSEC signatures.", format: "example.com.  IN  DNSKEY  256 3 5 AwEAAazdA...", example: "Zone-signing key (256) or key-signing key (257)", whenToUse: "Automatic part of DNSSEC; generated when DNSSEC is enabled on the domain.", rfc: "RFC 4034" },
  { type: "DS", fullName: "Delegation Signer Record", purpose: "Holds a hash of a DNSKEY record for secure delegation of DNSSEC-signed subdomains.", format: "example.com.  IN  DS  12345 5 2 1234567890abcdef...", example: "Key tag: 12345, Digest type: SHA-256", whenToUse: "Placed in parent zone to establish DNSSEC chain of trust for signed subdomains.", rfc: "RFC 4034" },
  { type: "NSEC", fullName: "Next Secure Record", purpose: "Provides authenticated denial of existence for DNSSEC, proving that a record does not exist.", format: "example.com.  IN  NSEC  test.example.com. A NS SOA MX RRSIG NSEC", example: "Next record: test.example.com, Types present: A, NS, SOA, MX", whenToUse: "Automatic part of DNSSEC; generated when DNSSEC is enabled. NSEC3 is preferred for zone walking resistance.", rfc: "RFC 4034" },
  { type: "NSEC3", fullName: "Next Secure Record v3", purpose: "Provides authenticated denial of existence with hashed record names to prevent zone enumeration.", format: "0p9m8q...  IN  NSEC3  1 0 10 aabbcc  test.example.com. A NS SOA", example: "Hashed next owner with salt and iterations", whenToUse: "Modern DNSSEC deployments that want to prevent zone walking while providing authenticated denial.", rfc: "RFC 5155" },
];

function getTypeColor(type: string): string {
  const core = ["A", "AAAA", "CNAME", "MX", "NS", "SOA", "TXT", "PTR"];
  const security = ["CAA", "SPF", "DKIM", "DMARC", "SSHFP", "RRSIG", "DNSKEY", "DS", "NSEC", "NSEC3"];
  const service = ["SRV", "NAPTR"];
  if (core.includes(type)) return "border-l-blue-500";
  if (security.includes(type)) return "border-l-emerald-500";
  if (service.includes(type)) return "border-l-purple-500";
  return "border-l-zinc-400";
}

export default function DnsRecordTypesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `DNS Record Types Reference — ${SITE_NAME}`, description: `Complete reference of all DNS record types.`, url: `${SITE_URL}/dns-record-types`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            DNS Record Types
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Complete reference of all DNS record types. Each type includes its purpose, format syntax, a real-world example, and guidance on when to use it.
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">Full Name</th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50 md:table-cell">Purpose</th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50 lg:table-cell">Format Example</th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50 lg:table-cell">When to Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {DNS_RECORD_TYPES.map((record) => (
                  <tr key={record.type} className={`border-l-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 ${getTypeColor(record.type)}`}>
                    <td className="px-4 py-4">
                      <span className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-50">{record.type}</span>
                    </td>
                    <td className="px-4 py-4 text-zinc-700 dark:text-zinc-300">{record.fullName}</td>
                    <td className="hidden px-4 py-4 text-zinc-600 dark:text-zinc-400 md:table-cell">{record.purpose}</td>
                    <td className="hidden max-w-xs truncate px-4 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-500 lg:table-cell">{record.format}</td>
                    <td className="hidden px-4 py-4 text-xs text-zinc-500 dark:text-zinc-500 lg:table-cell">{record.whenToUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Card variant="default" className="mt-12">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Need to check DNS records?</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Use our <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> tool to query any DNS record type for any domain. Check <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation</Link> to verify record propagation worldwide.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
