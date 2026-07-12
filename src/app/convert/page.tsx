import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Online File Converters — Free Format Conversion Tools`,
  description: `Free online file converters: convert between PDF, Word, Excel, images, JSON, CSV, XML, and more. No signup, no uploads — all in your browser.`,
  alternates: { canonical: `${SITE_URL}/convert` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Converters" },
];

const FORMAT_GROUPS = [
  {
    name: "Document Formats",
    formats: ["pdf", "word", "excel", "ppt", "txt", "rtf", "html", "markdown"],
  },
  {
    name: "Image Formats",
    formats: ["jpg", "png", "webp", "svg", "gif", "bmp", "tiff", "heic"],
  },
  {
    name: "Data Formats",
    formats: ["json", "csv", "xml", "yaml", "toml"],
  },
  {
    name: "Code Formats",
    formats: ["css", "scss", "less", "js", "ts"],
  },
  {
    name: "Media Formats",
    formats: ["mp3", "mp4", "wav", "flac", "ogg"],
  },
  {
    name: "Encoding Formats",
    formats: ["base64", "hex", "binary"],
  },
];

export default function ConvertPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Online File Converters — Free Format Conversion Tools`, description: `Free online file converters for all formats.`, url: `${SITE_URL}/convert`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">File Converters</h1>
          <p className="mt-4 text-lg text-text-secondary">Convert between any two formats for free. All processing happens in your browser.</p>
        </div>
      </section>
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-8 sm:grid-cols-2">
            {FORMAT_GROUPS.map((group) => (
              <div key={group.name}>
                <h2 className="text-lg font-bold text-text-primary mb-4">{group.name}</h2>
                <div className="space-y-2">
                  {group.formats.map((fmt, i) =>
                    group.formats.filter((_, j) => j !== i).map((other) => (
                      <Link
                        key={`${fmt}-to-${other}`}
                        href={`/convert/${fmt}-to-${other}`}
                        className="block rounded-lg border border-border-subtle bg-surface p-3 text-sm transition-all hover:shadow-sm hover:border-nuvora-300 dark:hover:border-nuvora-700"
                      >
                        <span className="font-medium text-text-primary">{fmt.toUpperCase()}</span>
                        <span className="mx-2 text-text-tertiary">→</span>
                        <span className="font-medium text-text-primary">{other.toUpperCase()}</span>
                      </Link>
                    ))
                  ).slice(0, 12)}
                  <Link href={`/convert/${group.formats[0]}-to-${group.formats[1]}`} className="block text-xs text-nuvora-600 hover:underline dark:text-nuvora-400 mt-1">
                    View all {group.name.toLowerCase()} conversions &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
