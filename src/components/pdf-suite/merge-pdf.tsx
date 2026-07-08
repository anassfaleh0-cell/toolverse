"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";

export function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleMerge() {
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const indices = pdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(pdf, indices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      setResult(pdfBytes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to merge PDFs");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([result.slice(0)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "merged.pdf";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []).slice(0, 10);
    setFiles(selectedFiles);
    setResult(null);
    setError(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles].slice(0, 10));
      setResult(null);
      setError(null);
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-3xl">
      {files.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
          aria-label="Upload PDF files to merge"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-12 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          <svg className="mb-3 size-10 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop PDFs here or click to upload</p>
          <p className="mt-1 text-xs text-zinc-400">Supports up to 10 PDF files</p>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="application/pdf" multiple className="hidden" onChange={handleFileChange} aria-label="Select PDF files" />

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{file.name}</span>
              <span className="text-xs text-zinc-500">({(file.size / 1024).toFixed(1)} KB)</span>
              <Button variant="secondary" size="sm" className="ml-auto" onClick={() => removeFile(i)} aria-label={`Remove ${file.name}`}>Remove</Button>
            </div>
          ))}
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>Add More</Button>
            <Button onClick={handleMerge} disabled={loading || files.length < 2}>
              {loading ? "Merging..." : `Merge ${files.length} PDFs`}
            </Button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Merged PDF Ready</p>
            <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}
