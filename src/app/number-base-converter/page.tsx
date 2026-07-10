import type { Metadata } from "next";
import { NumberBaseConverter } from "@/components/number-base-converter/number-base-converter";
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

const slug = "number-base-converter";
const pageTitle = "Number Base Converter - Convert Binary, Octal, Decimal, Hexadecimal Online";
const pageDescription =
  "Convert numbers between binary (base-2), octal (base-8), decimal (base-10), and hexadecimal (base-16) number systems. Free online base converter for developers, students, and network engineers.";

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
  { label: "Number Base Converter" },
];

const faqItems: FaqItem[] = [
  {
    question: "Why do computers use binary (base-2) instead of decimal (base-10)?",
    answer:
      "Computers use binary because it maps directly to the physical reality of digital circuits. A transistor can be in one of two states: conducting (on, representing 1) or non-conducting (off, representing 0). This on/off simplicity makes binary circuits extremely reliable and noise-resistant. Building a circuit that reliably distinguishes ten different voltage levels (as decimal would require) is vastly more complex and error-prone. Every piece of data in a computer — numbers, text, images, audio, video — is ultimately represented as sequences of binary digits. The abstraction layers built on top of binary (assembly, C, JavaScript) shield developers from the underlying bit manipulation, but the foundation remains binary.",
  },
  {
    question: "Why do programmers use hexadecimal instead of binary?",
    answer:
      "Hexadecimal (base-16) is a compact human-readable shorthand for binary values. One hexadecimal digit represents exactly four binary digits (bits), making conversion straightforward. A 32-bit memory address like 11111111111111110000000000000000 (32 characters) becomes 0xFFFF0000 (10 characters) in hex — a 68% reduction. Hexadecimal is used for memory addresses (debuggers, disassemblers), color codes in CSS (#FF5733), MAC addresses (00:1A:2B:3C:4D:5E), and Unicode code points (U+0041 for 'A'). The prefix 0x (or 0X) distinguishes hex from decimal in most programming languages. Each hex digit maps cleanly to a nibble (4 bits), making manual bit manipulation intuitive for experienced developers.",
  },
  {
    question: "What is octal used for in modern computing?",
    answer:
      "Octal (base-8) was historically popular in early computing systems like PDP-8 and UNIVAC, but its primary modern use is Unix file permissions. The chmod command uses 3-4 octal digits to represent permission bits: read (4), write (2), and execute (1) for owner, group, and others. chmod 755 gives the owner rwx (7 = 4+2+1) and group/others r-x (5 = 4+1). Each octal digit maps to exactly three binary bits, making it intuitive for representing three-bit permission groups. Octal is also used in some character encoding contexts, IPv6 address abbreviation (though hex is standard), and file mode constants in Unix system programming. Node.js fs.constants and Python's stat module both reference octal permission values.",
  },
  {
    question: "How do you convert decimal to binary manually?",
    answer:
      "To convert decimal to binary, repeatedly divide the number by 2 and record the remainders in reverse order. For example, converting 42 to binary: 42 ÷ 2 = 21 remainder 0; 21 ÷ 2 = 10 remainder 1; 10 ÷ 2 = 5 remainder 0; 5 ÷ 2 = 2 remainder 1; 2 ÷ 2 = 1 remainder 0; 1 ÷ 2 = 0 remainder 1. Reading remainders bottom-up: 101010. Verification: 1×32 + 0×16 + 1×8 + 0×4 + 1×2 + 0×1 = 32 + 8 + 2 = 42. For fractional parts, multiply the fractional part by 2 repeatedly, recording the integer parts in order. The same algorithm works for any base by dividing (or multiplying) by the target base instead of 2.",
  },
  {
    question: "How does base conversion work for fractional numbers?",
    answer:
      "Fractional numbers have both an integer part and a fractional part, and each is converted separately. The integer part uses the division method described above. The fractional part uses multiplication: repeatedly multiply the fractional part by the target base, recording the integer part of each result as the next digit, then continue with the new fractional part. For example, converting 0.375 to binary: 0.375 × 2 = 0.75 → integer 0; 0.75 × 2 = 1.5 → integer 1; 0.5 × 2 = 1.0 → integer 1. Result: 0.011 (0×1/2 + 1×1/4 + 1×1/8 = 0.375). Some decimal fractions (like 0.1) produce repeating binary fractions, which is why floating-point arithmetic has precision issues in all programming languages.",
  },
  {
    question: "What is the relationship between base-16 (hex) and base-2 (binary)?",
    answer:
      "The relationship is direct: one hexadecimal digit equals exactly four binary digits (a nibble). This makes conversion between hex and binary trivial without arithmetic. To convert binary to hex, group binary digits into groups of four starting from the rightmost (least significant) bit, then map each group to its hex equivalent: 0000=0, 0001=1, ..., 1001=9, 1010=A, 1011=B, 1100=C, 1101=D, 1110=E, 1111=F. Example: binary 110100101111 → group as 1101 0010 1111 → D 2 F → hex 0xD2F. This direct mapping is why hex is universally preferred over decimal for representing binary data: it is compact yet preserves the bit structure exactly.",
  },
  {
    question: "What are common base prefixes in programming languages?",
    answer:
      "Binary: 0b prefix (0b1010 = 10 in decimal) in Python, Ruby, Java, C#, Rust, and newer JavaScript (ES6+). Octal: 0o prefix (0o12 = 10) in Python 3, Ruby, JavaScript (ES6+); historically, a leading zero (012) in C, Java, and older JavaScript — this is a common source of bugs. Hexadecimal: 0x prefix (0xA = 10) universally in C, C++, Java, JavaScript, Python, Rust, Go, and virtually all other languages. In CSS, hex colors use # prefix (#FF0000). In URLs, percent-encoding uses % followed by two hex digits (%20 for space). The use of consistent prefixes prevents ambiguity and makes base-annotated numbers readable across different codebases.",
  },
  {
    question: "Why is hexadecimal used for memory addresses and debugging?",
    answer:
      "Memory addresses in modern 64-bit systems are typically displayed as 12-16 hex digits. Hex is used because: each pair of hex digits represents one byte (0x00-0xFF), making memory dumps easy to read; hex addresses are 50% shorter than the equivalent binary representation; and alignment to byte boundaries is visually obvious (addresses ending in 0, 4, 8, or C are quadword-aligned). Debuggers, disassemblers, and hex editors use hexadecimal exclusively for memory views. Stack traces display return addresses in hex, and performance profilers report instruction pointer offsets in hex. The format is so ingrained that developers instantly recognize hex addresses as memory locations.",
  },
  {
    question: "How does base conversion apply to IPv4 and IPv6 addressing?",
    answer:
      "IPv4 addresses are typically shown in dotted decimal notation (192.168.1.1), where each octet (8 bits) is a decimal number 0-255. Converting between decimal and binary is essential for understanding subnet masks and network prefixes: a /24 subnet mask (255.255.255.0) has 24 leading binary 1s and 8 trailing 0s. IPv6 addresses use hexadecimal with colon separators (2001:0db8:85a3:0000:0000:8a2e:0370:7334). Each group is 16 bits (4 hex digits). IPv6 abbreviation rules allow omitting leading zeros and compressing consecutive zero groups with ::. Network engineers regularly convert between hex, binary, and decimal when configuring subnets, routing tables, and firewall rules.",
  },
  {
    question: "What is two's complement and how does it relate to base conversion?",
    answer:
      "Two's complement is the standard way computers represent signed integers. In N-bit two's complement, the most significant bit has a negative weight (-2^(N-1)) instead of positive weight. For example, in 8-bit two's complement, 11111111 = -1 (because the MSB contributes -128, and the remaining bits sum to 127). Converting a negative decimal number to two's complement binary: take the absolute value, convert to binary, invert all bits, and add 1. This representation is used because addition and subtraction work the same regardless of sign — the same hardware circuit handles both signed and unsigned operations. Understanding two's complement is essential when working with low-level data, bit flags, and serial protocols.",
  },
  {
    question: "How does base-64 encoding relate to number base conversion?",
    answer:
      `Base64 encoding is conceptually similar to number base conversion but operates on binary data rather than integer values. Where hexadecimal represents 4 bits per character and octal represents 3 bits per character, Base64 represents 6 bits per character using a 64-character alphabet (A-Z, a-z, 0-9, +, /). This 6-bit grouping is why Base64 reduces size less than hex (33% vs 100% overhead). The conversion treats the input as a stream of bytes (not a single large integer) and processes 3 bytes (24 bits) at a time, producing 4 Base64 characters. This is fundamentally different from binary/hex/decimal conversion which treats the input as a single numeric value. For Base64 encoding needs, Nuvora's <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> handles the binary-to-text encoding directly.`,
  },
  {
    question: "What are common mistakes when converting between number bases?",
    answer:
      `The most common mistake is misinterpreting leading zeros. In decimal, 0010 is just 10. In binary, 0010 is 2 (but 0100 is 4). Another frequent error is confusion between the octal prefix 0o and decimal: const x = 012 is 10 (octal) in older JavaScript but 12 in strict mode. Using parseInt() without specifying the radix (the second argument) defaults to octal inference for leading-zero strings in older environments. For hex conversion, forgetting the 0x prefix or using incorrect hex digits (G through Z) causes parse errors. When working with color values that need hex conversion alongside other number formats, the <Link href="/color-converter" className="text-blue-600 hover:underline dark:text-blue-400">Color Converter</Link> provides dedicated HEX/RGB/HSL conversion for the specific case of color representation.`,
  },
];

export default function NumberBaseConverterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Number Base Converter"
            description="Convert numbers between binary, octal, decimal, and hexadecimal instantly. Understand how data is represented at different levels of your system."
            breadcrumbs={breadcrumbs}
          >
            <NumberBaseConverter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Every Developer Needs to Understand Number Base Conversion
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Number base conversion is not just an academic exercise — it is a practical skill that surfaces constantly in software development. When you debug a network protocol using Wireshark, the packet bytes are displayed in hexadecimal. When you configure Unix file permissions with chmod 755, you are working in octal. When you set a CSS color to #FF5733, you are specifying RGB values in hexadecimal. When you analyze a binary file format or a serialized data stream, you need to interpret groups of bits as values. Every abstraction layer in computing ultimately rests on binary, and the ability to translate between representations is essential for understanding what your code is actually doing.
            </p>
            <p>
              The practical applications span every domain of development. Frontend developers convert between decimal RGB (rgb(255, 87, 51)) and hex (#FF5733) daily. Backend developers parse hex-encoded hash digests and UUIDs. Systems programmers work directly with binary and hex for memory-mapped I/O, register configurations, and protocol implementations. Security engineers analyze hex dumps of network traffic and binary exploits. Data scientists converting between number formats for feature engineering. Even when higher-level abstractions shield you from raw bytes, understanding the underlying representation helps you diagnose performance issues, overflow bugs, and encoding problems that can only be understood at the bit level. The <Link href="/color-converter" className="text-blue-600 hover:underline dark:text-blue-400">Color Converter</Link> provides a specialized interface for the common frontend use case of color format conversion across HEX, RGB, and HSL representations.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Binary, Hex, and the Memory Model
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Understanding number base conversion is essential for reasoning about how data is laid out in memory. A 32-bit integer occupies 4 bytes (8 hex digits) in memory. A 64-bit integer occupies 8 bytes (16 hex digits). When you declare `let x = 0xFF00FF00` in JavaScript, the engine stores that as a 32-bit signed integer internally if possible, or as a 64-bit floating point otherwise. The hex representation makes it obvious that the high 16 bits are 0xFF00 and the low 16 bits are 0xFF00. In binary, this same value is 11111111000000001111111100000000 — far less readable. Hex provides the optimal balance between compactness and bit-level transparency.
            </p>
            <p>
              Endianness (byte order) is a critical concept that emerges from the memory model. Little-endian systems (x86, most ARM) store the least significant byte first in memory, while big-endian systems (network protocols, some embedded architectures) store the most significant byte first. When you see a hex dump of a 4-byte integer 0x12345678 from a little-endian system, the bytes appear in memory as 78 56 34 12. Network protocols universally use big-endian (network byte order). This mismatch is why you must use htonl (host-to-network long) and ntohl functions when sending binary data over a network. The <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> is useful when working with hex strings that need consistent casing across different endianness representations and tool outputs.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Bitwise Operations and Base Conversion in Practice
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
               Bitwise operators (&, |, ^, ~, {'<<'}, {'>>'}, {'>>>'}) operate directly on the binary representation of numbers. These operations are essential for working with permission systems, feature flags, network protocols, and graphics programming. For example, extracting the red component from a 32-bit ARGB color (0xFF573322) uses: (color {'>>'} 16) & 0xFF = 0x57 = 87. Setting a specific bit: flags |= (1 {'<<'} bitPosition). Checking a bit: (flags & (1 {'<<'} bitPosition)) !== 0. Performing these operations requires understanding the binary layout, and converting between hex and binary helps verify your bit manipulation logic. Without base conversion skills, debugging bitwise operations is nearly impossible.
            </p>
            <p>
              Feature flags are commonly implemented as bit fields, where each bit represents one feature&apos;s enabled/disabled state. A 32-bit integer can store 32 independent feature flags, making it far more efficient than 32 separate boolean variables. Network protocol headers use bit fields extensively: the TCP header contains 9 control bits (URG, ACK, PSH, RST, SYN, FIN, etc.) packed into a 16-bit field. Graphics programming packs color channels (RGBA) into 32-bit integers for efficient pixel manipulation. Understanding the base conversions and bit positions involved is fundamental to working at these abstraction levels. When you need to encode the resulting data for API transport or storage, the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> provides the bridge between binary representations and text-safe formats.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Base Conversion in Networking and Data Serialization
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Network protocols are defined in terms of binary fields at specific bit offsets. The IPv4 header, for example, has a 4-bit version field, a 4-bit IHL field, an 8-bit DSCP/ECN field, a 16-bit total length, a 16-bit identification, a 3-bit flags field, a 13-bit fragment offset, and so on. Debugging network issues requires translating hex dumps into these structured fields. Wireshark automates this parsing, but understanding the underlying binary layout helps you interpret unusual headers, craft custom packets, and troubleshoot protocol-level issues. The base conversion between the hex dump and the binary field values is the core skill here.
            </p>
            <p>
              Data serialization formats also rely heavily on number base concepts. Protocol Buffers use varint encoding that represents small integers in fewer bytes by using a variable-length binary format. MessagePack differentiates between positive fixint (0xxxxxxx), negative fixint (111xxxxx), and other type markers based on the high bits of the first byte. CBOR and BSON similarly pack type information and length into the high bits of the initial bytes. When debugging serialization issues, reading hex dumps of serialized data and understanding the base-2 bit patterns is essential. The <Link href="/regex-tester" className="text-blue-600 hover:underline dark:text-blue-400">Regex Tester</Link> is invaluable for crafting patterns that match hex-encoded serialized data during forensic analysis or log parsing tasks.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Number Base Conversion" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🎨", title: "Color Converter", description: "Convert colors between HEX, RGB, and HSL formats", href: "/color-converter" },
              { icon: "🔡", title: "Case Converter", description: "Convert text between camelCase, snake_case, and more", href: "/case-converter" },
              { icon: "🔲", title: "UUID Generator", description: "Generate UUID v4 identifiers for database keys and IDs", href: "/uuid-generator" },
              { icon: "🔍", title: "Regex Tester", description: "Test regular expressions with live matching and capture groups", href: "/regex-tester" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="number-base-converter" />
    </>
  );
}
