"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui";

interface ImageMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  lastModified: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export function ImageMetadataViewer() {
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const g = gcd(img.naturalWidth, img.naturalHeight);
        setMetadata({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          lastModified: new Date(file.lastModified).toISOString().replace("T", " ").substring(0, 19),
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: `${img.naturalWidth / g}:${img.naturalHeight / g}`,
        });
        setPreviewUrl(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-5">
        {!metadata ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mb-3 size-10 text-zinc-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop an image or click to view metadata</p>
            <p className="mt-1 text-xs text-zinc-400">EXIF data is read entirely in-browser</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              {previewUrl && <img loading="lazy" decoding="async" src={previewUrl} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />}
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{metadata.fileName}</p>
                <p className="text-xs text-zinc-500">{formatBytes(metadata.fileSize)}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => { setMetadata(null); setPreviewUrl(null); }}>
                Clear
              </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Metadata</p>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {[
                  { label: "File Name", value: metadata.fileName },
                  { label: "File Size", value: formatBytes(metadata.fileSize) },
                  { label: "File Type", value: metadata.fileType },
                  { label: "Last Modified", value: metadata.lastModified },
                  { label: "Dimensions", value: `${metadata.width} x ${metadata.height} px` },
                  { label: "Aspect Ratio", value: metadata.aspectRatio },
                  { label: "Megapixels", value: `${(metadata.width * metadata.height / 1000000).toFixed(2)} MP` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">{row.label}</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <p className="font-medium">Note:</p>
              <p className="mt-1">Full EXIF data (camera model, GPS location, exposure settings) is only available via the FileReader API. For comprehensive EXIF parsing, integrate a library like <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">exifr</code> or <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">exif-js</code>. This tool provides all metadata accessible through the browser&apos;s native Image and File APIs.</p>
            </div>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
    </div>
  );
}
