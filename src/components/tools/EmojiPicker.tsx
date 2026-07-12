"use client";

import { useState, useMemo } from "react";
import { Button, Alert, Card } from "@/components/ui";

const emojiData = [
  { emoji: "😀", name: "grinning face", category: "Smileys" },
  { emoji: "😃", name: "grinning face with big eyes", category: "Smileys" },
  { emoji: "😄", name: "grinning face with smiling eyes", category: "Smileys" },
  { emoji: "😁", name: "beaming face with smiling eyes", category: "Smileys" },
  { emoji: "😆", name: "grinning squinting face", category: "Smileys" },
  { emoji: "😅", name: "grinning face with sweat", category: "Smileys" },
  { emoji: "🤣", name: "rolling on the floor laughing", category: "Smileys" },
  { emoji: "😂", name: "face with tears of joy", category: "Smileys" },
  { emoji: "🙂", name: "slightly smiling face", category: "Smileys" },
  { emoji: "😊", name: "smiling face with smiling eyes", category: "Smileys" },
  { emoji: "😇", name: "smiling face with halo", category: "Smileys" },
  { emoji: "🥰", name: "smiling face with hearts", category: "Smileys" },
  { emoji: "😍", name: "smiling face with heart-eyes", category: "Smileys" },
  { emoji: "🤩", name: "star-struck", category: "Smileys" },
  { emoji: "😘", name: "face blowing a kiss", category: "Smileys" },
  { emoji: "😗", name: "kissing face", category: "Smileys" },
  { emoji: "😚", name: "kissing face with closed eyes", category: "Smileys" },
  { emoji: "😋", name: "face savoring food", category: "Smileys" },
  { emoji: "😛", name: "face with tongue", category: "Smileys" },
  { emoji: "😜", name: "winking face with tongue", category: "Smileys" },
  { emoji: "🤗", name: "hugging face", category: "Gestures" },
  { emoji: "🤭", name: "face with hand over mouth", category: "Gestures" },
  { emoji: "🫢", name: "face with open eyes and hand over mouth", category: "Gestures" },
  { emoji: "🫣", name: "face with peeking eye", category: "Gestures" },
  { emoji: "🤫", name: "shushing face", category: "Gestures" },
  { emoji: "🤔", name: "thinking face", category: "Gestures" },
  { emoji: "🫡", name: "saluting face", category: "Gestures" },
  { emoji: "🤐", name: "zipper-mouth face", category: "Gestures" },
  { emoji: "🤨", name: "face with raised eyebrow", category: "Gestures" },
  { emoji: "😐", name: "neutral face", category: "Gestures" },
  { emoji: "😑", name: "expressionless face", category: "Gestures" },
  { emoji: "😶", name: "face without mouth", category: "Gestures" },
  { emoji: "😏", name: "smirking face", category: "Gestures" },
  { emoji: "😒", name: "unamused face", category: "Gestures" },
  { emoji: "🙄", name: "face with rolling eyes", category: "Gestures" },
  { emoji: "😬", name: "grimacing face", category: "Gestures" },
  { emoji: "😮‍💨", name: "face exhaling", category: "Gestures" },
  { emoji: "🤤", name: "drooling face", category: "Gestures" },
  { emoji: "😴", name: "sleeping face", category: "Gestures" },
  { emoji: "😵", name: "dizzy face", category: "Gestures" },
  { emoji: "🍎", name: "red apple", category: "Food" },
  { emoji: "🍐", name: "pear", category: "Food" },
  { emoji: "🍊", name: "tangerine", category: "Food" },
  { emoji: "🍋", name: "lemon", category: "Food" },
  { emoji: "🍌", name: "banana", category: "Food" },
  { emoji: "🍉", name: "watermelon", category: "Food" },
  { emoji: "🍇", name: "grapes", category: "Food" },
  { emoji: "🍓", name: "strawberry", category: "Food" },
  { emoji: "🫐", name: "blueberries", category: "Food" },
  { emoji: "🍈", name: "melon", category: "Food" },
  { emoji: "🍒", name: "cherries", category: "Food" },
  { emoji: "🍑", name: "peach", category: "Food" },
  { emoji: "🥭", name: "mango", category: "Food" },
  { emoji: "🍍", name: "pineapple", category: "Food" },
  { emoji: "🥥", name: "coconut", category: "Food" },
  { emoji: "🥝", name: "kiwi fruit", category: "Food" },
  { emoji: "🍅", name: "tomato", category: "Food" },
  { emoji: "🥑", name: "avocado", category: "Food" },
  { emoji: "🍔", name: "hamburger", category: "Food" },
  { emoji: "🍕", name: "pizza", category: "Food" },
  { emoji: "🚗", name: "car", category: "Travel" },
  { emoji: "🚕", name: "taxi", category: "Travel" },
  { emoji: "🚙", name: "SUV", category: "Travel" },
  { emoji: "🚌", name: "bus", category: "Travel" },
  { emoji: "🚎", name: "trolleybus", category: "Travel" },
  { emoji: "🏎️", name: "racing car", category: "Travel" },
  { emoji: "🚓", name: "police car", category: "Travel" },
  { emoji: "🚑", name: "ambulance", category: "Travel" },
  { emoji: "🚒", name: "fire engine", category: "Travel" },
  { emoji: "🚐", name: "minibus", category: "Travel" },
  { emoji: "🚚", name: "delivery truck", category: "Travel" },
  { emoji: "🚛", name: "articulated lorry", category: "Travel" },
  { emoji: "🚜", name: "tractor", category: "Travel" },
  { emoji: "🛵", name: "motor scooter", category: "Travel" },
  { emoji: "🏍️", name: "motorcycle", category: "Travel" },
  { emoji: "✈️", name: "airplane", category: "Travel" },
  { emoji: "🚀", name: "rocket", category: "Travel" },
  { emoji: "🛸", name: "flying saucer", category: "Travel" },
  { emoji: "🚁", name: "helicopter", category: "Travel" },
  { emoji: "🛳️", name: "passenger ship", category: "Travel" },
  { emoji: "⌚", name: "watch", category: "Objects" },
  { emoji: "📱", name: "mobile phone", category: "Objects" },
  { emoji: "💻", name: "laptop", category: "Objects" },
  { emoji: "⌨️", name: "keyboard", category: "Objects" },
  { emoji: "🖥️", name: "desktop computer", category: "Objects" },
  { emoji: "🖨️", name: "printer", category: "Objects" },
  { emoji: "🖱️", name: "computer mouse", category: "Objects" },
  { emoji: "📷", name: "camera", category: "Objects" },
  { emoji: "📸", name: "camera with flash", category: "Objects" },
  { emoji: "📹", name: "video camera", category: "Objects" },
  { emoji: "🎥", name: "movie camera", category: "Objects" },
  { emoji: "📺", name: "television", category: "Objects" },
  { emoji: "📻", name: "radio", category: "Objects" },
  { emoji: "🔊", name: "speaker high volume", category: "Objects" },
  { emoji: "📀", name: "DVD", category: "Objects" },
  { emoji: "💡", name: "light bulb", category: "Objects" },
  { emoji: "🔦", name: "flashlight", category: "Objects" },
  { emoji: "📖", name: "open book", category: "Objects" },
  { emoji: "✂️", name: "scissors", category: "Objects" },
  { emoji: "🔑", name: "key", category: "Objects" },
  { emoji: "❤️", name: "red heart", category: "Symbols" },
  { emoji: "🧡", name: "orange heart", category: "Symbols" },
  { emoji: "💛", name: "yellow heart", category: "Symbols" },
  { emoji: "💚", name: "green heart", category: "Symbols" },
  { emoji: "💙", name: "blue heart", category: "Symbols" },
  { emoji: "💜", name: "purple heart", category: "Symbols" },
  { emoji: "🖤", name: "black heart", category: "Symbols" },
  { emoji: "🤍", name: "white heart", category: "Symbols" },
  { emoji: "🤎", name: "brown heart", category: "Symbols" },
  { emoji: "💖", name: "sparkling heart", category: "Symbols" },
  { emoji: "💗", name: "growing heart", category: "Symbols" },
  { emoji: "💓", name: "beating heart", category: "Symbols" },
  { emoji: "💕", name: "two hearts", category: "Symbols" },
  { emoji: "⭐", name: "star", category: "Symbols" },
  { emoji: "🌟", name: "glowing star", category: "Symbols" },
  { emoji: "✨", name: "sparkles", category: "Symbols" },
  { emoji: "🔥", name: "fire", category: "Symbols" },
  { emoji: "💯", name: "hundred points", category: "Symbols" },
  { emoji: "✅", name: "check mark button", category: "Symbols" },
  { emoji: "❌", name: "cross mark", category: "Symbols" },
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
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-0.5 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">
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
