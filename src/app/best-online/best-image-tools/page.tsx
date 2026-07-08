import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Free Image Tools Online — Resize, Compress, Convert | ToolVerse",
  description:
    "Compare the best free online image tools. Resize, compress, and convert images. We review TinyPNG, Compressor.io, Img2Go, ILoveIMG, ImageOptim, and ToolVerse Image Suite.",
  openGraph: {
    title: "Best Free Image Tools Online — Resize, Compress, Convert | ToolVerse",
    description:
      "Compare the best free online image tools. Resize, compress, and convert images. We review TinyPNG, Compressor.io, Img2Go, ILoveIMG, ImageOptim, and ToolVerse Image Suite.",
    url: `${SITE_URL}/best-online/best-image-tools`,
  },
  twitter: {
    title: "Best Free Image Tools Online — Resize, Compress, Convert | ToolVerse",
    description:
      "Compare the best free online image tools. Resize, compress, and convert images.",
  },
  alternates: { canonical: `${SITE_URL}/best-online/best-image-tools` },
};

const title = "Best Free Online Image Tools";
const description =
  "Compare free online image compressors, resizers, and converters. Find the best tool for your image editing needs.";
const canonicalUrl = `${SITE_URL}/best-online/best-image-tools`;
const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Best Online", href: `${SITE_URL}/best-online` },
  { label: "Image Tools" },
];

const matrixHeaders = ["Feature", "TinyPNG", "Compressor.io", "Img2Go", "ILoveIMG", "ImageOptim", "ToolVerse Image Suite"];
const matrixRows = [
  { feature: "Free Tier Available", values: [true, true, true, true, true, true] },
  { feature: "Max File Size (Free)", values: ["5 MB", "10 MB", "10 MB", "10 MB", "3 MB", "15 MB"] },
  { feature: "PNG Compression", values: [true, true, true, true, true, true] },
  { feature: "JPEG Compression", values: [true, true, true, true, true, true] },
  { feature: "WebP Support", values: [true, true, true, true, false, true] },
  { feature: "AVIF Support", values: [false, false, true, false, false, true] },
  { feature: "Image Resize", values: [false, false, true, true, false, true] },
  { feature: "Format Conversion", values: [true, true, true, true, false, true] },
  { feature: "Batch Processing", values: [true, false, true, true, false, true] },
  { feature: "Lossless Option", values: [true, true, false, false, true, true] },
  { feature: "Client-Side Processing", values: [false, false, false, false, false, true] },
  { feature: "Dark Mode", values: [false, false, false, false, false, true] },
];

const faqItems: FaqItem[] = [
  {
    question: "Which image compressor offers the best quality-to-size ratio?",
    answer:
      "TinyPNG is excellent for PNG compression with smart lossy algorithms. For lossless compression, ImageOptim is a top choice. ToolVerse Image Suite (coming soon) will offer both lossy and lossless options with client-side processing.",
  },
  {
    question: "Can I convert images to WebP or AVIF format online for free?",
    answer:
      "Yes. Img2Go and ToolVerse Image Suite support both WebP and AVIF conversion. These modern formats offer significantly better compression than JPEG and PNG while maintaining visual quality.",
  },
  {
    question: "Are there any image tools that work entirely in the browser?",
    answer:
      "Most online image tools upload files to a server for processing. ToolVerse Image Suite (coming soon) will process images entirely on your device using WebAssembly — no uploads needed for privacy-sensitive images.",
  },
];

export default function BestImageToolsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, url: canonicalUrl, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">{title}</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{description}</p>
          <div className="mt-6">
            <SocialShare url={canonicalUrl} title={title} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Image Tool Comparison</h2>
        <ComparisonMatrix headers={matrixHeaders} rows={matrixRows} title="Feature Comparison" />
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Image Tools — Frequently Asked Questions" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Related Tool Comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/best-online/best-pdf-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best PDF Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Merge, split, and compress PDFs online.</p>
          </Link>
          <Link href="/best-online/best-ai-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best AI Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Text, image, and code generation tools.</p>
          </Link>
          <Link href="/best-online/best-marketing-tools" className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Best Marketing Tools</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">SEO, analytics, and content tools.</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Compress an Image Now</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Free, no sign-up. Compress your images in seconds.</p>
          <Link href="/image-compressor" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Try Image Compressor
          </Link>
        </div>
      </section>
    </>
  );
}
