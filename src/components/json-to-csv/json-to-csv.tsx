"use client";

import { useState, useCallback } from "react";
import { Textarea, Button, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";

type Direction = "json-to-csv" | "csv-to-json";

function jsonToCsv(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";
  const headers = Array.from(new Set(data.flatMap(Object.keys)));
  const escape = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };
  const rows = [headers.map(escape).join(",")];
  for (const row of data) {
    rows.push(headers.map((h) => escape(String(row[h] ?? ""))).join(","));
  }
  return rows.join("\n");
}

function csvToJson(csv: string): Record<string, string>[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          result.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
    }
    result.push(current);
    return result;
  };
  const headers = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h.trim()] = (values[i] ?? "").trim(); });
    return obj;
  });
}

export function JsonToCsvConverter() {
  const [direction, setDirection] = useState<Direction>("json-to-csv");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy CSV");

  const handleConvert = useCallback(() => {
    setError("");
    setOutput("");
    setPreviewData([]);
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please enter input data");
      return;
    }
    try {
      if (direction === "json-to-csv") {
        const parsed = JSON.parse(trimmed);
        if (!Array.isArray(parsed) || parsed.length === 0 || typeof parsed[0] !== "object") {
          setError("JSON must be an array of objects (e.g. [{ \"key\": \"value\" }])");
          return;
        }
        const csv = jsonToCsv(parsed as Record<string, unknown>[]);
        setOutput(csv);
        setPreviewData(csvToJson(csv));
      } else {
        const json = csvToJson(trimmed);
        if (json.length === 0) {
          setError("CSV must have at least a header row and one data row");
          return;
        }
        const formatted = JSON.stringify(json, null, 2);
        setOutput(formatted);
        setPreviewData(json);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    }
  }, [direction, input]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const ext = direction === "json-to-csv" ? "csv" : "json";
    const mime = direction === "json-to-csv" ? "text/csv" : "application/json";
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, direction]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopyLabel("Copied!");
    setTimeout(() => setCopyLabel(direction === "json-to-csv" ? "Copy CSV" : "Copy JSON"), 2000);
  }, [output, direction]);

  const headers = previewData.length > 0 ? Object.keys(previewData[0]) : [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex gap-2">
        <Button
          variant={direction === "json-to-csv" ? "primary" : "secondary"}
          onClick={() => { setDirection("json-to-csv"); setOutput(""); setPreviewData([]); setError(""); }}
        >
          JSON → CSV
        </Button>
        <Button
          variant={direction === "csv-to-json" ? "primary" : "secondary"}
          onClick={() => { setDirection("csv-to-json"); setOutput(""); setPreviewData([]); setError(""); }}
        >
          CSV → JSON
        </Button>
      </div>

      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            direction === "json-to-csv"
              ? '[{ "name": "Alice", "age": 30 }, { "name": "Bob", "age": 25 }]'
              : 'name,age\nAlice,30\nBob,25'
          }
          rows={8}
          aria-label="Input data"
        />
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleConvert} variant="primary" disabled={!input.trim()}>
            Convert
          </Button>
          {output && (
            <>
              <Button variant="secondary" onClick={handleCopy}>
                {copyLabel}
              </Button>
              <Button variant="secondary" onClick={handleDownload}>
                Download {direction === "json-to-csv" ? "CSV" : "JSON"}
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mt-4">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      {previewData.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Preview ({previewData.length} rows)
            </p>
            {direction === "json-to-csv" && output && <CopyButton text={output} label="Copy CSV" />}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                  {headers.map((h) => (
                    <th key={h} className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {previewData.map((row, i) => (
                  <tr key={i} className="even:bg-zinc-50 dark:even:bg-zinc-900/50">
                    {headers.map((h) => (
                      <td key={h} className="px-4 py-2 text-zinc-900 dark:text-zinc-50">
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
