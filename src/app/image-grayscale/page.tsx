import type { Metadata } from "next";
import { ImageGrayscale } from "@/components/image-suite/image-grayscale";
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

const slug = "image-grayscale";
const pageTitle = "Image Grayscale - Convert Images to Black and White Online Free";
const pageDescription =
  "Convert images to grayscale or sepia online. Apply black and white effects with pixel-level Canvas processing. Compare original and result side by side. Free and private.";

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
  { label: "Image Grayscale" },
];

const faqItems: FaqItem[] = [
  { question: "How does grayscale conversion work?", answer: "Grayscale conversion desaturates each pixel by calculating a weighted average of its red, green, and blue channels. The standard luminosity formula â€” 0.299Ã—R + 0.587Ã—G + 0.114Ã—B â€” accounts for human perception: we are more sensitive to green light and less sensitive to blue light. This produces a grayscale image that preserves the perceived brightness of the original colors, resulting in a natural-looking black and white photo." },
  { question: "What is the sepia effect?", answer: "The sepia effect gives images a warm, brownish tone reminiscent of 19th-century photographs. It is created by applying a color matrix transformation to each pixel: increasing the red channel, decreasing the blue channel, and adjusting green proportionally. The formula used is: newRed = RÃ—0.393 + GÃ—0.769 + BÃ—0.189, newGreen = RÃ—0.349 + GÃ—0.686 + BÃ—0.168, newBlue = RÃ—0.272 + GÃ—0.534 + BÃ—0.131. This creates the characteristic vintage look." },
  { question: "What is the difference between grayscale and black and white?", answer: "In digital imaging, grayscale refers to images that contain shades of gray â€” typically 256 levels from pure black to pure white. True black and white (bitonal) images contain only two colors: pure black and pure white. Grayscale preserves continuous tonal information and looks smoother. Most consumer tools labeled &apos;black and white&apos; actually produce grayscale images. For true bitonal conversion, additional thresholding or dithering algorithms are needed." },
  { question: "Can I convert only part of an image to grayscale?", answer: "This tool applies the effect to the entire image. For selective desaturation (where part of the image remains in color), you would need a more advanced editor with layer masks or selection tools. However, you can use the Image Cropper to isolate the area you want to convert, apply the grayscale effect, and then composite the result with the original using image editing software." },
  { question: "Why would I use grayscale instead of color?", answer: "Grayscale images can create powerful visual impact by removing color distractions and emphasizing composition, texture, contrast, lighting, and form. They are used in fine art photography, editorial images, passport photos (which often require grayscale), and document scanning. Grayscale also reduces file size because the color information is removed â€” it only needs one channel of brightness data instead of three." },
  { question: "Is my image uploaded to a server?", answer: "No. All processing happens entirely in your browser using Canvas pixel manipulation. Your image never leaves your device, ensuring complete privacy." },
];

export default function ImageGrayscalePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <ImageGrayscale />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">The Art and Science of Grayscale Photography</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Grayscale photography is not merely the absence of color â€” it is a creative choice that emphasizes the foundational elements of visual composition: contrast, texture, shape, and light. Without color to attract the viewer&apos;s eye, the relationship between light and shadow becomes the primary subject. This is why many professional photographers compose and shoot specifically for black and white, rather than converting as an afterthought. An image that works well in color may not translate effectively to grayscale if the tonal ranges of different colored objects overlap.</p>
            <p>The luminosity-based conversion used by this tool (0.299Ã—R + 0.587Ã—G + 0.114Ã—B) mimics how the human eye perceives brightness. This produces results similar to traditional black and white film, where different colors were captured with different tonal values based on the film&apos;s spectral sensitivity. For images where the grayscale result looks flat due to color channels with similar luminance values, converting individual color channels separately or using the sepia effect can produce more dramatic results. For further enhancement of your grayscale images, the <Link href="/blur-image" className="text-blue-600 hover:underline dark:text-blue-400">Blur Image</Link> tool can add soft focus effects for a classic fine-art look.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Pixel-Level Canvas Processing Explained</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>The Canvas API&apos;s ImageData interface gives us direct access to every pixel in the image. Each pixel is represented by four consecutive values in a Uint8ClampedArray: red, green, blue, and alpha (0-255 each). The grayscale conversion iterates through every pixel, calculates the weighted brightness value from the RGB channels, and sets all three channels to that same value. This eliminates color information while preserving luminance. The sepia effect uses a different color matrix that shifts the RGB values toward warm brown tones.</p>
            <p>This pixel-level manipulation approach gives us complete control over the transformation â€” no third-party libraries or server processing required. The entire operation happens synchronously in the browser&apos;s main thread, making it effectively instantaneous even for large images. The same Canvas API technique is used by professional image editors and can be extended to create custom filters, color grading, and artistic effects. For images that need further optimization after conversion, the <Link href="/image-compressor" className="text-blue-600 hover:underline dark:text-blue-400">Image Compressor</Link> can reduce the file size of your grayscale or sepia outputs for efficient web delivery.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Image Grayscale" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "ðŸŒ«ï¸", title: "Blur Image", description: "Add Gaussian blur effects to your images", href: "/blur-image" },
              { icon: "ðŸ“¦", title: "Image Compressor", description: "Compress grayscale images for efficient web delivery", href: "/image-compressor" },
              { icon: "ðŸ”„", title: "Image Converter", description: "Convert grayscale images between different formats", href: "/image-converter" },
              { icon: "âœ‚ï¸", title: "Crop Image", description: "Crop and reframe your grayscale images", href: "/crop-image" },
            ]}
            title="Related Image Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
