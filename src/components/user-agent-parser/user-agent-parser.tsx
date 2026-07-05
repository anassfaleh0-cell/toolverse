"use client";

import { useState, useEffect, useRef } from "react";
import { UAParser } from "ua-parser-js";

interface ParsedResult {
  ua: string;
  browser: { name?: string; version?: string; major?: string };
  engine: { name?: string; version?: string };
  os: { name?: string; version?: string };
  device: { vendor?: string; model?: string; type?: string };
  cpu: { architecture?: string };
}

export function UserAgentParser() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ParsedResult | null>(null);
  const initialParsed = useRef(false);

  useEffect(() => {
    if (initialParsed.current) return;
    initialParsed.current = true;
    const parser = new UAParser();
    setResult(parser.getResult() as ParsedResult);
    setInput(navigator.userAgent);
  }, []);

  function handleParse() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const parser = new UAParser(trimmed);
    setResult(parser.getResult() as ParsedResult);
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  const rows: { label: string; value: string }[] = [];
  if (result) {
    rows.push(
      ...(result.browser.name ? [{ label: "Browser", value: `${result.browser.name} ${result.browser.version || ""}` }] : []),
      ...(result.browser.major ? [{ label: "Browser Major", value: result.browser.major }] : []),
      ...(result.engine.name ? [{ label: "Engine", value: `${result.engine.name} ${result.engine.version || ""}` }] : []),
      ...(result.os.name ? [{ label: "Operating System", value: `${result.os.name} ${result.os.version || ""}` }] : []),
      ...(result.device.vendor ? [{ label: "Device Vendor", value: result.device.vendor }] : []),
      ...(result.device.model ? [{ label: "Device Model", value: result.device.model }] : []),
      ...(result.device.type ? [{ label: "Device Type", value: result.device.type }] : []),
      ...(result.cpu.architecture ? [{ label: "CPU Architecture", value: result.cpu.architecture }] : []),
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a User-Agent string here..."
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          aria-label="User-Agent string"
        />
        <button
          onClick={handleParse}
          disabled={!input.trim()}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          Parse
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          Clear
        </button>
      </div>

      {result && (
        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Parsed User-Agent
            </p>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {row.label}
                </span>
                <span className="break-words text-zinc-600 dark:text-zinc-400">
                  {row.value}
                </span>
              </div>
            ))}
            <div className="px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                Raw String
              </span>
              <p className="mt-1 break-words font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {result.ua}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
