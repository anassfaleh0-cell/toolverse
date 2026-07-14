import type { Metadata } from "next";
import { ImageCompressor } from "@/components/image-suite/image-compressor";
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

const slug = "image-compressor";
const pageTitle = "Image Compressor - Compress JPEG, PNG, WebP Online Free";
const pageDescription =
  "Compress images online without losing quality. Reduce JPEG, PNG, and WebP file sizes. Free, private, and runs in your browser — no uploads to any server.";

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
  { label: "Image Compressor" },
];

const faqItems: FaqItem[] = [
  { question: "How does image compression work?", answer: "Image compression reduces file size by removing redundant or less important data from the image. Lossless compression (PNG) preserves all original data, while lossy compression (JPEG) discards details the human eye is less likely to notice. WebP supports both lossy and lossless modes. The Canvas API used by this tool applies the browser's native encoding algorithms, providing a balance between file size and visual quality based on the quality slider you select." },
  { question: "How much can I compress an image?", answer: "Typical compression savings range from 30% to 80% depending on the image content and quality setting. Photos with smooth gradients compress well at 50-70% quality. Screenshots and graphics with sharp text benefit from higher quality settings (80-95%) to avoid visible artifacts. The tool shows you the exact file size reduction in real time so you can find the optimal balance." },
  { question: "Does image compression reduce quality?", answer: "Lossy compression (JPEG and WebP at lower quality settings) reduces quality by discarding image data. The effect is visible as compression artifacts — typically blocking or ringing around sharp edges. At quality settings above 80%, these artifacts are usually imperceptible. PNG uses lossless compression and maintains 100% quality but produces larger files. The quality slider lets you control this trade-off visually." },
  { question: "Is my image uploaded to any server?", answer: "No. All image compression happens entirely in your browser using the Canvas API. Your image never leaves your device. This makes the tool completely private and secure, suitable for compressing sensitive or confidential images that should not be transmitted over the internet." },
  { question: "What is the best format for compressed images?", answer: "JPEG is best for photographs and complex images with smooth color transitions. PNG is best for graphics with text, logos, screenshots, and images requiring transparency. WebP offers the best of both worlds — 25-35% smaller files than JPEG at equivalent quality with transparency support — but is not supported by all older browsers. For web use, WebP with a JPEG fallback is the modern standard." },
  { question: "How do I choose the right quality setting?", answer: "Start at 70% quality and adjust based on the result. For web use, 60-80% is typically sufficient for photos. For printing or archiving, use 90-95%. For PNG, quality settings apply to color reduction rather than compression. The real-time preview lets you compare original and compressed versions to find the acceptable threshold for your use case." },
];

export default function ImageCompressorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} introText="Reduce image file sizes without sacrificing quality. Compress JPEG, PNG, and WebP images for faster website loading, email attachments, and social media uploads." breadcrumbs={breadcrumbs}>
            <ImageCompressor />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Why Image Compression Matters for Web Performance</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Images account for over 50% of the average web page weight. Uncompressed images directly impact Core Web Vitals — specifically Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS). Compressing images before uploading them to your website is the single most impactful performance optimization you can make, often reducing page weight by 60-80% without noticeable quality loss. Faster pages improve user engagement, conversion rates, and search engine rankings.</p>
            <p>The browser-native Canvas API provides hardware-accelerated image encoding that matches the quality of server-side libraries like Sharp or ImageMagick. By processing everything client-side, you eliminate server costs and upload delays. For responsive images, pair compression with the <Link href="/image-resizer" className="text-blue-600 hover:underline dark:text-blue-400">Image Resizer</Link> to serve appropriately sized and compressed images for each viewport. For further file size reduction, consider converting to WebP format which offers superior compression ratios.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Lossy vs Lossless Compression Explained</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Lossless compression (used by PNG and WebP lossless mode) reduces file size by finding and eliminating redundant data patterns without changing any pixel values. When you decompress a losslessly compressed image, you get exactly the same pixels as the original. This is essential for medical imaging, technical diagrams, and any scenario where pixel-perfect accuracy is required. The trade-off is much larger file sizes compared to lossy compression.</p>
            <p>Lossy compression (used by JPEG and WebP lossy mode) achieves dramatically smaller file sizes by discarding information that the human visual system is less sensitive to — high-frequency color detail, subtle luminance variations, and fine textures. At quality settings above 80%, most viewers cannot distinguish the compressed version from the original. Modern encoders like MozJPEG and the WebP encoder in browsers use advanced perceptual metrics to allocate bits where they matter most, preserving sharp edges and smooth gradients while aggressively compressing less noticeable areas.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Real-Time Quality Feedback for Optimal Compression</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>The quality slider provides instant visual feedback on how different compression levels affect your image. Moving from 90% to 60% quality typically halves the file size while introducing subtle artifacts that may only be visible when zoomed in. For social media images viewed on mobile devices, 60-70% quality is often indistinguishable from the original. For hero images and product photos where quality is paramount, 80-85% provides near-lossless quality at half the file size.</p>
            <p>The tool also shows the exact file size and percentage reduction, helping you make data-driven decisions. For batch optimization workflows, the <Link href="/image-converter" className="text-blue-600 hover:underline dark:text-blue-400">Image Converter</Link> can transform images between formats, allowing you to choose the most efficient format for each image after compression testing.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Image Compression" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Ruler", title: "Image Resizer", description: "Resize images to exact dimensions for web and social media", href: "/image-resizer" },
              { icon: "RefreshCw", title: "Image Converter", description: "Convert between JPEG, PNG, WebP, GIF, and BMP formats", href: "/image-converter" },
              { icon: "Scissors", title: "Crop Image", description: "Crop images with preset aspect ratios or freeform selection", href: "/crop-image" },
              { icon: "Palette", title: "Color Converter", description: "Convert colors between HEX, RGB, and HSL formats", href: "/color-converter" },
            ]}
            title="Related Image Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
