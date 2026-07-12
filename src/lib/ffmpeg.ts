import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export interface LoadProgress {
  received: number;
  total: number;
  done: boolean;
}

export async function getFFmpeg(
  onProgress?: (progress: LoadProgress) => void
): Promise<FFmpeg> {
  if (ffmpeg) return ffmpeg;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const instance = new FFmpeg();

    const coreURL = await toBlobURL('https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js', 'text/javascript');
    const wasmURL = await toBlobURL(
      'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
      'application/wasm',
      true,
      onProgress
        ? ({ url, total, received, done }) =>
            onProgress({ received, total, done })
        : undefined
    );

    await instance.load({ coreURL, wasmURL });
    ffmpeg = instance;
    return instance;
  })();

  return loadPromise;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function onFFmpegLog(
  ffmpeg: FFmpeg,
  callback: (type: string, message: string) => void
): void {
  ffmpeg.on('log', ({ type, message }) => {
    callback(type, message);
  });
}
