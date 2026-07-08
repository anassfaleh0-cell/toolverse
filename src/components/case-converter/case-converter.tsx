"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function toCamelCase(str: string): string {
  const words = str.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  return words[0].toLowerCase() + words.slice(1).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("");
}

function toPascalCase(str: string): string {
  const words = str.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("");
}

function toSnakeCase(str: string): string {
  const words = str.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  return words.map((w) => w.toLowerCase()).join("_");
}

function toKebabCase(str: string): string {
  const words = str.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  return words.map((w) => w.toLowerCase()).join("-");
}

function toUpperCase(str: string): string {
  const cleaned = str.replace(/[^a-zA-Z0-9]+/g, " ").trim();
  if (!cleaned) return "";
  return cleaned.toUpperCase();
}

function toLowerCase(str: string): string {
  const cleaned = str.replace(/[^a-zA-Z0-9]+/g, " ").trim();
  if (!cleaned) return "";
  return cleaned.toLowerCase();
}

function toTitleCase(str: string): string {
  const words = str.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function toDotCase(str: string): string {
  const words = str.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  return words.map((w) => w.toLowerCase()).join(".");
}

function toPathCase(str: string): string {
  const words = str.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  return words.map((w) => w.toLowerCase()).join("/");
}

function toTrainCase(str: string): string {
  const words = str.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return "";
  return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("-");
}

interface CaseResult {
  label: string;
  value: string;
}

function computeResults(input: string): CaseResult[] {
  return [
    { label: "camelCase", value: toCamelCase(input) },
    { label: "PascalCase", value: toPascalCase(input) },
    { label: "snake_case", value: toSnakeCase(input) },
    { label: "kebab-case", value: toKebabCase(input) },
    { label: "UPPER CASE", value: toUpperCase(input) },
    { label: "lower case", value: toLowerCase(input) },
    { label: "Title Case", value: toTitleCase(input) },
    { label: "dot.case", value: toDotCase(input) },
    { label: "path/case", value: toPathCase(input) },
    { label: "Train-Case", value: toTrainCase(input) },
  ];
}

export function CaseConverter() {
  const [input, setInput] = useState("");

  const results = computeResults(input);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text to convert between cases..."
          rows={4}
          aria-label="Text input"
        />
      </div>

      {input.trim() && (
        <div className="mt-6 space-y-3">
          {results.filter((r) => r.value).map((r) => (
            <div key={r.label} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{r.label}</p>
                <CopyButton text={r.value} />
              </div>
              <pre className="overflow-x-auto break-all p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{r.value}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
