import type { Metadata } from "next";
import { WatermarkImage } from "@/components/image-suite/watermark-image";
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

const slug = "watermark-image";
const pageTitle = "Watermark Image - Add Text Watermark to Images Online Free";
const pageDescription =
  "Add text watermarks to images online. Customize position, opacity, size, color, and font. Protect your photos with copyright watermarks. Free and private â€” all in your browser.";

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
  { label: "Watermark Image" },
];

const faqItems: FaqItem[] = [
  { question: "What is the best position for a watermark?", answer: "The bottom-right corner is the most common position because it is less likely to interfere with the main subject while remaining visible. Center watermarks are more protective but more intrusive. The optimal position depends on your image content â€” place the watermark over an area with uniform texture so it is difficult to clone out. For maximum protection, consider using multiple watermarks or a repeating pattern across the image." },
  { question: "What opacity should I use for watermarks?", answer: "30-50% opacity is the standard range for visible watermarks â€” enough to assert copyright without obscuring the image. Lower opacity (10-20%) is suitable for subtle branding on portfolio images. Higher opacity (60-80%) is used for proof images and previews where the primary purpose is to deter unauthorized use. The right balance depends on whether you prioritize image aesthetics or copyright protection." },
  { question: "Can watermarks be removed from images?", answer: "Simple watermarks can be removed using image editing tools like Photoshop&apos;s content-aware fill, clone stamp, or generative AI fill tools. To make removal more difficult: place the watermark over detailed areas of the image, use multiple watermarks, add a semi-transparent pattern overlay, and ensure the watermark text extends across diverse image content. No watermark is completely removal-proof, but a well-placed watermark significantly increases the effort required to remove it." },
  { question: "What text should I use for a watermark?", answer: "Common watermark text includes your name, brand name, copyright symbol with year (Â© 2026 Your Name), website URL, or a combination. Short text is more readable at smaller sizes. Adding your website URL serves the dual purpose of branding and driving traffic if the image is shared. For proof images sent to clients, use &apos;PROOF&apos; or &apos;DRAFT&apos; overlaid prominently across the image." },
  { question: "Does watermarking affect image quality?", answer: "The watermarked image is exported as PNG, which uses lossless compression â€” the watermarking process itself does not degrade image quality. However, the watermark text is rendered as pixels in the final image, so always keep your original unwatermarked files. For web delivery, you can optimize the watermarked PNG using the Image Compressor to reduce file size while preserving the watermark." },
  { question: "Is my image uploaded to a server?", answer: "No. All watermark processing happens entirely in your browser using the Canvas API. Your original image and the watermarked result never leave your device, ensuring complete privacy for your creative work." },
];

export default function WatermarkImagePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <WatermarkImage />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Protecting Your Creative Work with Watermarks</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Watermarking is an essential practice for photographers, designers, and content creators who share their work online. A visible watermark serves as a deterrent against unauthorized use, establishes ownership, and provides brand exposure when images are shared across social media and third-party platforms. While no watermark is completely foolproof, the combination of visible marking and proper copyright registration provides legal recourse in cases of infringement.</p>
            <p>The key to effective watermarking is balancing visibility with aesthetics. A watermark that is too prominent detracts from your image and may reduce its shareability. One that is too subtle can be easily cropped out or removed. Start with 40% opacity in the bottom-right corner, then adjust based on how the watermark interacts with your specific image content. For comprehensive image protection, the <Link href="/image-metadata-viewer" className="text-blue-600 hover:underline dark:text-blue-400">Image Metadata Viewer</Link> can help you verify that your copyright and attribution metadata is properly embedded in your exported files.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Watermark Best Practices for Different Platforms</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Different platforms require different watermarking strategies. For portfolio websites and photography blogs, a subtle bottom-right watermark with your name or logo at 30% opacity maintains professionalism without distracting viewers. For social media platforms where images are frequently shared without attribution, a more prominent watermark across the center or a diagonal repeating pattern provides better protection. For client proofs and previews, use a large semi-transparent &apos;PROOF&apos; overlay that makes the image unsuitable for final use.</p>
            <p>Consider the dimensions where your image will be displayed. A watermark that is perfectly sized for a full-resolution image may become illegible when the image is displayed as a thumbnail. Test your watermark at various display sizes to ensure it remains effective. For optimal web delivery of your watermarked images, the <Link href="/image-compressor" className="text-blue-600 hover:underline dark:text-blue-400">Image Compressor</Link> can reduce file sizes while maintaining watermark visibility.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Watermarking" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Package", title: "Image Compressor", description: "Compress watermarked images for web delivery", href: "/image-compressor" },
              { icon: "RefreshCw", title: "Image Converter", description: "Convert watermarked images to different formats", href: "/image-converter" },
              { icon: "FileText", title: "Image Metadata Viewer", description: "View EXIF and metadata of your images", href: "/image-metadata-viewer" },
              { icon: "Circle", title: "Image Grayscale", description: "Convert images to grayscale or sepia effects", href: "/image-grayscale" },
            ]}
            title="Related Image Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
