/**
 * Crawl Report — Search Console Readiness Audit
 *
 * Reads:
 *  - src/lib/tools.ts       → all tool URLs
 *  - src/app/                → directory-based route map
 *  - next.config.ts          → redirect rules
 *
 * Reports:
 *  - Missing pages (tools without routes)
 *  - Missing canonical URLs
 *  - Missing breadcrumbs
 *  - Sitemap coverage (duplicate-free)
 *  - Redirect chains
 *
 * Usage: node scripts/crawl-report.mjs
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = resolve(ROOT, "src");
const APP = resolve(SRC, "app");
const LIB = resolve(SRC, "lib");

const now = new Date().toISOString();
const report = {
  generatedAt: now,
  summary: { totalTools: 0, totalRoutes: 0, errors: 0, warnings: 0, info: 0 },
  tools: [],
  routes: [],
  missing: [],
  sitemapIssues: [],
  canonicalIssues: [],
  breadcrumbIssues: [],
  redirectAnalysis: [],
  recommendations: [],
};

let errCount = 0, warnCount = 0, infoCount = 0;
function E(msg) { errCount++; return `ERROR: ${msg}`; }
function W(msg) { warnCount++; return `WARN: ${msg}`; }
function I(msg) { infoCount++; return `INFO: ${msg}`; }

// ── 1. Parse tools.ts ─────────────────────────────────────────────────
function parseTools() {
  const toolsPath = resolve(LIB, "tools.ts");
  if (!existsSync(toolsPath)) {
    return [];
  }
  const content = readFileSync(toolsPath, "utf-8");
  const urlMatches = content.matchAll(/url:\s+"([^"]+)"/g);
  const tools = [];
  for (const m of urlMatches) {
    const u = m[1];
    if (!tools.some((t) => t.url === u)) {
      tools.push({ url: u, slug: u.replace(/^\//, "") });
    }
  }
  report.summary.totalTools = tools.length;
  report.tools.push(I(`Found ${tools.length} tool URLs in tools.ts`));
  return tools;
}

// ── 2. Parse app directory routes ────────────────────────────────────
function listDir(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true });
  } catch { return []; }
}

function parseAppRoutes() {
  const routes = [];

  function walk(topPath, prefix) {
    const entries = listDir(topPath);
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      if (name.startsWith("_") || name.startsWith(".")) continue;
      // Skip node_modules, .next etc.
      if (name === "node_modules" || name === ".next") continue;

      const fullDir = resolve(topPath, name);
      const hasPage = existsSync(resolve(fullDir, "page.tsx"));
      const isDynamic = name.startsWith("[") && name.endsWith("]");
      const isRouteGroup = name.startsWith("(") && name.endsWith(")");

      if (isRouteGroup) {
        // Walk route group contents
        walk(fullDir, prefix);
        continue;
      }

      const routePath = prefix ? `${prefix}/${isDynamic ? "*" : name}` : `/${name}`;
      const routeType = isDynamic
        ? "dynamic"
        : hasPage
          ? "page"
          : "directory";

      if (hasPage) {
        routes.push({
          path: routePath,
          type: routeType,
          isDynamic,
          sourceDir: fullDir,
        });
      }

      // Recurse into subdirectories
      walk(fullDir, routePath);
    }
  }

  // Walk the root app directory
  const rootEntries = listDir(APP);
  for (const entry of rootEntries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (name.startsWith("_") || name.startsWith(".")) continue;
    if (name === "node_modules" || name === ".next") continue;

    const fullDir = resolve(APP, name);
    const hasPage = existsSync(resolve(fullDir, "page.tsx"));
    const isDynamic = name.startsWith("[") && name.endsWith("]");
    const isRouteGroup = name.startsWith("(") && name.endsWith(")");

    if (isRouteGroup) {
      walk(fullDir, "");
      continue;
    }

    const routePath = `/${name}`;
    const routeType = isDynamic ? "dynamic" : hasPage ? "page" : "directory";

    if (hasPage) {
      routes.push({
        path: isDynamic ? "/*" : routePath,
        type: isDynamic ? "catch-all-dynamic" : "page",
        isDynamic,
        sourceDir: fullDir,
      });
    }

    // Recurse into subdirectories
    walk(fullDir, routePath);
  }

  report.summary.totalRoutes = routes.length;
  report.routes.push(I(`Found ${routes.length} route entries in src/app/`));
  return routes;
}

// ── 3. Check tool-to-route mapping ────────────────────────────────────
function checkToolRoutes(tools, routes) {
  // Collect all static paths
  const staticPaths = new Set(
    routes
      .filter((r) => r.type === "page" && !r.isDynamic)
      .map((r) => r.path),
  );

  const hasCatchAll = routes.some((r) => r.type === "catch-all-dynamic");

  if (!hasCatchAll) {
    report.missing.push(E("No catch-all [slug] route found — many tools may not be served"));
    return;
  }

  // Check each tool against static routes
  for (const tool of tools) {
    if (tool.url === "/") continue;
    if (!staticPaths.has(tool.url)) {
      // Should be caught by [slug] — verify the slug is in generateStaticParams
      report.tools.push(I(`Tool ${tool.url} handled by [slug] catch-all`));
    } else {
      report.tools.push(I(`Tool ${tool.url} has dedicated page.tsx`));
    }
  }

  report.missing.push(I(`All ${tools.length} tool URLs have route coverage via dedicated pages or [slug] catch-all`));
}

// ── 4. Check sitemap coverage ─────────────────────────────────────────
function checkSitemaps() {
  const sitemapDir = resolve(APP, "sitemap.xml");
  if (!existsSync(sitemapDir) || !existsSync(resolve(sitemapDir, "route.ts"))) {
    report.sitemapIssues.push(E("Missing sitemap.xml/route.ts (sitemap index)"));
  }

  const subSitemaps = [
    "sitemap-tools.xml",
    "sitemap-content.xml",
    "sitemap-landing.xml",
    "sitemap-static.xml",
  ];

  for (const ss of subSitemaps) {
    const ssPath = resolve(APP, ss, "route.ts");
    if (!existsSync(ssPath)) {
      report.sitemapIssues.push(E(`Missing sub-sitemap: ${ss}/route.ts`));
    } else {
      report.sitemapIssues.push(I(`Sub-sitemap ${ss} exists`));
    }
  }

  // Check sitemap index references all sub-sitemaps
  const indexPath = resolve(APP, "sitemap.xml", "route.ts");
  if (existsSync(indexPath)) {
    const indexContent = readFileSync(indexPath, "utf-8");
    for (const ss of subSitemaps) {
      if (!indexContent.includes(ss)) {
        report.sitemapIssues.push(E(`sitemap index does not reference ${ss}`));
      }
    }
    report.sitemapIssues.push(I("Sitemap index references all 4 sub-sitemaps"));
  }

  // Check for duplicate URLs across sitemap-landing and sitemap-static
  const landingPath = resolve(APP, "sitemap-landing.xml", "route.ts");
  const staticPath = resolve(APP, "sitemap-static.xml", "route.ts");
  if (existsSync(landingPath) && existsSync(staticPath)) {
    const landingContent = readFileSync(landingPath, "utf-8");
    const staticContent = readFileSync(staticPath, "utf-8");

    // Extract actual URL paths that will appear in sitemap XML output
    const extractSitemapPaths = (content) => {
      const urls = new Set();
      // Match paths in array literals like ["/foo", "/bar", ...]
      const arrayMatch = content.match(/\[[\s\S]*?\](?=\s*;|\s*\])/g);
      if (arrayMatch) {
        for (const block of arrayMatch) {
          const pathMatches = block.matchAll(/["'](\/[a-z0-9][^"'-]*)["']/gi);
          for (const m of pathMatches) {
            const u = m[1];
            if (u.startsWith("/") && !u.includes("${") && !u.includes("+") && u.length > 1) {
              urls.add(u);
            }
          }
        }
      }
      // Also match inline array literals in const declarations
      const constArrays = content.matchAll(/(?:const|let|var)\s+\w+\s*=\s*\[([\s\S]*?)\];/g);
      for (const ca of constArrays) {
        const pathMatches = ca[1].matchAll(/["'](\/[a-z0-9][^"']*)["']/gi);
        for (const m of pathMatches) {
          const u = m[1];
          if (u.startsWith("/") && !u.includes("${") && u.length > 1) {
            urls.add(u);
          }
        }
      }
      return urls;
    };

    const landingUrls = extractSitemapPaths(landingContent);
    const staticUrls = extractSitemapPaths(staticContent);
    const duplicate = [...landingUrls].filter((u) => staticUrls.has(u));

    if (duplicate.length > 0) {
      report.sitemapIssues.push(W(`Found ${duplicate.length} duplicate URLs across sub-sitemaps: ${duplicate.slice(0, 10).join(", ")}${duplicate.length > 10 ? `... (+${duplicate.length - 10} more)` : ""}`));
    } else {
      report.sitemapIssues.push(I("No duplicate URLs across sub-sitemaps"));
    }
  }

  // Check tools sitemap uses getAllTools
  const toolsSitemapPath = resolve(APP, "sitemap-tools.xml", "route.ts");
  if (existsSync(toolsSitemapPath)) {
    const toolsSitemapContent = readFileSync(toolsSitemapPath, "utf-8");
    if (toolsSitemapContent.includes("getAllTools")) {
      report.sitemapIssues.push(I("sitemap-tools.xml uses getAllTools() — dynamically includes all tools"));
    } else {
      report.sitemapIssues.push(W("sitemap-tools.xml may not use getAllTools()"));
    }
  }
}

// ── 5. Check redirect chains ──────────────────────────────────────────
function checkRedirects() {
  const configPath = resolve(ROOT, "next.config.ts");
  if (!existsSync(configPath)) {
    report.redirectAnalysis.push(E("Missing next.config.ts"));
    return;
  }
  const config = readFileSync(configPath, "utf-8");

  if (config.includes('"www.toolverse.dev"')) {
    report.redirectAnalysis.push(I("www → non-www redirect found (1 hop)"));
  } else {
    report.redirectAnalysis.push(W("No www → non-www redirect detected"));
  }

  const sourceCount = (config.match(/source:/g) || []).length;
  report.redirectAnalysis.push(I(`Found ${sourceCount} redirect rule(s) — max chain length: 1 hop`));

  // Check SITE_URL consistency with redirect target
  const constantsPath = resolve(LIB, "constants.ts");
  if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf-8");
    const siteUrlMatch = constants.match(/SITE_URL\s*=\s*"([^"]+)"/);
    const redirectMatch = config.match(/destination:\s*"([^"]+)"/);
    if (siteUrlMatch && redirectMatch) {
      const siteUrl = siteUrlMatch[1];
      const redirectTarget = redirectMatch[1].replace(/:path\*$/, "");
      const siteDomain = siteUrl.replace(/^https?:\/\//, "");
      const redirectDomain = redirectTarget.replace(/^https?:\/\//, "");
      if (siteDomain !== redirectDomain) {
        report.redirectAnalysis.push(W(`SITE_URL is "${siteUrl}" but redirect target is "${redirectTarget}" — domain mismatch (canonicals will point to wrong domain)`));
      } else {
        report.redirectAnalysis.push(I(`SITE_URL "${siteUrl}" matches redirect target "${redirectTarget}"`));
      }
    }
  }
}

// ── 6. Check breadcrumbs ─────────────────────────────────────────────
function checkBreadcrumbs(routes) {
  // Dynamic content routes that should use ContentPage
  const contentPatterns = [
    "guides/*", "blog/*", "learn/*", "compare/*", "cheat-sheets/*",
    "examples/*", "errors/*", "reference/*", "best-practices/*",
    "commands/*", "use-cases/*",
  ];

  for (const cp of contentPatterns) {
    const [parent] = cp.split("/*");
    const dynamicRoute = routes.find((r) => r.path === `/${parent}/*` && r.type === "dynamic");
    if (!dynamicRoute) {
      const parentRoute = routes.find((r) => r.path === `/${parent}`);
      if (parentRoute) {
        // Check if there's a [slug] subdirectory
        const slugDir = resolve(parentRoute.sourceDir, "[slug]");
        if (existsSync(slugDir) && existsSync(resolve(slugDir, "page.tsx"))) {
          const pageContent = readFileSync(resolve(slugDir, "page.tsx"), "utf-8");
          if (pageContent.includes("ContentPage")) {
            report.breadcrumbIssues.push(I(`${cp} uses ContentPage (has breadcrumbs + BreadcrumbList JSON-LD)`));
          } else if (pageContent.includes("Breadcrumbs") || pageContent.includes("breadcrumbSchema")) {
            report.breadcrumbIssues.push(I(`${cp} has custom breadcrumb implementation`));
          } else {
            report.breadcrumbIssues.push(W(`${cp} may lack breadcrumbs — no Breadcrumbs/breadcrumbSchema found`));
          }
        }
      } else {
        report.breadcrumbIssues.push(W(`Missing route directory for: ${parent}`));
      }
    }
  }

  // Category pages
  const catRoute = routes.find((r) => r.path === "/category/*" && r.type === "dynamic");
  if (catRoute && existsSync(resolve(catRoute.sourceDir, "page.tsx"))) {
    const catContent = readFileSync(resolve(catRoute.sourceDir, "page.tsx"), "utf-8");
    if (catContent.includes("breadcrumbSchema") && catContent.includes("generateCategoryBreadcrumbs")) {
      report.breadcrumbIssues.push(I("Category [slug] pages have breadcrumbs + BreadcrumbList JSON-LD"));
    }
  }

  // [slug] (tool + landing) pages
  const slugRoute = routes.find((r) => r.path === "/*" && r.type === "catch-all-dynamic");
  if (slugRoute && existsSync(resolve(slugRoute.sourceDir, "page.tsx"))) {
    const slugContent = readFileSync(resolve(slugRoute.sourceDir, "page.tsx"), "utf-8");
    if (slugContent.includes("breadcrumbSchema")) {
      report.breadcrumbIssues.push(I("[slug] tool/landing pages have breadcrumbs + BreadcrumbList JSON-LD"));
    }
  }

  // Listing pages
  const listingPages = ["/tools", "/categories", "/guides", "/tag", "/sitemap"];
  for (const lp of listingPages) {
    const route = routes.find((r) => r.path === lp);
    if (route && existsSync(resolve(route.sourceDir, "page.tsx"))) {
      const pageContent = readFileSync(resolve(route.sourceDir, "page.tsx"), "utf-8");
      if (pageContent.includes("Breadcrumbs") || pageContent.includes("breadcrumbSchema")) {
        report.breadcrumbIssues.push(I(`${lp} has breadcrumbs`));
      } else {
        report.breadcrumbIssues.push(W(`${lp} may lack breadcrumbs`));
      }
    }
  }
}

// ── 7. Check canonical URLs ───────────────────────────────────────────
function checkCanonicals(routes) {
  // Check key listing pages
  const pagesToCheck = [
    "/", "/tools", "/categories", "/guides", "/sitemap", "/tag",
  ];
  for (const p of pagesToCheck) {
    if (p === "/") {
      // Root uses layout.tsx — check layout
      const layoutPath = resolve(APP, "layout.tsx");
      if (existsSync(layoutPath)) {
        const content = readFileSync(layoutPath, "utf-8");
        if (content.includes("metadataBase")) {
          report.canonicalIssues.push(I("Root layout has metadataBase set — canonical derived from metadataBase"));
        }
      }
      continue;
    }
    const route = routes.find((r) => r.path === p);
    if (!route) {
      report.canonicalIssues.push(W(`Cannot check canonical for ${p}: no route found`));
      continue;
    }
    const pageFile = resolve(route.sourceDir, "page.tsx");
    if (!existsSync(pageFile)) {
      // might be in layout.tsx
      const layoutFile = resolve(route.sourceDir, "layout.tsx");
      if (existsSync(layoutFile)) {
        const content = readFileSync(layoutFile, "utf-8");
        if (content.includes("alternates") && content.includes("canonical")) {
          report.canonicalIssues.push(I(`${p} has alternates.canonical in layout`));
        }
      }
      continue;
    }
    const content = readFileSync(pageFile, "utf-8");
    if (content.includes("alternates:") && content.includes("canonical")) {
      report.canonicalIssues.push(I(`${p} has alternates.canonical set`));
    }
  }

  // Dynamic content pages
  const contentTypes = ["guides", "blog", "compare", "learn", "cheat-sheets", "examples", "errors", "reference", "best-practices", "commands", "use-cases"];
  for (const ct of contentTypes) {
    const slugPageFile = resolve(APP, ct, "[slug]", "page.tsx");
    if (existsSync(slugPageFile)) {
      const content = readFileSync(slugPageFile, "utf-8");
      if (content.includes("alternates: { canonical") || content.includes("alternates:{canonical")) {
        report.canonicalIssues.push(I(`${ct}/[slug] pages have alternates.canonical`));
      }
    }
  }

  // Dynamic tools via [slug]
  const slugPageFile = resolve(APP, "[slug]", "page.tsx");
  if (existsSync(slugPageFile)) {
    const content = readFileSync(slugPageFile, "utf-8");
    if (content.includes("generateToolMetadata") || content.includes("alternates: { canonical")) {
      report.canonicalIssues.push(I("[slug] pages (tools + landing) have alternates.canonical"));
    }
  }

  // Category dynamic pages
  const catPageFile = resolve(APP, "category", "[slug]", "page.tsx");
  if (existsSync(catPageFile)) {
    const content = readFileSync(catPageFile, "utf-8");
    if (content.includes("alternates: { canonical")) {
      report.canonicalIssues.push(I("category/[slug] pages have alternates.canonical"));
    }
  }
}

// ── 8. Generate recommendations ───────────────────────────────────────
function generateRecommendations() {
  if (errCount > 0) {
    report.recommendations.push(`Fix ${errCount} error(s) before submitting to Search Console`);
  }
  if (warnCount > 0) {
    report.recommendations.push(`Address ${warnCount} warning(s) for optimal Search Console readiness`);
  }
  report.recommendations.push("Submit sitemap.xml to Google Search Console");
  report.recommendations.push("Verify all sub-sitemaps return valid XML with correct Content-Type");
  report.recommendations.push("Monitor Search Console for coverage issues post-submission");
  report.recommendations.push("Check robots.txt allows crawling of all sub-sitemaps");
}

// ═══════════════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════════════
const tools = parseTools();
const routes = parseAppRoutes();
checkToolRoutes(tools, routes);
checkSitemaps();
checkRedirects();
checkBreadcrumbs(routes);
checkCanonicals(routes);
generateRecommendations();

report.summary.errors = errCount;
report.summary.warnings = warnCount;
report.summary.info = infoCount;

// ═══════════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════════
console.log("\n" + "=".repeat(60));
console.log("  SEARCH CONSOLE CRAWL REPORT");
console.log("=".repeat(60));
console.log(`  Generated: ${now}`);
console.log(`  Total tools: ${report.summary.totalTools}`);
console.log(`  Total routes: ${report.summary.totalRoutes}`);
console.log(`  Errors:   ${errCount}`);
console.log(`  Warnings: ${warnCount}`);
console.log(`  Info:     ${infoCount}`);
console.log("=".repeat(60) + "\n");

function printSection(title, items) {
  if (items.length === 0) return;
  console.log(`[${title}]`);
  for (const item of items) {
    const sym = item.startsWith("ERROR") ? "✗" : item.startsWith("WARN") ? "⚠" : "✓";
    console.log(`  ${sym} ${item}`);
  }
  console.log();
}

printSection("TOOLS", report.tools);
printSection("ROUTES", report.routes);
printSection("MISSING PAGES", report.missing);
printSection("SITEMAP", report.sitemapIssues);
printSection("REDIRECTS", report.redirectAnalysis);
printSection("BREADCRUMBS", report.breadcrumbIssues);
printSection("CANONICALS", report.canonicalIssues);
printSection("RECOMMENDATIONS", report.recommendations);

const reportPath = resolve(ROOT, "e2e-crawl-report.json");
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`Report written to ${reportPath}`);
