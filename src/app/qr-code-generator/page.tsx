import type { Metadata } from "next";
import { QrCodeGenerator } from "@/components/qr-code-generator/qr-code-generator";
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

const slug = "qr-code-generator";
const pageTitle = "QR Code Generator - Generate QR Codes for URLs, Text, and Data Online";
const pageDescription =
  "Generate QR codes instantly with Nuvora. Create scannable QR codes for URLs, text, WiFi credentials, and contact information. Free online QR code generator with download as PNG.";

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
  { label: "QR Code Generator" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does a QR code actually work?",
    answer:
      "A QR (Quick Response) code encodes data in a two-dimensional grid of black and white modules. The three corner squares (finders patterns) help scanners detect the code's position and orientation. Smaller alignment patterns help maintain readability on curved surfaces. The data is encoded using Reed-Solomon error correction, which allows the code to be read even if partially damaged or obscured (up to 30% depending on the error correction level). The scanner decodes the module pattern by sampling the grid at the correct intersections, applying the error correction algorithm, and converting the binary data back to the original text or URL.",
  },
  {
    question: "What is error correction in QR codes and which level should I use?",
    answer:
      "QR codes use Reed-Solomon error correction, which adds redundant data so the code can be scanned even when partially damaged. There are four levels: L (low, 7% recovery), M (medium, 15%), Q (quartile, 25%), and H (high, 30%). Higher levels produce denser codes (more modules). For general use, Level M offers a good balance of data capacity and error resilience. Choose Level H for codes printed on curved surfaces, exposed to wear, or where scan reliability is critical. Level L maximizes data capacity for small items with minimal risk of damage.",
  },
  {
    question: "What is the maximum amount of data a QR code can store?",
    answer:
      "The maximum data capacity depends on the QR code version (1-40) and error correction level. Version 40 with Level L can store up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 bytes of binary data. Version 1 (the smallest, 21x21 modules) stores up to 41 alphanumeric characters. Higher versions add more modules (increasing by 4 per side per version). In practice, most QR codes use versions 2-6 (25x25 to 41x41 modules), which comfortably encode URLs up to several hundred characters with good error correction.",
  },
  {
    question: "What can I encode in a QR code besides URLs?",
    answer:
      "QR codes can encode any text data up to several thousand characters. Common use cases include URLs for website links, plain text for notes or instructions, vCard contact information (for automatic phone contact creation), WiFi credentials using the format WIFI:S:SSID;T:WPA;P:password;;, email addresses (mailto: links), phone numbers (tel: links), SMS messages (smsto:), geographic coordinates (geo:lat,lon), and calendar event data. Some QR readers automatically detect the data type and suggest appropriate actions.",
  },
  {
    question: "How do QR code finder patterns help with scanning?",
    answer:
      "The three finder patterns located at the top-left, top-right, and bottom-left corners of every QR code are concentric square rings with a 7x7 module size. Their specific 1-1-3-1-1 ratio of black-white-black-white-black modules makes them uniquely identifiable regardless of rotation or scale. The scanner locates these three patterns first, which tells it the code's orientation, position, and size. The fourth corner (bottom-right) is left open for the data area. Without finder patterns, scanners would not know where the code begins, ends, or how it is rotated.",
  },
  {
    question: "What is the difference between QR codes and barcodes?",
    answer:
      "Traditional barcodes are 1D (linear) and encode data in a single row of vertical bars. QR codes are 2D (matrix) and encode data in a grid pattern. 1D barcodes store 20-40 characters, while QR codes can store thousands. QR codes can encode URLs, text, and binary data; barcodes are primarily numeric or alphanumeric identifiers. QR codes include error correction for damaged codes; most 1D barcodes use only a simple checksum. QR codes require image-based scanners (smartphone cameras), while 1D barcodes can be read by cheaper laser scanners.",
  },
  {
    question: "What are common mistakes when generating QR codes?",
    answer:
      "Common mistakes include making the QR code too small (minimum 2x2 cm for reliable scanning), using insufficient contrast (always use black modules on a white background), placing codes on curved or reflective surfaces, not testing with multiple scanner apps, encoding short URLs with URL shorteners that may expire, putting codes in areas with poor lighting or at odd angles, and forgetting that error correction only helps with physical damage, not poor print quality or insufficient size.",
  },
  {
    question: "Can I track how many times a QR code is scanned?",
    answer:
      "The QR code itself is just a static image — it cannot track scans. To track scan analytics, encode a URL that goes through an analytics service or URL shortener with tracking capabilities (like Bitly, Google Analytics campaign URLs, or your own server with analytics middleware). When someone scans the code, their device loads the intermediate URL, which logs the scan before redirecting to the final destination. This gives you data on scan count, location (approximate), device type, and time of scan.",
  },
  {
    question: "How do I generate a QR code for WiFi credentials?",
    answer:
      "WiFi QR codes use a specific format: WIFI:S:YourNetworkName;T:WPA;P:YourPassword;;. Replace YourNetworkName with the SSID, replace WPA with WEP, WPA, or nopass depending on your security type, and replace YourPassword with the actual password. When scanned with a smartphone camera (iOS 11+ or Android 10+), the device automatically recognizes the WiFi format and offers to connect to the network. Test the generated QR code before printing it on signage or labels.",
  },
  {
    question: "What is a QR code version and how do I choose the right one?",
    answer:
      "QR code versions range from 1 to 40, where each higher version adds 4 modules to each side (e.g., version 1 is 21x21, version 2 is 25x25, version 40 is 177x177). Higher versions store more data but require higher printing resolution and larger physical size for reliable scanning. For URLs under 50 characters, version 2-3 (25x25 to 29x29) with Level M error correction is ideal — small enough for business cards but large enough for reliable scanning. For complex data like vCard contacts, use version 4-6 (33x33 to 41x41).",
  },
];

export default function QrCodeGeneratorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="QR Code Generator"
            description={pageDescription}
            introText="Create scannable QR codes instantly for URLs, text, WiFi credentials, and contact information. Download as high-quality PNG for print, signage, or digital use."
            breadcrumbs={breadcrumbs}
          >
            <QrCodeGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            How QR Codes Became Essential for Modern Communication
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              QR codes were invented in 1994 by Denso Wave, a Toyota subsidiary, for tracking automotive parts during manufacturing. They remained a niche industrial tool for two decades until smartphones with cameras became ubiquitous. The turning point came when Apple added native QR scanning to the iOS camera app in 2017, followed by Android in 2018. Suddenly, billions of people could scan QR codes without installing a third-party app. The COVID-19 pandemic accelerated adoption dramatically, with restaurants replacing paper menus with QR-code-accessed digital menus, venues using codes for contact tracing check-ins, and contactless payments relying on QR codes globally.
            </p>
            <p>
              Today, QR codes are a standard part of marketing, logistics, and everyday life. They bridge the physical and digital worlds, letting printed materials link directly to web content. A QR code on a business card can save a contact to a phone. A code on a museum exhibit can play an audio guide. A code on a product package can show assembly instructions or warranty registration. The flexibility of QR codes — they can encode URLs, text, vCards, WiFi configs, and more — makes them the Swiss Army knife of physical-to-digital interfaces. For generating other types of machine-readable codes, the <Link href="/barcode-generator" className="text-blue-600 hover:underline dark:text-blue-400">Barcode Generator</Link> provides Code 128, EAN-13, and UPC-A formats for retail and logistics use cases.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Best Practices for QR Code Design and Placement
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The most important factor for QR code scanability is size. A QR code should be at least 2 x 2 cm (roughly 0.8 x 0.8 inches) for reliable smartphone scanning at typical distances (10-30 cm). For codes that will be scanned from farther away (posters, billboards), increase the size proportionally — a 1-meter-wide code on a poster can be scanned from 10+ meters away. Always maintain high contrast: black modules on a white background are the most reliable. Avoid placing QR codes on dark, patterned, or reflective backgrounds, and never use color combinations that reduce contrast (like light blue on white).
            </p>
            <p>
              Include a clear call-to-action near your QR code telling people what they will get when they scan it and how to scan it (e.g., &quot;Scan with your camera to view the menu&quot;). Leave a quiet zone (empty margin) of at least 4 modules around the code — this is essential for scanners to detect where the code begins and ends. Test your QR code with multiple devices and scanner apps before mass production. For encoding special data types or preparing metadata for QR code payloads, the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> can handle binary data that needs to be embedded in the encoded text.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Real-World Example: QR Codes in a Restaurant Digital Menu
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              A downtown bistro replaced its paper menus with QR codes printed on table tents. The marketing team generated a QR code encoding the URL <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">https://example-bistro.com/menu</code> using the QR Code Generator with Level M error correction and medium size. The code was printed at 3x3 cm on matte cardstock with a 4-module quiet zone. After deployment, the team discovered that dim restaurant lighting caused scan failures on dark wood tables. They reprinted on white cardstock, which resolved 95% of failures. They also added a WiFi QR code (format: WIFI:S:Bistro-Guest;T:WPA;P:welcome2024;;) printed on the back, which patrons used to connect to the guest network — 200 scans in the first week. The bistro later generated a vCard QR code for the manager&apos;s business card using the contact data format, saving customers from manually typing the restaurant&apos;s phone number and address.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Troubleshooting: When Your QR Code Won&apos;t Scan
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              If your QR code is not scanning reliably, check size first: the code should be at least 2x2 cm at normal viewing distance. For codes on posters or signs, increase proportionally — a code at 1 meter distance needs roughly 10x10 cm. Verify contrast: black modules on a white background provide the highest scan rate. Test with multiple devices (iPhone and Android) and multiple scanner apps. If scanning fails only on certain devices, check for reflection or glare on the surface. Ensure there is an adequate quiet zone — at least 4 modules of white space around all four sides of the code. If the QR code contains a URL, test that the URL is accessible and not broken. For very long URLs, the QR code becomes denser and harder to scan; use a URL shortener or increase the physical size of the code. If the code was printed on a curved surface (like a cup or bottle), increase error correction to Level H.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            References
          </h2>
          <div className="mt-8 space-y-2 text-zinc-600 dark:text-zinc-400">
            <p>ISO/IEC 18004 — QR Code Bar Code Symbology Specification (<a href="https://www.iso.org/standard/62021.html" className="text-blue-600 hover:underline dark:text-blue-400">iso.org/standard/62021.html</a>)</p>
            <p>JIS X 0510 — Two-dimensional symbol — QR Code — Basic specification (<a href="https://www.jisc.go.jp/eng/" className="text-blue-600 hover:underline dark:text-blue-400">jisc.go.jp/eng/</a>)</p>
            <p>Denso Wave — QR Code Standardization (<a href="https://www.qrcode.com/en/about/standards.html" className="text-blue-600 hover:underline dark:text-blue-400">qrcode.com/en/about/standards.html</a>)</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About QR Code Generation" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "BarChart3", title: "Barcode Generator", description: "Generate Code 128, EAN-13, and UPC-A barcodes for retail and logistics", href: "/barcode-generator" },
              { icon: "LockKeyhole", title: "Base64 Encoder", description: "Encode binary data for embedding in QR code payloads", href: "/base64-encoder" },
              { icon: "Link", title: "URL Encoder", description: "Percent-encode URLs to ensure QR code compatibility", href: "/url-encoder" },
              { icon: "Palette", title: "Color Converter", description: "Convert colors between HEX, RGB, and HSL for QR code design", href: "/color-converter" },
            ]}
            title="Related Image & Design Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="qr-code-generator" />
    </>
  );
}
