"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card, Skeleton } from "@/components/ui";

export function AudioMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      setFiles((prev) => [...prev, ...selected]);
      setResult(null);
      setError("");
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  }

  async function handleMerge() {
    if (files.length < 2) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const ctx = new AudioContext();
      const buffers: AudioBuffer[] = [];

      for (const file of files) {
        const data = await file.arrayBuffer();
        const buf = await ctx.decodeAudioData(data);
        buffers.push(buf);
      }

      const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
      const sampleRate = buffers[0].sampleRate;
      const numCh = buffers[0].numberOfChannels;
      const merged = ctx.createBuffer(numCh, totalLength, sampleRate);

      let offset = 0;
      for (const buf of buffers) {
        for (let ch = 0; ch < Math.min(numCh, buf.numberOfChannels); ch++) {
          const data = buf.getChannelData(ch);
          merged.getChannelData(ch).set(data, offset);
        }
        offset += buf.length;
      }

      const wavBlob = await bufferToWav(merged);
      setResult(URL.createObjectURL(wavBlob));
      ctx.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to merge audio");
    } finally {
      setLoading(false);
    }
  }

  async function bufferToWav(buffer: AudioBuffer): Promise<Blob> {
    const numCh = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numCh * (bitsPerSample / 8);
    const dataSize = length * numCh * (bitsPerSample / 8);
    const headerSize = 44;
    const totalSize = headerSize + dataSize;
    const ab = new ArrayBuffer(totalSize);
    const v = new DataView(ab);

    const w = (s: string, o: number) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w("RIFF", 0); v.setUint32(4, totalSize - 8, true);
    w("WAVE", 8); w("fmt ", 12); v.setUint32(16, 16, true);
    v.setUint16(20, 1, true); v.setUint16(22, numCh, true);
    v.setUint32(24, sampleRate, true); v.setUint32(28, byteRate, true);
    v.setUint16(32, numCh * (bitsPerSample / 8), true); v.setUint16(34, bitsPerSample, true);
    w("data", 36); v.setUint32(40, dataSize, true);

    let o = 44;
    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < numCh; ch++) {
        const s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
        v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        o += 2;
      }
    }
    return new Blob([ab], { type: "audio/wav" });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
        <input ref={inputRef} type="file" accept="audio/*" multiple onChange={handleFiles} className="hidden" />
        <button onClick={() => inputRef.current?.click()} className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto size-10"><path d="M12 16V4m0 0L8 8m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
          <p className="mt-2 text-sm font-medium">Add audio files</p>
          <p className="text-xs text-zinc-400 mt-1">Select multiple files to merge</p>
        </button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-700">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{f.name}</p>
                <p className="text-xs text-zinc-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFile(i)}>Remove</Button>
            </div>
          ))}
          <p className="text-xs text-zinc-500">{files.length} file{files.length > 1 ? "s" : ""} selected</p>
        </div>
      )}

      <Button onClick={handleMerge} disabled={files.length < 2 || loading} variant="primary">
        {loading ? "Merging..." : `Merge ${files.length} Files`}
      </Button>

      {loading && <Skeleton count={1} columns={1} />}
      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card variant="default" className="p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Merge complete</p>
          <a href={result} download="merged-audio.wav" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Merged Audio
          </a>
        </Card>
      )}
    </div>
  );
}
