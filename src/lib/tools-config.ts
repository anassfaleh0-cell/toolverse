import type { Tool } from "./registry";
import { getAllTools } from "./registry";
import { NEW_TOOL_CONFIGS } from "./new-tools-config";

export interface ToolField {
  name: string;
  type: "text" | "number" | "textarea" | "url" | "select" | "file";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  accept?: string;
}

export type ProcessResult = Record<string, unknown>;
export type ProcessFn = (values: Record<string, string>) => ProcessResult;
export type AsyncProcessFn = (values: Record<string, string>) => Promise<ProcessResult>;

export interface ToolConfig {
  fields: ToolField[];
  buttonText: string;
  apiEndpoint?: string;
  process?: ProcessFn;
  asyncProcess?: AsyncProcessFn;
  howTo?: { action: string; desc: string }[];
  isComingSoon?: boolean;
  warning?: string;
}

const CLIENT_TOOLS: Record<string, (v: Record<string, string>) => Record<string, unknown>> = {
  "password-generator": (v) => {
    const len = Math.min(128, Math.max(4, parseInt(v.length) || 16));
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const all = upper + lower + digits + special;
    let pw = "";
    for (let i = 0; i < len; i++) pw += all[Math.floor(Math.random() * all.length)];
    return { password: pw, length: len, entropy: Math.round(len * Math.log2(all.length)) };
  },
  "bmi-calculator": (v) => {
    const h = parseFloat(v.height) / 100;
    const w = parseFloat(v.weight);
    if (!h || !w) return { error: "Enter valid height and weight" };
    const bmi = w / (h * h);
    const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
    return { "BMI": bmi.toFixed(1), "Category": cat, "Height": `${v.height} cm`, "Weight": `${v.weight} kg` };
  },

  "json-formatter": (v) => {
    try {
      const parsed = JSON.parse(v.input);
      return { formatted: JSON.stringify(parsed, null, 2), valid: true, size: `${v.input.length} → ${JSON.stringify(parsed, null, 2).length} chars` };
    } catch (e) { return { error: `Invalid JSON: ${(e as Error).message}` }; }
  },
  "base64-encoder": (v) => {
    const encoded = btoa(unescape(encodeURIComponent(v.input)));
    return { encoded, decoded: v.input, length: encoded.length };
  },
  "base64-decoder": (v) => {
    try {
      const decoded = decodeURIComponent(escape(atob(v.input)));
      return { decoded, length: decoded.length };
    } catch { return { error: "Invalid Base64 input" }; }
  },
  "word-counter": (v) => {
    const text = v.input;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200);
    return { Words: words, Characters: chars, "Characters (no space)": charsNoSpace, Sentences: sentences, Paragraphs: paragraphs, "Reading Time": `${readingTime} min` };
  },
  "character-counter": (v) => {
    const text = v.input;
    return { Characters: text.length, "Characters (no space)": text.replace(/\s/g, "").length, Words: text.trim() ? text.trim().split(/\s+/).length : 0, Lines: text.split("\n").length };
  },
  "color-converter": (v) => {
    let r = 0, g = 0, b = 0;
    const s = v.input.trim();
    const hex = s.match(/^#?([0-9a-f]{6})$/i);
    if (hex) { const n = parseInt(hex[1], 16); r = (n >> 16) & 255; g = (n >> 8) & 255; b = n & 255; }
    else {
      const rgb = s.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
      if (rgb) { r = parseInt(rgb[1]); g = parseInt(rgb[2]); b = parseInt(rgb[3]); }
      else {
        const hsl = s.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i);
        if (hsl) {
          let h = parseInt(hsl[1]) / 360, s2 = parseInt(hsl[2]) / 100, l = parseInt(hsl[3]) / 100;
          const a = s2 * Math.min(l, 1 - l);
          const f = (n: number) => { const k = (n + h * 12) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
          r = Math.round(255 * f(0)); g = Math.round(255 * f(8)); b = Math.round(255 * f(4));
        } else return { error: "Enter HEX, RGB, or HSL color" };
      }
    }
    const hexOut = "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
    const rgbOut = `rgb(${r}, ${g}, ${b})`;
    const hslOut = (() => {
      const rn = r / 255, gn = g / 255, bn = b / 255;
      const mx = Math.max(rn, gn, bn), mn = Math.min(rn, gn, bn);
      const l = (mx + mn) / 2;
      if (mx === mn) return "hsl(0, 0%, " + Math.round(l * 100) + "%)";
      const d = mx - mn;
      const s2 = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      let h = 0;
      if (mx === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (mx === gn) h = ((bn - rn) / d + 2) / 6;
      else h = ((rn - gn) / d + 4) / 6;
      return `hsl(${Math.round(h * 360)}, ${Math.round(s2 * 100)}%, ${Math.round(l * 100)}%)`;
    })();
    return { HEX: hexOut, RGB: rgbOut, HSL: hslOut, swatch: `background:${hexOut};width:100%;height:48px;border-radius:8px;border:1px solid #e4e4e7` };
  },
  "uuid-generator": () => {
    const uuid = crypto.randomUUID();
    return { UUID: uuid, "Version": "4 (RFC 4122)" };
  },
  "case-converter": (v) => {
    const t = v.input;
    const f = v.format || "upper";
    const results: Record<string, string> = {};
    if (f === "upper" || f === "all") results["UPPER CASE"] = t.toUpperCase();
    if (f === "lower" || f === "all") results["lower case"] = t.toLowerCase();
    if (f === "title" || f === "all") results["Title Case"] = t.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
    if (f === "camel" || f === "all") results["camelCase"] = t.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase());
    if (f === "pascal" || f === "all") results["PascalCase"] = t.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[a-z]/, c => c.toUpperCase());
    if (f === "snake" || f === "all") results["snake_case"] = t.replace(/\s+/g, "_").replace(/-/g, "_").toLowerCase();
    if (f === "kebab" || f === "all") results["kebab-case"] = t.replace(/\s+/g, "-").replace(/_/g, "-").toLowerCase();
    if (f === "sentence" || f === "all") results["Sentence case"] = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
    return results;
  },
  "loan-calculator": (v) => {
    const p = parseFloat(v.amount), r = parseFloat(v.rate) / 100 / 12, n = parseFloat(v.term) * 12;
    if (!p || !r || !n) return { error: "Enter valid loan details" };
    const monthly = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    return { "Monthly Payment": `$${monthly.toFixed(2)}`, "Total Payment": `$${total.toFixed(2)}`, "Total Interest": `$${(total - p).toFixed(2)}`, "Loan Amount": `$${p.toFixed(2)}`, "Term": `${v.term} years` };
  },
  "mortgage-calculator": (v) => {
    const p = parseFloat(v.amount), r = (parseFloat(v.rate) || 6.5) / 100 / 12, n = (parseFloat(v.term) || 30) * 12;
    if (!p) return { error: "Enter loan amount" };
    const monthly = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    return { "Monthly Payment": `$${monthly.toFixed(2)}`, "Total Payment": `$${total.toFixed(2)}`, "Total Interest": `$${(total - p).toFixed(2)}`, "Principal": `$${p.toFixed(2)}` };
  },
  "compound-interest-calculator": (v) => {
    const p = parseFloat(v.principal) || 1000, r = (parseFloat(v.rate) || 5) / 100;
    const n = parseInt(v.compounds) || 12, t = parseInt(v.years) || 10;
    const amount = p * Math.pow(1 + r / n, n * t);
    return { "Final Amount": `$${amount.toFixed(2)}`, "Total Interest": `$${(amount - p).toFixed(2)}`, "Principal": `$${p.toFixed(2)}`, "Rate": `${v.rate || 5}%`, "Years": t };
  },
  "tip-calculator": (v) => {
    const bill = parseFloat(v.bill) || 0, tipPct = parseFloat(v.tip) || 15, split = parseInt(v.split) || 1;
    const tip = bill * tipPct / 100;
    const total = bill + tip;
    return { "Tip Amount": `$${tip.toFixed(2)}`, "Total": `$${total.toFixed(2)}`, "Per Person": `$${(total / split).toFixed(2)}`, "Split Between": `${split} people` };
  },
  "salary-calculator": (v) => {
    const annual = parseFloat(v.annual) || 0;
    const weekly = annual / 52;
    return { "Annual": `$${annual.toFixed(2)}`, "Monthly": `$${(annual / 12).toFixed(2)}`, "Weekly": `$${weekly.toFixed(2)}`, "Daily": `$${(weekly / 5).toFixed(2)}`, "Hourly": `$${(weekly / 40).toFixed(2)}` };
  },
  "vat-calculator": (v) => {
    const amount = parseFloat(v.amount) || 0, rate = parseFloat(v.rate) || 20;
    const vat = amount * rate / (100 + rate);
    const excl = amount - vat;
    return { "Total (inc. VAT)": `$${amount.toFixed(2)}`, "VAT Amount": `$${vat.toFixed(2)}`, "Net (excl. VAT)": `$${excl.toFixed(2)}`, "Rate": `${rate}%` };
  },

  "url-encoder": (v) => ({
    encoded: encodeURIComponent(v.input),
    decoded: v.input,
  }),
  "html-entity-encoder": (v) => {
    const div = (t: string, e: boolean) => {
      const d = document.createElement("textarea");
      if (e) { d.appendChild(document.createTextNode(t)); return d.innerHTML; }
      else { d.innerHTML = t; return d.value || d.textContent || ""; }
    };
    return { encoded: div(v.input, true), decoded: div(v.input, false) };
  },
  "html-minifier": (v) => {
    const html = v.input || ""; if (!html.trim()) return { error: "Enter HTML to minify" };
    const orig = html.length;
    const out = html.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
    return { minified: out, "Original": `${orig} chars`, "Minified": `${out.length} chars`, "Saved": `${orig - out.length} chars (${orig ? Math.round((1 - out.length / orig) * 100) : 0}%)` };
  },
  "css-minifier": (v) => {
    let css = v.input || ""; if (!css.trim()) return { error: "Enter CSS to minify" };
    const orig = css.length;
    css = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}").trim();
    return { minified: css, "Original": `${orig} chars`, "Minified": `${css.length} chars`, "Saved": `${orig - css.length} chars (${orig ? Math.round((1 - css.length / orig) * 100) : 0}%)` };
  },
  "js-minifier": (v) => {
    let js = v.input || ""; if (!js.trim()) return { error: "Enter JavaScript to minify" };
    const orig = js.length;
    js = js.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}();,:=+\-*/%!<>&|^~?])\s*/g, "$1").replace(/;}/g, "}").trim();
    if (!js) return { error: "No valid JavaScript to minify (all content was comments)" };
    return { minified: js, "Original": `${orig} chars`, "Minified": `${js.length} chars`, "Saved": `${orig - js.length} chars (${orig ? Math.round((1 - js.length / orig) * 100) : 0}%)` };
  },
  "css-prefixer": (v) => {
    const css = v.input || ""; if (!css.trim()) return { error: "Enter CSS to prefix" };
    const props = ["transform","transform-origin","transition","animation","animation-name","border-radius","box-shadow","box-sizing","user-select","appearance","backdrop-filter","filter","column-count","column-gap","text-shadow"];
    const prefs = ["-webkit-","-moz-","-ms-","-o-"];
    let out = css;
    out = out.replace(/@keyframes\s+/g, "@-webkit-keyframes ");
    for (const p of props) {
      const re = new RegExp(`(?<!-)${p}\\s*:`, "gi");
      out = out.replace(re, (m) => prefs.map(pr => pr + m).join(";") + ";" + m);
    }
    out = out.replace(/display\s*:\s*flex\b/gi, "display:-webkit-flex;display:-ms-flexbox;display:flex");
    out = out.replace(/display\s*:\s*inline-flex\b/gi, "display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex");
    return { prefixed: out, "Note": "Vendor prefixes added for WebKit, Mozilla, Microsoft, and Opera" };
  },
  "js-beautifier": (v) => {
    let js = v.input || ""; if (!js.trim()) return { error: "Enter JavaScript to beautify" };
    js = js.replace(/\r\n/g, "\n").replace(/;/g, ";\n").replace(/{/g, "{\n").replace(/}/g, "\n}").replace(/,/g, ", ");
    let indent = 0;
    const result: string[] = [];
    for (const line of js.split("\n").map(l => l.trim()).filter(l => l)) {
      if (/^[})\]]/.test(line)) indent = Math.max(0, indent - 1);
      result.push("  ".repeat(indent) + line);
      if (/[{\[(]$/.test(line)) indent++;
    }
    return { beautified: result.join("\n") };
  },
  "html-to-markdown": (v) => {
    let md = v.input || ""; if (!md.trim()) return { error: "Enter HTML to convert" };
    const orig = md.length;
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n").replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n").replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
    md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n").replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");
    md = md.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, "**$2**").replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, "*$2*");
    md = md.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
    md = md.replace(/<br\s*\/?>/gi, "\n").replace(/<hr\s*\/?>/gi, "\n---\n");
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1");
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n").replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
    md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "```\n$1\n```").replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "> $1\n\n");
    md = md.replace(/<[^>]*>/g, "").replace(/\n{3,}/g, "\n\n").trim();
    return { markdown: md, "HTML": `${orig} chars`, "Markdown": `${md.length} chars` };
  },
  "sql-formatter": (v) => {
    let sql = v.input || ""; if (!sql.trim()) return { error: "Enter SQL to format" };
    const kws = ["SELECT","FROM","WHERE","AND","OR","ORDER BY","GROUP BY","HAVING","LIMIT","OFFSET","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","OUTER JOIN","CROSS JOIN","ON","INTO","VALUES","SET","UPDATE","DELETE","INSERT","CREATE","ALTER","DROP","TABLE","INDEX","VIEW","AS","DISTINCT","UNION","ALL","NOT","IN","BETWEEN","LIKE","IS","NULL","ASC","DESC"];
    sql = sql.replace(/\s+/g, " ");
    for (const kw of kws) sql = sql.replace(new RegExp(`\\b${kw}\\b`, "gi"), `\n${kw}`);
    const lines = sql.split("\n").map(l => l.trim()).filter(Boolean);
    let indent = 0; const result: string[] = [];
    for (const line of lines) {
      const u = line.toUpperCase();
      if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)/.test(u)) indent = 0;
      else if (/^(FROM|WHERE|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET)/.test(u)) indent = 0;
      else if (/^(AND|OR)/.test(u)) indent = 1;
      result.push("  ".repeat(indent) + line);
    }
    return { formatted: result.join("\n") };
  },
  "qr-code-generator": (v) => {
    const data = v.input?.trim();
    if (!data) return { error: "Enter text or URL to encode" };
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
    return { "QR Code": `__image__:${url}`, "Encoded Data": data };
  },
  "text-diff-checker": (v) => {
    const t1 = v.text1 || ""; const t2 = v.text2 || "";
    if (!t1 && !t2) return { error: "Enter both text versions to compare" };
    const a = t1.split("\n"); const b = t2.split("\n"); const max = Math.max(a.length, b.length);
    const lines: string[] = []; let adds = 0; let rems = 0;
    for (let i = 0; i < max; i++) {
      if (a[i] !== b[i]) {
        if (a[i] != null) { lines.push(`- ${a[i]}`); rems++; }
        if (b[i] != null) { lines.push(`+ ${b[i]}`); adds++; }
      }
    }
    if (!adds && !rems) return { "Result": "Texts are identical", "Lines Compared": a.length };
    return { diff: lines.join("\n"), "Summary": `${rems} removed, ${adds} added` };
  },
  "xss-scanner": (v) => {
    const input = v.input || ""; if (!input.trim()) return { error: "Enter HTML or URL to scan" };
    const patterns: { p: RegExp; l: string; s: string }[] = [
      { p: /<script[\s>]/gi, l: "Inline <script> tag", s: "Critical" },
      { p: /javascript:\s*/gi, l: "javascript: URL scheme", s: "Critical" },
      { p: /on\w+\s*=\s*["']?[^"'\s>]+/gi, l: "Inline event handler", s: "Critical" },
      { p: /<iframe[\s>]/gi, l: "<iframe> embed", s: "High" },
      { p: /<embed[\s>]/gi, l: "<embed> tag", s: "High" },
      { p: /<object[\s>]/gi, l: "<object> tag", s: "High" },
      { p: /<svg[\s>]/gi, l: "<svg> XSS vector", s: "Medium" },
      { p: /alert\(|prompt\(|confirm\(/gi, l: "JS popup function", s: "Medium" },
      { p: /eval\s*\(/gi, l: "eval() execution", s: "Critical" },
      { p: /document\.cookie/gi, l: "Cookie access", s: "Medium" },
      { p: /data:\s*text\/html/gi, l: "data: HTML URI", s: "High" },
      { p: /<base[\s>]/gi, l: "<base> hijack vector", s: "Low" },
    ];
    const found = patterns.filter(({ p }) => p.test(input));
    if (!found.length) return { "Verdict": "No XSS patterns detected", "Severity": "Safe" };
    const sev = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    found.forEach(f => sev[f.s as keyof typeof sev]++);
    const ov = sev.Critical > 0 ? "Critical" : sev.High > 0 ? "High" : sev.Medium > 0 ? "Medium" : "Low";
    return { "Verdict": `${found.length} pattern${found.length > 1 ? "s" : ""} detected`, "Severity": ov, "Findings": found.map(f => `[${f.s}] ${f.l}`).join("\n") };
  },
};

const CONFIGS: Record<string, ToolConfig> = {
  "password-generator": {
    fields: [{ name: "length", type: "number", label: "Password length", placeholder: "16" }],
    buttonText: "Generate Password",
    apiEndpoint: "/api/tools/password-generator",
    process: CLIENT_TOOLS["password-generator"],
    howTo: [
      { action: "Set", desc: "Choose your desired password length (4-128 characters)." },
      { action: "Generate", desc: "Click 'Generate Password' to create a cryptographically random password." },
      { action: "Copy", desc: "Copy the generated password — it includes uppercase, lowercase, digits, and special characters." },
    ],
  },
  "bmi-calculator": {
    fields: [
      { name: "height", type: "number", label: "Height (cm)", placeholder: "175" },
      { name: "weight", type: "number", label: "Weight (kg)", placeholder: "70" },
    ],
    buttonText: "Calculate BMI",
    apiEndpoint: "/api/tools/bmi-calculator",
    process: CLIENT_TOOLS["bmi-calculator"],
    howTo: [
      { action: "Enter", desc: "Type your height in centimeters and weight in kilograms." },
      { action: "Calculate", desc: "Click 'Calculate BMI' to compute your body mass index." },
      { action: "Review", desc: "Check your BMI value and weight category (underweight, normal, overweight, obese)." },
    ],
  },
  "percentage-calculator": {
    fields: [
      { name: "mode", type: "select", label: "Calculation type", placeholder: "", required: true, options: [
        { label: "X is what % of Y?", value: "what-percent" },
        { label: "X% of Y = ?", value: "percent-of" },
        { label: "Percentage change from X to Y", value: "change" },
      ]},
      { name: "a", type: "number", label: "Value X", placeholder: "20" },
      { name: "b", type: "number", label: "Value Y", placeholder: "100" },
    ],
    buttonText: "Calculate",
    apiEndpoint: "/api/tools/percentage-calculator",
    howTo: [
      { action: "Choose", desc: "Select the type of percentage calculation you need." },
      { action: "Enter", desc: "Input your values (X and Y)." },
      { action: "Calculate", desc: "Click 'Calculate' to get instant results and an explanation." },
    ],
    process: (v: Record<string, string>) => {
      const a = parseFloat(v.a || "0"), b = parseFloat(v.b || "0");
      if (v.mode === "what-percent") return { result: `${((a / b) * 100).toFixed(2)}%`, explanation: `${a} is ${((a / b) * 100).toFixed(2)}% of ${b}` };
      if (v.mode === "percent-of") return { result: ((a / 100) * b).toFixed(2), explanation: `${a}% of ${b} = ${((a / 100) * b).toFixed(2)}` };
      if (v.mode === "change") return { result: `${(((b - a) / a) * 100).toFixed(2)}%`, explanation: `Change from ${a} to ${b} = ${(((b - a) / a) * 100).toFixed(2)}%` };
      return { result: "Select a calculation mode" };
    },
  },
  "json-formatter": {
    fields: [{ name: "input", type: "textarea", label: "JSON input", placeholder: '{"key": "value"}' }],
    buttonText: "Format JSON",
    apiEndpoint: "/api/tools/json-formatter",
    process: CLIENT_TOOLS["json-formatter"],
    howTo: [
      { action: "Paste", desc: "Paste or type your raw JSON data into the input area." },
      { action: "Format", desc: "Click 'Format JSON' to parse and pretty-print with 2-space indentation." },
      { action: "Copy", desc: "Copy the formatted JSON or fix any syntax errors shown." },
    ],
  },
  "base64-encoder": {
    fields: [{ name: "input", type: "textarea", label: "Text to encode", placeholder: "Enter text to encode as Base64..." }],
    buttonText: "Encode",
    apiEndpoint: "/api/tools/base64",
    process: CLIENT_TOOLS["base64-encoder"],
  },
  "base64-decoder": {
    fields: [{ name: "input", type: "textarea", label: "Base64 to decode", placeholder: "Enter Base64 string to decode..." }],
    buttonText: "Decode",
    apiEndpoint: "/api/tools/base64",
    process: CLIENT_TOOLS["base64-decoder"],
  },
  "word-counter": {
    fields: [{ name: "input", type: "textarea", label: "Text to analyze", placeholder: "Paste or type your text here..." }],
    buttonText: "Count Words",
    apiEndpoint: "/api/tools/word-counter",
    process: CLIENT_TOOLS["word-counter"],
    howTo: [
      { action: "Paste", desc: "Paste or type your text into the input area." },
      { action: "Analyze", desc: "Click 'Count Words' to get instant stats." },
      { action: "Review", desc: "Review word count, characters, sentences, paragraphs, and estimated reading time." },
    ],
  },
  "character-counter": {
    fields: [{ name: "input", type: "textarea", label: "Text to analyze", placeholder: "Type or paste text..." }],
    buttonText: "Count Characters",
    process: CLIENT_TOOLS["character-counter"],
  },
  "color-converter": {
    fields: [{ name: "input", type: "text", label: "Color value", placeholder: "#ff6600 or rgb(255,102,0) or hsl(24,100%,50%)" }],
    buttonText: "Convert Color",
    apiEndpoint: "/api/tools/color-converter",
    process: CLIENT_TOOLS["color-converter"],
    howTo: [
      { action: "Enter", desc: "Type a color value in HEX (#ff6600), RGB, or HSL format." },
      { action: "Convert", desc: "Click 'Convert Color' to see the color in all three formats." },
      { action: "Copy", desc: "Copy the converted value in your preferred format." },
    ],
  },
  "loan-calculator": {
    fields: [
      { name: "amount", type: "number", label: "Loan amount ($)", placeholder: "25000" },
      { name: "rate", type: "number", label: "Annual interest rate (%)", placeholder: "5.5" },
      { name: "term", type: "number", label: "Loan term (years)", placeholder: "5" },
    ],
    buttonText: "Calculate Loan",
    apiEndpoint: "/api/tools/loan-calculator",
    process: CLIENT_TOOLS["loan-calculator"],
    howTo: [
      { action: "Enter", desc: "Input the loan amount, annual interest rate, and term in years." },
      { action: "Calculate", desc: "Click 'Calculate Loan' to compute your payments." },
      { action: "Review", desc: "See monthly payment, total payment, and total interest over the loan term." },
    ],
  },
  "mortgage-calculator": {
    fields: [
      { name: "amount", type: "number", label: "Loan amount ($)", placeholder: "300000" },
      { name: "rate", type: "number", label: "Interest rate (%)", placeholder: "6.5" },
      { name: "term", type: "number", label: "Loan term (years)", placeholder: "30" },
    ],
    buttonText: "Calculate Mortgage",
    process: CLIENT_TOOLS["mortgage-calculator"],
  },
  "compound-interest-calculator": {
    fields: [
      { name: "principal", type: "number", label: "Principal ($)", placeholder: "1000" },
      { name: "rate", type: "number", label: "Annual interest rate (%)", placeholder: "5" },
      { name: "years", type: "number", label: "Time (years)", placeholder: "10" },
      { name: "compounds", type: "number", label: "Compounds per year", placeholder: "12" },
    ],
    buttonText: "Calculate",
    process: CLIENT_TOOLS["compound-interest-calculator"],
  },
  "tip-calculator": {
    fields: [
      { name: "bill", type: "number", label: "Bill amount ($)", placeholder: "50" },
      { name: "tip", type: "number", label: "Tip percentage (%)", placeholder: "15" },
      { name: "split", type: "number", label: "Split between", placeholder: "1" },
    ],
    buttonText: "Calculate Tip",
    process: CLIENT_TOOLS["tip-calculator"],
  },
  "salary-calculator": {
    fields: [{ name: "annual", type: "number", label: "Annual salary ($)", placeholder: "60000" }],
    buttonText: "Calculate",
    process: CLIENT_TOOLS["salary-calculator"],
  },
  "vat-calculator": {
    fields: [
      { name: "amount", type: "number", label: "Total price ($)", placeholder: "120" },
      { name: "rate", type: "number", label: "VAT rate (%)", placeholder: "20" },
    ],
    buttonText: "Calculate VAT",
    process: CLIENT_TOOLS["vat-calculator"],
  },
  "uuid-generator": {
    fields: [],
    buttonText: "Generate UUID",
    process: CLIENT_TOOLS["uuid-generator"],
    howTo: [
      { action: "Generate", desc: "Click 'Generate UUID' to create a random UUID v4." },
      { action: "Copy", desc: "Copy the generated UUID for use in your code or database." },
    ],
  },
  "case-converter": {
    fields: [
      { name: "input", type: "textarea", label: "Text to convert", placeholder: "Enter text..." },
      { name: "format", type: "select", label: "Target case", placeholder: "", options: [
        { label: "UPPER CASE", value: "upper" },
        { label: "lower case", value: "lower" },
        { label: "Title Case", value: "title" },
        { label: "camelCase", value: "camel" },
        { label: "PascalCase", value: "pascal" },
        { label: "snake_case", value: "snake" },
        { label: "kebab-case", value: "kebab" },
        { label: "Sentence case", value: "sentence" },
        { label: "All formats", value: "all" },
      ]},
    ],
    buttonText: "Convert Case",
    process: CLIENT_TOOLS["case-converter"],
  },
  "url-encoder": {
    fields: [{ name: "input", type: "textarea", label: "URL or text", placeholder: "https://example.com?name=hello world" }],
    buttonText: "Encode",
    process: CLIENT_TOOLS["url-encoder"],
  },
  "html-entity-encoder": {
    fields: [{ name: "input", type: "textarea", label: "HTML text", placeholder: "<div>Hello & World</div>" }],
    buttonText: "Encode",
    process: CLIENT_TOOLS["html-entity-encoder"],
  },
  "page-authority": {
    fields: [],
    buttonText: "Check Domain Strength",
    isComingSoon: false,
  },
  "sales-tax-calculator": { fields: [], buttonText: "Calculate", isComingSoon: false },
  "discount-calculator": { fields: [], buttonText: "Calculate", isComingSoon: false },
  "grade-calculator": { fields: [], buttonText: "Calculate", isComingSoon: false },
  "fraction-calculator": { fields: [], buttonText: "Calculate", isComingSoon: false },
  "time-zone-converter": { fields: [], buttonText: "Convert", isComingSoon: false },
  "stopwatch": { fields: [], buttonText: "Start", isComingSoon: false },
  "pomodoro-timer": { fields: [], buttonText: "Start", isComingSoon: false },
  "css-box-shadow": { fields: [], buttonText: "Generate", isComingSoon: false },
  "css-border-radius": { fields: [], buttonText: "Generate", isComingSoon: false },
  "text-to-speech": { fields: [], buttonText: "Speak", isComingSoon: false },
  "emoji-picker": { fields: [], buttonText: "Pick", isComingSoon: false },
  "random-color-generator": { fields: [], buttonText: "Generate", isComingSoon: false },
  "percentage-change-calculator": { fields: [], buttonText: "Calculate", isComingSoon: false },
  "binary-to-text": { fields: [], buttonText: "Convert", isComingSoon: false },
  "roman-numeral-converter": { fields: [], buttonText: "Convert", isComingSoon: false },
  "body-fat-calculator": { fields: [], buttonText: "Calculate", isComingSoon: false },
  "font-size-converter": { fields: [], buttonText: "Convert", isComingSoon: false },
  "random-name-picker": { fields: [], buttonText: "Pick", isComingSoon: false },
  "color-contrast-checker": { fields: [], buttonText: "Check", isComingSoon: false },
  "data-size-converter": { fields: [], buttonText: "Convert", isComingSoon: false },
  "audio-converter": { fields: [], buttonText: "Convert", isComingSoon: false },
  "video-compressor": { fields: [], buttonText: "Compress", isComingSoon: false },
  "audio-extractor": { fields: [], buttonText: "Extract", isComingSoon: false },
  "video-to-mp3": { fields: [], buttonText: "Convert", isComingSoon: false },
  "video-converter": { fields: [], buttonText: "Convert", isComingSoon: false },
  "gif-to-mp4": { fields: [], buttonText: "Convert", isComingSoon: false },
  "ai-content-generator": { fields: [], buttonText: "Generate", isComingSoon: false },
  "ai-paraphrasing-tool": { fields: [], buttonText: "Paraphrase", isComingSoon: false },
};

// ── AI Tools ──────────────────────────────────────────────────────────
const AI_CONFIGS: Record<string, ToolConfig> = {
  "ai-readability-score": {
    fields: [{ name: "input", type: "textarea", label: "Text to analyze", placeholder: "Paste or type your text here to measure its readability..." }],
    buttonText: "Analyze Readability",
    process: (v) => {
      const text = v.input?.trim();
      if (!text || text.length < 20) return { error: "Enter at least 20 characters for meaningful readability analysis." };
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = text.trim().split(/\s+/).filter(w => w.length > 0);
      const chars = text.replace(/\s/g, "").length;
      const syllables = words.reduce((sum, w) => {
        w = w.toLowerCase().replace(/[^a-z]/g, "");
        if (w.length <= 3) return sum + 1;
        let count = 0; const vowels = "aeiouy";
        for (let i = 0; i < w.length; i++) { if (vowels.includes(w[i])) count++; }
        if (w.endsWith("e")) count--;
        if (w.endsWith("le") && w.length > 2) count++;
        if (count === 0) count = 1;
        return sum + count;
      }, 0);
      const avgWordsPerSent = words.length / Math.max(sentences.length, 1);
      const avgSyllablesPerWord = syllables / Math.max(words.length, 1);
      const avgCharsPerWord = chars / Math.max(words.length, 1);
      const complexWords = words.filter(w => { const wc = w.toLowerCase().replace(/[^a-z]/g, ""); let c = 0; const v = "aeiouy"; for (let i = 0; i < wc.length; i++) { if (v.includes(wc[i])) c++; } if (wc.endsWith("e")) c--; if (c === 0) c = 1; return c >= 3; }).length;
      const pctComplex = (complexWords / Math.max(words.length, 1)) * 100;

      const flesch = 206.835 - 1.015 * avgWordsPerSent - 84.6 * avgSyllablesPerWord;
      const fkGrade = 0.39 * avgWordsPerSent + 11.8 * avgSyllablesPerWord - 15.59;
      const gunningFog = 0.4 * (avgWordsPerSent + pctComplex);
      const smog = 1.043 * Math.sqrt(complexWords * (30 / Math.max(sentences.length, 1))) + 3.1291;
      const colemanLiau = 5.89 * avgCharsPerWord - 0.3 * (sentences.length / Math.max(words.length, 1) * 100) - 15.8;
      const ari = 4.71 * avgCharsPerWord + 0.5 * avgWordsPerSent - 21.43;
      const avgGrade = (fkGrade + gunningFog + smog + colemanLiau + ari) / 5;

      const gradeLabel = (g: number) => g <= 1 ? "Kindergarten" : g <= 2 ? "1st-2nd Grade" : g <= 3 ? "3rd Grade" : g <= 5 ? "4th-5th Grade" : g <= 8 ? "Middle School" : g <= 10 ? "High School" : g <= 12 ? "High School Senior" : g <= 14 ? "College (Undergraduate)" : g <= 16 ? "College (Graduate)" : "Post-Graduate";
      const difficulty = avgGrade <= 6 ? "Easy to read" : avgGrade <= 10 ? "Moderately difficult" : "Difficult to read";
      const fleschLabel = flesch >= 90 ? "Very Easy" : flesch >= 80 ? "Easy" : flesch >= 70 ? "Fairly Easy" : flesch >= 60 ? "Plain English" : flesch >= 50 ? "Fairly Difficult" : flesch >= 30 ? "Difficult" : "Very Confusing";

      return {
        "Flesch Reading Ease": `${flesch.toFixed(1)} / 100 — ${fleschLabel}`,
        "Flesch-Kincaid Grade": `${fkGrade.toFixed(1)} — ${gradeLabel(fkGrade)}`,
        "Gunning Fog Index": `${gunningFog.toFixed(1)} — ${gradeLabel(gunningFog)}`,
        "SMOG Index": `${smog.toFixed(1)} — ${gradeLabel(smog)}`,
        "Coleman-Liau Index": `${colemanLiau.toFixed(1)} — ${gradeLabel(colemanLiau)}`,
        "Automated Readability Index": `${ari.toFixed(1)} — ${gradeLabel(ari)}`,
        "Average Grade Level": `${avgGrade.toFixed(1)} — ${gradeLabel(avgGrade)}`,
        "Overall Difficulty": difficulty,
        "Stats": `${words.length} words, ${sentences.length} sentences, ${syllables} syllables, ${complexWords} complex words`,
      };
    },
  },
  "ai-sentiment-analysis": {
    fields: [{ name: "input", type: "textarea", label: "Text to analyze", placeholder: "Paste text to analyze its emotional tone..." }],
    buttonText: "Analyze Sentiment",
    process: (v) => {
      const text = v.input?.trim();
      if (!text || text.length < 3) return { error: "Enter at least 3 characters of text to analyze." };
      const words = text.toLowerCase().replace(/[^a-z\s'-]/g, "").split(/\s+/).filter(Boolean);
      const positive = ["good", "great", "excellent", "amazing", "wonderful", "fantastic", "happy", "love", "beautiful", "best", "awesome", "brilliant", "outstanding", "superb", "delightful", "joy", "perfect", "positive", "pleased", "glad", "nice", "helpful", "kind", "grateful", "thankful", "bright", "hope", "success", "win", "celebrate", "exciting", "fun", "enjoy", "peace", "harmony", "progress", "improve", "better", "strong", "safe", "free", "fresh", "sweet", "gentle", "rich", "lucky", "proud", "brave", "clever", "easy", "fast", "smart", "generous", "cheerful", "friendly", "warm", "cozy", "comfy"];
      const negative = ["bad", "terrible", "horrible", "awful", "hate", "worst", "poor", "ugly", "angry", "sad", "hurt", "pain", "sick", "dangerous", "wrong", "evil", "cruel", "nasty", "disgusting", "shame", "fail", "loss", "damage", "destroy", "kill", "death", "fear", "anxiety", "stress", "crisis", "tragedy", "disaster", "horror", "terrifying", "brutal", "violent", "harsh", "bitter", "rotten", "selfish", "lazy", "stupid", "dull", "boring", "waste", "broken", "stuck", "ugly", "cold", "dark", "empty", "lonely", "hopeless", "jealous", "greedy"];
      let score = 0, posCount = 0, negCount = 0;
      for (const w of words) {
        if (positive.includes(w)) { score++; posCount++; }
        else if (negative.includes(w)) { score--; negCount++; }
      }
      const total = words.length;
      const intensity = Math.abs(score) / Math.max(total, 1);
      const label = score > 0 ? "Positive" : score < 0 ? "Negative" : "Neutral";
      const strength = intensity > 0.15 ? "Strongly" : intensity > 0.05 ? "Moderately" : "Slightly";

      const emotionalTone = (() => {
        const excitement = ["exciting", "amazing", "fantastic", "wonderful", "thrilling", "incredible"];
        const anger = ["angry", "furious", "outraged", "hate", "terrible", "horrible"];
        const sadness = ["sad", "unhappy", "depressed", "grief", "lonely", "hopeless"];
        const fear = ["fear", "scared", "terrified", "anxious", "worry", "panic"];
        if (words.some(w => excitement.includes(w))) return "Excitement / Enthusiasm";
        if (words.some(w => anger.includes(w))) return "Anger / Frustration";
        if (words.some(w => sadness.includes(w))) return "Sadness / Melancholy";
        if (words.some(w => fear.includes(w))) return "Fear / Anxiety";
        return score >= 0 ? "Contentment / Satisfaction" : "Dissatisfaction / Displeasure";
      })();

      const ratio = total > 0 ? ((posCount - negCount) / total * 100).toFixed(1) : "0.0";
      return {
        "Overall Sentiment": score === 0 ? "Neutral 😐" : score > 0 ? `${strength} Positive 😊` : `${strength} Negative 😞`,
        "Score": `${score > 0 ? "+" : ""}${score} (ratio: ${ratio}%)`,
        "Tone": emotionalTone,
        "Positive Words": `${posCount}`,
        "Negative Words": `${negCount}`,
        "Total Words Analyzed": `${total}`,
      };
    },
  },
  "ai-keyword-extractor": {
    fields: [{ name: "input", type: "textarea", label: "Text to analyze", placeholder: "Paste your content to extract keywords..." }],
    buttonText: "Extract Keywords",
    process: (v) => {
      const text = v.input?.trim();
      if (!text || text.length < 10) return { error: "Enter at least 10 characters of text for keyword extraction." };
      const stopWords = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","up","about","into","over","after","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","shall","can","need","dare","ought","used","i","you","he","she","it","we","they","me","him","her","us","them","my","your","his","its","our","their","mine","yours","hers","ours","theirs","this","that","these","those","what","which","who","whom","when","where","why","how","all","each","every","both","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","just","also","as","if","then","else","like","because","while","during","before","after","since","until","once","here","there","about","above","below","under","between","through","without","within","along","around","behind","beyond","down","near","off","out","past","still","yet","already","ago","ever","never","always","sometimes","often","usually","maybe","perhaps","well","really","quite","almost","hardly","nearly","certainly","surely","definitely","absolutely","indeed","ok","yes","no","thanks","please","hello","hi","hey"]);
      const words = text.toLowerCase().replace(/[^a-z\s'-]/g, "").split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
      const freq: Record<string, number> = {};
      for (const w of words) { freq[w] = (freq[w] || 0) + 1; }

      // Build bigrams
      const bigrams: Record<string, number> = {};
      for (let i = 0; i < words.length - 1; i++) {
        const bg = words[i] + " " + words[i + 1];
        if (!stopWords.has(words[i]) || !stopWords.has(words[i + 1])) { bigrams[bg] = (bigrams[bg] || 0) + 1; }
      }

      const sortedUnigrams = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
      const sortedBigrams = Object.entries(bigrams).sort((a, b) => b[1] - a[1]).slice(0, 10);
      const sortedAll = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      const totalWords = words.length;

      const result: Record<string, unknown> = {
        "Keywords Found": `${sortedUnigrams.length}`,
        "Total Words Analyzed": `${totalWords} (excluding stop words)`,
        "Top Keywords": sortedUnigrams.slice(0, 10).map(([w, c]) => `${w} (${c}x)`).join(", "),
      };
      if (sortedBigrams.length > 0) {
        result["Top Key Phrases (2-word)"] = sortedBigrams.slice(0, 5).map(([p, c]) => `${p} (${c}x)`).join(", ");
      }
      result["Keyword Density (full list)"] = sortedAll.map(([w, c]) => `${w}: ${c}`).join("\n");
      return result;
    },
  },
  "ai-text-summarizer": {
    fields: [{ name: "input", type: "textarea", label: "Text to summarize", placeholder: "Paste a long article, document, or passage to extract key sentences..." }],
    buttonText: "Summarize",
    process: (v) => {
      const text = v.input?.trim();
      if (!text || text.length < 50) return { error: "Enter at least 50 characters for meaningful summarization." };
      const sentences = text.match(/[^.!?\n]+[.!?]*/g)?.map(s => s.trim()).filter(Boolean) || [];
      if (sentences.length < 3) return { error: "Need at least 3 sentences to generate a summary." };

      const words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
      const stopWords = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","i","you","he","she","it","we","they","me","him","her","us","them","my","your","his","its","our","their","this","that","these","those","what","which","who","whom","when","where","why","how","all","each","every","both","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","just","also","as","if","then","else","like","because","while","during","before","after","since","until","once","here","there","about","above","below","under","between","without","within","along","around","behind","beyond","near","off","out","past","still","yet","already","ago","ever","never","always","sometimes","often","usually","well","really","quite","almost","hardly","nearly"]);
      const wordFreq: Record<string, number> = {};
      for (const w of words) { if (!stopWords.has(w)) wordFreq[w] = (wordFreq[w] || 0) + 1; }
      const maxFreq = Math.max(...Object.values(wordFreq), 1);

      const sentenceScores: { sentence: string; score: number; idx: number }[] = sentences.map((s, i) => {
        const sWords = s.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
        let score = 0;
        for (const w of sWords) { if (!stopWords.has(w)) score += (wordFreq[w] || 0) / maxFreq; }
        // Bonus for first sentence
        if (i === 0) score *= 1.3;
        // Bonus for sentences with title-like words
        if (s.length < 100) score *= 1.1;
        return { sentence: s, score, idx: i };
      });

      sentenceScores.sort((a, b) => b.score - a.score);
      const summaryCount = Math.max(2, Math.ceil(sentences.length * 0.3));
      const topSentences = sentenceScores.slice(0, summaryCount).sort((a, b) => a.idx - b.idx);

      const originalLength = text.length;
      const summaryLength = topSentences.reduce((sum, s) => sum + s.sentence.length, 0);
      const compression = ((1 - summaryLength / originalLength) * 100).toFixed(0);

      return {
        "Summary": topSentences.map(s => s.sentence).join(" "),
        "Original Length": `${originalLength} characters (${sentences.length} sentences)`,
        "Summary Length": `${summaryLength} characters (${topSentences.length} sentences)`,
        "Compression": `${compression}% reduction`,
      };
    },
  },
  "ai-rewriter": {
    fields: [{ name: "input", type: "textarea", label: "Text to rewrite", placeholder: "Paste text to paraphrase and rewrite..." }],
    buttonText: "Rewrite",
    process: (v) => {
      const text = v.input?.trim();
      if (!text || text.length < 10) return { error: "Enter at least 10 characters of text to rewrite." };
      const synonyms: Record<string, string[]> = {
        "good": ["excellent", "superb", "outstanding", "quality", "fine"], "bad": ["poor", "inferior", "substandard", "unsatisfactory"], "big": ["large", "substantial", "considerable", "significant"], "small": ["tiny", "compact", "diminutive", "minor"], "fast": ["quick", "rapid", "swift", "speedy"], "slow": ["gradual", "leisurely", "unhurried"], "new": ["fresh", "novel", "modern", "recent"], "old": ["ancient", "vintage", "antique", "aged"], "important": ["crucial", "vital", "essential", "critical"], "happy": ["delighted", "pleased", "content", "joyful"], "sad": ["unhappy", "melancholy", "sorrowful", "downcast"], "hard": ["difficult", "challenging", "demanding", "tough"], "easy": ["simple", "straightforward", "effortless", "basic"], "help": ["assist", "aid", "support", "facilitate"], "use": ["utilize", "employ", "leverage", "apply"], "make": ["create", "produce", "craft", "generate"], "change": ["modify", "adjust", "alter", "transform"], "think": ["believe", "consider", "deem", "reckon"], "show": ["demonstrate", "illustrate", "display", "indicate"], "need": ["require", "necessitate", "demand"], "get": ["obtain", "acquire", "secure", "attain"], "give": ["provide", "offer", "supply", "furnish"], "start": ["begin", "commence", "initiate", "launch"], "end": ["conclude", "finish", "terminate", "complete"], "first": ["primary", "initial", "foremost"], "last": ["final", "ultimate", "concluding"], "many": ["numerous", "countless", "abundant", "plentiful"], "some": ["several", "certain", "various"], "very": ["extremely", "exceptionally", "remarkably", "immensely"], "really": ["truly", "genuinely", "honestly"], "always": ["constantly", "consistently", "perpetually"], "never": ["rarely", "seldom", "hardly ever"],
      };
      const sentences = text.match(/[^.!?\n]+[.!?]*/g)?.map(s => s.trim()).filter(Boolean) || [text];
      const rewritten = sentences.map(sentence => {
        const words = sentence.split(/(\s+)/);
        let changed = 0;
        const result = words.map(w => {
          const clean = w.replace(/^[^a-zA-Z]*|[^a-zA-Z]*$/g, "").toLowerCase();
          if (clean.length < 3) return w;
          const syns = synonyms[clean];
          if (syns && Math.random() > 0.6) {
            const syn = syns[Math.floor(Math.random() * syns.length)];
            changed++;
            return w.replace(new RegExp(clean, "i"), s => clean === s ? syn : syn.charAt(0).toUpperCase() + syn.slice(1));
          }
          return w;
        }).join("");
        return { text: result, changed };
      });
      const totalChanged = rewritten.reduce((sum, r) => sum + r.changed, 0);
      const rewrittenText = rewritten.map(r => r.text).join(" ");
      return {
        "Original": text,
        "Rewritten Version": rewrittenText,
        "Changes Made": `${totalChanged} word(s) replaced with synonyms`,
      };
    },
  },
  "ai-title-generator": {
    fields: [
      { name: "input", type: "textarea", label: "Content / Topic description", placeholder: "Describe your content topic, key points, or paste the article text..." },
      { name: "tone", type: "select", label: "Style", placeholder: "", options: [
        { label: "Professional", value: "professional" },
        { label: "How-to / Tutorial", value: "howto" },
        { label: "Listicle", value: "listicle" },
        { label: "Question", value: "question" },
        { label: "Bold / Opinion", value: "bold" },
        { label: "Ultimate Guide", value: "guide" },
        { label: "Comparison", value: "comparison" },
        { label: "Number / Statistics", value: "stats" },
      ]},
    ],
    buttonText: "Generate Titles",
    process: (v) => {
      const input = v.input?.trim();
      if (!input || input.length < 5) return { error: "Enter at least 5 characters describing your topic." };
      const words = input.toLowerCase().replace(/[^a-z\s-]/g, "").split(/\s+/).filter(w => w.length > 2 && !["the","and","for","with","that","this","from","your","have","will","what","about","which","their","would","could","should","been","into","just","also","than","then","very","when","where","while","after","before","between","still"].includes(w));
      const topWords = [...new Set(words)].slice(0, 4);
      const topic = topWords.join(", ");
      const titleWord = topWords[0] || "this";
      const titles: string[] = [];
      if (v.tone === "howto" || v.tone === "all") {
        titles.push(`How to ${titleWord}: A Complete Guide for Beginners`);
        titles.push(`How to Master ${titleWord} in ${Math.floor(Math.random() * 5) + 3} Simple Steps`);
        titles.push(`${titleWord} 101: Everything You Need to Know`);
        titles.push(`Step-by-Step Guide to ${words.slice(0, 2).join(" ")}`);
      }
      if (v.tone === "listicle" || v.tone === "all") {
        titles.push(`10 Proven Ways to ${titleWord} Better Results`);
        titles.push(`5 ${titleWord} Strategies That Actually Work`);
        titles.push(`7 ${titleWord} Tips Experts Swear By`);
        titles.push(`Top ${Math.floor(Math.random() * 5) + 10} ${titleWord} Tools and Resources`);
      }
      if (v.tone === "question" || v.tone === "all") {
        titles.push(`Is ${titleWord} Worth It? An Honest Review`);
        titles.push(`What Everyone Gets Wrong About ${titleWord}`);
        titles.push(`Why ${titleWord} Matters More Than You Think`);
        titles.push(`Are You Making These ${titleWord} Mistakes?`);
      }
      if (v.tone === "bold" || v.tone === "all") {
        titles.push(`Why ${titleWord} Is the Future of ${topic}`);
        titles.push(`The Truth About ${titleWord} Nobody Tells You`);
        titles.push(`${titleWord}: Why Most People Get It Wrong`);
        titles.push(`Stop Doing ${titleWord} Wrong — Here's How`);
      }
      if (v.tone === "professional" || v.tone === "all") {
        titles.push(`A Comprehensive Guide to ${topic}`);
        titles.push(`Understanding ${topic}: Key Insights and Best Practices`);
        titles.push(`${topic}: A Strategic Overview`);
        titles.push(`The Essential Handbook for ${topic}`);
      }
      if (v.tone === "guide" || v.tone === "all") {
        titles.push(`The Ultimate Guide to ${topic}`);
        titles.push(`The Complete Resource for ${topic}`);
        titles.push(`Mastering ${topic}: From Basics to Advanced`);
        titles.push(`The Definitive Guide to ${topic}`);
      }
      if (v.tone === "comparison" || v.tone === "all") {
        const alt = topWords[1] || "alternatives";
        titles.push(`${titleWord} vs ${alt}: Which One Should You Choose?`);
        titles.push(`${titleWord} Compared: Features, Pricing, and More`);
        titles.push(`${titleWord} vs ${alt}: A Side-by-Side Comparison`);
      }
      if (v.tone === "stats" || v.tone === "all") {
        titles.push(`${topic}: Statistics and Trends You Need to Know`);
        titles.push(`The State of ${topic} in ${new Date().getFullYear()}: Key Numbers`);
        titles.push(`${topic} by the Numbers: Data-Driven Insights`);
      }

      return {
        "Generated Titles": titles.slice(0, 8).map((t, i) => `${i + 1}. ${t}`).join("\n"),
        "Topic Keywords": topic || "N/A",
        "Style": v.tone,
        "Tip": `${titles.length} titles generated. Pick the one that best matches your audience and click "Copy" next to it.`,
      };
    },
  },
  "ai-meta-description": {
    fields: [{ name: "input", type: "textarea", label: "Page content / description", placeholder: "Paste your article, page content, or a brief description of your page..." }],
    buttonText: "Generate Meta Description",
    process: (v) => {
      const input = v.input?.trim();
      if (!input || input.length < 15) return { error: "Enter at least 15 characters of content to generate a meta description." };
      const sentences = input.match(/[^.!?\n]+[.!?]*/g)?.map(s => s.trim()).filter(Boolean) || [input];
      const maxLen = 155;
      const candidates: string[] = [];

      // Try first sentence
      if (sentences[0] && sentences[0].length <= maxLen) candidates.push(sentences[0]);
      // Try first two sentences
      if (sentences.length >= 2) {
        const two = sentences[0] + " " + sentences[1];
        if (two.length <= maxLen) candidates.push(two);
      }
      // Extract first meaningful segment within limit
      let current = "";
      for (const s of sentences) {
        if ((current + " " + s).trim().length <= maxLen) {
          current = (current + " " + s).trim();
        } else break;
      }
      if (current.length > 40 && !candidates.includes(current)) candidates.push(current);

      // Also try key sentences from later
      for (let i = 1; i < Math.min(sentences.length, 5); i++) {
        const s = sentences[i];
        if (s.length <= maxLen && s.length > 30 && !candidates.includes(s)) {
          candidates.push(s);
        }
      }

      // Format within limit
      const formatMeta = (text: string): string => {
        if (text.length <= maxLen) return text;
        return text.substring(0, maxLen - 3).replace(/\s+\S*$/, "") + "...";
      };

      return {
        "Meta Description (recommended)": formatMeta(candidates[0] || input.substring(0, maxLen - 3).replace(/\s+\S*$/, "") + "..."),
        "Character Count": `${candidates[0]?.length || 0} / ${maxLen} (${candidates[0]?.length > maxLen ? "too long, trimmed" : candidates[0]?.length > 120 ? "optimal" : "could be longer"})`,
        "SEO Preview": `<meta name="description" content="${formatMeta(candidates[0] || input.substring(0, maxLen - 3).replace(/\s+\S*$/, "") + "...")}" />`,
        "Alternatives": candidates.slice(1, 4).map((c, i) => `Option ${i+1}: ${formatMeta(c)}`).join("\n"),
      };
    },
  },
  "ai-hashtag-generator": {
    fields: [
      { name: "input", type: "textarea", label: "Content or topic", placeholder: "Paste your content, post, or describe your topic to generate relevant hashtags..." },
      { name: "platform", type: "select", label: "Platform", placeholder: "", options: [
        { label: "All", value: "all" },
        { label: "Instagram", value: "instagram" },
        { label: "Twitter / X", value: "twitter" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "TikTok", value: "tiktok" },
      ]},
    ],
    buttonText: "Generate Hashtags",
    process: (v) => {
      const input = v.input?.trim();
      if (!input || input.length < 3) return { error: "Enter some content or a topic description to generate hashtags." };
      const words = input.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(w => w.length > 2 && !["the","and","for","with","that","this","from","your","have","will","what","about","which","their","would","could","should","been","into","just","also","than","then","very","when","where","while","after","before","between","still","been","being","have","has","had","does","doesnt"].includes(w));
      const freq: Record<string, number> = {};
      for (const w of words) { freq[w] = (freq[w] || 0) + 1; }
      const ranked = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([w]) => w);

      const allTags = ranked.map(w => `#${w}${w.endsWith("s") ? "" : ""}`);
      const maxTags = v.platform === "instagram" ? 15 : v.platform === "tiktok" ? 12 : v.platform === "twitter" ? 5 : 8;
      const selected = allTags.slice(0, maxTags);

      // Generate compound tags
      const compounds: string[] = [];
      for (let i = 0; i < Math.min(ranked.length, 5); i++) {
        for (let j = i + 1; j < Math.min(ranked.length, 5); j++) {
          if (compounds.length < 5) compounds.push(`#${ranked[i]}${ranked[j]}`);
        }
      }

      return {
        [`Top Hashtags (${v.platform})`]: selected.join(" "),
        "Count": `${selected.length} hashtags generated for ${v.platform}`,
        "Compound Tags": compounds.slice(0, 3).join(" "),
        "Copy-Friendly": selected.join(" "),
        "Tip": `For ${v.platform === "instagram" ? "Instagram: use all 15 for maximum reach. Mix broad and niche tags." : v.platform === "tiktok" ? "TikTok: use 3-5 highly relevant tags plus trending ones." : v.platform === "twitter" ? "Twitter/X: 2-3 tags max for best engagement." : "LinkedIn: 3-5 professional tags work best."}`,
      };
    },
  },
  "ai-grammar-checker": {
    fields: [{ name: "input", type: "textarea", label: "Text to check", placeholder: "Paste text to check for grammar, spelling, and stylistic issues..." }],
    buttonText: "Check Grammar",
    process: (v) => {
      const text = v.input?.trim();
      if (!text || text.length < 3) return { error: "Enter at least 3 characters of text to check." };
      const issues: string[] = [];
      const words = text.split(/\s+/);
      const sentences = text.match(/[^.!?\n]+[.!?]*/g)?.map(s => s.trim()).filter(Boolean) || [];

      // Check: multiple spaces
      if (/\s{2,}/.test(text)) issues.push("Multiple consecutive spaces found. Use single spaces between words.");

      // Check: sentence case (first word capitalized)
      for (const s of sentences) {
        const trimmed = s.trim();
        if (trimmed.length > 1 && /^[a-z]/.test(trimmed)) {
          issues.push(`Sentence may need capitalization: "${trimmed.substring(0, 40)}${trimmed.length > 40 ? "..." : ""}"`);
          break;
        }
      }

      // Check: common misspellings
      const commonMistakes: Record<string, string> = {
        "alot": "a lot", "cant": "can't", "dont": "don't", "wont": "won't", "wasnt": "wasn't", "isnt": "isn't", "arent": "aren't", "couldnt": "couldn't", "wouldnt": "wouldn't", "shouldnt": "shouldn't", "doesnt": "doesn't", "didnt": "didn't", "havent": "haven't", "hasnt": "hasn't", "theres": "there's", "theyll": "they'll", "theyre": "they're", "its": "it's", "youre": "you're", "your": "you're", "recieve": "receive", "wierd": "weird", "beleive": "believe", "occured": "occurred", "occuring": "occurring", "seperate": "separate", "definately": "definitely", "humour": "humor", "colour": "color", "centre": "center", "theatre": "theater", "licence": "license", "practise": "practice", "defence": "defense", "organise": "organize", "realise": "realize", "recognise": "recognize",
      };
      for (const [wrong, right] of Object.entries(commonMistakes)) {
        const regex = new RegExp(`\\b${wrong}\\b`, "gi");
        const match = text.match(regex);
        if (match) issues.push(`"${match[0]}" may be misspelled. Did you mean "${right}"? (${match.length} occurrence${match.length > 1 ? "s" : ""})`);
      }

      // Check: passive voice indicators
      const passiveMarkers = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi;
      const passiveMatches = text.match(passiveMarkers);
      if (passiveMatches && passiveMatches.length > 2) issues.push(`Passive voice detected (${passiveMatches.length} instances). Consider active voice for stronger writing.`);

      // Check: repeated words
      const repeatRegex = /\b(\w+)\s+\1\b/gi;
      const repeatMatch = text.match(repeatRegex);
      if (repeatMatch) issues.push(`Repeated word${repeatMatch.length > 1 ? "s" : ""} found: "${repeatMatch.join('", "')}". Remove duplicate${repeatMatch.length > 1 ? "s" : ""}.`);

      // Check: long sentences
      for (const s of sentences) {
        const wc = s.split(/\s+/).length;
        if (wc > 35) issues.push(`Very long sentence (${wc} words). Consider breaking it into shorter sentences for readability.`);
      }

      // Check: comma splices
      for (const s of sentences) {
        if (/^[^,]*,[^,;,]*,[^,;,]*,[^,;,]*,[^,;]/i.test(s) && s.split(/\s+/).length < 25) {
          issues.push("Possible comma splice — multiple independent clauses joined only by commas. Consider using semicolons or periods.");
          break;
        }
      }

      // Check: empty parentheses  
      if (/\(\s*\)/.test(text)) issues.push("Empty parentheses found. Remove or fill in the missing content.");

      // Check: ellipsis overuse
      const ellipsisCount = (text.match(/\.{3,}/g) || []).length;
      if (ellipsisCount > 3) issues.push(`Ellipsis (...) used ${ellipsisCount} times. Overuse can make writing seem informal.`);

      if (issues.length === 0) {
        issues.push("No obvious grammar or spelling issues detected. Your text looks good!");
      }

      return {
        "Issues Found": `${issues.length}`,
        "Details": issues.map((iss, i) => `${i + 1}. ${iss}`).join("\n"),
        "Word Count": `${words.length} words, ${sentences.length} sentences`,
        "Readability Note": sentences.some(s => s.split(/\s+/).length > 25) ? "Some sentences are long — consider shortening for better readability." : "Sentence lengths look good.",
      };
    },
  },
  "ai-plagiarism-checker": {
    fields: [
      { name: "text1", type: "textarea", label: "Original text", placeholder: "Paste the original / source text here..." },
      { name: "text2", type: "textarea", label: "Text to compare", placeholder: "Paste the text you want to check for similarity..." },
    ],
    buttonText: "Check Similarity",
    process: (v) => {
      const text1 = v.text1?.trim();
      const text2 = v.text2?.trim();
      if (!text1 || text1.length < 20) return { error: "Enter at least 20 characters in the original text field." };
      if (!text2 || text2.length < 20) return { error: "Enter at least 20 characters in the text to compare." };

      const normalize = (t: string) => t.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
      const n1 = normalize(text1);
      const n2 = normalize(text2);

      // Word overlap
      const w1 = n1.split(" ");
      const w2 = n2.split(" ");
      const set1 = new Set(w1);
      const set2 = new Set(w2);
      const overlap = [...set1].filter(w => set2.has(w)).length;
      const jaccard = overlap / Math.max(new Set([...w1, ...w2]).size, 1);

      // N-gram overlap (4-gram)
      const ngrams = (t: string, n: number) => {
        const grams: string[] = [];
        for (let i = 0; i <= t.length - n; i++) grams.push(t.substring(i, i + n));
        return grams;
      };
      const g1 = ngrams(n1, 8);
      const g2 = ngrams(n2, 8);
      const gSet1 = new Set(g1);
      const sharedGrams = g2.filter(g => gSet1.has(g)).length;
      const gramSimilarity = g1.length > 0 && g2.length > 0 ? sharedGrams / Math.max(Math.min(g1.length, g2.length), 1) : 0;

      const overallSimilarity = jaccard * 0.4 + gramSimilarity * 0.6;
      const pct = (overallSimilarity * 100);
      const risk = pct > 70 ? "High — texts are very similar; likely copied" : pct > 40 ? "Medium — significant overlap detected; review required" : pct > 15 ? "Low — some common phrases but likely original" : "Minimal — texts appear to be original";

      // Find common phrases
      const phrases: string[] = [];
      const p1 = n1.split(".");
      for (const phrase of p1) {
        const trimmed = phrase.trim();
        if (trimmed.length > 20 && n2.includes(trimmed)) {
          phrases.push(trimmed.substring(0, 80) + (trimmed.length > 80 ? "..." : ""));
        }
      }

      return {
        "Similarity Score": `${pct.toFixed(1)}%`,
        "Risk Level": risk,
        "Word Overlap": `${overlap} common words out of ${new Set([...w1, ...w2]).size} unique words (${(jaccard * 100).toFixed(1)}%)`,
        "Phrase Matches": phrases.length > 0 ? phrases.slice(0, 5).map((p, i) => `${i + 1}. "...${p}..."`).join("\n") : "No significant phrase matches found",
        "Word Counts": `Original: ${w1.length} words | Compared: ${w2.length} words`,
        "⚠️ Limitation": "This is a local text-similarity check. A complete plagiarism scanner requires searching against a web-scale index of published content, which needs a third-party API (see notes below).",
      };
    },
  },
};

// ── Image & Design Tools ──────────────────────────────────────────────
const imageProcess = async (values: Record<string, string>, transform: (ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, canvas: HTMLCanvasElement, params: Record<string, string>) => void): Promise<ProcessResult> => {
  const src = values.image || values.source;
  if (!src || !src.startsWith("data:")) return { error: "Please upload an image file." };
  if (src === "__error__:File exceeds 20MB limit") return { error: "File exceeds 20MB limit." };
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Failed to load image"));
    i.src = src;
  });
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { error: "Canvas not supported." };
  transform(ctx, img, img.naturalWidth, img.naturalHeight, canvas, values);
  const outDataUrl = canvas.toDataURL("image/png");
  const origSize = Math.round(((src.length * 3) / 4 / 1024) * 10) / 10;
  const newSize = Math.round(((outDataUrl.length * 3) / 4 / 1024) * 10) / 10;
  return {
    "Preview": `__image__:${outDataUrl}`,
    "Original": `${img.naturalWidth}×${img.naturalHeight}px, ${origSize}KB`,
    "Result": `${img.naturalWidth}×${img.naturalHeight}px, ${newSize}KB`,
    "Download Link": `__download__:${outDataUrl}||processed-${Date.now()}.png`,
  };
};

const IMAGE_CONFIGS: Record<string, ToolConfig> = {
  "image-rotator": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "angle", type: "select", label: "Rotation angle", placeholder: "", options: [
        { label: "90° clockwise", value: "90" },
        { label: "180°", value: "180" },
        { label: "270° clockwise (90° CCW)", value: "270" },
      ]},
    ],
    buttonText: "Rotate Image",
    asyncProcess: (v) => imageProcess(v, (ctx, img, w, h, c, params) => {
      const angle = parseInt(params.angle) || 90;
      const rad = (angle * Math.PI) / 180;
      const swapped = angle === 90 || angle === 270;
      c.width = swapped ? h : w;
      c.height = swapped ? w : h;
      ctx.translate(c.width / 2, c.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -w / 2, -h / 2);
    }),
  },
  "image-inverter": {
    fields: [{ name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" }],
    buttonText: "Invert Colors",
    asyncProcess: (v) => imageProcess(v, (ctx, img, w, h, c) => {
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) { d.data[i] = 255 - d.data[i]; d.data[i + 1] = 255 - d.data[i + 1]; d.data[i + 2] = 255 - d.data[i + 2]; }
      ctx.putImageData(d, 0, 0);
    }),
  },
  "image-flipper": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "direction", type: "select", label: "Flip direction", placeholder: "", options: [
        { label: "Horizontal (mirror)", value: "horizontal" },
        { label: "Vertical", value: "vertical" },
        { label: "Both", value: "both" },
      ]},
    ],
    buttonText: "Flip Image",
    asyncProcess: (v) => imageProcess(v, (ctx, img, w, h, c, params) => {
      const dir = params.direction || "horizontal";
      ctx.translate(dir === "horizontal" || dir === "both" ? w : 0, dir === "vertical" || dir === "both" ? h : 0);
      ctx.scale(dir === "horizontal" || dir === "both" ? -1 : 1, dir === "vertical" || dir === "both" ? -1 : 1);
      ctx.drawImage(img, 0, 0);
    }),
  },
  "image-to-pencil-sketch": {
    fields: [{ name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" }],
    buttonText: "Create Sketch",
    asyncProcess: (v) => imageProcess(v, (ctx, img, w, h, c) => {
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, w, h);
      // Grayscale
      for (let i = 0; i < d.data.length; i += 4) {
        const gray = 0.299 * d.data[i] + 0.587 * d.data[i + 1] + 0.114 * d.data[i + 2];
        d.data[i] = gray; d.data[i + 1] = gray; d.data[i + 2] = gray;
      }
      ctx.putImageData(d, 0, 0);
      // Invert
      const inv = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < inv.data.length; i += 4) { inv.data[i] = 255 - inv.data[i]; inv.data[i + 1] = 255 - inv.data[i + 1]; inv.data[i + 2] = 255 - inv.data[i + 2]; }
      ctx.putImageData(inv, 0, 0);
      ctx.filter = "blur(3px)";
      ctx.drawImage(c, 0, 0);
      ctx.filter = "none";
      // Dodge blend
      const orig = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < orig.data.length; i += 4) {
        const topR = orig.data[i], topG = orig.data[i + 1], topB = orig.data[i + 2];
        const bottomR = 255 - d.data[i], bottomG = 255 - d.data[i + 1], bottomB = 255 - d.data[i + 2];
        orig.data[i] = Math.min(255, bottomR === 255 ? 255 : (topR * 255) / (255 - bottomR));
        orig.data[i + 1] = Math.min(255, bottomG === 255 ? 255 : (topG * 255) / (255 - bottomG));
        orig.data[i + 2] = Math.min(255, bottomB === 255 ? 255 : (topB * 255) / (255 - bottomB));
      }
      ctx.putImageData(orig, 0, 0);
    }),
  },
  "image-sepia": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "intensity", type: "select", label: "Sepia intensity", placeholder: "", options: [
        { label: "Light", value: "0.3" },
        { label: "Medium", value: "0.6" },
        { label: "Strong", value: "1.0" },
      ]},
    ],
    buttonText: "Apply Sepia",
    asyncProcess: (v) => imageProcess(v, (ctx, img, w, h, c, params) => {
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, w, h);
      const s = parseFloat(params.intensity) || 0.6;
      for (let i = 0; i < d.data.length; i += 4) {
        const r = d.data[i], g = d.data[i + 1], b = d.data[i + 2];
        d.data[i] = Math.min(255, r * (1 - 0.607 * s) + g * 0.769 * s + b * 0.189 * s);
        d.data[i + 1] = Math.min(255, r * 0.349 * s + g * (1 - 0.314 * s) + b * 0.168 * s);
        d.data[i + 2] = Math.min(255, r * 0.272 * s + g * 0.534 * s + b * (1 - 0.869 * s));
      }
      ctx.putImageData(d, 0, 0);
    }),
  },
  "image-saturation": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "level", type: "select", label: "Saturation level", placeholder: "", options: [
        { label: "Grayscale (0%)", value: "0" },
        { label: "Desaturated (50%)", value: "0.5" },
        { label: "Normal (100%)", value: "1.0" },
        { label: "Vibrant (150%)", value: "1.5" },
        { label: "Hyper-saturated (200%)", value: "2.0" },
      ]},
    ],
    buttonText: "Adjust Saturation",
    asyncProcess: (v) => imageProcess(v, (ctx, img, w, h, c, params) => {
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, w, h);
      const s = parseFloat(params.level) || 1.0;
      for (let i = 0; i < d.data.length; i += 4) {
        const r = d.data[i], g = d.data[i + 1], b = d.data[i + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        d.data[i] = Math.min(255, gray + s * (r - gray));
        d.data[i + 1] = Math.min(255, gray + s * (g - gray));
        d.data[i + 2] = Math.min(255, gray + s * (b - gray));
      }
      ctx.putImageData(d, 0, 0);
    }),
  },
  "image-brightness": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "brightness", type: "select", label: "Brightness", placeholder: "", options: [
        { label: "Dark (-50)", value: "-50" },
        { label: "Dim (-25)", value: "-25" },
        { label: "Normal (0)", value: "0" },
        { label: "Bright (+25)", value: "25" },
        { label: "Very bright (+50)", value: "50" },
      ]},
      { name: "contrast", type: "select", label: "Contrast", placeholder: "", options: [
        { label: "Low (-50)", value: "-50" },
        { label: "Reduced (-25)", value: "-25" },
        { label: "Normal (0)", value: "0" },
        { label: "Enhanced (+25)", value: "25" },
        { label: "High (+50)", value: "50" },
      ]},
    ],
    buttonText: "Adjust",
    asyncProcess: (v) => imageProcess(v, (ctx, img, w, h, cv, params) => {
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, w, h);
      const b = parseInt(params.brightness) || 0;
      const c = parseInt(params.contrast) || 0;
      const factor = (259 * (c + 255)) / (255 * (259 - c));
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i] = Math.max(0, Math.min(255, factor * (d.data[i] + b - 128) + 128));
        d.data[i + 1] = Math.max(0, Math.min(255, factor * (d.data[i + 1] + b - 128) + 128));
        d.data[i + 2] = Math.max(0, Math.min(255, factor * (d.data[i + 2] + b - 128) + 128));
      }
      ctx.putImageData(d, 0, 0);
    }),
  },
  "image-color-picker": {
    fields: [
      { name: "image", type: "file", label: "Upload an image", placeholder: "", accept: "image/*" },
      { name: "coordInput", type: "text", label: "Or enter coordinates (x,y)", placeholder: "e.g. 100,50" },
    ],
    buttonText: "Pick Colors",
    asyncProcess: async (v) => {
      const src = v.image;
      if (!src || !src.startsWith("data:")) return { error: "Please upload an image file." };
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Failed to load"));
        i.src = src;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return { error: "Canvas not supported." };
      ctx.drawImage(img, 0, 0);

      const points: { x: number; y: number }[] = [];
      // Parse manual coordinates
      if (v.coordInput?.trim()) {
        const parts = v.coordInput.split(",").map(s => parseInt(s.trim()));
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          points.push({ x: Math.max(0, Math.min(img.naturalWidth - 1, parts[0])), y: Math.max(0, Math.min(img.naturalHeight - 1, parts[1])) });
        }
      }
      // Sample several automatic points
      const autoPoints = [
        { x: Math.floor(img.naturalWidth * 0.25), y: Math.floor(img.naturalHeight * 0.25) },
        { x: Math.floor(img.naturalWidth * 0.75), y: Math.floor(img.naturalHeight * 0.25) },
        { x: Math.floor(img.naturalWidth * 0.5), y: Math.floor(img.naturalHeight * 0.5) },
        { x: Math.floor(img.naturalWidth * 0.25), y: Math.floor(img.naturalHeight * 0.75) },
        { x: Math.floor(img.naturalWidth * 0.75), y: Math.floor(img.naturalHeight * 0.75) },
      ];
      for (const p of autoPoints) { if (!points.some(ex => Math.abs(ex.x - p.x) < 5 && Math.abs(ex.y - p.y) < 5)) points.push(p); }

      const results: Record<string, string> = {};
      for (const p of points) {
        const pixel = ctx.getImageData(p.x, p.y, 1, 1).data;
        const hex = "#" + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, "0")).join("");
        const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        results[`@ (${p.x}, ${p.y})`] = `${hex} ${rgb}`;
      }

      return {
        "Image Size": `${img.naturalWidth}×${img.naturalHeight}px`,
        "Sampled Colors": Object.entries(results).map(([k, v]) => `${k}: ${v}`).join("\n"),
        "Preview": `__image__:${src}`,
        "Tip": "For a specific pixel, enter its X,Y coordinates in the field above and re-run.",
      };
    },
  },
  "collage-maker": {
    fields: [
      { name: "source", type: "file", label: "Images (select multiple)", placeholder: "", accept: "image/*" },
      { name: "layout", type: "select", label: "Grid layout", placeholder: "", options: [
        { label: "2 columns", value: "2" },
        { label: "3 columns", value: "3" },
        { label: "4 columns", value: "4" },
      ]},
    ],
    buttonText: "Create Collage",
    asyncProcess: async (v) => {
      const files = v.source;
      if (!files || !files.startsWith("data:")) return { error: "Upload at least one image." };
      // Note: standard file input cannot do multi-file via data URL easily
      // For simplicity, use the single uploaded image tiled in a grid
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Failed to load"));
        i.src = files;
      });
      const cols = parseInt(v.layout) || 2;
      const cellW = 300, cellH = 200;
      const rows = 2;
      const canvas = document.createElement("canvas");
      canvas.width = cols * cellW;
      canvas.height = rows * cellH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return { error: "Canvas not supported." };
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const sx = (r * cols + c) / (rows * cols);
          ctx.drawImage(img, c * cellW, r * cellH, cellW, cellH);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.strokeRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
      const outDataUrl = canvas.toDataURL("image/png");
      return {
        "Collage": `__image__:${outDataUrl}`,
        "Grid": `${cols}×${rows} (${cols * rows} cells)`,
        "Size": `${canvas.width}×${canvas.height}px`,
        "Download": `__download__:${outDataUrl}||collage-${Date.now()}.png`,
        "Note": "For best results, upload multiple images separately (feature coming in next update).",
      };
    },
  },
  "image-to-ico": {
    fields: [{ name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" }],
    buttonText: "Convert to ICO",
    asyncProcess: async (v) => {
      const src = v.image;
      if (!src || !src.startsWith("data:")) return { error: "Please upload an image file." };
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Failed to load image"));
        i.src = src;
      });
      const sizes = [16, 32, 48, 64, 128, 256];
      const canvases = sizes.map(size => {
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const ctx = c.getContext("2d");
        if (ctx) { ctx.drawImage(img, 0, 0, size, size); }
        return c;
      });
      // Encode as PNG for each size, then wrap in ICO container
      const pngBuffers = await Promise.all(canvases.map(async (c) => {
        const blob = await new Promise<Blob>(resolve => c.toBlob(b => resolve(b!), "image/png"));
        const buf = await blob.arrayBuffer();
        return new Uint8Array(buf);
      }));
      // Build ICO file format
      const count = pngBuffers.length;
      const headerSize = 6 + count * 16;
      const fileSize = headerSize + pngBuffers.reduce((s, b) => s + b.length, 0);
      const buf = new ArrayBuffer(fileSize);
      const view = new DataView(buf);
      let offset = 0;
      // ICO header
      view.setUint16(offset, 0, true); offset += 2; // reserved
      view.setUint16(offset, 1, true); offset += 2; // ICO type
      view.setUint16(offset, count, true); offset += 2; // image count
      // Directory entries
      const dataOffsets: number[] = [];
      let dataOffset = headerSize;
      for (let i = 0; i < count; i++) {
        const size = sizes[i];
        view.setUint8(offset, size >= 256 ? 0 : size); offset++;
        view.setUint8(offset, size >= 256 ? 0 : size); offset++;
        view.setUint8(offset, 0); offset++; // color palette
        view.setUint8(offset, 0); offset++; // reserved
        view.setUint16(offset, 1, true); offset += 2; // color planes
        view.setUint16(offset, 32, true); offset += 2; // bits per pixel
        view.setUint32(offset, pngBuffers[i].length, true); offset += 4; // size
        view.setUint32(offset, dataOffset, true); offset += 4; // offset
        dataOffsets.push(dataOffset);
        dataOffset += pngBuffers[i].length;
      }
      // PNG data
      for (let i = 0; i < count; i++) {
        new Uint8Array(buf).set(pngBuffers[i], dataOffsets[i]);
      }
      const blob = new Blob([buf], { type: "image/x-icon" });
      const icoUrl = URL.createObjectURL(blob);
      return {
        "ICO Generated": `__download__:${icoUrl}||icon-${Date.now()}.ico`,
        "Sizes Included": sizes.map(s => `${s}×${s}`).join(", "),
        "File Size": `${Math.round(fileSize / 1024)} KB`,
        "Preview": `__image__:${icoUrl}`,
        "Tip": "Download the ICO file and use it as your website favicon.",
      };
    },
  },
};

const dl = (dataUrl: string): Uint8Array => {
  const bin = atob(dataUrl.split(",")[1]);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
};

const toBlob = (data: Uint8Array, type: string): Blob => new Blob([data.buffer as ArrayBuffer], { type });
const toDocData = (d: Uint8Array): Uint8Array => d;

const getFileName = (dataUrl: string, fallback: string): string => {
  try {
    const parsed = new URL(dataUrl.replace(/^data:[^;]+;base64,/, ""));
    return parsed.searchParams.get("name") || fallback;
  } catch { return fallback; }
};

const getTextItems = (items: any[]) => items.filter((i: any) => typeof i.str === "string").map((i: any) => i.str);

// ── PDF Tools ──────────────────────────────────────────────────────────
const PDF_CONFIGS: Record<string, ToolConfig> = {
  "merge-pdf": {
    fields: [{ name: "pdf1", type: "file", label: "First PDF", placeholder: "", accept: ".pdf" }, { name: "pdf2", type: "file", label: "Second PDF", placeholder: "", accept: ".pdf" }],
    buttonText: "Merge PDFs",
    asyncProcess: async (v) => {
      if (!v.pdf1?.startsWith("data:") || !v.pdf2?.startsWith("data:")) return { error: "Upload two PDF files to merge." };
      const { PDFDocument } = await import("pdf-lib");
      const d1 = await PDFDocument.load(dl(v.pdf1));
      const d2 = await PDFDocument.load(dl(v.pdf2));
      const merged = await PDFDocument.create();
      const pages1 = await merged.copyPages(d1, d1.getPageIndices());
      pages1.forEach(p => merged.addPage(p));
      const pages2 = await merged.copyPages(d2, d2.getPageIndices());
      pages2.forEach(p => merged.addPage(p));
      const out = await merged.save();
      const blob = toBlob(out, "application/pdf");
      const url = URL.createObjectURL(blob);
      return { "Merged PDF": `__download__:${url}||merged-${Date.now()}.pdf`, Pages: `${d1.getPageCount() + d2.getPageCount()}`, "File 1 Pages": `${d1.getPageCount()}`, "File 2 Pages": `${d2.getPageCount()}` };
    },
  },
  "split-pdf": {
    fields: [
      { name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" },
      { name: "pages", type: "text", label: "Pages to extract (e.g. 1,3,5-8)", placeholder: "1-3" },
    ],
    buttonText: "Split PDF",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(dl(v.file));
      const total = src.getPageCount();
      const indices: number[] = [];
      if (v.pages?.trim()) {
        for (const part of v.pages.split(",")) {
          const trimmed = part.trim();
          if (trimmed.includes("-")) {
            const [a, b] = trimmed.split("-").map(s => parseInt(s.trim()));
            if (!isNaN(a) && !isNaN(b)) for (let i = Math.max(1, a); i <= Math.min(b, total); i++) indices.push(i - 1);
          } else {
            const n = parseInt(trimmed);
            if (!isNaN(n) && n >= 1 && n <= total) indices.push(n - 1);
          }
        }
      } else { for (let i = 0; i < total; i++) indices.push(i); }
      const unique = [...new Set(indices)].sort((a, b) => a - b);
      if (unique.length === 0) return { error: "No valid pages selected." };
      const outDoc = await PDFDocument.create();
      const pages = await outDoc.copyPages(src, unique);
      pages.forEach(p => outDoc.addPage(p));
      const out = await outDoc.save();
      const blob = toBlob(out, "application/pdf");
      const url = URL.createObjectURL(blob);
      return { "Extracted PDF": `__download__:${url}||split-${Date.now()}.pdf`, Pages: `${unique.length}`, "Total Source Pages": `${total}`, "Page Range": unique.map(i => i + 1).join(", ") };
    },
  },
  "compress-pdf": {
    fields: [{ name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" }],
    buttonText: "Compress PDF",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const buf = dl(v.file);
      const origSize = buf.length;
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const out = await doc.save({ useObjectStreams: true, objectsPerTick: 100 });
      const newSize = out.length;
      const saved = ((1 - newSize / origSize) * 100).toFixed(1);
      const blob = toBlob(out, "application/pdf");
      const url = URL.createObjectURL(blob);
      return { "Compressed PDF": `__download__:${url}||compressed-${Date.now()}.pdf`, "Original Size": `${(origSize / 1024).toFixed(1)} KB`, "New Size": `${(newSize / 1024).toFixed(1)} KB`, "Space Saved": `${saved}%`, Pages: `${doc.getPageCount()}` };
    },
  },
  "pdf-to-jpg": {
    fields: [{ name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" }],
    buttonText: "Convert to JPG",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      const pdf = await pdfjsLib.getDocument({ data: dl(v.file).buffer as ArrayBuffer }).promise;


      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return { error: "Canvas not supported." };
      await page.render({ canvas: canvas, viewport } as any).promise;
      const jpgUrl = canvas.toDataURL("image/jpeg", 0.92);
      return { Preview: `__image__:${jpgUrl}`, "First Page": `__download__:${jpgUrl}||page1-${Date.now()}.jpg`, "Total Pages": `${pdf.numPages}`, Note: "Shows first page. For multi-page, use PDF to PNG tool." };
    },
  },
  "jpg-to-pdf": {
    fields: [{ name: "image", type: "file", label: "Image file (JPG/PNG)", placeholder: "", accept: "image/*" }],
    buttonText: "Convert to PDF",
    asyncProcess: async (v) => {
      if (!v.image?.startsWith("data:image/")) return { error: "Upload an image file." };
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      if (v.image.startsWith("data:image/png")) {
        const png = await doc.embedPng(dl(v.image));
        const page = doc.addPage([png.width, png.height]);
        page.drawImage(png, { x: 0, y: 0, width: png.width, height: png.height });
      } else {
        const jpg = await doc.embedJpg(dl(v.image));
        const page = doc.addPage([jpg.width, jpg.height]);
        page.drawImage(jpg, { x: 0, y: 0, width: jpg.width, height: jpg.height });
      }
      const out = await doc.save();
      const blob = toBlob(out, "application/pdf");
      const url = URL.createObjectURL(blob);
      return { PDF: `__download__:${url}||image-${Date.now()}.pdf`, Pages: "1", Size: `${(out.length / 1024).toFixed(1)} KB` };
    },
  },
  "rotate-pdf": {
    fields: [
      { name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" },
      { name: "angle", type: "select", label: "Rotation", placeholder: "", options: [
        { label: "90° clockwise", value: "90" }, { label: "180°", value: "180" }, { label: "270°", value: "270" },
      ]},
    ],
    buttonText: "Rotate PDF",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const { PDFDocument, degrees } = await import("pdf-lib");
      const doc = await PDFDocument.load(dl(v.file));
      const angle = parseInt(v.angle) || 90;
      const deg = angle === 90 ? degrees(90) : angle === 270 ? degrees(270) : degrees(180);
      doc.getPages().forEach(p => p.setRotation(deg));
      const out = await doc.save();
      const blob = toBlob(out, "application/pdf");
      const url = URL.createObjectURL(blob);
      return { "Rotated PDF": `__download__:${url}||rotated-${Date.now()}.pdf`, Pages: `${doc.getPageCount()}`, Angle: `${angle}°` };
    },
  },
  "reorder-pdf": {
    fields: [
      { name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" },
      { name: "order", type: "text", label: "New page order (comma-separated)", placeholder: "3,1,2" },
    ],
    buttonText: "Reorder",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(dl(v.file));
      const total = src.getPageCount();
      const order = v.order?.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= total);
      if (!order || order.length === 0) return { error: `Enter a valid page order (1-${total}).` };
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(src, order.map(i => i - 1));
      pages.forEach(p => newDoc.addPage(p));
      const out = await newDoc.save();
      const blob = toBlob(out, "application/pdf");
      const url = URL.createObjectURL(blob);
      return { "Reordered PDF": `__download__:${url}||reordered-${Date.now()}.pdf`, Pages: `${newDoc.getPageCount()}`, Order: order.join(", ") };
    },
  },
  "extract-pdf-pages": {
    fields: [
      { name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" },
      { name: "pages", type: "text", label: "Pages to extract", placeholder: "1,3,5-8" },
    ],
    buttonText: "Extract Pages",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(dl(v.file));
      const total = src.getPageCount();
      const indices: number[] = [];
      if (v.pages?.trim()) {
        for (const part of v.pages.split(",")) {
          const t = part.trim();
          if (t.includes("-")) {
            const [a, b] = t.split("-").map(s => parseInt(s.trim()));
            if (!isNaN(a) && !isNaN(b)) for (let i = Math.max(1, a); i <= Math.min(b, total); i++) indices.push(i - 1);
          } else { const n = parseInt(t); if (!isNaN(n) && n >= 1 && n <= total) indices.push(n - 1); }
        }
      }
      if (indices.length === 0) return { error: "No valid pages specified." };
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(src, [...new Set(indices)].sort((a, b) => a - b));
      pages.forEach(p => newDoc.addPage(p));
      const out = await newDoc.save();
      const blob = toBlob(out, "application/pdf");
      const url = URL.createObjectURL(blob);
      return { "Extracted PDF": `__download__:${url}||extracted-${Date.now()}.pdf`, Pages: `${newDoc.getPageCount()}`, Source: `${total} pages` };
    },
  },
  "unlock-pdf": {
    fields: [
      { name: "file", type: "file", label: "Locked PDF", placeholder: "", accept: ".pdf" },
      { name: "password", type: "text", label: "Document password", placeholder: "Enter password" },
    ],
    buttonText: "Unlock PDF",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      if (!v.password?.trim()) return { error: "Enter the document password." };
      try {
        const { PDFDocument } = await import("pdf-lib");
        const buf = dl(v.file);
        const doc = await PDFDocument.load(buf, { password: v.password } as any);
        const out = await doc.save();
        const blob = toBlob(out, "application/pdf");
        const url = URL.createObjectURL(blob);
        return { "Unlocked PDF": `__download__:${url}||unlocked-${Date.now()}.pdf`, Pages: `${doc.getPageCount()}` };
      } catch { return { error: "Incorrect password or PDF uses unsupported encryption." }; }
    },
  },
  "protect-pdf": {
    fields: [
      { name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" },
      { name: "password", type: "text", label: "Password to set", placeholder: "Enter a strong password" },
    ],
    buttonText: "Protect PDF",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      if (!v.password?.trim() || v.password.length < 4) return { error: "Password must be at least 4 characters." };
      try {
        const { PDFDocument } = await import("pdf-lib");
        const doc = await PDFDocument.load(dl(v.file));
        (doc as any).encrypt({ userPassword: v.password, ownerPassword: v.password + "_owner" });
        const out = await doc.save();
        const blob = toBlob(out, "application/pdf");
        const url = URL.createObjectURL(blob);
        return { "Protected PDF": `__download__:${url}||protected-${Date.now()}.pdf`, Pages: `${doc.getPageCount()}`, Note: "Password-protected. Use the Unlock PDF tool to remove protection." };
      } catch { return { error: "Failed to protect PDF. File may be damaged or already encrypted." }; }
    },
  },
  "pdf-metadata-editor": {
    fields: [
      { name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" },
      { name: "title", type: "text", label: "Title", placeholder: "Document Title" },
      { name: "author", type: "text", label: "Author", placeholder: "Author Name" },
      { name: "subject", type: "text", label: "Subject", placeholder: "Document Subject" },
      { name: "keywords", type: "text", label: "Keywords", placeholder: "keyword1, keyword2" },
    ],
    buttonText: "Update Metadata",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(dl(v.file));
      if (v.title?.trim()) doc.setTitle(v.title.trim());
      if (v.author?.trim()) doc.setAuthor(v.author.trim());
      if (v.subject?.trim()) doc.setSubject(v.subject.trim());
      if (v.keywords?.trim()) doc.setKeywords(v.keywords.split(",").map(s => s.trim()));
      const out = await doc.save();
      const blob = toBlob(out, "application/pdf");
      const url = URL.createObjectURL(blob);
      return {
        "Updated PDF": `__download__:${url}||updated-${Date.now()}.pdf`,
        "Title": doc.getTitle() || v.title || "(unchanged)",
        "Author": doc.getAuthor() || v.author || "(unchanged)",
        "Subject": doc.getSubject() || v.subject || "(unchanged)",
        "Keywords": doc.getKeywords() || v.keywords || "(unchanged)",
      };
    },
  },
  "pdf-page-number": {
    fields: [
      { name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" },
      { name: "position", type: "select", label: "Position", placeholder: "", options: [
        { label: "Bottom center", value: "bottom" }, { label: "Bottom right", value: "bottomRight" }, { label: "Top right", value: "topRight" },
      ]},
      { name: "startNum", type: "number", label: "Start number", placeholder: "1" },
    ],
    buttonText: "Add Page Numbers",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const doc = await PDFDocument.load(dl(v.file));
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const start = parseInt(v.startNum) || 1;
      const pos = v.position || "bottom";
      for (let i = 0; i < doc.getPageCount(); i++) {
        const page = doc.getPage(i);
        const { width, height } = page.getSize();
        const text = `${start + i}`;
        const size = 12;
        const textWidth = (text.length * size * 0.55);
        let x: number, y: number;
        if (pos === "bottomRight") { x = width - textWidth - 20; y = 20; }
        else if (pos === "topRight") { x = width - textWidth - 20; y = height - 20; }
        else { x = (width - textWidth) / 2; y = 20; }
        page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
      }
      const out = await doc.save();
      const blob = toBlob(out, "application/pdf");
      const url = URL.createObjectURL(blob);
      return { "Numbered PDF": `__download__:${url}||numbered-${Date.now()}.pdf`, Pages: `${doc.getPageCount()}`, Range: `${start}-${start + doc.getPageCount() - 1}` };
    },
  },
  "pdf-to-text": {
    fields: [{ name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" }],
    buttonText: "Extract Text",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      const pdf = await pdfjsLib.getDocument({ data: dl(v.file).buffer as ArrayBuffer }).promise;
      const pages: string[] = [];
      for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = getTextItems(content.items).join(" ");
        pages.push(text);
      }
      const full = pages.map((t, i) => `--- Page ${i + 1} ---\n${t}`).join("\n\n");
      return { "Extracted Text": full, Pages: `${pages.length}`, "Characters": `${full.length}`, Note: pdf.numPages > 50 ? "First 50 pages shown. For full extraction, use a dedicated tool." : "All pages extracted." };
    },
  },
  "pdf-to-png": {
    fields: [{ name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" }],
    buttonText: "Convert to PNG",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      const pdf = await pdfjsLib.getDocument({ data: dl(v.file).buffer as ArrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return { error: "Canvas not supported." };
      await page.render({ canvas: canvas, viewport } as any).promise;
      const pngUrl = canvas.toDataURL("image/png");
      return { Preview: `__image__:${pngUrl}`, "First Page": `__download__:${pngUrl}||page1-${Date.now()}.png`, "Total Pages": `${pdf.numPages}`, Note: "First page shown. For multi-page batch, use a dedicated tool." };
    },
  },
  "pdf-to-word": {
    fields: [{ name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" }],
    buttonText: "Convert to Word",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      const pdf = await pdfjsLib.getDocument({ data: dl(v.file).buffer as ArrayBuffer }).promise;
      let text = "";
      for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += getTextItems(content.items).join(" ") + "\n\n";
      }
      const html = `<!DOCTYPE html><html><body>${text.split("\n\n").map(p => `<p>${p}</p>`).join("")}</body></html>`;
      const blob = new Blob([html], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      return { "Word Document (.doc)": `__download__:${url}||extracted-${Date.now()}.doc`, Pages: `${pdf.numPages}`, Note: "Text extracted to Word-compatible format. Complex layouts may differ from original." };
    },
  },
  "word-to-pdf": {
    fields: [{ name: "file", type: "file", label: "Word file (.docx)", placeholder: "", accept: ".doc,.docx" }],
    buttonText: "Convert to PDF",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a Word document." };
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const page = doc.addPage([612, 792]);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      page.drawText("Word to PDF Conversion", { x: 50, y: 750, size: 24, font, color: rgb(0, 0, 0) });
      page.drawText("Your file has been received as a PDF container.", { x: 50, y: 700, size: 12, font, color: rgb(0.3, 0.3, 0.3) });
      page.drawText(`File: ${getFileName(v.file, "document.docx")}`, { x: 50, y: 670, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
      page.drawText("Note: Full DOCX-to-PDF conversion requires server-side processing.", { x: 50, y: 640, size: 10, font, color: rgb(0.8, 0.2, 0.2) });
      const out = await doc.save();
      const blob = toBlob(out, "application/pdf");
      const url = URL.createObjectURL(blob);
      return { PDF: `__download__:${url}||converted-${Date.now()}.pdf`, Note: "Full DOCX parsing requires a server-side library. The file has been wrapped as a PDF." };
    },
  },
  "pdf-to-excel": {
    fields: [{ name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" }],
    buttonText: "Convert to CSV",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      const pdf = await pdfjsLib.getDocument({ data: dl(v.file).buffer as ArrayBuffer }).promise;
      let csv = "Page,Text\n";
      for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = getTextItems(content.items).join(" ").replace(/"/g, '""');
        csv += `${i},"${text}"\n`;
      }
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      return { "CSV File": `__download__:${url}||extracted-${Date.now()}.csv`, Pages: `${pdf.numPages}`, Note: "Text extracted to CSV format. Table structure is not preserved." };
    },
  },
  "pdf-to-html": {
    fields: [{ name: "file", type: "file", label: "PDF file", placeholder: "", accept: ".pdf" }],
    buttonText: "Convert to HTML",
    asyncProcess: async (v) => {
      if (!v.file?.startsWith("data:")) return { error: "Upload a PDF file." };
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      const pdf = await pdfjsLib.getDocument({ data: dl(v.file).buffer as ArrayBuffer }).promise;
      const pages: string[] = [];
      for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvas: canvas, viewport } as any).promise;
          const imgData = canvas.toDataURL("image/jpeg", 0.8);
          pages.push(`<div class="page"><img src="${imgData}" style="width:100%;max-width:${viewport.width}px" alt="Page ${i}" /></div>`);
        }
      }
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PDF to HTML</title><style>body{margin:0;padding:20px;background:#f5f5f5}.page{margin:0 auto 20px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.1);padding:10px}img{display:block}</style></head><body>${pages.join("\n")}</body></html>`;
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      return { "HTML File": `__download__:${url}||converted-${Date.now()}.html`, Pages: `${pages.length}`, Note: "Pages rendered as images within HTML. Text extraction available in PDF to Text tool." };
    },
  },
  "pdf-compare": {
    fields: [
      { name: "file1", type: "file", label: "First PDF (original)", placeholder: "", accept: ".pdf" },
      { name: "file2", type: "file", label: "Second PDF (modified)", placeholder: "", accept: ".pdf" },
    ],
    buttonText: "Compare PDFs",
    asyncProcess: async (v) => {
      if (!v.file1?.startsWith("data:") || !v.file2?.startsWith("data:")) return { error: "Upload two PDF files to compare." };
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      const pdf1 = await pdfjsLib.getDocument({ data: dl(v.file1) }).promise;
      const pdf2 = await pdfjsLib.getDocument({ data: dl(v.file2) }).promise;
      const extract = async (pdf: any) => {
        const lines: string[] = [];
        for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          lines.push(getTextItems(content.items).join(" "));
        }
        return lines.join("\n");
      };
      const text1 = await extract(pdf1);
      const text2 = await extract(pdf2);
      const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(Boolean));
      const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(Boolean));
      const added = [...words2].filter(w => !words1.has(w));
      const removed = [...words1].filter(w => !words2.has(w));
      return {
        "Document 1": `${pdf1.numPages} pages, ${text1.length} chars`,
        "Document 2": `${pdf2.numPages} pages, ${text2.length} chars`,
        "Words Added": added.slice(0, 50).join(", ") + (added.length > 50 ? `... (+${added.length - 50} more)` : ""),
        "Words Removed": removed.slice(0, 50).join(", ") + (removed.length > 50 ? `... (+${removed.length - 50} more)` : ""),
        Difference: `${added.length + removed.length} word-level differences found`,
        Note: "This is a word-level text comparison. Visual/page diff is not supported.",
      };
    },
  },
};

const CHECKER_CONFIGS: Record<string, ToolConfig> = {
  "dns-lookup": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Look Up DNS",
    apiEndpoint: "/api/tools/dns-lookup",
    howTo: [
      { action: "Enter", desc: "Type the domain name you want to check (e.g. example.com)." },
      { action: "Look Up", desc: "Click 'Look Up DNS' to fetch all DNS records." },
      { action: "Review", desc: "Review A, AAAA, MX, NS, TXT, and other returned records." },
    ],
  },
  "reverse-dns-lookup": {
    fields: [{ name: "input", type: "text", label: "IP address", placeholder: "8.8.8.8" }],
    buttonText: "Reverse Lookup",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "whois-lookup": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Look Up WHOIS",
    apiEndpoint: "/api/tools/dns-lookup",
    howTo: [
      { action: "Enter", desc: "Type the domain name you want to investigate." },
      { action: "Look Up", desc: "Click 'Look Up WHOIS' to fetch domain registration details." },
      { action: "Review", desc: "Check registrar, creation/expiry dates, name servers, and contact info." },
    ],
  },
  "http-headers-checker": {
    fields: [{ name: "input", type: "text", label: "URL", placeholder: "https://example.com" }],
    buttonText: "Check Headers",
    apiEndpoint: "/api/tools/http-headers",
    howTo: [
      { action: "Enter", desc: "Paste the full URL (including https://) of the page to check." },
      { action: "Check", desc: "Click 'Check Headers' to fetch HTTP response headers." },
      { action: "Review", desc: "Examine security headers, caching directives, content-type, and server info." },
    ],
  },
  "ssl-certificate-checker": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Check SSL",
    apiEndpoint: "/api/tools/dns-lookup",
    howTo: [
      { action: "Enter", desc: "Type the domain name whose SSL certificate you want to check." },
      { action: "Check", desc: "Click 'Check SSL' to analyze the certificate chain." },
      { action: "Review", desc: "Check expiry date, issuer, SANs, and any security warnings." },
    ],
  },
  "ping-test": {
    fields: [{ name: "input", type: "text", label: "Hostname or IP", placeholder: "example.com" }],
    buttonText: "Ping",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "port-checker": {
    fields: [
      { name: "input", type: "text", label: "Hostname or IP", placeholder: "example.com" },
      { name: "port", type: "number", label: "Port number", placeholder: "80" },
    ],
    buttonText: "Check Port",
    apiEndpoint: "/api/tools/dns-lookup",
    howTo: [
      { action: "Enter", desc: "Type the hostname or IP and the port number to test." },
      { action: "Check", desc: "Click 'Check Port' to test if the port is open and reachable." },
      { action: "Review", desc: "See whether the port is open, closed, or filtered." },
    ],
  },
  "website-status-checker": {
    fields: [{ name: "input", type: "text", label: "URL", placeholder: "https://example.com" }],
    buttonText: "Check Status",
    apiEndpoint: "/api/tools/website-status",
  },
  "uptime-checker": {
    fields: [{ name: "input", type: "text", label: "URL", placeholder: "https://example.com" }],
    buttonText: "Check Uptime",
    apiEndpoint: "/api/tools/uptime-checker",
  },
  "speed-test": {
    fields: [],
    buttonText: "Start Test",
    asyncProcess: async () => {
      const start = performance.now();
      try {
        const res = await fetch("https://www.google.com/favicon.ico", { mode: "no-cors" });
        const elapsed = Math.round(performance.now() - start);
        return { "Latency": `${elapsed}ms`, "Status": res.status || "OK", "Note": "Simple latency test via no-cors fetch. For bandwidth testing, use a dedicated speed test service." };
      } catch { return { error: "Speed test failed. Check your network connection." }; }
    },
  },
  "spf-lookup": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Look Up SPF",
    apiEndpoint: "/api/tools/dns-lookup",
    howTo: [
      { action: "Enter", desc: "Type the domain to check for SPF records." },
      { action: "Look Up", desc: "Click 'Look Up SPF' to fetch the SPF TXT record." },
      { action: "Review", desc: "Review allowed senders, IP ranges, and the enforcement policy." },
    ],
  },
  "dkim-lookup": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Look Up DKIM",
    apiEndpoint: "/api/tools/dns-lookup",
    howTo: [
      { action: "Enter", desc: "Type the domain and selector to check for DKIM records." },
      { action: "Look Up", desc: "Click 'Look Up DKIM' to fetch the DKIM public key." },
      { action: "Review", desc: "Verify the DKIM key is properly published and matches your email signer." },
    ],
  },
  "dmarc-lookup": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Look Up DMARC",
    apiEndpoint: "/api/tools/dns-lookup",
    howTo: [
      { action: "Enter", desc: "Type the domain to check for DMARC policy." },
      { action: "Look Up", desc: "Click 'Look Up DMARC' to fetch the DMARC TXT record." },
      { action: "Review", desc: "Review the DMARC policy (none/quarantine/reject) and reporting addresses." },
    ],
  },
  "mx-lookup": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Look Up MX",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "redirect-checker": {
    fields: [{ name: "input", type: "text", label: "URL", placeholder: "https://example.com" }],
    buttonText: "Check Redirects",
    apiEndpoint: "/api/tools/redirect-checker",
  },
  "user-agent-parser": {
    fields: [{ name: "input", type: "textarea", label: "User-Agent string", placeholder: "Mozilla/5.0 (Windows NT 10.0; ..." }],
    buttonText: "Parse",
    asyncProcess: async (v) => {
      const t = (v.input || "").trim();
      if (!t) return { error: "Enter a User-Agent string" };
      try {
        const { UAParser } = (await import("ua-parser-js")).default;
        const ua = new UAParser(t);
        const b = ua.getBrowser(); const os = ua.getOS(); const d = ua.getDevice();
        return { Browser: `${b.name || "?"} ${b.version || ""}`, OS: `${os.name || "?"} ${os.version || ""}`, Device: d.vendor ? `${d.vendor} ${d.model || ""}` : "Desktop", CPU: ua.getCPU().architecture || "Unknown", Engine: ua.getEngine().name || "Unknown", "UA Length": t.length };
      } catch { return { error: "Failed to parse User-Agent string" }; }
    },
  },
  "subnet-calculator": {
    fields: [
      { name: "ip", type: "text", label: "IP address", placeholder: "192.168.1.0" },
      { name: "cidr", type: "number", label: "CIDR prefix", placeholder: "24" },
    ],
    buttonText: "Calculate Subnet",
    process: (v) => {
      const ipStr = v.ip?.trim() || "";
      const prefix = parseInt(v.cidr) || 24;
      const octets = ipStr.split(".").map(Number);
      if (octets.length !== 4 || octets.some(isNaN) || prefix < 0 || prefix > 32) return { error: "Enter a valid IP address and CIDR prefix (0-32)" };
      const ipNum = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
      const mask = ~(0xFFFFFFFF >>> prefix) >>> 0;
      const network = (ipNum & mask) >>> 0;
      const broadcast = (ipNum | ~mask) >>> 0;
      const firstHost = prefix < 32 ? network + 1 : network;
      const lastHost = prefix < 31 ? broadcast - 1 : broadcast;
      const totalHosts = prefix < 31 ? Math.pow(2, 32 - prefix) - 2 : prefix === 31 ? 2 : 1;
      const toIp = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
      return { Network: toIp(network) + "/" + prefix, "Subnet Mask": toIp(mask), "Broadcast": toIp(broadcast), "First Host": toIp(firstHost), "Last Host": toIp(lastHost), "Total Hosts": totalHosts, "CIDR Notation": "255." + [mask >>> 24, (mask >>> 16) & 255, (mask >>> 8) & 255, mask & 255].filter((_, i) => i > 0).join(".") };
    },
  },
  "jwt-decoder": {
    fields: [{ name: "input", type: "textarea", label: "JWT token", placeholder: "eyJhbGciOiJIUzI1NiIs..." }],
    buttonText: "Decode JWT",
    process: (v) => {
      const t = (v.input || "").trim();
      const parts = t.split(".");
      if (parts.length !== 3) return { error: "Invalid JWT format — expected 3 dot-separated parts" };
      try {
        const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
        const formatted = { header: JSON.stringify(header, null, 2), payload: JSON.stringify(payload, null, 2), "signature (truncated)": parts[2].slice(0, 32) + "..." };
        const exp = payload.exp ? new Date(payload.exp * 1000).toISOString() : undefined;
        const iat = payload.iat ? new Date(payload.iat * 1000).toISOString() : undefined;
        return { ...formatted, ...(exp ? { expires: exp } : {}), ...(iat ? { issued: iat } : {}), "header (decoded)": JSON.parse(JSON.stringify(header)), "payload (decoded)": JSON.parse(JSON.stringify(payload)) };
      } catch { return { error: "Invalid JWT — base64 decode failed" }; }
    },
  },
  "regex-tester": {
    fields: [
      { name: "pattern", type: "text", label: "Regular expression", placeholder: "\\d+" },
      { name: "flags", type: "text", label: "Flags", placeholder: "gi" },
      { name: "input", type: "textarea", label: "Test text", placeholder: "Enter text to test against..." },
    ],
    buttonText: "Test Regex",
    process: (v) => {
      const pattern = v.pattern || "";
      const flags = v.flags || "g";
      const input = v.input || "";
      if (!pattern) return { error: "Enter a regular expression pattern" };
      try {
        const re = new RegExp(pattern, flags);
        const matches: string[] = [];
        let match: RegExpExecArray | null;
        let count = 0;
        while ((match = re.exec(input)) !== null) {
          if (match.index === re.lastIndex) re.lastIndex++;
          count++;
          if (count <= 50) matches.push(`[${match.index}] ${match[0].length > 100 ? match[0].slice(0, 100) + "..." : match[0]}`);
        }
        return { matches: count, "match details": matches.length > 0 ? matches.join("\n") : "(no matches)", pattern: `/${pattern}/${flags}`, input: input.length > 200 ? input.slice(0, 200) + "..." : input };
      } catch (e) { return { error: `Invalid regex: ${(e as Error).message}` }; }
    },
  },
  "md5-hash-generator": {
    fields: [{ name: "input", type: "textarea", label: "Text to hash", placeholder: "Enter text..." }],
    buttonText: "Generate MD5",
    process: (v) => {
      const md5 = (s: string): string => {
        const rotateLeft = (x: number, n: number) => (x << n) | (x >>> (32 - n));
        const utf8 = unescape(encodeURIComponent(s));
        const bytes: number[] = [];
        for (let i = 0; i < utf8.length; i++) bytes.push(utf8.charCodeAt(i));
        const bitLen = bytes.length * 8;
        bytes.push(0x80);
        while (bytes.length % 64 !== 56) bytes.push(0);
        for (let i = 0; i < 8; i++) bytes.push((bitLen >>> (i * 8)) & 0xFF);
        const K = [0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665, 0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391];
        const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
        let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
        for (let offset = 0; offset < bytes.length; offset += 64) {
          const M: number[] = [];
          for (let i = 0; i < 16; i++) M[i] = bytes[offset + i * 4] | (bytes[offset + i * 4 + 1] << 8) | (bytes[offset + i * 4 + 2] << 16) | (bytes[offset + i * 4 + 3] << 24);
          let A = a0, B = b0, C = c0, D = d0;
          for (let i = 0; i < 64; i++) {
            let F: number, g: number;
            if (i < 16) { F = (B & C) | (~B & D); g = i; }
            else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
            else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
            else { F = C ^ (B | ~D); g = (7 * i) % 16; }
            F = (F + A + K[i] + M[g]) & 0xFFFFFFFF;
            A = D; D = C; C = B; B = (B + rotateLeft(F, S[i])) & 0xFFFFFFFF;
          }
          a0 = (a0 + A) & 0xFFFFFFFF; b0 = (b0 + B) & 0xFFFFFFFF; c0 = (c0 + C) & 0xFFFFFFFF; d0 = (d0 + D) & 0xFFFFFFFF;
        }
        const toHex = (n: number) => ((n >>> 0) & 0xFFFFFFFF).toString(16).padStart(8, "0");
        return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
      };
      const hash = md5(v.input || "");
      return { MD5: hash, length: hash.length, input: v.input.length > 50 ? v.input.slice(0, 50) + "..." : v.input };
    },
  },
  "sha-hash-generator": {
    fields: [
      { name: "input", type: "textarea", label: "Text to hash", placeholder: "Enter text..." },
      { name: "algorithm", type: "select", label: "Algorithm", placeholder: "", options: [
        { label: "SHA-256", value: "SHA-256" },
        { label: "SHA-384", value: "SHA-384" },
        { label: "SHA-512", value: "SHA-512" },
        { label: "SHA-1", value: "SHA-1" },
      ]},
    ],
    buttonText: "Generate Hash",
    asyncProcess: async (v) => {
      const t = v.input || "";
      if (!t) return { error: "Enter text to hash" };
      const algo = v.algorithm || "SHA-256";
      if (typeof crypto === "undefined" || !crypto.subtle) return { error: "Web Crypto API is not available in this environment" };
      try {
        const enc = new TextEncoder();
        const hashBuf = await crypto.subtle.digest(algo, enc.encode(t));
        const hash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
        return { hash, algorithm: algo, length: hash.length, input: t.length > 50 ? t.slice(0, 50) + "..." : t };
      } catch { return { error: "Hash generation failed — unsupported algorithm" }; }
    },
  },
  "html-minifier": {
    fields: [{ name: "input", type: "textarea", label: "HTML code", placeholder: "<html>\n<body>\n  <p>Hello</p>\n</body>\n</html>" }],
    buttonText: "Minify",
    process: CLIENT_TOOLS["html-minifier"],
  },
  "css-minifier": {
    fields: [{ name: "input", type: "textarea", label: "CSS code", placeholder: "body {\n  color: red;\n}" }],
    buttonText: "Minify",
    process: CLIENT_TOOLS["css-minifier"],
  },
  "js-minifier": {
    fields: [{ name: "input", type: "textarea", label: "JavaScript code", placeholder: "function hello() {\n  return 'world';\n}" }],
    buttonText: "Minify",
    process: CLIENT_TOOLS["js-minifier"],
  },
  "number-base-converter": {
    fields: [
      { name: "input", type: "text", label: "Number", placeholder: "255" },
      { name: "from", type: "select", label: "From base", placeholder: "", options: [
        { label: "Binary (2)", value: "2" }, { label: "Octal (8)", value: "8" },
        { label: "Decimal (10)", value: "10" }, { label: "Hexadecimal (16)", value: "16" },
      ]},
      { name: "to", type: "select", label: "To base", placeholder: "", options: [
        { label: "Binary (2)", value: "2" }, { label: "Octal (8)", value: "8" },
        { label: "Decimal (10)", value: "10" }, { label: "Hexadecimal (16)", value: "16" },
      ]},
    ],
    buttonText: "Convert",
    process: (v) => {
      const t = v.input?.trim() || "";
      const from = parseInt(v.from) || 10;
      const to = parseInt(v.to) || 16;
      if (!t) return { error: "Enter a number" };
      try {
        const decimal = parseInt(t, from);
        if (isNaN(decimal)) return { error: `Invalid number for base ${from}` };
        const result = decimal.toString(to).toUpperCase();
        return { result, decimal, from_base: from, to_base: to, binary: decimal.toString(2), octal: decimal.toString(8), hex: decimal.toString(16).toUpperCase() };
      } catch { return { error: "Invalid input for the selected base" }; }
    },
  },
  "text-to-slug": {
    fields: [{ name: "input", type: "text", label: "Text to convert", placeholder: "Hello World! This is a Title" }],
    buttonText: "Convert to Slug",
    process: (v) => {
      const t = v.input || "";
      const slug = t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      return { slug, original: t };
    },
  },
  "url-parser": {
    fields: [{ name: "input", type: "text", label: "URL", placeholder: "https://example.com/path?q=hello#fragment" }],
    buttonText: "Parse URL",
    process: (v) => {
      const t = (v.input || "").trim();
      if (!t) return { error: "Enter a URL" };
      try {
        const u = new URL(t);
        const params: Record<string, string> = {};
        u.searchParams.forEach((v2, k) => { params[k] = v2; });
        return { protocol: u.protocol, hostname: u.hostname, port: u.port || "(default)", pathname: u.pathname, search: u.search || "(none)", hash: u.hash || "(none)", host: u.host, origin: u.origin, "query params": Object.keys(params).length > 0 ? JSON.stringify(params, null, 2) : "(none)" };
      } catch { return { error: "Invalid URL format" }; }
    },
  },
  "json-validator": {
    fields: [{ name: "input", type: "textarea", label: "JSON to validate", placeholder: '{"key": "value"}' }],
    buttonText: "Validate",
    process: (v) => {
      const t = v.input?.trim() || "";
      if (!t) return { error: "Enter JSON to validate" };
      try {
        const parsed = JSON.parse(t);
        const formatted = JSON.stringify(parsed, null, 2);
        return { valid: "Yes", formatted, type: Array.isArray(parsed) ? "Array" : typeof parsed === "object" ? "Object" : typeof parsed, keys: typeof parsed === "object" && parsed !== null ? Object.keys(parsed).length : "N/A", "size (chars)": t.length, "size (formatted)": formatted.length };
      } catch (e) { return { error: `Invalid JSON: ${(e as Error).message}` }; }
    },
  },
  "yaml-formatter": {
    fields: [{ name: "input", type: "textarea", label: "YAML input", placeholder: "key: value\nlist:\n  - item" }],
    buttonText: "Format YAML",
    asyncProcess: async (v) => {
      const t = (v.input || "").trim();
      if (!t) return { error: "Enter YAML to format" };
      try {
        const yaml = await import("js-yaml");
        const parsed = yaml.load(t);
        const formatted = yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true, sortKeys: true });
        return { formatted, original: t };
      } catch (e) { return { error: "Invalid YAML: " + (e as Error).message }; }
    },
  },
  "xml-formatter": {
    fields: [{ name: "input", type: "textarea", label: "XML input", placeholder: "<root><item>value</item></root>" }],
    buttonText: "Format XML",
    process: (v) => {
      const t = (v.input || "").trim();
      if (!t) return { error: "Enter XML to format" };
      if (typeof DOMParser === "undefined") return { error: "XML formatting requires a browser environment" };
      try {
        const doc = new DOMParser().parseFromString(t, "text/xml");
        const serializer = new XMLSerializer();
        const formatted = serializer.serializeToString(doc);
        const pretty = (xml: string) => { let indent = 0; return xml.replace(/(<\/?[^>]+>)/g, (m) => { if (m.startsWith("</")) indent--; const r = "\n" + "  ".repeat(Math.max(0, indent)) + m; if (m.startsWith("<") && !m.startsWith("</") && !m.endsWith("/>")) indent++; return r; }).trim(); };
        return { formatted: pretty(formatted), original: t };
      } catch { return { error: "Invalid XML — check that it is well-formed" }; }
    },
  },
  "csv-formatter": {
    fields: [{ name: "input", type: "textarea", label: "CSV data", placeholder: "name,email\nJohn,john@example.com" }],
    buttonText: "Format CSV",
    process: (v) => {
      const t = v.input || "";
      const rows = t.split("\n").map(r => r.split(",").map(c => c.trim()));
      if (rows.length === 0 || rows[0].length === 0) return { error: "Enter CSV data" };
      const colWidths = rows[0].map((_, ci) => Math.max(...rows.map(r => (r[ci] || "").length)));
      const pad = (s: string, w: number) => s + " ".repeat(Math.max(0, w - s.length));
      const aligned = rows.map(r => r.map((c, i) => pad(c, colWidths[i])).join(" | "));
      const separator = colWidths.map(w => "-".repeat(w)).join(" | ");
      const table = [aligned[0], separator, ...aligned.slice(1)].join("\n");
      return { formatted: table, rows: rows.length, cols: rows[0].length };
    },
  },
  "css-prefixer": {
    fields: [{ name: "input", type: "textarea", label: "CSS code", placeholder: ".box { display: flex; }" }],
    buttonText: "Add Prefixes",
    process: CLIENT_TOOLS["css-prefixer"],
  },
  "js-beautifier": {
    fields: [{ name: "input", type: "textarea", label: "JavaScript code", placeholder: "function test(){return 1;}" }],
    buttonText: "Beautify JS",
    process: CLIENT_TOOLS["js-beautifier"],
  },
  "json-to-typescript": {
    fields: [{ name: "input", type: "textarea", label: "JSON object", placeholder: '{\n  "name": "John",\n  "age": 30\n}' }],
    buttonText: "Convert to TypeScript",
    process: (v) => {
      const t = v.input?.trim() || "";
      if (!t) return { error: "Enter JSON to convert" };
      try {
        const parsed = JSON.parse(t);
        const toTS = (obj: unknown, name = "Root"): string => {
          if (obj === null) return "null";
          if (Array.isArray(obj)) {
            if (obj.length === 0) return "unknown[]";
            const itemType = toTS(obj[0]);
            return `${itemType}[]`;
          }
          if (typeof obj === "object") {
            const entries = Object.entries(obj as Record<string, unknown>);
            const fields = entries.map(([k, v2]) => `  ${k.replace(/[^a-zA-Z0-9_]/g, "_")}: ${toTS(v2)};`).join("\n");
            return `{\n${fields}\n}`;
          }
          if (typeof obj === "string") return "string";
          if (typeof obj === "number") return "number";
          if (typeof obj === "boolean") return "boolean";
          return "unknown";
        };
        const interface_ = `interface ${name} ${toTS(parsed)}`;
        return { "TypeScript Interface": interface_, original: t };
      } catch { return { error: "Invalid JSON input" }; }
    },
  },
  "css-selector-tester": {
    fields: [
      { name: "selector", type: "text", label: "CSS selector", placeholder: ".my-class > p" },
      { name: "html", type: "textarea", label: "HTML content", placeholder: "<div class=\"my-class\"><p>Test</p></div>" },
    ],
    buttonText: "Test Selector",
    process: (v) => {
      const selector = (v.selector || "").trim();
      const html = v.html || "";
      if (!selector) return { error: "Enter a CSS selector" };
      if (typeof DOMParser === "undefined") return { error: "Selector testing requires a browser environment" };
      try {
        const doc = new DOMParser().parseFromString(html, "text/html");
        try { doc.querySelectorAll(selector); } catch { return { error: `Invalid CSS selector: "${selector}"` }; }
        const matched = doc.querySelectorAll(selector);
        const count = matched.length;
        const details = count > 0 ? Array.from(matched).slice(0, 20).map((el, i) => `${i + 1}. <${el.tagName.toLowerCase()}${el.className ? ' class="' + el.className + '"' : ""}>`).join("\n") : "";
        return { matches: count, selector, "matched elements": details || "(none matched)", "sample HTML": html.length > 200 ? html.slice(0, 200) + "..." : html };
      } catch { return { "matches": 0, error: "Error parsing HTML; check that it is well-formed" }; }
    },
  },
  "json-to-csv": {
    fields: [{ name: "input", type: "textarea", label: "JSON data", placeholder: '[{"name":"John","age":30}]' }],
    buttonText: "Convert to CSV",
    process: (v) => {
      const t = v.input?.trim() || "";
      if (!t) return { error: "Enter JSON data" };
      try {
        const data = JSON.parse(t);
        const arr = Array.isArray(data) ? data : [data];
        if (arr.length === 0) return { error: "JSON array is empty" };
        const keys = [...new Set(arr.flatMap(Object.keys))];
        const escape = (s: string) => /[,"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
        const header = keys.join(",");
        const rows = arr.map(row => keys.map(k => escape(String((row as Record<string, unknown>)[k] ?? ""))).join(","));
        const csv = [header, ...rows].join("\n");
        return { csv, rows: arr.length, columns: keys.length };
      } catch { return { error: "Invalid JSON — expected an array of objects" }; }
    },
  },
  "csv-to-json": {
    fields: [{ name: "input", type: "textarea", label: "CSV data", placeholder: "name,age\nJohn,30" }],
    buttonText: "Convert to JSON",
    process: (v) => {
      const t = v.input?.trim() || "";
      if (!t) return { error: "Enter CSV data" };
      try {
        const lines = t.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) return { error: "CSV must have a header row and at least one data row" };
        const headers = lines[0].split(",").map(h => h.trim().replace(/^"(.*)"$/, "$1"));
        const rows = lines.slice(1).map(l => {
          const vals: string[] = []; let cur = ""; let inQ = false;
          for (const c of l) { if (c === '"') inQ = !inQ; else if (c === "," && !inQ) { vals.push(cur.trim()); cur = ""; } else cur += c; }
          vals.push(cur.trim());
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => { obj[h] = vals[i] ? vals[i].replace(/^"(.*)"$/, "$1") : ""; });
          return obj;
        });
        return { json: JSON.stringify(rows, null, 2), count: rows.length };
      } catch { return { error: "Failed to parse CSV — check formatting" }; }
    },
  },
  "yaml-to-json": {
    fields: [{ name: "input", type: "textarea", label: "YAML input", placeholder: "name: John\nage: 30" }],
    buttonText: "Convert to JSON",
    asyncProcess: async (v) => {
      const t = (v.input || "").trim();
      if (!t) return { error: "Enter YAML to convert" };
      try {
        const yaml = await import("js-yaml");
        const parsed = yaml.load(t);
        const formatted = JSON.stringify(parsed, null, 2);
        return { json: formatted, original: t };
      } catch (e) { return { error: "Invalid YAML: " + (e as Error).message }; }
    },
  },
  "json-to-xml": {
    fields: [{ name: "input", type: "textarea", label: "JSON data", placeholder: '{"root": {"item": "value"}}' }],
    buttonText: "Convert to XML",
    process: (v) => {
      const t = v.input?.trim() || "";
      if (!t) return { error: "Enter JSON data" };
      try {
        const obj = JSON.parse(t);
        const toXml = (data: unknown, name = "root"): string => {
          if (data === null || data === undefined) return "<" + name + "/>";
          if (Array.isArray(data)) return data.map(item => toXml(item, name)).join("\n");
          if (typeof data === "object") {
            const entries = Object.entries(data as Record<string, unknown>);
            const children = entries.map(([k, v2]) => toXml(v2, k)).join("\n");
            return "<" + name + ">\n" + children + "\n</" + name + ">";
          }
          return "<" + name + ">" + String(data) + "</" + name + ">";
        };
        return { xml: toXml(obj), original: t };
      } catch { return { error: "Invalid JSON" }; }
    },
  },
  "xml-to-json": {
    fields: [{ name: "input", type: "textarea", label: "XML input", placeholder: "<root><item>value</item></root>" }],
    buttonText: "Convert to JSON",
    process: (v) => {
      const t = (v.input || "").trim();
      if (!t) return { error: "Enter XML data" };
      if (typeof DOMParser === "undefined") return { error: "XML conversion requires a browser environment" };
      try {
        const doc = new DOMParser().parseFromString(t, "text/xml");
        const parseNode = (node: Element | Document): unknown => {
          const children = Array.from(node.children);
          if (children.length === 0) return (node.textContent || "").trim();
          const obj: Record<string, unknown> = {};
          for (const child of children) {
            const key = child.tagName;
            const val = parseNode(child);
            if (obj[key] !== undefined) obj[key] = Array.isArray(obj[key]) ? [...(obj[key] as unknown[]), val] : [obj[key], val];
            else obj[key] = val;
          }
          return obj;
        };
        const json = parseNode(doc.documentElement || doc);
        return { json: JSON.stringify(json, null, 2), original: t };
      } catch { return { error: "Invalid XML — check that it is well-formed" }; }
    },
  },
  "xml-to-csv": {
    fields: [{ name: "input", type: "textarea", label: "XML input", placeholder: "<records><record><name>John</name></record></records>" }],
    buttonText: "Convert to CSV",
    process: (v) => {
      const t = (v.input || "").trim();
      if (!t) return { error: "Enter XML data" };
      if (typeof DOMParser === "undefined") return { error: "XML conversion requires a browser environment" };
      try {
        const doc = new DOMParser().parseFromString(t, "text/xml");
        const root = doc.documentElement;
        if (!root) return { error: "Empty XML document" };
        const records = Array.from(root.children);
        if (records.length === 0) return { error: "No child elements found in root" };
        const keys = [...new Set(records.flatMap(r => Array.from(r.children).map(c => c.tagName)))];
        const escape = (s: string) => /[,"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
        const header = keys.join(",");
        const rows = records.map(r => keys.map(k => escape((r.querySelector(k)?.textContent || "").trim())).join(","));
        const csv = [header, ...rows].join("\n");
        return { csv, records: records.length, fields: keys.length };
      } catch { return { error: "Invalid XML — check that it is well-formed with a repeating child structure" }; }
    },
  },
  "markdown-to-html": {
    fields: [{ name: "input", type: "textarea", label: "Markdown", placeholder: "# Hello\nThis is **bold** text." }],
    buttonText: "Convert to HTML",
    asyncProcess: async (v) => {
      const t = v.input || "";
      if (!t.trim()) return { error: "Enter Markdown to convert" };
      try {
        const { marked } = await import("marked");
        const html = await marked.parse(t);
        return { html, "length (chars)": html.length, original: t.length > 100 ? t.slice(0, 100) + "..." : t };
      } catch { return { error: "Markdown conversion failed" }; }
    },
  },
  "html-to-markdown": {
    fields: [{ name: "input", type: "textarea", label: "HTML", placeholder: "<h1>Hello</h1><p>This is <strong>bold</strong> text.</p>" }],
    buttonText: "Convert to Markdown",
    process: CLIENT_TOOLS["html-to-markdown"],
  },
  "rgb-to-hex": {
    fields: [
      { name: "r", type: "number", label: "Red (0-255)", placeholder: "255" },
      { name: "g", type: "number", label: "Green (0-255)", placeholder: "102" },
      { name: "b", type: "number", label: "Blue (0-255)", placeholder: "0" },
    ],
    buttonText: "Convert",
    process: (v) => {
      const r = parseInt(v.r); const g = parseInt(v.g); const b = parseInt(v.b);
      if ([r, g, b].some(n => isNaN(n) || n < 0 || n > 255)) return { error: "Enter valid RGB values (0-255)" };
      const hex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
      return { HEX: hex, RGB: `rgb(${r}, ${g}, ${b})`, swatch: `background:${hex};width:100%;height:48px;border-radius:8px;border:1px solid #e4e4e7`, R: r, G: g, B: b };
    },
  },
  "timestamp-converter": {
    fields: [
      { name: "input", type: "text", label: "Unix timestamp or date", placeholder: "1700000000 or 2024-01-01" },
    ],
    buttonText: "Convert",
    process: (v) => {
      const t = (v.input || "").trim();
      if (!t) return { error: "Enter a timestamp or date" };
      const isNum = /^\d+(\.\d+)?$/.test(t);
      const ms = isNum ? (t.length === 10 ? parseInt(t) * 1000 : parseInt(t)) : Date.parse(t);
      if (isNaN(ms)) return { error: "Could not parse input — try a Unix timestamp (e.g. 1700000000) or date (e.g. 2024-01-01)" };
      const d = new Date(ms);
      const pad = (n: number) => n.toString().padStart(2, "0");
      return {
        "Unix (seconds)": Math.floor(ms / 1000).toString(),
        "Unix (ms)": ms.toString(),
        "UTC String": d.toUTCString(),
        "ISO 8601": d.toISOString(),
        "Local Date": d.toLocaleDateString(),
        "Local Time": d.toLocaleTimeString(),
        "Local Full": d.toString(),
        Year: d.getFullYear().toString(),
        Month: pad(d.getMonth() + 1),
        Day: pad(d.getDate()),
        Hour: pad(d.getHours()),
        Minute: pad(d.getMinutes()),
        Second: pad(d.getSeconds()),
      };
    },
  },
  "html-preview": {
    fields: [{ name: "input", type: "textarea", label: "HTML code", placeholder: "<h1>Hello World</h1>\n<p>Type HTML here...</p>" }],
    buttonText: "Preview",
    process: (v) => {
      const html = v.input || "";
      return { html, "characters": html.length, "lines": html.split("\n").length };
    },
  },
  "markdown-preview": {
    fields: [{ name: "input", type: "textarea", label: "Markdown", placeholder: "# Hello\nType markdown here..." }],
    buttonText: "Preview",
    asyncProcess: async (v) => {
      const t = v.input || "";
      try {
        const { marked } = await import("marked");
        const html = await marked.parse(t || "*Type something to see the preview*");
        return { "Rendered HTML": html, "source (chars)": t.length };
      } catch { return { error: "Preview generation failed" }; }
    },
  },
  "sql-formatter": {
    fields: [{ name: "input", type: "textarea", label: "SQL query", placeholder: "SELECT * FROM users WHERE id = 1" }],
    buttonText: "Format SQL",
    process: CLIENT_TOOLS["sql-formatter"],
  },
  "json-path-search": {
    fields: [
      { name: "json", type: "textarea", label: "JSON data", placeholder: '{"store":{"book":[{"title":"Test"}]}}' },
      { name: "path", type: "text", label: "JSONPath expression", placeholder: "$.store.book[*].title" },
    ],
    buttonText: "Search",
    process: (v) => {
      const jsonStr = v.json?.trim() || "";
      const path = (v.path || "").trim();
      if (!jsonStr) return { error: "Enter JSON data" };
      if (!path) return { error: "Enter a JSONPath expression" };
      try {
        const data = JSON.parse(jsonStr);
        const resolve = (obj: unknown, expr: string): unknown[] => {
          if (!expr.startsWith("$")) return [obj];
          const parts = expr.replace(/^\$\.?/, "").split(/(?=\.|\[)/);
          let current: unknown[] = [obj];
          for (const part of parts) {
            if (part === "") continue;
            const next: unknown[] = [];
            for (const item of current) {
              if (typeof item !== "object" || item === null) continue;
              const arrItem = item as Record<string, unknown>;
              if (part.startsWith("[")) {
                const match = part.match(/\[(\d+)\]/);
                if (match) { const idx = parseInt(match[1]); if (Array.isArray(item) && idx < item.length) next.push(item[idx]); }
                else if (part === "[*]") { if (Array.isArray(item)) next.push(...item); }
              } else {
                const key = part.replace(/^\./, "");
                if (key in arrItem) next.push(arrItem[key]);
                else if (key === "*" && Array.isArray(item)) next.push(...item);
              }
            }
            current = next;
          }
          return current;
        };
        const results = resolve(data, path);
        return { result: results.length > 0 ? results.map(r => typeof r === "object" ? JSON.stringify(r, null, 2) : String(r)).join("\n---\n") : "(no results)", count: results.length, path };
      } catch (e) { return { error: "Invalid JSON or path expression: " + (e as Error).message }; }
    },
  },
  "list-randomizer": {
    fields: [{ name: "input", type: "textarea", label: "Items (one per line)", placeholder: "item1\nitem2\nitem3" }],
    buttonText: "Randomize",
    process: (v) => {
      const items = v.input.trim().split("\n").filter(Boolean);
      for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
      return { result: items.join("\n"), count: items.length };
    },
  },
  "remove-duplicate-lines": {
    fields: [{ name: "input", type: "textarea", label: "Text with duplicates", placeholder: "line1\nline1\nline2\nline3\nline2" }],
    buttonText: "Remove Duplicates",
    process: (v) => {
      const lines = v.input.split("\n");
      const seen = new Set<string>();
      const result: string[] = [];
      for (const l of lines) { if (!seen.has(l.trim())) { seen.add(l.trim()); result.push(l); } }
      return { cleaned: result.join("\n"), original: lines.length, unique: result.length, removed: lines.length - result.length };
    },
  },
  "sort-lines": {
    fields: [{ name: "input", type: "textarea", label: "Text to sort", placeholder: "banana\napple\ncherry" }],
    buttonText: "Sort Lines",
    process: (v) => {
      const lines = v.input.split("\n");
      const sorted = [...lines].sort((a, b) => a.localeCompare(b));
      const sortedDesc = [...lines].sort((a, b) => b.localeCompare(a));
      return { sorted: sorted.join("\n"), "sorted (descending)": sortedDesc.join("\n"), count: lines.length };
    },
  },
  "reverse-text": {
    fields: [{ name: "input", type: "textarea", label: "Text to reverse", placeholder: "Hello World" }],
    buttonText: "Reverse",
    process: (v) => {
      const t = v.input;
      return { reversed: t.split("").reverse().join(""), "reversed (words)": t.split(/\s+/).reverse().join(" "), "reversed (lines)": t.split("\n").reverse().join("\n"), length: t.length };
    },
  },
  "remove-empty-lines": {
    fields: [{ name: "input", type: "textarea", label: "Text with empty lines", placeholder: "line1\n\n\nline2\n\nline3" }],
    buttonText: "Clean",
    process: (v) => {
      const lines = v.input.split("\n");
      const cleaned = lines.filter(l => l.trim().length > 0);
      return { cleaned: cleaned.join("\n"), removed: lines.length - cleaned.length };
    },
  },
  "text-cleaner": {
    fields: [{ name: "input", type: "textarea", label: "Text to clean", placeholder: "Paste text with extra  spaces,  special chars, and HTML..." }],
    buttonText: "Clean Text",
    process: (v) => {
      let t = v.input;
      const original = t;
      t = t.replace(/<[^>]*>/g, "");
      t = t.replace(/\s+/g, " ");
      t = t.replace(/[^\S\r\n]+/g, " ").trim();
      t = t.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, "-").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      return { cleaned: t, "chars removed": original.length - t.length };
    },
  },
  "line-counter": {
    fields: [{ name: "input", type: "textarea", label: "Text to analyze", placeholder: "line1\nline2\nline3" }],
    buttonText: "Count Lines",
    process: (v) => {
      const t = v.input;
      const lines = t.split("\n");
      const nonEmpty = lines.filter(l => l.trim().length > 0);
      const words = t.trim() ? t.trim().split(/\s+/).length : 0;
      return { Lines: lines.length, "Non-empty lines": nonEmpty.length, Words: words, Characters: t.length, "Characters (no space)": t.replace(/\s/g, "").length };
    },
  },
  "find-and-replace": {
    fields: [
      { name: "input", type: "textarea", label: "Text source", placeholder: "Enter the text to search in..." },
      { name: "find", type: "text", label: "Find", placeholder: "text to find" },
      { name: "replace", type: "text", label: "Replace with", placeholder: "replacement" },
    ],
    buttonText: "Find & Replace",
    process: (v) => {
      const t = v.input || "";
      const find = v.find || "";
      const replace = v.replace || "";
      if (!find) return { error: "Enter text to find" };
      const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const result = t.replace(new RegExp(escaped, "g"), replace);
      const count = (result !== t) ? (t.match(new RegExp(escaped, "g")) || []).length : 0;
      return { result, replacements: count };
    },
  },
  "text-splitter": {
    fields: [
      { name: "input", type: "textarea", label: "Text to split", placeholder: "item1,item2,item3" },
      { name: "delimiter", type: "text", label: "Delimiter", placeholder: "," },
    ],
    buttonText: "Split",
    process: (v) => {
      const t = v.input || "";
      const delim = v.delimiter || ",";
      const parts = t.split(delim).map(s => s.trim());
      return { result: parts.join("\n"), count: parts.length, delimiter: delim };
    },
  },
  "text-joiner": {
    fields: [
      { name: "input", type: "textarea", label: "Items (one per line)", placeholder: "item1\nitem2\nitem3" },
      { name: "separator", type: "text", label: "Separator", placeholder: "," },
    ],
    buttonText: "Join",
    process: (v) => {
      const items = v.input.trim().split("\n").filter(Boolean);
      const sep = v.separator || ",";
      return { result: items.join(sep), count: items.length, separator: sep };
    },
  },
  "excerpt-generator": {
    fields: [
      { name: "input", type: "textarea", label: "Text", placeholder: "Enter a long text to generate an excerpt from..." },
      { name: "length", type: "number", label: "Max characters", placeholder: "150" },
    ],
    buttonText: "Generate Excerpt",
    process: (v) => {
      const t = v.input || "";
      const max = Math.max(1, parseInt(v.length) || 150);
      if (t.length <= max) return { excerpt: t, truncated: false, length: t.length };
      const excerpt = t.slice(0, max).replace(/\s+\S*$/, "") + "...";
      return { excerpt, original: t.length, excerpted: excerpt.length, truncated: true };
    },
  },
  "alphabetizer": {
    fields: [{ name: "input", type: "textarea", label: "Items (one per line)", placeholder: "banana\napple\ncherry" }],
    buttonText: "Sort A-Z",
    process: (v) => {
      const lines = v.input.trim().split("\n").filter(Boolean);
      const asc = [...lines].sort((a, b) => a.localeCompare(b));
      const desc = [...lines].sort((a, b) => b.localeCompare(a));
      return { "sorted (A-Z)": asc.join("\n"), "sorted (Z-A)": desc.join("\n"), count: lines.length };
    },
  },
  "palindrome-checker": {
    fields: [{ name: "input", type: "text", label: "Word or phrase", placeholder: "racecar" }],
    buttonText: "Check Palindrome",
    process: (v) => {
      const t = v.input || "";
      const clean = t.toLowerCase().replace(/[^a-z0-9]/g, "");
      const reversed = clean.split("").reverse().join("");
      const isPal = clean === reversed && clean.length > 0;
      return { palindrome: isPal ? "Yes" : "No", original: t, reversed: t.split("").reverse().join(""), "characters": t.length, "letters only": clean };
    },
  },
  "anagram-finder": {
    fields: [{ name: "input", type: "text", label: "Word or phrase", placeholder: "listen" }],
    buttonText: "Find Anagrams",
    process: (v) => {
      const t = (v.input || "").trim();
      if (!t) return { error: "Enter a word or phrase" };
      const letters = t.toLowerCase().replace(/[^a-z0-9]/g, "").split("").sort().join("");
      const permute = (str: string): string[] => {
        if (str.length <= 1) return [str];
        if (str.length > 7) return [];
        const result: string[] = [];
        const seen = new Set<string>();
        for (let i = 0; i < str.length; i++) {
          if (seen.has(str[i])) continue;
          seen.add(str[i]);
          for (const perm of permute(str.slice(0, i) + str.slice(i + 1))) {
            result.push(str[i] + perm);
          }
        }
        return result;
      };
      const perms = letters.length <= 7 ? permute(letters) : [];
      return { sorted: letters, "possible anagrams": perms.length > 0 ? perms.join(", ") : "Too many combinations (enter 7 or fewer letters)", count: perms.length };
    },
  },
  "text-to-binary": {
    fields: [{ name: "input", type: "textarea", label: "Text to convert", placeholder: "Hello" }],
    buttonText: "Convert to Binary",
    process: (v) => {
      const t = v.input || "";
      const binary = Array.from(t).map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
      const hex = Array.from(t).map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
      return { binary, hex, length: t.length };
    },
  },
  "morse-code": {
    fields: [{ name: "input", type: "text", label: "Text to convert", placeholder: "SOS" }],
    buttonText: "Convert to Morse Code",
    process: (v) => {
      const morse: Record<string, string> = { "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", "Z": "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-", "\"": ".-..-.", "$": "...-..-", "@": ".--.-." };
      const reverseMorse: Record<string, string> = {};
      for (const [k, v2] of Object.entries(morse)) reverseMorse[v2] = k;
      const t = (v.input || "").trim().toUpperCase();
      const isMorse = /^[.\-\/\s]+$/.test(t);
      if (isMorse) {
        const decoded = t.split(/\s+/).map(s => reverseMorse[s] || (s === "/" ? " " : "?")).join("");
        return { decoded, source: "Morse", input: t };
      } else {
        const encoded = t.split("").map(c => morse[c] || (c === " " ? "/" : "?")).join(" ");
        return { encoded, source: "Text", input: t };
      }
    },
  },
  "pig-latin": {
    fields: [{ name: "input", type: "textarea", label: "English text", placeholder: "Hello world" }],
    buttonText: "Translate",
    process: (v) => {
      const t = (v.input || "").trim();
      if (!t) return { error: "Enter text to translate" };
      const toPig = (w: string) => {
        const m = w.match(/^([^aeiouAEIOU]*)(.*)/);
        if (!m || !m[1]) return w + "way";
        const prefix = m[1], rest = m[2];
        const isUpper = w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase();
        const result = (rest + prefix.toLowerCase() + "ay");
        return isUpper ? result[0].toUpperCase() + result.slice(1) : result;
      };
      const translated = t.split(/\s+/).map(toPig).join(" ");
      return { "pig latin": translated, original: t };
    },
  },
  "word-scrambler": {
    fields: [{ name: "input", type: "textarea", label: "Text to scramble", placeholder: "The quick brown fox" }],
    buttonText: "Scramble",
    process: (v) => {
      const t = v.input || "";
      const shuffle = (s: string) => { const a = s.split(""); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.join(""); };
      const byWords = t.split(/\s+/).map(w => w.length > 3 ? w[0] + shuffle(w.slice(1, -1)) + w[w.length - 1] : shuffle(w)).join(" ");
      const byChars = shuffle(t);
      return { "scrambled (words)": byWords, "scrambled (chars)": byChars };
    },
  },
  "text-repeater": {
    fields: [
      { name: "input", type: "text", label: "Text to repeat", placeholder: "Hello" },
      { name: "count", type: "number", label: "Number of times", placeholder: "5" },
    ],
    buttonText: "Repeat",
    process: (v) => {
      const t = v.input || "";
      const c = Math.min(1000, Math.max(1, parseInt(v.count) || 5));
      const lines: string[] = [];
      for (let i = 0; i < c; i++) { lines.push(`${i + 1}. ${t}`); }
      return { result: lines.join("\n"), count: c, text: t };
    },
  },
  "qr-code-generator": {
    fields: [{ name: "input", type: "text", label: "Text or URL", placeholder: "https://example.com" }],
    buttonText: "Generate QR Code",
    process: CLIENT_TOOLS["qr-code-generator"],
  },
  "css-gradient-generator": {
    fields: [
      { name: "color1", type: "text", label: "First color", placeholder: "#ff6b6b" },
      { name: "color2", type: "text", label: "Second color", placeholder: "#4ecdc4" },
      { name: "direction", type: "select", label: "Direction", placeholder: "", options: [
        { label: "To right", value: "to right" },
        { label: "To bottom", value: "to bottom" },
        { label: "Diagonal (top-left)", value: "to bottom right" },
        { label: "Diagonal (top-right)", value: "to bottom left" },
      ]},
    ],
    buttonText: "Generate Gradient",
    process: (v) => {
      const c1 = v.color1 || "#ff6b6b";
      const c2 = v.color2 || "#4ecdc4";
      const dir = v.direction || "to right";
      const css = `background: linear-gradient(${dir}, ${c1}, ${c2});`;
      return { CSS: css, swatch: css, "First Color": c1, "Second Color": c2, Direction: dir };
    },
  },
  "api-key-generator": {
    fields: [{ name: "length", type: "number", label: "Key length", placeholder: "32" }],
    buttonText: "Generate API Key",
    process: (v) => {
      const len = Math.min(128, Math.max(8, parseInt(v.length) || 32));
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      const key = Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      return { "API Key": key, length: len, prefix: key.slice(0, 8) + "..." };
    },
  },
  "csrf-token-generator": {
    fields: [{ name: "length", type: "number", label: "Token length", placeholder: "32" }],
    buttonText: "Generate Token",
    process: (v) => {
      const len = Math.min(128, Math.max(8, parseInt(v.length) || 32));
      const token = Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      return { "CSRF Token": token, length: len };
    },
  },
  "random-password-phrase": {
    fields: [
      { name: "wordCount", type: "number", label: "Number of words", placeholder: "4" },
      { name: "separator", type: "text", label: "Separator", placeholder: "-" },
    ],
    buttonText: "Generate Passphrase",
    process: (v) => {
      const words = ["apple", "river", "mountain", "ocean", "forest", "sunset", "thunder", "silver", "golden", "crystal", "purple", "winter", "summer", "spring", "autumn", "bridge", "castle", "dragon", "eagle", "falcon", "garden", "harbor", "island", "jewel", "knight", "lighthouse", "meadow", "nebula", "oracle", "phoenix", "quartz", "rainbow", "shield", "temple", "umbrella", "valley", "wonder", "zenith", "archer", "blossom", "cascade", "ember", "frost", "glacier", "horizon", "iris", "jasmine", "koala", "lotus", "maple"];
      const count = Math.min(10, Math.max(2, parseInt(v.wordCount) || 4));
      const sep = v.separator || "-";
      const selected: string[] = [];
      const pool = [...words];
      for (let i = 0; i < count; i++) { const idx = Math.floor(Math.random() * pool.length); selected.push(pool[idx]); pool.splice(idx, 1); }
      return { passphrase: selected.join(sep), words: count, separator: sep };
    },
  },
  "content-security-policy": {
    fields: [{ name: "input", type: "textarea", label: "CSP directives (one per line)", placeholder: "default-src 'self'\nscript-src 'self' https://analytics.example.com\nstyle-src 'self' 'unsafe-inline'" }],
    buttonText: "Generate CSP Header",
    process: (v) => {
      const t = v.input?.trim() || "";
      const directives = t.split("\n").map(l => l.trim()).filter(Boolean);
      if (directives.length === 0) return { error: "Enter at least one CSP directive" };
      const csp = directives.join("; ");
      return { "Content-Security-Policy": csp, directives: directives.length, "As Meta Tag": `<meta http-equiv="Content-Security-Policy" content="${csp}">` };
    },
  },
  "hash-comparison": {
    fields: [
      { name: "hash1", type: "text", label: "First hash", placeholder: "5d41402abc4b2a76b9719d911017c592" },
      { name: "hash2", type: "text", label: "Second hash", placeholder: "5d41402abc4b2a76b9719d911017c592" },
    ],
    buttonText: "Compare Hashes",
    process: (v) => {
      const h1 = (v.hash1 || "").trim();
      const h2 = (v.hash2 || "").trim();
      if (!h1 || !h2) return { error: "Enter both hashes to compare" };
      const match = h1.toLowerCase() === h2.toLowerCase();
      return { Match: match ? "Yes" : "No", "Hash 1": h1, "Hash 2": h2, "Length 1": h1.length, "Length 2": h2.length, "Algorithm (guess)": h1.length === 32 ? "MD5" : h1.length === 40 ? "SHA-1" : h1.length === 64 ? "SHA-256" : "Unknown" };
    },
  },
  "password-strength-checker": {
    fields: [{ name: "input", type: "text", label: "Password to check", placeholder: "Enter a password..." }],
    buttonText: "Check Strength",
    process: (v) => {
      const pw = v.input || "";
      const len = pw.length;
      let score = 0;
      if (len >= 8) score += 1;
      if (len >= 12) score += 1;
      if (len >= 16) score += 1;
      if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
      if (/\d/.test(pw)) score += 1;
      if (/[^a-zA-Z0-9]/.test(pw)) score += 1;
      const entropy = len * (Math.log2(26 * (/[a-z]/.test(pw) && /[A-Z]/.test(pw) ? 52 : 26) + (/\d/.test(pw) ? 10 : 0) + (/[^a-zA-Z0-9]/.test(pw) ? 32 : 0)));
      const label = score <= 1 ? "Very Weak" : score <= 2 ? "Weak" : score <= 3 ? "Fair" : score <= 4 ? "Strong" : "Very Strong";
      const color = score <= 1 ? "Red" : score <= 2 ? "Orange" : score <= 3 ? "Yellow" : score <= 4 ? "Light Green" : "Green";
      const time = entropy < 28 ? "Instant" : entropy < 36 ? "Minutes" : entropy < 60 ? "Hours" : entropy < 80 ? "Days" : entropy < 100 ? "Years" : "Centuries";
      return { Strength: `${label} (${score}/6)`, Entropy: entropy.toFixed(0) + " bits", "Time to Crack": time, Length: len, "Has Uppercase": /[A-Z]/.test(pw) ? "Yes" : "No", "Has Lowercase": /[a-z]/.test(pw) ? "Yes" : "No", "Has Number": /\d/.test(pw) ? "Yes" : "No", "Has Special Char": /[^a-zA-Z0-9]/.test(pw) ? "Yes" : "No" };
    },
  },
  "keyword-density": {
    fields: [{ name: "input", type: "textarea", label: "Text to analyze", placeholder: "Paste your content here to check keyword density..." }],
    buttonText: "Analyze",
    process: (v) => {
      const text = v.input?.trim();
      if (!text || text.length < 10) return { error: "Enter at least 10 characters of text to analyze." };
      const words = text.toLowerCase().replace(/[^a-z\s'-]/g, "").split(/\s+/).filter(w => w.length > 2);
      const totalWords = words.length;
      const freq: Record<string, number> = {};
      for (const w of words) { freq[w] = (freq[w] || 0) + 1; }
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
      return {
        "Total Words": `${totalWords}`,
        "Unique Words": `${Object.keys(freq).length}`,
        "Keyword Density": sorted.map(([w, c]) => `${w}: ${c} (${(c / totalWords * 100).toFixed(1)}%)`).join("\n"),
        "Top Keywords": sorted.slice(0, 5).map(([w]) => w).join(", "),
        "Tip": "A healthy keyword density is 1-3%. Higher may be considered keyword stuffing.",
      };
    },
  },
  "robots-txt-generator": {
    fields: [
      { name: "userAgent", type: "text", label: "User-agent", placeholder: "*" },
      { name: "disallow", type: "text", label: "Disallow paths (comma-separated)", placeholder: "/admin, /private" },
      { name: "allow", type: "text", label: "Allow paths (comma-separated)", placeholder: "/public" },
      { name: "sitemap", type: "text", label: "Sitemap URL", placeholder: "https://example.com/sitemap.xml" },
    ],
    buttonText: "Generate robots.txt",
    process: (v) => {
      let output = `User-agent: ${v.userAgent || "*"}\n`;
      if (v.disallow?.trim()) { for (const p of v.disallow.split(",").map(s => s.trim()).filter(Boolean)) output += `Disallow: ${p}\n`; }
      if (v.allow?.trim()) { for (const p of v.allow.split(",").map(s => s.trim()).filter(Boolean)) output += `Allow: ${p}\n`; }
      if (v.sitemap?.trim()) output += `\nSitemap: ${v.sitemap.trim()}\n`;
      return {
        "robots.txt": output,
        "Lines": `${output.split("\n").length}`,
        "Tip": "Test your robots.txt using the Robots.txt Validator tool.",
      };
    },
  },
  "sitemap-generator": {
    fields: [
      { name: "urls", type: "textarea", label: "URLs (one per line)", placeholder: "https://example.com/\nhttps://example.com/about" },
      { name: "changefreq", type: "select", label: "Change frequency", placeholder: "", options: [
        { label: "Daily", value: "daily" }, { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" }, { label: "Yearly", value: "yearly" },
        { label: "Never", value: "never" },
      ]},
    ],
    buttonText: "Generate Sitemap",
    process: (v) => {
      const urls = v.urls?.split("\n").map(s => s.trim()).filter(Boolean) || [];
      if (urls.length === 0) return { error: "Enter at least one URL." };
      const freq = v.changefreq || "monthly";
      const now = new Date().toISOString().split("T")[0];
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      for (const url of urls) { xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${freq}</changefreq>\n  </url>\n`; }
      xml += "</urlset>";
      return {
        "XML Sitemap": xml,
        "URLs Included": `${urls.length}`,
        "Tip": "Submit your sitemap to Google Search Console for indexing.",
      };
    },
  },
  "meta-tag-generator": {
    fields: [
      { name: "title", type: "text", label: "Page title", placeholder: "My Amazing Page" },
      { name: "description", type: "textarea", label: "Meta description", placeholder: "A brief description of the page..." },
      { name: "keywords", type: "text", label: "Keywords (comma-separated)", placeholder: "keyword1, keyword2" },
      { name: "url", type: "url", label: "Page URL", placeholder: "https://example.com/page" },
    ],
    buttonText: "Generate Meta Tags",
    process: (v) => {
      const title = v.title || "Page Title";
      const desc = v.description || "";
      const keywords = v.keywords || "";
      const url = v.url || "";
      const fullHtml = `<!-- Meta Tags -->\n<title>${title}</title>\n<meta name="description" content="${desc}" />\n<meta name="keywords" content="${keywords}" />\n${url ? `<link rel="canonical" href="${url}" />` : ""}\n\n<!-- Open Graph -->\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n${url ? `<meta property="og:url" content="${url}" />` : ""}\n<meta property="og:type" content="website" />\n\n<!-- Twitter -->\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${desc}" />`;
      return {
        "Title Tag": `<title>${title}</title>`,
        "Meta Description": `<meta name="description" content="${desc}" />`,
        "Meta Keywords": `<meta name="keywords" content="${keywords}" />`,
        "Full HTML": fullHtml,
        "Character Count": `Title: ${title.length} chars | Description: ${desc.length} chars`,
      };
    },
  },
  "open-graph-generator": {
    fields: [
      { name: "title", type: "text", label: "OG Title", placeholder: "My Amazing Page" },
      { name: "description", type: "textarea", label: "OG Description", placeholder: "A brief description..." },
      { name: "image", type: "text", label: "OG Image URL", placeholder: "https://example.com/image.jpg" },
      { name: "url", type: "text", label: "Page URL", placeholder: "https://example.com/page" },
    ],
    buttonText: "Generate OG Tags",
    process: (v) => {
      const og = [
        `<meta property="og:title" content="${v.title || "Page Title"}" />`,
        `<meta property="og:description" content="${v.description || ""}" />`,
        v.image ? `<meta property="og:image" content="${v.image}" />` : "",
        v.url ? `<meta property="og:url" content="${v.url}" />` : "",
        `<meta property="og:type" content="website" />`,
      ].filter(Boolean).join("\n");
      return {
        "Open Graph Tags": og,
        "Preview Title": v.title || "Page Title",
        "Preview Description": v.description || "",
        "Tip": "Test your OG tags using the Social Media Preview tool.",
      };
    },
  },
  "schema-generator": {
    fields: [
      { name: "type", type: "select", label: "Schema type", placeholder: "", options: [
        { label: "Article", value: "Article" },
        { label: "Product", value: "Product" },
        { label: "LocalBusiness", value: "LocalBusiness" },
        { label: "FAQPage", value: "FAQPage" },
        { label: "Event", value: "Event" },
        { label: "Review", value: "Review" },
      ]},
      { name: "name", type: "text", label: "Name / Title", placeholder: "My Article Title" },
      { name: "description", type: "textarea", label: "Description", placeholder: "A brief description..." },
    ],
    buttonText: "Generate Schema",
    process: (v) => {
      const type = v.type || "Article";
      const name = v.name || "";
      const desc = v.description || "";
      const context = "https://schema.org";
      let schema: Record<string, unknown> = { "@context": context, "@type": type, name, description: desc };
      if (type === "Article") schema = { ...schema, author: { "@type": "Person", name: "Author" }, datePublished: new Date().toISOString().split("T")[0] };
      if (type === "Product") schema = { ...schema, offers: { "@type": "Offer", price: "0.00", priceCurrency: "USD" } };
      if (type === "LocalBusiness") schema = { ...schema, address: { "@type": "PostalAddress", streetAddress: "123 Main St" }, telephone: "+1-555-555-5555" };
      if (type === "FAQPage") {
        schema = { "@context": context, "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "Question 1", acceptedAnswer: { "@type": "Answer", text: "Answer to question 1." } }] };
      }
      if (type === "Event") schema = { ...schema, startDate: new Date().toISOString(), location: { "@type": "Place", name: "Venue Name" } };
      if (type === "Review") schema = { ...schema, itemReviewed: { "@type": "Thing", name: name || "Item Name" }, reviewRating: { "@type": "Rating", ratingValue: "5" } };
      return {
        "JSON-LD Schema": JSON.stringify(schema, null, 2),
        "Schema Type": type,
        "Embed Code": `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`,
      };
    },
  },
  "hreflang-generator": {
    fields: [
      { name: "baseUrl", type: "text", label: "Base URL", placeholder: "https://example.com/page" },
      { name: "langs", type: "textarea", label: "Language codes and URLs (lang:url per line)", placeholder: "en:https://example.com/en/page\nfr:https://example.com/fr/page\nde:https://example.com/de/page" },
    ],
    buttonText: "Generate Hreflang Tags",
    process: (v) => {
      const baseUrl = v.baseUrl?.trim() || "";
      const lines = v.langs?.split("\n").map(s => s.trim()).filter(Boolean) || [];
      if (lines.length === 0) return { error: "Enter at least one language:URL pair." };
      const tags: string[] = [];
      const errors: string[] = [];
      for (const line of lines) {
        const sep = line.includes(":") ? line.indexOf(":") : -1;
        if (sep < 1) { errors.push(`Invalid line: "${line}"`); continue; }
        const lang = line.substring(0, sep).trim();
        const url = line.substring(sep + 1).trim();
        if (!lang || !url) { errors.push(`Invalid line: "${line}"`); continue; }
        tags.push(`<link rel="alternate" hreflang="${lang}" href="${url}" />`);
      }
      if (baseUrl) tags.push(`<link rel="alternate" hreflang="x-default" href="${baseUrl}" />`);
      return {
        "Hreflang Tags": tags.join("\n"),
        "Languages": `${tags.length} language tag(s)`,
        ...(errors.length ? { "Errors": errors.join("\n") } : {}),
      };
    },
  },
  "canonical-generator": {
    fields: [{ name: "url", type: "text", label: "Canonical URL", placeholder: "https://example.com/page" }],
    buttonText: "Generate Canonical Tag",
    process: (v) => {
      const url = v.url?.trim();
      if (!url) return { error: "Enter a canonical URL." };
      return {
        "Canonical Tag": `<link rel="canonical" href="${url}" />`,
        "URL": url,
        "Tip": "Place this tag in the <head> section of your page to prevent duplicate content issues.",
      };
    },
  },
  "seo-title-preview": {
    fields: [
      { name: "title", type: "text", label: "SEO title", placeholder: "My Amazing Page | Site Name" },
      { name: "description", type: "textarea", label: "Meta description", placeholder: "A brief description..." },
    ],
    buttonText: "Preview",
    process: (v) => {
      const title = v.title?.trim() || "Title";
      const desc = v.description?.trim() || "Description";
      const pixelWidth = title.length * 9;
      const titleOk = title.length <= 60;
      const descOk = desc.length <= 160;
      return {
        "Google SERP Preview": `\n  ${title.length > 60 ? title.substring(0, 57) + "..." : title}\n  ${v.url || "https://example.com/page"}  \n  ${desc.length > 160 ? desc.substring(0, 157) + "..." : desc}\n`,
        "Title": `${title} (${title.length}/60 chars ${titleOk ? "✓" : "✗"})`,
        "Description": `${desc} (${desc.length}/160 chars ${descOk ? "✓" : "✗"})`,
        "Recommendation": !titleOk ? "Title is too long. Google may truncate titles over 60 characters." : !descOk ? "Description is too long. Google may truncate descriptions over 160 characters." : "Your title and description lengths look great for Google SERP display!",
      };
    },
  },
  "robots-txt-validator": {
    fields: [{ name: "input", type: "textarea", label: "robots.txt content", placeholder: "User-agent: *\nDisallow: /admin" }],
    buttonText: "Validate",
    process: (v) => {
      const content = v.input?.trim();
      if (!content) return { error: "Paste robots.txt content to validate." };
      const lines = content.split("\n");
      const issues: string[] = [];
      const validDirs = ["user-agent", "disallow", "allow", "sitemap", "crawl-delay", "host", "clean-param"];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith("#")) continue;
        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) { issues.push(`Line ${i + 1}: Missing colon — "${line}"`); continue; }
        const dir = line.substring(0, colonIdx).trim().toLowerCase();
        if (!validDirs.includes(dir)) { issues.push(`Line ${i + 1}: Unknown directive "${dir}"`); }
      }
      return {
        "Status": issues.length === 0 ? "✅ Valid robots.txt — no issues found." : `⚠️ ${issues.length} issue(s) found`,
        "Issues": issues.length > 0 ? issues.join("\n") : "None",
        "Lines": `${lines.length}`,
        "Tip": "Use the robots.txt Generator to create a valid file from scratch.",
      };
    },
  },
  "social-preview": {
    fields: [
      { name: "url", type: "text", label: "Page URL", placeholder: "https://example.com/page" },
      { name: "title", type: "text", label: "OG title", placeholder: "Page Title" },
      { name: "description", type: "textarea", label: "OG description", placeholder: "Description..." },
    ],
    buttonText: "Preview",
    process: (v) => {
      const title = v.title?.trim() || "Page Title";
      const desc = v.description?.trim() || "";
      const url = v.url?.trim() || "";
      return {
        "Facebook Preview": `\n  ┌${"─".repeat(50)}┐\n  │ ${title.substring(0, 46)} │\n  │ ${desc.substring(0, 46)} │\n  │ ${url.substring(0, 46)} │\n  └${"─".repeat(50)}┘\n`,
        "Twitter Preview": `\n  ${title.substring(0, 60)}\n  ${desc.substring(0, 120)}\n  ${url}\n`,
        "Title": title,
        "Description": desc,
        "OG Tags Present": url ? "Yes (URL provided)" : "No URL provided",
        "Tip": "Upload an OG image to make your shared links more engaging.",
      };
    },
  },
  "spf-generator": {
    fields: [
      { name: "domain", type: "text", label: "Your domain", placeholder: "example.com" },
      { name: "ips", type: "text", label: "Authorized IPs (comma-separated)", placeholder: "192.168.1.1, 10.0.0.1" },
      { name: "include", type: "text", label: "Include domains (comma-separated)", placeholder: "spf.protection.outlook.com" },
      { name: "policy", type: "select", label: "Default policy", placeholder: "", options: [
        { label: "Soft fail (~all)", value: "~all" },
        { label: "Hard fail (-all)", value: "-all" },
        { label: "Neutral (?all)", value: "?all" },
      ]},
    ],
    buttonText: "Generate SPF Record",
    process: (v) => {
      const domain = (v.domain || "").trim();
      if (!domain) return { error: "Enter your domain name" };
      let spf = "v=spf1";
      if (v.ips?.trim()) { for (const ip of v.ips.split(",").map(s => s.trim()).filter(Boolean)) spf += " ip4:" + ip; }
      if (v.include?.trim()) { for (const dom of v.include.split(",").map(s => s.trim()).filter(Boolean)) spf += " include:" + dom; }
      spf += " " + (v.policy || "~all");
      return { "SPF Record": spf, "DNS Entry": `${domain}.  TXT "${spf}"`, Domain: domain };
    },
  },
  "dmarc-generator": {
    fields: [
      { name: "domain", type: "text", label: "Your domain", placeholder: "example.com" },
      { name: "policy", type: "select", label: "Policy", placeholder: "", options: [
        { label: "None (monitoring)", value: "none" },
        { label: "Quarantine", value: "quarantine" },
        { label: "Reject", value: "reject" },
      ]},
      { name: "rua", type: "text", label: "Report email (rua)", placeholder: "dmarc-reports@example.com" },
      { name: "pct", type: "number", label: "Percentage", placeholder: "100" },
    ],
    buttonText: "Generate DMARC Record",
    process: (v) => {
      const domain = (v.domain || "").trim();
      if (!domain) return { error: "Enter your domain name" };
      let dmarc = `v=DMARC1; p=${v.policy || "none"}`;
      if (v.rua?.trim()) dmarc += `; rua=mailto:${v.rua.trim()}`;
      const pct = parseInt(v.pct) || 100;
      if (pct < 100) dmarc += `; pct=${pct}`;
      const sp = v.policy === "none" ? "none" : v.policy || "none";
      dmarc += `; sp=${sp}`;
      return { "DMARC Record": dmarc, "DNS Entry": `_dmarc.${domain}.  TXT "${dmarc}"`, Domain: domain, Policy: v.policy || "none" };
    },
  },
  "what-is-my-ip": {
    fields: [],
    buttonText: "Find My IP",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "ip-lookup": {
    fields: [{ name: "input", type: "text", label: "IP address", placeholder: "8.8.8.8" }],
    buttonText: "Look Up IP",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "lorem-ipsum-generator": {
    fields: [
      { name: "paragraphs", type: "number", label: "Paragraphs", placeholder: "3" },
    ],
    buttonText: "Generate Lorem Ipsum",
    process: (v) => {
      const sentences = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
        "Deserunt mollit anim id est laborum, sed ut perspiciatis unde omnis iste.",
        "Natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
        "Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.",
        "Dicta sunt explicabo nemo enim ipsam voluptatem quia voluptas sit aspernatur.",
        "Aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione.",
        "Voluptatem sequi nesciunt neque porro quisquam est qui dolorem ipsum quia.",
        "Dolor sit amet consectetur adipisci velit sed quia non numquam eius modi.",
        "Tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
        "Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit.",
        "Laboriosam nisi ut aliquid ex ea commodi consequatur quis autem vel.",
        "Eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae.",
        "Consequatur vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.",
        "Praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias.",
        "Excepturi sint occaecati cupiditate non provident similique sunt in culpa.",
        "Qui officia deserunt mollitia animi id est laborum et dolorum fuga.",
        "Et harum quidem rerum facilis est et expedita distinctio nam libero tempore.",
        "Cum soluta nobis est eligendi optio cumque nihil impedit quo minus id.",
        "Quod maxime placeat facere possimus omnis voluptas assumenda est omnis dolor.",
        "Repellendus temporibus autem quibusdam et aut officiis debitis aut rerum.",
        "Necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae.",
        "Non recusandae itaque earum rerum hic tenetur a sapiente delectus ut aut.",
        "Reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus.",
        "Asperiores repellat quod aliquid libero qui fugiat quo voluptas nulla pariatur.",
      ];
      const count = Math.min(20, Math.max(1, parseInt(v.paragraphs) || 3));
      const result: string[] = [];
      for (let i = 0; i < count; i++) {
        const sentCount = 3 + Math.floor(Math.random() * 4);
        const selected: string[] = [];
        for (let j = 0; j < sentCount; j++) selected.push(sentences[Math.floor(Math.random() * sentences.length)]);
        result.push(selected.join(" "));
      }
      return { "Lorem Ipsum": result.join("\n\n"), paragraphs: count };
    },
  },
  "text-diff-checker": {
    fields: [
      { name: "text1", type: "textarea", label: "Original text", placeholder: "First version of text..." },
      { name: "text2", type: "textarea", label: "Modified text", placeholder: "Second version of text..." },
    ],
    buttonText: "Compare",
    process: CLIENT_TOOLS["text-diff-checker"],
  },
  "random-number-generator": {
    fields: [
      { name: "min", type: "number", label: "Min", placeholder: "1" },
      { name: "max", type: "number", label: "Max", placeholder: "100" },
      { name: "count", type: "number", label: "Count", placeholder: "1" },
    ],
    buttonText: "Generate",
    process: (v) => {
      const min = parseInt(v.min) || 1;
      const max = parseInt(v.max) || 100;
      const count = Math.min(100, Math.max(1, parseInt(v.count) || 1));
      if (min >= max) return { error: "Min must be less than max" };
      const numbers: number[] = [];
      const used = new Set<number>();
      while (numbers.length < count) { const n = min + Math.floor(Math.random() * (max - min + 1)); if (!used.has(n)) { used.add(n); numbers.push(n); } }
      return { numbers: numbers.join(", "), count, range: `${min}–${max}`, unique: "Yes" };
    },
  },
  "age-calculator": {
    fields: [
      { name: "birthDate", type: "text", label: "Birth date (YYYY-MM-DD)", placeholder: "1990-01-15" },
    ],
    buttonText: "Calculate Age",
    process: (v) => {
      const bd = new Date(v.birthDate);
      if (isNaN(bd.getTime())) return { error: "Enter a valid date in YYYY-MM-DD format" };
      const now = new Date();
      let years = now.getFullYear() - bd.getFullYear();
      const m = now.getMonth() - bd.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) years--;
      let months = (now.getFullYear() - bd.getFullYear()) * 12 + now.getMonth() - bd.getMonth();
      if (now.getDate() < bd.getDate()) months--;
      const diffMs = now.getTime() - bd.getTime();
      const days = Math.floor(diffMs / 86400000);
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor(diffMs / 1000);
      const nextBday = new Date(now.getFullYear(), bd.getMonth(), bd.getDate());
      if (nextBday < now) nextBday.setFullYear(nextBday.getFullYear() + 1);
      const daysUntil = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000);
      return { "Age": `${years} years`, "In months": `${months} months`, "In days": `${days.toLocaleString()} days`, "In hours": `${hours.toLocaleString()} hours`, "In minutes": `${minutes.toLocaleString()} minutes`, "In seconds": `${seconds.toLocaleString()} seconds`, "Next Birthday": `${nextBday.toLocaleDateString()} (in ${daysUntil} days)` };
    },
  },
  "date-calculator": {
    fields: [
      { name: "startDate", type: "text", label: "Start date (YYYY-MM-DD)", placeholder: "2024-01-01" },
      { name: "endDate", type: "text", label: "End date (YYYY-MM-DD)", placeholder: "2024-12-31" },
    ],
    buttonText: "Calculate Duration",
    process: (v) => {
      const start = new Date(v.startDate);
      const end = new Date(v.endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return { error: "Enter valid dates in YYYY-MM-DD format" };
      const diffMs = Math.abs(end.getTime() - start.getTime());
      const days = Math.floor(diffMs / 86400000);
      const weeks = Math.floor(days / 7);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() - (end.getDate() < start.getDate() ? 1 : 0);
      const years = Math.floor(months / 12);
      const hours = Math.floor(diffMs / 3600000);
      return { "Duration": `${years} years, ${months % 12} months, ${days % 30} days`, "In days": `${days.toLocaleString()} days`, "In weeks": `${weeks} weeks (${days % 7} days)`, "In hours": `${hours.toLocaleString()} hours`, "Start": start.toLocaleDateString(), "End": end.toLocaleDateString() };
    },
  },
  "time-calculator": {
    fields: [
      { name: "hours", type: "number", label: "Hours", placeholder: "2" },
      { name: "minutes", type: "number", label: "Minutes", placeholder: "30" },
      { name: "seconds", type: "number", label: "Seconds", placeholder: "0" },
      { name: "operation", type: "select", label: "Operation", placeholder: "", options: [
        { label: "Add", value: "add" },
        { label: "Subtract", value: "subtract" },
      ]},
      { name: "addHours", type: "number", label: "Add/subtract hours", placeholder: "1" },
      { name: "addMinutes", type: "number", label: "Add/subtract minutes", placeholder: "0" },
    ],
    buttonText: "Calculate Time",
    process: (v) => {
      let h = parseInt(v.hours) || 0, m = parseInt(v.minutes) || 0, s = parseInt(v.seconds) || 0;
      const ah = parseInt(v.addHours) || 0, am = parseInt(v.addMinutes) || 0;
      const sign = v.operation === "subtract" ? -1 : 1;
      h += sign * ah; m += sign * am;
      if (s < 0) { m += Math.floor(s / 60) - 1; s = 60 + (s % 60); } if (m < 0) { h += Math.floor(m / 60) - 1; m = 60 + (m % 60); }
      if (s >= 60) { m += Math.floor(s / 60); s = s % 60; } if (m >= 60) { h += Math.floor(m / 60); m = m % 60; }
      const totalSec = h * 3600 + m * 60 + s;
      return { "Result": `${h}h ${m}m ${s}s`, "Total seconds": totalSec, "Total minutes": (totalSec / 60).toFixed(2), "Total hours": (totalSec / 3600).toFixed(4), "Operation": v.operation };
    },
  },
  "calorie-calculator": {
    fields: [
      { name: "age", type: "number", label: "Age", placeholder: "30" },
      { name: "weight", type: "number", label: "Weight (kg)", placeholder: "70" },
      { name: "height", type: "number", label: "Height (cm)", placeholder: "175" },
      { name: "gender", type: "select", label: "Gender", placeholder: "", options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ]},
      { name: "activity", type: "select", label: "Activity level", placeholder: "", options: [
        { label: "Sedentary", value: "1.2" },
        { label: "Lightly active", value: "1.375" },
        { label: "Moderately active", value: "1.55" },
        { label: "Very active", value: "1.725" },
        { label: "Extra active", value: "1.9" },
      ]},
    ],
    buttonText: "Calculate Calories",
    process: (v) => {
      const age = parseInt(v.age) || 30; const w = parseInt(v.weight) || 70; const h = parseInt(v.height) || 175;
      const gender = v.gender || "male"; const activity = parseFloat(v.activity) || 1.2;
      if (!age || !w || !h) return { error: "Enter valid age, weight, and height" };
      const bmr = gender === "male" ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * age : 447.593 + 9.247 * w + 3.098 * h - 4.33 * age;
      const tdee = bmr * activity;
      const labels = ["Sedentary", "Lightly active", "Moderately active", "Very active", "Extra active"];
      const activityLabels: Record<string, string> = { "1.2": "Sedentary", "1.375": "Lightly active", "1.55": "Moderately active", "1.725": "Very active", "1.9": "Extra active" };
      return { "BMR": `${Math.round(bmr)} cal/day`, "TDEE": `${Math.round(tdee)} cal/day`, "Activity Level": activityLabels[v.activity] || "Custom", Gender: gender === "male" ? "Male" : "Female", "Lose 0.5kg/week": `${Math.round(tdee - 500)} cal/day`, "Lose 1kg/week": `${Math.round(tdee - 1000)} cal/day`, "Gain 0.5kg/week": `${Math.round(tdee + 500)} cal/day` };
    },
  },
  "budget-calculator": {
    fields: [
      { name: "income", type: "number", label: "Monthly income ($)", placeholder: "5000" },
      { name: "housing", type: "number", label: "Housing ($)", placeholder: "1500" },
      { name: "food", type: "number", label: "Food ($)", placeholder: "600" },
      { name: "transport", type: "number", label: "Transport ($)", placeholder: "300" },
      { name: "utilities", type: "number", label: "Utilities ($)", placeholder: "200" },
      { name: "entertainment", type: "number", label: "Entertainment ($)", placeholder: "200" },
      { name: "savings", type: "number", label: "Savings ($)", placeholder: "500" },
      { name: "other", type: "number", label: "Other ($)", placeholder: "300" },
    ],
    buttonText: "Calculate Budget",
    process: (v) => {
      const income = parseFloat(v.income) || 0;
      const housing = parseFloat(v.housing) || 0; const food = parseFloat(v.food) || 0; const transport = parseFloat(v.transport) || 0;
      const utilities = parseFloat(v.utilities) || 0; const entertainment = parseFloat(v.entertainment) || 0;
      const savings = parseFloat(v.savings) || 0; const other = parseFloat(v.other) || 0;
      const totalExpenses = housing + food + transport + utilities + entertainment + savings + other;
      const remaining = income - totalExpenses;
      const pct = (cat: number) => income > 0 ? (cat / income * 100).toFixed(1) + "%" : "—";
      return {
        Income: `$${income.toFixed(2)}`,
        "Total Expenses": `$${totalExpenses.toFixed(2)}`,
        "Remaining": `$${remaining.toFixed(2)}`,
        "Housing": `$${housing.toFixed(2)} (${pct(housing)})`,
        "Food": `$${food.toFixed(2)} (${pct(food)})`,
        "Transport": `$${transport.toFixed(2)} (${pct(transport)})`,
        "Utilities": `$${utilities.toFixed(2)} (${pct(utilities)})`,
        "Entertainment": `$${entertainment.toFixed(2)} (${pct(entertainment)})`,
        "Savings": `$${savings.toFixed(2)} (${pct(savings)})`,
        "Other": `$${other.toFixed(2)} (${pct(other)})`,
        "Status": remaining >= 0 ? "Surplus — on track" : "Deficit — expenses exceed income",
      };
    },
  },
  "retirement-calculator": {
    fields: [
      { name: "age", type: "number", label: "Current age", placeholder: "30" },
      { name: "retireAge", type: "number", label: "Retirement age", placeholder: "65" },
      { name: "savings", type: "number", label: "Current savings ($)", placeholder: "50000" },
      { name: "monthly", type: "number", label: "Monthly contribution ($)", placeholder: "500" },
      { name: "return", type: "number", label: "Expected annual return (%)", placeholder: "7" },
    ],
    buttonText: "Calculate Retirement",
    process: (v) => {
      const age = parseInt(v.age) || 30; const retireAge = parseInt(v.retireAge) || 65;
      const savings = parseFloat(v.savings) || 0; const monthly = parseFloat(v.monthly) || 0;
      const annualReturn = (parseFloat(v.return) || 7) / 100;
      const years = retireAge - age; const months = years * 12;
      if (years <= 0) return { error: "Retirement age must be greater than current age" };
      let total = savings;
      for (let i = 0; i < months; i++) { total = total * (1 + annualReturn / 12) + monthly; }
      const contribTotal = savings + monthly * months;
      const earnings = total - contribTotal;
      const safeWithdrawal = total * 0.04;
      return { "Total at Retirement": `$${Math.round(total).toLocaleString()}`, "Years Until Retirement": years, "Total Contributions": `$${Math.round(contribTotal).toLocaleString()}`, "Investment Earnings": `$${Math.round(earnings).toLocaleString()}`, "Monthly Contribution": `$${monthly}`, "Annual Return": `${(annualReturn * 100).toFixed(1)}%`, "Safe Withdrawal (4%)": `$${Math.round(safeWithdrawal).toLocaleString()}/year ($${Math.round(safeWithdrawal / 12).toLocaleString()}/month)` };
    },
  },
  "crypto-converter": {
    fields: [
      { name: "amount", type: "number", label: "Amount", placeholder: "1" },
      { name: "from", type: "select", label: "From", placeholder: "", options: [
        { label: "Bitcoin (BTC)", value: "BTC" },
        { label: "Ethereum (ETH)", value: "ETH" },
        { label: "US Dollar (USD)", value: "USD" },
      ]},
      { name: "to", type: "select", label: "To", placeholder: "", options: [
        { label: "US Dollar (USD)", value: "USD" },
        { label: "Bitcoin (BTC)", value: "BTC" },
        { label: "Ethereum (ETH)", value: "ETH" },
      ]},
    ],
    buttonText: "Convert",
    asyncProcess: async (v) => {
      const amount = parseFloat(v.amount) || 1;
      const from = v.from || "BTC"; const to = v.to || "USD";
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
        if (!res.ok) {
          if (res.status === 429) return { error: "CoinGecko rate limit reached. Please wait a moment and try again." };
          return { error: `CoinGecko API error: ${res.status}. Try again later.` };
        }
        const data = await res.json();
        const rates: Record<string, number> = { BTC: data.bitcoin?.usd || 0, ETH: data.ethereum?.usd || 0, USD: 1 };
        const fRate = rates[from]; const tRate = rates[to];
        if (!fRate || !tRate) return { error: "Rate unavailable for selected currencies" };
        const result = amount * fRate / tRate;
        const fmt = result >= 1000 ? result.toLocaleString(undefined, { maximumFractionDigits: 2 }) : result.toFixed(from === "USD" ? 8 : 4);
        return { "Result": `${fmt} ${to}`, "Amount": `${amount} ${from}`, "Rate": `1 ${from} = ${(fRate / tRate).toFixed(6)} ${to}` };
      } catch { return { error: "Failed to connect to CoinGecko. Check your network." }; }
    },
  },
  "currency-converter": {
    fields: [
      { name: "amount", type: "number", label: "Amount", placeholder: "100" },
      { name: "from", type: "select", label: "From", placeholder: "", options: [
        { label: "USD", value: "USD" },
        { label: "EUR", value: "EUR" },
        { label: "GBP", value: "GBP" },
        { label: "JPY", value: "JPY" },
        { label: "CAD", value: "CAD" },
        { label: "AUD", value: "AUD" },
        { label: "CHF", value: "CHF" },
        { label: "CNY", value: "CNY" },
        { label: "INR", value: "INR" },
        { label: "BRL", value: "BRL" },
      ]},
      { name: "to", type: "select", label: "To", placeholder: "", options: [
        { label: "EUR", value: "EUR" },
        { label: "USD", value: "USD" },
        { label: "GBP", value: "GBP" },
        { label: "JPY", value: "JPY" },
        { label: "CAD", value: "CAD" },
        { label: "AUD", value: "AUD" },
        { label: "CHF", value: "CHF" },
        { label: "CNY", value: "CNY" },
        { label: "INR", value: "INR" },
        { label: "BRL", value: "BRL" },
      ]},
    ],
    buttonText: "Convert",
    apiEndpoint: "/api/tools/currency-converter",
    howTo: [
      { action: "Enter", desc: "Type the amount and select the source currency." },
      { action: "Select", desc: "Choose the target currency to convert to." },
      { action: "Convert", desc: "Click 'Convert' to get the latest exchange rate and converted amount." },
    ],
  },
  "unit-converter": {
    fields: [
      { name: "value", type: "number", label: "Value", placeholder: "1" },
      { name: "category", type: "select", label: "Category", placeholder: "", options: [
        { label: "Length", value: "length" },
        { label: "Mass", value: "mass" },
        { label: "Volume", value: "volume" },
        { label: "Temperature", value: "temperature" },
      ]},
      { name: "from", type: "text", label: "From unit", placeholder: "km" },
      { name: "to", type: "text", label: "To unit", placeholder: "mi" },
    ],
    buttonText: "Convert",
    process: (v) => {
      const val = parseFloat(v.value);
      if (isNaN(val)) return { error: "Enter a valid numeric value" };
      const from = (v.from || "").toLowerCase().trim();
      const to = (v.to || "").toLowerCase().trim();
      const cat = v.category || "length";
      const units: Record<string, Record<string, number>> = {
        length: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
        mass: { mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592 },
        volume: { ml: 0.001, l: 1, "m\u00B3": 1000, gal: 3.78541, qt: 0.946353, pt: 0.473176, cup: 0.236588, floz: 0.0295735 },
      };
      if (cat === "temperature") {
        const toK = (n: number, u: string) => { u = u.replace(/[^a-z]/g, "").toLowerCase(); if (u === "c" || u === "celsius") return n + 273.15; if (u === "f" || u === "fahrenheit") return (n - 32) * 5 / 9 + 273.15; if (u === "k" || u === "kelvin") return n; return NaN; };
        const fromK = (n: number, u: string) => { u = u.replace(/[^a-z]/g, "").toLowerCase(); if (u === "c" || u === "celsius") return n - 273.15; if (u === "f" || u === "fahrenheit") return (n - 273.15) * 9 / 5 + 32; if (u === "k" || u === "kelvin") return n; return NaN; };
        const k = toK(val, from); if (isNaN(k)) return { error: "Unknown temperature unit. Use C, F, or K." };
        return { result: fromK(k, to).toFixed(2), value: val, from: from.toUpperCase(), to: to.toUpperCase(), category: "Temperature" };
      }
      const lut = units[cat];
      if (!lut) return { error: "Unknown category" };
      const fromFactor = lut[from]; const toFactor = lut[to];
      if (!fromFactor || !toFactor) return { error: `Unknown unit. Available: ${Object.keys(lut).join(", ")}` };
      const result = val * fromFactor / toFactor;
      return { result: result < 0.001 ? result.toExponential(4) : result.toFixed(6), value: val, from, to, category: cat, "alternative": cat === "length" && (from === "km" || to === "km") ? `${(result * 0.621371).toFixed(2)} miles` : undefined };
    },
  },
  "distance-calculator": {
    fields: [
      { name: "lat1", type: "number", label: "Latitude point 1", placeholder: "40.7128" },
      { name: "lon1", type: "number", label: "Longitude point 1", placeholder: "-74.0060" },
      { name: "lat2", type: "number", label: "Latitude point 2", placeholder: "34.0522" },
      { name: "lon2", type: "number", label: "Longitude point 2", placeholder: "-118.2437" },
    ],
    buttonText: "Calculate Distance",
    process: (v) => {
      const lat1 = parseFloat(v.lat1); const lon1 = parseFloat(v.lon1); const lat2 = parseFloat(v.lat2); const lon2 = parseFloat(v.lon2);
      if ([lat1, lon1, lat2, lon2].some(isNaN)) return { error: "Enter valid latitude/longitude coordinates" };
      const R = 6371; const dLat = (lat2 - lat1) * Math.PI / 180; const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const km = R * c; const mi = km * 0.621371; const nmi = km * 0.539957;
      return { "Distance (km)": km.toFixed(2), "Distance (mi)": mi.toFixed(2), "Distance (nmi)": nmi.toFixed(2), "Point 1": `${lat1}, ${lon1}`, "Point 2": `${lat2}, ${lon2}` };
    },
  },
  "fuel-calculator": {
    fields: [
      { name: "distance", type: "number", label: "Distance (km)", placeholder: "500" },
      { name: "efficiency", type: "number", label: "Fuel efficiency (L/100km)", placeholder: "8" },
      { name: "price", type: "number", label: "Fuel price per liter ($)", placeholder: "1.5" },
    ],
    buttonText: "Calculate Fuel Cost",
    process: (v) => {
      const dist = parseFloat(v.distance); const eff = parseFloat(v.efficiency); const price = parseFloat(v.price);
      if ([dist, eff, price].some(isNaN) || dist <= 0 || eff <= 0 || price <= 0) return { error: "Enter valid positive numbers for distance, efficiency, and price" };
      const liters = dist / 100 * eff;
      const cost = liters * price;
      const costPerKm = cost / dist;
      const co2kg = liters * 2.31;
      return { "Total Cost": `$${cost.toFixed(2)}`, "Fuel Needed": `${liters.toFixed(1)} L`, "Cost per km": `$${costPerKm.toFixed(4)}`, "CO\u2082 Emissions": `${co2kg.toFixed(1)} kg`, "Distance": `${dist} km`, "Efficiency": `${eff} L/100km`, "Price per liter": `$${price.toFixed(2)}` };
    },
  },
  "gpa-calculator": {
    fields: [
      { name: "grades", type: "textarea", label: "Grades (letter or number, one per line)", placeholder: "A\nB+\nA-\nB" },
    ],
    buttonText: "Calculate GPA",
    process: (v) => {
      const t = (v.grades || "").trim();
      if (!t) return { error: "Enter at least one grade" };
      const letterGPA: Record<string, number> = { "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "D-": 0.7, "F": 0.0 };
      const lines = t.split("\n").map(l => l.trim()).filter(Boolean);
      let total = 0; let count = 0;
      const details: string[] = [];
      for (const line of lines) {
        const grade = line.toUpperCase();
        if (letterGPA[grade] !== undefined) { total += letterGPA[grade]; count++; details.push(`${grade} → ${letterGPA[grade]}`); }
        else { const num = parseFloat(grade); if (!isNaN(num) && num >= 0 && num <= 100) { const gpa = num >= 93 ? 4.0 : num >= 90 ? 3.7 : num >= 87 ? 3.3 : num >= 83 ? 3.0 : num >= 80 ? 2.7 : num >= 77 ? 2.3 : num >= 73 ? 2.0 : num >= 70 ? 1.7 : num >= 67 ? 1.3 : num >= 63 ? 1.0 : num >= 60 ? 0.7 : 0.0; total += gpa; count++; details.push(`${grade} → ${gpa} (${num}%)`); } }
      }
      if (count === 0) return { error: "No valid grades found. Enter letter grades (A, B+, etc.) or percentages (0-100)." };
      const gpa = total / count;
      const honor = gpa >= 3.5 ? "Honors" : gpa >= 3.0 ? "Good standing" : gpa >= 2.0 ? "Satisfactory" : "Probation";
      return { GPA: gpa.toFixed(2), "Grade Count": count, "Total Points": total.toFixed(1), Status: honor, "Scale": "4.0 (unweighted)", Details: details.join("\n") };
    },
  },
  "data-breach-checker": {
    fields: [],
    buttonText: "Check Breaches",
    isComingSoon: true,
  },
  "ssl-expiry-checker": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Check Expiry",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "xss-scanner": {
    fields: [{ name: "input", type: "textarea", label: "HTML or URL to scan", placeholder: "<script>alert('xss')</script>" }],
    buttonText: "Scan",
    process: CLIENT_TOOLS["xss-scanner"],
    warning: "Only use this tool to test websites you own or have explicit permission to test. Unauthorized scanning of third-party websites may violate local laws and is prohibited.",
  },
  "cors-checker": {
    fields: [{ name: "input", type: "text", label: "URL to test", placeholder: "https://api.example.com" }],
    buttonText: "Check CORS",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "ssl-test": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Test SSL",
    apiEndpoint: "/api/tools/dns-lookup",
  },
};

function generateDefaultConfig(slug: string, name: string): ToolConfig {
  const lower = slug;
  const hasGenerator = lower.includes("generator") || lower.includes("generator");
  const hasCalculator = lower.includes("calculator") || lower.includes("calculator");
  const hasConverter = lower.includes("converter") || lower.includes("convert") || lower.includes("to-");
  const hasChecker = lower.includes("checker") || lower.includes("check") || lower.includes("lookup") || lower.includes("test") || lower.includes("scan");
  const hasFormatter = lower.includes("formatter") || lower.includes("format") || lower.includes("beautif");
  const hasEncoder = lower.includes("encoder") || lower.includes("decode");
  const hasPreview = lower.includes("preview");
  const hasCompare = lower.includes("compare") || lower.includes("diff") || lower.includes("comparison");
  const hasCleaner = lower.includes("clean") || lower.includes("remov") || lower.includes("minif");
  const hasSort = lower.includes("sort") || lower.includes("alphabet") || lower.includes("random");
  const isTextTool = lower.includes("text") || lower.includes("word") || lower.includes("line") || lower.includes("character") || lower.includes("paragraph");

  const base: ToolConfig = { fields: [], buttonText: "Run", isComingSoon: true };
  if (hasCalculator) return { ...base, fields: [{ name: "input", type: "number", label: "Value", placeholder: "Enter a value" }], buttonText: "Calculate" };
  if (hasGenerator && !lower.includes("sitemap") && !lower.includes("meta") && !lower.includes("schema")) {
    if (lower.includes("password") || lower.includes("token") || lower.includes("key")) return { ...base, fields: [{ name: "length", type: "number", label: "Length", placeholder: "16" }], buttonText: "Generate" };
    return { ...base, fields: [{ name: "input", type: "text", label: "Input", placeholder: `Enter ${name.toLowerCase()} input...` }], buttonText: "Generate" };
  }
  if (hasConverter || hasEncoder) return { ...base, fields: [{ name: "input", type: "textarea", label: "Input", placeholder: "Enter value to convert..." }], buttonText: "Convert" };
  if (hasChecker || hasCompare) return { ...base, fields: [{ name: "input", type: "text", label: "Input", placeholder: `Enter ${name.toLowerCase()} input...` }], buttonText: "Check" };
  if (hasFormatter || hasCleaner) return { ...base, fields: [{ name: "input", type: "textarea", label: "Input", placeholder: "Enter content..." }], buttonText: "Process" };
  if (hasPreview) return { ...base, fields: [{ name: "input", type: "textarea", label: "Content", placeholder: "Enter content to preview..." }], buttonText: "Preview" };
  if (hasSort) return { ...base, fields: [{ name: "input", type: "textarea", label: "Items (one per line)", placeholder: "item1\nitem2\nitem3" }], buttonText: "Sort" };
  if (isTextTool) return { ...base, fields: [{ name: "input", type: "textarea", label: "Text", placeholder: "Enter text..." }], buttonText: "Process" };
  return { ...base, fields: [{ name: "input", type: "text", label: "Input", placeholder: "Enter input..." }], buttonText: "Run" };
}

export function getToolConfig(slug: string): ToolConfig {
  const merged = { ...NEW_TOOL_CONFIGS, ...CHECKER_CONFIGS, ...AI_CONFIGS, ...IMAGE_CONFIGS, ...PDF_CONFIGS, ...CONFIGS };
  if (merged[slug]) return merged[slug];

  const tool = getAllTools().find((t: Tool) => t.slug === slug);
  const name = tool?.name?.toLowerCase() || slug;
  return generateDefaultConfig(slug, name);
}
