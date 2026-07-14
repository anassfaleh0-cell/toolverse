import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, "$1");
const SRC = join(ROOT, "src");

// ── Color database ──
const TAILWIND = {
  slate:   ["#f8fafc","#f1f5f9","#e2e8f0","#cbd5e1","#94a3b8","#64748b","#475569","#334155","#1e293b","#0f172a"],
  gray:    ["#f9fafb","#f3f4f6","#e5e7eb","#d1d5db","#9ca3af","#6b7280","#4b5563","#374151","#1f2937","#111827"],
  zinc:    ["#fafafa","#f4f4f5","#e4e4e7","#d4d4d8","#a1a1aa","#71717a","#52525b","#3f3f46","#27272a","#18181b"],
  neutral: ["#fafafa","#f5f5f5","#e5e5e5","#d4d4d4","#a3a3a3","#737373","#525252","#404040","#262626","#171717"],
  stone:   ["#fafaf9","#f5f5f4","#e7e5e4","#d6d3d1","#a8a29e","#78716c","#57534e","#44403c","#292524","#1c1917"],
  red:     ["#fef2f2","#fee2e2","#fecaca","#fca5a5","#f87171","#ef4444","#dc2626","#b91c1c","#991b1b","#7f1d1d"],
  orange:  ["#fff7ed","#ffedd5","#fed7aa","#fdba74","#fb923c","#f97316","#ea580c","#c2410c","#9a3412","#7c2d12"],
  amber:   ["#fffbeb","#fef3c7","#fde68a","#fcd34d","#fbbf24","#f59e0b","#d97706","#b45309","#92400e","#78350f"],
  yellow:  ["#fefce8","#fef9c3","#fef08a","#fde047","#facc15","#eab308","#ca8a04","#a16207","#854d0e","#713f12"],
  lime:    ["#f7fee7","#ecfccb","#d9f99d","#bef264","#a3e635","#84cc16","#65a30d","#4d7c0f","#3f6212","#365314"],
  green:   ["#f0fdf4","#dcfce7","#bbf7d0","#86efac","#4ade80","#22c55e","#16a34a","#15803d","#166534","#14532d"],
  emerald: ["#ecfdf5","#d1fae5","#a7f3d0","#6ee7b7","#34d399","#10b981","#059669","#047857","#065f46","#064e3b"],
  teal:    ["#f0fdfa","#ccfbf1","#99f6e4","#5eead4","#2dd4bf","#14b8a6","#0d9488","#0f766e","#115e59","#134e4a"],
  cyan:    ["#ecfeff","#cffafe","#a5f3fc","#67e8f9","#22d3ee","#06b6d4","#0891b2","#0e7490","#155e75","#164e63"],
  sky:     ["#f0f9ff","#e0f2fe","#bae6fd","#7dd3fc","#38bdf8","#0ea5e9","#0284c7","#0369a1","#075985","#0c4a6e"],
  blue:    ["#eff6ff","#dbeafe","#bfdbfe","#93c5fd","#60a5fa","#3b82f6","#2563eb","#1d4ed8","#1e40af","#1e3a8a"],
  indigo:  ["#eef2ff","#e0e7ff","#c7d2fe","#a5b4fc","#818cf8","#6366f1","#4f46e5","#4338ca","#3730a3","#312e81"],
  violet:  ["#f5f3ff","#ede9fe","#ddd6fe","#c4b5fd","#a78bfa","#8b5cf6","#7c3aed","#6d28d9","#5b21b6","#4c1d95"],
  purple:  ["#faf5ff","#f3e8ff","#e9d5ff","#d8b4fe","#c084fc","#a855f7","#9333ea","#7e22ce","#6b21a8","#581c87"],
  fuchsia: ["#fdf4ff","#fae8ff","#f5d0fe","#f0abfc","#e879f9","#d946ef","#c026d3","#a21caf","#86198f","#701a75"],
  pink:    ["#fdf2f8","#fce7f3","#fbcfe8","#f9a8d4","#f472b6","#ec4899","#db2777","#be185d","#9d174d","#831843"],
  rose:    ["#fff1f2","#ffe4e6","#fecdd3","#fda4af","#fb7185","#f43f5e","#e11d48","#be123c","#9f1239","#881337"],
};

// Custom colors from globals.css
const CUSTOM = {
  nuvora:  ["#eef2ff","#e0e7ff","#c7d2fe","#a5b4fc","#818cf8","#6366f1","#4f46e5","#4338ca","#3730a3","#312e81"],
  aurora:  ["#ecfdf5","#d1fae5","#a7f3d0","#6ee7b7","#34d399","#10b981","#059669","#047857","#065f46","#064e3b"],
};

// Semantic CSS variable values (light mode defaults)
const SEMANTIC = {
  background: "#fafafa",
  foreground: "#0a0a0a",
  surface: "#ffffff",
  "surface-secondary": "#f5f5f5",
  "border-subtle": "#e5e5e5",
  "text-primary": "#0a0a0a",
  "text-secondary": "#525252",
  "text-tertiary": "#6b6b6b",
};

// Dark mode semantic values
const SEMANTIC_DARK = {
  background: "#08090b",
  foreground: "#f5f5f5",
  surface: "#111113",
  "surface-secondary": "#18181b",
  "border-subtle": "#27272a",
  "text-primary": "#f5f5f5",
  "text-secondary": "#a1a1aa",
  "text-tertiary": "#8a8a8a",
};

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

function linearize(c) {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Build hex lookup
const ALL_COLORS = {};
for (const [name, shades] of Object.entries(TAILWIND)) {
  shades.forEach((hex, i) => { ALL_COLORS[`${name}-${i}00`] = hex; });
  // also 50→050
}
for (const [name, shades] of Object.entries(CUSTOM)) {
  shades.forEach((hex, i) => { ALL_COLORS[`${name}-${i}00`] = hex; });
}
// Add white/black
ALL_COLORS["white"] = "#ffffff";
ALL_COLORS["black"] = "#000000";
ALL_COLORS["transparent"] = "transparent";
ALL_COLORS["current"] = "currentColor";

// Known bg context for files without explicit bg
// These are files we know have specific backgrounds from manual audit
const FILE_BG_OVERRIDES = {};

const textColorRe = /(?<![-\w])(?<!dark:)text-([a-z]+)-(\d{2,3})(?![-\w])/g;
const darkTextColorRe = /dark:text-([a-z]+)-(\d{2,3})/g;
const bgColorRe = /(?<![-\w])bg-([a-z]+)-(\d{2,3}|[a-z]+)(?![-\w])/g;
const placeholderRe = /placeholder-([a-z]+)-(\d{2,3})/g;

function findFiles(dir, results = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      findFiles(full, results);
    } else if (extname(full) === ".tsx") {
      results.push(full);
    }
  }
  return results;
}

function getHex(colorName, shade) {
  const key = `${colorName}-${shade}`;
  if (ALL_COLORS[key]) return ALL_COLORS[key];
  // Try matching tailwind custom
  for (const [name, shades] of Object.entries(TAILWIND)) {
    if (name.startsWith(colorName)) return shades[parseInt(shade)/100] || null;
  }
  for (const [name, shades] of Object.entries(CUSTOM)) {
    if (name === colorName) return shades[parseInt(shade)/100] || null;
  }
  return null;
}

function determineBackground(content, filePath) {
  // Look for explicit bg- classes at the component level
  const bgs = [];
  let match;
  while ((match = bgColorRe.exec(content)) !== null) {
    bgs.push({ color: match[1], shade: match[2] });
  }
  
  // Check for card/container classes that imply bg
  if (content.includes("bg-white") || content.includes('"bg-white ') || content.includes("'bg-white ")) {
    return "#ffffff";
  }
  if (content.includes("bg-surface") || content.includes('"bg-surface ') || content.includes("'bg-surface ")) {
    return "#ffffff";
  }
  if (content.includes("bg-zinc-50")) return TAILWIND.zinc[0];
  if (content.includes("bg-zinc-100")) return TAILWIND.zinc[1];
  if (content.includes("bg-zinc-900")) return TAILWIND.zinc[9];
  if (content.includes("bg-amber-50")) return TAILWIND.amber[0];
  if (content.includes("bg-red-50")) return TAILWIND.red[0];
  if (content.includes("bg-blue-50")) return TAILWIND.blue[0];
  if (content.includes("bg-green-50")) return TAILWIND.green[0];
  if (content.includes("bg-emerald-50")) return TAILWIND.emerald[0];
  if (content.includes("bg-purple-50")) return TAILWIND.purple[0];
  if (content.includes("bg-background")) return "#fafafa";
  
  // Default: white page background
  return "#ffffff";
}

function determineDarkBackground(content) {
  if (content.includes("dark:bg-zinc-900")) return TAILWIND.zinc[9];
  if (content.includes("dark:bg-zinc-800")) return TAILWIND.zinc[8];
  if (content.includes("dark:bg-zinc-950")) return "#09090b";
  if (content.includes("dark:bg-amber-950")) return "#451a03";
  if (content.includes("dark:bg-surface")) return "#111113";
  if (content.includes("dark:bg-background")) return "#08090b";
  return "#08090b"; // default dark bg
}

// ── Main ──
const files = findFiles(SRC);
const results = [];
const alreadyFixedFrom = ["text-green-600","text-amber-600","text-emerald-600","text-aurora-600"];

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const shortPath = file.replace(ROOT, "");
  const lightBg = determineBackground(content, file);
  const darkBg = determineDarkBackground(content);
  
  // Find all text color classes (light mode)
  textColorRe.lastIndex = 0;
  let match;
  while ((match = textColorRe.exec(content)) !== null) {
    const [, color, shade] = match;
    const hex = getHex(color, shade);
    if (!hex || hex === "transparent" || hex === "currentColor") continue;
    
    // Find position context
    const pos = match.index;
    const lineNum = content.slice(0, pos).split("\n").length;
    
    // Check if this is a hover/group-hover variant
    const beforeMatch = content.slice(Math.max(0, pos-30), pos);
    if (beforeMatch.includes("hover:") || beforeMatch.includes("group-hover:")) continue;
    
    const ratio = contrastRatio(hex, lightBg);
    const passes = ratio >= 4.5;
    
    results.push({
      file: shortPath,
      line: lineNum,
      colorClass: `text-${color}-${shade}`,
      hex,
      bg: lightBg,
      bgDesc: "light",
      ratio: ratio.toFixed(2),
      status: passes ? "PASS" : "FAIL",
      mode: "light",
    });
  }
  
  // Find dark mode variants
  darkTextColorRe.lastIndex = 0;
  while ((match = darkTextColorRe.exec(content)) !== null) {
    const [, color, shade] = match;
    const hex = getHex(color, shade);
    if (!hex || hex === "transparent" || hex === "currentColor") continue;
    
    const pos = match.index;
    const lineNum = content.slice(0, pos).split("\n").length;
    
    const ratio = contrastRatio(hex, darkBg);
    const passes = ratio >= 4.5;
    
    results.push({
      file: shortPath,
      line: lineNum,
      colorClass: `dark:text-${color}-${shade}`,
      hex,
      bg: darkBg,
      bgDesc: "dark",
      ratio: ratio.toFixed(2),
      status: passes ? "PASS" : "FAIL",
      mode: "dark",
    });
  }
  
  // Check placeholders (WCAG-exempt but still informative)
  placeholderRe.lastIndex = 0;
  while ((match = placeholderRe.exec(content)) !== null) {
    const [, color, shade] = match;
    const hex = getHex(color, shade);
    if (!hex) continue;
    const pos = match.index;
    const lineNum = content.slice(0, pos).split("\n").length;
    const ratio = contrastRatio(hex, "#ffffff");
    const passes = ratio >= 4.5;
    results.push({
      file: shortPath,
      line: lineNum,
      colorClass: `placeholder-${color}-${shade}`,
      hex,
      bg: "#ffffff",
      bgDesc: "light (placeholder)",
      ratio: ratio.toFixed(2),
      status: passes ? "PASS" : "FAIL",
      mode: "placeholder",
    });
  }
}

// Filter to only failures (plus we want to see all for completeness)
const failures = results.filter(r => r.status === "FAIL");
const passes = results.filter(r => r.status === "PASS");

// Sort failures by ratio ascending
failures.sort((a, b) => parseFloat(a.ratio) - parseFloat(b.ratio));

console.log("=".repeat(80));
console.log("WCAG CONTRAST AUDIT REPORT");
console.log(`Files scanned: ${files.length}`);
console.log(`Total color pairs found: ${results.length}`);
console.log(`Pass: ${passes.length}`);
console.log(`FAIL: ${failures.length}`);
console.log("=".repeat(80));

if (failures.length > 0) {
  console.log("\n── FAILURES ──");
  console.log("File\tLine\tClass\tHex\tBG\tRatio\tMode");
  console.log("-".repeat(80));
  for (const f of failures) {
    console.log(`${f.file}:${f.line}\t${f.colorClass}\t${f.hex}\t${f.bg}\t${f.ratio}:1\t${f.mode}`);
  }
}

console.log("\n── LIGHT MODE FAILURES (>4.5:1 threshold) ──");
for (const f of failures.filter(r => r.mode === "light")) {
  console.log(`${f.file}:${f.line}  ${f.colorClass}  →  ${f.ratio}:1  on ${f.bg}`);
}

console.log("\n── DARK MODE FAILURES (>4.5:1 threshold) ──");
for (const f of failures.filter(r => r.mode === "dark")) {
  console.log(`${f.file}:${f.line}  ${f.colorClass}  →  ${f.ratio}:1  on ${f.bg}`);
}

console.log("\n── PLACEHOLDER FAILURES (informational, WCAG-exempt) ──");
for (const f of failures.filter(r => r.mode === "placeholder")) {
  console.log(`${f.file}:${f.line}  ${f.colorClass}  →  ${f.ratio}:1`);
}

console.log("\nDone.");
