import type { Metadata } from "next";
import { BarcodeGenerator } from "@/components/barcode-generator/barcode-generator";
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

const slug = "barcode-generator";
const pageTitle = "Barcode Generator - Generate Code 128, EAN-13, UPC-A Barcodes Online";
const pageDescription =
  "Generate Code 128, EAN-13, and UPC-A barcodes instantly with Nuvora. Create printable barcodes for inventory tracking, product labeling, and supply chain management. Free online barcode generator.";

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
  { label: "Barcode Generator" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between Code 128, EAN-13, and UPC-A barcodes?",
    answer:
      "Code 128 is a high-density alphanumeric barcode that can encode all 128 ASCII characters. It is widely used in logistics, shipping, and warehouse management for labeling packages and assets. EAN-13 is a 13-digit numeric barcode used globally for retail product identification, required for selling in most international markets. UPC-A is a 12-digit numeric barcode used primarily in the United States and Canada for retail products. The main differences are character set (alphanumeric vs numeric), length, and regional adoption patterns.",
  },
  {
    question: "How does barcode encoding work under the hood?",
    answer:
      "Barcodes encode data using a pattern of alternating black bars and white spaces of varying widths. Each character is represented by a unique sequence of bars and spaces according to the symbology specification. Code 128 uses start/stop characters and a checksum digit calculated by weighting each character position. EAN-13 and UPC-A include a check digit computed from a weighted sum of the other digits (alternating 1x and 3x weights). The scanner reads the pattern by measuring the relative widths of bars and spaces, then decodes them back to the original characters.",
  },
  {
    question: "What is the quiet zone in a barcode and why is it important?",
    answer:
      "The quiet zone is the blank margin on both sides of a barcode that contains no printing. For Code 128, the minimum quiet zone is 10 times the width of the narrowest bar (typically 2.5 mm on each side). For EAN-13 and UPC-A, the quiet zone is specified by the standard and is usually around 11 module widths. Without adequate quiet zones, barcode scanners may fail to recognize the start and stop patterns, resulting in no-read errors. Always include the quiet zone when printing barcodes for production use.",
  },
  {
    question: "Can I generate barcodes for commercial products with this tool?",
    answer:
      "This tool generates barcode images that are visually correct and scannable by standard barcode readers. For retail products, you must obtain a valid GS1 Company Prefix and assign unique GTINs (Global Trade Item Numbers) to your products. EAN-13 barcodes generated without a legitimate GS1 prefix may scan incorrectly in retail systems or conflict with existing products. For internal use cases like inventory tracking and asset management, you can generate Code 128 barcodes with any data you choose without licensing concerns.",
  },
  {
    question: "What is a checksum digit and how is it calculated?",
    answer:
      "A checksum (check digit) is an extra digit appended to the barcode data that verifies the other digits were scanned correctly. For EAN-13, the check digit is calculated using a weighted sum: digits in odd positions (from the left) are multiplied by 1, even positions by 3, then the total is subtracted from the next multiple of 10. For example, if the weighted sum is 47, the check digit is 3 (50 - 47). The scanner recalculates the checksum when scanning and rejects the barcode if it does not match.",
  },
  {
    question: "What are common causes of barcode scanning failures?",
    answer:
      "Common scanning failures include insufficient quiet zones, low contrast between bars and background (avoid colored backgrounds), printing at too small a scale, excessive bar width variation from printer calibration, damage or smudging on the barcode, and incorrect aspect ratio. For best results, print barcodes on matte white labels with a high-resolution printer (300 DPI minimum), and always test with multiple scanner models before mass production.",
  },
  {
    question: "What is the difference between 1D and 2D barcodes?",
    answer:
      "1D (linear) barcodes like Code 128, EAN-13, and UPC-A encode data in a single row of vertical bars and spaces. They store a limited amount of data (typically 20-40 characters). 2D barcodes like QR codes and Data Matrix encode data in a grid pattern both horizontally and vertically, storing hundreds of characters including binary data, URLs, and images. 1D barcodes are scanned with laser scanners, while 2D codes require image-based scanners or smartphone cameras.",
  },
  {
    question: "How do I choose the right barcode symbology for my application?",
    answer:
      "Choose Code 128 for general-purpose labeling where you need to encode alphanumeric data like serial numbers, tracking codes, or asset tags. Choose EAN-13 for retail products sold internationally, especially in Europe, Asia, and Australia. Choose UPC-A for retail products sold in the United States and Canada. If you need smaller barcodes for small items, consider EAN-8 (8 digits) or UPC-E (6 digits). For healthcare applications, use GS1 DataMatrix or Code 128 with GS1-128 application identifiers.",
  },
  {
    question: "Can barcodes include letters and special characters?",
    answer:
      "Code 128 supports the full ASCII character set (128 characters), including uppercase and lowercase letters, digits, and common punctuation. EAN-13 and UPC-A support digits only (0-9). If your application requires alphanumeric data on retail products, consider GS1 DataBar or a combination of EAN-13 with a supplementary 2- or 5-digit add-on barcode for pricing or manufacturing date information.",
  },
  {
    question: "What are industry standards for barcode size and placement?",
    answer:
      "GS1 General Specifications recommend a minimum barcode height of 32% of the width for retail scanning. The recommended magnification range is 80% to 200% of nominal size. Barcodes should be placed on a flat, clean surface, away from seams, edges, and curved areas of the packaging. The bottom of the barcode should have at least 5 mm of clear space. For retail point-of-sale scanning, position the barcode on the bottom of the package (for products displayed upright) or on the back (for flat products).",
  },
];

export default function BarcodeGeneratorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Barcode Generator"
            description="Generate Code 128, EAN-13, and UPC-A barcodes instantly. Create printable, scannable barcodes for inventory management, product labeling, and asset tracking."
            breadcrumbs={breadcrumbs}
          >
            <BarcodeGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding Barcode Symbologies and Their Applications
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Barcodes are ubiquitous in modern commerce and logistics. Every product on a retail shelf, every package in a warehouse, and every asset in a hospital has a barcode that encodes identification data. The three symbologies this tool supports — Code 128, EAN-13, and UPC-A — cover the vast majority of commercial and industrial barcode needs. Code 128 is the workhorse of logistics: it is used by FedEx, UPS, and Amazon for tracking labels, by healthcare for patient wristbands and specimen tracking, and by manufacturers for work-in-progress routing.
            </p>
            <p>
              EAN-13 is the international standard for retail point-of-sale scanning. When you buy a product in any store outside North America, the barcode on the package is almost certainly EAN-13. The first two or three digits represent the GS1 prefix (country code or industry identifier), followed by the manufacturer code, product code, and a check digit. UPC-A is the North American equivalent, essentially a 12-digit subset of EAN-13 achieved by adding a leading zero. For encoding binary data or serial numbers efficiently alongside barcode data, the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> helps prepare encoded payloads for barcode representation.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Best Practices for Printing and Scanning Barcodes
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Barcode print quality directly affects scanning reliability. Low contrast between bars and background is the most common issue: bars should be black or very dark, and the background should be white or very light. Avoid placing barcodes on curved surfaces, near package seams, or in areas that will be covered by tape or labels. The minimum resolution for barcode printing is 203 DPI (thermal transfer) or 300 DPI (laser). Test your barcodes with multiple scanner models in the actual lighting conditions where they will be used — warehouse lighting, retail storefronts, and outdoor environments all present different challenges.
            </p>
            <p>
              When printing multiple barcodes on a single sheet, leave adequate spacing between them to prevent misreads. The aspect ratio (height to width) of your barcode should be at least 0.32 for retail-grade scanning. For inventory labels that will be scanned from various angles, taller barcodes perform better. Always print a calibration barcode first to verify printer alignment and contrast before printing a full batch. For hashing or encoding additional product metadata related to your barcodes, the <Link href="/md5-hash-generator" className="text-blue-600 hover:underline dark:text-blue-400">MD5 Hash Generator</Link> can create unique identifiers for your asset tracking system.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Barcode Generation" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📱", title: "QR Code Generator", description: "Generate QR codes for URLs, text, and contact information", href: "/qr-code-generator" },
              { icon: "🎨", title: "Color Converter", description: "Convert colors between HEX, RGB, and HSL for barcode printing", href: "/color-converter" },
              { icon: "🔐", title: "Base64 Encoder", description: "Encode binary data for embedding in barcode payloads", href: "/base64-encoder" },
              { icon: "🔑", title: "SHA Hash Generator", description: "Generate SHA hash digests for barcode data verification", href: "/sha-hash-generator" },
            ]}
            title="Related Image & Design Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="barcode-generator" />
    </>
  );
}
