"use client";

import { useState, useCallback } from "react";
import { Textarea, Button, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function xmlToJson(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error(parseError.textContent || "Invalid XML");
  }
  function walk(node: Node): unknown {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() || "";
      return text;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const obj: Record<string, unknown> = {};
      if (el.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          (obj["@attributes"] as Record<string, string>)[attr.name] = attr.value;
        }
      }
      const childCount = el.children.length;
      const textContent = el.textContent?.trim() || "";
      if (childCount === 0 && textContent) {
        return textContent;
      }
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        const key = child.tagName;
        const val = walk(child);
        if (obj[key] !== undefined) {
          if (!Array.isArray(obj[key])) {
            obj[key] = [obj[key]];
          }
          (obj[key] as unknown[]).push(val);
        } else {
          obj[key] = val;
        }
      }
      return Object.keys(obj).length > 0 ? obj : textContent;
    }
    return null;
  }
  const root = doc.documentElement;
  if (!root) throw new Error("No root element found");
  const result = { [root.tagName]: walk(root) };
  return JSON.stringify(result, null, 2);
}

function jsonToXml(jsonStr: string): string {
  const data = JSON.parse(jsonStr);
  function walk(value: unknown, key?: string): string {
    if (value === null || value === undefined) {
      return key ? `<${key}/>` : "";
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      const escaped = String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
      if (key) {
        return `<${key}>${escaped}</${key}>`;
      }
      return escaped;
    }
    if (Array.isArray(value)) {
      return value.map((v) => walk(v, key)).join("\n");
    }
    if (typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      let attrs = "";
      const children = entries.filter(([k]) => {
        if (k === "@attributes") {
          attrs = " " + Object.entries((value as Record<string, unknown>)[k] as Record<string, string>)
            .map(([ak, av]) => `${ak}="${av}"`)
            .join(" ");
          return false;
        }
        return true;
      });
      if (key) {
        if (children.length === 0) {
          return `<${key}${attrs}/>`;
        }
        const inner = children.map(([k, v]) => walk(v, k)).join("\n");
        return `<${key}${attrs}>\n${inner}\n</${key}>`;
      }
      return children.map(([k, v]) => walk(v, k)).join("\n");
    }
    return "";
  }
  const entries = Object.entries(data as Record<string, unknown>);
  return entries.map(([k, v]) => {
    const result = walk(v, k);
    return `<?xml version="1.0" encoding="UTF-8"?>\n${result}`;
  }).join("\n");
}

export function XmlToJsonConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [direction, setDirection] = useState<"xml-to-json" | "json-to-xml">("xml-to-json");

  const handleConvert = useCallback(() => {
    setError("");
    setOutput("");
    if (!input.trim()) {
      setError("Please provide input data.");
      return;
    }
    try {
      if (direction === "xml-to-json") {
        setOutput(xmlToJson(input));
      } else {
        setOutput(jsonToXml(input));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    }
  }, [input, direction]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const ext = direction === "xml-to-json" ? "json" : "xml";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, direction]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => { setDirection("xml-to-json"); setOutput(""); setError(""); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              direction === "xml-to-json"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-400"
                : "border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
            }`}
          >
            XML to JSON
          </button>
          <button
            type="button"
            onClick={() => { setDirection("json-to-xml"); setOutput(""); setError(""); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              direction === "json-to-xml"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-400"
                : "border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
            }`}
          >
            JSON to XML
          </button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            direction === "xml-to-json"
              ? 'Paste XML here, e.g. <root><item id="1">Hello</item></root>'
              : 'Paste JSON here, e.g. {"root": {"item": "Hello"}}'
          }
          rows={8}
          aria-label="Input data"
        />
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleConvert} variant="primary" disabled={!input.trim()}>
            Convert
          </Button>
          <Button onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="secondary">
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mt-6">
          <p className="font-mono text-sm">{error}</p>
        </Alert>
      )}

      {output && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {direction === "xml-to-json" ? "JSON Output" : "XML Output"}
            </p>
            <div className="flex items-center gap-2">
              <CopyButton text={output} />
              <Button variant="secondary" size="sm" onClick={handleDownload}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="size-4"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </Button>
            </div>
          </div>
          <pre className="max-h-96 overflow-x-auto p-5 font-mono text-sm leading-5 text-zinc-900 dark:text-zinc-50">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
