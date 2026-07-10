"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card, Skeleton, Input } from "@/components/ui";

export function VideoToGIF() {
  const [file, setFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState("0");
  const [duration, setDuration] = useState("3");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    setProgress(0);

    try {
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = videoUrl;
      video.muted = true;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Failed to load video"));
        setTimeout(() => reject(new Error("Timeout")), 10000);
      });

      const fps = 10;
      const start = parseFloat(startTime);
      const dur = parseFloat(duration);
      const totalFrames = Math.ceil(dur * fps);
      const w = 320;
      const h = Math.round(video.videoHeight / video.videoWidth * w);

      video.currentTime = start;
      await new Promise<void>((r) => { video.onseeked = () => r(); });

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      const frames: ImageData[] = [];

      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = start + i / fps;
        await new Promise<void>((r) => { video.onseeked = () => r(); });
        ctx.drawImage(video, 0, 0, w, h);
        frames.push(ctx.getImageData(0, 0, w, h));
        setProgress(Math.round(((i + 1) / totalFrames) * 90));
      }

      setProgress(95);
      const gifBlob = await framesToGIF(frames, w, h, fps);
      setResult(URL.createObjectURL(gifBlob));
      setProgress(100);
      URL.revokeObjectURL(videoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setLoading(false);
    }
  }

  async function framesToGIF(frames: ImageData[], w: number, h: number, fps: number): Promise<Blob> {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks: Blob[] = [];

    return new Promise((resolve, reject) => {
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      recorder.onerror = () => reject(new Error("Recording failed"));
      recorder.start();

      let i = 0;
      function drawFrame() {
        if (i >= frames.length) { recorder.stop(); return; }
        ctx.putImageData(frames[i], 0, 0);
        i++;
        setTimeout(drawFrame, 1000 / fps);
      }
      drawFrame();
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
        <input ref={inputRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
        {file ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setFile(null); setResult(null); }}>Remove</Button>
            <video ref={videoRef} controls className="mt-4 max-h-48 w-full rounded-lg" src={URL.createObjectURL(file)} />
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto size-10"><path d="M12 16V4m0 0L8 8m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
            <p className="mt-2 text-sm font-medium">Select video file</p>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Time (seconds)</label>
          <Input type="number" min={0} step={1} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Duration (seconds)</label>
          <Input type="number" min={1} max={30} step={1} value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
      </div>

      <Button onClick={handleConvert} disabled={!file || loading} variant="primary">
        {loading ? `Processing (${progress}%)...` : "Convert to GIF"}
      </Button>

      {loading && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div className="h-full rounded-full bg-nuvora-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <Skeleton count={1} columns={1} />
        </div>
      )}
      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card variant="default" className="p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Conversion complete</p>
          <video src={result} controls autoPlay loop muted className="mt-3 max-h-64 rounded-lg" />
          <a href={result} download={`${file?.name?.replace(/\.[^.]+$/, "") ?? "clip"}.webm`} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download GIF
          </a>
        </Card>
      )}
    </div>
  );
}
