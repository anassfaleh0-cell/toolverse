"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { PdfToolShell, ProgressBar } from "./pdf-tool-shell";

type QualityLevel = "lossless" | "high" | "medium" | "low";

interface QualityOption {
  id: QualityLevel;
  label: string;
  description: string;
  useObjectStreams: boolean;
  removeMetadata: boolean;
  linearize: boolean;
  stripUnused: boolean;
}

const QUALITY_OPTIONS: QualityOption[] = [
  { id: "lossless", label: "Lossless", description: "Minimal changes, best quality", useObjectStreams: true, removeMetadata: false, linearize: false, stripUnused: false },
  { id: "high", label: "High", description: "Good compression, minimal loss", useObjectStreams: true, removeMetadata: true, linearize: false, stripUnused: false },
  { id: "medium", label: "Medium", description: "Balanced compression", useObjectStreams: true, removeMetadata: true, linearize: true, stripUnused: false },
  { id: "low", label: "Low", description: "Maximum compression", useObjectStreams: true, removeMetadata: true, linearize: true, stripUnused: true },
];

const ESTIMATED_RATIOS: Record<QualityLevel, number> = {
  lossless: 0.92,
  high: 0.78,
  medium: 0.62,
  low: 0.45,
};

export function CompressPdf() {
  const [files, setFiles] = useState<{ file: File; id: string }[]>([]);
  const [quality, setQuality] = useState<QualityLevel>("medium");
  const [results, setResults] = useState<Map<string, { data: Uint8Array; originalSize: number; compressedSize: number }>>(new Map());
  const [loading, setLoading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [fileProgress, setFileProgress] = useState<Map<string, number>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [failedFiles, setFailedFiles] = useState<Set<string>>(new Set());

  const handleFilesChange = useCallback((entries: { file: File; id: string }[]) => {
    setFiles(entries);
    setResults(new Map());
    setFileProgress(new Map());
    setFailedFiles(new Set());
    setError(null);
  }, []);

  async function handleCompress() {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    setFailedFiles(new Set());
    setResults(new Map());
    setOverallProgress(0);

    const { PDFDocument } = await import("pdf-lib");
    const newResults = new Map<string, { data: Uint8Array; originalSize: number; compressedSize: number }>();
    const newFailed = new Set<string>();
    const total = files.length;
    let completed = 0;

    for (const entry of files) {
      try {
        setFileProgress((prev) => new Map(prev).set(entry.id, 0));

        const arrayBuffer = await entry.file.arrayBuffer();
        setFileProgress((prev) => new Map(prev).set(entry.id, 20));

        const pdf = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        });
        setFileProgress((prev) => new Map(prev).set(entry.id, 40));

        const opts = QUALITY_OPTIONS.find((q) => q.id === quality)!;

        if (opts.removeMetadata) {
          pdf.setTitle("");
          pdf.setAuthor("");
          pdf.setSubject("");
          pdf.setKeywords([]);
          pdf.setProducer("Nuvora PDF Compressor");
          pdf.setCreator("Nuvora");
        }
        setFileProgress((prev) => new Map(prev).set(entry.id, 60));

        const saveOpts: Record<string, unknown> = {
          useObjectStreams: opts.useObjectStreams,
        };
        if (opts.linearize) {
          saveOpts.addDefaultPage = false;
        }

        const rawBytes = await pdf.save(saveOpts);
      let pdfBytes = new Uint8Array(rawBytes);
        setFileProgress((prev) => new Map(prev).set(entry.id, 80));

        if (opts.stripUnused) {
          const reloaded = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
          const pages = reloaded.getPages();
          const copiedDoc = await PDFDocument.create();
          for (let i = 0; i < pages.length; i++) {
            const [copiedPage] = await copiedDoc.copyPages(reloaded, [i]);
            copiedDoc.addPage(copiedPage);
          }
          pdfBytes = new Uint8Array(await copiedDoc.save({ useObjectStreams: true }));
        }

        newResults.set(entry.id, {
          data: pdfBytes,
          originalSize: entry.file.size,
          compressedSize: pdfBytes.length,
        });
        setFileProgress((prev) => new Map(prev).set(entry.id, 100));

        completed++;
        setOverallProgress(Math.round((completed / total) * 100));
      } catch (err) {
        newFailed.add(entry.id);
        setFileProgress((prev) => new Map(prev).set(entry.id, -1));
      }
    }

    setResults(newResults);
    setFailedFiles(newFailed);
    if (newFailed.size > 0) {
      setError(`${newFailed.size} file(s) failed to compress. Use Retry on individual files.`);
    }
    setLoading(false);
  }

  function handleDownloadSingle(id: string) {
    const r = results.get(id);
    const entry = files.find((f) => f.id === id);
    if (!r || !entry) return;
    const blob = new Blob([r.data.slice(0)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed-${entry.file.name}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleDownloadAll() {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    let added = 0;

    results.forEach((r, id) => {
      const entry = files.find((f) => f.id === id);
      if (entry) {
        zip.file(`compressed-${entry.file.name}`, r.data.slice(0));
        added++;
      }
    });

    if (added === 0) return;
    zip.generateAsync({ type: "blob" }).then((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "compressed-pdfs.zip";
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  function getEstimatedSize(fileSize: number): number {
    const ratio = ESTIMATED_RATIOS[quality];
    return Math.round(fileSize * ratio);
  }

  const allDone = results.size === files.length && files.length > 0;
  const totalOriginal = files.reduce((sum, f) => sum + f.file.size, 0);
  const totalCompressed = Array.from(results.values()).reduce((sum, r) => sum + r.compressedSize, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PdfToolShell
        accept="application/pdf"
        multiple
        maxFiles={10}
        onFilesChange={handleFilesChange}
      >
        {files.length > 0 && !allDone && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Compression Level</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {QUALITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setQuality(opt.id)}
                    className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                      quality === opt.id
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/20 dark:text-blue-300"
                        : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
                    }`}
                  >
                    <span className="block font-medium">{opt.label}</span>
                    <span className="mt-0.5 block text-zinc-400 dark:text-zinc-500">{opt.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {files.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                  Size Estimates
                </div>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {files.map((entry) => {
                    const est = getEstimatedSize(entry.file.size);
                    return (
                      <div key={entry.id} className="flex items-center justify-between px-4 py-2 text-sm">
                        <span className="truncate text-zinc-700 dark:text-zinc-300">{entry.file.name}</span>
                        <span className="ml-4 shrink-0 text-zinc-500">
                          {(entry.file.size / 1024).toFixed(1)} KB → <span className="font-medium text-green-600 dark:text-green-400">~{(est / 1024).toFixed(1)} KB</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Button onClick={handleCompress} disabled={loading}>
              {loading ? "Compressing..." : `Compress ${files.length > 1 ? `All ${files.length} Files` : "PDF"}`}
            </Button>
          </div>
        )}

        {loading && (
          <div className="space-y-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Overall Progress</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{overallProgress}%</span>
            </div>
            <ProgressBar value={overallProgress} />
            <div className="space-y-1">
              {files.map((entry) => {
                const fp = fileProgress.get(entry.id) ?? 0;
                return (
                  <div key={entry.id} className="flex items-center gap-2 text-xs">
                    <span className="w-4 text-center">{fp < 0 ? "✗" : fp >= 100 ? "✓" : "..."}</span>
                    <span className="truncate text-zinc-500">{entry.file.name}</span>
                    {fp >= 0 && fp < 100 && (
                      <div className="ml-auto h-1.5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${fp}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {allDone && (
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Compression Complete</p>
                <p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">
                  {files.length} file{files.length > 1 ? "s" : ""} compressed
                  {totalOriginal > 0 && (
                    <span className="ml-2 text-green-600 dark:text-green-400">
                      ({(totalOriginal / 1024 / 1024).toFixed(2)} MB → {(totalCompressed / 1024 / 1024).toFixed(2)} MB, {Math.round((1 - totalCompressed / totalOriginal) * 100)}% reduction)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                {files.length > 1 && (
                  <Button variant="secondary" size="sm" onClick={handleDownloadAll}>
                    Download All (.zip)
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => { handleFilesChange([]); }}>
                  New Compression
                </Button>
              </div>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {files.map((entry) => {
                const r = results.get(entry.id);
                if (!r) return null;
                const reduction = (1 - r.compressedSize / r.originalSize) * 100;
                return (
                  <div key={entry.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{entry.file.name}</p>
                      <p className="text-xs text-zinc-500">
                        {(r.originalSize / 1024).toFixed(1)} KB → {(r.compressedSize / 1024).toFixed(1)} KB ({reduction.toFixed(1)}% reduction)
                      </p>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => handleDownloadSingle(entry.id)}>Download</Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PdfToolShell>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400" role="alert">{error}</div>
      )}
    </div>
  );
}
