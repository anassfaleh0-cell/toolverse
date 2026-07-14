"use client";

import { useState, useMemo } from "react";
import { Textarea, Button } from "@/components/ui";

type DiffLineType = "unchanged" | "added" | "removed";

interface DiffLine {
  type: DiffLineType;
  content: string;
  lineNumA: number | null;
  lineNumB: number | null;
}

function computeLcs(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

function backtrack(
  dp: number[][],
  a: string[],
  b: string[],
  i: number,
  j: number,
): DiffLine[] {
  const result: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: "unchanged", content: a[i - 1], lineNumA: i, lineNumB: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "added", content: b[j - 1], lineNumA: null, lineNumB: j });
      j--;
    } else {
      result.unshift({ type: "removed", content: a[i - 1], lineNumA: i, lineNumB: null });
      i--;
    }
  }
  return result;
}

function computeDiff(original: string, modified: string): DiffLine[] {
  const linesA = original.split("\n");
  const linesB = modified.split("\n");
  const dp = computeLcs(linesA, linesB);
  return backtrack(dp, linesA, linesB, linesA.length, linesB.length);
}

const typeStyles: Record<DiffLineType, string> = {
  unchanged: "bg-transparent",
  added: "bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500",
  removed: "bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500",
};

const typePrefix: Record<DiffLineType, string> = {
  unchanged: " ",
  added: "+",
  removed: "-",
};

const typePrefixColor: Record<DiffLineType, string> = {
  unchanged: "text-zinc-400 dark:text-zinc-600",
  added: "text-green-700 dark:text-green-400",
  removed: "text-red-600 dark:text-red-400",
};

export function TextDiffChecker() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [compared, setCompared] = useState(false);

  const diff = useMemo(() => {
    if (!compared) return [];
    return computeDiff(original, modified);
  }, [original, modified, compared]);

  function handleCompare() {
    setCompared(true);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Original Text</label>
          <Textarea
            value={original}
            onChange={(e) => { setOriginal(e.target.value); setCompared(false); }}
            placeholder="Paste the original text here..."
            rows={10}
            aria-label="Original text"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Modified Text</label>
          <Textarea
            value={modified}
            onChange={(e) => { setModified(e.target.value); setCompared(false); }}
            placeholder="Paste the modified text here..."
            rows={10}
            aria-label="Modified text"
          />
        </div>
      </div>

      <div className="mt-4">
        <Button onClick={handleCompare} variant="primary" disabled={!original.trim() && !modified.trim()}>
          Compare
        </Button>
      </div>

      {compared && diff.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Diff Results
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="inline-block size-3 rounded bg-green-50 dark:bg-green-950/30" />
                Added ({diff.filter((l) => l.type === "added").length})
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block size-3 rounded bg-red-50 dark:bg-red-950/30" />
                Removed ({diff.filter((l) => l.type === "removed").length})
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block size-3 rounded bg-zinc-100 dark:bg-zinc-800" />
                Unchanged ({diff.filter((l) => l.type === "unchanged").length})
              </span>
            </div>
          </div>
          <div className="overflow-x-auto font-mono text-sm">
            {diff.map((line, i) => (
              <div key={i} className={`flex items-stretch ${typeStyles[line.type]}`}>
                <div className={`flex w-8 shrink-0 items-center justify-center border-r border-zinc-200 py-1 text-xs dark:border-zinc-700 ${typePrefixColor[line.type]}`}>
                  {line.type === "added"
                    ? (line.lineNumB ?? "")
                    : line.type === "removed"
                      ? (line.lineNumA ?? "")
                      : (line.lineNumA ?? "")}
                </div>
                <div className={`w-6 shrink-0 py-1 text-center text-xs ${typePrefixColor[line.type]}`}>
                  {typePrefix[line.type]}
                </div>
                <div className={`flex-1 py-1 pr-4 ${line.type === "added" ? "text-green-700 dark:text-green-300" : line.type === "removed" ? "text-red-700 dark:text-red-300" : "text-zinc-900 dark:text-zinc-50"}`}>
                  {line.content || " "}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
