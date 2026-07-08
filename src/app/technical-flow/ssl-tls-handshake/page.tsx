import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `SSL/TLS Handshake Flow — How HTTPS Connections Work | ${SITE_NAME}`,
  description: "Visual guide to the SSL/TLS handshake process. Understand every step of how HTTPS establishes secure connections, from ClientHello to secure data transfer.",
  openGraph: { title: "SSL/TLS Handshake Flow", description: "Visual guide to the SSL/TLS handshake process." },
  twitter: { title: "SSL/TLS Handshake Flow", description: "Visual guide to HTTPS connection establishment." },
  alternates: { canonical: `${SITE_URL}/technical-flow/ssl-tls-handshake` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Technical Flow", href: `${SITE_URL}/technical-flow` },
  { label: "SSL/TLS Handshake" },
];

const STEPS = [
  { num: 1, title: "ClientHello", detail: "The client (browser) initiates the handshake by sending a ClientHello message. It includes the highest TLS version it supports, a list of supported cipher suites, and a random byte string used later in key generation.", actor: "client", color: "blue" },
  { num: 2, title: "ServerHello + Certificate", detail: "The server responds with its own random byte string, the chosen TLS version and cipher suite, and its SSL certificate containing the public key. It may also request a client certificate.", actor: "server", color: "green" },
  { num: 3, title: "Server Key Exchange (if needed)", detail: "For key exchange methods like DHE or ECDHE, the server sends additional key exchange parameters. This enables Perfect Forward Secrecy (PFS) — past sessions cannot be decrypted if the private key is compromised later.", actor: "server", color: "green" },
  { num: 4, title: "ServerHelloDone", detail: "The server signals it has finished sending handshake messages. The client now has everything it needs: the server's certificate, public key, and key exchange parameters.", actor: "server", color: "green" },
  { num: 5, title: "Client Key Exchange", detail: "The client generates a pre-master secret, encrypts it with the server's public key (from the certificate), and sends it to the server. In ECDHE, the client sends its ephemeral Diffie-Hellman parameters instead.", actor: "client", color: "blue" },
  { num: 6, title: "Change Cipher Spec", detail: "Both client and server derive the session keys from the pre-master secret and random values. They send a ChangeCipherSpec message indicating all subsequent messages will be encrypted.", actor: "both", color: "purple" },
  { num: 7, title: "Finished Messages", detail: "Both sides send an encrypted Finished message containing a hash of the entire handshake. Each side verifies the other's Finished message to ensure no tampering occurred.", actor: "both", color: "purple" },
  { num: 8, title: "Secure Connection Established", detail: "The handshake is complete. Both client and server now share symmetric session keys. All subsequent HTTP data is encrypted using the negotiated cipher. TLS 1.3 reduces this to 1 round trip (or 0 for resumed sessions).", actor: "both", color: "indigo" },
];

function FlowStep({ step }: { step: typeof STEPS[number] }) {
  const colorMap: Record<string, string> = { blue: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950", green: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950", purple: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950", indigo: "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950" };
  const badgeMap: Record<string, string> = { blue: "bg-blue-600 text-white", green: "bg-green-600 text-white", purple: "bg-purple-600 text-white", indigo: "bg-indigo-600 text-white" };
  const actorLabels: Record<string, string> = { client: "Client", server: "Server", both: "Both" };
  return (
    <div className={`relative rounded-lg border p-5 ${colorMap[step.color]}`}>
      <div className="flex items-start gap-4">
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${badgeMap[step.color]}`}>{step.num}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
            <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">{actorLabels[step.actor]}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{step.detail}</p>
        </div>
      </div>
      {step.num < STEPS.length && <div className="ml-4 mt-2 h-6 w-0.5 bg-zinc-300 dark:bg-zinc-600" />}
    </div>
  );
}

export default function SslTlsHandshakePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: "SSL/TLS Handshake Flow", description: "Visual guide to the SSL/TLS handshake process.", url: `${SITE_URL}/technical-flow/ssl-tls-handshake`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">SSL/TLS Handshake Flow</h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Step-by-step breakdown of how HTTPS establishes a secure connection.</p>
            </div>
            <SocialShare url={`${SITE_URL}/technical-flow/ssl-tls-handshake`} title="SSL/TLS Handshake Flow" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-8 overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <svg viewBox="0 0 400 280" className="h-auto w-full" aria-label="TLS handshake diagram">
            <defs>
              <marker id="arrowDown" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto"><path d="M0,0 L4,8 L8,0" fill="#3b82f6" /></marker>
              <marker id="arrowUp" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto"><path d="M0,8 L4,0 L8,8" fill="#22c55e" /></marker>
            </defs>
            <rect x="40" y="10" width="90" height="30" rx="6" fill="#3b82f6" />
            <text x="85" y="30" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Client</text>
            <rect x="270" y="10" width="90" height="30" rx="6" fill="#22c55e" />
            <text x="315" y="30" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Server</text>

            <line x1="130" y1="25" x2="270" y2="25" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowDown)" />
            <text x="200" y="20" textAnchor="middle" fontSize="9" fill="#71717a">ClientHello</text>

            <line x1="270" y1="50" x2="130" y2="50" stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#arrowUp)" />
            <text x="200" y="45" textAnchor="middle" fontSize="9" fill="#71717a">ServerHello + Cert</text>

            <line x1="270" y1="75" x2="130" y2="75" stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#arrowUp)" />
            <text x="200" y="70" textAnchor="middle" fontSize="9" fill="#71717a">Key Exchange</text>

            <line x1="270" y1="100" x2="130" y2="100" stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#arrowUp)" />
            <text x="200" y="95" textAnchor="middle" fontSize="9" fill="#71717a">ServerHelloDone</text>

            <line x1="130" y1="125" x2="270" y2="125" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowDown)" />
            <text x="200" y="120" textAnchor="middle" fontSize="9" fill="#71717a">Client Key Exchange</text>

            <line x1="130" y1="150" x2="270" y2="150" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowDown)" />
            <text x="200" y="145" textAnchor="middle" fontSize="9" fill="#71717a">Change Cipher Spec</text>

            <line x1="270" y1="170" x2="130" y2="170" stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#arrowUp)" />
            <text x="200" y="165" textAnchor="middle" fontSize="9" fill="#71717a">Change Cipher Spec</text>

            <line x1="130" y1="190" x2="270" y2="190" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arrowDown)" />
            <text x="200" y="185" textAnchor="middle" fontSize="9" fill="#71717a">Finished</text>
            <line x1="270" y1="205" x2="130" y2="205" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arrowUp)" />
            <text x="200" y="200" textAnchor="middle" fontSize="9" fill="#71717a">Finished</text>

            <line x1="130" y1="235" x2="270" y2="235" stroke="#6366f1" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arrowDown)" />
            <rect x="140" y="220" width="120" height="18" rx="4" fill="#6366f1" opacity="0.15" />
            <text x="200" y="233" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6366f1">Encrypted Data</text>
          </svg>
        </div>

        <div className="space-y-0">
          {STEPS.map((step) => <FlowStep key={step.num} step={step} />)}
        </div>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">TLS 1.3 vs 1.2</h2>
          <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">TLS 1.3 significantly reduces handshake latency by combining steps and removing insecure options:</p>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li><strong className="text-zinc-900 dark:text-zinc-100">Faster:</strong> TLS 1.3 completes in 1 round trip (vs 2 for TLS 1.2). Resumed connections use 0-RTT.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-100">Simpler:</strong> Removes static RSA key exchange, CBC mode ciphers, and insecure compression.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-100">Better defaults:</strong> Only 5 cipher suites instead of dozens. Forward secrecy is mandatory.</li>
          </ul>
          <p className="mt-3 text-sm">Verify your server&apos;s TLS support with our <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link>.</p>
        </div>
      </section>
    </>
  );
}
