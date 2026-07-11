import type { Metadata } from "next";
import { CropImage } from "@/components/image-suite/crop-image";
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

const slug = "crop-image";
const pageTitle = "Crop Image - Crop Images Online with Aspect Ratio Presets Free";
const pageDescription =
  "Crop images online with freeform or preset aspect ratios (1:1, 4:3, 16:9, 3:2). Drag to select, preview, and download. Free and private â€” all processing in your browser.";

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
  { label: "Crop Image" },
];

const faqItems: FaqItem[] = [
  { question: "What is the difference between cropping and resizing?", answer: "Cropping removes portions of an image to change its composition or aspect ratio, discarding the cropped-out areas entirely. Resizing changes the overall dimensions of the entire image through interpolation â€” all content is preserved but scaled up or down. Cropping is used to improve composition, fit a specific aspect ratio, or remove unwanted edges. Resizing is used to reduce file size or fit a particular display size." },
  { question: "What aspect ratio should I use for social media?", answer: "Instagram square posts use 1:1 (1080x1080), Instagram portraits use 4:5 (1080x1350), Twitter cards use 16:9 (1200x675), Facebook shared images use 1.91:1 (1200x630), LinkedIn shared images use 1.91:1 (1200x627), and Pinterest pins use 2:3 (1000x1500). The tool provides presets for the most common ratios: 1:1 for social profiles, 4:3 for photography, 16:9 for widescreen video thumbnails, and 3:2 for classic photography." },
  { question: "Does cropping affect image quality?", answer: "Cropping itself does not reduce image quality â€” it simply discards pixels outside the selected area. However, if you crop significantly and then resize the result to a larger display size, you may notice quality loss because you are effectively zooming in on a smaller portion of the original image. For best results, start with the highest resolution source image available." },
  { question: "How do I crop to an exact size?", answer: "Select the Freeform aspect ratio option and draw your crop area. The cropped result will have exact pixel dimensions matching the selection you made. For precise requirements like 1200x630 pixels for social sharing cards, combine cropping with the Image Resizer tool to achieve exact pixel-perfect dimensions after removing unwanted areas." },
  { question: "What is the rule of thirds in cropping?", answer: "The rule of thirds divides the image into a 3x3 grid and suggests placing key compositional elements along the grid lines or at their intersections. This creates more dynamic and visually engaging compositions than centering the subject. When using the freeform crop tool, visualize this grid to position your crop area for maximum visual impact." },
  { question: "Is my image uploaded to a server?", answer: "No. All cropping is done entirely in your browser using the Canvas API. Your image never leaves your device, ensuring complete privacy and security." },
];

export default function CropImagePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <CropImage />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Why Cropping Is Essential for Visual Content</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Cropping is one of the most fundamental image editing operations. It serves three primary purposes: improving composition by removing distracting elements, fitting content to specific aspect ratio requirements, and focusing attention on the subject. Professional photographers and designers rarely use an image straight out of camera â€” almost every published image has been cropped to enhance its visual impact and meet format specifications.</p>
            <p>Different platforms and media have strict aspect ratio requirements. Social media platforms reject images that don&apos;t match their expected dimensions. Print media requires exact aspect ratios for layouts. Thumbnails and preview images need consistent proportions. This tool helps you quickly adapt any image to these constraints. For further refinement after cropping, use the <Link href="/image-resizer" className="text-blue-600 hover:underline dark:text-blue-400">Image Resizer</Link> to set exact pixel dimensions for your final output.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Understanding Aspect Ratios and Their Uses</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>An aspect ratio is the proportional relationship between an image&apos;s width and height. 1:1 (square) is the standard for profile photos and Instagram feed images. 4:3 is the traditional photography and monitor ratio, matching most camera sensors and older displays. 16:9 is the widescreen standard for video, YouTube thumbnails, and modern displays. 3:2 is the classic 35mm film ratio used by many professional DSLR cameras. Choosing the right aspect ratio before editing saves time and ensures your images fit their intended display context.</p>
            <p>When cropping for multiple platforms from a single source image, start with the most restrictive aspect ratio first (typically 1:1 for social profiles) and then create wider variants from the remaining area. This approach ensures your subject remains well-positioned across all formats. For color-accurate work across your image pipeline, the <Link href="/color-converter" className="text-blue-600 hover:underline dark:text-blue-400">Color Converter</Link> helps maintain consistent brand colors in your edited images.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Cropping Images" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📐", title: "Image Resizer", description: "Resize images to exact pixel dimensions", href: "/image-resizer" },
              { icon: "🔄", title: "Image Converter", description: "Convert between JPEG, PNG, WebP, GIF, and BMP formats", href: "/image-converter" },
              { icon: "📦", title: "Image Compressor", description: "Compress images to reduce file size for web", href: "/image-compressor" },
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
