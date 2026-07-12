import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Card, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: `TLS/SSL Versions Timeline — Complete Reference`,
  description: `Timeline of SSL and TLS protocol versions from SSL 2.0 (1995) to TLS 1.3 (2018). Key features, security status, deprecation dates, and recommendations.`,
  alternates: { canonical: `${SITE_URL}/tls-versions` },
  openGraph: {
    title: `TLS/SSL Versions Timeline`,
    description: `Complete timeline and comparison of SSL/TLS protocol versions with security status and feature highlights.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "TLS Versions" },
];

interface TlsVersion {
  version: string;
  year: number;
  status: "secure" | "deprecated" | "insecure";
  features: string[];
  deprecationDate?: string;
  details: string;
  rfc: string;
}

const TLS_VERSIONS: TlsVersion[] = [
  {
    version: "SSL 2.0",
    year: 1995,
    status: "insecure",
    features: ["First public SSL release", "Anonymous authentication", "MD5-based MAC"],
    deprecationDate: "2011 (RFC 6176)",
    details: "Netscape's original SSL protocol. Multiple cryptographic weaknesses: no protection against message alteration, uses weak MD5 hashes, supports anonymous Diffie-Hellman. Broken by multiple attacks including downgrade attacks.",
    rfc: "Not formally RFC'd",
  },
  {
    version: "SSL 3.0",
    year: 1996,
    status: "insecure",
    features: ["Improved handshake", "SHA-1 MAC option", "Export-grade cipher suites", "Renegotiation support"],
    deprecationDate: "2015 (RFC 7568)",
    details: "Major redesign by Netscape. Introduced the SSL handshake protocol that formed the basis for all later versions. Vulnerable to POODLE attack (2014), BEAST, and downgrade attacks. MUST NOT be used.",
    rfc: "RFC 6101",
  },
  {
    version: "TLS 1.0",
    year: 1999,
    status: "insecure",
    features: ["HMAC-based MAC", "PRF based on HMAC-SHA1 and HMAC-MD5", "TLS extensions framework", "Alert protocol"],
    deprecationDate: "2021 (RFC 8996)",
    details: "First IETF-standardized version. Essentially SSL 3.1 with a name change. Vulnerable to BEAST attack (2011), CRIME, Lucky 13, RC4 biases. PCI DSS prohibited after June 2018. All major browsers have removed support.",
    rfc: "RFC 2246",
  },
  {
    version: "TLS 1.1",
    year: 2006,
    status: "insecure",
    features: ["Explicit IV to prevent BEAST", "IANA registry for cipher suites", "Support for IANA parameters"],
    deprecationDate: "2021 (RFC 8996)",
    details: "Minor upgrade addressing BEAST vulnerability with explicit initialization vectors. Still uses same underlying cryptographic primitives as TLS 1.0. Vulnerable to Lucky 13, POODLE-TLS, and RC4 weaknesses.",
    rfc: "RFC 4346",
  },
  {
    version: "TLS 1.2",
    year: 2008,
    status: "deprecated",
    features: ["SHA-256/SHA-384 HMAC", "AEAD cipher suites (GCM, CCM)", "Extensible cipher suite negotiation", "TLS 1.2 extensions framework", "Removal of ID & export ciphers"],
    deprecationDate: "Recommended to migrate to TLS 1.3",
    details: "Widely deployed version. Introduced authenticated encryption with associated data (AEAD). Supports SHA-256 PRF. Still considered secure with proper cipher suite selection (TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256). PCI DSS compliant. However, lacks 0-RTT and modern features of TLS 1.3.",
    rfc: "RFC 5246",
  },
  {
    version: "TLS 1.3",
    year: 2018,
    status: "secure",
    features: ["0-RTT handshake (resumption)", "Removed static RSA & DH key exchange", "Only AEAD cipher suites (AES-GCM, ChaCha20-Poly1305)", "1-RTT handshake (reduced latency)", "Forward secrecy by default", "Encrypted handshake messages", "Downgrade protection via server_random"],
    deprecationDate: "Current standard",
    details: "Major simplification with only 5 cipher suites. Eliminates vulnerable primitives. 0-RTT allows data from the first message. Handshake completes in one round trip (or zero with PSK). All handshake messages after ServerHello are encrypted. Mandatory forward secrecy. Perfect for modern web performance requirements.",
    rfc: "RFC 8446",
  },
];

function getStatusConfig(status: TlsVersion["status"]) {
  switch (status) {
    case "secure":
      return { label: "Secure", variant: "success" as const, color: "bg-emerald-500" };
    case "deprecated":
      return { label: "Deprecated", variant: "warning" as const, color: "bg-amber-500" };
    case "insecure":
      return { label: "Insecure", variant: "error" as const, color: "bg-red-500" };
  }
}

export default function TlsVersionsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `TLS/SSL Versions Timeline — ${SITE_NAME}`, description: `Timeline of SSL/TLS protocol versions from SSL 2.0 to TLS 1.3.`, url: `${SITE_URL}/tls-versions`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            TLS/SSL Versions Timeline
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Timeline of SSL and TLS protocol versions from 1995 to present. See which versions are secure, deprecated, or insecure with key features and deprecation dates.
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative">
            <div className="absolute bottom-0 left-8 top-0 hidden w-0.5 bg-zinc-200 dark:bg-zinc-700 sm:block" />
            <div className="space-y-8">
              {TLS_VERSIONS.map((tls, i) => {
                const statusConfig = getStatusConfig(tls.status);
                const isLast = i === TLS_VERSIONS.length - 1;
                return (
                  <div key={tls.version} className="relative sm:pl-16">
                    <div className={`absolute left-6 top-6 hidden size-4 rounded-full border-2 border-white sm:block ${statusConfig.color}`} />
                    {!isLast && <div className="absolute bottom-0 left-[27px] top-8 hidden w-0.5 bg-zinc-200 dark:bg-zinc-700 sm:block" />}
                    <Card variant="default" className="relative">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{tls.version}</h2>
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        <span className="text-sm text-zinc-500">Released {tls.year}</span>
                      </div>
                      {tls.deprecationDate && (
                        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                          <span className="font-medium">Deprecation:</span> {tls.deprecationDate}
                        </p>
                      )}
                      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{tls.details}</p>
                      <div className="mt-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Key Features</h3>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {tls.features.map((f) => (
                            <li key={f}>
                              <Badge variant="neutral">{f}</Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="mt-2 text-xs text-zinc-400">{tls.rfc}</p>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          <Card variant="default" className="mt-12">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Current Recommendation</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              <strong className="text-zinc-900 dark:text-zinc-50">TLS 1.3</strong> is the current recommended version. Disable SSL 2.0, SSL 3.0, TLS 1.0, and TLS 1.1 on all servers. Use <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> to verify your server supports only secure TLS versions. The PCI Security Standards Council requires TLS 1.2 or higher.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
