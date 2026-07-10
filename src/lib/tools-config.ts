import type { Tool } from "./registry";
import { getAllTools } from "./registry";

export interface ToolField {
  name: string;
  type: "text" | "number" | "textarea" | "url" | "select" | "file";
  label: string;
  placeholder: string;
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
    apiEndpoint: "/api/tools/dns-lookup",
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
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "uptime-checker": {
    fields: [{ name: "input", type: "text", label: "URL", placeholder: "https://example.com" }],
    buttonText: "Check Uptime",
    apiEndpoint: "/api/tools/uptime-checker",
  },
  "speed-test": {
    fields: [],
    buttonText: "Start Test",
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
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "user-agent-parser": {
    fields: [{ name: "input", type: "textarea", label: "User-Agent string", placeholder: "Mozilla/5.0 (Windows NT 10.0; ..." }],
    buttonText: "Parse",
  },
  "subnet-calculator": {
    fields: [
      { name: "ip", type: "text", label: "IP address", placeholder: "192.168.1.0" },
      { name: "cidr", type: "number", label: "CIDR prefix", placeholder: "24" },
    ],
    buttonText: "Calculate Subnet",
  },
  "jwt-decoder": {
    fields: [{ name: "input", type: "textarea", label: "JWT token", placeholder: "eyJhbGciOiJIUzI1NiIs..." }],
    buttonText: "Decode JWT",
  },
  "regex-tester": {
    fields: [
      { name: "pattern", type: "text", label: "Regular expression", placeholder: "\\d+" },
      { name: "flags", type: "text", label: "Flags", placeholder: "gi" },
      { name: "input", type: "textarea", label: "Test text", placeholder: "Enter text to test against..." },
    ],
    buttonText: "Test Regex",
  },
  "md5-hash-generator": {
    fields: [{ name: "input", type: "textarea", label: "Text to hash", placeholder: "Enter text..." }],
    buttonText: "Generate MD5",
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
  },
  "html-minifier": {
    fields: [{ name: "input", type: "textarea", label: "HTML code", placeholder: "<html>\n<body>\n  <p>Hello</p>\n</body>\n</html>" }],
    buttonText: "Minify",
  },
  "css-minifier": {
    fields: [{ name: "input", type: "textarea", label: "CSS code", placeholder: "body {\n  color: red;\n}" }],
    buttonText: "Minify",
  },
  "js-minifier": {
    fields: [{ name: "input", type: "textarea", label: "JavaScript code", placeholder: "function hello() {\n  return 'world';\n}" }],
    buttonText: "Minify",
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
  },
  "text-to-slug": {
    fields: [{ name: "input", type: "text", label: "Text to convert", placeholder: "Hello World! This is a Title" }],
    buttonText: "Convert to Slug",
  },
  "url-parser": {
    fields: [{ name: "input", type: "text", label: "URL", placeholder: "https://example.com/path?q=hello#fragment" }],
    buttonText: "Parse URL",
  },
  "json-validator": {
    fields: [{ name: "input", type: "textarea", label: "JSON to validate", placeholder: '{"key": "value"}' }],
    buttonText: "Validate",
  },
  "yaml-formatter": {
    fields: [{ name: "input", type: "textarea", label: "YAML input", placeholder: "key: value\nlist:\n  - item" }],
    buttonText: "Format YAML",
  },
  "xml-formatter": {
    fields: [{ name: "input", type: "textarea", label: "XML input", placeholder: "<root><item>value</item></root>" }],
    buttonText: "Format XML",
  },
  "csv-formatter": {
    fields: [{ name: "input", type: "textarea", label: "CSV data", placeholder: "name,email\nJohn,john@example.com" }],
    buttonText: "Format CSV",
  },
  "css-prefixer": {
    fields: [{ name: "input", type: "textarea", label: "CSS code", placeholder: ".box { display: flex; }" }],
    buttonText: "Add Prefixes",
  },
  "js-beautifier": {
    fields: [{ name: "input", type: "textarea", label: "JavaScript code", placeholder: "function test(){return 1;}" }],
    buttonText: "Beautify JS",
  },
  "json-to-typescript": {
    fields: [{ name: "input", type: "textarea", label: "JSON object", placeholder: '{\n  "name": "John",\n  "age": 30\n}' }],
    buttonText: "Convert to TypeScript",
  },
  "css-selector-tester": {
    fields: [
      { name: "selector", type: "text", label: "CSS selector", placeholder: ".my-class > p" },
      { name: "html", type: "textarea", label: "HTML content", placeholder: "<div class=\"my-class\"><p>Test</p></div>" },
    ],
    buttonText: "Test Selector",
  },
  "json-to-csv": {
    fields: [{ name: "input", type: "textarea", label: "JSON data", placeholder: '[{"name":"John","age":30}]' }],
    buttonText: "Convert to CSV",
  },
  "csv-to-json": {
    fields: [{ name: "input", type: "textarea", label: "CSV data", placeholder: "name,age\nJohn,30" }],
    buttonText: "Convert to JSON",
  },
  "yaml-to-json": {
    fields: [{ name: "input", type: "textarea", label: "YAML input", placeholder: "name: John\nage: 30" }],
    buttonText: "Convert to JSON",
  },
  "json-to-xml": {
    fields: [{ name: "input", type: "textarea", label: "JSON data", placeholder: '{"root": {"item": "value"}}' }],
    buttonText: "Convert to XML",
  },
  "xml-to-json": {
    fields: [{ name: "input", type: "textarea", label: "XML input", placeholder: "<root><item>value</item></root>" }],
    buttonText: "Convert to JSON",
  },
  "xml-to-csv": {
    fields: [{ name: "input", type: "textarea", label: "XML input", placeholder: "<records><record><name>John</name></record></records>" }],
    buttonText: "Convert to CSV",
  },
  "markdown-to-html": {
    fields: [{ name: "input", type: "textarea", label: "Markdown", placeholder: "# Hello\nThis is **bold** text." }],
    buttonText: "Convert to HTML",
  },
  "html-to-markdown": {
    fields: [{ name: "input", type: "textarea", label: "HTML", placeholder: "<h1>Hello</h1><p>This is <strong>bold</strong> text.</p>" }],
    buttonText: "Convert to Markdown",
  },
  "rgb-to-hex": {
    fields: [
      { name: "r", type: "number", label: "Red (0-255)", placeholder: "255" },
      { name: "g", type: "number", label: "Green (0-255)", placeholder: "102" },
      { name: "b", type: "number", label: "Blue (0-255)", placeholder: "0" },
    ],
    buttonText: "Convert",
  },
  "timestamp-converter": {
    fields: [
      { name: "input", type: "text", label: "Unix timestamp or date", placeholder: "1700000000 or 2024-01-01" },
    ],
    buttonText: "Convert",
  },
  "html-preview": {
    fields: [{ name: "input", type: "textarea", label: "HTML code", placeholder: "<h1>Hello World</h1>\n<p>Type HTML here...</p>" }],
    buttonText: "Preview",
  },
  "markdown-preview": {
    fields: [{ name: "input", type: "textarea", label: "Markdown", placeholder: "# Hello\nType markdown here..." }],
    buttonText: "Preview",
  },
  "sql-formatter": {
    fields: [{ name: "input", type: "textarea", label: "SQL query", placeholder: "SELECT * FROM users WHERE id = 1" }],
    buttonText: "Format SQL",
  },
  "json-path-search": {
    fields: [
      { name: "json", type: "textarea", label: "JSON data", placeholder: '{"store":{"book":[{"title":"Test"}]}}' },
      { name: "path", type: "text", label: "JSONPath expression", placeholder: "$.store.book[*].title" },
    ],
    buttonText: "Search",
  },
  "list-randomizer": {
    fields: [{ name: "input", type: "textarea", label: "Items (one per line)", placeholder: "item1\nitem2\nitem3" }],
    buttonText: "Randomize",
  },
  "remove-duplicate-lines": {
    fields: [{ name: "input", type: "textarea", label: "Text with duplicates", placeholder: "line1\nline1\nline2\nline3\nline2" }],
    buttonText: "Remove Duplicates",
  },
  "sort-lines": {
    fields: [{ name: "input", type: "textarea", label: "Text to sort", placeholder: "banana\napple\ncherry" }],
    buttonText: "Sort Lines",
  },
  "reverse-text": {
    fields: [{ name: "input", type: "textarea", label: "Text to reverse", placeholder: "Hello World" }],
    buttonText: "Reverse",
  },
  "remove-empty-lines": {
    fields: [{ name: "input", type: "textarea", label: "Text with empty lines", placeholder: "line1\n\n\nline2\n\nline3" }],
    buttonText: "Clean",
  },
  "text-cleaner": {
    fields: [{ name: "input", type: "textarea", label: "Text to clean", placeholder: "Paste text with extra  spaces,  special chars, and HTML..." }],
    buttonText: "Clean Text",
  },
  "line-counter": {
    fields: [{ name: "input", type: "textarea", label: "Text to analyze", placeholder: "line1\nline2\nline3" }],
    buttonText: "Count Lines",
  },
  "find-and-replace": {
    fields: [
      { name: "input", type: "textarea", label: "Text source", placeholder: "Enter the text to search in..." },
      { name: "find", type: "text", label: "Find", placeholder: "text to find" },
      { name: "replace", type: "text", label: "Replace with", placeholder: "replacement" },
    ],
    buttonText: "Find & Replace",
  },
  "text-splitter": {
    fields: [
      { name: "input", type: "textarea", label: "Text to split", placeholder: "item1,item2,item3" },
      { name: "delimiter", type: "text", label: "Delimiter", placeholder: "," },
    ],
    buttonText: "Split",
  },
  "text-joiner": {
    fields: [
      { name: "input", type: "textarea", label: "Items (one per line)", placeholder: "item1\nitem2\nitem3" },
      { name: "separator", type: "text", label: "Separator", placeholder: "," },
    ],
    buttonText: "Join",
  },
  "excerpt-generator": {
    fields: [
      { name: "input", type: "textarea", label: "Text", placeholder: "Enter a long text to generate an excerpt from..." },
      { name: "length", type: "number", label: "Max characters", placeholder: "150" },
    ],
    buttonText: "Generate Excerpt",
  },
  "alphabetizer": {
    fields: [{ name: "input", type: "textarea", label: "Items (one per line)", placeholder: "banana\napple\ncherry" }],
    buttonText: "Sort A-Z",
  },
  "palindrome-checker": {
    fields: [{ name: "input", type: "text", label: "Word or phrase", placeholder: "racecar" }],
    buttonText: "Check Palindrome",
  },
  "anagram-finder": {
    fields: [{ name: "input", type: "text", label: "Word or phrase", placeholder: "listen" }],
    buttonText: "Find Anagrams",
  },
  "text-to-binary": {
    fields: [{ name: "input", type: "textarea", label: "Text to convert", placeholder: "Hello" }],
    buttonText: "Convert to Binary",
  },
  "morse-code": {
    fields: [{ name: "input", type: "text", label: "Text to convert", placeholder: "SOS" }],
    buttonText: "Convert to Morse Code",
  },
  "pig-latin": {
    fields: [{ name: "input", type: "textarea", label: "English text", placeholder: "Hello world" }],
    buttonText: "Translate",
  },
  "word-scrambler": {
    fields: [{ name: "input", type: "textarea", label: "Text to scramble", placeholder: "The quick brown fox" }],
    buttonText: "Scramble",
  },
  "text-repeater": {
    fields: [
      { name: "input", type: "text", label: "Text to repeat", placeholder: "Hello" },
      { name: "count", type: "number", label: "Number of times", placeholder: "5" },
    ],
    buttonText: "Repeat",
  },
  "qr-code-generator": {
    fields: [{ name: "input", type: "text", label: "Text or URL", placeholder: "https://example.com" }],
    buttonText: "Generate QR Code",
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
  },
  "api-key-generator": {
    fields: [{ name: "length", type: "number", label: "Key length", placeholder: "32" }],
    buttonText: "Generate API Key",
  },
  "csrf-token-generator": {
    fields: [{ name: "length", type: "number", label: "Token length", placeholder: "32" }],
    buttonText: "Generate Token",
  },
  "random-password-phrase": {
    fields: [
      { name: "wordCount", type: "number", label: "Number of words", placeholder: "4" },
      { name: "separator", type: "text", label: "Separator", placeholder: "-" },
    ],
    buttonText: "Generate Passphrase",
  },
  "content-security-policy": {
    fields: [{ name: "input", type: "textarea", label: "CSP directives (one per line)", placeholder: "default-src 'self'\nscript-src 'self' https://analytics.example.com\nstyle-src 'self' 'unsafe-inline'" }],
    buttonText: "Generate CSP Header",
  },
  "hash-comparison": {
    fields: [
      { name: "hash1", type: "text", label: "First hash", placeholder: "5d41402abc4b2a76b9719d911017c592" },
      { name: "hash2", type: "text", label: "Second hash", placeholder: "5d41402abc4b2a76b9719d911017c592" },
    ],
    buttonText: "Compare Hashes",
  },
  "password-strength-checker": {
    fields: [{ name: "input", type: "text", label: "Password to check", placeholder: "Enter a password..." }],
    buttonText: "Check Strength",
  },
  "keyword-density": {
    fields: [{ name: "input", type: "textarea", label: "Text to analyze", placeholder: "Paste your content here to check keyword density..." }],
    buttonText: "Analyze",
  },
  "robots-txt-generator": {
    fields: [
      { name: "userAgent", type: "text", label: "User-agent", placeholder: "*" },
      { name: "disallow", type: "text", label: "Disallow paths (comma-separated)", placeholder: "/admin, /private" },
      { name: "allow", type: "text", label: "Allow paths (comma-separated)", placeholder: "/public" },
      { name: "sitemap", type: "text", label: "Sitemap URL", placeholder: "https://example.com/sitemap.xml" },
    ],
    buttonText: "Generate robots.txt",
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
  },
  "meta-tag-generator": {
    fields: [
      { name: "title", type: "text", label: "Page title", placeholder: "My Amazing Page" },
      { name: "description", type: "textarea", label: "Meta description", placeholder: "A brief description of the page..." },
      { name: "keywords", type: "text", label: "Keywords (comma-separated)", placeholder: "keyword1, keyword2" },
    ],
    buttonText: "Generate Meta Tags",
  },
  "open-graph-generator": {
    fields: [
      { name: "title", type: "text", label: "OG Title", placeholder: "My Amazing Page" },
      { name: "description", type: "textarea", label: "OG Description", placeholder: "A brief description..." },
      { name: "image", type: "text", label: "OG Image URL", placeholder: "https://example.com/image.jpg" },
      { name: "url", type: "text", label: "Page URL", placeholder: "https://example.com/page" },
    ],
    buttonText: "Generate OG Tags",
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
  },
  "hreflang-generator": {
    fields: [
      { name: "baseUrl", type: "text", label: "Base URL", placeholder: "https://example.com/page" },
      { name: "langs", type: "textarea", label: "Language codes and URLs (lang:url per line)", placeholder: "en:https://example.com/en/page\nfr:https://example.com/fr/page\nde:https://example.com/de/page" },
    ],
    buttonText: "Generate Hreflang Tags",
  },
  "canonical-generator": {
    fields: [{ name: "url", type: "text", label: "Canonical URL", placeholder: "https://example.com/page" }],
    buttonText: "Generate Canonical Tag",
  },
  "seo-title-preview": {
    fields: [
      { name: "title", type: "text", label: "SEO title", placeholder: "My Amazing Page | Site Name" },
      { name: "description", type: "textarea", label: "Meta description", placeholder: "A brief description..." },
    ],
    buttonText: "Preview",
  },
  "robots-txt-validator": {
    fields: [{ name: "input", type: "textarea", label: "robots.txt content", placeholder: "User-agent: *\nDisallow: /admin" }],
    buttonText: "Validate",
  },
  "social-preview": {
    fields: [
      { name: "url", type: "text", label: "Page URL", placeholder: "https://example.com/page" },
      { name: "title", type: "text", label: "OG title", placeholder: "Page Title" },
      { name: "description", type: "textarea", label: "OG description", placeholder: "Description..." },
    ],
    buttonText: "Preview",
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
  },
  "text-diff-checker": {
    fields: [
      { name: "text1", type: "textarea", label: "Original text", placeholder: "First version of text..." },
      { name: "text2", type: "textarea", label: "Modified text", placeholder: "Second version of text..." },
    ],
    buttonText: "Compare",
  },
  "random-number-generator": {
    fields: [
      { name: "min", type: "number", label: "Min", placeholder: "1" },
      { name: "max", type: "number", label: "Max", placeholder: "100" },
      { name: "count", type: "number", label: "Count", placeholder: "1" },
    ],
    buttonText: "Generate",
  },
  "age-calculator": {
    fields: [
      { name: "birthDate", type: "text", label: "Birth date (YYYY-MM-DD)", placeholder: "1990-01-15" },
    ],
    buttonText: "Calculate Age",
  },
  "date-calculator": {
    fields: [
      { name: "startDate", type: "text", label: "Start date (YYYY-MM-DD)", placeholder: "2024-01-01" },
      { name: "endDate", type: "text", label: "End date (YYYY-MM-DD)", placeholder: "2024-12-31" },
    ],
    buttonText: "Calculate Duration",
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
  },
  "distance-calculator": {
    fields: [
      { name: "lat1", type: "number", label: "Latitude point 1", placeholder: "40.7128" },
      { name: "lon1", type: "number", label: "Longitude point 1", placeholder: "-74.0060" },
      { name: "lat2", type: "number", label: "Latitude point 2", placeholder: "34.0522" },
      { name: "lon2", type: "number", label: "Longitude point 2", placeholder: "-118.2437" },
    ],
    buttonText: "Calculate Distance",
  },
  "fuel-calculator": {
    fields: [
      { name: "distance", type: "number", label: "Distance (km)", placeholder: "500" },
      { name: "efficiency", type: "number", label: "Fuel efficiency (L/100km)", placeholder: "8" },
      { name: "price", type: "number", label: "Fuel price per liter ($)", placeholder: "1.5" },
    ],
    buttonText: "Calculate Fuel Cost",
  },
  "gpa-calculator": {
    fields: [
      { name: "grades", type: "textarea", label: "Grades (letter or number, one per line)", placeholder: "A\nB+\nA-\nB" },
    ],
    buttonText: "Calculate GPA",
  },
  "data-breach-checker": {
    fields: [{ name: "input", type: "text", label: "Email address", placeholder: "user@example.com" }],
    buttonText: "Check Breaches",
  },
  "ssl-expiry-checker": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Check Expiry",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "xss-scanner": {
    fields: [{ name: "input", type: "textarea", label: "HTML or URL to scan", placeholder: "<script>alert('xss')</script>" }],
    buttonText: "Scan",
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
  const merged = { ...CHECKER_CONFIGS, ...AI_CONFIGS, ...IMAGE_CONFIGS, ...CONFIGS };
  if (merged[slug]) return merged[slug];

  const tool = getAllTools().find((t: Tool) => t.slug === slug);
  const name = tool?.name?.toLowerCase() || slug;
  return generateDefaultConfig(slug, name);
}
