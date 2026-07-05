import type { Metadata } from "next";
import { UserAgentParser } from "@/components/user-agent-parser/user-agent-parser";
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

const slug = "user-agent-parser";
const pageTitle = "User Agent Parser - Analyze Browser, Device & OS Online";
const pageDescription =
  "Parse any user agent string to identify browser, device, operating system, and engine. Detect bots, crawlers, and legacy user agents. Free UA parser tool.";

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
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "User Agent Parser" },
];

const faqItems: FaqItem[] = [
  {
    question: "What are the main parts of a user agent string?",
    answer:
      "The UA string typically contains product tokens, version numbers, platform identifiers (Windows NT 10.0), device model identifiers (iPhone13,2), layout engine (AppleWebKit), and browser rendering tokens (like Safari/605.1.15). Each segment identifies a layer of the technology stack.",
  },
  {
    question: "Why do some websites see different user agents than my browser?",
    answer:
      "Browser extensions, privacy tools, and enterprise proxies often modify or truncate the UA string. VPN services may inject identifying tokens. Privacy-focused browsers like Brave may send a generic Chrome UA to reduce fingerprinting surface area.",
  },
  {
    question: "How do user agents help with bot detection?",
    answer:
      "Legitimate crawlers identify themselves: Googlebot, Bingbot, and DuckDuckBot send well-documented UA strings. Suspicious traffic often uses fake or outdated UA strings. A sudden influx of requests with identical ancient UA strings is a red flag.",
  },
  {
    question: "What is user agent spoofing and why does it happen?",
    answer:
      "Spoofing means a client sends a UA string different from its actual software. Website owners use it for testing, privacy tools do it to reduce tracking, and attackers do it to evade detection. Server-side spoofing detection requires analyzing JavaScript rendering and network behavior.",
  },
  {
    question: "Can two different browsers have the same user agent string?",
    answer:
      "Yes. Chromium-based browsers (Chrome, Edge, Brave, Opera) share the same engine and platform tokens. Server-side identification of the exact browser requires checking for specific JavaScript object properties after the page loads.",
  },
  {
    question: "Does the user agent change between HTTP and HTTPS requests?",
    answer:
      "The UA string is part of the HTTP request headers and is consistent regardless of scheme. However, privacy-preserving proxies like Cloudflare may strip or anonymize the UA before forwarding the request to the origin server.",
  },
  {
    question: "How reliable is device detection from user agents?",
    answer:
      "Reasonably reliable for mobile vs desktop classification. Specific model detection is less reliable because device identifiers appear inconsistently across manufacturers. Samsung and Apple models are well-mapped; smaller OEMs often present generic UA tokens.",
  },
  {
    question: "What is the oldest user agent still seen in production logs?",
    answer:
      "Internet Explorer 6 (Mozilla/4.0...MSIE 6.0) still appears in 2025 logs from unmaintained corporate kiosks and embedded systems. Any application that blocks based on UA version alone risks denying service to legitimate legacy systems.",
  },
  {
    question: "Do user agents work on mobile apps?",
    answer:
      "Native mobile apps send their own UA strings, typically incorporating the app name, SDK version, and OS identifier. App-based UAs are less standardized than browser UAs, often requiring custom parsing rules for accurate identification.",
  },
  {
    question: "Why do my analytics show (not set) for user agent?",
    answer:
      "Server-side analytics may log (not set) when the request sends an empty, malformed, or excessively long UA string. Some proxies also strip the User-Agent header for privacy. Client-side JavaScript analytics bypass this by detecting the browser directly.",
  },
  {
    question: "How does user agent parsing relate to browser fingerprinting?",
    answer:
      "UA is one data point in a browser fingerprint alongside screen resolution, installed fonts, timezone, and WebGL renderer. Individually, it is not identifying, but combined with other signals, it contributes to persistent user tracking without cookies.",
  },
  {
    question: "Should I block user agents that look like bots?",
    answer:
      "Blocking aggressive crawlers and scrapers based on UA alone is an incomplete strategy. Legitimate bots change their UAs, and attackers send fake Googlebot strings. Combine UA blocking with rate limiting, IP reputation checks, and behavioral analysis.",
  },
];

export default function UserAgentPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout>
          <ToolHero
            title="User Agent Parser"
            description="Parse any user agent string to identify browser, device, operating system, and engine. Includes auto-detection of your current browser's UA."
            breadcrumbs={breadcrumbs}
          >
            <UserAgentParser />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            How User Agents Help You Analyze Traffic
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Every HTTP request sent by a browser or API client includes a User-Agent header that identifies the software making the request. This string reveals the browser name, version, rendering engine, operating system, and device model. For web analytics, UA data powers the breakdowns of your visitor demographics by browser and platform. For security teams, UA analysis is a first-pass filter for bot traffic. Legitimate bots have predictable UA strings; malicious traffic often uses outdated or spoofed ones.
            </p>
            <p>
              This parser decodes any User-Agent string into structured components: browser family and version, engine (Blink, WebKit, Gecko, Trident), operating system, device category, and CPU architecture. Use the <Link href="/user-agent-parser" className="text-blue-600 hover:underline dark:text-blue-400">User Agent Parser</Link> to analyze strings from your web server access logs, to debug client-side issues where a feature works on some browsers but not others, or to validate that your analytics pipeline correctly identifies modern browsers. For more server infrastructure diagnostics, combine this with the <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">HTTP Headers Checker</Link> to see the full request headers your server receives.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Parsing UA Strings for Bot Traffic Analysis
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Web server logs contain thousands of UA strings per hour. A parser simplifies classifying this traffic by known crawler identifiers. Googlebot sends Mozilla/5.0...Googlebot/2.1; Bingbot sends similar with bingbot/2.0. When you encounter UA strings that claim to be Googlebot but originate from an IP range outside Google&apos;s published list, you can flag them for deeper investigation. This parser does not validate IP ownership, but it tells you exactly what the connecting client claims to be, down to the engine version.
            </p>
            <p>
              For a complete picture of your traffic health, use the <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> to verify your server is reachable first. Then parse the UAs from your access logs here to understand the device mix accessing your content. The <Link href="/user-agent-parser" className="text-blue-600 hover:underline dark:text-blue-400">User Agent Parser</Link> tool itself works entirely in the browser with ua-parser-js, so no UA data is sent to our server.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common User Agent Misconceptions
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Many developers assume the User-Agent header is always present and trustworthy. It is neither. Privacy extensions, corporate proxies, and some mobile browsers strip or modify it. Another misconception is that blocking desktop UAs will redirect mobile users to a separate site — many modern phones send desktop-equivalent UAs for compatibility. The UA string also is not a reliable indicator of JavaScript support. Some legacy browsers send modern-looking UAs while lacking critical Web APIs.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Use User Agent Parsing
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Parse user agents when investigating analytics anomalies: sudden traffic from a browser version that is decades old indicates bot traffic. Use it when debugging a CSS or JavaScript feature that works on some devices but not others — the UA string tells you which rendering engine and version is handling your code. Security engineers parse UAs during incident response to identify the command-line tools (curl, wget, python-requests) driving an attack campaign. Developers also use it to create browser-specific feature flags or polyfill strategies.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="User Agent Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔍", title: "HTTP Headers Checker", description: "Inspect all HTTP request and response headers", href: "/http-headers-checker" },
              { icon: "🔍", title: "What Is My IP", description: "Check your public IP address and browser info", href: "/what-is-my-ip" },
              { icon: "🔍", title: "Website Status Checker", description: "Check if a website is online and measure response time", href: "/website-status-checker" },
              { icon: "🔍", title: "IP Lookup", description: "Trace any IP address location and ISP details", href: "/ip-lookup" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="user-agent-parser" />
    </>
  );
}
