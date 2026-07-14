"use client";

import { useState, useMemo } from "react";
import { Button, Alert, Card } from "@/components/ui";

const emojiData = [
  { emoji: "ðŸ˜€", name: "grinning face", category: "Smileys" },
  { emoji: "ðŸ˜ƒ", name: "grinning face with big eyes", category: "Smileys" },
  { emoji: "ðŸ˜„", name: "grinning face with smiling eyes", category: "Smileys" },
  { emoji: "ðŸ˜", name: "beaming face with smiling eyes", category: "Smileys" },
  { emoji: "ðŸ˜†", name: "grinning squinting face", category: "Smileys" },
  { emoji: "ðŸ˜…", name: "grinning face with sweat", category: "Smileys" },
  { emoji: "ðŸ¤£", name: "rolling on the floor laughing", category: "Smileys" },
  { emoji: "ðŸ˜‚", name: "face with tears of joy", category: "Smileys" },
  { emoji: "ðŸ™‚", name: "slightly smiling face", category: "Smileys" },
  { emoji: "ðŸ˜Š", name: "smiling face with smiling eyes", category: "Smileys" },
  { emoji: "ðŸ˜‡", name: "smiling face with halo", category: "Smileys" },
  { emoji: "ðŸ¥°", name: "smiling face with hearts", category: "Smileys" },
  { emoji: "ðŸ˜", name: "smiling face with heart-eyes", category: "Smileys" },
  { emoji: "ðŸ¤©", name: "star-struck", category: "Smileys" },
  { emoji: "ðŸ˜˜", name: "face blowing a kiss", category: "Smileys" },
  { emoji: "ðŸ˜—", name: "kissing face", category: "Smileys" },
  { emoji: "ðŸ˜š", name: "kissing face with closed eyes", category: "Smileys" },
  { emoji: "ðŸ˜‹", name: "face savoring food", category: "Smileys" },
  { emoji: "ðŸ˜›", name: "face with tongue", category: "Smileys" },
  { emoji: "ðŸ˜œ", name: "winking face with tongue", category: "Smileys" },
  { emoji: "ðŸ¤—", name: "hugging face", category: "Gestures" },
  { emoji: "ðŸ¤­", name: "face with hand over mouth", category: "Gestures" },
  { emoji: "ðŸ«¢", name: "face with open eyes and hand over mouth", category: "Gestures" },
  { emoji: "ðŸ«£", name: "face with peeking eye", category: "Gestures" },
  { emoji: "ðŸ¤«", name: "shushing face", category: "Gestures" },
  { emoji: "ðŸ¤”", name: "thinking face", category: "Gestures" },
  { emoji: "ðŸ«¡", name: "saluting face", category: "Gestures" },
  { emoji: "ðŸ¤", name: "zipper-mouth face", category: "Gestures" },
  { emoji: "ðŸ¤¨", name: "face with raised eyebrow", category: "Gestures" },
  { emoji: "ðŸ˜", name: "neutral face", category: "Gestures" },
  { emoji: "ðŸ˜‘", name: "expressionless face", category: "Gestures" },
  { emoji: "ðŸ˜¶", name: "face without mouth", category: "Gestures" },
  { emoji: "ðŸ˜", name: "smirking face", category: "Gestures" },
  { emoji: "ðŸ˜’", name: "unamused face", category: "Gestures" },
  { emoji: "ðŸ™„", name: "face with rolling eyes", category: "Gestures" },
  { emoji: "ðŸ˜¬", name: "grimacing face", category: "Gestures" },
  { emoji: "ðŸ˜®â€ðŸ’¨", name: "face exhaling", category: "Gestures" },
  { emoji: "ðŸ¤¤", name: "drooling face", category: "Gestures" },
  { emoji: "ðŸ˜´", name: "sleeping face", category: "Gestures" },
  { emoji: "ðŸ˜µ", name: "dizzy face", category: "Gestures" },
  { emoji: "ðŸŽ", name: "red apple", category: "Food" },
  { emoji: "ðŸ", name: "pear", category: "Food" },
  { emoji: "ðŸŠ", name: "tangerine", category: "Food" },
  { emoji: "ðŸ‹", name: "lemon", category: "Food" },
  { emoji: "ðŸŒ", name: "banana", category: "Food" },
  { emoji: "ðŸ‰", name: "watermelon", category: "Food" },
  { emoji: "ðŸ‡", name: "grapes", category: "Food" },
  { emoji: "ðŸ“", name: "strawberry", category: "Food" },
  { emoji: "ðŸ«", name: "blueberries", category: "Food" },
  { emoji: "ðŸˆ", name: "melon", category: "Food" },
  { emoji: "ðŸ’", name: "cherries", category: "Food" },
  { emoji: "ðŸ‘", name: "peach", category: "Food" },
  { emoji: "ðŸ¥­", name: "mango", category: "Food" },
  { emoji: "ðŸ", name: "pineapple", category: "Food" },
  { emoji: "ðŸ¥¥", name: "coconut", category: "Food" },
  { emoji: "ðŸ¥", name: "kiwi fruit", category: "Food" },
  { emoji: "ðŸ…", name: "tomato", category: "Food" },
  { emoji: "ðŸ¥‘", name: "avocado", category: "Food" },
  { emoji: "ðŸ”", name: "hamburger", category: "Food" },
  { emoji: "ðŸ•", name: "pizza", category: "Food" },
  { emoji: "ðŸš—", name: "car", category: "Travel" },
  { emoji: "ðŸš•", name: "taxi", category: "Travel" },
  { emoji: "ðŸš™", name: "SUV", category: "Travel" },
  { emoji: "ðŸšŒ", name: "bus", category: "Travel" },
  { emoji: "ðŸšŽ", name: "trolleybus", category: "Travel" },
  { emoji: "ðŸŽï¸", name: "racing car", category: "Travel" },
  { emoji: "ðŸš“", name: "police car", category: "Travel" },
  { emoji: "ðŸš‘", name: "ambulance", category: "Travel" },
  { emoji: "ðŸš’", name: "fire engine", category: "Travel" },
  { emoji: "ðŸš", name: "minibus", category: "Travel" },
  { emoji: "ðŸšš", name: "delivery truck", category: "Travel" },
  { emoji: "ðŸš›", name: "articulated lorry", category: "Travel" },
  { emoji: "ðŸšœ", name: "tractor", category: "Travel" },
  { emoji: "ðŸ›µ", name: "motor scooter", category: "Travel" },
  { emoji: "ðŸï¸", name: "motorcycle", category: "Travel" },
  { emoji: "âœˆï¸", name: "airplane", category: "Travel" },
  { emoji: "ðŸš€", name: "rocket", category: "Travel" },
  { emoji: "ðŸ›¸", name: "flying saucer", category: "Travel" },
  { emoji: "ðŸš", name: "helicopter", category: "Travel" },
  { emoji: "ðŸ›³ï¸", name: "passenger ship", category: "Travel" },
  { emoji: "âŒš", name: "watch", category: "Objects" },
  { emoji: "ðŸ“±", name: "mobile phone", category: "Objects" },
  { emoji: "ðŸ’»", name: "laptop", category: "Objects" },
  { emoji: "âŒ¨ï¸", name: "keyboard", category: "Objects" },
  { emoji: "ðŸ–¥ï¸", name: "desktop computer", category: "Objects" },
  { emoji: "ðŸ–¨ï¸", name: "printer", category: "Objects" },
  { emoji: "ðŸ–±ï¸", name: "computer mouse", category: "Objects" },
  { emoji: "ðŸ“·", name: "camera", category: "Objects" },
  { emoji: "ðŸ“¸", name: "camera with flash", category: "Objects" },
  { emoji: "ðŸ“¹", name: "video camera", category: "Objects" },
  { emoji: "ðŸŽ¥", name: "movie camera", category: "Objects" },
  { emoji: "ðŸ“º", name: "television", category: "Objects" },
  { emoji: "ðŸ“»", name: "radio", category: "Objects" },
  { emoji: "ðŸ”Š", name: "speaker high volume", category: "Objects" },
  { emoji: "ðŸ“€", name: "DVD", category: "Objects" },
  { emoji: "ðŸ’¡", name: "light bulb", category: "Objects" },
  { emoji: "ðŸ”¦", name: "flashlight", category: "Objects" },
  { emoji: "ðŸ“–", name: "open book", category: "Objects" },
  { emoji: "âœ‚ï¸", name: "scissors", category: "Objects" },
  { emoji: "ðŸ”‘", name: "key", category: "Objects" },
  { emoji: "â¤ï¸", name: "red heart", category: "Symbols" },
  { emoji: "ðŸ§¡", name: "orange heart", category: "Symbols" },
  { emoji: "ðŸ’›", name: "yellow heart", category: "Symbols" },
  { emoji: "ðŸ’š", name: "green heart", category: "Symbols" },
  { emoji: "ðŸ’™", name: "blue heart", category: "Symbols" },
  { emoji: "ðŸ’œ", name: "purple heart", category: "Symbols" },
  { emoji: "ðŸ–¤", name: "black heart", category: "Symbols" },
  { emoji: "ðŸ¤", name: "white heart", category: "Symbols" },
  { emoji: "ðŸ¤Ž", name: "brown heart", category: "Symbols" },
  { emoji: "ðŸ’–", name: "sparkling heart", category: "Symbols" },
  { emoji: "ðŸ’—", name: "growing heart", category: "Symbols" },
  { emoji: "ðŸ’“", name: "beating heart", category: "Symbols" },
  { emoji: "ðŸ’•", name: "two hearts", category: "Symbols" },
  { emoji: "â­", name: "star", category: "Symbols" },
  { emoji: "ðŸŒŸ", name: "glowing star", category: "Symbols" },
  { emoji: "âœ¨", name: "sparkles", category: "Symbols" },
  { emoji: "ðŸ”¥", name: "fire", category: "Symbols" },
  { emoji: "ðŸ’¯", name: "hundred points", category: "Symbols" },
  { emoji: "âœ…", name: "check mark button", category: "Symbols" },
  { emoji: "âŒ", name: "cross mark", category: "Symbols" },
];

const categories = ["Smileys", "Gestures", "Food", "Travel", "Objects", "Symbols"];

export function EmojiPicker() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Smileys");
  const [copied, setCopied] = useState("");

  const filtered = useMemo(() => {
    return emojiData.filter((e) => {
      const matchCategory = category === "All" || e.category === category;
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, category]);

  async function handleCopy(emoji: string) {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopied(emoji);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied(emoji);
      setTimeout(() => setCopied(""), 2000);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card variant="default" className="p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={category === "All" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setCategory("All")}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "primary" : "secondary"}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emojis..."
          className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
        />
        <p className="mt-3 text-sm text-text-secondary">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {filtered.map((e) => (
            <button
              key={e.emoji + e.name}
              onClick={() => handleCopy(e.emoji)}
              className="relative flex h-12 w-12 items-center justify-center rounded-lg text-2xl transition-colors hover:bg-surface-secondary"
              title={e.name}
            >
              {e.emoji}
              {copied === e.emoji && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-0.5 text-xs text-white dark:bg-zinc-100 dark:text-zinc-400">
                  Copied!
                </span>
              )}
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <Alert variant="error" className="mt-6">
            No emojis found. Try a different search or category.
          </Alert>
        )}
      </Card>
    </div>
  );
}
