import type { Metadata } from "next";
import { Md5HashGenerator } from "@/components/md5-hash-generator/md5-hash-generator";
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

const slug = "md5-hash-generator";
const pageTitle = "MD5 Hash Generator - Generate MD5 Hash Online";
const pageDescription =
  "Generate MD5 hash digests from any text or string input. Free online MD5 generator for checksums, data integrity verification, and non-cryptographic hashing needs.";

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
  { label: "MD5 Hash Generator" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the MD5 hash algorithm and how does it work?",
    answer:
      "MD5 (Message Digest 5) is a cryptographic hash function that produces a 128-bit (32-character hexadecimal) digest from input data of any size. It processes input in 512-bit blocks through four rounds of nonlinear functions, bitwise operations, and modular additions. Despite its cryptographic origins, MD5 is no longer considered secure against collision attacks and should not be used for password storage, digital signatures, or certificate verification. It remains useful for non-security applications like file integrity checksums and duplicate detection.",
  },
  {
    question: "Is MD5 secure enough for password hashing?",
    answer:
      "No. MD5 is completely unsuitable for password hashing in modern applications. It is both fast to compute (attackers can try billions of passwords per second with consumer hardware) and vulnerable to collision attacks. Hashcat and similar tools can crack MD5 hashes at a rate of over 50 billion attempts per second on a single GPU. Use dedicated password hashing algorithms like bcrypt, argon2, or scrypt instead, which are deliberately slow and include per-password salts to prevent rainbow table attacks.",
  },
  {
    question: "What is the difference between MD5, SHA-1, and SHA-256?",
    answer:
      "MD5 produces a 128-bit digest, SHA-1 produces 160 bits, and SHA-256 produces 256 bits. All three are cryptographic hash functions, but MD5 and SHA-1 are broken for security use cases. SHA-256 is currently considered secure and is recommended for any application requiring collision resistance. The longer digest of SHA-256 makes brute-force attacks exponentially harder. Use ToolVerse&apos;s <Link href=\"/sha-hash-generator\" className=\"text-blue-600 hover:underline dark:text-blue-400\">SHA Hash Generator</Link> when you need a cryptographically secure hash function.",
  },
  {
    question: "What are MD5 collisions and why do they matter?",
    answer:
      "An MD5 collision occurs when two different inputs produce the same 128-bit hash. Researchers demonstrated practical MD5 collisions as early as 2004, and by 2008 researchers created a rogue CA certificate that exploited MD5 collisions to impersonate any website. Today, collisions can be generated in seconds on consumer hardware. This means MD5 cannot be used to verify digital signatures, detect file tampering, or provide any form of security guarantee. For integrity verification in adversarial contexts, use SHA-256 or higher.",
  },
  {
    question: "What is MD5 still used for in modern development?",
    answer:
      "MD5 remains widely used for non-security purposes where collision resistance is not required. File hosting services use MD5 checksums to detect duplicate uploads. Data pipelines use MD5 as a quick deduplication hash for rows or records. Some databases use MD5 for shard key hashing because it distributes values uniformly. CDNs and package registries provide MD5 checksums alongside SHA-256 as a convenience for users who want a quick integrity check. The key is understanding the threat model: MD5 is fine for accidental corruption detection but not for intentional tampering detection.",
  },
  {
    question: "Can two different strings have the same MD5 hash?",
    answer:
      "Yes. Due to the pigeonhole principle, there are infinitely many possible inputs but only 2^128 possible MD5 hashes. Collisions are guaranteed to exist, and with MD5 they are computationally cheap to find. For a randomly chosen pair of inputs, the probability of collision is about 10^-38, which is negligible. But an attacker can deliberately craft colliding inputs, which is why MD5 is insecure for security applications. This is fundamentally different from a rare accidental collision.",
  },
  {
    question: "How do I use MD5 hashes for file integrity checking?",
    answer:
      "Download the file and compute its MD5 hash on your local machine using md5sum (Linux/macOS) or certutil -hashfile (Windows). Compare the result against the checksum provided by the file source. If they match, the file is intact and uncorrupted from when the checksum was computed. Note that this only verifies integrity, not authenticity: if an attacker can modify both the file and the published checksum, you will not detect the tampering. Use GPG signatures or SHA-256 hashes from trusted sources for authenticity verification.",
  },
  {
    question: "What is the output format of an MD5 hash?",
    answer:
      "An MD5 hash is a 32-character hexadecimal string using lowercase letters a-f and digits 0-9. The hash is typically written in groups for readability but the standard representation is a continuous string: d41d8cd98f00b204e9800998ecf8427e. Some tools output uppercase hex digits or separate the hash with a filename on the same line. The hash value itself is case-insensitive, but checksum comparisons should normalize to lowercase to avoid false mismatches.",
  },
  {
    question: "How does salting affect MD5 hashing?",
    answer:
      "Salting appends a random string (the salt) to the input before hashing. With a unique salt per input, identical inputs produce different hashes. Salting prevents rainbow table attacks and makes it impossible to tell whether two inputs are the same just by comparing hashes. However, salting does not fix MD5&apos;s collision vulnerability or its speed problem. A salted MD5 hash is still trivially brute-forced. Always use a slow, adaptive hash function like argon2 for password storage instead of salting a fast hash like MD5.",
  },
  {
    question: "What is the &quot;hash length extension attack&quot; on MD5?",
    answer:
      "MD5 (and SHA-1, SHA-256) are vulnerable to length extension attacks. Given H(message) and the length of message, an attacker can compute H(message || padding || extension) without knowing the message content. This breaks the use of MD5 as a message authentication code when using the naive H(secret || message) construction. Use HMAC-MD5 instead, which wraps the hash in a construction designed to prevent length extension. Better yet, use HMAC-SHA256 for any MAC-based authentication.",
  },
  {
    question: "How fast can modern hardware compute MD5 hashes?",
    answer:
      "Extremely fast. Modern GPUs can compute billions of MD5 hashes per second. An RTX 4090 achieves approximately 100 billion MD5 hashes per second with hashcat. This means any 8-character password hashed with MD5 can be cracked in minutes, regardless of the character set. This performance makes MD5 useful for non-security operations like checksums but completely disqualifies it for password storage. The same hardware can compute SHA-256 at similar speeds, so SHA-256 alone does not fix the password problem.",
  },
];

export default function Md5HashGeneratorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="MD5 Hash Generator"
            description="Generate MD5 hash digests from any text input. Use for checksums, data integrity verification, deduplication, and non-cryptographic hashing tasks."
            breadcrumbs={breadcrumbs}
          >
            <Md5HashGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            The MD5 Algorithm: From Cryptographic Breakthrough to Legacy Hash
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Designed by Ronald Rivest in 1991, MD5 was the successor to MD4 and quickly became the most widely used cryptographic hash function of its era. It was adopted everywhere: SSL certificates, software distribution checksums, Unix password hashing, and digital signatures. The algorithm processes input in 512-bit blocks through 64 steps of nonlinear mixing, producing a 128-bit fingerprint that appeared to be collision-resistant. For over a decade, MD5 was the default choice for any hashing need, and its legacy persists in countless systems and protocols that still reference MD5 in their specifications.
            </p>
            <p>
              The cracks began showing in 1996 when Dobbertin announced a collision in the MD5 compression function. By 2004, Wang and Yu demonstrated real collisions on a standard PC. The final nail came in 2008 when researchers used MD5 collisions to create a rogue CA certificate that browsers trusted. MD5 is now universally considered broken for security applications. Yet it survives in non-security roles because its speed and 128-bit output remain useful for deduplication, sharding, and integrity checks where the threat model excludes intentional tampering. For secure hashing needs, use ToolVerse&apos;s <Link href="/sha-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">SHA Hash Generator</Link> which offers SHA-256 and SHA-512 with collision resistance suitable for modern security requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Practical Use Cases for MD5 Hashes in 2026
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Despite its security flaws, MD5 remains useful in contexts where collision resistance is not required and the trade-off of speed versus digest size makes sense. Content-addressable storage systems like Git (though Git uses SHA-1) rely on hash-based object identification where the hash is a content key, not a security guarantee. MD5 serves the same role in many backup systems and artifact repositories that use content-addressed storage. File hosting services use MD5 to detect duplicate uploads, saving storage space by identifying identical files regardless of their filenames.
            </p>
            <p>
              Database administrators use MD5 as a sharding key or partition key because it distributes values evenly across shards regardless of the input distribution. ETL pipelines compute MD5 of rows to detect changes between source and destination: if the hash matches, the row is unchanged and can be skipped. CDN configuration validation and asset caching often use MD5-based etags or cache keys. The key in all these cases is that the cost of a collision (two files sharing the same hash) is acceptable: you might delete a file that is almost certainly not a duplicate, but you will not create a security vulnerability. For generating unique identifiers in database applications, the <Link href="/uuid-generator" className="text-blue-600 hover:underline dark:text-blue-400">UUID Generator</Link> provides a better collision-resistant alternative than MD5 for primary key generation.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            MD5 Security Concerns: What Developers Must Know
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The fundamental problem with MD5 is that it is both too fast and too broken. Hash functions used for security need two properties: preimage resistance (given a hash, it should be hard to find any input that produces that hash) and collision resistance (it should be hard to find two different inputs that produce the same hash). MD5 fails catastrophically on collision resistance. In 2008, researchers created two different SSL certificates with the same MD5 hash, one for a legitimate CA and one for an attacker-controlled domain. This exploit meant that an attacker could obtain a valid certificate for any domain by exploiting the collision.
            </p>
            <p>
              For password storage, MD5&apos;s speed is its downfall. Modern password hashing algorithms like argon2 and bcrypt are designed to be computationally expensive, limiting brute-force attack rates. MD5 was designed to be fast on 1990s hardware, and that speed is now an attacker&apos;s advantage. Even without collisions, a GPU cluster can enumerate the entire 8-character lowercase password space in hours. When auditing legacy systems, replace MD5 password hashes immediately. For JWT token signing or authentication protocols, MD5 is equally inappropriate. Decode and inspect your current authentication tokens using the <Link href="/jwt-decoder" className="text-blue-600 hover:underline dark:text-blue-400">JWT Decoder</Link> to verify they use secure signing algorithms like RS256 or HS256, not MD5-based schemes.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Alternatives to MD5 and When to Use Each
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Choosing the right hash function depends entirely on your use case. For file integrity verification where the checksum source is trusted, MD5 and SHA-1 remain acceptable despite their security flaws because the threat model is accidental corruption, not targeted tampering. If the checksum is distributed separately from the file, upgrade to SHA-256 or SHA-512 for defense in depth. For password hashing, use argon2id (the recommended variant of argon2) or bcrypt with a cost factor of at least 10. For digital signatures, use SHA-256 with RSA (RS256) or ECDSA (ES256). For content-addressed storage where hash is used as a key, SHA-256 provides collision safety margins that MD5 lacks.
            </p>
            <p>
              In modern development, the trend is toward SHA-256 as the minimum acceptable hash for any public-facing integrity verification. Package managers like npm, pip, and cargo all use SHA-256 or SHA-512 for package integrity. Linux distribution repositories have migrated from MD5 to SHA-256 for package checksums. The message is clear: use MD5 only when you control both ends of the integrity check and understand the risk. For any public or security-critical application, SHA-256 is the baseline, and the <Link href="/sha-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">SHA Hash Generator</Link> provides multiple SHA variants to suit your security requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About MD5 Hashing" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔑", title: "SHA Hash Generator", description: "Generate SHA-1, SHA-256, and SHA-512 hash digests", href: "/sha-hash-generator" },
              { icon: "🔲", title: "UUID Generator", description: "Generate UUID v4 identifiers for database keys and IDs", href: "/uuid-generator" },
              { icon: "🔐", title: "Base64 Encoder", description: "Encode and decode Base64 strings for data transport", href: "/base64-encoder" },
              { icon: "🪙", title: "JWT Decoder", description: "Decode and inspect JSON Web Token headers and payloads", href: "/jwt-decoder" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="md5-hash-generator" />
    </>
  );
}
