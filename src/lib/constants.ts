export const SITE_NAME = "Nuvora";
export const SITE_DESCRIPTION =
  "Free online tools for everyone — DNS lookup, PDF conversion, image editing, security checks, and developer utilities. No signup, no tracking, 100% browser-based.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://toolverse-omega.vercel.app";

export const HERO_TAGLINE = "Smart Tools, Simply Done";
export const HERO_SUBTITLE = "Free Online Tools — No Signup, No Tracking, Just Results";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/whats-new", label: "What's New" },
  { href: "/trending", label: "Trending" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/about-nuvora", label: "About" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "What is Nuvora?",
    answer:
      "Nuvora is a free online tool platform providing browser-based utilities for network diagnostics, PDF processing, image editing, and more. All tools run in your browser — nothing leaves your device.",
  },
  {
    question: "Are the tools really free?",
    answer:
      "Yes. All Nuvora tools are completely free to use with no hidden fees, no usage limits, and no signup required.",
  },
  {
    question: "Is my data private?",
    answer:
      "Absolutely. Every tool runs locally in your browser. Your files and data never leave your device. No servers, no uploads, no tracking.",
  },
  {
    question: "How is Nuvora different from other tool sites?",
    answer:
      "Nuvora combines powerful tools with AI-powered analysis, all while keeping your data completely private. No signup required, no limits.",
  },
  {
    question: "Can I suggest a new tool?",
    answer:
      "Absolutely. Use our Contact page to submit suggestions. We review every request and prioritize tools that benefit the most people.",
  },
  {
    question: "Is there an API or Pro plan?",
    answer:
      "Nuvora API and Nuvora Pro are coming soon. The API will provide programmatic access to all tools.",
  },
] as const;

export const FOOTER_LINKS = [
  {
    heading: "Nuvora",
    links: [
      { href: "/", label: "Home" },
      { href: "/about-nuvora", label: "About" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/changelog", label: "Changelog" },
      { href: "/contact", label: "Contact" },
      { href: "/open-source", label: "Open Source" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { href: "/tools", label: "All Tools" },
      { href: "/categories", label: "Categories" },
      { href: "/popular", label: "Popular Tools" },
      { href: "/new", label: "New Tools" },
      { href: "/what-is-my-ip", label: "What Is My IP" },
      { href: "/dns-lookup", label: "DNS Lookup" },
      { href: "/ssl-certificate-checker", label: "SSL Checker" },
      { href: "/password-generator", label: "Password Generator" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/learn", label: "Learn" },
      { href: "/blog", label: "Blog" },
      { href: "/compare", label: "Comparisons" },
      { href: "/glossary", label: "Glossary" },
      { href: "/sitemap", label: "Sitemap" },
      { href: "/ultimate-guides/dns", label: "DNS Guide" },
      { href: "/ultimate-guides/ssl-tls", label: "SSL Guide" },
    ],
  },
  {
    heading: "More",
    links: [
      { href: "/widgets", label: "Widgets" },
      { href: "/press", label: "Press Kit" },
      { href: "/link-to-us", label: "Link to Us" },
      { href: "/brand", label: "Brand Guidelines" },
      { href: "/pro", label: "Nuvora Pro" },
      { href: "/api", label: "Nuvora API" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about-nuvora", label: "About" },
      { href: "/our-mission", label: "Our Mission" },
      { href: "/security", label: "Security" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/authors", label: "Our Team" },
      { href: "/editorial-guidelines", label: "Editorial Guidelines" },
    ],
  },
] as const;