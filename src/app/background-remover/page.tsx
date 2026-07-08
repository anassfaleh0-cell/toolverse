import type { Metadata } from "next";
import { BackgroundRemover } from "@/components/image-suite/background-remover";
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

const slug = "background-remover";
const pageTitle = "Background Remover - Remove Image Backgrounds Online Free";
const pageDescription =
  "Remove backgrounds from images using chroma key (green/blue screen) technology. API-ready architecture for integrating AI-powered background removal. Free and private.";

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
  { label: "Background Remover" },
];

const faqItems: FaqItem[] = [
  { question: "How does chroma key background removal work?", answer: "Chroma key removal analyzes each pixel&apos;s color and makes pixels transparent if they match a target color (green or blue) within a certain tolerance. The tolerance setting controls how close a pixel must be to the chroma key color to be removed. Higher tolerance removes more of the background but may also remove parts of the subject that contain similar colors. Lower tolerance preserves the subject better but may leave background remnants." },
  { question: "What is the difference between chroma key and AI background removal?", answer: "Chroma key works by matching specific colors (green or blue) and requires a solid-colored background. AI background removal uses machine learning models trained on millions of images to identify and separate subjects from any background â€” no special screen required. AI services like Remove.bg, rembg, and @imgly/background-removal provide much better results for general images but require an API key or local processing library." },
  { question: "Why do my results have green edges around the subject?", answer: "Green spill (or color spill) occurs when light reflects from the green screen onto the subject, tinting edges with the chroma key color. The tolerance setting tries to compensate, but high tolerance can also remove green tones from the subject itself. Professional chroma key setups use separate lighting for the background and subject to minimize spill." },
  { question: "How do I get the best results with chroma key?", answer: "Use a well-lit, evenly lit green or blue screen without shadows or wrinkles. Keep the subject at least 3 feet from the background to minimize color spill. Avoid clothing that matches the chroma key color. Use the lowest tolerance setting that still removes the background cleanly. Blue screens are better for subjects with green tones (like plants) and vice versa." },
  { question: "Can I remove backgrounds without a green screen?", answer: "This tool&apos;s chroma key feature requires a solid green or blue background. For removing backgrounds from arbitrary photos, you need an AI-based solution. The architecture note in the tool shows how to integrate services like Remove.bp (API key required), rembg (self-hosted Python), or @imgly/background-removal (client-side WASM). Each has different trade-offs in accuracy, speed, and cost." },
  { question: "Is my image uploaded to a server?", answer: "The chroma key processing in this tool runs entirely in your browser â€” no image data is uploaded. If you choose to integrate an external AI API using the architecture shown in the tool, your image would be sent to that third-party service for processing." },
];

export default function BackgroundRemoverPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <BackgroundRemover />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Chroma Key vs AI Background Removal</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Chroma key (green/blue screen removal) is the traditional technique used in filmmaking, television, and photography. It works by selecting a specific color range to make transparent. The technique is fast, predictable, and requires no external APIs or machine learning models. However, it requires a controlled environment with a solid-colored background and even lighting. The results are limited by color spill, shadows, and the subject&apos;s clothing colors â€” anything matching the chroma key color will also become transparent.</p>
            <p>AI-powered background removal has revolutionized the field by enabling background removal from any image â€” indoor photos, outdoor scenes, product shots on any surface â€” without special equipment. Models like u2-net and isnet are trained on diverse datasets and can identify subjects with remarkable accuracy, including complex edges like hair and fur. The trade-offs are computational cost (most run on servers or require GPU-accelerated WASM) and potential privacy concerns of uploading images to third-party services. For product photography and e-commerce listings, the <Link href="/image-resizer" className="text-blue-600 hover:underline dark:text-blue-400">Image Resizer</Link> can help standardize the output dimensions after background removal.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Architecture: Integrating Background Removal APIs</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>The tool includes an architecture section that demonstrates how to integrate real AI background removal services. The three main approaches are: cloud APIs like Remove.bg and Adobe Photoshop API (simple but require API keys and have per-image costs), self-hosted solutions like rembg (free but require Python server infrastructure), and client-side WASM libraries like @imgly/background-removal (runs in the browser but requires significant initial download and GPU support).</p>
            <p>For production applications, the choice depends on your volume, latency requirements, and privacy needs. Low-volume applications with privacy-sensitive data benefit from client-side WASM. High-volume commercial applications typically use cloud APIs for their accuracy and scalability. Development teams can start with rembg for prototyping and testing before committing to a paid API. For preparing training data or mockups with clean backgrounds, the <Link href="/crop-image" className="text-blue-600 hover:underline dark:text-blue-400">Crop Image</Link> tool can help refine the composition of your output images.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Background Removal" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "âš«", title: "Image Grayscale", description: "Convert images to grayscale or sepia effects", href: "/image-grayscale" },
              { icon: "âœ‚ï¸", title: "Crop Image", description: "Crop and reframe your background-free images", href: "/crop-image" },
              { icon: "ðŸ“", title: "Image Resizer", description: "Resize background-free images for e-commerce", href: "/image-resizer" },
              { icon: "ðŸ“¦", title: "Image Compressor", description: "Compress images for faster web delivery", href: "/image-compressor" },
            ]}
            title="Related Image Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
