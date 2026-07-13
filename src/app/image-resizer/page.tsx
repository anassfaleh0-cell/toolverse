import type { Metadata } from "next";
import { ImageResizer } from "@/components/image-resizer/image-resizer";
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

const slug = "image-resizer";
const pageTitle = "Image Resizer - Resize Images Online Free";
const pageDescription =
  "Resize images online instantly. Upload an image, set custom dimensions in pixels, maintain aspect ratio, preview before downloading. Supports PNG, JPEG, and WebP.";

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
  { label: "Image & Design", href: `${SITE_URL}/category/image-design` },
  { label: "Image Resizer" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the image resizer work?",
    answer:
      "The Image Resizer uses the HTML Canvas API to resize images entirely in your browser. You upload an image, specify the target width and height in pixels, and the tool redraws the image at the new dimensions using high-quality image smoothing. The resized image can be previewed before downloading. No image data is ever uploaded to a server — everything stays on your device.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "You can upload PNG, JPEG, WebP, and GIF images. For output, you can choose between PNG (lossless, good for graphics and screenshots), JPEG (lossy compression, best for photographs), and WebP (modern format with better compression than JPEG). The download format selector appears after you upload an image.",
  },
  {
    question: "Does the tool maintain aspect ratio?",
    answer:
      "Yes. The Maintain Aspect Ratio toggle is enabled by default. When active, changing the width automatically adjusts the height to keep the original image proportions, and vice versa. This prevents distorted or stretched images. You can disable this if you need exact dimensions regardless of the original aspect ratio.",
  },
  {
    question: "What is the maximum image size I can resize?",
    answer:
      "The tool can handle images of any size your browser can load. However, very large images (over 50 megapixels) may cause memory issues or slow performance because all processing happens client-side. For most use cases like social media images, product photos, and website assets, the tool performs quickly and efficiently.",
  },
  {
    question: "Is my image uploaded to a server?",
    answer:
      "No. The image resizer processes everything client-side using your browser's Canvas API. Your image never leaves your device. This makes the tool completely private and secure, suitable for resizing sensitive images that should not be transmitted over the internet.",
  },
  {
    question: "Can I resize multiple images at once?",
    answer:
      "The current tool processes one image at a time. For batch resizing multiple images with the same dimensions, you would need to process each image separately. The tool is designed for quick, single-image resizing tasks where uploading to a server would be unnecessarily time-consuming.",
  },
  {
    question: "What is the quality of the resized image?",
    answer:
      "The Canvas API uses bicubic interpolation with high-quality image smoothing enabled, producing sharp and clean resized images. JPEG and WebP formats use a 92% quality setting by default, balancing file size and visual quality. For pixel art or graphics that require crisp edges, PNG format is recommended to avoid compression artifacts.",
  },
  {
    question: "How can I use resized images in web development?",
    answer:
      "Resized images are essential for responsive web design. You can create multiple size variants of the same image for different viewports using the srcset attribute. Smaller images reduce page load times, improve Core Web Vitals scores, and save bandwidth for mobile users. For further optimization, consider converting images to modern formats like WebP for even better compression.",
  },
];

export default function ImageResizerPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Image Resizer"
            description="Upload an image, set your desired width and height, and download the resized version. All processing happens locally in your browser — nothing is uploaded to any server."
            breadcrumbs={breadcrumbs}
          >
            <ImageResizer />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Image Resizing Matters for Web Performance
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Images are the single largest contributor to web page weight, accounting for over 50% of the average page size. Uploading a 4000×3000 pixel photo straight from a modern smartphone and serving it at full resolution is wasteful when the content area on your website is only 800 pixels wide. Every unnecessary kilobyte slows down page load time, hurts your Core Web Vitals scores, and increases bounce rates. Resizing images to match their display dimensions is the most impactful optimization you can make for web performance.
            </p>
            <p>
              The Canvas API used by this tool provides hardware-accelerated image processing that delivers professional-quality resizing. By keeping the process client-side, you eliminate upload delays and protect your privacy. Resized images are ideal for profile pictures, product thumbnails, social media sharing cards, email attachments, and any scenario where reducing file size without sacrificing visual quality matters. For color-accurate work, pair the resizer with the <Link href="/color-converter" className="text-blue-600 hover:underline dark:text-blue-400">Color Converter</Link> to ensure your image color palette matches your brand guidelines.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Choosing the Right Output Format for Resized Images
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              PNG is the best choice when you need lossless quality with transparency support. It is ideal for logos, icons, screenshots, and graphics with text. The trade-off is larger file sizes compared to lossy formats. JPEG is optimized for photographs and complex images with smooth color transitions. It uses lossy compression to achieve significantly smaller file sizes, but does not support transparency and can show compression artifacts at low quality settings. WebP is Google&apos;s modern format that offers superior compression — 25-35% smaller than JPEG at equivalent quality — with support for both lossy and lossless modes plus transparency.
            </p>
            <p>
              For web development, a common strategy is to serve WebP images with JPEG or PNG fallbacks using the picture element. This ensures modern browsers get the smaller WebP files while older browsers still display the image. When resizing for social media, each platform has specific recommended dimensions: Twitter cards are 1200×675, Instagram posts are 1080×1080 (square), and LinkedIn shared images are 1200×627. Using this tool, you can resize your images to exactly these specifications before uploading. For generating QR codes at specific sizes for your marketing materials, the <Link href="/qr-code-generator" className="text-blue-600 hover:underline dark:text-blue-400">QR Code Generator</Link> produces clean, scalable outputs.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Image Resizing" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Palette", title: "Color Converter", description: "Convert colors between HEX, RGB, and HSL formats", href: "/color-converter" },
              { icon: "Smartphone", title: "QR Code Generator", description: "Generate QR codes from any text or URL", href: "/qr-code-generator" },
              { icon: "Palette", title: "CSS Gradient Generator", description: "Create beautiful CSS gradients with a visual editor", href: "/css-gradient-generator" },
              { icon: "BarChart3", title: "Barcode Generator", description: "Generate barcodes in Code 128, EAN-13, and UPC-A", href: "/barcode-generator" },
            ]}
            title="Related Design Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="image-resizer" />
    </>
  );
}
