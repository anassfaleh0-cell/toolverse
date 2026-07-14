"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";

export function ProtectPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLoad(f: File) {
    setFile(f);
    setResult(null);
    setError(null);
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

  async function handleProtect() {
    if (!file || !userPassword) return;
    if (userPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (userPassword.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt-lite");
      const encryptedBytes = await encryptPDF(new Uint8Array(arrayBuffer), userPassword);
      setResult(encryptedBytes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to protect PDF");
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
    link.download = `protected-${file?.name || "output.pdf"}`;
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
          aria-label="Upload a PDF to protect"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-12 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          <svg className="mb-3 size-10 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop a PDF here or click to upload</p>
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} aria-label="Select PDF to protect" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{file.name}</span>
        <Button variant="secondary" size="sm" className="ml-auto" onClick={() => { setFile(null); setResult(null); setUserPassword(""); setConfirmPassword(""); }}>Change File</Button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="protect-password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
          <Input
            id="protect-password"
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            placeholder="Enter a password to protect the PDF"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm Password</label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm the password"
            hasError={confirmPassword.length > 0 && confirmPassword !== userPassword}
          />
        </div>
        <Button onClick={handleProtect} disabled={loading || !userPassword || userPassword !== confirmPassword || userPassword.length < 4}>
          {loading ? "Protecting..." : "Protect PDF"}
        </Button>
      </div>

      {result && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-green-700 dark:text-green-400">
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              Protected PDF Ready
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
