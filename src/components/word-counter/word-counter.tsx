"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui";

function countSentences(text: string): number {
  if (!text.trim()) return 0;
  const matches = text.match(/[.!?]+(\s|$)/g);
  return matches ? matches.length : 0;
}

function countParagraphs(text: string): number {
  if (!text.trim()) return 0;
  return text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
}

function estimateReadingTime(wordCount: number): string {
  const wordsPerMinute = 200;
  const minutes = wordCount / wordsPerMinute;
  if (minutes < 1) return "< 1 min";
  if (minutes < 2) return "~1 min";
  return `~${Math.ceil(minutes)} min`;
}

interface Stats {
  words: number;
  charsWithSpaces: number;
  charsWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
}

function computeStats(text: string): Stats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, "").length;
  const sentences = countSentences(trimmed);
  const paragraphs = countParagraphs(trimmed);
  const readingTime = estimateReadingTime(words);

  return { words, charsWithSpaces, charsWithoutSpaces, sentences, paragraphs, readingTime };
}

export function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => computeStats(text), [text]);

  const statItems = [
    { label: "Words", value: stats.words },
    { label: "Characters (with spaces)", value: stats.charsWithSpaces },
    { label: "Characters (without spaces)", value: stats.charsWithoutSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading Time", value: stats.readingTime },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here to get live statistics..."
          rows={10}
          aria-label="Text input"
        />
      </div>

      {text.trim() && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {statItems.map((item) => (
            <div key={item.label} className="rounded-xl border border-zinc-200 px-4 py-4 dark:border-zinc-800">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
