import type { Metadata } from "next";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { Icon } from "@/components/shared/icon";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `500+ Tool Expansion Roadmap â€” From 88 to 500 Tools`,
  description: "Comprehensive roadmap detailing Nuvora's planned expansion from 88 to 500+ tools across 21 categories including PDF, image, SEO, AI, network, security, developer, and more.",
  openGraph: {
    title: `500+ Tool Expansion Roadmap â€” From 88 to 500 Tools`,
    description: "Comprehensive roadmap detailing Nuvora's planned expansion from 88 to 500+ tools across 21 categories.",
  },
  twitter: {
    title: `500+ Tool Expansion Roadmap â€” From 88 to 500 Tools`,
    description: "Comprehensive roadmap detailing Nuvora's planned expansion from 88 to 500+ tools across 21 categories.",
  },
  alternates: { canonical: `${SITE_URL}/500-tool-roadmap` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "500+ Tool Expansion Roadmap" },
];

interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  current: number;
  planned: number;
  tools: string[];
}

const CATEGORIES: ToolCategory[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    icon: "FileText",
    current: 10,
    planned: 31,
    tools: [
      "Merge PDF", "Split PDF", "Compress PDF", "Convert PDF", "Edit PDF",
      "Rotate PDF", "Unlock PDF", "Protect PDF", "OCR PDF", "Extract PDF",
      "Fill PDF Forms", "Compare PDF", "Sign PDF", "Annotate PDF", "Optimize PDF",
      "Stamp PDF", "Watermark PDF", "Repair PDF", "Flatten PDF", "Encrypt PDF",
      "Decrypt PDF", "Combine PDF", "Extract Images from PDF", "Extract Text from PDF",
      "PDF Metadata Viewer", "PDF to HTML", "HTML to PDF", "PDF to Image",
      "Image to PDF", "PDF to Word", "Word to PDF",
    ],
  },
  {
    id: "image",
    name: "Image Tools",
    icon: "Image",
    current: 12,
    planned: 30,
    tools: [
      "Resize Image", "Crop Image", "Rotate Image", "Flip Image", "Compress Image",
      "Convert Image", "Add Text to Image", "Add Watermark", "Remove Background",
      "Blur Image", "Sharpen Image", "Adjust Brightness/Contrast", "Color Balance",
      "Grayscale Converter", "Sepia Filter", "Invert Colors", "Create Collage",
      "Create Meme", "Generate Placeholder", "Extract Image Metadata", "Create Favicon",
      "Create Thumbnail", "Remove Object", "Add Border", "Round Corners",
      "Flip Horizontally", "Flip Vertically", "Reduce Colors", "Dither Image",
      "Pixelate Image",
    ],
  },
  {
    id: "seo",
    name: "SEO Tools",
    icon: "Globe",
    current: 6,
    planned: 27,
    tools: [
      "Meta Tag Generator", "Sitemap Generator", "Robots.txt Generator",
      "Schema Generator", "Hreflang Generator", "Canonical URL Generator",
      "SERP Preview", "Keyword Density Checker", "Heading Structure Checker",
      "Broken Link Checker", "Redirect Checker", "Page Speed Simulator",
      "Mobile Friendliness Test", "Structured Data Validator", "Open Graph Checker",
      "Twitter Card Validator", "Rank Tracker", "Keyword Research Tool",
      "Backlink Checker", "Domain Authority Checker", "Content Analyzer",
      "Readability Checker", "Alt Text Analyzer", "Internal Link Analyzer",
      "External Link Checker", "Schema Markup Tester", "Page Score Evaluator",
    ],
  },
  {
    id: "ai",
    name: "AI Tools",
    icon: "Bot",
    current: 0,
    planned: 22,
    tools: [
      "AI Text Summarizer", "AI Grammar Checker", "AI Rewriter", "AI Translator",
      "AI Code Generator", "AI Image Generator", "AI Content Generator",
      "AI Keyword Extractor", "AI Sentiment Analyzer", "AI Tag Suggester",
      "AI Meta Description Writer", "AI Title Generator", "AI Email Writer",
      "AI Blog Outline Generator", "AI SQL Query Generator", "AI Regex Generator",
      "AI Data Extractor", "AI Classifier", "AI Chatbot", "AI Voice to Text",
      "AI Image Captioner", "AI Color Palette Generator",
    ],
  },
  {
    id: "network",
    name: "Network Tools",
    icon: "Satellite",
    current: 8,
    planned: 30,
    tools: [
      "DNS Lookup", "Reverse DNS Lookup", "DNS Propagation Check", "WHOIS Lookup",
      "IP Lookup", "Ping Test", "Port Scanner", "Traceroute", "Subnet Calculator",
      "Bandwidth Test", "Latency Monitor", "Packet Loss Test", "HTTP Headers Check",
      "SSL Certificate Check", "MTR Report", "BGP Lookup", "ASN Lookup",
      "Network Speed Test", "WiFi Analyzer", "MAC Address Lookup", "DHCP Test",
      "SMTP Test", "IMAP Test", "POP3 Test", "Network Discovery Tool",
      "SNMP Browser", "DNS Benchmark", "Resolver Test", "DNSSEC Analyzer",
      "CDN Detector",
    ],
  },
  {
    id: "security",
    name: "Security Tools",
    icon: "Shield",
    current: 3,
    planned: 26,
    tools: [
      "Password Generator", "Password Strength Tester", "Hash Generator",
      "Hash Lookup", "SSL/TLS Checker", "Port Scanner", "CORS Checker",
      "CSP Evaluator", "XSS Scanner", "SQL Injection Tester", "CSRF Tester",
      "Security Headers Audit", "Email Breach Checker", "Data Leak Checker",
      "2FA Generator", "Encryption Tool", "Decryption Tool", "Certificate Decoder",
      "JWT Inspector", "API Key Checker", "Malware URL Scanner",
      "Phishing URL Detector", "IP Reputation Checker", "Domain Blacklist Check",
      "File Hash Verifier", "GPG Key Tool",
    ],
  },
  {
    id: "developer",
    name: "Developer Tools",
    icon: "Monitor",
    current: 14,
    planned: 30,
    tools: [
      "JSON Formatter", "JSON Validator", "JSON to CSV", "YAML to JSON",
      "XML to JSON", "HTML Minifier", "CSS Minifier", "JS Minifier",
      "CSS Beautifier", "JS Beautifier", "HTML Beautifier", "SQL Formatter",
      "Code Diff Checker", "Regex Tester", "Markdown Editor", "Color Picker",
      "Gradient Generator", "Shadow Generator", "Border Radius Generator",
      "Font Pair Suggester", "Icon Finder", "SVG Editor", "SVG to JSX",
      "JSX to SVG", "Base64 Encoder/Decoder", "URL Encoder/Decoder",
      "HTML Entity Encoder", "JWT Decoder", "UUID Generator", "Cron Expression Builder",
    ],
  },
  {
    id: "text",
    name: "Text Tools",
    icon: "FileText",
    current: 5,
    planned: 26,
    tools: [
      "Word Counter", "Character Counter", "Line Counter", "Paragraph Counter",
      "Sentence Counter", "Text Diff Checker", "Text Cleaner", "Text Case Converter",
      "Text Reverser", "Text Sorter", "Text Splitter", "Text Joiner",
      "Text Find and Replace", "Remove Duplicates", "Remove Empty Lines",
      "Add Line Numbers", "Justify Text", "Wrap Text", "Extract URLs",
      "Extract Emails", "Extract Numbers", "Extract Phone Numbers", "Slug Generator",
      "Lorem Ipsum Generator", "Random Text Generator", "ASCII Art Generator",
    ],
  },
  {
    id: "data",
    name: "Data Tools",
    icon: "BarChart3",
    current: 3,
    planned: 24,
    tools: [
      "CSV Viewer", "CSV Editor", "CSV to JSON", "JSON to CSV", "XML to JSON",
      "JSON to XML", "YAML to JSON", "JSON to YAML", "Data Generator",
      "Mock Data Creator", "Data Validator", "Data Sorter", "Data Filter",
      "Data Aggregator", "Pivot Table Generator", "Chart Generator",
      "Table Generator", "CSV to HTML Table", "HTML Table to CSV", "Excel to CSV",
      "CSV to Excel", "SQL to CSV", "CSV to SQL", "JSON to Excel", "Excel to JSON",
    ],
  },
  {
    id: "calculator",
    name: "Calculator Tools",
    icon: "Hash",
    current: 0,
    planned: 25,
    tools: [
      "Basic Calculator", "Scientific Calculator", "Percentage Calculator",
      "BMI Calculator", "Age Calculator", "Date Calculator", "Time Calculator",
      "Tip Calculator", "Loan Calculator", "Mortgage Calculator", "ROI Calculator",
      "Discount Calculator", "Tax Calculator", "Currency Converter",
      "Unit Converter", "Length Converter", "Weight Converter",
      "Temperature Converter", "Area Converter", "Volume Converter",
      "Speed Converter", "Time Converter", "Data Size Converter",
      "Fuel Efficiency Converter", "Cooking Converter",
    ],
  },
  {
    id: "unit-converters",
    name: "Unit Converters",
    icon: "Ruler",
    current: 0,
    planned: 25,
    tools: [
      "Length Converter", "Weight Converter", "Temperature Converter",
      "Area Converter", "Volume Converter", "Speed Converter", "Time Converter",
      "Data Storage Converter", "Fuel Consumption Converter", "Pressure Converter",
      "Energy Converter", "Power Converter", "Force Converter", "Angle Converter",
      "Frequency Converter", "Torque Converter", "Viscosity Converter",
      "Density Converter", "Luminance Converter", "Radiation Converter",
      "Electric Current Converter", "Voltage Converter", "Resistance Converter",
      "Capacitance Converter", "Inductance Converter",
    ],
  },
  {
    id: "finance",
    name: "Finance Tools",
    icon: "DollarSign",
    current: 0,
    planned: 22,
    tools: [
      "Compound Interest Calculator", "Simple Interest Calculator",
      "Loan Calculator", "Mortgage Calculator", "ROI Calculator", "IRR Calculator",
      "NPV Calculator", "401k Calculator", "Retirement Calculator",
      "Budget Calculator", "Bill Splitter", "Tip Calculator", "Currency Converter",
      "Crypto Converter", "Stock Calculator", "Salary Calculator",
      "Hourly Wage Calculator", "Tax Estimator", "VAT Calculator",
      "Sales Tax Calculator", "Profit Margin Calculator", "Break-Even Calculator",
      "Inflation Calculator",
    ],
  },
  {
    id: "marketing",
    name: "Marketing Tools",
    icon: "Megaphone",
    current: 0,
    planned: 15,
    tools: [
      "Keyword Density Checker", "Readability Analyzer", "Headline Analyzer",
      "Email Subject Line Tester", "Social Media Post Scheduler",
      "Content Calendar Generator", "Landing Page Analyzer",
      "Conversion Rate Calculator", "CPC Calculator", "ROAS Calculator",
      "Customer Lifetime Value Calculator", "Churn Rate Calculator",
      "Email Deliverability Test", "Spam Score Checker",
      "A/B Test Significance Calculator",
    ],
  },
  {
    id: "social-media",
    name: "Social Media Tools",
    icon: "Smartphone",
    current: 0,
    planned: 18,
    tools: [
      "Hashtag Generator", "Hashtag Analyzer", "Best Posting Time Calculator",
      "Social Media Image Resizer", "Profile Picture Maker", "Cover Photo Maker",
      "Post Preview Generator", "Bio Generator", "Caption Generator",
      "Twitter Card Validator", "Facebook OG Checker", "LinkedIn Post Analyzer",
      "Instagram Hashtag Suggester", "TikTok Trend Analyzer",
      "YouTube Tag Generator", "Social Media Analytics",
      "Engagement Rate Calculator", "Follower Growth Tracker",
    ],
  },
  {
    id: "browser",
    name: "Browser Tools",
    icon: "Globe",
    current: 1,
    planned: 20,
    tools: [
      "User Agent Parser", "Cookie Viewer", "LocalStorage Viewer",
      "SessionStorage Viewer", "Cache Viewer", "Console Logger",
      "Network Request Viewer", "Page Inspector", "DOM Inspector", "CSS Viewer",
      "Font Detector", "Screen Resolution Checker", "Color Picker Extension",
      "Bookmark Organizer", "Tab Manager", "History Analyzer", "Download Manager",
      "Session Manager", "Form Filler", "Auto Refresh",
    ],
  },
  {
    id: "encoding",
    name: "Encoding Tools",
    icon: "TextIcon",
    current: 2,
    planned: 22,
    tools: [
      "Base64 Encoder/Decoder", "URL Encoder/Decoder",
      "HTML Entity Encoder/Decoder", "Unicode Escape/Unescape",
      "Hex Encoder/Decoder", "Binary Encoder/Decoder", "Octal Encoder/Decoder",
      "ROT13 Cipher", "ROT47 Cipher", "Caesar Cipher", "Atbash Cipher",
      "VigenÃ¨re Cipher", "Morse Code Encoder/Decoder", "Binary to Text",
      "Text to Binary", "Decimal to Hex", "Hex to Decimal", "Base32 Encoder",
      "Base85 Encoder", "Quoted-Printable Encoder", "Percent Encoding",
      "ASCII to Binary Converter",
    ],
  },
  {
    id: "cryptography",
    name: "Cryptography Tools",
    icon: "LockKeyhole",
    current: 1,
    planned: 21,
    tools: [
      "MD5 Hash Generator", "SHA-1 Generator", "SHA-256 Generator",
      "SHA-512 Generator", "HMAC Generator", "Bcrypt Generator",
      "Argon2 Generator", "PBKDF2 Generator", "AES Encrypt/Decrypt",
      "DES Encrypt/Decrypt", "RSA Key Generator", "SSL Certificate Decoder",
      "PGP Key Generator", "CSRF Token Generator", "Random Token Generator",
      "API Key Generator", "One-Time Password Generator", "TOTP Generator",
      "HOTP Generator", "Entropy Calculator", "Key Derivation Tool",
    ],
  },
  {
    id: "domain",
    name: "Domain Tools",
    icon: "Globe",
    current: 7,
    planned: 23,
    tools: [
      "WHOIS Lookup", "Domain Age Checker", "Domain Expiry Checker",
      "Domain Registrar Checker", "DNS Lookup", "Reverse DNS Lookup",
      "DNS Propagation Checker", "DNSSEC Analyzer", "Domain Availability Checker",
      "Domain Suggestion Generator", "Expired Domain Finder",
      "Domain Appraisal Tool", "Domain Comparison Tool", "Subdomain Finder",
      "Domain Reputation Checker", "Domain History Checker", "Name Server Lookup",
      "MX Record Lookup", "SPF Record Checker", "DKIM Checker", "DMARC Checker",
      "Domain Blacklist Check", "TLD List Explorer",
    ],
  },
  {
    id: "email",
    name: "Email Tools",
    icon: "Mail",
    current: 0,
    planned: 21,
    tools: [
      "Email Validator", "Email Verifier", "Disposable Email Checker",
      "Email Extractor", "Email Finder", "Email Template Builder",
      "Subject Line Tester", "Spam Score Checker", "SMTP Tester", "MX Lookup",
      "SPF Checker", "DKIM Generator", "DMARC Generator", "Email Header Analyzer",
      "Bounce Checker", "Email List Cleaner", "Bulk Email Validator",
      "Catch-All Email Tester", "Role-Based Email Detector",
      "Email Alias Generator", "Temporary Email Generator",
    ],
  },
  {
    id: "video",
    name: "Video Tools",
    icon: "Film",
    current: 0,
    planned: 26,
    tools: [
      "Video Compressor", "Video Converter", "Video Resizer", "Video Trimmer",
      "Video Merger", "Video Splitter", "Video to GIF", "GIF to Video",
      "Video to Audio", "Audio to Video", "Video Extractor",
      "Video Metadata Viewer", "Thumbnail Extractor", "Frame Extractor",
      "Slow Motion Generator", "Timelapse Generator", "Video Stabilizer",
      "Video Cropper", "Video Rotator", "Video Reverser", "Speed Changer",
      "Subtitle Extractor", "Subtitle Adder", "Watermark Adder", "Intro Maker",
      "Outro Maker",
    ],
  },
  {
    id: "audio",
    name: "Audio Tools",
    icon: "Music",
    current: 0,
    planned: 25,
    tools: [
      "Audio Converter", "Audio Compressor", "Audio Trimmer", "Audio Merger",
      "Audio Splitter", "Audio Recorder", "Audio to Text", "Text to Speech",
      "Voice Changer", "Noise Reducer", "Audio Normalizer", "Audio Equalizer",
      "Pitch Shifter", "Tempo Changer", "Audio Reverser", "Audio Extractor",
      "Metadata Editor", "Tag Editor", "Podcast Editor", "Ringtone Maker",
      "Beat Maker", "Metronome", "Tuner", "Frequency Analyzer",
      "Spectrogram Generator",
    ],
  },
];

function CategorySection({ category }: { category: ToolCategory }) {
  const totalTools = category.tools.length;
  const gap = category.planned - category.current;

  return (
    <details className="group rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
        <div className="flex items-center gap-3 min-w-0">
          <Icon name={category.icon} className="size-6 text-nuvora-600 dark:text-nuvora-400" />
          <div className="min-w-0">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {category.name}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {category.current} current &middot; {totalTools} total planned &middot; {gap} new
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline text-xs text-zinc-600 group-open:text-blue-600 dark:group-open:text-blue-700 transition-colors">
            {category.current}/{totalTools}
          </span>
          <svg
            className="size-4 shrink-0 text-zinc-600 transition-transform group-open:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </summary>
      <div className="border-t border-zinc-200 dark:border-zinc-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-5 py-2.5 font-semibold text-zinc-600 dark:text-zinc-400 w-12">#</th>
                <th className="px-5 py-2.5 font-semibold text-zinc-600 dark:text-zinc-400">Planned Tool</th>
                <th className="px-5 py-2.5 font-semibold text-zinc-600 dark:text-zinc-400 w-20 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {category.tools.map((tool, i) => (
                <tr key={tool} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                  <td className="px-5 py-2 text-xs text-zinc-600 tabular-nums">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-5 py-2 text-sm text-zinc-900 dark:text-zinc-100">{tool}</td>
                  <td className="px-5 py-2 text-right">
                    {i < category.current ? (
                      <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                        Live
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Planned
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tabular-nums">
        {current} / {total} ({pct}%)
      </span>
    </div>
  );
}

export default function FiveHundredToolRoadmapPage() {
  const totalCurrent = CATEGORIES.reduce((s, c) => s + c.current, 0);
  const totalPlanned = CATEGORIES.reduce((s, c) => s + c.tools.length, 0);

  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: `500+ Tool Expansion Roadmap â€” From 88 to 500 Tools | ${SITE_NAME}`,
          description:
            "Comprehensive roadmap detailing Nuvora's planned expansion from 88 to 500+ tools across 21 categories.",
          url: `${SITE_URL}/500-tool-roadmap`,
          breadcrumbs,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Breadcrumbs items={breadcrumbs} />
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                500+ Tool Expansion Roadmap
              </h1>
              <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                From {totalCurrent} to {totalPlanned}+ tools across 21 categories &mdash; our complete build plan.
              </p>
            </div>
            <SocialShare
              url={`${SITE_URL}/500-tool-roadmap`}
              title={`500+ Tool Expansion Roadmap â€” From 88 to 500 Tools`}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Overall Progress</h2>
          <div className="mt-3">
            <ProgressBar current={totalCurrent} total={totalPlanned} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalPlanned}+</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Planned</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{totalCurrent}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Currently Live</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalPlanned - totalCurrent}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">In Development</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">21</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Categories</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {CATEGORIES.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Summary</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="py-2 pr-4 font-semibold text-zinc-700 dark:text-zinc-300">Category</th>
                  <th className="py-2 pr-4 font-semibold text-zinc-700 dark:text-zinc-300 text-right">Current</th>
                  <th className="py-2 pr-4 font-semibold text-zinc-700 dark:text-zinc-300 text-right">Planned</th>
                  <th className="py-2 font-semibold text-zinc-700 dark:text-zinc-300 text-right">New</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {CATEGORIES.map((cat) => (
                  <tr key={cat.id}>
                    <td className="py-2 pr-4 text-zinc-900 dark:text-zinc-100">{cat.name}</td>
                    <td className="py-2 pr-4 text-right text-zinc-600 tabular-nums">{cat.current}</td>
                    <td className="py-2 pr-4 text-right text-zinc-600 tabular-nums">{cat.tools.length}</td>
                    <td className="py-2 text-right text-blue-600 dark:text-blue-400 tabular-nums">{cat.tools.length - cat.current}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-zinc-300 dark:border-zinc-600 font-semibold">
                  <td className="py-2 pr-4 text-zinc-900 dark:text-zinc-100">Total</td>
                  <td className="py-2 pr-4 text-right text-zinc-900 dark:text-zinc-100 tabular-nums">{totalCurrent}</td>
                  <td className="py-2 pr-4 text-right text-zinc-900 dark:text-zinc-100 tabular-nums">{totalPlanned}</td>
                  <td className="py-2 text-right text-blue-600 dark:text-blue-400 tabular-nums">{totalPlanned - totalCurrent}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
