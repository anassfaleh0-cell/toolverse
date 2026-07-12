import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "src", "lib", "content", "data");

// === STEP 1: Add noindex + needsReview to clusters 16-19 ===
console.log("=== Adding noindex + needsReview to clusters 16-19 ===");
for (let i = 16; i <= 19; i++) {
  const filePath = join(dataDir, `articles-cluster-${i}.ts`);
  let content = readFileSync(filePath, "utf-8");
  // Replace `updatedAt: "2026-07-11", sections: [{` with `updatedAt: "2026-07-11", noindex: true, needsReview: true, sections: [{`
  const replaced = content.replace(
    /(updatedAt:\s*"2026-07-11",)\s*sections:\s*\[/g,
    '$1 noindex: true, needsReview: true, sections: ['
  );
  const count = (content.match(/sections:\s*\[/g) || []).length;
  writeFileSync(filePath, replaced);
  console.log(`  Cluster ${i}: ${count} articles flagged with noindex + needsReview`);
}

// === STEP 2: Add noindex to clusters 20-35 ===
console.log("\n=== Adding noindex to clusters 20-35 ===");
for (let i = 20; i <= 35; i++) {
  const filePath = join(dataDir, `articles-cluster-${i}.ts`);
  let content = readFileSync(filePath, "utf-8");
  const replaced = content.replace(
    /(updatedAt:\s*"2026-07-11",)\s*sections:\s*\[/g,
    '$1 noindex: true, sections: ['
  );
  const count = (content.match(/sections:\s*\[/g) || []).length;
  writeFileSync(filePath, replaced);
  console.log(`  Cluster ${i}: ${count} articles flagged with noindex`);
}

// === STEP 3: Stagger dates for clusters 11-15 ===
console.log("\n=== Staggering dates for clusters 11-15 ===");
// Spread 50 articles across Jul 15 - Sep 15 (~62 days), ~1 per day on weekdays
const startDate = new Date("2026-07-15");
const articleDates = [];
for (let i = 0; i < 50; i++) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + Math.floor(i * 1.24)); // ~50 articles in 62 days
  // Skip weekends
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  articleDates.push(d.toISOString().split("T")[0]);
}

let idx = 0;
for (let i = 11; i <= 15; i++) {
  const filePath = join(dataDir, `articles-cluster-${i}.ts`);
  let content = readFileSync(filePath, "utf-8");
  // Only stagger dates for articles that have "2026-07-11" as publishedAt
  const lines = content.split("\n");
  const newLines = [];
  let staggerCount = 0;
  
  for (const line of lines) {
    if (line.includes('publishedAt: "2026-07-11"') && idx < articleDates.length) {
      newLines.push(line.replace('publishedAt: "2026-07-11"', `publishedAt: "${articleDates[idx]}"`));
      idx++;
      staggerCount++;
    } else {
      newLines.push(line);
    }
  }
  writeFileSync(filePath, newLines.join("\n"));
  console.log(`  Cluster ${i}: ${staggerCount} articles date-staggered`);
}

console.log(`\nDone! Total articles date-staggered: ${idx}`);
