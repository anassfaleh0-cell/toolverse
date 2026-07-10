"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card, Skeleton } from "@/components/ui";

export function VideoToMP3() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
      setError("");
    }
  }

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const ctx = new AudioContext();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const offlineCtx = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
      const source = offlineCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineCtx.destination);
      offlineCtx.startRendering();

      const rendered = await offlineCtx.startRendering();

      const wavBlob = await bufferToWav(rendered);
      setResult(URL.createObjectURL(wavBlob));
      ctx.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert video to audio");
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
    const totalSize = 44 + dataSize;
    const ab = new ArrayBuffer(totalSize);
    const v = new DataView(ab);

    const w = (s: string, o: number) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w("RIFF", 0); v.setUint32(4, totalSize - 8, true);
    w("WAVE", 8); w("fmt ", 12); v.setUint32(16, 16, true);
    v.setUint16(20, 1, true); v.setUint16(22, numCh, true);
    v.setUint32(24, sampleRate, true); v.setUint32(28, byteRate, true);
    v.setUint16(32, numCh * 2, true); v.setUint16(34, bitsPerSample, true);
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
        <input ref={inputRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
        {file ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setFile(null); setResult(null); }}>Remove</Button>
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto size-10"><path d="M12 16V4m0 0L8 8m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
            <p className="mt-2 text-sm font-medium">Select video file</p>
            <p className="text-xs text-zinc-400 mt-1">MP4, AVI, MOV, WebM, MKV</p>
          </button>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Extracts the audio track from your video file and converts it to a WAV audio file. The video&apos;s audio stream is decoded and saved as a high-quality audio file you can play on any device.
        </p>
      </div>

      <Button onClick={handleConvert} disabled={!file || loading} variant="primary">
        {loading ? "Converting..." : "Extract MP3 Audio"}
      </Button>

      {loading && <Skeleton count={1} columns={1} />}
      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card variant="default" className="p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Conversion complete</p>
          <audio controls className="mt-3 w-full" src={result} />
          <a href={result} download={`${file?.name?.replace(/\.[^.]+$/, "") ?? "audio"}.wav`} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Audio
          </a>
        </Card>
      )}
    </div>
  );
}
