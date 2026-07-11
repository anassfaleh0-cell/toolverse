import { readFileSync, writeFileSync } from "fs";

// --- Tool OG data ---
const toolsContent = readFileSync("src/lib/tools.ts", "utf-8");
const catsContent = readFileSync("src/lib/categories.ts", "utf-8");

const catRegex = /slug:\s+"([^"]+)"[\s\S]*?label:\s+"([^"]+)"/g;
const catLabelMap = {};
let m;
while ((m = catRegex.exec(catsContent)) !== null) {
  catLabelMap[m[1]] = m[2];
}

const toolRegex = /\{\s*id:\s+"([^"]+)"[\s\S]*?name:\s+"([^"]+)"[\s\S]*?description:\s+"([^"]+)"[\s\S]*?url:\s+"([^"]+)"[\s\S]*?category:\s+"([^"]+)"/g;
const entries = [];
while ((m = toolRegex.exec(toolsContent)) !== null) {
  const slug = m[4].startsWith("/") ? m[4].slice(1) : m[4];
  entries.push({ s: slug, n: m[2], d: m[3], c: m[5] });
}

let out = "// Auto-generated for OG images - regenerate if tools.ts changes\n";
out += "export const OG_TOOL_DATA: Record<string, { n: string; d: string; cl: string }> = {\n";
for (const e of entries) {
  const cl = catLabelMap[e.c] || "";
  out += `  "${e.s}": { n: ${JSON.stringify(e.n)}, d: ${JSON.stringify(e.d)}, cl: ${JSON.stringify(cl)} },\n`;
}
out += "};\n";
writeFileSync("src/lib/og-tool-data.ts", out);
console.log("Tool OG data: " + entries.length + " entries");

// --- Article OG data ---
const articlesContent = readFileSync("src/lib/content/data/articles.ts", "utf-8");

// Parse all article entries from the import chain
// articles.ts imports CLUSTER_N_ARTICLES and concats them, then has extra inline articles
// We need to parse each cluster file and the inline articles in articles.ts

// First, find all cluster imports
const importRegex = /import\s*\{\s*(\w+)\s*\}\s*from\s+["'].\/articles-cluster-(\d+)["']/g;
const clusterVars = [];
while ((m = importRegex.exec(articlesContent)) !== null) {
  clusterVars.push({ var: m[1], num: parseInt(m[2]) });
}

// Parse articles from cluster files plus inline articles
// We need to read each cluster file and extract articles
const allArticles = [];

// Parse inline articles (those defined directly in articles.ts after the spread)
const inlineSection = articlesContent.split("export const ARTICLES")[1];
if (inlineSection) {
  const articleRegex = /\{\s*slug:\s+"([^"]+)"[\s\S]*?title:\s+"([^"]+)"[\s\S]*?description:\s+"([^"]+)"[\s\S]*?category:\s+"([^"]+)"[\s\S]*?readingTimeMinutes:/g;
  while ((m = articleRegex.exec(inlineSection)) !== null) {
    allArticles.push({ s: m[1], t: m[2], d: m[3], cat: m[4] });
  }
}

// Parse cluster files
const clusterDir = "src/lib/content/data/";
for (const cv of clusterVars) {
  const clusterContent = readFileSync(clusterDir + "articles-cluster-" + cv.num + ".ts", "utf-8");
  const articleRegex = /\{\s*slug:\s+"([^"]+)"[\s\S]*?title:\s+"([^"]+)"[\s\S]*?description:\s+"([^"]+)"[\s\S]*?category:\s+"([^"]+)"[\s\S]*?readingTimeMinutes:/g;
  while ((m = articleRegex.exec(clusterContent)) !== null) {
    allArticles.push({ s: m[1], t: m[2], d: m[3], cat: m[4] });
  }
}

// Also parse guides, comparisons, etc for the blog route
// But the blog route only handles articles, so this should be enough

let out2 = "// Auto-generated for OG images - regenerate if articles change\n";
out2 += "export const OG_ARTICLE_DATA: Record<string, { t: string; d: string }> = {\n";
for (const a of allArticles) {
  out2 += `  "${a.s}": { t: ${JSON.stringify(a.t)}, d: ${JSON.stringify(a.d)} },\n`;
}
out2 += "};\n";
writeFileSync("src/lib/og-article-data.ts", out2);
console.log("Article OG data: " + allArticles.length + " entries");
