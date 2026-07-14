"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui";
import { PdfToolShell, ProgressBar } from "./pdf-tool-shell";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

type QualityLevel = "standard" | "formatted" | "images";

export function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [result, setResult] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<QualityLevel>("formatted");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function convertPdf(f: File) {
    setFile(f);
    setResult(null);
    setThumbnails([]);
    setError(null);
    setLoading(true);
    setProgress(0);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();

      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const extractedTexts: string[] = [];
      const thumbs: string[] = [];
      const offscreen = document.createElement("canvas");

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          .filter((item): item is TextItem => "str" in item)
          .map((item) => item.str)
          .join(" ");
        extractedTexts.push(text);

        const viewport = page.getViewport({ scale: 0.3 });
        offscreen.width = viewport.width;
        offscreen.height = viewport.height;
        const ctx = offscreen.getContext("2d")!;
        await page.render({ canvas: offscreen, viewport } as never).promise;
        thumbs.push(offscreen.toDataURL("image/jpeg", 0.5));

        setProgress(Math.round((i / numPages) * 100));
      }

      setThumbnails(thumbs);
      const docxBlob = await createDocx(f.name, extractedTexts, quality);
      setResult(docxBlob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert PDF");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  }

  async function createDocx(
    fileName: string,
    texts: string[],
    _quality: QualityLevel,
  ): Promise<Blob> {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");

    const children = texts.flatMap((text, i) => [
      new Paragraph({
        children: [
          new TextRun({
            text: `Page ${i + 1}`,
            bold: true,
            size: 28,
            font: "Calibri",
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: text || "(No extractable text on this page)",
            size: 22,
            font: "Calibri",
          }),
        ],
        spacing: { after: 300 },
        alignment: AlignmentType.JUSTIFIED,
      }),
    ]);

    const doc = new Document({
      title: fileName.replace(/\.pdf$/i, ""),
      description: "Converted from PDF",
      creator: "Nuvora PDF to Word",
      sections: [{ children }],
    });

    const blob = await Packer.toBlob(doc);
    return blob;
  }

  function handleDownload() {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.name.replace(/\.pdf$/i, "")}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!file) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <PdfToolShell
          accept="application/pdf"
          onFilesChange={(files) => {
            if (files.length > 0) convertPdf(files[0].file);
          }}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        <svg className="size-5 text-zinc-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{file.name}</span>
        <span className="text-xs text-zinc-500">({(file.size / 1024).toFixed(1)} KB)</span>
        <Button variant="secondary" size="sm" className="ml-auto" onClick={() => { setFile(null); setResult(null); setThumbnails([]); }}>Change File</Button>
      </div>

      {!loading && !result && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Output Quality</label>
            <div className="flex gap-2">
              {(["standard", "formatted", "images"] as QualityLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setQuality(level)}
                  className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                    quality === level
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/20 dark:text-blue-300"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {level === "standard" ? "Standard Text" : level === "formatted" ? "Formatted" : "With Images"}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={() => convertPdf(file)}>Convert to Word</Button>
        </div>
      )}

      {loading && (
        <div className="space-y-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Converting pages...</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
          <p className="text-xs text-zinc-600">Extracting text and generating document</p>
        </div>
      )}

      {thumbnails.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Conversion Complete</p>
              <p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">{thumbnails.length} pages</p>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleDownload}>Download .docx</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4">
            {thumbnails.map((thumb, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                <img src={thumb} alt={`Page ${i + 1}`} className="w-full object-cover" />
                <div className="border-t border-zinc-200 bg-zinc-50 px-2 py-1 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                  Page {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400" role="alert">{error}</div>
      )}
    </div>
  );
}
