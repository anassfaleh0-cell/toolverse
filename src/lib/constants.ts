export const SITE_NAME = "Nuvora";
export const SITE_DESCRIPTION =
  "Nuvora is an intelligent digital workspace with powerful AI-powered tools for network diagnostics, security analysis, PDF processing, image editing, and developer utilities — all free, all in your browser.";
export const SITE_URL = "https://toolverse.dev";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/nuvora-ai", label: "Nuvora AI" },
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
      "Nuvora is an intelligent digital workspace that provides powerful AI-powered tools and utilities for everyone. From DNS lookups to PDF conversion, every tool runs entirely in your browser.",
  },
  {
    question: "Are the tools really free?",
    answer:
      "Yes. All Nuvora tools are completely free to use with no hidden fees, no usage limits, and no signup required. Our Pro plan adds advanced features for power users.",
  },
  {
    question: "How is Nuvora different from other tool sites?",
    answer:
      "Nuvora combines AI-powered result analysis, browser-local privacy (no data leaves your device), and a unified workspace experience. Every tool is designed with the same premium attention to detail.",
  },
  {
    question: "Does Nuvora use AI?",
    answer:
      "Yes. Nuvora AI analyzes your results to provide intelligent explanations, detect issues, and suggest next steps — all processed locally in your browser.",
  },
  {
    question: "Can I suggest a new tool?",
    answer:
      "Absolutely. Use our Contact page to submit suggestions. We review every request and prioritize tools that benefit the most people.",
  },
  {
    question: "Is there an API or Pro plan?",
    answer:
      "Nuvora API and Nuvora Pro are coming soon. The API will provide programmatic access to all tools, and Pro will add team workspaces, priority support, and advanced features.",
  },
] as const;

export const FOOTER_LINKS = [
  {
    heading: "Nuvora",
    links: [
      { href: "/", label: "Home" },
      { href: "/about-nuvora", label: "About Nuvora" },
      { href: "/nuvora-ai", label: "Nuvora AI" },
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
      { href: "/what-is-my-ip", label: "What Is My IP" },
      { href: "/dns-lookup", label: "DNS Lookup" },
      { href: "/ssl-certificate-checker", label: "SSL Checker" },
      { href: "/password-generator", label: "Password Generator" },
      { href: "/pdf-to-word", label: "PDF to Word" },
      { href: "/background-remover", label: "Background Remover" },
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
      { href: "/ultimate-guides/dns", label: "DNS Guide" },
      { href: "/ultimate-guides/ssl-tls", label: "SSL Guide" },
      { href: "/ultimate-guides/http", label: "HTTP Guide" },
    ],
  },
  {
    heading: "Products",
    links: [
      { href: "/nuvora-ai", label: "Nuvora AI" },
      { href: "/nuvora-pro", label: "Nuvora Pro" },
      { href: "/nuvora-api", label: "Nuvora API" },
      { href: "/nuvora-extension", label: "Nuvora Extension" },
      { href: "/nuvora-mobile", label: "Nuvora Mobile" },
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
