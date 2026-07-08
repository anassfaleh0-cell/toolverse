import type { Metadata } from "next";
import { ImageConverter } from "@/components/image-suite/image-converter";
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

const slug = "image-converter";
const pageTitle = "Image Converter - Convert Images to JPEG, PNG, WebP Online Free";
const pageDescription =
  "Convert images between JPEG, PNG, WebP, GIF, and BMP formats online. Free, private, and runs entirely in your browser with no server uploads.";

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
  { label: "Image Converter" },
];

const faqItems: FaqItem[] = [
  { question: "What image formats can I convert between?", answer: "You can upload PNG, JPEG, WebP, and GIF images and convert them to PNG, JPEG, WebP, GIF, and BMP output formats. The Canvas API supports reading all common web image formats and encoding to these popular output formats. Each format has specific strengths — PNG for lossless quality with transparency, JPEG for photographs, WebP for modern web optimization, GIF for simple animations, and BMP for uncompressed bitmap data." },
  { question: "Does image conversion reduce quality?", answer: "Conversion between lossless formats (PNG to BMP, PNG to WebP lossless) preserves all original quality. Conversion to lossy JPEG always reduces quality because JPEG discards information. Converting JPEG to PNG preserves the JPEG artifacts permanently. For maximum quality, always convert from the original uncompressed source. When converting to JPEG, the tool uses a 92% quality setting to balance file size and visual fidelity." },
  { question: "What is the best format for web images?", answer: "WebP is the best modern format for web use — it offers 25-35% smaller files than JPEG at equivalent quality, supports transparency (unlike JPEG), and handles both photos and graphics well. For broad compatibility, use JPEG for photographs and PNG for graphics. Serve WebP with JPEG/PNG fallbacks using the picture element for optimal performance across all browsers." },
  { question: "How do I convert a PNG with transparency?", answer: "When converting a PNG with transparency to JPEG, the transparent areas become white (or whatever background color the encoder uses). To preserve transparency, convert to WebP (which supports alpha channels) or stay with PNG. GIF also supports transparency but only as fully transparent or fully opaque — no partial transparency. BMP does not support transparency." },
  { question: "Can I convert animated GIFs?", answer: "The Canvas API can read the first frame of an animated GIF and convert it to a static image in other formats. For animated output, only GIF format preserves the animation frames. Animated WebP is supported by modern browsers but this tool converts single frames. For animated content, use dedicated GIF-to-WebP-Animated tools that handle multi-frame conversion." },
  { question: "Is my image uploaded to any server during conversion?", answer: "No. All image conversion happens entirely in your browser using the Canvas API. Your image data never leaves your device. This makes it safe for converting sensitive images that should not be transmitted over a network." },
];

export default function ImageConverterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <ImageConverter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Choosing the Right Image Format for Your Project</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>The choice of image format depends on your content type, quality requirements, and target platform. JPEG remains the universal standard for photographs with its efficient lossy compression and near-universal browser support. PNG is indispensable when you need lossless quality, sharp text rendering, or transparency — making it the go-to format for logos, icons, screenshots, and UI elements. WebP represents the next generation with superior compression in both lossy and lossless modes, plus transparency support, making it ideal for modern web applications where performance is critical.</p>
            <p>GIF persists for simple animations and low-color graphics despite its 256-color palette limitation, while BMP is rarely used on the web due to its uncompressed nature, though it remains relevant in desktop applications and legacy systems. For development workflows, consider converting source assets to multiple formats automatically. Pair this converter with the <Link href="/image-compressor" className="text-blue-600 hover:underline dark:text-blue-400">Image Compressor</Link> to further optimize your converted images for production deployment.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Format Compatibility and Browser Support</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>JPEG and PNG have 100% browser support across all platforms and versions. WebP is supported in Chrome, Firefox, Edge, and Safari 14+, covering over 96% of global browser usage. GIF and BMP are universally supported but are not recommended for new projects due to file size and quality limitations. When deploying to production, use the picture element with multiple source formats to serve WebP to compatible browsers while falling back to JPEG or PNG for older browsers.</p>
            <p>For progressive enhancement, start with a high-quality PNG source, convert to WebP for modern browsers, and generate JPEG versions as fallbacks. The <Link href="/image-resizer" className="text-blue-600 hover:underline dark:text-blue-400">Image Resizer</Link> can help create appropriately sized versions of each format variant for responsive image sets.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Image Conversion" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📦", title: "Image Compressor", description: "Compress JPEG, PNG, and WebP images to reduce file size", href: "/image-compressor" },
              { icon: "✂️", title: "Crop Image", description: "Crop images to exact dimensions and aspect ratios", href: "/crop-image" },
              { icon: "🏷️", title: "Watermark Image", description: "Add text watermarks to protect your images", href: "/watermark-image" },
              { icon: "🎨", title: "Color Converter", description: "Convert colors between HEX, RGB, and HSL formats", href: "/color-converter" },
            ]}
            title="Related Image Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
