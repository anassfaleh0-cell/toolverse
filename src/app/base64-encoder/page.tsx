import type { Metadata } from "next";
import { Base64Encoder } from "@/components/base64-encoder/base64-encoder";
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

const slug = "base64-encoder";
const pageTitle = "Base64 Encoder Decoder - Encode and Decode Base64 Online";
const pageDescription =
  "Encode text or files to Base64 and decode Base64 strings back to readable text. Free online Base64 encoder and decoder for developers working with data URIs, JWT tokens, and binary data transport.";

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
  { label: "Base64 Encoder Decoder" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is Base64 encoding and why is it used?",
    answer:
      "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format using 64 printable characters (A-Z, a-z, 0-9, +, /). It is used whenever binary data must be transmitted over media designed to handle text. Common applications include embedding images in CSS or HTML as data URIs, encoding JWT payloads, attaching files in email (MIME), and storing binary data in JSON or XML where raw bytes are not allowed.",
  },
  {
    question: "Is Base64 encoding the same as encryption?",
    answer:
      "No. Base64 is an encoding, not encryption or hashing. Any Base64 string can be decoded instantly with no key or secret. It is purely a data representation format that makes binary data safe for text-based transport. Never use Base64 to protect sensitive information. For secure data, use AES encryption, and for irreversible transformations, use SHA-256 or similar cryptographic hash functions.",
  },
  {
    question: "Why does Base64 output end with equal signs?",
    answer:
      "The trailing equal signs (= or ==) are padding characters. Base64 processes input in 3-byte groups and produces 4 characters of output. If the input length is not divisible by 3, padding is added to complete the final group. One equal sign means the original data had 2 bytes in the final group; two equal signs mean it had 1 byte. Some implementations trim the padding, but standard Base64 requires it for proper decoding.",
  },
  {
    question: "What is the difference between Base64, Base64URL, and Base32?",
    answer:
      "Standard Base64 uses + and / characters, which cause problems in URLs and filenames. Base64URL replaces + with - and / with _, and omits padding. Base32 uses 32 characters (A-Z, 2-7) and is case-insensitive, making it suitable for human-readable tokens like TOTP secrets and domain names. Base64 is more space-efficient than Base32 but includes mixed case and special characters.",
  },
  {
    question: "How much larger is data after Base64 encoding?",
    answer:
      "Base64 increases data size by approximately 33%. Every 3 bytes of input become 4 bytes of output. A 1 MB file becomes roughly 1.37 MB after encoding. This overhead is the trade-off for making binary data transportable through text-only channels. For large payloads, consider alternative approaches like multipart form uploads or dedicated binary protocols instead of Base64 embedding.",
  },
  {
    question: "Can Base64 be used for image data in HTML and CSS?",
    answer:
      "Yes. Data URIs allow you to embed Base64-encoded images directly in HTML src attributes or CSS url() references. This eliminates additional HTTP requests but increases page size by 33%. It is best suited for small icons, sprites, and fonts where the extra overhead is negligible and the reduction in HTTP requests improves perceived performance.",
  },
  {
    question: "How does Base64 relate to JWT token encoding?",
    answer:
      "JWT uses Base64URL encoding (not standard Base64) for its header and payload sections. The JWT format takes a JSON object, serializes it, then Base64URL-encodes the result. The trailing padding is typically stripped. You can decode each JWT segment independently using a Base64 decoder. Use ToolVerse&apos;s <Link href=\"/jwt-decoder\" className=\"text-blue-600 hover:underline dark:text-blue-400\">JWT Decoder</Link> to inspect the full token structure, including the header, payload, and signature verification hints.",
  },
  {
    question: "What characters are in the Base64 alphabet?",
    answer:
      "Standard Base64 uses 64 characters: A-Z (26), a-z (26), 0-9 (10), plus (+) and forward slash (/). The 65th character, the equal sign, is used for padding. Some variants change the last two characters: Base64URL uses - and _, and the PEM format used for certificates adds line breaks every 64 characters for readability.",
  },
  {
    question: "Is Base64 encoding reversible?",
    answer:
      "Yes, completely. Base64 is a reversible encoding with no loss of information. Decoding a correctly encoded Base64 string returns the exact original bytes. This distinguishes it from hash functions like MD5 or SHA-256, which are one-way. Because of this reversibility, Base64 is used for data transport, not data protection.",
  },
  {
    question: "What are common pitfalls when decoding Base64?",
    answer:
      "Common issues include whitespace characters that some decoders reject, incorrect padding (missing or extra equal signs), using the wrong alphabet variant (Base64URL vs standard Base64), and character encoding mismatches where the decoded bytes are interpreted with the wrong charset. Always verify the output encoding matches what you expect, especially when dealing with international text or binary files.",
  },
  {
    question: "How do I convert a file to Base64 in the browser?",
    answer:
      "Use the FileReader API with readAsDataURL to convert a file to a Base64 data URI. The result includes the MIME type prefix (e.g., data:image/png;base64,), which you can strip to get the raw Base64 string. For small files under a few megabytes, this works entirely in the browser without uploading anything to a server.",
  },
  {
    question: "What is the difference between Base64 and hexadecimal encoding?",
    answer:
      "Base64 uses 6 bits per character, while hexadecimal uses 4 bits per character. Base64 is more space-efficient (33% overhead) compared to hex (100% overhead). Hex is simpler and more human-readable, making it standard for hash digests, MAC addresses, and color codes. Base64 is preferred when minimizing payload size matters, such as in web APIs and data URIs.",
  },
];

export default function Base64EncoderPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Base64 Encoder Decoder"
            description="Encode any text to Base64 or decode Base64 strings back to readable text instantly. Works for strings, JSON payloads, and data URIs."
            breadcrumbs={breadcrumbs}
          >
            <Base64Encoder />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When and Why Developers Reach for Base64
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Base64 encoding solves a fundamental problem: many transport mechanisms and data formats only support printable ASCII characters. Email (SMTP) was designed for 7-bit ASCII, so MIME uses Base64 to attach images and documents. JSON and XML cannot contain raw binary bytes, so Base64 is the standard way to embed file contents, cryptographic keys, and hashes inside structured data. The web platform itself uses Base64 for data URIs, letting you inline small images and fonts directly in HTML and CSS without additional HTTP requests.
            </p>
            <p>
              In modern development, Base64 is ubiquitous in authentication flows. JWT tokens use Base64URL encoding for their header and payload segments. Basic Authentication headers concatenate username:password and Base64-encode the result (though this is not secure over HTTP). Single-page applications frequently Base64-encode binary blobs for localStorage, IndexedDB, or API payloads. When working with JWT tokens specifically, ToolVerse&apos;s <Link href="/jwt-decoder" className="text-blue-600 hover:underline dark:text-blue-400">JWT Decoder</Link> provides a dedicated interface for inspecting the decoded header, payload, and signature claims beyond what a generic Base64 decoder offers.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            How Base64 Encoding Actually Works
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Base64 works by taking the input binary data as a stream of bytes and processing it in 3-byte (24-bit) chunks. Each chunk is split into four 6-bit values, and each 6-bit value maps to one of 64 printable ASCII characters. If the input length is not a multiple of 3, padding is added: one byte of padding produces two equal signs, and two bytes of padding produce one equal sign. This ensures the output length is always a multiple of 4 characters.
            </p>
            <p>
              The beauty of this scheme is that it makes any binary data safe for text-based protocols. Every character in a Base64 string is a standard ASCII letter, digit, or common symbol that no transport layer will misinterpret. The cost is the 33% size overhead, which is why developers must weigh whether Base64 embedding is appropriate or whether separate binary transfer would be more efficient. For text inputs, the overhead depends on the underlying character encoding: UTF-8 text that is predominantly ASCII may expand less than expected because each ASCII character is already one byte.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Base64 Versus Other Encoding Schemes
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Base64 sits in a spectrum of binary-to-text encodings alongside hexadecimal, Base32, Base85 (also called Ascii85), and Base36. Hexadecimal is the simplest, mapping each byte to two hex characters, but is the least efficient at 100% overhead. Base32 is case-insensitive and omits ambiguous characters like 1 and l, making it suitable for manual entry scenarios like TOTP setup keys. Base85 is more efficient than Base64 with only 25% overhead but is less widely supported. The choice depends on your constraints: efficiency, readability, character set restrictions, and library support across your target platforms.
            </p>
            <p>
              In URLs, standard Base64 conflicts because plus and forward slash have special meanings in URL path and query string syntax. Base64URL solves this by substituting hyphen for plus and underscore for forward slash, and omitting padding characters entirely. When you encode data for URL parameters, always use Base64URL to avoid the need for additional percent-encoding of the Base64 output. You can also use ToolVerse&apos;s <Link href="/url-encoder" className="text-blue-600 hover:underline dark:text-blue-400">URL Encoder</Link> to percent-encode any special characters that remain in your final URL.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Mistakes When Working with Base64
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The most common mistake is treating Base64 as a security measure. Base64 is encoding, not encryption. Anyone with the encoded string can decode it trivially. Another frequent error is charset mismatch: Base64 decodes to bytes, but those bytes must be interpreted with the correct character encoding. Decoding a Base64 string originally encoded from UTF-16 data and interpreting it as UTF-8 produces garbled text. Always keep track of the original text encoding alongside the Base64 data.
            </p>
            <p>
              Developers also forget that not all Base64 strings are valid. Missing or incorrect padding, whitespace characters, line breaks (common in PEM-encoded certificates), and using the wrong alphabet variant all cause decode failures. When decoding user-provided Base64, always wrap the operation in error handling and provide clear feedback. For hashing the decoded data or comparing it against expected values, try the <Link href="/md5-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">MD5 Hash Generator</Link> to produce checksums you can verify against known reference values.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Base64 Encoding" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔗", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
              { icon: "🔤", title: "HTML Entity Encoder", description: "Encode HTML special characters to prevent XSS", href: "/html-entity-encoder" },
              { icon: "🪙", title: "JWT Decoder", description: "Decode and inspect JSON Web Token headers and payloads", href: "/jwt-decoder" },
              { icon: "🔑", title: "SHA Hash Generator", description: "Generate SHA-1, SHA-256, and SHA-512 hash digests", href: "/sha-hash-generator" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="base64-encoder" />
    </>
  );
}
