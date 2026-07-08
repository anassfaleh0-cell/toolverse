"use client";

import { useState, useCallback } from "react";
import { Input, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in",
  "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu",
  "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
  "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt",
  "mollit", "anim", "id", "est", "laborum", "fusce", "dapibus", "tellus", "ac",
  "cursus", "commodo", "tortor", "mauris", "condimentum", "nibh", "ut",
  "fermentum", "massa", "justo", "sit", "amet", "risus", "nullam", "quis",
  "ante", "et", "egestas", "eget", "posuere", "bibendum", "libero", "volutpat",
  "viverra", "neque", "gravida", "in", "dictumst", "suspendisse", "potenti",
  "cras", "ultricies", "ligula", "et", "blandit", "dictum", "phasellus",
  "consequat", "purus", "lectus", "morbi", "tristique", "senectus", "et",
  "netus", "et", "malesuada", "fames", "ac", "turpis", "egestas", "maecenas",
  "pharetra", "convallis", "neque", "porttitor", "iaculis", "urna",
  "condimentum", "mattis", "pellentesque", "habitant", "morbi", "tristique",
  "senectus", "et", "netus", "et", "malesuada", "fames", "ac", "turpis",
  "egestas", "integer", "vitae", "justo", "eget", "magna", "fermentum",
  "iaculis", "eu", "non", "diam", "phasellus", "ultricies", "nisi", "magna",
  "augue", "lacus", "vestibulum", "fringilla", "purus", "sit", "amet",
  "faucibus", "arcu", "vitae", "neque", "laoreet", "suspendisse", "potenti",
  "nullam", "porttitor", "massa", "id", "neque", "aliquam", "vestibulum",
  "morbi", "odio", "neque", "ullamcorper", "sit", "amet", "cursus", "quis",
  "vulputate", "justo", "gravida", "arcu", "imperdiet", "sed", "euismod",
  "nisi", "porta", "lorem", "mollis", "aliquam", "faucibus", "purus", "in",
  "massa", "tempor", "nec", "feugiat", "nisl", "pretium",
];

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(): string {
  const wordCount = 8 + Math.floor(Math.random() * 12);
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(randomWord());
  }
  return capitalize(words.join(" ")) + ".";
}

function generateParagraph(): string {
  const sentenceCount = 3 + Math.floor(Math.random() * 4);
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}

export function LoremIpsumGenerator() {
  const [count, setCount] = useState(5);
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    const num = Math.min(Math.max(1, count), 50);
    const result: string[] = [];
    for (let i = 0; i < num; i++) {
      result.push(generateParagraph());
    }
    setParagraphs(result);
  }, [count]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <label htmlFor="paragraph-count" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Paragraphs (1-50)
            </label>
            <Input
              id="paragraph-count"
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.min(Math.max(1, parseInt(e.target.value, 10) || 1), 50))}
              aria-label="Number of paragraphs"
            />
          </div>
          <Button onClick={handleGenerate} variant="primary">
            Generate
          </Button>
        </div>
      </div>

      {paragraphs.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Generated Text ({paragraphs.length} paragraph{paragraphs.length !== 1 ? "s" : ""})
            </p>
            <CopyButton text={paragraphs.join("\n\n")} label="Copy All" />
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {paragraphs.map((p, i) => (
              <div key={i} className="px-5 py-4 even:bg-zinc-50 dark:even:bg-zinc-900/50">
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{p}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
