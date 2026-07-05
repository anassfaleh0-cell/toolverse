export const SITE_NAME = "ToolVerse";
export const SITE_DESCRIPTION =
  "Free online network tools including IP lookup, WHOIS, DNS lookup, SSL checker, ping test, and more. Fast, accurate, and privacy-focused.";
export const SITE_URL = "https://toolverse.dev";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/resources", label: "Resources" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "What is ToolVerse?",
    answer:
      "ToolVerse is a curated directory of the best online tools for developers, designers, and creators. We handpick tools that boost productivity and simplify your workflow.",
  },
  {
    question: "Are the tools free to use?",
    answer:
      "Most tools listed on ToolVerse offer free tiers or are completely free. We clearly label pricing information so you can find what fits your budget.",
  },
  {
    question: "How are tools selected?",
    answer:
      "Our team evaluates tools based on usability, features, performance, and community feedback. We only list tools we believe provide genuine value.",
  },
  {
    question: "Can I suggest a tool?",
    answer:
      "Absolutely. Use our Contact page to submit a tool suggestion. We review every submission and add the best ones to the directory.",
  },
  {
    question: "Is there an API available?",
    answer:
      "Not yet, but we're working on a public API so you can integrate ToolVerse data into your own applications. Stay tuned.",
  },
] as const;

export const FOOTER_LINKS = [
  {
    heading: "Tools",
    links: [
      { href: "/tools", label: "All Tools" },
      { href: "/categories", label: "Categories" },
      { href: "/what-is-my-ip", label: "What Is My IP" },
      { href: "/ip-lookup", label: "IP Lookup" },
    ],
  },
  {
    heading: "Pages",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/about-our-research", label: "Our Research" },
      { href: "/how-we-test-tools", label: "How We Test" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/editorial-guidelines", label: "Editorial Guidelines" },
      { href: "/transparency", label: "Transparency" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/learn", label: "Learn" },
      { href: "/blog", label: "Blog" },
      { href: "/compare", label: "Comparisons" },
      { href: "/resources", label: "All Resources" },
      { href: "/sitemap", label: "HTML Sitemap" },
      { href: "/sitemap.xml", label: "XML Sitemap" },
      { href: "/feed.xml", label: "RSS Feed" },
    ],
  },
] as const;
