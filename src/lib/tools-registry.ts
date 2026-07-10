import type { ComponentType } from "react";
import { UptimeChecker } from "@/components/tools/UptimeChecker";
import { SpeedTest } from "@/components/tools/SpeedTest";
import { AudioConverter } from "@/components/tools/AudioConverter";
import { VideoCompressor } from "@/components/tools/VideoCompressor";
import { MP3Cutter } from "@/components/tools/MP3Cutter";
import { VideoToGIF } from "@/components/tools/VideoToGIF";
import { AudioMerger } from "@/components/tools/AudioMerger";
import { VideoResizer } from "@/components/tools/VideoResizer";
import { AudioExtractor } from "@/components/tools/AudioExtractor";
import { VolumeBooster } from "@/components/tools/VolumeBooster";
import { VideoToMP3 } from "@/components/tools/VideoToMP3";
import { ScreenRecorder } from "@/components/tools/ScreenRecorder";

const componentRegistry: Record<string, ComponentType> = {
  "uptime-checker": UptimeChecker,
  "speed-test": SpeedTest,
  "audio-converter": AudioConverter,
  "video-compressor": VideoCompressor,
  "mp3-cutter": MP3Cutter,
  "video-to-gif": VideoToGIF,
  "audio-merger": AudioMerger,
  "video-resizer": VideoResizer,
  "audio-extractor": AudioExtractor,
  "volume-booster": VolumeBooster,
  "video-to-mp3": VideoToMP3,
  "screen-recorder": ScreenRecorder,
};

export function getToolComponent(slug: string): ComponentType | null {
  return componentRegistry[slug] ?? null;
}

export function hasInteractiveComponent(slug: string): boolean {
  return slug in componentRegistry;
}

export function getRegisteredToolSlugs(): string[] {
  return Object.keys(componentRegistry);
}
