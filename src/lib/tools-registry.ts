import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/tools/tool-skeleton";

const componentRegistry: Record<string, ComponentType> = {
  "uptime-checker": dynamic(() => import("@/components/tools/UptimeChecker").then((m) => ({ default: m.UptimeChecker })), { loading: ToolSkeleton }),
  "speed-test": dynamic(() => import("@/components/tools/SpeedTest").then((m) => ({ default: m.SpeedTest })), { loading: ToolSkeleton }),
  "audio-converter": dynamic(() => import("@/components/tools/AudioConverter").then((m) => ({ default: m.AudioConverter })), { loading: ToolSkeleton }),
  "video-compressor": dynamic(() => import("@/components/tools/VideoCompressor").then((m) => ({ default: m.VideoCompressor })), { loading: ToolSkeleton }),
  "mp3-cutter": dynamic(() => import("@/components/tools/MP3Cutter").then((m) => ({ default: m.MP3Cutter })), { loading: ToolSkeleton }),
  "video-to-gif": dynamic(() => import("@/components/tools/VideoToGIF").then((m) => ({ default: m.VideoToGIF })), { loading: ToolSkeleton }),
  "audio-merger": dynamic(() => import("@/components/tools/AudioMerger").then((m) => ({ default: m.AudioMerger })), { loading: ToolSkeleton }),
  "video-resizer": dynamic(() => import("@/components/tools/VideoResizer").then((m) => ({ default: m.VideoResizer })), { loading: ToolSkeleton }),
  "audio-extractor": dynamic(() => import("@/components/tools/AudioExtractor").then((m) => ({ default: m.AudioExtractor })), { loading: ToolSkeleton }),
  "volume-booster": dynamic(() => import("@/components/tools/VolumeBooster").then((m) => ({ default: m.VolumeBooster })), { loading: ToolSkeleton }),
  "video-to-mp3": dynamic(() => import("@/components/tools/VideoToMP3").then((m) => ({ default: m.VideoToMP3 })), { loading: ToolSkeleton }),
  "screen-recorder": dynamic(() => import("@/components/tools/ScreenRecorder").then((m) => ({ default: m.ScreenRecorder })), { loading: ToolSkeleton }),
  "video-converter": dynamic(() => import("@/components/tools/VideoConverter").then((m) => ({ default: m.VideoConverter })), { loading: ToolSkeleton }),
  "gif-to-mp4": dynamic(() => import("@/components/tools/GIFToMP4").then((m) => ({ default: m.GIFToMP4 })), { loading: ToolSkeleton }),
  "ai-content-generator": dynamic(() => import("@/components/tools/AIContentGenerator").then((m) => ({ default: m.ContentGenerator })), { loading: ToolSkeleton }),
  "ai-paraphrasing-tool": dynamic(() => import("@/components/tools/AIParaphrasingTool").then((m) => ({ default: m.ParaphrasingTool })), { loading: ToolSkeleton }),
  "page-authority": dynamic(() => import("@/components/tools/DomainStrength").then((m) => ({ default: m.DomainStrength })), { loading: ToolSkeleton }),
  "sales-tax-calculator": dynamic(() => import("@/components/tools/SalesTaxCalculator").then((m) => ({ default: m.SalesTaxCalculator })), { loading: ToolSkeleton }),
  "discount-calculator": dynamic(() => import("@/components/tools/DiscountCalculator").then((m) => ({ default: m.DiscountCalculator })), { loading: ToolSkeleton }),
  "grade-calculator": dynamic(() => import("@/components/tools/GradeCalculator").then((m) => ({ default: m.GradeCalculator })), { loading: ToolSkeleton }),
  "fraction-calculator": dynamic(() => import("@/components/tools/FractionCalculator").then((m) => ({ default: m.FractionCalculator })), { loading: ToolSkeleton }),
  "time-zone-converter": dynamic(() => import("@/components/tools/TimeZoneConverter").then((m) => ({ default: m.TimeZoneConverter })), { loading: ToolSkeleton }),
  "stopwatch": dynamic(() => import("@/components/tools/Stopwatch").then((m) => ({ default: m.Stopwatch })), { loading: ToolSkeleton }),
  "pomodoro-timer": dynamic(() => import("@/components/tools/PomodoroTimer").then((m) => ({ default: m.PomodoroTimer })), { loading: ToolSkeleton }),
  "css-box-shadow": dynamic(() => import("@/components/tools/CSSBoxShadowGenerator").then((m) => ({ default: m.CSSBoxShadowGenerator })), { loading: ToolSkeleton }),
  "css-border-radius": dynamic(() => import("@/components/tools/CSSBorderRadiusGenerator").then((m) => ({ default: m.CSSBorderRadiusGenerator })), { loading: ToolSkeleton }),
  "text-to-speech": dynamic(() => import("@/components/tools/TextToSpeech").then((m) => ({ default: m.TextToSpeech })), { loading: ToolSkeleton }),
  "emoji-picker": dynamic(() => import("@/components/tools/EmojiPicker").then((m) => ({ default: m.EmojiPicker })), { loading: ToolSkeleton }),
  "random-color-generator": dynamic(() => import("@/components/tools/RandomColorGenerator").then((m) => ({ default: m.RandomColorGenerator })), { loading: ToolSkeleton }),
  "percentage-change-calculator": dynamic(() => import("@/components/tools/PercentageChangeCalculator").then((m) => ({ default: m.PercentageChangeCalculator })), { loading: ToolSkeleton }),
  "binary-to-text": dynamic(() => import("@/components/tools/BinaryToText").then((m) => ({ default: m.BinaryToText })), { loading: ToolSkeleton }),
  "roman-numeral-converter": dynamic(() => import("@/components/tools/RomanNumeralConverter").then((m) => ({ default: m.RomanNumeralConverter })), { loading: ToolSkeleton }),
  "body-fat-calculator": dynamic(() => import("@/components/tools/BodyFatCalculator").then((m) => ({ default: m.BodyFatCalculator })), { loading: ToolSkeleton }),
  "font-size-converter": dynamic(() => import("@/components/tools/FontSizeConverter").then((m) => ({ default: m.FontSizeConverter })), { loading: ToolSkeleton }),
  "random-name-picker": dynamic(() => import("@/components/tools/RandomNamePicker").then((m) => ({ default: m.RandomNamePicker })), { loading: ToolSkeleton }),
  "color-contrast-checker": dynamic(() => import("@/components/tools/ColorContrastChecker").then((m) => ({ default: m.ColorContrastChecker })), { loading: ToolSkeleton }),
  "data-size-converter": dynamic(() => import("@/components/tools/DataSizeConverter").then((m) => ({ default: m.DataSizeConverter })), { loading: ToolSkeleton }),
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
