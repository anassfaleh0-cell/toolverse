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

function extractArticles(content, clusterNum) {
  const parts = content.split(/\{\s*slug:\s*"/);
  const articles = [];
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const slug = part.match(/^([^"]+)"/)?.[1] || "unknown";
    const titleMatch = part.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : "unknown";
    const catMatch = part.match(/category:\s*"([^"]+)"/);
    const category = catMatch ? catMatch[1] : "unknown";
    const pubMatch = part.match(/publishedAt:\s*"([^"]+)"/);
    const publishedAt = pubMatch ? pubMatch[1] : "unknown";
    const toolSlugs = part.match(/toolSlugs:\s*\[([^\]]*)\]/);
    const hasTools = toolSlugs && toolSlugs[1].trim().length > 0;
    const related = part.match(/relatedContent:\s*\[([^\]]*)\]/);
    const hasRelated = related && related[1].trim().length > 0;
    const sectionCount = (part.match(/heading:/g) || []).length;
    // Check if has noindex
    const hasNoindex = part.includes("noindex: true");
    const hasNeedsReview = part.includes("needsReview: true");

    articles.push({ cluster: clusterNum, slug, title, category, publishedAt, hasTools, hasRelated, sectionCount, hasNoindex, hasNeedsReview });
  }
  return articles;
}

const allArticles = [];
for (const file of files) {
  const clusterNum = parseInt(file.match(/\d+/)[0], 10);
  const content = readFileSync(join(dataDir, file), "utf-8");
  const articles = extractArticles(content, clusterNum);
  allArticles.push(...articles);
}

// === HIGH RISK: clusters 20-35 (160 articles) ===
const highRisk = allArticles.filter(a => a.cluster >= 20 && a.cluster <= 35);
// === MEDIUM RISK: clusters 16-19 (40 articles) ===
const mediumRisk = allArticles.filter(a => a.cluster >= 16 && a.cluster <= 19);

// === LOW RISK: clusters 1-15 (250 articles) ===
const lowRisk = allArticles.filter(a => a.cluster >= 1 && a.cluster <= 15);

console.log(`\n=== SUMMARY ===`);
console.log(`High-risk (clusters 20-35): ${highRisk.length} articles - noindexed`);
console.log(`Medium-risk (clusters 16-19): ${mediumRisk.length} articles - noindexed + needsReview`);
console.log(`Low-risk (clusters 1-15): ${lowRisk.length} articles - indexable, staggered`);
console.log(`Total: ${allArticles.length} articles`);

// Write the backlog files
let highRiskText = `# HIGH-RISK ARTICLES BACKLOG (Clusters 20-35)
# ${highRisk.length} articles - noindexed until rewritten and re-approved
# 
# column: cluster | category | publishedAt | hasToolLinks | hasRelatedContent | sectionCount | slug | title
#
`;
for (const a of highRisk) {
  const issues = [];
  if (!a.hasTools) issues.push("no tool links");
  if (!a.hasRelated) issues.push("no related content");
  if (a.sectionCount < 4) issues.push(`only ${a.sectionCount} sections`);
  const issueNote = issues.length > 0 ? ` // ISSUES: ${issues.join(", ")}` : "";
  highRiskText += `${a.cluster} | ${a.category} | ${a.publishedAt} | tools:${a.hasTools} | related:${a.hasRelated} | ${a.sectionCount}sec | ${a.slug} | ${a.title}${issueNote}\n`;
}

let mediumRiskText = `# MEDIUM-RISK ARTICLES BACKLOG (Clusters 16-19)
# ${mediumRisk.length} articles - noindexed + flagged needsReview until human review
#
# column: cluster | category | publishedAt | hasToolLinks | hasRelatedContent | sectionCount | slug | title
#
`;
for (const a of mediumRisk) {
  const issues = [];
  if (!a.hasTools) issues.push("no tool links (needs integration)");
  if (!a.hasRelated) issues.push("no related content (needs links)");
  if (a.sectionCount < 5) issues.push(`only ${a.sectionCount} sections (thin)`);
  issues.push("generic/short section bodies (2-4 sentences)");
  issues.push("same-day publish as mass dump");
  const issueNote = ` // ISSUES: ${issues.join(", ")}`;
  mediumRiskText += `${a.cluster} | ${a.category} | ${a.publishedAt} | tools:${a.hasTools} | related:${a.hasRelated} | ${a.sectionCount}sec | ${a.slug} | ${a.title}${issueNote}\n`;
}

writeFileSync(join(__dirname, "..", "BACKLOG-160-HIGH-RISK.txt"), highRiskText);
writeFileSync(join(__dirname, "..", "BACKLOG-40-MEDIUM-RISK.txt"), mediumRiskText);
console.log(`\nWrote BACKLOG-160-HIGH-RISK.txt`);
console.log(`Wrote BACKLOG-40-MEDIUM-RISK.txt`);

// Also verify noindex counts
const noindexed = allArticles.filter(a => a.hasNoindex);
const needsReview = allArticles.filter(a => a.hasNeedsReview);
console.log(`\n=== VERIFICATION ===`);
console.log(`Articles with noindex: ${noindexed.length}`);
console.log(`Articles with needsReview: ${needsReview.length}`);
