import type { Metadata } from "next";
import { ImageMetadataViewer } from "@/components/image-suite/image-metadata-viewer";
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

const slug = "image-metadata-viewer";
const pageTitle = "Image Metadata Viewer - View EXIF and Image Info Online Free";
const pageDescription =
  "View EXIF metadata and image information online. Extract dimensions, file size, type, aspect ratio, and more. Free, private, and runs entirely in your browser.";

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
  { label: "Image Metadata Viewer" },
];

const faqItems: FaqItem[] = [
  { question: "What is EXIF metadata?", answer: "EXIF (Exchangeable Image File Format) is a standard that stores metadata within digital image files. It includes camera settings (make, model, aperture, shutter speed, ISO, focal length), date and time, GPS coordinates, orientation, copyright information, and thumbnail data. This information is embedded by cameras and smartphones at the time of capture and can be viewed, edited, or stripped using specialized tools." },
  { question: "Does every image have metadata?", answer: "Most images from digital cameras and smartphones contain EXIF metadata. However, many social media platforms and messaging apps strip EXIF data when images are uploaded to protect user privacy. Screenshots and screen captures typically contain minimal metadata (only dimensions and format info). Images saved from browsers or downloaded from websites often have metadata removed. The tool displays all metadata accessible through the browser&apos;s native APIs â€” comprehensive EXIF parsing requires additional libraries." },
  { question: "Can I remove metadata from my images?", answer: "This tool is for viewing metadata only. To remove metadata, you can use your operating system&apos;s file properties panel, image editing software like Photoshop or GIMP, or dedicated EXIF removal tools. On macOS, use Preview&apos;s Tools > Show Inspector and delete location data. On Windows, use File Properties > Details > Remove Properties. Online EXIF removal tools are also available but may upload your images to external servers." },
  { question: "What information can my images reveal?", answer: "Photos taken with smartphones typically include GPS coordinates of where the photo was taken, the exact date and time, the device model and serial number, and camera settings. This can reveal your home address, daily routines, travel history, and device identity. Privacy-conscious users should strip EXIF data before sharing images publicly. This tool helps you verify what information your images contain before sharing." },
  { question: "How accurate is the metadata displayed?", answer: "The file-level metadata (dimensions, file size, file type, last modified) is 100% accurate as it comes directly from the browser&apos;s File and Image APIs. Camera EXIF data depends on what the device embeds and what the browser exposes. For comprehensive EXIF parsing including GPS, camera settings, and thumbnail data, consider using dedicated EXIF libraries like exifr or exif-js in your projects." },
  { question: "Is my image uploaded to a server?", answer: "No. The tool reads metadata entirely in your browser using the FileReader and Image APIs. Your image never leaves your device, making it safe for inspecting sensitive or private images." },
];

export default function ImageMetadataViewerPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <ImageMetadataViewer />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Understanding Image Metadata and Privacy</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Every digital image carries hidden information beyond what the eye can see. This metadata serves legitimate purposes â€” photographers use it to track camera settings, developers use it for asset management, and search engines use it for image indexing. However, metadata can also expose private information unknowingly. GPS coordinates embedded in smartphone photos have revealed home addresses of celebrities, activists, and government personnel when images were shared without metadata stripping.</p>
            <p>Before sharing images publicly, use this tool to inspect exactly what data your images contain. If you discover sensitive information like GPS coordinates or camera serial numbers, use a metadata removal tool before publishing. For developers managing image assets, the <Link href="/image-to-base64" className="text-blue-600 hover:underline dark:text-blue-400">Image to Base64</Link> converter can help embed small images directly in code, though base64 encoding does not strip metadata from the encoded data itself.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Metadata Standards: EXIF, IPTC, and XMP</h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>Three main metadata standards coexist in digital imaging. EXIF is primarily technical metadata created by cameras â€” exposure settings, date/time, GPS, device info. IPTC (International Press Telecommunications Council) is designed for descriptive metadata â€” captions, keywords, credit lines, copyright notices â€” and is widely used in journalism and stock photography. XMP (Extensible Metadata Platform) is Adobe&apos;s XML-based standard that can embed any type of metadata and is the foundation for Adobe&apos;s digital asset management ecosystem.</p>
            <p>This tool reads metadata available through the browser&apos;s native APIs, which covers the most commonly needed fields. For comprehensive metadata extraction across all standards, dedicated libraries like exifr can parse EXIF, IPTC, and XMP from JPEG, TIFF, and RAW files. When preparing images for web use, the <Link href="/image-compressor" className="text-blue-600 hover:underline dark:text-blue-400">Image Compressor</Link> can help optimize file sizes, though compression may strip certain metadata fields depending on the output format.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Image Metadata" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔗", title: "Image to Base64", description: "Convert images to Base64 data URI strings", href: "/image-to-base64" },
              { icon: "📓", title: "Base64 to Image", description: "Decode Base64 strings back to viewable images", href: "/base64-to-image" },
              { icon: "📦", title: "Image Compressor", description: "Compress images without losing metadata", href: "/image-compressor" },
              { icon: "🔄", title: "Image Converter", description: "Convert between image formats preserving metadata", href: "/image-converter" },
            ]}
            title="Related Image Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
