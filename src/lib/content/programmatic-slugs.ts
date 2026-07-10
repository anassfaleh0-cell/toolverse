import { getAllTools, getCategories } from "@/lib/registry";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const FORMATS = [
  "pdf", "word", "excel", "ppt", "jpg", "png", "webp", "svg", "gif", "bmp",
  "tiff", "heic", "json", "csv", "xml", "yaml", "toml", "html", "markdown",
  "txt", "rtf", "base64", "hex", "binary", "mp3", "mp4", "wav", "flac", "ogg",
  "epub", "mobi", "zip", "gzip", "tar", "css", "scss", "less", "js", "ts",
  "sql", "ics", "vcf", "iso", "dmg",
];

const GLOSSARY_TERMS = [
  "api", "algorithm", "array", "async-await", "attribute", "bandwidth", "base64",
  "big-o-notation", "bit", "blockchain", "boolean", "browser", "buffer", "bug",
  "byte", "cache", "callback", "certificate", "checksum", "cipher", "class",
  "client-server", "closure", "cloud-computing", "compiler", "compression",
  "cors", "cpu", "crc", "csrf", "css", "cursor", "daemon", "database",
  "data-mining", "data-structure", "data-type", "debugging", "declarative",
  "dependency", "deployment", "design-pattern", "dhcp", "dns", "docker",
  "document-object-model", "domain", "encryption", "environment-variable",
  "event-loop", "exception", "expression", "fat", "file-system", "firewall",
  "framework", "ftp", "function", "gateway", "gpu", "graphql", "guid",
  "hash-function", "header", "heap", "hmac", "host", "hotfix", "html",
  "http", "https", "ide", "index", "inheritance", "instance", "integer",
  "integration", "interpreter", "interrupt", "io", "ip-address", "ipv4",
  "ipv6", "iterator", "json", "jwt", "kernel", "key", "lambda", "latency",
  "library", "linker", "linux", "load-balancer", "log", "loop", "mac-address",
  "machine-learning", "malware", "markdown", "memory", "metadata", "middleware",
  "mime-type", "module", "monitoring", "multithreading", "namespace", "nat",
  "netmask", "network", "node", "normalization", "npm", "null", "oauth",
  "object", "observer-pattern", "open-source", "os", "overload", "package",
  "packet", "polymorphism", "port", "predicate", "process", "promise", "protocol",
  "proxy", "query", "queue", "ram", "rdap", "recursion", "redis", "refactoring",
  "regex", "rest-api", "restful", "rfc", "robots-txt", "root", "routing",
  "rsa", "sass", "schema", "scope", "script", "sdk", "semver", "server",
  "session", "sha", "shell", "sitemap", "slug", "smtp", "soap", "socket",
  "sql", "ssh", "ssl", "stack", "state-machine", "status-code", "storage",
  "stream", "string", "subnet", "syntax", "tcp", "template", "thread",
  "throughput", "tls", "token", "traversal", "tree", "trie", "trigger",
  "tsql", "tuple", "type", "udp", "unicode", "uri", "url", "urn", "utf",
  "uuid", "validation", "variable", "version-control", "virtual-machine",
  "vlan", "vpn", "waf", "webhook", "websocket", "whois", "wrapper", "xss",
  "xml", "xpath", "xslt", "yaml", "zip",
];

const USE_CASES = [
  "students", "developers", "designers", "writers", "business",
  "photographers", "teachers", "marketers", "freelancers", "engineers",
  "researchers", "content-creators", "startups", "enterprises", "remote-workers",
  "devops", "sysadmins", "seo-professionals", "data-analysts", "lawyers",
  "accountants", "architects", "gamers", "hobbyists", "entrepreneurs",
  "hr-professionals", "project-managers", "social-media-managers", "recruiters",
  "journalists", "graduate-students", "highschool-students", "non-profits",
  "ecommerce", "bloggers", "youtubers", "podcasters",
];

const CATEGORY_SLUGS = [
  "text-writing", "image-design", "code-dev", "data-analytics", "audio-video",
  "productivity", "network-internet", "finance", "calculators", "security",
  "ai", "seo", "converters",
];

const BEST_OF_USE_CASES = [
  "daily-use", "productivity", "beginners", "professionals", "small-business",
  "enterprise", "education", "remote-work", "quick-tasks", "power-users",
  "budget", "time-saving", "beginner-friendly", "team-collaboration",
  "freelancers", "startups", "students", "designers", "developers",
  "marketers", "data-analysis", "content-creation", "security", "compliance",
  "automation", "troubleshooting", "quality-assurance", "optimization",
  "workflow", "learning",
];

function getAllPairs<T>(items: T[]): Array<[T, T]> {
  const pairs: Array<[T, T]> = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]]);
    }
  }
  return pairs;
}

// 1. Alternatives: one per tool (213+ pages)
export function getAlternativeSlugs(): Array<{ tool: string }> {
  return getAllTools().map((t) => ({ tool: t.id }));
}

// 2. VS comparisons: at least 3,000 pairs (targeting ~8,000+)
export function getVsSlugs(): Array<{ tool1: string; tool2: string; slug: string }> {
  const tools = getAllTools();
  const result: Array<{ tool1: string; tool2: string; slug: string }> = [];
  const seen = new Set<string>();

  const addPair = (a: string, b: string) => {
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    result.push({ tool1: a, tool2: b, slug: `${a}-vs-${b}` });
  };

  // Same-category pairs
  const byCategory = new Map<string, typeof tools>();
  for (const t of tools) {
    const existing = byCategory.get(t.category) || [];
    existing.push(t);
    byCategory.set(t.category, existing);
  }
  for (const [, catTools] of byCategory) {
    const pairs = getAllPairs(catTools);
    for (const [a, b] of pairs) {
      addPair(a.id, b.id);
    }
  }

  // Cross-category pairs: pair each tool with next N tools from different categories
  const n = tools.length;
  const P = 20;
  for (let i = 0; i < n; i++) {
    for (let k = 1; k <= P; k++) {
      const j = (i + k) % n;
      if (i === j) continue;
      if (tools[i].category === tools[j].category) continue;
      addPair(tools[i].id, tools[j].id);
    }
  }

  return result;
}

// 3. Converters: at least 200 format pairs (targeting ~1,000+)
export function getConverterSlugs(): Array<{ source: string; target: string; slug: string }> {
  const imageFormats = ["jpg", "png", "webp", "svg", "gif", "bmp", "tiff", "heic"];
  const docFormats = ["pdf", "word", "excel", "ppt", "txt", "rtf", "html", "markdown", "epub", "mobi"];
  const dataFormats = ["json", "csv", "xml", "yaml", "toml"];
  const codeFormats = ["css", "scss", "less", "js", "ts", "html"];
  const mediaFormats = ["mp3", "mp4", "wav", "flac", "ogg"];
  const encFormats = ["base64", "hex", "binary"];
  const archiveFormats = ["zip", "gzip", "tar"];
  const miscFormats = ["sql", "ics", "vcf", "iso", "dmg"];

  const allFormats = [...new Set([...imageFormats, ...docFormats, ...dataFormats, ...codeFormats, ...mediaFormats, ...encFormats, ...archiveFormats, ...miscFormats])];
  const result: Array<{ source: string; target: string; slug: string }> = [];
  const seen = new Set<string>();

  // Image conversions (within image formats only)
  for (const fmt of imageFormats) {
    for (const other of imageFormats) {
      if (fmt === other) continue;
      const key = `${fmt}-to-${other}`;
      if (!seen.has(key)) { seen.add(key); result.push({ source: fmt, target: other, slug: key }); }
    }
  }

  // Document conversions (doc-to-doc only)
  for (const fmt of docFormats) {
    for (const other of docFormats) {
      if (fmt === other) continue;
      const key = `${fmt}-to-${other}`;
      if (!seen.has(key)) { seen.add(key); result.push({ source: fmt, target: other, slug: key }); }
    }
  }

  // Image-to-doc and doc-to-image (cross-category)
  for (const fmt of imageFormats) {
    for (const other of docFormats) {
      if (fmt === other) continue;
      const key1 = `${fmt}-to-${other}`;
      const key2 = `${other}-to-${fmt}`;
      if (!seen.has(key1) && !seen.has(key2)) { seen.add(key1); result.push({ source: fmt, target: other, slug: key1 }); }
    }
  }

  // Data format conversions
  for (const fmt of dataFormats) {
    for (const other of dataFormats) {
      if (fmt === other) continue;
      const key = `${fmt}-to-${other}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({ source: fmt, target: other, slug: key });
      }
    }
  }

  // Code format conversions
  for (const fmt of codeFormats) {
    for (const other of codeFormats) {
      if (fmt === other) continue;
      const key = `${fmt}-to-${other}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({ source: fmt, target: other, slug: key });
      }
    }
  }

  // Media conversions
  for (const fmt of mediaFormats) {
    for (const other of mediaFormats) {
      if (fmt === other) continue;
      const key = `${fmt}-to-${other}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({ source: fmt, target: other, slug: key });
      }
    }
  }

  // Encoding conversions
  for (const fmt of encFormats) {
    for (const other of encFormats) {
      if (fmt === other) continue;
      const key = `${fmt}-to-${other}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({ source: fmt, target: other, slug: key });
      }
    }
  }

  // Archive conversions
  for (const fmt of archiveFormats) {
    for (const other of archiveFormats) {
      if (fmt === other) continue;
      const key = `${fmt}-to-${other}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({ source: fmt, target: other, slug: key });
      }
    }
  }

  // Cross-domain conversions
  const crossDomain: Array<[string, string]> = [
    ["pdf", "jpg"], ["pdf", "png"], ["pdf", "txt"], ["pdf", "html"],
    ["word", "pdf"], ["word", "txt"], ["word", "html"],
    ["excel", "csv"], ["excel", "json"], ["excel", "xml"],
    ["json", "csv"], ["json", "xml"], ["json", "yaml"],
    ["csv", "json"], ["csv", "xml"], ["csv", "yaml"],
    ["xml", "json"], ["xml", "csv"], ["xml", "yaml"],
    ["html", "pdf"], ["html", "txt"], ["html", "markdown"],
    ["markdown", "html"], ["markdown", "pdf"],
    ["yaml", "json"], ["yaml", "toml"],
    ["png", "jpg"], ["png", "webp"], ["png", "bmp"],
    ["jpg", "png"], ["jpg", "webp"], ["jpg", "bmp"],
    ["webp", "png"], ["webp", "jpg"],
    ["svg", "png"], ["svg", "jpg"],
    ["gif", "mp4"], ["gif", "png"],
    ["base64", "hex"], ["base64", "binary"],
    ["css", "scss"], ["css", "less"], ["scss", "css"], ["less", "css"],
    ["ts", "js"], ["js", "ts"],
    ["heic", "jpg"], ["heic", "png"],
    ["tiff", "jpg"], ["tiff", "png"],
    ["epub", "pdf"], ["epub", "mobi"],
    ["mobi", "epub"], ["mobi", "pdf"],
    ["ics", "csv"], ["vcf", "csv"],
    ["iso", "dmg"],
  ];

  for (const [src, tgt] of crossDomain) {
    const key = `${src}-to-${tgt}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ source: src, target: tgt, slug: key });
    }
  }

  return result;
}

// 4. Best-of: 13 categories × 30 use cases = 390 pages
export function getBestOfSlugs(): Array<{ category: string; useCase: string; slug: string }> {
  const result: Array<{ category: string; useCase: string; slug: string }> = [];
  for (const cat of CATEGORY_SLUGS) {
    for (const uc of BEST_OF_USE_CASES) {
      const slug = `best-${cat}-for-${uc}`;
      result.push({ category: cat, useCase: uc, slug });
    }
  }
  return result;
}

// 5. Use cases: 37 use cases
export function getUseCaseSlugs(): Array<{ useCase: string; slug: string }> {
  return USE_CASES.map((uc) => ({
    useCase: uc,
    slug: `tools-for-${uc}`,
  }));
}

// 6. Glossary: 200+ technical terms
export function getGlossarySlugs(): Array<{ term: string }> {
  return [...new Set(GLOSSARY_TERMS)].map((term) => ({ term }));
}

// 7. Guides: 500+ how-to guides
export function getHowToSlugs(): Array<{ topic: string; tool: string; slug: string }> {
  const tools = getAllTools();
  const result: Array<{ topic: string; tool: string; slug: string }> = [];
  const seen = new Set<string>();

  const actionPrefixes = ["use", "how-to"];

  for (const tool of tools) {
    for (const prefix of actionPrefixes) {
      const slug = `${prefix}-${tool.id}`;
      if (!seen.has(slug)) {
        seen.add(slug);
        result.push({ topic: `${prefix}-${tool.id}`, tool: tool.id, slug });
      }
    }
  }

  const curatedGuides: Array<{ topic: string; tool: string; slug: string }> = [
    { topic: "compress-pdf", tool: "compress-pdf", slug: "compress-pdf-online-free" },
    { topic: "merge-pdf-files", tool: "merge-pdf", slug: "merge-pdf-files-online" },
    { topic: "split-pdf-pages", tool: "split-pdf", slug: "split-pdf-pages" },
    { topic: "remove-image-background", tool: "background-remover", slug: "remove-image-background-online" },
    { topic: "convert-pdf-to-word", tool: "pdf-to-word", slug: "convert-pdf-to-word-free" },
    { topic: "check-ssl-certificate", tool: "ssl-certificate-checker", slug: "check-ssl-certificate-online" },
    { topic: "lookup-dns-records", tool: "dns-lookup", slug: "lookup-dns-records-free" },
    { topic: "check-website-status", tool: "website-status-checker", slug: "check-website-status-online" },
    { topic: "generate-strong-password", tool: "password-generator", slug: "generate-strong-password-online" },
    { topic: "lookup-whois-domain", tool: "whois-lookup", slug: "lookup-whois-domain-free" },
    { topic: "find-my-ip-address", tool: "what-is-my-ip", slug: "find-my-ip-address-online" },
    { topic: "format-json-online", tool: "json-formatter", slug: "format-json-online-free" },
    { topic: "encode-base64-string", tool: "base64-encoder", slug: "encode-base64-string-online" },
    { topic: "compress-image-file", tool: "image-compressor", slug: "compress-image-file-online" },
    { topic: "generate-qr-code", tool: "qr-code-generator", slug: "generate-qr-code-free" },
    { topic: "check-email-deliverability", tool: "email-deliverability-checker", slug: "check-email-deliverability" },
    { topic: "convert-json-to-csv", tool: "json-to-csv", slug: "convert-json-to-csv-online" },
    { topic: "convert-csv-to-json", tool: "csv-to-json", slug: "convert-csv-to-json-online" },
    { topic: "resize-image-dimensions", tool: "image-resizer", slug: "resize-image-dimensions-online" },
    { topic: "convert-yaml-to-json", tool: "yaml-to-json", slug: "convert-yaml-to-json-online" },
    { topic: "convert-xml-to-json", tool: "xml-to-json", slug: "convert-xml-to-json-online" },
    { topic: "decode-jwt-token", tool: "jwt-decoder", slug: "decode-jwt-token-online" },
    { topic: "generate-uuid-v4", tool: "uuid-generator", slug: "generate-uuid-v4-online" },
    { topic: "test-regex-pattern", tool: "regex-tester", slug: "test-regex-pattern-online" },
    { topic: "generate-md5-hash", tool: "md5-hash-generator", slug: "generate-md5-hash-online" },
    { topic: "generate-sha-hash", tool: "sha-hash-generator", slug: "generate-sha-hash-online" },
    { topic: "minify-html-code", tool: "html-minifier", slug: "minify-html-code-online" },
    { topic: "minify-css-code", tool: "css-minifier", slug: "minify-css-code-online" },
    { topic: "minify-javascript", tool: "js-minifier", slug: "minify-javascript-online" },
    { topic: "convert-text-case", tool: "case-converter", slug: "convert-text-case-online" },
    { topic: "convert-number-base", tool: "number-base-converter", slug: "convert-number-base-online" },
    { topic: "convert-hex-to-rgb", tool: "color-converter", slug: "convert-hex-to-rgb-online" },
    { topic: "format-sql-queries", tool: "sql-formatter", slug: "format-sql-queries-online" },
    { topic: "convert-text-to-slug", tool: "text-to-slug", slug: "convert-text-to-slug-online" },
    { topic: "parse-url-online", tool: "url-parser", slug: "parse-url-online-free" },
    { topic: "encode-url-online", tool: "url-encoder", slug: "encode-url-online-free" },
    { topic: "encode-html-entities", tool: "html-entity-encoder", slug: "encode-html-entities-online" },
    { topic: "rotate-pdf-pages", tool: "rotate-pdf", slug: "rotate-pdf-pages-online" },
    { topic: "protect-pdf-password", tool: "protect-pdf", slug: "protect-pdf-with-password" },
    { topic: "unlock-pdf-file", tool: "unlock-pdf", slug: "unlock-pdf-file-online" },
    { topic: "extract-pdf-pages", tool: "extract-pdf-pages", slug: "extract-pdf-pages-online" },
    { topic: "reorder-pdf-pages", tool: "reorder-pdf", slug: "reorder-pdf-pages-online" },
    { topic: "convert-pdf-to-jpg", tool: "pdf-to-jpg", slug: "convert-pdf-to-jpg-online" },
    { topic: "convert-jpg-to-pdf", tool: "jpg-to-pdf", slug: "convert-jpg-to-pdf-online" },
    { topic: "crop-image-online", tool: "crop-image", slug: "crop-image-online-free" },
    { topic: "blur-image-online", tool: "blur-image", slug: "blur-image-online-free" },
    { topic: "add-watermark-image", tool: "watermark-image", slug: "add-watermark-to-image-online" },
    { topic: "convert-image-grayscale", tool: "image-grayscale", slug: "convert-image-to-grayscale" },
    { topic: "convert-image-to-base64", tool: "image-to-base64", slug: "convert-image-to-base64-online" },
    { topic: "convert-base64-to-image", tool: "base64-to-image", slug: "convert-base64-to-image-online" },
    { topic: "calculate-bmi-online", tool: "bmi-calculator", slug: "calculate-bmi-online-free" },
    { topic: "calculate-mortgage-payment", tool: "mortgage-calculator", slug: "calculate-mortgage-payment-online" },
    { topic: "calculate-compound-interest", tool: "compound-interest-calculator", slug: "calculate-compound-interest-online" },
    { topic: "calculate-salary-conversion", tool: "salary-calculator", slug: "calculate-salary-hourly-annual" },
    { topic: "check-password-strength", tool: "password-strength-checker", slug: "check-password-strength-online" },
    { topic: "check-data-breach", tool: "data-breach-checker", slug: "check-email-data-breach-online" },
    { topic: "generate-csrf-token", tool: "csrf-token-generator", slug: "generate-csrf-token-online" },
    { topic: "test-ssl-server", tool: "ssl-test", slug: "test-ssl-tls-server-online" },
    { topic: "check-cors-headers", tool: "cors-checker", slug: "check-cors-headers-online" },
    { topic: "generate-csp-headers", tool: "content-security-policy", slug: "generate-content-security-policy-online" },
    { topic: "summarize-text-ai", tool: "ai-text-summarizer", slug: "summarize-text-with-ai-online" },
    { topic: "rewrite-text-ai", tool: "ai-rewriter", slug: "rewrite-text-with-ai-online" },
    { topic: "analyze-sentiment-text", tool: "ai-sentiment-analysis", slug: "analyze-text-sentiment-online" },
    { topic: "extract-keywords-text", tool: "ai-keyword-extractor", slug: "extract-keywords-from-text-online" },
    { topic: "check-grammar-online", tool: "ai-grammar-checker", slug: "check-grammar-spelling-online" },
    { topic: "generate-title-headline", tool: "ai-title-generator", slug: "generate-title-headlines-with-ai" },
    { topic: "generate-meta-description", tool: "ai-meta-description", slug: "generate-seo-meta-description-ai" },
    { topic: "generate-hashtags-social", tool: "ai-hashtag-generator", slug: "generate-hashtags-for-social-media" },
    { topic: "analyze-keyword-density", tool: "keyword-density", slug: "analyze-keyword-density-online" },
    { topic: "run-seo-audit", tool: "seo-audit", slug: "run-seo-audit-website-online" },
    { topic: "check-page-speed", tool: "page-speed-checker", slug: "check-page-speed-performance" },
    { topic: "check-backlinks", tool: "backlink-checker", slug: "check-website-backlinks-online" },
    { topic: "preview-serp-snippet", tool: "serp-preview", slug: "preview-serp-snippet-google" },
    { topic: "check-google-index", tool: "google-index-checker", slug: "check-google-index-status-online" },
    { topic: "generate-robots-txt", tool: "robots-txt-generator", slug: "generate-robots-txt-file" },
    { topic: "generate-xml-sitemap", tool: "sitemap-generator", slug: "generate-xml-sitemap-website" },
    { topic: "generate-meta-tags", tool: "meta-tag-generator", slug: "generate-html-meta-tags-seo" },
    { topic: "generate-open-graph-tags", tool: "open-graph-generator", slug: "generate-open-graph-tags-social" },
    { topic: "generate-schema-markup", tool: "schema-generator", slug: "generate-json-ld-schema-markup" },
    { topic: "generate-hreflang-tags", tool: "hreflang-generator", slug: "generate-hreflang-tags-international-seo" },
    { topic: "generate-canonical-url", tool: "canonical-generator", slug: "generate-canonical-url-tags" },
    { topic: "check-redirect-chain", tool: "redirect-checker", slug: "check-url-redirect-chain-online" },
    { topic: "check-broken-links", tool: "broken-link-checker", slug: "check-broken-links-website" },
    { topic: "lookup-spf-records", tool: "spf-lookup", slug: "lookup-spf-records-domain" },
    { topic: "lookup-dkim-records", tool: "dkim-lookup", slug: "lookup-dkim-records-domain" },
    { topic: "lookup-dmarc-records", tool: "dmarc-lookup", slug: "lookup-dmarc-records-domain" },
    { topic: "lookup-mx-records", tool: "mx-lookup", slug: "lookup-mx-records-domain" },
    { topic: "lookup-bimi-records", tool: "bimi-lookup", slug: "lookup-bimi-records-domain" },
    { topic: "generate-spf-record", tool: "spf-generator", slug: "generate-spf-record-domain" },
    { topic: "generate-dmarc-record", tool: "dmarc-generator", slug: "generate-dmarc-record-domain" },
    { topic: "validate-dkim-record", tool: "dkim-validator", slug: "validate-dkim-record-domain" },
    { topic: "check-dnssec-status", tool: "dnssec-checker", slug: "check-dnssec-status-domain" },
    { topic: "lookup-caa-records", tool: "caa-lookup", slug: "lookup-caa-records-domain" },
    { topic: "analyze-nameserver", tool: "nameserver-analyzer", slug: "analyze-nameserver-configuration" },
    { topic: "validate-dns-zone", tool: "dns-zone-validator", slug: "validate-dns-zone-configuration" },
    { topic: "check-ip-blacklist", tool: "blacklist-check", slug: "check-ip-blacklist-dnsbl" },
    { topic: "check-mta-sts-records", tool: "mta-sts-lookup", slug: "check-mta-sts-records-domain" },
    { topic: "lookup-asn-information", tool: "asn-lookup", slug: "lookup-asn-information-ip" },
    { topic: "lookup-srv-records", tool: "srv-lookup", slug: "lookup-srv-records-domain" },
    { topic: "lookup-tlsrpt-records", tool: "tlsrpt-lookup", slug: "lookup-tlsrpt-records-domain" },
    { topic: "convert-ipv4-to-ipv6", tool: "ipv4-ipv6-converter", slug: "convert-ipv4-to-ipv6-online" },
    { topic: "lookup-mac-address", tool: "mac-address-lookup", slug: "lookup-mac-address-vendor" },
    { topic: "run-traceroute-online", tool: "traceroute", slug: "run-traceroute-network-path" },
    { topic: "calculate-bandwidth-needs", tool: "bandwidth-calculator", slug: "calculate-bandwidth-requirements" },
    { topic: "test-internet-speed", tool: "speed-test", slug: "test-internet-speed-online" },
    { topic: "extract-pdf-text", tool: "pdf-to-text", slug: "extract-text-from-pdf-online" },
    { topic: "convert-pdf-to-excel", tool: "pdf-to-excel", slug: "convert-pdf-to-excel-online" },
    { topic: "count-words-online", tool: "word-counter", slug: "count-words-characters-online" },
    { topic: "compare-text-diff", tool: "text-diff-checker", slug: "compare-text-differences-online" },
    { topic: "generate-lorem-ipsum", tool: "lorem-ipsum-generator", slug: "generate-lorem-ipsum-text" },
  ];

  for (const guide of curatedGuides) {
    const exists = tools.some((t) => t.id === guide.tool);
    if (exists && !seen.has(guide.slug)) {
      seen.add(guide.slug);
      result.push(guide);
    }
  }

  return result;
}
