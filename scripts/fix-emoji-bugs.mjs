import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const srcDir = "src";
let totalFixed = 0;
let totalFiles = 0;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      walk(full);
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      const content = readFileSync(full, "utf8");
      
      // Replace literal \uXXXX sequences with actual unicode characters
      // But ONLY if they are inside string literals (quoted)
      // Pattern: literal backslash followed by uXXXX
      const newContent = content.replace(/\u005c[uU]([0-9a-fA-F]{4})/g, (match, hex) => {
        const codePoint = parseInt(hex, 16);
        // Handle surrogate pairs
        if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
          return String.fromCharCode(codePoint);
        }
        return String.fromCodePoint(codePoint);
      });

      if (newContent !== content) {
        writeFileSync(full, newContent, "utf8");
        const diff = (content.match(/\u005c[uU]/g) || []).length;
        const newDiff = (newContent.match(/\u005c[uU]/g) || []).length;
        const fixed = diff - newDiff;
        totalFixed += fixed;
        totalFiles++;
        const relPath = join(".", full);
        console.log(`Fixed ${fixed} escapes in ${relPath}`);
      }
    }
  }
}

walk(srcDir);
console.log(`\nDone! Fixed ${totalFixed} literal escape sequences across ${totalFiles} files.`);
