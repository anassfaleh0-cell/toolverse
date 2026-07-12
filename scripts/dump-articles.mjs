import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "src", "lib", "content", "data");

const files = readdirSync(dataDir)
  .filter((f) => f.startsWith("articles-cluster-") && f.endsWith(".ts"))
  .sort((a, b) => {
    const na = parseInt(a.match(/\d+/)[0], 10);
    const nb = parseInt(b.match(/\d+/)[0], 10);
    return na - nb;
  });

const all = [];

for (const file of files) {
  const clusterNum = parseInt(file.match(/\d+/)[0], 10);
  const content = readFileSync(join(dataDir, file), "utf-8");

  // Extract each article object - find slug, title, category, publishedAt, toolSlugs, relatedContent, sections
  const articleRegex = /\{\s*slug:\s*"([^"]+)",\s*type:\s*"article",\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*difficulty:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*toolSlugs:\s*\[([^\]]*)\],\s*relatedContent:\s*\[([^\]]*)\],\s*readingTimeMinutes:\s*(\d+),\s*publishedAt:\s*"([^"]+)",\s*updatedAt:\s*"([^"]+)",\s*(?:author:\s*\{[^}]+\},\s*)?(?:schema:\s*\{[^}]+\},\s*)?sections:\s*\[/gs;

  let match;
  while ((match = articleRegex.exec(content)) !== null) {
    const sections = content.substring(match.index + match[0].length, content.indexOf("]", match.index + match[0].length) + 1);
    const sectionCount = (sections.match(/heading:/g) || []).length;
    // Count approximate words in sections
    const sectionText = sections.replace(/"[^"]*"/g, "").replace(/\{|\}|heading:|body:/g, "");
    const approxWordCount = sectionText.split(/\s+/).filter(Boolean).length;
    const bodyText = sections.match(/body:\s*"([^"]+)"/g) || [];
    const avgSectionLen = bodyText.length > 0
      ? Math.round(bodyText.reduce((sum, b) => sum + b.replace(/body:\s*"/, "").length, 0) / bodyText.length)
      : 0;

    all.push({
      cluster: clusterNum,
      slug: match[1],
      title: match[2],
      description: match[3],
      difficulty: match[4],
      category: match[5],
      toolSlugs: match[6].trim() ? match[6].split(",").map(s => s.trim().replace(/"/g, "")) : [],
      relatedContent: match[7].trim() ? match[7].split(",").map(s => s.trim().replace(/"/g, "")) : [],
      readingTimeMinutes: parseInt(match[8], 10),
      publishedAt: match[9],
      updatedAt: match[10],
      sectionCount,
      avgSectionCharLen: avgSectionLen,
    });
  }
}

writeFileSync(join(__dirname, "..", "article-dump.json"), JSON.stringify(all, null, 2));
console.log(`Dumped ${all.length} articles from ${files.length} cluster files`);

// Summary by cluster
const byCluster = {};
for (const a of all) {
  if (!byCluster[a.cluster]) byCluster[a.cluster] = { count: 0, dates: new Set(), hasToolLinks: false, hasRelatedContent: false };
  byCluster[a.cluster].count++;
  byCluster[a.cluster].dates.add(a.publishedAt);
  if (a.toolSlugs.length > 0) byCluster[a.cluster].hasToolLinks = true;
  if (a.relatedContent.length > 0) byCluster[a.cluster].hasRelatedContent = true;
}

console.log("\n=== Cluster Summary ===");
for (const [num, info] of Object.entries(byCluster).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))) {
  console.log(`Cluster ${num.padStart(2, " ")}: ${info.count} articles | dates: ${[...info.dates].join(", ")} | toolLinks: ${info.hasToolLinks} | related: ${info.hasRelatedContent}`);
}
