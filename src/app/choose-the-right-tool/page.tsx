"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Card, Badge, Button } from "@/components/ui";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Choose the Right Tool" },
];

interface ToolRecommendation {
  name: string;
  description: string;
  href: string;
  why: string;
}

interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    value: string;
    next?: string;
    recommendations?: ToolRecommendation[];
  }[];
}

const questions: Record<string, Question> = {
  "what-do": {
    id: "what-do",
    text: "What do you want to do?",
    options: [
      {
        label: "Check / Analyze something",
        value: "check",
        next: "what-check",
      },
      {
        label: "Transform / Convert something",
        value: "transform",
        next: "what-convert",
      },
      {
        label: "Generate / Render something",
        value: "generate",
        next: "what-generate",
      },
    ],
  },
  "what-check": {
    id: "what-check",
    text: "What do you want to check?",
    options: [
      {
        label: "Domain / Website",
        value: "domain",
        recommendations: [
          {
            name: "Domain Report Card",
            description: "Get a complete A–F report card for any domain covering DNS, SSL, headers, WHOIS, and status.",
            href: "/domain-report",
            why: "Best all-in-one domain health check with scoring.",
          },
          {
            name: "Website Status Checker",
            description: "Check if a website is online and get HTTP status code, response time, and server info.",
            href: "/website-status-checker",
            why: "Quick uptime and response status check.",
          },
          {
            name: "HTTP Headers Checker",
            description: "Inspect HTTP response headers, security policies, cache settings, and redirect chains.",
            href: "/http-headers-checker",
            why: "Deep-dive into security and caching headers.",
          },
          {
            name: "Broken Link Checker",
            description: "Test multiple URLs for broken links and identify dead pages on your site.",
            href: "/broken-link-checker",
            why: "Find and fix broken links across your site.",
          },
        ],
      },
      {
        label: "IP Address",
        value: "ip",
        recommendations: [
          {
            name: "IP Lookup",
            description: "Look up any IPv4 or IPv6 address — location, ISP, hostname, ASN, and interactive map.",
            href: "/ip-lookup",
            why: "Most detailed IP geolocation and network info.",
          },
          {
            name: "What Is My IP",
            description: "Find your public IP address instantly with location and browser information.",
            href: "/what-is-my-ip",
            why: "Quickest way to see your own public IP.",
          },
          {
            name: "Reverse DNS Lookup",
            description: "Find the hostname associated with an IP address using reverse DNS (PTR record).",
            href: "/reverse-dns-lookup",
            why: "Resolve IP back to hostname.",
          },
        ],
      },
      {
        label: "Email",
        value: "email",
        recommendations: [
          {
            name: "DNS Lookup",
            description: "Check MX records to verify email server configuration for any domain.",
            href: "/dns-lookup",
            why: "Essential for verifying email server (MX) records.",
          },
        ],
      },
      {
        label: "Security",
        value: "security",
        recommendations: [
          {
            name: "SSL Certificate Checker",
            description: "Check SSL/TLS certificate details — issuer, validity, SANs, and expiration.",
            href: "/ssl-certificate-checker",
            why: "Complete SSL certificate validation.",
          },
          {
            name: "HTTP Headers Checker",
            description: "Inspect security headers like HSTS, CSP, X-Frame-Options, and more.",
            href: "/http-headers-checker",
            why: "Audit your security header configuration.",
          },
          {
            name: "Port Checker",
            description: "Check if network ports are open on any host. Scan common ports for vulnerabilities.",
            href: "/port-checker",
            why: "Verify open ports and exposed services.",
          },
        ],
      },
      {
        label: "SEO",
        value: "seo",
        recommendations: [
          {
            name: "Domain Report Card",
            description: "Get a complete SEO health report including SSL, headers, and DNS configuration.",
            href: "/domain-report",
            why: "Comprehensive domain SEO audit in one report.",
          },
          {
            name: "Meta Tag Generator",
            description: "Generate HTML meta tags, OG tags, and Twitter cards for better search visibility.",
            href: "/meta-tag-generator",
            why: "Optimize your meta tags for search engines.",
          },
          {
            name: "Redirect Checker",
            description: "Trace URL redirect chains and verify proper 301/302 redirect implementation.",
            href: "/redirect-checker",
            why: "Ensure redirects are SEO-friendly.",
          },
          {
            name: "Canonical URL Generator",
            description: "Generate canonical tags to prevent duplicate content issues.",
            href: "/canonical-generator",
            why: "Prevent duplicate content penalties.",
          },
        ],
      },
    ],
  },
  "what-convert": {
    id: "what-convert",
    text: "What type of conversion?",
    options: [
      {
        label: "Images",
        value: "images",
        recommendations: [
          {
            name: "Image Converter",
            description: "Convert images between JPEG, PNG, WebP, GIF, BMP, and ICO formats.",
            href: "/image-converter",
            why: "Convert between any image format.",
          },
          {
            name: "Image Compressor",
            description: "Compress JPEG, PNG, and WebP images to reduce file size.",
            href: "/image-compressor",
            why: "Reduce image file sizes for web performance.",
          },
          {
            name: "Image Resizer",
            description: "Resize images to custom dimensions with aspect ratio control.",
            href: "/image-resizer",
            why: "Quick image dimension changes.",
          },
          {
            name: "Image to Base64",
            description: "Convert any image to a Base64 data URI string.",
            href: "/image-to-base64",
            why: "Embed images directly in code.",
          },
        ],
      },
      {
        label: "Text / Code",
        value: "text-code",
        recommendations: [
          {
            name: "JSON to CSV Converter",
            description: "Convert JSON data to CSV format and back.",
            href: "/json-to-csv",
            why: "Transform API data to spreadsheet format.",
          },
          {
            name: "YAML to JSON Converter",
            description: "Convert between YAML and JSON formats.",
            href: "/yaml-to-json",
            why: "Switch between config file formats.",
          },
          {
            name: "XML to JSON Converter",
            description: "Convert XML data to JSON format and back.",
            href: "/xml-to-json",
            why: "Transform legacy XML to modern JSON.",
          },
          {
            name: "Case Converter",
            description: "Convert text between camelCase, snake_case, kebab-case, and more.",
            href: "/case-converter",
            why: "Normalize naming conventions across projects.",
          },
        ],
      },
      {
        label: "Data formats",
        value: "data-formats",
        recommendations: [
          {
            name: "JSON Formatter",
            description: "Format, validate, and minify JSON data with syntax highlighting.",
            href: "/json-formatter",
            why: "Beautify or minify JSON data.",
          },
          {
            name: "SQL Formatter",
            description: "Format and beautify SQL queries for readability.",
            href: "/sql-formatter",
            why: "Make complex SQL queries readable.",
          },
          {
            name: "Timestamp Converter",
            description: "Convert between Unix timestamps and human-readable dates.",
            href: "/timestamp-converter",
            why: "Quick date-to-timestamp and vice versa.",
          },
          {
            name: "Color Converter",
            description: "Convert colors between HEX, RGB, and HSL formats with live preview.",
            href: "/color-converter",
            why: "Convert CSS color values between formats.",
          },
        ],
      },
      {
        label: "URLs",
        value: "urls",
        recommendations: [
          {
            name: "URL Encoder / Decoder",
            description: "Encode and decode URLs and query strings.",
            href: "/url-encoder",
            why: "Properly encode URLs for web use.",
          },
          {
            name: "URL Parser",
            description: "Parse any URL and view its components: protocol, hostname, path, query params.",
            href: "/url-parser",
            why: "Break down and analyze URL structures.",
          },
          {
            name: "Text to Slug Converter",
            description: "Convert text to a URL-friendly slug.",
            href: "/text-to-slug",
            why: "Generate SEO-friendly URL slugs.",
          },
        ],
      },
    ],
  },
  "what-generate": {
    id: "what-generate",
    text: "What do you want to generate?",
    options: [
      {
        label: "Code / Scripts",
        value: "code-scripts",
        recommendations: [
          {
            name: "Password Generator",
            description: "Generate strong, random passwords with customizable options.",
            href: "/password-generator",
            why: "Create secure passwords instantly.",
          },
          {
            name: "UUID Generator",
            description: "Generate RFC 4122 UUID v4 identifiers for database keys and test fixtures.",
            href: "/uuid-generator",
            why: "Generate unique identifiers for development.",
          },
          {
            name: "QR Code Generator",
            description: "Generate QR codes from any text or URL. Download as PNG.",
            href: "/qr-code-generator",
            why: "Create scannable QR codes for any link.",
          },
          {
            name: "Barcode Generator",
            description: "Generate Code 128, EAN-13, and UPC-A barcodes.",
            href: "/barcode-generator",
            why: "Generate barcodes for labels and packaging.",
          },
        ],
      },
      {
        label: "Content",
        value: "content",
        recommendations: [
          {
            name: "Lorem Ipsum Generator",
            description: "Generate placeholder text for mockups and design layouts.",
            href: "/lorem-ipsum-generator",
            why: "Quick placeholder text for designs.",
          },
          {
            name: "Excerpt Generator",
            description: "Generate text excerpts by word or character count.",
            href: "/excerpt-generator",
            why: "Create concise excerpts from long content.",
          },
          {
            name: "Meta Tag Generator",
            description: "Generate HTML meta tags, OG tags, and Twitter cards for SEO.",
            href: "/meta-tag-generator",
            why: "Generate SEO-friendly meta tags.",
          },
        ],
      },
      {
        label: "Visuals",
        value: "visuals",
        recommendations: [
          {
            name: "CSS Gradient Generator",
            description: "Create beautiful CSS gradients with a visual editor.",
            href: "/css-gradient-generator",
            why: "Design gradients visually and get the CSS.",
          },
          {
            name: "Schema Generator",
            description: "Generate JSON-LD schema markup for articles, products, FAQs, and more.",
            href: "/schema-generator",
            why: "Add structured data to web pages.",
          },
        ],
      },
    ],
  },
};

const TOTAL_STEPS = 2;

export default function ChooseTheRightToolPage() {
  const [currentQuestion, setCurrentQuestion] = useState("what-do");
  const [history, setHistory] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<ToolRecommendation[] | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const question = questions[currentQuestion];

  function handleSelect(option: typeof question.options[0]) {
    setSelectedLabels([...selectedLabels, option.label]);
    if (option.recommendations) {
      setRecommendations(option.recommendations);
    } else if (option.next) {
      setHistory([...history, currentQuestion]);
      setCurrentQuestion(option.next);
    }
  }

  function handleBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentQuestion(prev);
    setSelectedLabels(selectedLabels.slice(0, -1));
  }

  function handleReset() {
    setCurrentQuestion("what-do");
    setHistory([]);
    setRecommendations(null);
    setSelectedLabels([]);
  }

  const steps = history.length + 1;

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Choose the Right Tool — Find the Perfect Tool for Your Task | ${SITE_NAME}`, description: `Answer a few questions and get personalized tool recommendations from ${SITE_NAME}. Find the perfect online tool for checking, converting, or generating anything.`, url: `${SITE_URL}/choose-the-right-tool`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Choose the Right Tool
              </h1>
              <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                Find the perfect Nuvora tool for your task. Answer a couple of questions and we&apos;ll recommend the best fit.
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/choose-the-right-tool`} title="Choose the Right Tool — Find the Perfect Tool for Your Task" />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {!recommendations && (
            <>
              <div className="mb-8">
                <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
                  <span>Step {steps} of {TOTAL_STEPS}</span>
                  <span>{Math.round((steps / TOTAL_STEPS) * 100)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${(steps / TOTAL_STEPS) * 100}%` }}
                  />
                </div>
              </div>

              <Card variant="elevated" className="mb-6">
                <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {question.text}
                </h2>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-5 py-4 text-left text-sm font-medium text-zinc-800 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-blue-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </Card>

              {history.length > 0 && (
                <Button variant="ghost" onClick={handleBack}>
                  &larr; Back
                </Button>
              )}
            </>
          )}

          {recommendations && (
            <div>
              <div className="mb-6">
                <Badge variant="success">Recommendations ready</Badge>
                <h2 className="mt-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Based on your selections
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  You wanted to: {selectedLabels.join(" > ")}
                </p>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <Link key={rec.href} href={rec.href}>
                    <Card variant="interactive" className="group">
                      <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                        {rec.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {rec.description}
                      </p>
                      <p className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                        Why this tool: {rec.why}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="mt-8">
                <Button variant="secondary" onClick={handleReset}>
                  Start over
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
