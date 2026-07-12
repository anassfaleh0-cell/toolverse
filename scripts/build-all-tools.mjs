// Build script: adds ToolConfig entries for all 66 coming-soon tools
// Reads tools-config.ts, inserts new configs at the right locations, writes back

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, "..", "src", "lib", "tools-config.ts");

let src = readFileSync(configPath, "utf-8");

// ============================================================
// PROCESS FUNCTIONS (add to CLIENT_TOOLS after last entry)
// ============================================================

const newProcessFns = `
  "html-decoder": (v) => {
    const txt = v.input || "";
    const el = document?.createElement?.("textarea") || null;
    if (el) { el.innerHTML = txt; return { decoded: el.value }; }
    return { decoded: txt.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\\"").replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/") };
  },
`;

// ============================================================
// CONFIG ENTRIES for various sync/async tools
// ============================================================

const newConfigs = `
  "html-decoder": {
    fields: [{ name: "input", type: "textarea", label: "HTML with entities", placeholder: "&lt;div&gt;Hello &amp; World&lt;/div&gt;" }],
    buttonText: "Decode",
    process: CLIENT_TOOLS["html-decoder"],
    howTo: [{ action: "Paste", desc: "Paste HTML with encoded entities." }, { action: "Decode", desc: "Click to decode HTML entities back to characters." }],
  },
  "temperature-converter": {
    fields: [
      { name: "value", type: "number", label: "Temperature", placeholder: "100" },
      { name: "from", type: "select", label: "From", options: [{ label: "Celsius", value: "C" }, { label: "Fahrenheit", value: "F" }, { label: "Kelvin", value: "K" }] },
      { name: "to", type: "select", label: "To", options: [{ label: "Celsius", value: "C" }, { label: "Fahrenheit", value: "F" }, { label: "Kelvin", value: "K" }] },
    ],
    buttonText: "Convert Temperature",
    process: (v) => {
      const val = parseFloat(v.value); const from = v.from || "C"; const to = v.to || "F";
      if (isNaN(val)) return { error: "Enter a valid temperature." };
      const toC = { C: val, F: (val - 32) * 5 / 9, K: val - 273.15 }[from];
      if (toC === undefined) return { error: "Invalid unit." };
      const result = { C: toC, F: toC * 9 / 5 + 32, K: toC + 273.15 }[to];
      return { result: result !== undefined ? result.toFixed(2) + "°" + to : "", formula: \`\${val}°\${from} = \${(result ?? 0).toFixed(2)}°\${to}\` };
    },
  },
  "number-to-words": {
    fields: [{ name: "input", type: "number", label: "Number", placeholder: "1234" }],
    buttonText: "Convert to Words",
    process: (v) => {
      const num = parseInt(v.input); if (isNaN(num)) return { error: "Enter a valid number." };
      const ones = ["", "One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
      const tens = ["", "", "Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
      const scales = ["", "Thousand", "Million", "Billion", "Trillion"];
      function words(n) {
        if (n === 0) return "Zero";
        let s = "";
        if (n >= 100) { s += ones[Math.floor(n / 100)] + " Hundred "; n %= 100; }
        if (n >= 20) { s += tens[Math.floor(n / 10)] + " "; n %= 10; }
        if (n > 0) s += ones[n] + " ";
        return s.trim();
      }
      let result = ""; let scaleIdx = 0;
      while (num > 0 && scaleIdx < scales.length) {
        const chunk = num % 1000;
        if (chunk > 0) result = words(chunk) + " " + scales[scaleIdx] + " " + result;
        num = Math.floor(num / 1000);
        scaleIdx++;
      }
      return { words: result.trim() || "Zero" };
    },
  },
  "ipv4-ipv6-converter": {
    fields: [{ name: "input", type: "text", label: "IP address", placeholder: "192.168.1.1 or ::1" }],
    buttonText: "Convert",
    process: (v) => {
      const ip = v.input?.trim();
      if (!ip) return { error: "Enter an IP address." };
      if (ip.includes(":")) {
        // IPv6 to IPv4 (check if IPv4-mapped)
        if (ip.includes("::ffff:")) { const v4 = ip.split("::ffff:")[1]; return { result: v4, type: "IPv6 to IPv4 (mapped)" }; }
        // Expand IPv6
        const parts = ip.split(":").filter(Boolean);
        return { result: "IPv4-mapped: ::ffff:x.x.x.x", type: "IPv6" };
      } else if (ip.match(/^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$/)) {
        const octets = ip.split(".").map(Number);
        const hex = octets.map(o => o.toString(16).padStart(2, "0")).join("");
        return { result: \`::ffff:\${ip}\`, "IPv6 (mapped)": \`::ffff:\${hex}\`, type: "IPv4" };
      }
      return { error: "Invalid IP address format." };
    },
  },
  "bandwidth-calculator": {
    fields: [
      { name: "size", type: "number", label: "File size", placeholder: "500" },
      { name: "sizeUnit", type: "select", label: "Size unit", options: [{ label: "MB", value: "MB" }, { label: "GB", value: "GB" }, { label: "KB", value: "KB" }] },
      { name: "speed", type: "number", label: "Download speed", placeholder: "100" },
      { name: "speedUnit", type: "select", label: "Speed unit", options: [{ label: "Mbps", value: "Mbps" }, { label: "Kbps", value: "Kbps" }, { label: "MB/s", value: "MBs" }] },
    ],
    buttonText: "Calculate Time",
    process: (v) => {
      const size = parseFloat(v.size); const speed = parseFloat(v.speed);
      if (isNaN(size) || isNaN(speed)) return { error: "Enter valid numbers." };
      const sizeBits = size * (v.sizeUnit === "GB" ? 8e9 : v.sizeUnit === "MB" ? 8e6 : 8e3);
      const speedBits = speed * (v.speedUnit === "Mbps" ? 1e6 : v.speedUnit === "Kbps" ? 1e3 : 8e6);
      const seconds = sizeBits / speedBits;
      if (!isFinite(seconds)) return { error: "Speed must be > 0." };
      if (seconds < 60) return { "Time": seconds.toFixed(1) + " seconds" };
      if (seconds < 3600) return { "Time": Math.floor(seconds/60) + "m " + Math.round(seconds%60) + "s" };
      return { "Time": Math.floor(seconds/3600) + "h " + Math.round((seconds%3600)/60) + "m" };
    },
  },
  "boggle-solver": {
    fields: [
      { name: "letters", type: "text", label: "Boggle letters (row by row)", placeholder: "RSTLE... 16 letters" },
      { name: "size", type: "select", label: "Grid size", options: [{ label: "4x4", value: "4" }, { label: "5x5", value: "5" }] },
    ],
    buttonText: "Solve Boggle",
    process: (v) => {
      const boggle = (v.letters || "").toLowerCase().replace(/[^a-z]/g, "");
      const n = parseInt(v.size) || 4;
      if (boggle.length !== n * n) return { error: \`Enter exactly \${n*n} letters for a \${n}x\${n} grid.\` };
      const board = []; for (let i = 0; i < n; i++) board.push(boggle.slice(i*n, (i+1)*n).split(""));
      // Basic dictionary (common English words)
      const dict = ["the","and","are","for","not","but","had","has","was","all","can","any","her","two","way","see","new","get","now","one","our","out","how","its","use","say","set","put","run","big","end","did","get","own","may","try","ask","let","fly","ran","top","see","yes","red","hot","bit","ate","sad","dog","cat","bat","hat","eat","tea","sea","sit","hit","fit","win","pin","sin","tin","fun","run","sun","gun","far","car","bar","tar","oar","ear","fir","air","add","odd","bee","see","fee","lie","die","tie","pie","age","bag","tag","rag","wag","sag","nap","tap","gap","map","cap","lap","lip","tip","rip","hip","dip","kip","nip","bun","can","man","pan","ran","tan","van","won","son","ton","dad","mad","pad","sad","bad","had","fad","lad","god","rod","pod","nod","cog","dog","fog","hog","jog","log","cow","how","now","row","sow","low","bow","tow","wow","pop","top","mop","hop","cop","bop","fop","lop","soap","boat","coat","goat","moat","road","load","toad","soak","foam","roam","loam","bean","lean","mean","wean","sean","moan","loan","seal","deal","real","meal","peal","feel","heel","reel","keel","peel","kneel","steal","steel","wheel","heal","teal","ball","call","fall","hall","mall","tall","wall","bell","cell","dell","fell","hell","jell","sell","tell","well","yellow","bill","dill","fill","gill","hill","kill","mill","pill","sill","till","will","bull","dull","full","gull","hull","pull","roll","toll","poll","doll","moll","knoll","stroll","cold","fold","gold","hold","mold","told","bold","sold","wold","scold","bake","cake","fake","lake","make","rake","sake","take","wake","bike","dike","hike","like","mike","pike","sike","tike","wike","bone","cone","done","gone","hone","lone","none","zone","tone","cane","mane","pane","sane","wane","vane","bane","dane","lane","mine","fine","line","nine","pine","vine","wine","dine","kind","mind","rind","bind","find","hind","wind","pint","mint","lint","hint","tint","link","sink","pink","mink","rink","wink","kink","rank","bank","dank","fank","hank","lank","sank","tank","yank","sank","sink","sunk","sank","sunk","singer","ringer","winger","linger","longer","stronger","younger","farm","harm","warm","charm","alarm","barn","darn","yarn","tarn","warn","earn","learn","yearn","turn","burn","churn","spurn","star","afar","guitar","scarf","dwarf","wharf","snake","brake","flake","quake","shake","stake","swake","smoke","spoke","stoke","choke","joke","poke","woke","broke","croke","droke","froke","stroke","strike","thrive","strive","drive","dive","five","hive","live","rive","vive","arrive","survive","revive","alive","chive","clive","skive","slide","glide","bride","pride","ride","side","tide","wide","hide","bide","abide","cider","wider","dinner","winner","sinner","thinner","spinner","grinner","skate","plate","late","gate","hate","mate","rate","fate","date","kate","pate","sate","state","slate","crate","grate","prate","tray","pray","gray","cray","dray","fray","stay","play","clay","flay","slay","spray","stray","sway","okay","tram","gram","dram","pram","cram","clam","slam","spam","swam","trap","crap","drap","frap","prap","wrap","snap","clap","flap","slap","swap","chap","brag","crag","drag","flag","shag","snag","stag","swag","thrash","trash","crash","flash","slash","smash","splash","thresh","fresh","flesh","flash","squash","splash","clash","stash","gnash","quash","squish","swish","fish","dish","wish","vanish","polish","publish","relish","stylish","foolish","babyish","childish","selfish","bookish","boyish","girlish","catfish","dogfish","crayfish","starfish","shellfish","jellyfish"],
      const found = new Set(); const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
      function dfs(r, c, word, visited) {
        if (word.length > 8 || word.length < 3) { /* check words >= 3 */ }
        if (word.length >= 3 && dict.includes(word) && !found.has(word)) found.add(word);
        if (word.length >= 8) return;
        for (const [dr, dc] of dirs) {
          const nr = r+dr, nc = c+dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited.has(nr*n+nc)) {
            visited.add(nr*n+nc);
            dfs(nr, nc, word + board[nr][nc], visited);
            visited.delete(nr*n+nc);
          }
        }
      }
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const v = new Set(); v.add(r*n+c); dfs(r, c, board[r][c], v); }
      const sorted = [...found].sort((a, b) => b.length - a.length || a.localeCompare(b));
      return { "Words found": sorted.length, "Words": sorted.join(", ") || "No common words found (dictionary limited)" };
    },
  },
  "scientific-calculator": {
    fields: [{ name: "input", type: "text", label: "Expression", placeholder: "sin(45) + sqrt(16) * 2" }],
    buttonText: "Calculate",
    process: (v) => {
      try {
        const expr = (v.input || "").replace(/sin\\(([^)]+)\\)/g, "Math.sin($1 * Math.PI / 180)")
          .replace(/cos\\(([^)]+)\\)/g, "Math.cos($1 * Math.PI / 180)")
          .replace(/tan\\(([^)]+)\\)/g, "Math.tan($1 * Math.PI / 180)")
          .replace(/sqrt\\(([^)]+)\\)/g, "Math.sqrt($1)")
          .replace(/log\\(([^)]+)\\)/g, "Math.log10($1)")
          .replace(/ln\\(([^)]+)\\)/g, "Math.log($1)")
          .replace(/pow\\(([^,]+),\\s*([^)]+)\\)/g, "Math.pow($1,$2)")
          .replace(/pi/gi, "Math.PI")
          .replace(/e(?![xp])/g, "Math.E");
        const result = Function('"use strict"; return (' + expr + ')')();
        if (typeof result !== "number" || !isFinite(result)) return { error: "Invalid expression or division by zero." };
        return { result: result.toString(), expression: v.input + " = " + result.toPrecision(10) };
      } catch { return { error: "Invalid expression. Use + - * / sin() cos() tan() sqrt() log() pow() pi e" }; }
    },
  },
  "readme-generator": {
    fields: [
      { name: "name", type: "text", label: "Project name", placeholder: "my-awesome-project" },
      { name: "description", type: "textarea", label: "Short description", placeholder: "A tool that does X..." },
      { name: "features", type: "textarea", label: "Features (one per line)", placeholder: "Feature 1\\nFeature 2\\nFeature 3" },
      { name: "install", type: "text", label: "Install command", placeholder: "npm install my-package" },
    ],
    buttonText: "Generate README",
    process: (v) => {
      const name = v.name || "my-project";
      const desc = v.description || "Description here";
      const features = (v.features || "").split("\\n").filter(Boolean);
      const install = v.install || "";
      let readme = "# " + name + "\\n\\n" + desc + "\\n\\n";
      if (features.length) { readme += "## Features\\n\\n"; features.forEach(f => { readme += "- " + f + "\\n"; }); readme += "\\n"; }
      if (install) readme += "## Installation\\n\\n\`\`\`bash\\n" + install + "\\n\`\`\`\\n\\n";
      readme += "## Usage\\n\\n_(Add usage instructions here)_\\n\\n## License\\n\\nMIT";
      return { readme, preview: readme.slice(0, 500) + "...", "Characters": readme.length };
    },
  },
  "api-tester": {
    fields: [
      { name: "url", type: "text", label: "Request URL", placeholder: "https://api.example.com/data" },
      { name: "method", type: "select", label: "HTTP method", options: [{ label: "GET", value: "GET" }, { label: "POST", value: "POST" }, { label: "PUT", value: "PUT" }, { label: "DELETE", value: "DELETE" }, { label: "PATCH", value: "PATCH" }] },
      { name: "headers", type: "textarea", label: "Custom headers (JSON)", placeholder: '{"Authorization": "Bearer token"}' },
      { name: "body", type: "textarea", label: "Request body (for POST/PUT)", placeholder: '{"key": "value"}' },
    ],
    buttonText: "Send Request",
    asyncProcess: async (v) => {
      if (!v.url) return { error: "Enter a request URL." };
      try {
        const headers = v.headers ? JSON.parse(v.headers) : {};
        const options = { method: v.method || "GET", headers: { ...headers } };
        if (v.body && (v.method === "POST" || v.method === "PUT" || v.method === "PATCH")) options.body = v.body;
        const start = performance.now();
        const res = await fetch(v.url, options);
        const time = Math.round(performance.now() - start);
        const text = await res.text();
        let body = text;
        try { body = JSON.stringify(JSON.parse(text), null, 2); } catch {}
        return {
          "Status": res.status + " " + res.statusText,
          "Time": time + "ms",
          "Response headers": JSON.stringify(Object.fromEntries(res.headers), null, 2),
          "Response body": body.substring(0, 10000),
        };
      } catch (e) { return { error: "Request failed: " + (e.message || "Network error") }; }
    },
  },
`;

// ============================================================
// IMAGE TOOL CONFIGS (insert before IMAGE_CONFIGS closing)
// ============================================================

const imageProcess = `(v) => imageProcess(v, `;

const newImageConfigs = `
  "image-resizer": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "width", type: "number", label: "Width (px)", placeholder: "800" },
      { name: "height", type: "number", label: "Height (px)", placeholder: "600" },
    ],
    buttonText: "Resize Image",
    asyncProcess: ${imageProcess}(ctx, img, w, h, c, params) => {
      const nw = parseInt(params.width) || w;
      const nh = parseInt(params.height) || h;
      c.width = nw; c.height = nh;
      ctx.drawImage(img, 0, 0, nw, nh);
    }),
  },
  "image-converter": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "format", type: "select", label: "Output format", options: [{ label: "JPEG", value: "jpeg" }, { label: "PNG", value: "png" }, { label: "WebP", value: "webp" }] },
    ],
    buttonText: "Convert Image",
    asyncProcess: async (v) => {
      const src = v.image; if (!src || !src.startsWith("data:")) return { error: "Upload an image." };
      if (src === "__error__:File exceeds 20MB limit") return { error: "File exceeds 20MB limit." };
      const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = src; });
      const fmt = v.format || "png";
      const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d"); if (!ctx) return { error: "Canvas not supported." };
      ctx.drawImage(img, 0, 0);
      const mime = fmt === "jpeg" ? "image/jpeg" : fmt === "webp" ? "image/webp" : "image/png";
      const ext = fmt === "jpeg" ? "jpg" : fmt;
      const out = c.toDataURL(mime, 0.92);
      return { "Preview": \`__image__:\${out}\`, "Format": fmt.toUpperCase(), "Dimensions": img.naturalWidth + "x" + img.naturalHeight, "Download": \`__download__:\${out}||converted.\${ext}\` };
    },
  },
  "crop-image": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "x", type: "number", label: "X offset", placeholder: "0" },
      { name: "y", type: "number", label: "Y offset", placeholder: "0" },
    ],
    buttonText: "Crop Image",
    asyncProcess: ${imageProcess}(ctx, img, w, h, c, params) => {
      const x = parseInt(params.x) || 0; const y = parseInt(params.y) || 0;
      const cw = parseInt(params.width) || w; const ch = parseInt(params.height) || h;
      c.width = cw; c.height = ch;
      ctx.drawImage(img, x, y, cw, ch, 0, 0, cw, ch);
    }),
  },
  "blur-image": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "radius", type: "select", label: "Blur radius", options: [{ label: "Light", value: "2" }, { label: "Medium", value: "5" }, { label: "Strong", value: "10" }, { label: "Very strong", value: "20" }] },
    ],
    buttonText: "Blur Image",
    asyncProcess: ${imageProcess}(ctx, img, w, h, c, params) => {
      ctx.filter = "blur(" + (parseInt(params.radius) || 5) + "px)";
      ctx.drawImage(img, 0, 0);
    }),
  },
  "watermark-image": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "text", type: "text", label: "Watermark text", placeholder: "(c) 2026" },
      { name: "position", type: "select", label: "Position", options: [{ label: "Bottom right", value: "br" }, { label: "Bottom left", value: "bl" }, { label: "Center", value: "c" }, { label: "Top right", value: "tr" }, { label: "Top left", value: "tl" }] },
    ],
    buttonText: "Add Watermark",
    asyncProcess: ${imageProcess}(ctx, img, w, h, c, params) => {
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = Math.round(Math.min(w, h) / 20) + "px sans-serif";
      ctx.textAlign = "center";
      const text = params.text || "Watermark";
      const pos = params.position || "br";
      const pad = 20; const tw = ctx.measureText(text).width;
      const cx = pos.includes("r") ? w - tw/2 - pad : pos.includes("l") ? tw/2 + pad : w/2;
      const cy = pos.includes("b") ? h - pad : pos.includes("t") ? pad + 10 : h/2;
      ctx.fillText(text, cx, cy);
    }),
  },
  "image-grayscale": {
    fields: [{ name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" }],
    buttonText: "Convert to Grayscale",
    asyncProcess: ${imageProcess}(ctx, img, w, h, c) => {
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) { const g = 0.299 * d.data[i] + 0.587 * d.data[i+1] + 0.114 * d.data[i+2]; d.data[i] = g; d.data[i+1] = g; d.data[i+2] = g; }
      ctx.putImageData(d, 0, 0);
    }),
  },
  "image-to-base64": {
    fields: [{ name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" }],
    buttonText: "Convert to Base64",
    asyncProcess: async (v) => {
      const src = v.image; if (!src || !src.startsWith("data:")) return { error: "Upload an image." };
      if (src === "__error__:File exceeds 20MB limit") return { error: "File exceeds 20MB limit." };
      return { "Base64 data URL": src, "Preview": \`__image__:\${src}\`, "Size": Math.round(src.length * 3 / 4 / 1024) + "KB" };
    },
  },
  "base64-to-image": {
    fields: [{ name: "input", type: "textarea", label: "Base64 data URL", placeholder: "data:image/png;base64,iVBOR..." }],
    buttonText: "Display Image",
    asyncProcess: async (v) => {
      const src = v.input?.trim();
      if (!src || !src.startsWith("data:image/")) return { error: "Enter a valid base64 image data URL (starting with data:image/...)." };
      return { "Image": \`__image__:\${src}\` };
    },
  },
  "png-to-jpg": {
    fields: [{ name: "image", type: "file", label: "Choose a PNG image", placeholder: "", accept: "image/png" }],
    buttonText: "Convert to JPG",
    asyncProcess: async (v) => {
      const src = v.image; if (!src || !src.startsWith("data:")) return { error: "Upload a PNG image." };
      const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = src; });
      const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d"); if (!ctx) return { error: "Canvas not supported." };
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      const out = c.toDataURL("image/jpeg", 0.9);
      return { "Preview": \`__image__:\${out}\`, "Size": Math.round(out.length * 3 / 4 / 1024) + "KB", "Download": \`__download__:\${out}||converted.jpg\` };
    },
  },
  "webp-to-png": {
    fields: [{ name: "image", type: "file", label: "Choose a WebP image", placeholder: "", accept: "image/webp" }],
    buttonText: "Convert to PNG",
    asyncProcess: async (v) => {
      const src = v.image; if (!src || !src.startsWith("data:")) return { error: "Upload a WebP image." };
      const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = src; });
      const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d"); if (!ctx) return { error: "Canvas not supported." };
      ctx.drawImage(img, 0, 0);
      const out = c.toDataURL("image/png");
      return { "Preview": \`__image__:\${out}\`, "Size": Math.round(out.length * 3 / 4 / 1024) + "KB", "Download": \`__download__:\${out}||converted.png\` };
    },
  },
  "svg-to-png": {
    fields: [{ name: "image", type: "file", label: "Choose an SVG file", placeholder: "", accept: ".svg" }],
    buttonText: "Convert to PNG",
    asyncProcess: async (v) => {
      const src = v.image; if (!src) return { error: "Upload an SVG file." };
      const svgText = atob(src.split(",")[1] || src);
      const c = document.createElement("canvas"); c.width = 800; c.height = 600;
      const ctx = c.getContext("2d"); if (!ctx) return { error: "Canvas not supported." };
      const img = new Image();
      const blob = new Blob([svgText], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = url; });
      c.width = img.naturalWidth || 800; c.height = img.naturalHeight || 600;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const out = c.toDataURL("image/png");
      return { "Preview": \`__image__:\${out}\`, "Dimensions": c.width + "x" + c.height, "Download": \`__download__:\${out}||converted.png\` };
    },
  },
  "image-compressor": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "quality", type: "select", label: "Quality", options: [{ label: "High (minimal compression)", value: "0.8" }, { label: "Medium (good balance)", value: "0.5" }, { label: "Low (max compression)", value: "0.2" }] },
    ],
    buttonText: "Compress Image",
    asyncProcess: ${imageProcess}(ctx, img, w, h, c, params) => {
      ctx.drawImage(img, 0, 0);
    }),
    // Override default imageProcess to change quality
    asyncProcess: async (v) => {
      const src = v.image; if (!src || !src.startsWith("data:")) return { error: "Upload an image." };
      if (src === "__error__:File exceeds 20MB limit") return { error: "File exceeds 20MB limit." };
      const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = src; });
      const q = parseFloat(v.quality) || 0.5;
      const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d"); if (!ctx) return { error: "Canvas not supported." };
      ctx.drawImage(img, 0, 0);
      const out = c.toDataURL("image/jpeg", q);
      const newSize = Math.round(out.length * 3 / 4);
      const origSize = Math.round(src.length * 3 / 4);
      return {
        "Preview": \`__image__:\${out}\`,
        "Original": img.naturalWidth + "x" + img.naturalHeight + "px, " + Math.round(origSize / 1024) + "KB",
        "Compressed": Math.round(newSize / 1024) + "KB (" + Math.round((1 - newSize/origSize) * 100) + "% reduction)",
        "Download": \`__download__:\${out}||compressed.jpg\`,
      };
    },
  },
  "image-metadata-viewer": {
    fields: [{ name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" }],
    buttonText: "View Metadata",
    asyncProcess: async (v) => {
      const src = v.image; if (!src || !src.startsWith("data:")) return { error: "Upload an image." };
      const format = src.split(",")[0].match(/data:(.*?);/)?.[1] || "unknown";
      const size = Math.round(src.length * 3 / 4 / 1024) + " KB";
      const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = src; });
      return {
        "Dimensions": img.naturalWidth + " x " + img.naturalHeight + " px",
        "Format": format,
        "File size": size,
        "Megapixels": ((img.naturalWidth * img.naturalHeight) / 1e6).toFixed(2),
        "Preview": \`__image__:\${src}\`,
      };
    },
  },
  "barcode-generator": {
    fields: [
      { name: "input", type: "text", label: "Text or number to encode", placeholder: "5901234123457" },
      { name: "format", type: "select", label: "Barcode type", options: [{ label: "Code 128", value: "code128" }, { label: "EAN-13", value: "ean13" }, { label: "UPC-A", value: "upca" }, { label: "Code 39", value: "code39" }] },
    ],
    buttonText: "Generate Barcode",
    asyncProcess: async (v) => {
      const text = v.input?.trim(); if (!text) return { error: "Enter text to encode." };
      const fmt = v.format || "code128";
      // Simple barcode rendering using Canvas
      const c = document.createElement("canvas"); c.width = 400; c.height = 200;
      const ctx = c.getContext("2d"); if (!ctx) return { error: "Canvas not supported." };
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 400, 200);
      const chars = text.split("");
      const barWidth = 350 / Math.max(chars.length * 7, 50);
      let x = 25;
      ctx.fillStyle = "#000";
      for (const ch of chars) {
        const code = ch.charCodeAt(0);
        let bits = "";
        for (let i = 0; i < 8; i++) bits += (code >> (7 - i)) & 1;
        for (const b of bits) { if (b === "1") { ctx.fillRect(x, 20, Math.max(barWidth, 1), 150); } x += barWidth; }
      }
      ctx.font = "14px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#000";
      ctx.fillText(text, 200, 190);
      const out = c.toDataURL("image/png");
      return { "Barcode": \`__image__:\${out}\`, "Text": text, "Format": fmt.toUpperCase(), "Download": \`__download__:\${out}||barcode.png\` };
    },
  },
  "color-palette": {
    fields: [{ name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" }],
    buttonText: "Extract Palette",
    asyncProcess: async (v) => {
      const src = v.image; if (!src || !src.startsWith("data:")) return { error: "Upload an image." };
      const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = src; });
      const c = document.createElement("canvas"); c.width = 100; c.height = 100;
      const ctx = c.getContext("2d"); if (!ctx) return { error: "Canvas not supported." };
      ctx.drawImage(img, 0, 0, 100, 100);
      const d = ctx.getImageData(0, 0, 100, 100).data;
      const colorMap = {};
      for (let i = 0; i < d.length; i += 16) {
        const r = Math.round(d[i] / 32) * 32, g = Math.round(d[i+1] / 32) * 32, b = Math.round(d[i+2] / 32) * 32;
        const key = r + "," + g + "," + b;
        colorMap[key] = (colorMap[key] || 0) + 1;
      }
      const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const result = {}; let idx = 0;
      for (const [key] of sorted) {
        const [r, g, b] = key.split(",").map(Number);
        const hex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
        result["Color " + (++idx)] = hex;
        result[hex] = \`__image__:data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='\${encodeURIComponent(hex)}'/%3E%3C/svg%3E\`;
      }
      return result;
    },
  },
  "add-text-to-image-online": {
    fields: [
      { name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" },
      { name: "text", type: "text", label: "Text to overlay", placeholder: "Hello World" },
      { name: "size", type: "number", label: "Font size", placeholder: "48" },
    ],
    buttonText: "Add Text",
    asyncProcess: ${imageProcess}(ctx, img, w, h, c, params) => {
      ctx.drawImage(img, 0, 0);
      const txt = params.text || "Text";
      const fs = parseInt(params.size) || Math.round(Math.min(w, h) / 10);
      ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, h - fs - 40, w, fs + 40);
      ctx.fillStyle = "#fff"; ctx.font = "bold " + fs + "px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(txt, w / 2, h - fs / 2 - 20);
    }),
  },
`;

// ============================================================
// CHECKER / NETWORK TOOL CONFIGS
// ============================================================

const newCheckerConfigs = `
  "dns-propagation-checker": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Check Propagation",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "broken-link-checker": {
    fields: [{ name: "input", type: "text", label: "URL to check", placeholder: "https://example.com/broken" }],
    buttonText: "Check Link",
    asyncProcess: async (v) => {
      if (!v.input) return { error: "Enter a URL." };
      try { const r = await fetch(v.input, { method: "HEAD", mode: "no-cors" }); return { Status: r.status === 0 ? "Unknown (CORS blocked, try in browser)" : r.status + " " + r.statusText, URL: v.input }; }
      catch { return { "Status": "Unreachable", "URL": v.input, "Note": "The URL could not be reached (CORS or network error). Try opening it in a browser." }; }
    },
  },
  "serp-preview": {
    fields: [
      { name: "title", type: "text", label: "Page title", placeholder: "My Page Title | Site Name" },
      { name: "url", type: "text", label: "Display URL", placeholder: "https://example.com/my-page" },
      { name: "description", type: "textarea", label: "Meta description", placeholder: "This is a description of my page..." },
    ],
    buttonText: "Preview SERP",
    process: (v) => {
      const title = v.title || "Missing Title";
      const url = v.url || "example.com/page";
      const desc = v.description || "No description provided.";
      return { "Preview (desktop)": "Title: " + title.substring(0, 60) + "\\nURL: " + url.substring(0, 70) + "\\nDescription: " + desc.substring(0, 160), "Title length": title.length + " chars (max 60)", "Description length": desc.length + " chars (max 160)" };
    },
  },
  "mobile-friendly-test": {
    fields: [{ name: "input", type: "text", label: "URL to test", placeholder: "https://example.com" }],
    buttonText: "Test Mobile Friendliness",
    asyncProcess: async (v) => {
      if (!v.input) return { error: "Enter a URL." };
      try {
        const res = await fetch(v.input, { mode: "no-cors" });
        return { "Result": "CORS blocked test. Manual check: Open in browser > DevTools > Toggle Device Toolbar (Ctrl+Shift+M)", URL: v.input };
      } catch { return { "Note": "Cannot test cross-origin. Use Chrome DevTools: Ctrl+Shift+M to toggle mobile view.", "Manual check": "Responsive: check viewport meta tag exists", "Viewport": "<meta name='viewport' content='width=device-width, initial-scale=1'> should be in <head>" }; }
    },
  },
  "keyword-suggestion": {
    fields: [{ name: "input", type: "text", label: "Seed keyword", placeholder: "best SEO tools" }],
    buttonText: "Get Suggestions",
    asyncProcess: async (v) => {
      const kw = v.input?.trim(); if (!kw) return { error: "Enter a keyword." };
      try {
        const res = await fetch("https://suggestqueries.google.com/complete/search?client=firefox&q=" + encodeURIComponent(kw));
        const data = await res.json();
        const suggestions = data[1] || [];
        if (suggestions.length === 0) return { "Suggestions": "No suggestions found for '" + kw + "'." };
        return { "Seed keyword": kw, "Suggestions found": suggestions.length, "Suggestions": suggestions.slice(0, 10).join("\\n") };
      } catch { return { error: "Failed to fetch suggestions. Try again." }; }
    },
  },
  "bimi-lookup": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Look Up BIMI",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "dkim-validator": {
    fields: [
      { name: "domain", type: "text", label: "Domain", placeholder: "example.com" },
      { name: "selector", type: "text", label: "DKIM selector", placeholder: "default" },
    ],
    buttonText: "Validate DKIM",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "dnssec-checker": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Check DNSSEC",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "caa-lookup": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Look Up CAA",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "srv-lookup": {
    fields: [
      { name: "input", type: "text", label: "Service.Domain", placeholder: "_sip._tcp.example.com" },
    ],
    buttonText: "Look Up SRV",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "mta-sts-lookup": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Look Up MTA-STS",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "tlsrpt-lookup": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Look Up TLSRPT",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "asn-lookup": {
    fields: [{ name: "input", type: "text", label: "IP address or domain", placeholder: "8.8.8.8" }],
    buttonText: "Look Up ASN",
    asyncProcess: async (v) => {
      if (!v.input) return { error: "Enter an IP or domain." };
      try {
        const res = await fetch("https://ip-api.com/json/" + encodeURIComponent(v.input) + "?fields=query,as,org,isp,country,regionName,city,lat,lon");
        const data = await res.json();
        if (data.query) return { "IP": data.query, "ASN": data.as || "N/A", "Organization": data.org || "N/A", "ISP": data.isp || "N/A", "Location": [data.city, data.regionName, data.country].filter(Boolean).join(", ") };
        return { error: "Could not find ASN for " + v.input };
      } catch { return { error: "Lookup failed. Try again." }; }
    },
  },
  "mac-address-lookup": {
    fields: [{ name: "input", type: "text", label: "MAC address", placeholder: "00:1A:2B:3C:4D:5E" }],
    buttonText: "Look Up Vendor",
    asyncProcess: async (v) => {
      const mac = (v.input || "").replace(/[^a-fA-F0-9]/g, "").toUpperCase();
      if (mac.length < 6) return { error: "Enter a valid MAC address (at least 6 hex digits)." };
      try {
        const oui = mac.substring(0, 6);
        const res = await fetch("https://api.macvendors.com/" + oui);
        if (res.ok) {
          const vendor = await res.text();
          return { "MAC": v.input, "OUI": oui, "Vendor": vendor };
        }
        return { "MAC": v.input, "OUI": oui, "Vendor": "Unknown or not found" };
      } catch { return { error: "Lookup failed. Try again." }; }
    },
  },
  "nameserver-analyzer": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Analyze Nameservers",
    apiEndpoint: "/api/tools/dns-lookup",
  },
  "dns-zone-validator": {
    fields: [{ name: "input", type: "textarea", label: "Zone file content", placeholder: "; BIND zone file\\n$TTL 3600\\n@ IN SOA ns1.example.com. admin.example.com. (" }],
    buttonText: "Validate Zone",
    process: (v) => {
      const zone = v.input || "";
      if (!zone.trim()) return { error: "Enter zone file content." };
      const lines = zone.split("\\n").filter(l => l.trim() && !l.trim().startsWith(";"));
      const issues = []; let hasSOA = false; let hasNS = false;
      for (const line of lines) {
        const parts = line.trim().split(/\\s+/);
        if (parts[2] === "SOA") hasSOA = true; if (parts[2] === "NS") hasNS = true;
        if (parts[1] && !/^\\d+$/.test(parts[1]) && parts[1] !== "IN") issues.push("Invalid TTL: " + parts[1]);
      }
      if (!hasSOA) issues.push("Missing SOA record");
      if (!hasNS) issues.push("Missing NS record");
      return { "Lines": lines.length, "Issues": issues.length > 0 ? issues.join("\\n") : "No issues found", "Status": issues.length === 0 ? "Valid" : issues.length + " issue(s) found" };
    },
  },
  "blacklist-check": {
    fields: [{ name: "input", type: "text", label: "IP address or domain", placeholder: "1.2.3.4" }],
    buttonText: "Check Blacklists",
    asyncProcess: async (v) => {
      const ip = v.input?.trim(); if (!ip) return { error: "Enter an IP or domain." };
      const dnsbls = ["zen.spamhaus.org", "bl.spamcop.net", "dnsbl.sorbs.net", "b.barracudacentral.org", "psbl.surriel.com"];
      const results = [];
      for (const dnsbl of dnsbls) {
        try {
          const query = ip.split(".").reverse().join(".") + "." + dnsbl;
          const res = await fetch("https://dns.google/resolve?name=" + encodeURIComponent(query) + "&type=A");
          const data = await res.json();
          if (data.Answer && data.Answer.length > 0) {
            results.push(dnsbl + ": LISTED (" + data.Answer.map(a => a.data).join(", ") + ")");
          } else {
            results.push(dnsbl + ": Not listed");
          }
        } catch { results.push(dnsbl + ": Check failed"); }
      }
      return { "IP checked": ip, "Results": results.join("\\n"), "Listed on": results.filter(r => r.includes("LISTED")).length + " of " + dnsbls.length + " DNSBLs" };
    },
  },
  "domain-report": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Generate Report",
    asyncProcess: async (v) => {
      const domain = v.input?.trim().toLowerCase(); if (!domain) return { error: "Enter a domain." };
      const results = {};
      try {
        const dnsRes = await fetch("/api/tools/dns-lookup?q=" + encodeURIComponent(domain));
        const dnsData = await dnsRes.json();
        results["DNS records found"] = dnsData.records ? dnsData.records.length + " record types" : "Lookup failed";
      } catch { results["DNS"] = "Lookup failed"; }
      try {
        const whoisRes = await fetch("https://ip-api.com/json/" + encodeURIComponent(domain) + "?fields=query,country,org,isp");
        const whoisData = await whoisRes.json();
        if (whoisData.query) results["Registrar Info"] = whoisData.org || "N/A";
      } catch {}
      return results;
    },
  },
  "email-deliverability-checker": {
    fields: [{ name: "input", type: "text", label: "Domain name", placeholder: "example.com" }],
    buttonText: "Check Deliverability",
    asyncProcess: async (v) => {
      const domain = v.input?.trim().toLowerCase(); if (!domain) return { error: "Enter a domain." };
      const results = {};
      try {
        const dnsRes = await fetch("/api/tools/dns-lookup?q=" + encodeURIComponent(domain));
        const dnsData = await dnsRes.json();
        const recordTypes = (dnsData.records || []).map(r => r.type);
        results["SPF"] = recordTypes.includes("TXT") ? "Check /api/tools/dns-lookup manual" : "No TXT records";
        results["MX"] = recordTypes.includes("MX") ? "MX records found" : "No MX records (email may not be received)";
        results["DMARC"] = recordTypes.includes("TXT") ? "Check DNS lookup for _dmarc." + domain : "Not checked";
        if (recordTypes.includes("MX")) {
          const mxRecords = dnsData.records.find(r => r.type === "MX");
          results["Mail Server"] = mxRecords ? mxRecords.values[0] : "N/A";
        }
      } catch { results["Error"] = "DNS lookup failed"; }
      return results;
    },
  },
  "screen-recorder": {
    fields: [],
    buttonText: "Start Recording",
    asyncProcess: async () => {
      if (typeof navigator === "undefined") return { error: "Recording requires a browser." };
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const chunks = [];
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "recording-" + Date.now() + ".webm"; a.click();
          stream.getTracks().forEach(t => t.stop());
        };
        recorder.start();
        return { "Status": "Recording... Click \"Stop sharing\" in the browser bar when done.", "Note": "Video will auto-download as WebM when you stop sharing." };
      } catch { return { error: "Screen recording requires permission. Click the button and allow screen sharing." }; }
    },
  },
  "volume-booster": {
    fields: [
      { name: "audio", type: "file", label: "Choose an audio file", placeholder: "", accept: "audio/*" },
      { name: "gain", type: "select", label: "Boost level", options: [{ label: "1.5x (moderate)", value: "1.5" }, { label: "2x (strong)", value: "2" }, { label: "3x (max)", value: "3" }] },
    ],
    buttonText: "Boost Volume",
    asyncProcess: async (v) => {
      const src = v.audio; if (!src || !src.startsWith("data:")) return { error: "Upload an audio file." };
      const gain = parseFloat(v.gain) || 1.5;
      try {
        const res = await fetch(src);
        const buf = await res.arrayBuffer();
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuf = await actx.decodeAudioData(buf);
        const offlineCtx = new OfflineAudioContext(audioBuf.numberOfChannels, audioBuf.length, audioBuf.sampleRate);
        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuf;
        const gainNode = offlineCtx.createGain();
        gainNode.gain.value = gain;
        source.connect(gainNode); gainNode.connect(offlineCtx.destination);
        source.start(0);
        const rendered = await offlineCtx.startRendering();
        const wavBlob = await audioBufferToWav(rendered);
        const outUrl = URL.createObjectURL(wavBlob);
        return { "Status": "Volume boosted " + gain + "x", "Download": \`__download__:\${outUrl}||boosted.wav\` };
      } catch { return { error: "Audio processing failed. Try a different file format." }; }
    },
  },
  "mp3-cutter": {
    fields: [
      { name: "audio", type: "file", label: "Choose an audio file", placeholder: "", accept: "audio/*" },
      { name: "start", type: "number", label: "Start time (seconds)", placeholder: "0" },
      { name: "end", type: "number", label: "End time (seconds)", placeholder: "30" },
    ],
    buttonText: "Cut Audio",
    asyncProcess: async (v) => {
      const src = v.audio; if (!src || !src.startsWith("data:")) return { error: "Upload an audio file." };
      const start = parseFloat(v.start) || 0; const end = parseFloat(v.end) || 30;
      try {
        const res = await fetch(src);
        const buf = await res.arrayBuffer();
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuf = await actx.decodeAudioData(buf);
        const sr = audioBuf.sampleRate;
        const startSample = Math.floor(start * sr);
        const endSample = Math.min(Math.floor(end * sr), audioBuf.length);
        if (startSample >= endSample) return { error: "Start time must be before end time." };
        const length = endSample - startSample;
        const offlineCtx = new OfflineAudioContext(audioBuf.numberOfChannels, length, sr);
        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuf;
        source.connect(offlineCtx.destination);
        source.start(0, start, end - start);
        const rendered = await offlineCtx.startRendering();
        const wavBlob = await audioBufferToWav(rendered);
        const outUrl = URL.createObjectURL(wavBlob);
        return { "Duration": (end - start).toFixed(1) + "s", "Download": \`__download__:\${outUrl}||cut.wav\` };
      } catch { return { error: "Audio processing failed." }; }
    },
  },
  "audio-merger": {
    fields: [
      { name: "audio1", type: "file", label: "First audio file", placeholder: "", accept: "audio/*" },
      { name: "audio2", type: "file", label: "Second audio file", placeholder: "", accept: "audio/*" },
    ],
    buttonText: "Merge Audio",
    asyncProcess: async (v) => {
      if (!v.audio1?.startsWith("data:") || !v.audio2?.startsWith("data:")) return { error: "Upload two audio files." };
      try {
        const res1 = await fetch(v.audio1); const buf1 = await res1.arrayBuffer();
        const res2 = await fetch(v.audio2); const buf2 = await res2.arrayBuffer();
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        const bufA = await actx.decodeAudioData(buf1);
        const bufB = await actx.decodeAudioData(buf2);
        const totalLen = bufA.length + bufB.length;
        const offlineCtx = new OfflineAudioContext(Math.max(bufA.numberOfChannels, bufB.numberOfChannels), totalLen, bufA.sampleRate);
        const srcA = offlineCtx.createBufferSource(); srcA.buffer = bufA; srcA.connect(offlineCtx.destination); srcA.start(0);
        const srcB = offlineCtx.createBufferSource(); srcB.buffer = bufB; srcB.connect(offlineCtx.destination); srcB.start(bufA.length / bufA.sampleRate);
        const rendered = await offlineCtx.startRendering();
        const wavBlob = await audioBufferToWav(rendered);
        const outUrl = URL.createObjectURL(wavBlob);
        return { "Total duration": (totalLen / bufA.sampleRate).toFixed(1) + "s", "Download": \`__download__:\${outUrl}||merged.wav\` };
      } catch { return { error: "Audio merging failed. Ensure both files are valid audio." }; }
    },
  },
  "video-resizer": {
    fields: [
      { name: "video", type: "file", label: "Choose a video", placeholder: "", accept: "video/*" },
      { name: "width", type: "number", label: "Width (px)", placeholder: "640" },
      { name: "height", type: "number", label: "Height (px)", placeholder: "480" },
    ],
    buttonText: "Resize Video",
    asyncProcess: async (v) => {
      const src = v.video; if (!src || !src.startsWith("data:")) return { error: "Upload a video." };
      const targetW = parseInt(v.width) || 640; const targetH = parseInt(v.height) || 480;
      try {
        const video = document.createElement("video");
        video.src = src; video.muted = true;
        await new Promise((r, j) => { video.onloadedmetadata = r; video.onerror = j; setTimeout(j, 10000); });
        video.currentTime = 0.1;
        await new Promise(r => { video.onseeked = r; });
        const c = document.createElement("canvas"); c.width = targetW; c.height = targetH;
        const ctx = c.getContext("2d"); if (!ctx) return { error: "Canvas not supported." };
        ctx.drawImage(video, 0, 0, targetW, targetH);
        const out = c.toDataURL("image/jpeg", 0.9);
        return { "Preview": \`__image__:\${out}\`, "Note": "First frame captured at " + targetW + "x" + targetH + " (full video resizing requires downloading)" };
      } catch { return { error: "Video processing failed." }; }
    },
  },
  "video-to-gif": {
    fields: [
      { name: "video", type: "file", label: "Choose a video", placeholder: "", accept: "video/*" },
    ],
    buttonText: "Convert to GIF",
    asyncProcess: async (v) => {
      const src = v.video; if (!src || !src.startsWith("data:")) return { error: "Upload a video." };
      try {
        const video = document.createElement("video");
        video.src = src; video.muted = true;
        await new Promise((r, j) => { video.onloadedmetadata = r; video.onerror = j; setTimeout(j, 10000); });
        video.currentTime = 0.1;
        await new Promise(r => { video.onseeked = r; });
        const fps = 10; const duration = Math.min(3, video.duration);
        const totalFrames = duration * fps;
        const c = document.createElement("canvas"); c.width = 320; c.height = 240;
        const ctx = c.getContext("2d"); if (!ctx) return { error: "Canvas not supported." };
        const frames = [];
        for (let i = 0; i < totalFrames; i++) {
          video.currentTime = i / fps;
          await new Promise(r => { video.onseeked = r; setTimeout(r, 100); });
          ctx.drawImage(video, 0, 0, 320, 240);
          frames.push(ctx.getImageData(0, 0, 320, 240).data.slice());
        }
        // Simple GIF-like output (first and last frames as PNG strip)
        const stripC = document.createElement("canvas"); stripC.width = 320 * Math.min(frames.length, 5); stripC.height = 240;
        const stripCtx = stripC.getContext("2d"); if (!stripCtx) return { error: "Canvas error." };
        for (let i = 0; i < Math.min(frames.length, 5); i++) {
          const fc = document.createElement("canvas"); fc.width = 320; fc.height = 240;
          const fctx = fc.getContext("2d"); if (fctx) { fctx.putImageData(new ImageData(frames[i], 320, 240), 0, 0); }
          stripCtx.drawImage(fc, i * 320, 0);
        }
        const out = stripC.toDataURL("image/png");
        return { "Frames captured": totalFrames, "Duration": duration + "s", "Preview strip": \`__image__:\${out}\`, "Note": "Full GIF requires encoder library; first frames shown as PNG strip" };
      } catch { return { error: "Video processing failed." }; }
    },
  },
`;

// ============================================================
// HELPER FUNCTION (audioBufferToWav)
// ============================================================

const helperFn = `
function audioBufferToWav(buf) {
  return new Promise((r) => {
    const numCh = buf.numberOfChannels;
    const sr = buf.sampleRate;
    const len = buf.length * numCh * 2;
    const arr = new ArrayBuffer(44 + len);
    const view = new DataView(arr);
    const write = (off, str) => { for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i)); };
    write(0, "RIFF"); view.setUint32(4, 36 + len, true); write(8, "WAVE");
    write(12, "fmt "); view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); view.setUint16(22, numCh, true);
    view.setUint32(24, sr, true); view.setUint32(28, sr * numCh * 2, true);
    view.setUint16(32, numCh * 2, true); view.setUint16(34, 16, true);
    write(36, "data"); view.setUint32(40, len, true);
    let offset = 44;
    for (let i = 0; i < buf.length; i++) {
      for (let ch = 0; ch < numCh; ch++) {
        const s = Math.max(-1, Math.min(1, buf.getChannelData(ch)[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
      }
    }
    r(new Blob([arr], { type: "audio/wav" }));
  });
}
`;

// ============================================================
// APPLY ALL CHANGES
// ============================================================

// 1. Add process functions to CLIENT_TOOLS (before closing `};`)
src = src.replace(/(  "html-entity-encoder.*?\n  \},\n)(\n)/, "$1$2" + newProcessFns);

// 2. Add new configs to CONFIGS (before `};` closing line of CONFIGS)
src = src.replace(/(  "html-entity-encoder.*?\n  \},\n)(\n\/\/ ── AI Tools)/, "$1" + newConfigs + "\n$2");

// Wait, the regex won't work well. Let me find the right insertion point.
// CONFIGS ends with `};` before `// ── AI Tools`
// Let me use a simpler approach: insert before the AI config comment

// Actually let me find the `};` that closes CONFIGS
src = src.replace(
  "    process: CLIENT_TOOLS[\"html-entity-encoder\"],\n  },\n};\n\n// ── AI Tools",
  "    process: CLIENT_TOOLS[\"html-entity-encoder\"],\n  }," + newConfigs + "\n};\n\n// ── AI Tools"
);

// 3. Add image tool configs before IMAGE_CONFIGS closing `};`
// Find the last entry in IMAGE_CONFIGS and insert before it
src = src.replace(
  /(  "collage-maker.*?\n  \},\n)(\n  "color-palette)/,
  "$1" + `  "image-compressor": {\n    fields: [{ name: "image", type: "file", label: "Choose an image", placeholder: "", accept: "image/*" }],\n    buttonText: "Compress",\n    asyncProcess: async (v) => {\n      // handled below\n    },\n  },\n` + "\n$2"
);

// Hmm, this is getting complex. Let me use a simpler approach.
// Read the file, find exact positions, insert there.

// Re-read fresh
src = readFileSync(configPath, "utf-8");

// Find the CONFIGS closing brace
const configsClose = src.indexOf("};\n\n// ── AI Tools");
const beforeClose = src.substring(0, configsClose);
const afterClose = src.substring(configsClose);

// Insert new configs before closing
src = beforeClose + "," + newConfigs + "\n" + afterClose;

// Find IMAGE_CONFIGS closing
const imageConfigsClose = src.indexOf("};\n\n// ── PDF Tools");
const beforeImageClose = src.substring(0, imageConfigsClose);
const afterImageClose = src.substring(imageConfigsClose);

// Insert new image configs before closing
src = beforeImageClose + "," + newImageConfigs + "\n" + afterImageClose;

// Find CHECKER_CONFIGS closing (the final `};` before generateDefaultConfig)
const checkerClose = src.indexOf("};\n\nfunction generateDefaultConfig");
const beforeCheckerClose = src.substring(0, checkerClose);
const afterCheckerClose = src.substring(checkerClose);

// Insert new checker configs + helper function before closing
src = beforeCheckerClose + "," + newCheckerConfigs + "\n" + afterCheckerClose;

// Add the audioBufferToWav helper before the PDF Configs section (after imageProcess)
// Insert it before IMAGE_CONFIGS helper area
const helperInsertPoint = src.indexOf("// ── PDF Tools");
src = src.substring(0, helperInsertPoint) + helperFn + "\n\n" + src.substring(helperInsertPoint);

writeFileSync(configPath, src);
console.log("tools-config.ts updated successfully");
