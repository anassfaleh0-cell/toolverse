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

  // Split by article objects - each starts with `{ slug:`
  const parts = content.split(/\{\s*slug:\s*"/);
  // First part is before the first article (import statement, array declaration)
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const slug = part.match(/^([^"]+)"/)?.[1] || "unknown";

    const titleMatch = part.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : "unknown";

    const descMatch = part.match(/description:\s*\n?\s*"([^"]+)"/);
    const description = descMatch ? descMatch[1] : "unknown";

    const diffMatch = part.match(/difficulty:\s*"([^"]+)"/);
    const difficulty = diffMatch ? diffMatch[1] : "unknown";

    const catMatch = part.match(/category:\s*"([^"]+)"/);
    const category = catMatch ? catMatch[1] : "unknown";

    const pubMatch = part.match(/publishedAt:\s*"([^"]+)"/);
    const publishedAt = pubMatch ? pubMatch[1] : "unknown";

    const updMatch = part.match(/updatedAt:\s*"([^"]+)"/);
    const updatedAt = updMatch ? updMatch[1] : "unknown";

    const readingMatch = part.match(/readingTimeMinutes:\s*(\d+)/);
    const readingTimeMinutes = readingMatch ? parseInt(readingMatch[1], 10) : 0;

    // Count sections roughly
    const sectionMatch = part.match(/sections:\s*\[/);
    let sectionCount = 0;
    if (sectionMatch) {
      const afterSections = part.substring(sectionMatch.index + sectionMatch[0].length);
      // Count heading occurrences
      sectionCount = (afterSections.match(/heading:/g) || []).length;
    }

    // Check toolSlugs
    const toolMatch = part.match(/toolSlugs:\s*\[([^\]]*)\]/);
    const toolSlugs = toolMatch && toolMatch[1].trim() ? toolMatch[1].split(",").map(s => s.trim().replace(/"/g, "")) : [];

    // Check relatedContent
    const relMatch = part.match(/relatedContent:\s*\[([^\]]*)\]/);
    const relatedContent = relMatch && relMatch[1].trim() ? relMatch[1].split(",").map(s => s.trim().replace(/"/g, "")) : [];

    all.push({
      cluster: clusterNum,
      slug,
      title,
      description,
      difficulty,
      category,
      publishedAt,
      updatedAt,
      readingTimeMinutes,
      sectionCount,
      toolSlugsCount: toolSlugs.length,
      relatedContentCount: relatedContent.length,
    });
  }
}

writeFileSync(join(__dirname, "..", "article-dump.json"), JSON.stringify(all, null, 2));
console.log(`Dumped ${all.length} articles from ${files.length} cluster files`);

// Summary by cluster
const byCluster = {};
for (const a of all) {
  if (!byCluster[a.cluster]) byCluster[a.cluster] = { count: 0, dates: new Set(), totalToolLinks: 0, totalRelated: 0, categories: new Set() };
  byCluster[a.cluster].count++;
  byCluster[a.cluster].dates.add(a.publishedAt);
  byCluster[a.cluster].totalToolLinks += a.toolSlugsCount;
  byCluster[a.cluster].totalRelated += a.relatedContentCount;
  byCluster[a.cluster].categories.add(a.category);
}

console.log("\n=== Cluster Summary ===");
for (const num of Object.keys(byCluster).sort((a, b) => parseInt(a) - parseInt(b))) {
  const info = byCluster[num];
  console.log(`Cluster ${num.padStart(2, " ")}: ${info.count} articles | ${info.dates.size} unique dates | toolLinks: ${info.totalToolLinks} | related: ${info.totalRelated} | cats: ${[...info.categories].join(", ")}`);
}
