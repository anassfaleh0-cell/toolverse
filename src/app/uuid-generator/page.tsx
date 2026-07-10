import type { Metadata } from "next";
import { UuidGenerator } from "@/components/uuid-generator/uuid-generator";
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

const slug = "uuid-generator";
const pageTitle = "UUID Generator - Generate UUID v4 Identifiers Online";
const pageDescription =
  "Generate random UUID v4 identifiers online for use in database keys, distributed systems, correlation IDs, and application development. Free, fast, and privacy-safe.";

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
  { label: "UUID Generator" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is a UUID and what are the different versions?",
    answer:
      "A UUID (Universally Unique Identifier) is a 128-bit identifier standardized by RFC 9562. There are several versions: v1 uses the current timestamp and MAC address for time-based ordering; v4 uses random numbers for maximum unpredictability; v5 generates deterministic IDs from a namespace and name using SHA-1 hashing; v6 is a reordered v1 for better database index performance; v7 encodes a Unix timestamp with random bits for time-ordered UUIDs; and v8 is a custom format for application-specific needs. v4 is the most commonly used version for general-purpose identifier generation.",
  },
  {
    question: "Can UUIDs ever collide or duplicate?",
    answer:
      "The probability of a UUID v4 collision is extraordinarily low. With 122 random bits, you would need to generate about 2.71 trillion UUIDs to have a 50% chance of a single collision. For practical purposes, UUIDs are considered unique without coordination. However, the birthday paradox applies: in a large set of UUIDs, the probability of any collision grows quadratically. Systems generating more than a few billion UUIDs should consider using v7 with time ordering or implement collision detection as a safety net.",
  },
  {
    question: "What is the difference between UUID and GUID?",
    answer:
      "GUID (Globally Unique Identifier) is Microsoft&apos;s implementation of the UUID standard. The terms are often used interchangeably, but GUIDs traditionally follow a slightly different format and default to a v4-like random structure on Windows. In practice, any GUID generated on Windows is a valid UUID, and any UUID is a valid GUID. The main difference is terminology and some minor formatting conventions in string representations.",
  },
  {
    question: "When should I use UUID v4 versus UUID v7?",
    answer:
      "UUID v4 is the safe default when you need unpredictable identifiers and do not require sort ordering. It is ideal for public-facing IDs where predictability could be exploited, such as user IDs or API resource identifiers. UUID v7 is better for database primary keys in B-tree indexes because the time-ordered prefix improves insert performance by reducing page splits. v7 also allows chronological sorting of records without a separate timestamp column. Expect v7 adoption to grow as RFC 9562 standardizes it.",
  },
  {
    question: "What format does a UUID string follow?",
    answer:
      "A standard UUID is a 36-character string in the format 8-4-4-4-12: 32 hexadecimal digits grouped by hyphens, totaling 128 bits. For example: 550e8400-e29b-41d4-a716-446655440000. The hyphens are part of the standard representation but not mandatory for storage. Some systems store UUIDs as 32-character hex strings without hyphens, or as 16-byte binary fields for space efficiency. The variant and version bits are encoded at specific positions within the string.",
  },
  {
    question: "Can UUIDs be used as primary keys in databases?",
    answer:
      "Yes, but with trade-offs. UUIDs as primary keys eliminate the need for centralized ID generation, simplify database merging across shards or replicas, and prevent enumeration attacks. The downsides include larger index size (16 bytes vs 4 bytes for an integer), fragmentation in B-tree indexes with random UUIDs v4, and slower insert performance on large tables. UUID v7 mitigates the index fragmentation issue with time-ordered values. Many modern databases like PostgreSQL have optimized UUID index handling.",
  },
  {
    question: "What is a nil UUID and when is it used?",
    answer:
      "A nil UUID is all zeros: 00000000-0000-0000-0000-000000000000. It represents the absence of a UUID and is analogous to null or zero in other ID systems. It is used as a sentinel value in data structures, as a placeholder for uninitialized fields, and as the namespace argument in UUID v3 and v5 generation. Some systems also use it to represent the root entity or a default value in database schemas.",
  },
  {
    question: "How are UUIDs generated securely in the browser?",
    answer:
      "The Crypto API provides crypto.randomUUID() which generates UUID v4 with cryptographically strong randomness. It is available in all modern browsers and is the recommended method for client-side UUID generation. For older browsers or non-browser environments, you can fall back to Math.random(), but this produces weaker randomness and is not suitable for security-critical applications. Nuvora uses cryptographically secure random number generation for all UUIDs.",
  },
  {
    question: "What is the difference between UUID, ULID, and NanoID?",
    answer:
      "UUID is the standard 128-bit identifier with multiple versions. ULID (Universally Unique Lexicographically Sortable Identifier) is a 128-bit alternative that is case-insensitive, has no hyphens, and is lexicographically sortable by timestamp. NanoID is a smaller, customizable alternative that uses a larger alphabet for shorter IDs at equivalent collision probability. NanoID IDs can be as short as 8 characters for low-volume systems or 21 characters for UUID-level collision resistance. All three serve similar purposes with different trade-offs in size, sortability, and human-friendliness.",
  },
  {
    question: "How does UUID v5 (namespace-based) differ from UUID v4?",
    answer:
      "UUID v5 generates deterministic UUIDs by hashing a namespace UUID and a name string with SHA-1. The same namespace and name always produce the same UUID. This is useful for generating consistent identifiers for entities like DNS names, URLs, or object IDs without storing the mapping. UUID v4 generates purely random IDs with no deterministic relationship to input data. Choose v5 when you need reproducible IDs, and v4 when you need unpredictability or when the input space is not well-defined.",
  },
  {
    question: "Should I store UUIDs as string or binary in my database?",
    answer:
      "Binary (BINARY(16) in MySQL, UUID type in PostgreSQL) is significantly more space-efficient than storing UUIDs as 36-character strings. Binary storage uses 16 bytes versus 36+ bytes for the string representation. It also improves index performance because UUIDs are compared as raw bytes. The trade-off is that binary UUIDs are not human-readable in query results. Most ORMs and database drivers handle the conversion between binary and string representations transparently.",
  },
  {
    question: "Why does my UUID sometimes have lowercase and sometimes uppercase letters?",
    answer:
      "The UUID specification uses hexadecimal digits, which are conventionally written in lowercase. However, many generators produce uppercase hex digits by default or as an option. UUID comparison should always be case-insensitive per the specification. Nuvora generates lowercase UUIDs following the RFC convention. If your application requires case-insensitive storage, normalize UUIDs to lowercase before storing them to avoid duplicate entries caused by case differences.",
  },
];

export default function UuidGeneratorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="UUID Generator"
            description="Generate one or multiple UUID v4 identifiers instantly. Perfect for database keys, API resource IDs, correlation IDs, and distributed system identifiers."
            breadcrumbs={breadcrumbs}
          >
            <UuidGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why UUIDs Are Essential for Modern Distributed Systems
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Distributed systems face a fundamental problem: how to generate unique identifiers across multiple nodes without centralized coordination. Auto-incrementing integers require a single database master that can become a bottleneck and a single point of failure. Sequence-based IDs also leak information about the number of records in your system, which is a security concern for public-facing resources. UUIDs solve this by allowing any node to generate globally unique identifiers independently, using only local information and random bits.
            </p>
            <p>
              This independence is critical for microservices architectures, offline-first applications, and multi-region database deployments. When each service generates its own UUIDs, there is no coordination overhead, no central ID server to maintain, and no risk of ID collision during network partitions. For event sourcing and CQRS systems, UUIDs serve as event IDs that can be generated by any service at any time, ensuring that events can be merged and replayed across the entire system without conflicts. When combined with the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link>, you can structure and validate the complex event payloads that reference these UUIDs.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            UUID vs Sequential IDs: The Great Database Debate
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The choice between UUIDs and sequential integer IDs is one of the most debated topics in database design. Sequential integers are smaller, faster for B-tree index insertion (because they are monotonically increasing), and easier for humans to reference and remember. They also enable paging by ID range, which is more efficient than offset-based paging. However, they expose the total number of records, enable competitors to estimate your growth rate, and create coupling between database instances that makes sharding and replication difficult.
            </p>
            <p>
              UUIDs trade space and index performance for global uniqueness and decoupling. The performance impact of UUID v4 on B-tree indexes is real: random insertions cause page splits and index fragmentation. UUID v7 addresses this by encoding a timestamp in the high-order bits, making UUIDs monotonically increasing by creation time while preserving global uniqueness. PostgreSQL&apos;s UUID type and optimized index handling make this trade-off acceptable for most modern applications. For databases that need to generate IDs server-side, consider combining UUIDs with the <Link href="/md5-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">MD5 Hash Generator</Link> to create deterministic fingerprints of UUIDs for deduplication or partitioning schemes.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Practical Use Cases for UUIDs in Development
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Beyond database primary keys, UUIDs serve as correlation IDs for tracing requests across microservices. When a request enters your system through the API gateway, generate a UUID and pass it through all downstream services in HTTP headers or message metadata. This allows you to reconstruct the entire request flow from logs and identify which service introduced latency or errors. UUIDs are also excellent for idempotency keys: if a client retries a POST request, it sends the same idempotency UUID, and the server can safely detect the duplicate and return the original response without processing the request again.
            </p>
            <p>
              In event-driven architectures, UUIDs identify each event uniquely, enabling exactly-once processing guarantees when combined with idempotent consumers. File upload systems use UUIDs to name stored files, eliminating name collisions when multiple users upload files with the same name. Session identifiers, API keys, and webhook secrets are often UUIDs or UUID-derived strings because they are unguessable and globally unique without requiring a central registry. For testing and development, generating UUIDs on demand helps populate test databases and mock API responses with realistic identifier formats. Use the <Link href="/regex-tester" className="text-blue-600 hover:underline dark:text-blue-400">Regex Tester</Link> to validate UUID formats in your test assertions and API contract tests.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Mistakes When Working with UUIDs
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              One of the most common mistakes is assuming UUIDs are human-friendly. They are not. Using UUIDs in URLs for public-facing web pages creates ugly, unshareable links. For resources that users interact with directly, consider using a shorter slug or hash ID alongside the UUID. Another frequent error is using UUID v1 in distributed systems: because v1 includes the generating machine&apos;s MAC address, it exposes internal network information and creates the possibility of correlation between different IDs generated by the same machine.
            </p>
            <p>
              Developers also commonly mishandle UUID storage by using CHAR(36) instead of BINARY(16), wasting storage space and index performance. In JavaScript, be aware that not all UUID libraries use cryptographically secure randomness by default; the Node.js uuid package uses Math.random() for v4 unless explicitly configured with crypto. Always verify that your UUID generation source is appropriate for your security requirements. For generating UUIDs that conform to specific regex patterns or formatting rules, the <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> helps normalize UUID strings between uppercase and lowercase conventions during testing.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About UUID Generation" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔍", title: "Regex Tester", description: "Test regular expressions with live matching and capture groups", href: "/regex-tester" },
              { icon: "🔡", title: "Case Converter", description: "Convert text between uppercase, lowercase, camelCase, and more", href: "/case-converter" },
              { icon: "🔢", title: "Number Base Converter", description: "Convert numbers between binary, octal, decimal, and hexadecimal", href: "/number-base-converter" },
              { icon: "📋", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="uuid-generator" />
    </>
  );
}
