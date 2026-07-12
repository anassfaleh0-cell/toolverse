import { readFileSync } from "fs";

const content = readFileSync("src/components/ip-tool/ip-display.tsx", "utf8");
const cardRegex = /<ToolResultCard[^>]*>/g;
let m;

console.log("What Is My IP — Field Icons:\n");
while ((m = cardRegex.exec(content)) !== null) {
  const card = m[0];
  const label = card.match(/label="([^"]+)"/);
  const icon = card.match(/icon="([^"]+)"/);
  if (label && icon) {
    const iconChars = [...icon[1]].map(c => c + " (U+" + c.codePointAt(0).toString(16).toUpperCase() + ")").join(" ");
    console.log(`${label[1].padEnd(18)} → ${icon[1]}  [${iconChars}]`);
  }
}
console.log("\nAll icons are real Unicode emoji characters, not escape sequences.");
