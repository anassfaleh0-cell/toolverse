"use client";

import { useState } from "react";
import { Textarea, Button, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const BLOCK_ELEMENTS = new Set([
  "html", "head", "body", "div", "section", "article", "nav", "aside",
  "header", "footer", "main", "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "ul", "ol", "li", "dl", "dt", "dd", "table", "thead", "tbody",
  "tfoot", "tr", "th", "td", "form", "fieldset", "legend", "figure",
  "figcaption", "details", "summary", "pre", "blockquote", "hr", "br",
]);

function minifyHtml(html: string): string {
  let result = html;

  result = result.replace(/<!--[\s\S]*?-->/g, "");

  result = result.replace(/\s+/g, " ");

  result = result.replace(/>\s+</g, "><");

  result = result.replace(/\s+\//g, "/");

  result = result.replace(/<\/(li|dt|dd|p|td|th|option|optgroup)>/g, "");

  result = result.replace(/"\s+(?=[\w-]+=)/g, '" ');

  result = result.replace(/\s+(\/?)>/g, "$1>");

  result = result.replace(/<([a-zA-Z0-9]+)\s+([^>]*?)\s*\/?>/g, (_match, tag, attrs) => {
    const cleaned = attrs.replace(/(["'])([^"']*?)\1/g, (_m: string, q: string, v: string) => {
      if (/^[\w-]+$/.test(v) && !v.includes(" ")) {
        return v;
      }
      return `${q}${v}${q}`;
    });
    return `<${tag} ${cleaned}>`.replace(/\s+>/, ">");
  });

  result = result.replace(/\s*=\s*/g, "=");

  return result.trim();
}

function beautifyHtml(html: string): string {
  const lines: string[] = [];
  let indent = 0;
  const tagRegex = /<\/?[^>]+>/g;
  let lastIndex = 0;

  const tokens: { type: "tag" | "text"; value: string }[] = [];
  tagRegex.lastIndex = 0;

  while (true) {
    const match = tagRegex.exec(html);
    if (!match) {
      const text = html.slice(lastIndex).trim();
      if (text) tokens.push({ type: "text", value: text });
      break;
    }
    if (match.index > lastIndex) {
      const text = html.slice(lastIndex, match.index).trim();
      if (text) tokens.push({ type: "text", value: text });
    }
    tokens.push({ type: "tag", value: match[0] });
    lastIndex = match.index + match[0].length;
  }

  for (const token of tokens) {
    if (token.type === "text") {
      lines.push("  ".repeat(indent) + token.value);
      continue;
    }

    const tag = token.value;
    const isClosing = /^<\//.test(tag);
    const tagNameMatch = tag.match(/<\/?([a-zA-Z0-9]+)/);
    const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : "";
    const isSelfClosing = /\/>$/.test(tag) || VOID_ELEMENTS.has(tagName);

    if (isClosing) {
      indent = Math.max(0, indent - 1);
      lines.push("  ".repeat(indent) + tag);
    } else if (isSelfClosing) {
      lines.push("  ".repeat(indent) + tag);
    } else if (BLOCK_ELEMENTS.has(tagName)) {
      lines.push("  ".repeat(indent) + tag);
      indent++;
    } else {
      lines.push("  ".repeat(indent) + tag);
      indent++;
    }
  }

  if (lines.length === 0) return html;
  return lines.join("\n");
}

export function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleMinify() {
    if (!input.trim()) return;
    try {
      setOutput(minifyHtml(input));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to minify HTML");
      setOutput("");
    }
  }

  function handleBeautify() {
    if (!input.trim()) return;
    try {
      setOutput(beautifyHtml(input));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to beautify HTML");
      setOutput("");
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter HTML to minify or beautify..."
          rows={8}
          aria-label="HTML input"
        />
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleMinify} variant="primary" disabled={!input.trim()}>
            Minify
          </Button>
          <Button onClick={handleBeautify} variant="primary" disabled={!input.trim()}>
            Beautify
          </Button>
          <Button onClick={handleClear} variant="secondary">
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mt-6">
          <p className="font-mono">{error}</p>
        </Alert>
      )}

      {output && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Output</p>
            <CopyButton text={output} />
          </div>
          <pre className="overflow-x-auto break-all p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
        </div>
      )}
    </div>
  );
}
