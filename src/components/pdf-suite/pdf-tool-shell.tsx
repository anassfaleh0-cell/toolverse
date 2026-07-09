"use client";

import { useState, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface FileEntry {
  file: File;
  id: string;
  status: "idle" | "processing" | "done" | "error";
  progress: number;
  error?: string;
  result?: Uint8Array;
}

interface PdfToolShellProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  renderToolbar?: (files: FileEntry[]) => ReactNode;
  renderResult?: (file: FileEntry, index: number) => ReactNode;
  onFilesChange?: (files: FileEntry[]) => void;
  children?: ReactNode;
}

let fileIdCounter = 0;

export function PdfToolShell({
  accept = "application/pdf",
  multiple = false,
  maxFiles = 10,
  renderToolbar,
  renderResult,
  onFilesChange,
  children,
}: PdfToolShellProps) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(newFiles: FileList | File[]) {
    setFiles((prev) => {
      const entries = Array.from(newFiles).map((f) => ({
        file: f,
        id: `file-${++fileIdCounter}`,
        status: "idle" as const,
        progress: 0,
      }));
      const combined = [...prev, ...entries].slice(0, maxFiles);
      onFilesChange?.(combined);
      return combined;
    });
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      onFilesChange?.(next);
      return next;
    });
  }

  function clearFiles() {
    setFiles([]);
    onFilesChange?.([]);
  }

  function updateFile(id: string, patch: Partial<FileEntry>) {
    setFiles((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...patch } : f));
      onFilesChange?.(next);
      return next;
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files;
    if (dropped.length > 0) addFiles(dropped);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (selected && selected.length > 0) addFiles(selected);
    e.target.value = "";
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {files.length === 0 ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
          aria-label="Upload files"
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors",
            dragOver
              ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/20"
              : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500",
          )}
        >
          <svg className="mb-3 size-10 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Drop {multiple ? "files" : "a file"} here or click to upload
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {accept === "application/pdf" ? "PDF files only" : accept.split(",").join(", ")}
          </p>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={cn(
            "rounded-xl border-2 border-dashed p-6 transition-colors",
            dragOver
              ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/20"
              : "border-zinc-300 dark:border-zinc-700",
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                Add Files
              </Button>
              <Button variant="ghost" size="sm" onClick={clearFiles}>
                Clear All
              </Button>
            </div>
          </div>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {files.map((entry) => (
              <li key={entry.id} className="flex items-center gap-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {entry.file.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {(entry.file.size / 1024).toFixed(1)} KB
                    {entry.status === "processing" && ` — ${entry.progress}%`}
                  </p>
                  {entry.status === "processing" && (
                    <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${entry.progress}%` }}
                      />
                    </div>
                  )}
                  {entry.status === "error" && (
                    <p className="mt-0.5 text-xs text-red-500">{entry.error}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {entry.status === "error" && (
                    <Button variant="secondary" size="sm" onClick={() => updateFile(entry.id, { status: "idle", error: undefined, progress: 0, result: undefined })}>
                      Retry
                    </Button>
                  )}
                  {entry.status === "done" && renderResult?.(entry, files.indexOf(entry))}
                  <button
                    onClick={() => removeFile(entry.id)}
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${entry.file.name}`}
                  >
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Select files"
      />

      {files.length > 0 && renderToolbar?.(files)}

      {children}

      {files.some((f) => f.status === "error") && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400" role="alert">
          Some files failed to process. Use the Retry button to try again.
        </div>
      )}
    </div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700", className)}>
      <div
        className="h-full rounded-full bg-blue-500 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
