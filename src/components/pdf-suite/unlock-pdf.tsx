"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";

export function UnlockPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notEncrypted, setNotEncrypted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLoad(f: File) {
    setFile(f);
    setResult(null);
    setError(null);
    setNotEncrypted(false);
    const arrayBuffer = await f.arrayBuffer();
    const { isEncrypted } = await import("@pdfsmaller/pdf-decrypt");
    const info = await isEncrypted(new Uint8Array(arrayBuffer));
    if (!info.encrypted) {
      setNotEncrypted(true);
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

  async function handleUnlock() {
    if (!file || !password) return;
    setLoading(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { decryptPDF } = await import("@pdfsmaller/pdf-decrypt");
      const decryptedBytes = await decryptPDF(new Uint8Array(arrayBuffer), password);
      setResult(decryptedBytes);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to unlock PDF";
      if (msg.includes("password") || msg.includes("decrypt")) {
        setError("Incorrect password. The PDF could not be decrypted.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([new Uint8Array(result)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `unlocked-${file?.name || "output.pdf"}`;
    link.click();
    URL.revokeObjectURL(url);
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
          aria-label="Upload a password-protected PDF"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-12 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          <svg className="mb-3 size-10 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop a password-protected PDF here or click to upload</p>
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} aria-label="Select protected PDF" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        <svg className="size-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{file.name}</span>
        <Button variant="secondary" size="sm" className="ml-auto" onClick={() => { setFile(null); setResult(null); setPassword(""); }}>Change File</Button>
      </div>

      {notEncrypted && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400" role="alert">
          This PDF is not password-protected. No unlocking needed.
        </div>
      )}

      <div>
        <label htmlFor="pdf-password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Document Password</label>
        <div className="mt-1 flex gap-3">
          <Input
            id="pdf-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={notEncrypted ? "No password needed" : "Enter the PDF password"}
            className="flex-1"
          />
          <Button onClick={handleUnlock} disabled={loading || (!password && !notEncrypted)}>
            {loading ? "Unlocking..." : "Unlock"}
          </Button>
        </div>
      </div>

      {result && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-green-700 dark:text-green-400">
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              Unlocked PDF Ready
            </p>
            <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}
