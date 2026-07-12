import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Card, Badge, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: `Hash Algorithm Comparison — MD5, SHA-1, SHA-256 & More`,
  description: `Compare MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hash algorithms. Bit length, block size, rounds, security status, and use cases for each algorithm.`,
  alternates: { canonical: `${SITE_URL}/hash-algorithms` },
  openGraph: {
    title: `Hash Algorithm Comparison`,
    description: `Side-by-side comparison of popular hash algorithms with security status and recommendations.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Hash Algorithms" },
];

interface HashAlgo {
  name: string;
  bitLength: number;
  blockSize: number;
  rounds: number;
  status: "secure" | "deprecated" | "insecure";
  description: string;
  useCases: string[];
  weaknesses: string[];
  published: number;
}

const ALGORITHMS: HashAlgo[] = [
  {
    name: "MD5",
    bitLength: 128,
    blockSize: 512,
    rounds: 64,
    status: "insecure",
    description: "Message Digest Algorithm 5. Designed by Ron Rivest in 1991. Widely used for file integrity checks but fundamentally broken for security purposes.",
    useCases: ["Legacy checksums", "Non-cryptographic integrity checks", "Legacy systems compatibility"],
    weaknesses: ["Collision attacks demonstrated publicly (2004)", "Chosen-prefix collisions (2007)", "Can generate same hash from different inputs trivially"],
    published: 1992,
  },
  {
    name: "SHA-1",
    bitLength: 160,
    blockSize: 512,
    rounds: 80,
    status: "insecure",
    description: "Secure Hash Algorithm 1. Published by NIST in 1995. Was the industry standard for digital signatures until collision attacks proved it unsafe.",
    useCases: ["Legacy SSL/TLS certificates", "Git commit IDs (partial collision resistance)", "Legacy code signing"],
    weaknesses: ["SHAttered collision attack (2017)", "Practical chosen-prefix collision (2020)", "Cost under $100K to forge a collision"],
    published: 1995,
  },
  {
    name: "SHA-256",
    bitLength: 256,
    blockSize: 512,
    rounds: 64,
    status: "secure",
    description: "SHA-2 family member with 256-bit output. Current industry standard for digital signatures, TLS certificates, and blockchain applications.",
    useCases: ["TLS/SSL certificates", "Blockchain (Bitcoin, Ethereum)", "Digital signatures", "Code signing", "Password hashing (with salt)"],
    weaknesses: ["Theoretically vulnerable to length extension attacks (mitigated by HMAC)", "Slower than MD5 and SHA-1"],
    published: 2001,
  },
  {
    name: "SHA-384",
    bitLength: 384,
    blockSize: 1024,
    rounds: 80,
    status: "secure",
    description: "SHA-2 family member with 384-bit output. Truncated version of SHA-512 with different initial values. Resistant to length extension attacks.",
    useCases: ["High-security TLS certificates", "Government applications (Suite B)", "When SHA-256 is insufficient but SHA-512 is overkill"],
    weaknesses: ["Slightly slower than SHA-256", "Less hardware support than SHA-256"],
    published: 2001,
  },
  {
    name: "SHA-512",
    bitLength: 512,
    blockSize: 1024,
    rounds: 80,
    status: "secure",
    description: "SHA-2 family member with 512-bit output. Highest bit length in SHA-2 family. Used in high-security environments requiring maximum collision resistance.",
    useCases: ["High-security cryptographic systems", "DNSSEC signing", "Digital signatures requiring 256-bit security level", "Long-term archival"],
    weaknesses: ["Larger output size increases storage", "Slower than SHA-256 on 32-bit systems", "Not always necessary — often overkill"],
    published: 2001,
  },
];

function getStatusConfig(status: HashAlgo["status"]) {
  switch (status) {
    case "secure":
      return { label: "Secure", variant: "success" as const };
    case "deprecated":
      return { label: "Deprecated", variant: "warning" as const };
    case "insecure":
      return { label: "Insecure — Do Not Use", variant: "error" as const };
  }
}

export default function HashAlgorithmsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Hash Algorithm Comparison — ${SITE_NAME}`, description: `Compare MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hash algorithms.`, url: `${SITE_URL}/hash-algorithms`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Hash Algorithm Comparison
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Side-by-side comparison of popular hash algorithms including MD5, SHA-1, SHA-256, SHA-384, and SHA-512 with technical specifications, security status, and recommendations.
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">Algorithm</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">Bit Length</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">Block Size</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">Rounds</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">Status</th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50 md:table-cell">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {ALGORITHMS.map((algo) => {
                  const statusConfig = getStatusConfig(algo.status);
                  return (
                    <tr key={algo.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                      <td className="px-4 py-4 font-mono text-base font-bold text-zinc-900 dark:text-zinc-50">{algo.name}</td>
                      <td className="px-4 py-4 text-zinc-700 dark:text-zinc-300">{algo.bitLength} bits</td>
                      <td className="px-4 py-4 text-zinc-700 dark:text-zinc-300">{algo.blockSize} bits</td>
                      <td className="px-4 py-4 text-zinc-700 dark:text-zinc-300">{algo.rounds}</td>
                      <td className="px-4 py-4"><Badge variant={statusConfig.variant}>{statusConfig.label}</Badge></td>
                      <td className="hidden px-4 py-4 text-zinc-500 dark:text-zinc-500 md:table-cell">{algo.published}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-12 space-y-8">
            {ALGORITHMS.map((algo) => {
              const statusConfig = getStatusConfig(algo.status);
              return (
                <Card key={algo.name} variant="default">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-mono text-xl font-bold text-zinc-900 dark:text-zinc-50">{algo.name}</h2>
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{algo.description}</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Use Cases</h3>
                      <ul className="mt-2 space-y-1">
                        {algo.useCases.map((u) => (
                          <li key={u} className="text-sm text-zinc-600 dark:text-zinc-400">• {u}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Known Weaknesses</h3>
                      <ul className="mt-2 space-y-1">
                        {algo.weaknesses.map((w) => (
                          <li key={w} className="text-sm text-zinc-600 dark:text-zinc-400">• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Callout variant="warning" title="Security Recommendation" className="mt-12">
            <p className="text-sm">SHA-256 is the recommended minimum standard as of 2026. For new systems, prefer SHA-256 or SHA-512. Do not use MD5 or SHA-1 for any security-sensitive application. All major browsers and CA/Browser Forum guidelines require SHA-256 or higher for TLS certificates.</p>
          </Callout>

          <Card variant="default" className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Try hash generation</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Use our <Link href="/sha-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">SHA Hash Generator</Link> or <Link href="/md5-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">MD5 Hash Generator</Link> to compute hashes directly in your browser.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
