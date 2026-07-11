import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const srcDir = "src";
const results = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      walk(full);
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      const content = readFileSync(full, "utf8");
      // Find literal backslash-u sequences in JSX string values or regular strings
      // Look for \uXXXX where XXXX is a hex code and the backslash is literal
      // The pattern is: " followed by \\u (literal backslash + u)
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Check for literal \uD8 pattern (surrogate pair start)
        const surrogateMatch = line.match(/["'=]\s*\u005c\u0075[dD][89a-fA-F][0-9a-fA-F]{2}/);
        if (surrogateMatch) {
          const lineNum = i + 1;
          const relPath = relative(".", full);
          results.push({ file: relPath, line: lineNum, text: line.trim().substring(0, 120) });
        }
      }
    }
  }
}

walk(srcDir);

console.log(`Found ${results.length} files with literal surrogate escape sequences:\n`);
const byFile = {};
for (const r of results) {
  if (!byFile[r.file]) byFile[r.file] = [];
  byFile[r.file].push(r);
}

for (const [file, lines] of Object.entries(byFile)) {
  console.log(`\n=== ${file} (${lines.length} occurrences) ===`);
  for (const l of lines) {
    console.log(`  Line ${l.line}: ${l.text}`);
  }
}
