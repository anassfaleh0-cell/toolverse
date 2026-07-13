import type { Metadata } from "next";
import { TimestampConverter } from "@/components/timestamp-converter/timestamp-converter";
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

const slug = "timestamp-converter";
const pageTitle = "Timestamp Converter - Convert Unix Timestamps to Dates Online";
const pageDescription =
  "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds precision with UTC and local time display.";

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
  { label: "Data & Analytics", href: `${SITE_URL}/category/data-analytics` },
  { label: "Timestamp Converter" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is a Unix timestamp and how does it work?",
    answer:
      "A Unix timestamp represents the number of seconds (or milliseconds) that have elapsed since January 1, 1970 at 00:00:00 UTC, also known as the Unix epoch. It is a timezone-independent way to represent moments in time, making it ideal for logging, databases, and API communication. The timestamp increases by one every second, so two timestamps can be subtracted to calculate the exact duration between two events.",
  },
  {
    question: "How do I know if a timestamp is in seconds or milliseconds?",
    answer:
      "Nuvora automatically detects whether your timestamp is in seconds or milliseconds. As a rule of thumb: if the number has 10 digits (e.g. 1719878400), it is in seconds. If it has 13 digits (e.g. 1719878400000), it is in milliseconds. The converter checks the resulting date to determine the correct precision and adjusts accordingly. Most Unix systems and APIs use seconds, while JavaScript&apos;s Date.now() returns milliseconds.",
  },
  {
    question: "What is the range of valid Unix timestamps?",
    answer:
      "The range depends on the platform. On 32-bit systems, timestamps range from December 13, 1901 to January 19, 2038 (the Year 2038 problem). On 64-bit systems, the range is effectively unlimited, covering billions of years. Nuvora uses JavaScript&apos;s Date object which supports timestamps from approximately -271,821 to 275,760 years relative to the epoch, covering all practical use cases for modern applications.",
  },
  {
    question: "Why do I get different dates for the same timestamp in different timezones?",
    answer:
      "A Unix timestamp represents the same moment in time everywhere on Earth. The UTC time is always the same for a given timestamp. Local time varies by timezone offset. When you see different dates for the same timestamp, it is because the local timezone conversion produces different calendar dates on either side of midnight UTC. This is expected behavior and is why UTC is preferred for logs and database storage.",
  },
  {
    question: "What is the Year 2038 problem?",
    answer:
      "The Year 2038 problem affects 32-bit systems that store timestamps as signed 32-bit integers. On January 19, 2038 at 03:14:07 UTC, the counter will overflow from 2,147,483,647 to -2,147,483,648, causing systems to interpret the date as December 13, 1901 instead of 2038. Most modern systems use 64-bit integers or alternative representations, but legacy embedded systems, old databases, and some file systems may still be affected.",
  },
  {
    question: "How do I get the current Unix timestamp in different programming languages?",
    answer:
      "In JavaScript, use Math.floor(Date.now() / 1000) for seconds or Date.now() for milliseconds. In Python, use int(time.time()). In PHP, use time(). In Go, use time.Now().Unix(). In Rust, use std::time::SystemTime::now().duration_since(UNIX_EPOCH). Most languages have built-in functions for getting the current timestamp, and the Nuvora converter lets you verify your results.",
  },
  {
    question: "What is the difference between ISO 8601 and Unix timestamps?",
    answer:
      "ISO 8601 is a human-readable date format (e.g. 2026-07-01T12:00:00Z) that includes timezone information and is easy to read and parse. Unix timestamps are numeric and timezone-independent, making them ideal for machine-to-machine communication and arithmetic operations. ISO 8601 is better for log files and user interfaces, while timestamps are better for storage, comparison, and duration calculations.",
  },
  {
    question: "Can I use negative Unix timestamps?",
    answer:
      "Yes. Negative timestamps represent dates before January 1, 1970. For example, timestamp 0 is January 1, 1970, and timestamp -86400 is December 31, 1969. JavaScript&apos;s Date object supports negative timestamps, so Nuvora can convert dates from the early 20th century and earlier. Negative timestamps are commonly used in historical data analysis and legacy system migrations.",
  },
  {
    question: "Why do some APIs return timestamps with decimals?",
    answer:
      "Decimal timestamps include fractional seconds for sub-second precision. For example, 1719878400.500 represents 500 milliseconds past the second. These are commonly used in high-frequency trading, telemetry data, and scientific applications where millisecond or microsecond precision is required. Nuvora converts the integer part as the timestamp and the decimal portion represents the fractional second.",
  },
  {
    question: "What happens to timestamps during leap seconds?",
    answer:
      "The Unix time system ignores leap seconds. Each day is treated as exactly 86,400 seconds, even when a leap second is added. This means Unix timestamps are not perfectly continuous during leap seconds, but the discrepancy is negligible for most applications. The International Earth Rotation Service adds leap seconds periodically to keep atomic time synchronized with astronomical time.",
  },
];

export default function TimestampConverterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Timestamp Converter"
            description="Convert between Unix timestamps and human-readable dates. Automatically detects seconds vs milliseconds and shows both UTC and local time."
            breadcrumbs={breadcrumbs}
          >
            <TimestampConverter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Unix Timestamps Are the Universal Time Standard for Developers
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Unix timestamps solve a fundamental problem in software development: how to represent a moment in time without ambiguity. Unlike date strings that depend on locale, timezone, and format, a Unix timestamp is a single integer that represents the exact same instant everywhere on Earth. This makes timestamps the ideal format for logging events in distributed systems, storing creation and modification dates in databases, and communicating timestamps between microservices running in different timezones.
            </p>
            <p>
              The simplicity of timestamps enables powerful operations. You can sort events by subtracting timestamps to calculate durations, filter records by date ranges with simple integer comparisons, and partition data by time windows using division. When debugging timezone-related bugs or verifying that your API responses contain correct dates, a timestamp converter is invaluable. For logs that use structured data formats, the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> helps you pretty-print timestamp-containing payloads for easier inspection.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Pitfalls When Working with Timestamps
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The most common mistake is confusing seconds and milliseconds. JavaScript&apos;s Date.now() returns milliseconds, while most backend APIs and databases (including MySQL&apos;s UNIX_TIMESTAMP and PostgreSQL&apos;s EXTRACT(EPOCH)) return seconds. Multiplying or dividing by 1000 in the wrong direction yields dates that are off by decades. Nuvora handles this automatically by detecting the precision of your input, but it is important to know which unit your data source uses.
            </p>
            <p>
              Another frequent issue is timezone confusion during timestamp-to-date conversion. A timestamp represents a fixed point in time, but displaying it as a date requires choosing a timezone. UTC is the standard for internal systems, but users expect to see dates in their local timezone. Always store timestamps in UTC and convert to local time only for display. When analyzing data patterns across different systems, the <Link href="/number-base-converter" className="text-blue-600 hover:underline dark:text-blue-400">Number Base Converter</Link> helps you work with timestamps in hex or binary representations for low-level debugging.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Timestamps in Databases: Best Practices
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              When storing timestamps in databases, use the native timestamp type for your database engine rather than storing raw Unix integers. PostgreSQL&apos;s TIMESTAMPTZ, MySQL&apos;s DATETIME, and SQLite&apos;s TEXT date types all store timestamps with timezone awareness and support native date functions. However, when communicating between systems or caching timestamp values, the Unix integer format is safer because it avoids timezone parsing issues.
            </p>
            <p>
              For database sharding and partition pruning, Unix timestamps stored as integers enable efficient range queries. Time-based partitioning using timestamp columns is one of the most effective database optimization strategies. When importing or exporting data between systems, a timestamp converter helps you verify that dates are correctly transformed. The <Link href="/uuid-generator" className="text-blue-600 hover:underline dark:text-blue-400">UUID Generator</Link> combined with timestamps creates time-ordered unique identifiers that improve database index performance while preserving chronological ordering.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Timestamps" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Hash", title: "Number Base Converter", description: "Convert numbers between binary, octal, decimal, and hexadecimal", href: "/number-base-converter" },
              { icon: "Palette", title: "Color Converter", description: "Convert colors between HEX, RGB, HSL, and other formats", href: "/color-converter" },
              { icon: "FileText", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
              { icon: "Circle", title: "UUID Generator", description: "Generate random UUID v4 identifiers for distributed systems", href: "/uuid-generator" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="timestamp-converter" />
    </>
  );
}
