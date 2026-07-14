"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card } from "@/components/ui";
import { Icon } from "@/components/shared/icon";
import { getFFmpeg, formatBytes } from "@/lib/ffmpeg";

const MAX_SIZE = 200 * 1024 * 1024;

export function VideoToMP3() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResultUrl(null);
      setError("");
    }
  }

  const isOverLimit = file !== null && file.size > MAX_SIZE;

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResultUrl(null);
    setProgress(0);
    setStatusText("Loading FFmpeg...");

    try {
      const ffmpeg = await getFFmpeg((p) => {
        const pct = p.total > 0 ? Math.round((p.received / p.total) * 20) : 0;
        setProgress(pct);
      });

      setStatusText("Writing input file...");
      setProgress(25);

      const inputData = new Uint8Array(await file.arrayBuffer());
      const ext = file.name.split(".").pop() || "mp4";
      const inputName = `input.${ext}`;
      await ffmpeg.writeFile(inputName, inputData);

      setProgress(30);
      setStatusText("Extracting & encoding MP3...");

      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.min(95, 30 + Math.round(p * 65)));
      });

      await ffmpeg.exec([
        "-i", inputName,
        "-c:a", "libmp3lame",
        "-q:a", "2",
        "-vn",
        "output.mp3",
      ]);

      setProgress(96);
      setStatusText("Reading output...");

      const outputData = (await ffmpeg.readFile("output.mp3")) as Uint8Array;
      const blob = new Blob([outputData.buffer as ArrayBuffer], { type: "audio/mpeg" });

      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setProgress(100);
      setStatusText("Complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert video to MP3");
    } finally {
      setLoading(false);
    }
  }

  const outName = file ? file.name.replace(/\.[^.]+$/, ".mp3") : "audio.mp3";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
        <input ref={inputRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
        {file ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{formatBytes(file.size)}</p>
            {isOverLimit && (
              <Alert variant="warning" className="mt-3">
                File exceeds 200 MB limit — conversion may fail or be very slow.
              </Alert>
            )}
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setFile(null); setResultUrl(null); }}>Remove</Button>
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
          Extracts the audio track from your video file and encodes it as a high-quality MP3 using ffmpeg.wasm with the LAME encoder. All processing happens entirely in your browser.
        </p>
      </div>

      <Button onClick={handleConvert} disabled={!file || loading} variant="primary">
        {loading ? `${statusText} (${progress}%)` : "Extract MP3 Audio"}
      </Button>

      {loading && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div className="h-full rounded-full bg-nuvora-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      {resultUrl && (
        <Card variant="default" className="space-y-3 p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Conversion complete</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{formatBytes(resultSize)} MP3 file ready</p>
          <audio controls src={resultUrl} className="w-full" />
          <a href={resultUrl} download={outName} className="inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <Icon name="Download" className="size-4" />
            Download {outName}
          </a>
        </Card>
      )}
    </div>
  );
}
