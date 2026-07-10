import type { Metadata } from "next";
import { ShaHashGenerator } from "@/components/sha-hash-generator/sha-hash-generator";
import {
  ToolLayout,
  ToolHero,
  FaqSection,
  RelatedTools,
  RelatedContent,
  JsonLd,
} from "@/components/shared";
import {
  faqSchema,
  webPageSchema,
  breadcrumbSchema,
  softwareAppSchema,
  type FaqItem,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";

const slug = "sha-hash-generator";
const pageTitle = "SHA Hash Generator - Generate SHA-1, SHA-256, SHA-384, SHA-512 Online";
const pageDescription =
  "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hash digests from any text input. Free online SHA hash generator for checksums, file integrity verification, and cryptographic hashing.";

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
  { label: "Code & Development", href: `${SITE_URL}/category/code-dev` },
  { label: "SHA Hash Generator" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between SHA-1, SHA-256, SHA-384, and SHA-512?",
    answer:
      "These are members of the SHA-2 family (except SHA-1 which is the original) distinguished by their output digest size and security level. SHA-1 produces 160-bit (20-byte) digests and is considered cryptographically broken. SHA-256 produces 256-bit (32-byte) digests with a security level of 128 bits against collision attacks. SHA-384 produces 384-bit (48-byte) digests with 192-bit security. SHA-512 produces 512-bit (64-byte) digests with 256-bit security. Higher bit lengths provide exponentially more collision resistance but produce longer hash strings. SHA-256 is the recommended minimum for most modern applications.",
  },
  {
    question: "Is SHA-1 still safe to use in 2026?",
    answer:
      "No. SHA-1 has been practically broken for collision resistance since 2017 when Google and CWI demonstrated the SHAttered attack, producing the first known SHA-1 collision using approximately 9,223,372,036,854,775,808 SHA-1 computations. In 2020, a chosen-prefix collision attack was demonstrated, making SHA-1 completely unsuitable for digital signatures, certificate verification, or any security-critical application. All major browsers stopped accepting SHA-1 certificates in 2017. SHA-1 may still be used for non-security purposes like deduplication or hash tables where collision resistance is not required.",
  },
  {
    question: "When should I use SHA-256 versus SHA-512?",
    answer:
      "SHA-256 is the best default for most applications. It provides 128-bit collision resistance, which exceeds any practical brute-force capability, and produces a reasonably sized 64-character hex digest. SHA-512 is preferable when maximum security margin is required, such as for long-lived digital signatures, government-grade systems, or post-quantum planning. SHA-512 is also faster on 64-bit hardware because it operates on 64-bit words instead of SHA-256's 32-bit words; x86-64 processors can compute SHA-512 approximately 50% faster than SHA-256. For hashing passwords, however, neither SHA-256 nor SHA-512 should be used directly — use argon2 or bcrypt instead.",
  },
  {
    question: "What is a SHA collision and how likely is it?",
    answer:
      "A collision occurs when two different inputs produce the same hash digest. Due to the pigeonhole principle, collisions are mathematically guaranteed for any hash function because the input space is infinite while the output space is finite. For SHA-256, finding a collision by brute force would require approximately 2^128 ≈ 3.4 × 10^38 attempts, which is computationally infeasible with current and foreseeable technology. For context, the entire Bitcoin network performs about 2^65 SHA-256 hashes per year. SHA-1 collisions were demonstrated at a cost of about $110,000 in cloud compute time, while a SHA-256 collision would cost exponentially more.",
  },
  {
    question: "Can SHA-256 hashes be reversed or decrypted?",
    answer:
      `No. SHA-256 is a one-way cryptographic hash function, not an encryption algorithm. It is mathematically infeasible to reverse a SHA-256 hash to recover the original input. The only attack vectors are brute-force (trying every possible input until the hash matches) and precomputed lookup tables (rainbow tables). For common passwords or short strings, an attacker can compute SHA-256 of a large dictionary and compare against your hash. This is why password storage requires slow, salted algorithms like argon2 rather than plain SHA-256. Use Nuvora's <Link href="/md5-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">MD5 Hash Generator</Link> for non-security hashing or <Link href="/jwt-decoder" className="text-blue-600 hover:underline dark:text-blue-400">JWT Decoder</Link> for token inspection.`,
  },
  {
    question: "What is HMAC and how does it relate to SHA hashing?",
    answer:
      "HMAC (Hash-based Message Authentication Code) uses a cryptographic hash function combined with a secret key to provide both integrity and authenticity verification. HMAC-SHA256 is the most widely used construction. Unlike plain SHA-256, which anyone can compute, HMAC requires knowing the secret key to both create and verify the MAC. This prevents length extension attacks that affect plain SHA-256. HMAC is used in JWT token signing (HS256 algorithm), API request authentication (AWS Signature V4 uses HMAC-SHA256), and TLS protocol operations.",
  },
  {
    question: "How does salting affect SHA hashing?",
    answer:
      "A salt is a random value appended to the input before hashing. With a unique salt per input, identical inputs produce different hashes. This prevents rainbow table attacks and makes it impossible to determine whether two hashed values correspond to the same plaintext. However, SHA-256 with a salt is still vulnerable to brute-force attacks because SHA-256 is designed to be fast. Modern password hashing algorithms like argon2, bcrypt, and scrypt are specifically designed to be computationally expensive, incorporating salt automatically and allowing work factor configuration to keep pace with hardware improvements.",
  },
  {
    question: "What are the practical use cases for different SHA variants?",
    answer:
      "SHA-256 is the industry standard for file integrity verification, software package checksums (npm, pip, Docker use SHA-256), blockchain transactions (Bitcoin uses double SHA-256), code signing, and TLS certificate signatures. SHA-512 is used in DNSSEC, some blockchain implementations like NXT, and applications requiring extra security margin. SHA-384 is used in specific government standards (FIPS 140-2 Level 4) and some SSH implementations. SHA-1 persists in legacy Git repositories for object hashing, though Git is transitioning to SHA-256 with the v2 hash algorithm. For most software development needs, SHA-256 is the correct choice.",
  },
  {
    question: "How do length extension attacks affect SHA-256?",
    answer:
      "SHA-256 (and SHA-512) are vulnerable to length extension attacks. Given H(message) and the length of message, an attacker can compute H(message || padding || extension) without knowing the message content. This breaks the naive construction H(secret || message) used for message authentication. HMAC is specifically designed to defeat length extension by using the key in two separate hash computations: H((key' ⊕ opad) || H((key' ⊕ ipad) || message)). SHA-512 is equally vulnerable. SHA-384 is not vulnerable because it truncates the output, removing the hash state that length extension exploits.",
  },
  {
    question: "What is the output size of each SHA variant in hex characters?",
    answer:
      "SHA-1 produces 40 hex characters (160 bits / 4 bits per hex char). SHA-224 produces 56 characters. SHA-256 produces 64 characters. SHA-384 produces 96 characters. SHA-512 produces 128 characters. The hex representation doubles the byte length because each byte is represented by two hexadecimal digits. SHA-512's 128-character hex string is the longest commonly used, though SHA-512/256 truncates SHA-512 to the first 256 bits (64 hex chars) while using the 64-bit word operations for better performance on 64-bit architectures.",
  },
  {
    question: "What is SHA-3 and how is it different from SHA-2?",
    answer:
      "SHA-3 is the newest member of the Secure Hash Algorithm family, standardized by NIST in 2015. Unlike SHA-2 which uses the Merkle-Damgård construction, SHA-3 is based on the Keccak sponge construction, which is fundamentally different and not vulnerable to length extension attacks. SHA-3 supports the same output sizes as SHA-2: 224, 256, 384, and 512 bits. Despite being more modern, SHA-3 has not seen widespread adoption because SHA-256 remains secure and hardware-accelerated SHA extensions are available on most modern CPUs, while SHA-3 hardware support is less common.",
  },
  {
    question: "How do I verify a SHA checksum on Windows?",
    answer:
      "Windows includes the certutil command-line tool for computing SHA hashes. Use certutil -hashfile filename SHA256 to compute a SHA-256 hash. Replace SHA256 with SHA1, SHA384, or SHA512 for other variants. PowerShell also provides Get-FileHash -Algorithm SHA256 filename. The Linux/Unix equivalents are sha256sum, sha1sum, sha512sum, and shasum -a 256. Always verify checksums from trusted sources published over HTTPS or GPG-signed distribution lists.",
  },
];

export default function ShaHashGeneratorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="SHA Hash Generator"
            description="Generate SHA-1, SHA-256, SHA-384, and SHA-512 hash digests from any text input. Choose the variant that matches your security requirements."
            breadcrumbs={breadcrumbs}
          >
            <ShaHashGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Choosing the Right SHA Variant for Your Use Case
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The SHA family of hash functions spans multiple decades and security levels, and choosing the wrong variant can leave you with either unnecessary overhead or inadequate protection. SHA-1, once the workhorse of the internet, was officially deprecated by NIST in 2011 and all major browsers stopped accepting SHA-1 TLS certificates in 2017. Today, SHA-1 should only be used for backward compatibility with legacy systems that cannot be updated. Its 160-bit output is too short for collision resistance against modern computing power, as demonstrated by the SHAttered attack which produced a collision using the equivalent of 110 GPU-years of computation.
            </p>
            <p>
              For new projects, SHA-256 is the safe default. It offers 128-bit collision resistance, which is computationally infeasible to break with any technology available or anticipated in the next decade. SHA-512 provides an even larger security margin with 256-bit collision resistance and is faster on 64-bit processors, but produces longer hash strings that may be excessive for database storage or display purposes. SHA-384 offers a middle ground with 192-bit security and is required by some government standards. If you need a hash function for password storage, skip SHA entirely and use algorithms designed for that purpose. To compare how different hash functions perform with your data, try the <Link href="/md5-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">MD5 Hash Generator</Link> alongside SHA to see the digest size differences firsthand.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            SHA Hashing in the Software Supply Chain
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Software supply chain security relies heavily on SHA hashes. Package registries like npm, PyPI, and RubyGems publish SHA-256 checksums for every package version so that package managers can verify integrity after download. Docker images use SHA-256 digests as content-addressable identifiers: each image layer is identified by its hash, ensuring that what you pull is exactly what was pushed. When a package is compromised, the hash mismatch during verification provides a strong signal that something is wrong. This chain of trust means that an attacker must either break SHA-256 (computationally infeasible) or compromise the registry&apos;s hash database to go undetected.
            </p>
            <p>
              Git is also transitioning from SHA-1 to SHA-256 for object hashing. The SHA-1 collision attacks demonstrated that an attacker could create two different Git repositories with the same root hash, potentially tricking developers into accepting malicious code. Git&apos;s transition to SHA-256, available as an experimental feature, eliminates this attack vector. For verifying checksums of downloaded software, the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> can help if the checksums are distributed in Base64-encoded format, though most package managers use hexadecimal encoding for SHA digests.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            SHA and the Transition to Post-Quantum Cryptography
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              SHA-256 and SHA-512 are considered quantum-resistant for preimage resistance. Grover&apos;s algorithm for quantum computers can find a preimage in O(2^n/2) operations instead of O(2^n) for classical computers, effectively halving the security level. This means SHA-256&apos;s 128-bit preimage resistance becomes 64-bit against a sufficiently large quantum computer. A 64-bit security level is considered breakable by a determined adversary. SHA-512, with its 256-bit preimage resistance dropping to 128-bit under Grover&apos;s algorithm, maintains adequate security margins even against large-scale quantum computers.
            </p>
            <p>
              This is why government standards bodies recommend SHA-384 or SHA-512 for systems expected to remain secure for decades. The general guidance is to use hash functions with at least 256-bit output (SHA-256 minimum) for any data that needs long-term security guarantees. NIST&apos;s post-quantum cryptographic standards, finalized in 2024, pair SHA-256 and SHA-512 with stateful hash-based signatures like LMS and XMSS. For developers planning ahead, adopting SHA-512 today provides a quantum safety margin without sacrificing performance on modern 64-bit hardware. The <Link href="/uuid-generator" className="text-blue-600 hover:underline dark:text-blue-400">UUID Generator</Link> can be used to create identifiers that pair well with SHA-based integrity verification schemes.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Practical SHA Checksum Verification Workflow
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              A robust software verification workflow starts when you download a file and its accompanying checksum file (often file.tar.gz.sha256). First, compute the SHA hash of the downloaded file using a trusted tool like sha256sum on Linux, shasum -a 256 on macOS, or certutil -hashfile on Windows. Second, compare your computed hash against the published checksum. Third, verify the authenticity of the checksum file itself, ideally through GPG signature verification or HTTPS retrieval from the official domain. This three-step process protects against both accidental corruption and targeted supply chain attacks.
            </p>
            <p>
              Many projects publish checksum files signed with GPG keys. You import the maintainer&apos;s public key from a key server, verify the signature on the checksum file, then verify the file against the checksum. This prevents an attacker who compromised the download server from modifying both the file and its checksum. For data that needs to be encoded or decoded during the verification pipeline, the <Link href="/url-encoder" className="text-blue-600 hover:underline dark:text-blue-400">URL Encoder</Link> helps handle any URL-encoded checksums that some distribution channels use. Remember that a hash only proves integrity, not authenticity — always verify through a trusted channel.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About SHA Hashing" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔑", title: "MD5 Hash Generator", description: "Generate MD5 hash digests for non-cryptographic use cases", href: "/md5-hash-generator" },
              { icon: "🪙", title: "JWT Decoder", description: "Decode and inspect JSON Web Token headers and payloads", href: "/jwt-decoder" },
              { icon: "🔐", title: "Base64 Encoder", description: "Encode and decode Base64 strings for data transport", href: "/base64-encoder" },
              { icon: "🔲", title: "UUID Generator", description: "Generate UUID v4 identifiers for database keys and IDs", href: "/uuid-generator" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="sha-hash-generator" />
    </>
  );
}
