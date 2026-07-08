"use client";

import { useState } from "react";
import { Input, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

export function UuidGenerator() {
  const [quantity, setQuantity] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  function generateUuid(): string {
    return crypto.randomUUID();
  }

  function handleGenerate() {
    const count = Math.min(Math.max(1, quantity), 100);
    const generated: string[] = [];
    for (let i = 0; i < count; i++) {
      generated.push(generateUuid());
    }
    setUuids(generated);
  }

  function handleQuantityChange(value: string) {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setQuantity(Math.min(Math.max(1, num), 100));
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <label htmlFor="uuid-quantity" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Quantity (1-100)
            </label>
            <Input
              id="uuid-quantity"
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              aria-label="Number of UUIDs to generate"
            />
          </div>
          <Button onClick={handleGenerate} variant="primary">
            Generate UUID{quantity !== 1 ? "s" : ""}
          </Button>
        </div>
      </div>

      {uuids.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Generated UUIDs ({uuids.length})
            </p>
            <CopyButton text={uuids.join("\n")} label="Copy All" />
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {uuids.map((uuid, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-3 even:bg-zinc-50 dark:even:bg-zinc-900/50">
                <span className="font-mono text-sm text-zinc-900 dark:text-zinc-50">{uuid}</span>
                <CopyButton text={uuid} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
