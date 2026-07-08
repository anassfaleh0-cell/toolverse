"use client";

import { useState, useCallback } from "react";
import { Textarea, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "IS", "NULL",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
  "CREATE", "TABLE", "ALTER", "DROP", "INDEX", "VIEW",
  "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "CROSS", "FULL",
  "ON", "AS", "LIKE", "BETWEEN", "EXISTS", "UNION", "ALL",
  "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET",
  "DISTINCT", "COUNT", "SUM", "AVG", "MIN", "MAX",
  "CASE", "WHEN", "THEN", "ELSE", "END",
  "HAVING", "ASC", "DESC",
];

const MAJOR_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES",
  "UPDATE", "SET", "DELETE", "CREATE", "ALTER", "DROP",
  "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN",
  "CROSS JOIN", "FULL JOIN", "ON", "ORDER BY", "GROUP BY",
  "HAVING", "LIMIT", "UNION", "ALL",
];

function tokenize(sql: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inString = false;
  let stringChar = "";
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (inString) {
      current += ch;
      if (ch === stringChar && (i === 0 || sql[i - 1] !== "\\")) {
        tokens.push(current);
        current = "";
        inString = false;
      }
    } else if (ch === "'" || ch === '"') {
      if (current.trim()) tokens.push(current.trim());
      current = ch;
      inString = true;
      stringChar = ch;
    } else if (/[\s,()]/.test(ch)) {
      if (current.trim()) tokens.push(current.trim());
      current = "";
      if (/[()]/.test(ch)) tokens.push(ch);
    } else {
      current += ch;
    }
  }
  if (current.trim()) tokens.push(current.trim());
  return tokens;
}

function formatSql(sql: string): string {
  const tokens = tokenize(sql);
  const result: string[] = [];
  let indent = 0;
  const indentStr = "  ";

  for (let i = 0; i < tokens.length; i++) {
    const upper = tokens[i].toUpperCase();
    const isMajor = MAJOR_KEYWORDS.some((kw) => kw.toUpperCase() === upper);
    const isOpenParen = tokens[i] === "(";
    const isCloseParen = tokens[i] === ")";

    if (isCloseParen) {
      indent = Math.max(0, indent - 1);
      result.push(`${indentStr.repeat(indent)}${tokens[i]}`);
      continue;
    }

    if (isMajor) {
      if (result.length > 0) result.push("");
      result.push(`${indentStr.repeat(indent)}${upper}`);
      continue;
    }

    if (isOpenParen) {
      result[result.length - 1] += " (";
      indent++;
      continue;
    }

    if (upper === "AND" || upper === "OR") {
      result.push(`${indentStr.repeat(indent + 1)}${upper}`);
      continue;
    }

    if (result.length === 0) {
      result.push(tokens[i]);
    } else {
      result[result.length - 1] += ` ${tokens[i]}`;
    }
  }

  return result.join("\n");
}

function minifySql(sql: string): string {
  return sql
    .replace(/\s+/g, " ")
    .replace(/\s*([(),])\s*/g, "$1 ")
    .replace(/\s*;\s*/g, "; ")
    .replace(/\s+'/g, "'")
    .replace(/'\s+/g, "'")
    .trim();
}

function capitalizeKeywords(sql: string): string {
  const tokens = tokenize(sql);
  return tokens
    .map((t) => {
      const upper = t.toUpperCase();
      const isKw = KEYWORDS.some((kw) => kw === upper);
      return isKw ? upper : t;
    })
    .join(" ");
}

export function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleFormat = useCallback(() => {
    const normalized = capitalizeKeywords(input);
    setOutput(formatSql(normalized));
  }, [input]);

  const handleMinify = useCallback(() => {
    setOutput(capitalizeKeywords(minifySql(input)));
  }, [input]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SELECT * FROM users WHERE id = 1"
          rows={8}
          aria-label="SQL input"
          className="font-mono text-sm"
        />
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleFormat} variant="primary" disabled={!input.trim()}>
            Format SQL
          </Button>
          <Button onClick={handleMinify} variant="primary" disabled={!input.trim()}>
            Minify
          </Button>
        </div>
      </div>

      {output && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Formatted SQL
            </p>
            <CopyButton text={output} />
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-sm leading-6 text-zinc-900 dark:text-zinc-50">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
