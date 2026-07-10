import type { Metadata } from "next";
import { Base64ToImage } from "@/components/image-suite/base64-to-image";
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

const slug = "base64-to-image";
const pageTitle = "Base64 to Image - Decode Base64 to Image Online Free";
const pageDescription =
  "Convert Base64 strings back to images. Paste a Base64 data URI or raw string, preview, and download the decoded image. Auto-detects image format. Free and private.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Image & Design", href: `${SITE_URL}/category/image-design` },
  { label: "Base64 to Image" },
];

const faqItems: FaqItem[] = [
  { question: "How do I convert a Base64 string back to an image?", answer: "Paste the Base64 string into the text area and click &apos;Decode to Image&apos;. The tool automatically detects whether you&apos;ve pasted a full data URI (starting with &apos;data:image/...&apos;) or a raw Base64 string. It identifies the image format from the encoding pattern (PNG, JPEG, GIF, BMP, or WebP) and displays the decoded image preview, which you can then download." },
  { question: "What is the difference between a Base64 data URI and raw Base64?", answer: "A data URI includes the format prefix (e.g., &apos;data:image/png;base64,&apos;) before the actual Base64 data. Raw Base64 contains only the encoded characters without the prefix. The data URI is used directly in HTML img src and CSS url() attributes. The tool accepts both formats and auto-detects the image type for data URIs or infers it from the raw Base64 content pattern." },
  { question: "How does the tool detect the image format?", answer: "The tool examines the first few characters of the Base64 string to identify the format: &apos;iVBOR&apos; indicates PNG, &apos;/9j/&apos; indicates JPEG, &apos;R0lG&apos; indicates GIF, &apos;Qk&apos; indicates BMP, and &apos;UklGR&apos; indicates WebP. For data URIs, the MIME type in the prefix is used directly. Understanding these signatures helps debug when the automatic detection does not match the expected format." },
  { question: "Why does my decoded image look corrupted?", answer: "Corrupted output is usually caused by an invalid Base64 string. Common issues include: missing characters, extra whitespace, incorrect padding (missing &apos;=&apos; characters), or copying the string from a source that truncated it. Ensure you copied the complete string. The tool validates the Base64 data and shows an error message if decoding fails." },
  { question: "What file size can Base64 strings represent?", answer: "Base64 strings can represent images of any size, but very large strings may cause browser memory issues. A Base64 string is approximately 1.37x the size of the original binary file. A 5MB image produces a roughly 6.8MB Base64 string. For large images, consider using traditional file downloads instead of Base64 encoding." },
  { question: "Is my Base64 data uploaded to a server?", answer: "No. All decoding happens entirely in your browser. Your Base64 string never leaves your device, ensuring complete privacy when decoding sensitive data." },
];

export default function Base64ToImagePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <Base64ToImage />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Understanding Base64 Image Representation</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Base64 image encoding is fundamental to modern web development. Every time you see an inline image in an HTML email, a self-contained HTML file, or a data URI in CSS, you&apos;re seeing Base64 at work. The encoding scheme converts binary image data into a safe ASCII representation using 64 characters (A-Z, a-z, 0-9, +, /) plus &apos;=&apos; for padding. This ensures the data can be transmitted in text-based protocols without corruption.</p>
            <p>The reverse operation â€” decoding a Base64 string back to a viewable image â€” is equally important. Developers frequently encounter Base64 strings in API responses, database fields, and configuration files that need to be inspected visually. This tool provides instant decoding and preview, with auto-detection of the image format. For the encoding direction, the <Link href="/image-to-base64" className="text-blue-600 hover:underline dark:text-blue-400">Image to Base64</Link> tool completes the round-trip workflow.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Troubleshooting Common Base64 Decoding Issues</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Base64 decoding errors are common when working with manually copied strings. The most frequent issue is incorrect padding â€” Base64 strings must have a length that is a multiple of 4, achieved by adding &apos;=&apos; or &apos;==&apos; padding at the end. If your string was truncated during copying, the padding will be wrong. Some sources also add line breaks, spaces, or URL encoding that must be removed before decoding. The tool handles these issues where possible and provides clear error messages for debugging.</p>
            <p>Another common issue is format mismatch â€” the decoded binary data may not actually represent a valid image in the detected format. This happens when arbitrary data is Base64-encoded and passed to an image decoder. The tool verifies that the decoded data produces a valid image by loading it into an Image element before displaying the preview. For working with text data encoded as Base64, the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> tool provides text-specific encoding and decoding functionality.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Base64 to Image" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "\uD83D\uDD17", title: "Image to Base64", description: "Convert images to Base64 data URI strings", href: "/image-to-base64" },
              { icon: "\uD83D\uDCCB", title: "Image Metadata Viewer", description: "View EXIF and metadata from encoded images", href: "/image-metadata-viewer" },
              { icon: "\uD83D\uDD04", title: "Image Converter", description: "Convert decoded images to other formats", href: "/image-converter" },
              { icon: "\uD83D\uDD10", title: "Base64 Encoder", description: "Encode and decode text-based Base64 strings", href: "/base64-encoder" },
            ]}
            title="Related Image Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
