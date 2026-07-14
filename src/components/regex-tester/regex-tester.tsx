"use client";

import React, { useState, useMemo } from "react";
import { Input, Textarea, Button, Alert } from "@/components/ui";
import { CopyButton, Icon } from "@/components/shared";

const allFlags = [
  { id: "g", label: "g", description: "Global" },
  { id: "i", label: "i", description: "Case insensitive" },
  { id: "m", label: "m", description: "Multiline" },
  { id: "s", label: "s", description: "Dot all" },
  { id: "u", label: "u", description: "Unicode" },
  { id: "y", label: "y", description: "Sticky" },
];

const commonPatterns = [
  { label: "Email", pattern: "[\\w.-]+@[\\w.-]+\\.\\w{2,}" },
  { label: "URL", pattern: "https?://[\\w./-]+" },
  { label: "IPv4", pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
  { label: "Phone (US)", pattern: "\\d{3}[-.]?\\d{3}[-.]?\\d{4}" },
  { label: "UUID", pattern: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" },
];

interface MatchResult {
  full: string;
  groups: (string | undefined)[];
  index: number;
}

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<Set<string>>(new Set(["g"]));
  const [testText, setTestText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [showPatterns, setShowPatterns] = useState(false);

  function toggleFlag(flag: string) {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) {
        next.delete(flag);
      } else {
        next.add(flag);
      }
      return next;
    });
  }

  const { matches, error } = useMemo(() => {
    if (!pattern.trim() || !testText) return { matches: [] as MatchResult[], error: "" };
    try {
      const flagStr = Array.from(flags).join("");
      const regex = new RegExp(pattern, flagStr.includes("g") ? flagStr : flagStr + "g");
      const results: MatchResult[] = [];
      let match: RegExpExecArray | null;
      while ((match = regex.exec(testText)) !== null) {
        results.push({
          full: match[0],
          groups: Array.from(match).slice(1),
          index: match.index,
        });
        if (match.index === regex.lastIndex) regex.lastIndex++;
      }
      return { matches: results, error: "" };
    } catch (e) {
      return { matches: [], error: e instanceof Error ? e.message : "Invalid regex pattern" };
    }
  }, [pattern, flags, testText]);

  const replacedResult = useMemo(() => {
    if (!pattern.trim() || !testText || !replaceText) return "";
    try {
      const flagStr = Array.from(flags).join("");
      const regex = new RegExp(pattern, flagStr);
      return testText.replace(regex, replaceText);
    } catch {
      return "";
    }
  }, [pattern, flags, testText, replaceText]);

  function handleClear() {
    setPattern("");
    setTestText("");
    setReplaceText("");
  }

  function createTSV(): string {
    const header = "Index\tMatch\tGroups";
    const rows = matches.map((m) => {
      const matchStr = m.full.replace(/\t/g, " ").replace(/\n/g, " ");
      const groupsStr = m.groups
        .filter((g): g is string => g !== undefined)
        .map((g) => g.replace(/\t/g, " ").replace(/\n/g, " "))
        .join(", ");
      return `${m.index}\t${matchStr}\t${groupsStr}`;
    });
    return [header, ...rows].join("\n");
  }

  const isValid = pattern.trim() && !error;
  const isInvalid = pattern.trim() && error;

  function highlightMatches(text: string, matchList: MatchResult[]): React.ReactNode[] {
    if (!matchList.length) return [<span key="0">{text}</span>];
    const sorted = [...matchList].sort((a, b) => a.index - b.index);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    sorted.forEach((m, i) => {
      if (m.index > lastIndex) {
        elements.push(<span key={`t${i}`}>{text.slice(lastIndex, m.index)}</span>);
      }
      elements.push(
        <mark key={`m${i}`} className="rounded bg-yellow-200 px-0.5 text-zinc-900 dark:bg-yellow-700 dark:text-zinc-50">
          {m.full}
        </mark>
      );
      lastIndex = m.index + m.full.length;
    });
    if (lastIndex < text.length) {
      elements.push(<span key="end">{text.slice(lastIndex)}</span>);
    }
    return elements;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <div className="relative">
          <Input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern (e.g. \d+)"
            aria-label="Regex pattern"
            className={isInvalid ? "border-red-500 pr-10" : isValid ? "border-green-500 pr-10" : ""}
          />
          {pattern.trim() && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              {isValid ? (
                <Icon name="Check" className="size-5 text-green-500" aria-label="Valid pattern" />
              ) : (
                <Icon name="X" className="size-5 text-red-500" aria-label="Invalid pattern" />
              )}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {allFlags.map((f) => (
            <label
              key={f.id}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              <input
                type="checkbox"
                checked={flags.has(f.id)}
                onChange={() => toggleFlag(f.id)}
                className="h-3.5 w-3.5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700"
              />
              <span className="text-zinc-700 dark:text-zinc-300">{f.label}</span>
              <span className="text-zinc-400 dark:text-zinc-500">({f.description})</span>
            </label>
          ))}
        </div>
        <Textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Enter test text here..."
          rows={8}
          aria-label="Test text"
        />
        <Input
          type="text"
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
          placeholder="Replacement string (use $1, $2, etc. for capture groups)"
          aria-label="Replace text"
        />
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleClear} variant="secondary">
            Clear
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowPatterns(!showPatterns)}
          type="button"
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <Icon name="ChevronRight" className={`size-4 transition-transform ${showPatterns ? "rotate-90" : ""}`} />
          Common Patterns
        </button>
        {showPatterns && (
          <div className="mt-2 flex flex-wrap gap-2">
            {commonPatterns.map((cp) => (
              <Button
                key={cp.label}
                variant="secondary"
                size="sm"
                onClick={() => setPattern(cp.pattern)}
              >
                {cp.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <Alert variant="error" className="mt-6">
          <p className="font-mono">{error}</p>
        </Alert>
      )}

      {pattern.trim() && testText && !error && (
        <div className="mt-6 space-y-4">
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Matches ({matches.length})
              </p>
              <div className="flex gap-2">
                {matches.length > 0 && (
                  <CopyButton text={createTSV()} label="Copy All Matches" />
                )}
                <CopyButton text={JSON.stringify(matches.map((m) => ({ match: m.full, index: m.index, groups: m.groups.filter(Boolean) })), null, 2)} label="Copy JSON" />
              </div>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed text-zinc-900 dark:text-zinc-50">
              {highlightMatches(testText, matches)}
            </div>
          </div>

          {matches.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Match Details</p>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {matches.map((m, i) => (
                  <div key={i} className="px-5 py-3 text-sm even:bg-zinc-50 dark:even:bg-zinc-900/50">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      #{i + 1} &mdash; Index {m.index}: &ldquo;{m.full}&rdquo;
                    </p>
                    {m.groups.some((g) => g !== undefined) && (
                      <div className="mt-1 space-y-0.5">
                        {m.groups.map((g, gi) =>
                          g !== undefined ? (
                            <p key={gi} className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                              Group {gi + 1}: &ldquo;{g}&rdquo;
                            </p>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {matches.length > 0 && replaceText && (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Replace Result</p>
                <CopyButton text={replacedResult} label="Copy" />
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed text-zinc-900 dark:text-zinc-50">
                {replacedResult || <span className="text-zinc-400 dark:text-zinc-600">No matches found</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
