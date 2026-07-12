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
import { VideoConverter } from "@/components/tools/VideoConverter";
import { GIFToMP4 } from "@/components/tools/GIFToMP4";
import { ContentGenerator } from "@/components/tools/AIContentGenerator";
import { ParaphrasingTool } from "@/components/tools/AIParaphrasingTool";
import { DomainStrength } from "@/components/tools/DomainStrength";
import { SalesTaxCalculator } from "@/components/tools/SalesTaxCalculator";
import { DiscountCalculator } from "@/components/tools/DiscountCalculator";
import { GradeCalculator } from "@/components/tools/GradeCalculator";
import { FractionCalculator } from "@/components/tools/FractionCalculator";
import { TimeZoneConverter } from "@/components/tools/TimeZoneConverter";
import { Stopwatch } from "@/components/tools/Stopwatch";
import { PomodoroTimer } from "@/components/tools/PomodoroTimer";
import { CSSBoxShadowGenerator } from "@/components/tools/CSSBoxShadowGenerator";
import { CSSBorderRadiusGenerator } from "@/components/tools/CSSBorderRadiusGenerator";
import { TextToSpeech } from "@/components/tools/TextToSpeech";
import { EmojiPicker } from "@/components/tools/EmojiPicker";
import { RandomColorGenerator } from "@/components/tools/RandomColorGenerator";
import { PercentageChangeCalculator } from "@/components/tools/PercentageChangeCalculator";
import { BinaryToText } from "@/components/tools/BinaryToText";
import { RomanNumeralConverter } from "@/components/tools/RomanNumeralConverter";
import { BodyFatCalculator } from "@/components/tools/BodyFatCalculator";
import { FontSizeConverter } from "@/components/tools/FontSizeConverter";
import { RandomNamePicker } from "@/components/tools/RandomNamePicker";
import { ColorContrastChecker } from "@/components/tools/ColorContrastChecker";
import { DataSizeConverter } from "@/components/tools/DataSizeConverter";
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
  "video-converter": VideoConverter,
  "gif-to-mp4": GIFToMP4,
  "ai-content-generator": ContentGenerator,
  "ai-paraphrasing-tool": ParaphrasingTool,
  "page-authority": DomainStrength,
  "sales-tax-calculator": SalesTaxCalculator,
  "discount-calculator": DiscountCalculator,
  "grade-calculator": GradeCalculator,
  "fraction-calculator": FractionCalculator,
  "time-zone-converter": TimeZoneConverter,
  "stopwatch": Stopwatch,
  "pomodoro-timer": PomodoroTimer,
  "css-box-shadow": CSSBoxShadowGenerator,
  "css-border-radius": CSSBorderRadiusGenerator,
  "text-to-speech": TextToSpeech,
  "emoji-picker": EmojiPicker,
  "random-color-generator": RandomColorGenerator,
  "percentage-change-calculator": PercentageChangeCalculator,
  "binary-to-text": BinaryToText,
  "roman-numeral-converter": RomanNumeralConverter,
  "body-fat-calculator": BodyFatCalculator,
  "font-size-converter": FontSizeConverter,
  "random-name-picker": RandomNamePicker,
  "color-contrast-checker": ColorContrastChecker,
  "data-size-converter": DataSizeConverter,
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
