"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card, Skeleton } from "@/components/ui";
import { Icon } from "@/components/shared/icon";
import { getFFmpeg, formatBytes } from "@/lib/ffmpeg";

const OUTPUT_FORMATS = ["MP3", "WAV", "AAC"] as const;
const FORMAT_CODEC: Record<string, string> = {
  MP3: "-c:a libmp3lame -q:a 2",
  WAV: "-c:a pcm_s16le",
  AAC: "-c:a aac -b:a 192k",
};
const FORMAT_EXT: Record<string, string> = {
  MP3: "mp3",
  WAV: "wav",
  AAC: "aac",
};

export function AudioExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>("MP3");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
      setError("");
    }
  }

  async function handleExtract() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);

    try {
      const ffmpeg = await getFFmpeg((p) => setProgress(Math.round((p.received / p.total) * 100)));
      ffmpeg.writeFile("input", new Uint8Array(await file.arrayBuffer()));
      setProgress(0);

      const ext = FORMAT_EXT[format];
      const codec = FORMAT_CODEC[format];
      await ffmpeg.exec(["-i", "input", ...codec.split(" "), `output.${ext}`]);

      const data = await ffmpeg.readFile(`output.${ext}`);
      ffmpeg.deleteFile("input");
      ffmpeg.deleteFile(`output.${ext}`);

      const blob = new Blob([data as BlobPart], { type: `audio/${ext === "mp3" ? "mpeg" : ext}` });
      setResult(URL.createObjectURL(blob));
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract audio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
        <input ref={inputRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
        {file ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
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

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Output format:</label>
        <div className="flex flex-wrap gap-2">
          {OUTPUT_FORMATS.map((fmt) => (
            <button key={fmt} onClick={() => setFormat(fmt)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${format === fmt ? "bg-nuvora-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}
            >
              .{fmt.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleExtract} disabled={!file || loading} variant="primary">
        {loading ? `Extracting (${progress}%)...` : "Extract Audio"}
      </Button>

      {loading && (
        <div className="space-y-2">
          <Skeleton count={1} columns={1} />
        </div>
      )}
      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card variant="default" className="p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Audio extracted successfully</p>
          <audio controls className="mt-3 w-full" src={result} />
          <a href={result} download={`${file?.name?.replace(/\.[^.]+$/, "") ?? "audio"}.${FORMAT_EXT[format]}`} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <Icon name="Download" className="size-4" />
            Download Audio
          </a>
        </Card>
      )}
    </div>
  );
}
