import type { Tool } from "./registry";
import { getAllTools } from "./registry";

export interface ToolField {
  name: string;
  type: "text" | "number" | "textarea" | "url" | "select";
  label: string;
  placeholder: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}

export interface ToolConfig {
  fields: ToolField[];
  buttonText: string;
  apiEndpoint?: string;
  process?: (values: Record<string, string>) => Record<string, unknown>;
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
  const merged = { ...CHECKER_CONFIGS, ...CONFIGS };
  if (merged[slug]) return merged[slug];

  const tool = getAllTools().find((t: Tool) => t.slug === slug);
  const name = tool?.name?.toLowerCase() || slug;
  return generateDefaultConfig(slug, name);
}
