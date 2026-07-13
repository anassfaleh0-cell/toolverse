import type { Metadata } from "next";
import { BlurImage } from "@/components/image-suite/blur-image";
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

const slug = "blur-image";
const pageTitle = "Blur Image - Blur Images Online with Adjustable Radius Free";
const pageDescription =
  "Blur images online with adjustable Gaussian blur radius. Blur sensitive content, backgrounds, or create artistic effects. Free, private, and runs entirely in your browser.";

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
  { label: "Blur Image" },
];

const faqItems: FaqItem[] = [
  { question: "What is Gaussian blur?", answer: "Gaussian blur is a image filter that uses a Gaussian function to calculate the transformation to apply to each pixel. It creates a smooth, natural-looking blur by averaging each pixel with its neighbors, weighted by a bell-shaped curve. The radius parameter controls how many neighboring pixels are included in the average — higher values produce stronger blur. Gaussian blur is widely used in photography, UI design, and image processing for its mathematically smooth results." },
  { question: "How do I blur only a specific area of an image?", answer: "This tool applies Gaussian blur to the entire image. For selective blurring of specific areas (such as faces, license plates, or sensitive text), you would need a more advanced editor with masking capabilities. The blur effect is useful for creating background blur (bokeh effect), obscuring sensitive information across the whole image, or creating artistic blur effects for social media graphics." },
  { question: "What is a good blur radius for obscuring text?", answer: "For obscuring readable text, a radius of 5-10 pixels is usually sufficient depending on the font size and resolution. Small text (10-12px) may only need a radius of 3-5. Large headlines (24-36px) may need 10-15. For full privacy protection, consider using a pixelation effect instead of blur, as blur can sometimes be reversed with deconvolution algorithms on high-quality source images." },
  { question: "What's the difference between blur and pixelate?", answer: "Blur (Gaussian blur) smooths the image by averaging pixel values, creating a soft, diffuse effect. Pixelation reduces the image resolution by averaging blocks of pixels into single-colored squares, creating a blocky mosaic effect. Pixelation is generally more effective for obscuring sensitive information because it destroys fine detail completely, while blur can theoretically be partially reversed with sharpening algorithms." },
  { question: "Can I use the blur effect for UI design?", answer: "Yes, Gaussian blur is widely used in UI design for glassmorphism effects, modal backgrounds, and depth-of-field illusions. A light blur (radius 2-4) on background elements behind a modal or popup creates visual hierarchy and focuses attention on the foreground content. The blurred result can be downloaded as a PNG and integrated into your design workflow." },
  { question: "Is my image uploaded to a server?", answer: "No. All blur processing happens in your browser using the Canvas API. Your image never leaves your device, ensuring complete privacy for sensitive images containing personal information." },
];

export default function BlurImagePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <BlurImage />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Protecting Privacy with Image Blurring</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Image blurring is an essential tool for privacy protection in an age of ubiquitous photography. Before sharing photos online, blurring faces, license plates, screens displaying personal information, and bystanders helps protect privacy and comply with data protection regulations like GDPR and CCPA. Journalists and documentarians regularly use blurring to anonymize sources and protect vulnerable subjects.</p>
            <p>The adjustable radius gives you precise control over the level of anonymization. A radius of 3-5 is typically sufficient for GDPR-compliant face blurring, while license plates may require 8-12 to fully obscure characters. For maximum privacy protection, the <Link href="/image-grayscale" className="text-blue-600 hover:underline dark:text-blue-400">Image Grayscale</Link> tool can be used in combination with blurring to further anonymize images by removing color information that could aid identification.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Creative Applications of Image Blur</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Beyond privacy protection, blur effects have numerous creative applications. Portrait photographers use blur to simulate shallow depth of field, drawing attention to the subject by softening the background. UI designers create glassmorphism effects by blurring background elements behind frosted glass panels. Social media creators use blur as an artistic effect for dreamy, ethereal imagery. The gentle blur at radius 2-4 can also reduce noise and grain in low-light photos without sacrificing sharpness.</p>
            <p>The hold-to-compare feature lets you toggle between the original and blurred versions, helping you dial in the exact amount of blur for your intended effect. When preparing images for web use after blurring, the <Link href="/image-compressor" className="text-blue-600 hover:underline dark:text-blue-400">Image Compressor</Link> can help optimize the file size of your blurred images for faster loading.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Image Blurring" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Circle", title: "Image Grayscale", description: "Convert images to grayscale or sepia effects", href: "/image-grayscale" },
              { icon: "Scissors", title: "Crop Image", description: "Crop images to focus on specific areas", href: "/crop-image" },
              { icon: "Package", title: "Image Compressor", description: "Compress images to reduce file size", href: "/image-compressor" },
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
