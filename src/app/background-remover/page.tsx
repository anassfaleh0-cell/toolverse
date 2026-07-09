import type { Metadata } from "next";
import dynamic from "next/dynamic";
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

const BackgroundRemover = dynamic(() => import("@/components/image-suite/background-remover").then((m) => ({ default: m.BackgroundRemover })), {
  loading: () => (
    <div className="flex items-center justify-center rounded-xl border border-zinc-200 p-12 dark:border-zinc-800" role="status">
      <div className="animate-shimmer h-6 w-48 rounded" />
    </div>
  ),
});

const slug = "background-remover";
const pageTitle = "Background Remover - Remove Image Backgrounds Online Free";
const pageDescription =
  "Remove image backgrounds instantly with AI or chroma key. Free online tool with no uploads required — processing happens entirely in your browser.";

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
  { question: "How does the AI background removal work?", answer: "The AI mode uses a deep neural network (ISNet) trained on millions of images to identify and separate foreground subjects from any background. No green screen or special setup is required. The model runs entirely in your browser using ONNX runtime and WebAssembly, so your images never leave your device." },
  { question: "What is chroma key and when should I use it?", answer: "Chroma key (green/blue screen removal) works by matching specific colors and making them transparent. Use chroma key when you have a controlled green or blue screen setup — it's faster and doesn't require the initial AI model download. Use AI mode for photos with any background." },
  { question: "Are my images uploaded to a server?", answer: "No. Both AI and chroma key processing happen entirely in your browser. Your image data is never sent to any server. The AI model is downloaded once and cached locally." },
  { question: "Why does the AI model take time to load initially?", answer: "The first run downloads the AI model (~30MB) and sets up the ONNX inference engine in your browser. This is a one-time download — subsequent uses are instant. The model is cached by your browser for future sessions." },
  { question: "What image formats are supported?", answer: "All common image formats are supported including JPEG, PNG, WebP, GIF, BMP, and TIFF. The result is always downloaded as PNG to preserve transparency." },
  { question: "How accurate is the AI background removal?", answer: "The ISNet model provides state-of-the-art accuracy for general-purpose background removal. It handles complex edges like hair and fur well. For best results, use images with clear contrast between the subject and background." },
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
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">AI-Powered Background Removal in Your Browser</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Traditional background removal required green screens, specialized lighting, or uploading your images to third-party servers. Background removal now runs directly in your browser using advanced AI. The ISNet deep learning model analyzes every pixel to identify foreground subjects and separate them from the background with pixel-level precision.</p>
            <p>The tool offers two modes: AI Smart Remove for any image without special equipment, and Chroma Key for controlled green/blue screen environments. Both modes process entirely on your device — your images never leave your computer. This makes it suitable for sensitive images where privacy matters.</p>
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
              { icon: "⚫", title: "Image Grayscale", description: "Convert images to grayscale or sepia effects", href: "/image-grayscale" },
              { icon: "✂️", title: "Crop Image", description: "Crop and reframe your background-free images", href: "/crop-image" },
              { icon: "📐", title: "Image Resizer", description: "Resize background-free images for e-commerce", href: "/image-resizer" },
              { icon: "📦", title: "Image Compressor", description: "Compress images for faster web delivery", href: "/image-compressor" },
            ]}
            title="Related Image Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
