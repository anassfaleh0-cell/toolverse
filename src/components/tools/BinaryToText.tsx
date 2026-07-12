"use client";

import { useState } from "react";
import { Button, Alert, Card } from "@/components/ui";

type Mode = "binary-to-text" | "text-to-binary";

export function BinaryToText() {
  const [mode, setMode] = useState<Mode>("binary-to-text");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [byteCount, setByteCount] = useState(0);

  function handleConvert() {
    setError("");
    setResult("");
    setCharCount(0);
    setByteCount(0);

    try {
      const trimmed = input.trim();
      if (!trimmed) {
        setError("Input cannot be empty.");
        return;
      }

      if (mode === "binary-to-text") {
        if (!/^[01\s]+$/.test(trimmed)) {
          setError("Invalid binary string. Only 0, 1, and spaces are allowed.");
          return;
        }
        const bytes = trimmed.split(/\s+/);
        let output = "";
        for (const b of bytes) {
          if (b.length > 0) {
            if (b.length !== 8) {
              setError(`Invalid binary byte: "${b}" — must be 8 bits.`);
              return;
            }
            output += String.fromCharCode(parseInt(b, 2));
          }
        }
        setResult(output);
        setCharCount(output.length);
        setByteCount(bytes.filter(Boolean).length);
      } else {
        let binary = "";
        for (let i = 0; i < trimmed.length; i++) {
          const bin = trimmed.charCodeAt(i).toString(2).padStart(8, "0");
          binary += (i > 0 ? " " : "") + bin;
        }
        setResult(binary);
        setCharCount(trimmed.length);
        setByteCount(trimmed.length);
      }
    } catch {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card variant="default" className="p-8">
        <div className="flex gap-2 mb-6">
          <Button
            variant={mode === "binary-to-text" ? "primary" : "secondary"}
            size="sm"
            onClick={() => { setMode("binary-to-text"); setResult(""); setError(""); }}
          >
            Binary → Text
          </Button>
          <Button
            variant={mode === "text-to-binary" ? "primary" : "secondary"}
            size="sm"
            onClick={() => { setMode("text-to-binary"); setResult(""); setError(""); }}
          >
            Text → Binary
          </Button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "binary-to-text" ? "01001000 01101001" : "Enter text..."}
          rows={4}
          className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400 resize-none"
        />
        <Button onClick={handleConvert} variant="primary" size="lg" className="mt-4 w-full">
          Convert
        </Button>

        {error && <Alert variant="error" className="mt-6">{error}</Alert>}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-border-subtle bg-surface-secondary p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2">
                Result
              </p>
              <p className="break-all font-mono text-sm text-text-primary">{result}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-surface-secondary p-3">
                <span className="text-xs text-text-secondary">Character count</span>
                <p className="font-mono font-medium text-text-primary">{charCount}</p>
              </div>
              <div className="rounded-lg bg-surface-secondary p-3">
                <span className="text-xs text-text-secondary">Byte count</span>
                <p className="font-mono font-medium text-text-primary">{byteCount}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
