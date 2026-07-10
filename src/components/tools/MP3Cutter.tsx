"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card, Skeleton, Input } from "@/components/ui";

export function MP3Cutter() {
  const [file, setFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState("0");
  const [endTime, setEndTime] = useState("30");
  const [duration, setDuration] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
      setError("");
      const url = URL.createObjectURL(f);
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        setEndTime(String(Math.min(30, Math.round(audio.duration))));
      });
    }
  }

  async function handleCut() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const start = parseFloat(startTime);
      const end = parseFloat(endTime);
      if (isNaN(start) || isNaN(end) || start < 0 || end > duration || start >= end) {
        throw new Error("Invalid time range");
      }

      const arrayBuffer = await file.arrayBuffer();
      const ctx = new AudioContext();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const sampleRate = audioBuffer.sampleRate;
      const startSample = Math.round(start * sampleRate);
      const endSample = Math.round(end * sampleRate);
      const length = endSample - startSample;

      const newBuffer = ctx.createBuffer(audioBuffer.numberOfChannels, length, sampleRate);
      for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
        const data = audioBuffer.getChannelData(ch);
        newBuffer.copyToChannel(data.slice(startSample, endSample), ch);
      }

      const wavBlob = await bufferToWav(newBuffer);
      const url = URL.createObjectURL(wavBlob);
      setResult(url);
      ctx.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cut audio");
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
    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

    writeString(view, 0, "RIFF");
    view.setUint32(4, totalSize - 8, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numCh, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, numCh * (bitsPerSample / 8), true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, "data");
    view.setUint32(40, dataSize, true);

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < numCh; ch++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  }

  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
        <input ref={inputRef} type="file" accept="audio/*,.mp3" onChange={handleFile} className="hidden" />
        {file ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
            <p className="mt-1 text-sm text-zinc-500">Duration: {formatTime(duration)}</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setFile(null); setResult(null); }}>Remove</Button>
            <audio ref={audioRef} controls className="mt-4 w-full" src={URL.createObjectURL(file)} />
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto size-10"><path d="M12 16V4m0 0L8 8m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
            <p className="mt-2 text-sm font-medium">Select MP3 file</p>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Start (seconds)</label>
          <Input type="number" min={0} max={duration} step={1} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">End (seconds)</label>
          <Input type="number" min={0} max={duration} step={1} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
      </div>

      {duration > 0 && (
        <div className="relative h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div className="absolute h-full rounded-full bg-nuvora-500" style={{ left: `${(parseFloat(startTime) / duration) * 100}%`, right: `${100 - (parseFloat(endTime) / duration) * 100}%` }} />
          <div className="absolute top-0 h-full w-0.5 bg-white" style={{ left: `${(parseFloat(startTime) / duration) * 100}%` }} />
          <div className="absolute top-0 h-full w-0.5 bg-white" style={{ left: `${(parseFloat(endTime) / duration) * 100}%` }} />
        </div>
      )}

      <Button onClick={handleCut} disabled={!file || loading} variant="primary">
        {loading ? "Cutting..." : "Cut Audio"}
      </Button>

      {loading && <Skeleton count={1} columns={1} />}
      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card variant="default" className="p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Cut complete</p>
          <a href={result} download={`cut-${file?.name?.replace(/\.[^.]+$/, ".wav") ?? "audio.wav"}`} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Cut Audio
          </a>
        </Card>
      )}
    </div>
  );
}
