import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, PrintButton } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Card, Badge } from "@/components/ui";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `SSL/TLS Developer Cheat Sheet — Commands, Ciphers, Protocol Versions | ${SITE_NAME}`,
  description: `Complete SSL/TLS cheat sheet for developers. Quick reference for OpenSSL commands, TLS protocol versions (1.0–1.3), cipher suites, certificate troubleshooting, and common error codes.`,
  alternates: { canonical: `${SITE_URL}/cheat-sheets/developer-ssl-tls` },
  openGraph: {
    title: `SSL/TLS Developer Cheat Sheet — ${SITE_NAME}`,
    description: `Quick reference for OpenSSL commands, TLS protocol versions, cipher suites, certificate troubleshooting, and common error codes.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Cheat Sheets", href: `${SITE_URL}/cheat-sheets` },
  { label: "SSL/TLS Developer Cheat Sheet" },
];

const opensslCommands = [
  { command: "openssl s_client -connect example.com:443", description: "Test TLS connection, view certificate chain, and cipher negotiation", note: "Most common debugging command" },
  { command: "openssl s_client -connect example.com:443 -showcerts", description: "Display full certificate chain including intermediates", note: "Verify chain completeness" },
  { command: "openssl s_client -connect example.com:443 -tls1_2", description: "Force TLS 1.2 connection", note: "Test specific protocol version" },
  { command: "openssl s_client -connect example.com:443 -tls1_3", description: "Force TLS 1.3 connection", note: "TLS 1.3 only" },
  { command: "openssl x509 -in cert.pem -text -noout", description: "Parse and display certificate details", note: "View issuer, subject, validity, SANs" },
  { command: "openssl x509 -in cert.pem -dates -noout", description: "Check certificate validity dates", note: "Quick expiration check" },
  { command: "openssl verify -CAfile ca-bundle.pem cert.pem", description: "Verify certificate against CA bundle", note: "Chain validation" },
  { command: "openssl s_client -connect example.com:443 -servername example.com", description: "SNI-aware connection test", note: "Required for multi-domain hosts" },
  { command: "openssl req -new -newkey rsa:2048 -nodes -keyout key.pem -out csr.pem", description: "Generate a new CSR and private key", note: "RSA 2048-bit recommended" },
  { command: "openssl s_client -connect example.com:443 </dev/null 2>/dev/null | openssl x509 -fingerprint -noout", description: "Get certificate SHA1 fingerprint", note: "Verify certificate identity" },
];

const tlsVersions = [
  { version: "SSL 3.0", year: "1996", status: "Deprecated", features: "Broken — POODLE attack. Do not use.", highlight: true },
  { version: "TLS 1.0", year: "1999", status: "Deprecated", features: "PCI DSS non-compliant. BEAST attack vulnerable.", highlight: true },
  { version: "TLS 1.1", year: "2006", status: "Deprecated", features: "PCI DSS non-compliant. Weak CBC ciphers.", highlight: true },
  { version: "TLS 1.2", year: "2008", status: "Recommended", features: "AEAD ciphers (GCM), ECDHE key exchange, SHA-256 HMAC. Widely supported.", highlight: false },
  { version: "TLS 1.3", year: "2018", status: "Best", features: "0-RTT, only AEAD ciphers (TLS_AES_128_GCM_SHA256, etc.), shorter handshake, forward secrecy by default.", highlight: false },
];

const cipherSuitesTls13 = [
  { cipher: "TLS_AES_128_GCM_SHA256", keyExchange: "ECDHE", auth: "Any", encryption: "AES-128-GCM", bits: 128, recommended: true },
  { cipher: "TLS_AES_256_GCM_SHA384", keyExchange: "ECDHE", auth: "Any", encryption: "AES-256-GCM", bits: 256, recommended: true },
  { cipher: "TLS_CHACHA20_POLY1305_SHA256", keyExchange: "ECDHE", auth: "Any", encryption: "ChaCha20-Poly1305", bits: 256, recommended: true },
  { cipher: "TLS_AES_128_CCM_SHA256", keyExchange: "ECDHE", auth: "Any", encryption: "AES-128-CCM", bits: 128, recommended: false },
];

const cipherSuitesTls12 = [
  { cipher: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256", keyExchange: "ECDHE", auth: "ECDSA", encryption: "AES-128-GCM", bits: 128, recommended: true },
  { cipher: "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256", keyExchange: "ECDHE", auth: "RSA", encryption: "AES-128-GCM", bits: 128, recommended: true },
  { cipher: "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384", keyExchange: "ECDHE", auth: "ECDSA", encryption: "AES-256-GCM", bits: 256, recommended: true },
  { cipher: "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384", keyExchange: "ECDHE", auth: "RSA", encryption: "AES-256-GCM", bits: 256, recommended: true },
  { cipher: "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256", keyExchange: "ECDHE", auth: "RSA", encryption: "ChaCha20-Poly1305", bits: 256, recommended: true },
  { cipher: "TLS_RSA_WITH_AES_128_GCM_SHA256", keyExchange: "RSA", auth: "RSA", encryption: "AES-128-GCM", bits: 128, recommended: false },
  { cipher: "TLS_RSA_WITH_AES_256_CBC_SHA256", keyExchange: "RSA", auth: "RSA", encryption: "AES-256-CBC", bits: 256, recommended: false },
];

const troubleChecklist = [
  { step: "Check certificate expiration", cmd: "openssl x509 -in cert.pem -dates -noout" },
  { step: "Verify certificate chain is complete", cmd: "openssl s_client -connect example.com:443 -showcerts" },
  { step: "Confirm hostname matches Subject / SAN", cmd: "openssl x509 -in cert.pem -text -noout | grep -A1 'Subject Alternative Name'" },
  { step: "Check intermediate certificate is trusted", cmd: "openssl verify -CAfile ca-bundle.pem cert.pem" },
  { step: "Test connection with SNI", cmd: "openssl s_client -connect example.com:443 -servername example.com" },
  { step: "Verify minimum TLS version", cmd: "openssl s_client -connect example.com:443 -tls1_2" },
  { step: "Check for weak cipher suites", cmd: "openssl s_client -connect example.com:443 -cipher 'ALL:COMPLEMENTOFALL'" },
  { step: "Validate certificate revocation (CRL/OCSP)", cmd: "openssl s_client -connect example.com:443 -status" },
  { step: "Check key size (minimum 2048-bit RSA)", cmd: "openssl x509 -in cert.pem -text -noout | grep 'Public-Key'" },
  { step: "Test from external network", cmd: "Use our SSL Certificate Checker tool" },
];

const errorCodes = [
  { error: "SSL_ERROR_SSL", meaning: "General SSL protocol error", commonCause: "Cipher mismatch, protocol version mismatch, corrupt session" },
  { error: "SSL_ERROR_SYSCALL", meaning: "I/O error during SSL operation", commonCause: "Connection reset by peer, network timeout" },
  { error: "SSL_ERROR_ZERO_RETURN", meaning: "TLS/SSL connection closed cleanly", commonCause: "Peer sent close_notify alert" },
  { error: "X509_V_ERR_CERT_HAS_EXPIRED", meaning: "Certificate has expired", commonCause: "Renewal not completed" },
  { error: "X509_V_ERR_CERT_NOT_YET_VALID", meaning: "Certificate is not yet valid", commonCause: "Clock skew, future effective date" },
  { error: "X509_V_ERR_DEPTH_ZERO_SELF_SIGNED_CERT", meaning: "Self-signed certificate in chain", commonCause: "Using self-signed cert in production" },
  { error: "X509_V_ERR_UNABLE_TO_GET_ISSUER_CERT", meaning: "Missing intermediate certificate", commonCause: "Incomplete certificate chain" },
  { error: "X509_V_ERR_HOSTNAME_MISMATCH", meaning: "Certificate hostname does not match", commonCause: "SAN/DN mismatch with requested domain" },
  { error: "X509_V_ERR_CERT_REVOKED", meaning: "Certificate has been revoked", commonCause: "Private key compromised, CA revoked" },
  { error: "error:14094416", meaning: "TLS alert record overflow", commonCause: "Protocol version mismatch, proxy interference" },
];

export default function DeveloperSslTlsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `SSL/TLS Developer Cheat Sheet — Commands, Ciphers, Protocol Versions | ${SITE_NAME}`, description: `Quick reference for OpenSSL commands, TLS protocol versions (1.0–1.3), cipher suite recommendations, certificate troubleshooting, and common error codes.`, url: `${SITE_URL}/cheat-sheets/developer-ssl-tls`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                SSL/TLS Developer Cheat Sheet
              </h1>
              <p className="mt-2 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                OpenSSL commands, protocol versions, cipher suites, and troubleshooting.
              </p>
              <PrintButton />
            </div>
            <SocialShare url={`${SITE_URL}/cheat-sheets/developer-ssl-tls`} title="SSL/TLS Developer Cheat Sheet — Commands, Ciphers, Protocol Versions" />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">OpenSSL Commands</h2>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Command</th>
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Description</th>
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {opensslCommands.map((cmd) => (
                    <tr key={cmd.command} className="font-mono text-xs">
                      <td className="whitespace-nowrap px-4 py-2.5 font-medium text-zinc-900 dark:text-zinc-100">
                        {cmd.command}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                        {cmd.description}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-zinc-500 dark:text-zinc-500">
                        {cmd.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">TLS Protocol Versions</h2>
            <ComparisonMatrix
              headers={["Version", "Year", "Status", "Key Features"]}
              rows={tlsVersions.map((v) => ({
                feature: v.version,
                values: [v.year, v.status, v.features],
                highlight: v.highlight,
              }))}
            />
            <p className="mt-4 text-sm text-zinc-500">
              See our <Link href="/tls-versions" className="text-blue-600 hover:underline dark:text-blue-400">TLS/SSL Versions</Link> reference for detailed version history.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Recommended Cipher Suites</h2>
            <h3 className="mb-3 text-lg font-semibold text-zinc-800 dark:text-zinc-200">TLS 1.3 Ciphers</h3>
            <ComparisonMatrix
              headers={["Cipher", "Key Exchange", "Auth", "Encryption", "Bits", "Recommended"]}
              rows={cipherSuitesTls13.map((c) => ({
                feature: c.cipher,
                values: [c.keyExchange, c.auth, c.encryption, c.bits, c.recommended],
                highlight: !c.recommended,
              }))}
            />
            <h3 className="mb-3 mt-8 text-lg font-semibold text-zinc-800 dark:text-zinc-200">TLS 1.2 Ciphers</h3>
            <ComparisonMatrix
              headers={["Cipher", "Key Exchange", "Auth", "Encryption", "Bits", "Recommended"]}
              rows={cipherSuitesTls12.map((c) => ({
                feature: c.cipher,
                values: [c.keyExchange, c.auth, c.encryption, c.bits, c.recommended],
                highlight: !c.recommended,
              }))}
            />
          </div>

          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Certificate Chain Troubleshooting Checklist</h2>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Step</th>
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Command / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {troubleChecklist.map((item) => (
                    <tr key={item.step}>
                      <td className="px-4 py-2.5 font-medium text-zinc-900 dark:text-zinc-100">{item.step}</td>
                      <td className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{item.cmd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Common Error Codes</h2>
            <ComparisonMatrix
              headers={["Error", "Meaning", "Common Cause"]}
              rows={errorCodes.map((e) => ({
                feature: e.error,
                values: [e.meaning, e.commonCause],
                highlight: e.error.includes("EXPIRED") || e.error.includes("REVOKED") || e.error.includes("MISMATCH"),
              }))}
            />
          </div>

          <Card variant="default">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Related Tools &amp; Resources</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/ssl-certificate-checker"><Badge variant="info">SSL Certificate Checker</Badge></Link>
              <Link href="/tls-versions"><Badge variant="info">TLS/SSL Versions Reference</Badge></Link>
              <Link href="/compare/ssl-certificate-types"><Badge variant="info">SSL Certificate Types Comparison</Badge></Link>
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
