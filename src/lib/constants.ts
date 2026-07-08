export const SITE_NAME = "ToolVerse";
export const SITE_DESCRIPTION =
  "Free online network tools including IP lookup, WHOIS, DNS lookup, SSL checker, ping test, and more. Fast, accurate, and privacy-focused.";
export const SITE_URL = "https://toolverse.dev";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/whats-new", label: "What's New" },
  { href: "/trending", label: "Trending" },
  { href: "/editor-picks", label: "Editor's Picks" },
  { href: "/best-online/best-free-online-tools", label: "Best Tools" },
  { href: "/guides", label: "Guides" },
  { href: "/glossary", label: "Glossary" },
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
      { href: "/roadmap", label: "Roadmap" },
      { href: "/100m-roadmap", label: "100M Plan" },
      { href: "/open-source", label: "Open Source" },
      { href: "/research", label: "Research" },
      { href: "/changelog", label: "Changelog" },
      { href: "/contact", label: "Contact" },
      { href: "/authors", label: "Our Team" },
      { href: "/methodology", label: "Methodology" },
      { href: "/privacy-controls", label: "Privacy Controls" },
    ],
  },
  {
    heading: "Community",
    links: [
      { href: "/community-templates", label: "Templates" },
      { href: "/choose-the-right-tool", label: "Tool Finder" },
      { href: "/bookmarks", label: "Bookmarks" },
      { href: "/collections", label: "Collections" },
      { href: "/decision-trees/dns-troubleshooting", label: "DNS Decision Tree" },
      { href: "/decision-trees/ssl-troubleshooting", label: "SSL Decision Tree" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/learning-paths/dns-fundamentals", label: "Learning Path" },
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
      { href: "/compare/dns-providers", label: "DNS Providers" },
      { href: "/compare/ssl-certificate-types", label: "SSL Cert Types" },
      { href: "/technical-flow/dns-resolution", label: "DNS Flow" },
      { href: "/technical-flow/ssl-tls-handshake", label: "TLS Handshake" },
      { href: "/ultimate-guides/dns", label: "DNS Guide" },
      { href: "/ultimate-guides/ssl-tls", label: "SSL Guide" },
      { href: "/ultimate-guides/http", label: "HTTP Guide" },
      { href: "/ultimate-guides/json", label: "JSON Guide" },
      { href: "/ultimate-guides/networking", label: "Networking Guide" },
      { href: "/ultimate-guides/seo", label: "SEO Guide" },
      { href: "/best-online/best-free-online-tools", label: "Best Free Tools" },
      { href: "/best-online/best-dns-tools", label: "Best DNS Tools" },
      { href: "/best-online/best-seo-tools", label: "Best SEO Tools" },
      { href: "/best-online/best-developer-tools", label: "Best Dev Tools" },
      { href: "/resources", label: "All Resources" },
      { href: "/sitemap", label: "HTML Sitemap" },
      { href: "/sitemap.xml", label: "XML Sitemap" },
      { href: "/feed.xml", label: "RSS Feed" },
    ],
  },
  {
    heading: "References",
    links: [
      { href: "/http-status-codes", label: "HTTP Status Codes" },
      { href: "/dns-record-types", label: "DNS Record Types" },
      { href: "/port-numbers", label: "Port Numbers" },
      { href: "/tls-versions", label: "TLS/SSL Versions" },
      { href: "/hash-algorithms", label: "Hash Algorithms" },
      { href: "/color-names", label: "CSS Color Names" },
      { href: "/html-entities", label: "HTML Entities" },
      { href: "/mime-types", label: "MIME Types" },
      { href: "/http-headers", label: "HTTP Headers" },
      { href: "/regex-patterns", label: "Regex Patterns" },
      { href: "/user-agents", label: "User Agent DB" },
      { href: "/cheat-sheets/developer-dns", label: "DNS Cheat Sheet" },
      { href: "/cheat-sheets/developer-ssl-tls", label: "SSL/TLS Cheat Sheet" },
      { href: "/troubleshooting/dns-propagation", label: "DNS Troubleshooter" },
      { href: "/troubleshooting/ssl-certificate", label: "SSL Troubleshooter" },
      { href: "/protocols/http-versus-https", label: "HTTP vs HTTPS" },
      { href: "/glossary", label: "Tech Glossary" },
      { href: "/benchmarks/dns-performance", label: "DNS Benchmarks" },
      { href: "/500-tool-roadmap", label: "500 Tool Plan" },
    ],
  },
] as const;
