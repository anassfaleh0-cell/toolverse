"use client";

import { useState, type FormEvent } from "react";
import { validateIp } from "@/lib/ip-lookup-utils";
import { Button } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

interface IpLookupFormProps {
  onLookup: (ip: string) => void;
  loading: boolean;
}

export function IpLookupForm({ onLookup, loading }: IpLookupFormProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const validation = validateIp(input);
    if (!validation.valid) {
      setError(validation.error || "Invalid IP address");
      return;
    }

    onLookup(input.trim());
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="w-full">
      <div className="relative mx-auto flex w-full max-w-xl items-center gap-2">
        <div className="relative flex w-full items-center overflow-hidden rounded-xl border border-zinc-300 bg-white/80 shadow-sm backdrop-blur-sm transition-colors focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900/80 dark:focus-within:border-zinc-500 dark:focus-within:ring-zinc-800">
          <span className="flex shrink-0 items-center pl-4" aria-hidden="true">
            <Icon name="Search" className="size-5 text-zinc-600" />
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter an IP address (e.g., 8.8.8.8)"
            className="flex-1 bg-transparent px-3 py-3.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-600 dark:text-zinc-50"
            aria-label="IP address to look up"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            variant="primary"
            size="sm"
          >
            {loading ? (
              <>
                <svg
                  className="size-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Searching
              </>
            ) : (
              "Lookup"
            )}
          </Button>
        </div>
      </div>
      {error && (
        <p className="mx-auto mt-2 max-w-xl text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
