import type { Metadata } from "next";
import { ImageToBase64 } from "@/components/image-suite/image-to-base64";
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

const slug = "image-to-base64";
const pageTitle = "Image to Base64 - Convert Images to Base64 Data URI Online Free";
const pageDescription =
  "Convert any image to a Base64 data URI string instantly. Copy to clipboard or download as a text file. Supports all image formats. Free, private, and runs in your browser.";

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
  { label: "Image to Base64" },
];

const faqItems: FaqItem[] = [
  { question: "What is Base64 encoding for images?", answer: "Base64 encoding converts binary image data into a text string of ASCII characters. The resulting string can be embedded directly in HTML (img src), CSS (background-image), or JavaScript without needing a separate image file. A Base64 data URI has the format &apos;data:image/png;base64,iVBORw0KGgo...&apos;. While convenient, Base64 encoding increases file size by approximately 33% compared to the original binary file." },
  { question: "When should I use Base64 images?", answer: "Base64 images are most useful for small images (under 10KB) that are critical to the initial page render â€” such as icons, logos, and loading spinners â€” because they eliminate separate HTTP requests. They are also useful when embedding images in self-contained HTML documents, email signatures, and code snippets that need to be portable without external dependencies. For larger images, Base64 encoding is inefficient because the increased size outweighs the HTTP request savings." },
  { question: "What is a data URI?", answer: "A data URI is a URL scheme that allows data to be embedded directly in web pages. The format is &apos;data:[mime type];base64,[encoded data]&apos;. For example, &apos;data:image/png;base64,iVBOR...&apos; tells the browser that the data is a PNG image encoded in Base64. Data URIs can be used in HTML img src attributes, CSS url() values, and JavaScript anywhere a URL is expected." },
  { question: "Does Base64 encoding affect image quality?", answer: "Base64 encoding is a binary-to-text encoding scheme that preserves the exact image data â€” it is lossless. The decoded image is byte-for-byte identical to the original. The only change is the encoded size, which is approximately 33% larger due to the encoding overhead. Image quality is only affected if you change the image format or compression settings before encoding." },
  { question: "What is the file size overhead of Base64 encoding?", answer: "Base64 encoding increases file size by approximately 33% (4 bytes of Base64 for every 3 bytes of binary data, plus padding). For a 10KB image, the Base64 string will be about 13.6KB. When using data URIs in HTML, the full string adds to the page size and is not cached separately from the HTML document. Consider the trade-off: small images benefit from reduced HTTP requests, while large images are better served as separate cached files." },
  { question: "Is my image uploaded to a server?", answer: "No. All encoding happens entirely in your browser. Your image never leaves your device, ensuring complete privacy even when encoding sensitive images." },
];

export default function ImageToBase64Page() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <ImageToBase64 />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">When and Why to Use Base64 Images</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Base64 image encoding serves specific use cases in web development where minimizing HTTP requests matters more than raw file size. The primary use case is critical inline images â€” icons, logos, and loading indicators that must be visible before external CSS and image files are downloaded. By encoding these as data URIs in the initial HTML, you eliminate the render-blocking image request and improve the Largest Contentful Paint metric. Google&apos;s PageSpeed Insights specifically recommends inlining small images as Base64 for above-the-fold content.</p>
            <p>Another important use case is creating self-contained documents â€” HTML files, email templates, and code playground exports that must work without any external dependencies. A single HTML file with embedded Base64 images can be viewed offline, emailed as an attachment, or posted on code-sharing platforms without broken image links. For converting Base64 strings back to downloadable images when needed, the <Link href="/base64-to-image" className="text-blue-600 hover:underline dark:text-blue-400">Base64 to Image</Link> tool provides the reverse operation.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Performance Impact of Data URIs</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Data URIs have specific performance characteristics that developers need to understand. The 33% size overhead means an inlined image is larger than the same image served as a separate file. Data URIs are not cached independently â€” they are cached only as part of the parent document, so every page load re-downloads the full encoded string. For images shared across multiple pages, separate files with proper caching headers are more efficient. The HTTP/2 and HTTP/3 multiplexing features have also reduced the performance benefit of inlining, as multiple simultaneous requests no longer create the head-of-line blocking that made Base64 attractive in the HTTP/1.1 era.</p>
            <p>The current best practice is selective inlining: use Base64 for the smallest, most critical images (under 2KB) that appear above the fold, and serve larger images as separate files with proper caching. Tools like webpack&apos;s url-loader and vite&apos;s asset handling automate this decision based on file size thresholds. The toggle between full data URI and raw Base64 in this tool lets you control exactly how the encoded output is formatted for your specific use case. For further optimization of your original images before encoding, use the <Link href="/image-compressor" className="text-blue-600 hover:underline dark:text-blue-400">Image Compressor</Link> to reduce their size first.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Image to Base64" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "BookOpen", title: "Base64 to Image", description: "Decode Base64 strings back to viewable images", href: "/base64-to-image" },
              { icon: "Package", title: "Image Compressor", description: "Compress images before Base64 encoding to reduce string size", href: "/image-compressor" },
              { icon: "FileText", title: "Image Metadata Viewer", description: "View EXIF and metadata from your images", href: "/image-metadata-viewer" },
              { icon: "RefreshCw", title: "Image Converter", description: "Convert images between different formats before encoding", href: "/image-converter" },
            ]}
            title="Related Image Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
