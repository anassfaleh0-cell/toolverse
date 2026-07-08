import type { Metadata } from "next";
import Link from "next/link";
import {
  ComparisonMatrix,
  Breadcrumbs,
  SocialShare,
  JsonLd,
} from "@/components/shared";
import {
  webPageSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "protocols/dns-protocols";
const pageTitle = "DNS Protocol Comparison — UDP vs TCP vs DoH vs DoT vs DNSSEC";
const pageDescription =
  "Compare DNS transport protocols including UDP, TCP, DNS over HTTPS (DoH), DNS over TLS (DoT), and DNSSEC. Evaluate encryption, speed, privacy, and security for each protocol.";

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
  alternates: {
    canonical: `${SITE_URL}/${slug}`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Protocols", href: `${SITE_URL}/protocols` },
  { label: "DNS Protocols" },
];

export default function DnsProtocolsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                DNS Protocol Comparison
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                {pageDescription}
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/${slug}`} title={pageTitle} />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            DNS Transport Protocols Compared
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            DNS queries can be transported over several protocols, each offering different tradeoffs in speed, security, and privacy.
          </p>
          <div className="mt-8">
            <ComparisonMatrix
              title="UDP vs TCP vs DoH vs DoT vs DNSSEC"
              headers={["UDP", "TCP", "DoH (DNS over HTTPS)", "DoT (DNS over TLS)", "DNSSEC"]}
              rows={[
                { feature: "Default Port", values: ["53", "53", "443", "853", "53 (UDP)"] },
                { feature: "Encryption", values: ["None", "None", "TLS 1.2 / 1.3", "TLS 1.2 / 1.3", "None (signatures only)"] },
                { feature: "Speed", values: ["Fastest", "Moderate", "Moderate", "Moderate", "Fast"] },
                { feature: "Privacy Level", values: ["Low", "Low", "High", "High", "Low"] },
                { feature: "Spoofing Protection", values: ["Low", "Low", "High", "High", "High"] },
                { feature: "Adoption Rate", values: ["Universal", "Universal", "Growing", "Growing", "Partial (~30% zones)"] },
                { feature: "Use Case", values: ["Standard queries", "Large responses (EDNS), zone transfers", "Privacy-conscious clients, browsers", "Recursive resolvers, stub resolvers", "Authenticity validation"] },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            UDP — The Standard DNS Transport
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              DNS was designed to use UDP on port 53 for most queries. UDP is connectionless and fast — a single round trip is sufficient for a query and response. The 512-byte limit (extendable via EDNS to ~4,000 bytes) keeps most DNS responses within a single packet.
            </p>
            <p>
              UDP DNS is unencrypted and vulnerable to spoofing attacks, including DNS cache poisoning. The transaction ID field (16-bit) is the primary defense against spoofing, but it can be brute-forced in some scenarios.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            TCP — Fallback and Zone Transfers
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              DNS over TCP on port 53 is used when responses exceed the UDP size limit, typically with DNSSEC-signed zones or large resource records. TCP is also required for zone transfers (AXFR/IXFR) between authoritative servers.
            </p>
            <p>
              TCP introduces connection setup overhead (SYN, SYN-ACK, ACK) before data transfer, making it slower than UDP for small queries. However, TCP provides reliable delivery and can handle responses of arbitrary size.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            DNS over HTTPS (DoH)
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              DoH encrypts DNS queries within HTTPS traffic on port 443, making them indistinguishable from regular web traffic. This provides strong privacy protection against eavesdropping and blocking. Major browsers including Firefox and Chrome have built-in DoH support.
            </p>
            <p>
              DoH shifts DNS resolution from the OS level to the application level, which can bypass local DNS filtering but also bypasses local DNS caching and parental controls. Providers like Cloudflare (1.1.1.1) and Google (8.8.8.8) offer public DoH resolvers.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            DNS over TLS (DoT)
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              DoT encrypts DNS queries using TLS on a dedicated port (853). Unlike DoH, DoT traffic is identifiable as DNS traffic, which allows network operators to monitor and manage DNS traffic. DoT is typically implemented at the system or resolver level.
            </p>
            <p>
              DoT provides similar encryption strength to DoH but is simpler to implement at the network level. Android supports DoT natively since Android 9, and many recursive resolvers (Unbound, Knot Resolver) support incoming DoT queries.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            DNSSEC — Authentication Without Encryption
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              DNSSEC (DNS Security Extensions) adds cryptographic signatures to DNS records, enabling resolvers to verify that responses are authentic and have not been tampered with. DNSSEC does not encrypt queries — it provides data origin authentication and integrity.
            </p>
            <p>
              DNSSEC uses public key cryptography with a chain of trust starting from the root zone. Signed zones contain RRSIG, DNSKEY, DS, and NSEC/NSEC3 records. Adoption remains at around 30% of TLD zones, though most gTLDs and many ccTLDs are signed.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Choosing the Right DNS Protocol
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              For most users, standard DNS over UDP is sufficient. If privacy is a concern, DoH or DoT adds encryption with minimal performance overhead. For authoritative zones, DNSSEC signing protects against cache poisoning and spoofing.
            </p>
            <p>
              Use the <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> tool to query any domain across different record types and see which protocols your DNS provider supports. Use the <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> to verify changes across global resolvers.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
