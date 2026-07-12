// Direct unit tests for sync process functions from new-tools-config.ts
// Run with: node scripts/test-tools.mjs

// We import the compiled file via tsx
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const code = `
import { NEW_TOOL_CONFIGS } from "../src/lib/new-tools-config.ts";

const tests = [
  {
    name: "html-decoder",
    fn: () => NEW_TOOL_CONFIGS["html-decoder"].process({ input: "&lt;div&gt;Hello &amp; World&lt;/div&gt;" }),
    check: (r) => r.decoded === "<div>Hello & World</div>",
  },
  {
    name: "temperature-converter (C to F)",
    fn: () => NEW_TOOL_CONFIGS["temperature-converter"].process({ value: "100", from: "C", to: "F" }),
    check: (r) => r.result === "212.00°F",
  },
  {
    name: "temperature-converter (F to C)",
    fn: () => NEW_TOOL_CONFIGS["temperature-converter"].process({ value: "32", from: "F", to: "C" }),
    check: (r) => r.result === "0.00°C",
  },
  {
    name: "temperature-converter (C to K)",
    fn: () => NEW_TOOL_CONFIGS["temperature-converter"].process({ value: "0", from: "C", to: "K" }),
    check: (r) => r.result === "273.15°K",
  },
  {
    name: "number-to-words (1234)",
    fn: () => NEW_TOOL_CONFIGS["number-to-words"].process({ input: "1234" }),
    check: (r) => r.words === "One Thousand Two Hundred Thirty Four",
  },
  {
    name: "number-to-words (0)",
    fn: () => NEW_TOOL_CONFIGS["number-to-words"].process({ input: "0" }),
    check: (r) => r.words === "Zero",
  },
  {
    name: "ipv4-ipv6-converter (IPv4 to mapped)",
    fn: () => NEW_TOOL_CONFIGS["ipv4-ipv6-converter"].process({ input: "192.168.1.1" }),
    check: (r) => r.result === "::ffff:192.168.1.1" && r.type === "IPv4",
  },
  {
    name: "ipv4-ipv6-converter (empty)",
    fn: () => NEW_TOOL_CONFIGS["ipv4-ipv6-converter"].process({ input: "" }),
    check: (r) => r.error === "Enter an IP address.",
  },
  {
    name: "scientific-calculator (basic)",
    fn: () => NEW_TOOL_CONFIGS["scientific-calculator"].process({ input: "2 + 2" }),
    check: (r) => r.result === "4",
  },
  {
    name: "scientific-calculator (sin 90)",
    fn: () => NEW_TOOL_CONFIGS["scientific-calculator"].process({ input: "sin(90)" }),
    check: (r) => Math.abs(parseFloat(r.result) - 1) < 0.001,
  },
  {
    name: "bandwidth-calculator",
    fn: () => NEW_TOOL_CONFIGS["bandwidth-calculator"].process({ size: "500", sizeUnit: "MB", speed: "100", speedUnit: "Mbps" }),
    check: (r) => typeof r["Time"] === "string" && r["Time"].includes("s"),
  },
  {
    name: "serp-preview",
    fn: () => NEW_TOOL_CONFIGS["serp-preview"].process({ title: "My Title", url: "example.com", description: "My desc" }),
    check: (r) => r["Title length"] === "8 chars (max 60)" && r["Description length"] === "7 chars (max 160)",
  },
  {
    name: "dns-zone-validator (valid)",
    fn: () => NEW_TOOL_CONFIGS["dns-zone-validator"].process({ input: "@ IN SOA ns1.example.com. admin.example.com. (2026010100 3600 900 604800 86400)\\n@ IN NS ns1.example.com." }),
    check: (r) => r.Status === "Valid",
  },
  {
    name: "dns-zone-validator (missing SOA)",
    fn: () => NEW_TOOL_CONFIGS["dns-zone-validator"].process({ input: "@ IN NS ns1.example.com." }),
    check: (r) => r.Issues.includes("Missing SOA"),
  },
  {
    name: "readme-generator",
    fn: () => NEW_TOOL_CONFIGS["readme-generator"].process({ name: "test", description: "desc", features: "a\\nb", install: "npm i" }),
    check: (r) => r.readme.startsWith("# test"),
  },
  {
    name: "boggle-solver (4x4)",
    fn: () => NEW_TOOL_CONFIGS["boggle-solver"].process({ letters: "RSTLEANOUIMGEFAB", size: "4" }),
    check: (r) => typeof r["Words found"] === "number",
  },
];

let passed = 0;
let failed = 0;

for (const t of tests) {
  try {
    const r = t.fn();
    const ok = t.check(r);
    if (ok) {
      console.log("\\n\\u2713 " + t.name);
      console.log("  Output:", JSON.stringify(r, null, 2));
      passed++;
    } else {
      console.log("\\n\\u2717 " + t.name);
      console.log("  Output:", JSON.stringify(r, null, 2));
      console.log("  FAILED: check returned false");
      failed++;
    }
  } catch (e) {
    console.log("\\n\\u2717 " + t.name);
    console.log("  ERROR:", e.message);
    failed++;
  }
}

console.log("\\n\\n=== Results: " + passed + " passed, " + failed + " failed ===");
process.exit(failed > 0 ? 1 : 0);
`;

// Write inline test file
const testFile = __dirname + "/_test_runner.mjs";
require("fs").writeFileSync(testFile, code);

const p = spawn("C:\\Program Files\\nodejs\\npx.cmd", ["tsx", testFile], {
  cwd: "C:\\Users\\user\\Desktop\\GENESIS\\toolverse",
  stdio: "inherit",
  shell: true,
  timeout: 30000,
});

p.on("exit", (code) => {
  require("fs").unlinkSync(testFile);
  process.exit(code);
});
