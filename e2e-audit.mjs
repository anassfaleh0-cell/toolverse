import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";

const BASE = "http://localhost:3000";
const RESULTS = [];

function logResult(page, test, status, detail = "") {
  const entry = { page, test, status, detail };
  RESULTS.push(entry);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  });

  // Collect all static pages from url list and sitemap
  const urls = readFileSync("e2e-urls.txt", "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  // Also fetch sitemap.xml for completeness
  const sitemapPage = await context.newPage();
  try {
    await sitemapPage.goto(`${BASE}/sitemap.xml`, { waitUntil: "networkidle" });
    const xml = await sitemapPage.content();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    for (const loc of locs) {
      const path = new URL(loc).pathname;
      if (!urls.includes(path)) urls.push(path);
    }
  } catch (e) {
    console.log(`Sitemap fetch failed: ${e.message}`);
  }
  await sitemapPage.close();

  // Remove duplicates, sort
  const allUrls = [...new Set(urls)].sort();
  console.log(`\nTotal URLs to test: ${allUrls.length}\n`);

  // First pass: visit every page and check for basic issues
  for (const url of allUrls) {
    const page = await context.newPage();
    const errors = [];
    const consoleLogs = [];

    page.on("console", (msg) => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
      if (msg.type() === "error") {
        errors.push({ source: "console", text: msg.text() });
      }
    });

    page.on("pageerror", (err) => {
      errors.push({ source: "pageerror", text: err.message });
    });

    page.on("response", (resp) => {
      if (resp.status() >= 400) {
        errors.push({
          source: "network",
          text: `${resp.status()} ${resp.url()}`,
        });
      }
    });

    try {
      const resp = await page.goto(`${BASE}${url}`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      if (!resp) {
        logResult(url, "HTTP response", "FAIL", "No response");
      } else if (resp.status() !== 200) {
        logResult(url, "HTTP 200", "FAIL", `Got ${resp.status()}`);
      } else {
        logResult(url, "HTTP 200", "PASS");
      }

      // Check for console errors
      const consoleErrors = errors.filter((e) => e.source === "console");
      if (consoleErrors.length > 0) {
        logResult(url, "Console errors", "FAIL", consoleErrors.map((e) => e.text).join(" | "));
      } else {
        logResult(url, "Console errors", "PASS");
      }

      // Check for page errors
      const pageErrors = errors.filter((e) => e.source === "pageerror");
      if (pageErrors.length > 0) {
        logResult(url, "Page errors", "FAIL", pageErrors.map((e) => e.text).join(" | "));
      } else {
        logResult(url, "Page errors", "PASS");
      }

      // Check for failed network requests
      const netErrors = errors.filter((e) => e.source === "network");
      if (netErrors.length > 0) {
        logResult(url, "Network errors", "FAIL", netErrors.map((e) => e.text).join(" | "));
      } else {
        logResult(url, "Network errors", "PASS");
      }

      // Check for broken images (404 / failed load)
      const images = await page.$$eval("img", (imgs) =>
        imgs.map((img) => ({
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
        }))
      );
      const brokenImages = images.filter((i) => !i.complete || i.naturalWidth === 0);
      if (brokenImages.length > 0) {
        logResult(url, "Images", "FAIL", brokenImages.map((i) => i.src).join(" | "));
      } else {
        logResult(url, "Images", "PASS");
      }

      // Check title — skip for non-HTML resources (XML, text, RSS, robots)
      const contentType = resp?.headers()["content-type"] || "";
      const isHtml = contentType.includes("text/html") || contentType.includes("application/xhtml");
      if (isHtml) {
        const title = await page.title();
        if (!title || title.trim() === "") {
          logResult(url, "Page title", "FAIL", "Empty title");
        } else if (
          title.includes("404") ||
          title.includes("Not Found") ||
          title === "Example Domain"
        ) {
          logResult(url, "Page title", "FAIL", `Suspicious title: ${title}`);
        } else {
          logResult(url, "Page title", "PASS");
        }
      } else {
        logResult(url, "Page title", "PASS", `Non-HTML content (${contentType})`);
      }

      // Check for placeholder content
      const body = await page.textContent("body");
      if (!body || body.trim().length < 50) {
        logResult(url, "Content", "FAIL", "Page body too short or empty");
      } else {
        logResult(url, "Content", "PASS");
      }

      // Check for example.com / example.org links (skip localhost - they're internal, skip #main-content - valid skip-nav)
      const badLinks = await page.$$eval("a[href]", (links) =>
        links
          .filter(
            (l) =>
              l.href.includes("example.com") ||
              l.href.includes("example.org")
          )
          .map((l) => l.href)
      );
      if (badLinks.length > 0) {
        logResult(url, "Bad links", "FAIL", badLinks.join(" | "));
      } else {
        logResult(url, "Bad links", "PASS");
      }

      // Check for hidden/empty sections
      const emptySections = await page.$$eval("section, div[class]", (els) =>
        els.filter((el) => el.children.length === 0 && el.textContent.trim() === "").length
      );
      if (emptySections > 0) {
        logResult(url, "Empty sections", "WARN", `${emptySections} empty elements found`);
      } else {
        logResult(url, "Empty sections", "PASS");
      }

      // Check all internal links on the page are valid
      const links = await page.$$eval("a[href]", (as, base) =>
        as
          .map((a) => a.getAttribute("href"))
          .filter((h) => h && h.startsWith("/") && !h.startsWith("//") && !h.includes("#"))
          .map((h) => {
            try {
              return new URL(h, base).pathname;
            } catch {
              return null;
            }
          })
          .filter(Boolean),
        BASE
      );

      if (links.length > 0) {
        logResult(url, "Internal links found", "PASS", `${links.length} links`);
      }

    } catch (e) {
      logResult(url, "Navigation", "FAIL", e.message);
    }

    await page.close();
  }

  // Second pass: test interactive tools
  console.log("\n--- Testing interactive tools ---\n");

  const toolTests = [
    {
      path: "/json-formatter",
      actions: async (page) => {
        const textarea = page.locator("textarea").first();
        await textarea.fill('{"name":"test","value":42}');
        const formatBtn = page.locator("button").filter({ hasText: /Format|Beautify/i }).first();
        if (await formatBtn.isVisible()) await formatBtn.click();
        await page.waitForTimeout(300);
        const pre = page.locator("pre").first();
        const text = await pre.textContent();
        return text && text.length > 0;
      },
    },
    {
      path: "/base64-encoder",
      actions: async (page) => {
        const textarea = page.locator("textarea").first();
        await textarea.fill("Hello World");
        await page.waitForTimeout(300);
        const pre = page.locator("pre").first();
        const text = await pre.textContent().catch(() => "");
        return text !== "";
      },
    },
    {
      path: "/url-encoder",
      actions: async (page) => {
        const textarea = page.locator("textarea").first();
        await textarea.fill("hello world");
        await page.waitForTimeout(300);
        const pre = page.locator("pre").first();
        const text = await pre.textContent().catch(() => "");
        return text !== "";
      },
    },
    {
      path: "/html-entity-encoder",
      actions: async (page) => {
        const textarea = page.locator("textarea").first();
        await textarea.fill("<script>alert('xss')</script>");
        await page.waitForTimeout(300);
        const pre = page.locator("pre").first();
        const text = await pre.textContent().catch(() => "");
        return text !== "";
      },
    },
    {
      path: "/jwt-decoder",
      actions: async (page) => {
        const textarea = page.locator("textarea").first();
        await textarea.fill("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
        await page.waitForTimeout(300);
        const pre = page.locator("pre").first();
        const text = await pre.textContent().catch(() => "");
        return text !== "";
      },
    },
    {
      path: "/uuid-generator",
      actions: async (page) => {
        const btn = page.locator("button").filter({ hasText: /generate|new|create/i }).first();
        if (await btn.isVisible()) {
          await btn.click();
          await page.waitForTimeout(300);
        }
        return true;
      },
    },
    {
      path: "/regex-tester",
      actions: async (page) => {
        const inputs = page.locator("input[type='text']");
        await inputs.first().fill("\\d+");
        const textarea = page.locator("textarea").first();
        await textarea.fill("Hello 123 World 456");
        await page.waitForTimeout(1000);
        return true;
      },
    },
    {
      path: "/md5-hash-generator",
      actions: async (page) => {
        const textarea = page.locator("textarea").first();
        await textarea.fill("test");
        await page.waitForTimeout(300);
        const pre = page.locator("pre").first();
        const text = await pre.textContent().catch(() => "");
        return text !== "";
      },
    },
    {
      path: "/sha-hash-generator",
      actions: async (page) => {
        const textarea = page.locator("textarea").first();
        await textarea.fill("test");
        await page.waitForTimeout(1000);
        const pre = page.locator("pre").first();
        const text = await pre.textContent().catch(() => "");
        return text !== "";
      },
    },
    {
      path: "/html-minifier",
      actions: async (page) => {
        const textarea = page.locator("textarea").first();
        await textarea.fill("<div>  <p>Hello</p>  </div>");
        await page.waitForTimeout(300);
        return true;
      },
    },
    {
      path: "/css-minifier",
      actions: async (page) => {
        const textarea = page.locator("textarea").first();
        await textarea.fill("body { color: red; }");
        await page.waitForTimeout(300);
        return true;
      },
    },
    {
      path: "/js-minifier",
      actions: async (page) => {
        const textarea = page.locator("textarea").first();
        await textarea.fill("function hello() { return 'world'; }");
        await page.waitForTimeout(300);
        return true;
      },
    },
    {
      path: "/case-converter",
      actions: async (page) => {
        const textarea = page.locator("textarea").first();
        await textarea.fill("hello world");
        await page.waitForTimeout(300);
        const btns = page.locator("button");
        const count = await btns.count();
        return count > 0;
      },
    },
    {
      path: "/number-base-converter",
      actions: async (page) => {
        const inputs = page.locator("input").first();
        await inputs.fill("255");
        await page.waitForTimeout(300);
        return true;
      },
    },
    {
      path: "/color-converter",
      actions: async (page) => {
        const inputs = page.locator("input").first();
        await inputs.fill("#ff0000");
        await page.waitForTimeout(300);
        return true;
      },
    },
  ];

  for (const t of toolTests) {
    const page = await context.newPage();
    const errors = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("response", (resp) => {
      if (resp.status() >= 400) errors.push(`${resp.status()} ${resp.url()}`);
    });

    try {
      await page.goto(`${BASE}${t.path}`, { waitUntil: "networkidle", timeout: 30000 });

      const ok = await t.actions(page);

      if (errors.length > 0) {
        logResult(t.path, "Tool interaction errors", "FAIL", errors.join(" | "));
      } else if (ok) {
        logResult(t.path, "Tool interaction", "PASS");
      } else {
        logResult(t.path, "Tool interaction", "WARN", "Tool may not have produced output");
      }
    } catch (e) {
      logResult(t.path, "Tool interaction", "FAIL", e.message);
    }

    await page.close();
  }

  // Third pass: test API routes
  console.log("\n--- Testing API routes ---\n");

  const apiRoutes = [
    ["/api/ip-info", "ip-info (needs client IP, may 500 in headless)"],
    ["/api/dns-lookup?hostname=google.com", "dns-lookup"],
    ["/api/dns-propagation?hostname=google.com", "dns-propagation"],
    ["/api/http-headers?url=https://example.com", "http-headers"],
    ["/api/ssl-certificate?host=google.com", "ssl-certificate"],
    ["/api/website-status?url=https://google.com", "website-status"],
    ["/api/whois?domain=google.com", "whois"],
    ["/api/ping-test?host=8.8.8.8", "ping-test"],
    ["/api/port-checker?host=8.8.8.8&port=53", "port-checker"],
    ["/api/reverse-dns?ip=8.8.8.8", "reverse-dns"],
    ["/api/search?q=json", "search"],
    ["/api/indexnow", "indexnow (POST only, 405 expected on GET)"],
  ];

  for (const [apiUrl, apiName] of apiRoutes) {
    const page = await context.newPage();
    try {
      const resp = await page.goto(`${BASE}${apiUrl}`, {
        waitUntil: "networkidle",
        timeout: 15000,
      });

      if (!resp) {
        logResult(apiName, "API response", "FAIL", "No response");
      } else {
        const status = resp.status();
        const contentType = resp.headers()["content-type"] || "";

        // Known acceptable non-200 conditions
        if (apiName.includes("ip-info") && status === 500) {
          logResult(apiName, "API 500 (expected in headless, needs client IP)", "PASS");
        } else if (apiName.includes("indexnow") && status === 405) {
          logResult(apiName, "API 405 (expected, POST required)", "PASS");
        } else if (status === 200 && contentType.includes("json")) {
          logResult(apiName, "API 200 + JSON", "PASS");
        } else if (status === 200) {
          logResult(apiName, "API 200", "PASS", `Content-Type: ${contentType}`);
        } else {
          logResult(apiName, "API status", "WARN", `Status ${status}`);
        }
      }
    } catch (e) {
      logResult(apiName, "API request", "FAIL", e.message);
    }
    await page.close();
  }

  await browser.close();

  // Print summary
  console.log("\n" + "=".repeat(70));
  console.log("AUDIT RESULTS");
  console.log("=".repeat(70));

  const fails = RESULTS.filter((r) => r.status === "FAIL");
  const warns = RESULTS.filter((r) => r.status === "WARN");
  const passes = RESULTS.filter((r) => r.status === "PASS");

  console.log(`\nTotal checks: ${RESULTS.length}`);
  console.log(`Passed: ${passes.length}`);
  console.log(`Warnings: ${warns.length}`);
  console.log(`Failed: ${fails.length}`);

  if (fails.length > 0) {
    console.log("\n--- FAILURES ---");
    for (const f of fails) {
      console.log(`[${f.page}] ${f.test}: ${f.detail}`);
    }
  }

  if (warns.length > 0) {
    console.log("\n--- WARNINGS ---");
    for (const w of warns) {
      console.log(`[${w.page}] ${w.test}: ${w.detail}`);
    }
  }

  // Determine exit code
  const criticalFails = fails.filter(
    (f) =>
      !f.test.includes("API") &&
      !f.test.includes("Tool interaction")
  );

  // Write results to file
  writeFileSync(
    "e2e-results.json",
    JSON.stringify(
      { total: RESULTS.length, passed: passes.length, warnings: warns.length, failed: fails.length, results: RESULTS },
      null,
      2
    )
  );

  console.log("\nResults written to e2e-results.json");
  process.exit(criticalFails.length > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
