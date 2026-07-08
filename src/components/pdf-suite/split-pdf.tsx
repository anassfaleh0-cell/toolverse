"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";

export function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<"all" | "ranges" | "every">("all");
  const [ranges, setRanges] = useState("");
  const [everyN, setEveryN] = useState(2);
  const [result, setResult] = useState<{ name: string; data: Uint8Array }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLoad(file: File) {
    setFile(file);
    setResult(null);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load PDF");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleLoad(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f?.type === "application/pdf") handleLoad(f);
  }

  function parseRanges(): number[][] {
    const result: number[][] = [];
    const parts = ranges.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map((s) => parseInt(s.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) result.push([start, end]);
      } else {
        const num = parseInt(trimmed, 10);
        if (!isNaN(num)) result.push([num, num]);
      }
    }
    return result;
  }

  function getPageSets(): number[][] {
    if (mode === "all") {
      return Array.from({ length: pageCount }, (_, i) => [i + 1, i + 1]);
    }
    if (mode === "ranges") {
      return parseRanges();
    }
    if (mode === "every") {
      const sets: number[][] = [];
      for (let i = 1; i <= pageCount; i += everyN) {
        const end = Math.min(i + everyN - 1, pageCount);
        sets.push([i, end]);
      }
      return sets;
    }
    return [];
  }

  async function handleSplit() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const JSZip = (await import("jszip")).default;
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const pageSets = getPageSets();
      const results: { name: string; data: Uint8Array }[] = [];

      for (const [start, end] of pageSets) {
        if (start < 1 || end > pageCount || start > end) continue;
        const newPdf = await PDFDocument.create();
        const indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
        const copiedPages = await newPdf.copyPages(sourcePdf, indices);
        copiedPages.forEach((page) => newPdf.addPage(page));
        const bytes = await newPdf.save();
        const label = start === end ? `page-${start}` : `pages-${start}-to-${end}`;
        results.push({ name: `${label}.pdf`, data: bytes });
      }

      if (results.length === 1) {
        setResult(results);
      } else {
        const zip = new JSZip();
        for (const r of results) {
          zip.file(r.name, r.data);
        }
        const zipBlob = await zip.generateAsync({ type: "uint8array" });
        setResult([{ name: `${file.name.replace(/\.pdf$/i, "")}-split.zip`, data: zipBlob }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to split PDF");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!result || result.length === 0) return;
    for (const r of result) {
      const blob = new Blob([r.data.slice(0)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = r.name || `page-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  if (!file) {
    return (
      <div className="mx-auto max-w-3xl">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
          aria-label="Upload a PDF to split"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-12 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          <svg className="mb-3 size-10 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop a PDF here or click to upload</p>
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} aria-label="Select PDF to split" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        <svg className="size-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{file.name}</span>
        <span className="text-xs text-zinc-500">{pageCount} pages</span>
        <Button variant="secondary" size="sm" className="ml-auto" onClick={() => { setFile(null); setResult(null); }}>Change File</Button>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Split Mode</label>
        <div className="flex flex-wrap gap-3">
          <Button variant={mode === "all" ? "primary" : "secondary"} size="sm" onClick={() => setMode("all")}>All Pages</Button>
          <Button variant={mode === "ranges" ? "primary" : "secondary"} size="sm" onClick={() => setMode("ranges")}>Page Ranges</Button>
          <Button variant={mode === "every" ? "primary" : "secondary"} size="sm" onClick={() => setMode("every")}>Every N Pages</Button>
        </div>

        {mode === "ranges" && (
          <div>
            <label htmlFor="ranges" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Page ranges (e.g. 1-3,5,7-9)</label>
            <input id="ranges" type="text" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3,5,7-9" className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500" />
          </div>
        )}

        {mode === "every" && (
          <div>
            <label htmlFor="everyN" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Split every N pages</label>
            <input id="everyN" type="number" min={1} max={pageCount} value={everyN} onChange={(e) => setEveryN(Math.max(1, parseInt(e.target.value) || 1))} className="mt-1 w-32 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50" />
          </div>
        )}
      </div>

      <Button onClick={handleSplit} disabled={loading}>
        {loading ? "Splitting..." : `Split PDF (${pageCount} pages)`}
      </Button>

      {result && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{result.length === 1 && result[0].name.endsWith(".zip") ? "ZIP Archive Ready" : "Split Files Ready"}</p>
            <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
          </div>
          <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
            Created {result.length} file{result.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}
