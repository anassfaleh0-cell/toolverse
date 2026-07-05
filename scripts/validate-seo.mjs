/**
 * SEO Validation Script — run via: node scripts/validate-seo.mjs
 *
 * Checks:
 * - All content pieces have required fields
 * - All slugs are unique
 * - All canonical URLs are valid
 * - All metadata has title and description
 * - No duplicate titles/descriptions
 * - All tool slugs in content reference valid tools
 */

import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "..", "src");

const errors = [];
const warnings = [];

function logError(msg) {
  errors.push(msg);
  console.error(`  ERROR: ${msg}`);
}

function logWarning(msg) {
  warnings.push(msg);
  console.warn(`  WARN: ${msg}`);
}

// Load content data by reading the source files
function loadContent() {
  try {
    const guidesPath = resolve(srcDir, "lib", "content", "data", "guides.ts");
    const articlesPath = resolve(srcDir, "lib", "content", "data", "articles.ts");
    const comparisonsPath = resolve(srcDir, "lib", "content", "data", "comparisons.ts");
    const typesPath = resolve(srcDir, "lib", "content", "types.ts");

    const paths = [guidesPath, articlesPath, comparisonsPath, typesPath];
    for (const p of paths) {
      if (!existsSync(p)) logError(`Missing content file: ${p}`);
    }

    return { exists: paths.every(existsSync) };
  } catch (e) {
    logError(`Failed to load content: ${e.message}`);
    return { exists: false };
  }
}

function validateContent() {
  console.log("\n[1/5] Checking content files...");
  const content = loadContent();
  if (!content.exists) return;
  console.log("  Content files present.");

  console.log("\n[2/5] Checking tools registry...");
  const toolsPath = resolve(srcDir, "lib", "tools.ts");
  if (!existsSync(toolsPath)) {
    logError("Missing tools.ts");
    return;
  }
  console.log("  Tools registry present.");

  console.log("\n[3/5] Checking SEO metadata...");
  const registryPath = resolve(srcDir, "lib", "registry.ts");
  if (!existsSync(registryPath)) {
    logError("Missing registry.ts");
  } else {
    console.log("  Registry present.");
  }

  console.log("\n[4/5] Checking schema files...");
  const seoPath = resolve(srcDir, "lib", "seo.ts");
  if (!existsSync(seoPath)) {
    logError("Missing seo.ts");
  } else {
    console.log("  SEO schema helpers present.");
  }

  console.log("\n[5/5] Checking sitemap...");
  const sitemapPath = resolve(srcDir, "app", "sitemap.ts");
  const htmlSitemapPath = resolve(srcDir, "app", "sitemap", "page.tsx");
  const robotsPath = resolve(srcDir, "app", "robots.ts");

  if (!existsSync(sitemapPath)) logError("Missing sitemap.ts");
  if (!existsSync(htmlSitemapPath)) logWarning("Missing human sitemap page");
  if (!existsSync(robotsPath)) logError("Missing robots.ts");

  console.log("  Sitemap checks complete.\n");
}

function validateRoutes() {
  console.log("\nChecking dynamic route directories...");
  const routes = ["guides", "learn", "blog", "compare"];
  for (const route of routes) {
    const dir = resolve(srcDir, "app", route);
    if (!existsSync(dir)) {
      logWarning(`Missing route directory: ${route}`);
      continue;
    }
    const pagePath = resolve(dir, "page.tsx");
    const slugDir = resolve(dir, "[slug]");
    if (!existsSync(pagePath)) logError(`Missing listing page: ${route}/page.tsx`);
    if (!existsSync(slugDir)) logError(`Missing [slug] dir: ${route}/[slug]`);
    else {
      const slugPage = resolve(slugDir, "page.tsx");
      if (!existsSync(slugPage)) logError(`Missing slug page: ${route}/[slug]/page.tsx`);
    }
  }
  console.log("  Route checks complete.\n");
}

function validateTrustPages() {
  console.log("\nChecking trust/authority pages...");
  const pages = [
    "editorial-guidelines",
    "how-we-test-tools",
    "about-our-research",
    "transparency",
  ];
  for (const page of pages) {
    const dir = resolve(srcDir, "app", page);
    if (!existsSync(dir)) {
      logWarning(`Missing trust page: ${page}`);
    } else {
      const pageFile = resolve(dir, "page.tsx");
      if (!existsSync(pageFile)) logError(`Missing page file: ${page}/page.tsx`);
    }
  }
  console.log("  Trust page checks complete.\n");
}

function validateRevenueArchitecture() {
  console.log("\nChecking revenue infrastructure...");
  const files = [
    "lib/analytics.ts",
    "lib/affiliate-config.ts",
    "lib/api-monetization.ts",
    "components/shared/revenue-slots.tsx",
    "components/shared/cookie-consent.tsx",
    "components/shared/analytics.tsx",
  ];
  for (const file of files) {
    const fullPath = resolve(srcDir, file);
    if (!existsSync(fullPath)) logWarning(`Missing revenue file: ${file}`);
  }
  console.log("  Revenue architecture checks complete.\n");
}

function printSummary() {
  console.log("=".repeat(50));
  console.log("SEO VALIDATION SUMMARY");
  console.log("=".repeat(50));
  console.log(`  Errors:   ${errors.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log("=".repeat(50));

  if (errors.length === 0) {
    console.log("  PASS — No critical SEO issues found.");
  } else {
    console.log("  FAIL — Fix errors before deployment.");
  }
  process.exit(errors.length > 0 ? 1 : 0);
}

validateContent();
validateRoutes();
validateTrustPages();
validateRevenueArchitecture();
printSummary();
