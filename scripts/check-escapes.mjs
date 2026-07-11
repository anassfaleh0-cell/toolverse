import { execSync } from "child_process";

// Check git HEAD version of ip-display.tsx for icon escapes
const content = execSync("git show HEAD:src/components/ip-tool/ip-display.tsx", { encoding: "utf8" });

// Find all icon="..." patterns  
const iconRegex = /icon="([^"]*)"/g;
let m;
while ((m = iconRegex.exec(content)) !== null) {
  const val = m[1];
  const hasSurrogate = /\\u[dD][89a-fA-F][0-9a-fA-F]{2}/.test(val);
  const hasActualBackslash = val.includes("\\u");
  
  // Check if it's just a BMP escape like \u2014
  const isBmpEscape = /^\\u[0-9a-fA-F]{4}$/.test(val);
  
  console.log(`icon value: ${JSON.stringify(val)}`);
  console.log(`  length: ${val.length}`);
  console.log(`  has surrogate pattern: ${hasSurrogate}`);
  console.log(`  has actual backslash char: ${hasActualBackslash}`);
  console.log(`  is BMP escape: ${isBmpEscape}`);
  
  if (hasActualBackslash) {
    console.log(`  char codes: ${[...val].map(c => c.charCodeAt(0).toString(16).padStart(4, "0")).join(" ")}`);
  }
  console.log("");
}
