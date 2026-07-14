"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";

interface CharSet {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

function getStrengthLabel(score: number): string {
  if (score < 30) return "Weak";
  if (score < 60) return "Medium";
  if (score < 80) return "Strong";
  return "Very Strong";
}

function getStrengthColor(score: number): string {
  if (score < 30) return "bg-red-500";
  if (score < 60) return "bg-amber-500";
  if (score < 80) return "bg-green-500";
  return "bg-emerald-500";
}

function getStrengthTextColor(score: number): string {
  if (score < 30) return "text-red-700 dark:text-red-400";
  if (score < 60) return "text-amber-700 dark:text-amber-400";
  if (score < 80) return "text-green-700 dark:text-green-400";
  return "text-emerald-700 dark:text-emerald-400";
}

function computeStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (password.length >= 24) score += 10;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  if (password.length >= 20) score += 10;
  const variety = (/[A-Z]/.test(password) ? 1 : 0) + (/[a-z]/.test(password) ? 1 : 0) + (/[0-9]/.test(password) ? 1 : 0) + (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
  if (variety >= 3) score += 10;
  if (variety >= 4) score += 10;
  return Math.min(100, score);
}

function generatePassword(length: number, chars: CharSet): string {
  let charset = "";
  if (chars.uppercase) charset += UPPERCASE;
  if (chars.lowercase) charset += LOWERCASE;
  if (chars.numbers) charset += NUMBERS;
  if (chars.symbols) charset += SYMBOLS;

  if (!charset) return "";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  let guaranteed = "";
  if (chars.uppercase) guaranteed += UPPERCASE[array[0] % UPPERCASE.length];
  if (chars.lowercase) guaranteed += LOWERCASE[array[1] % LOWERCASE.length];
  if (chars.numbers) guaranteed += NUMBERS[array[2] % NUMBERS.length];
  if (chars.symbols) guaranteed += SYMBOLS[array[3] % SYMBOLS.length];

  const result = password.split("");
  for (let i = 0; i < guaranteed.length; i++) {
    const pos = array[i + 4] % length;
    result[pos] = guaranteed[i];
  }

  return result.join("");
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [chars, setChars] = useState<CharSet>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [password, setPassword] = useState("");

  const handleGenerate = useCallback(() => {
    setPassword(generatePassword(length, chars));
  }, [length, chars]);

  const toggleChar = useCallback((key: keyof CharSet) => {
    setChars((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const anySelected = Object.values(chars).some(Boolean);
  const strength = password ? computeStrength(password) : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="password-length" className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <span>Password Length: {length}</span>
          </label>
          <input
            id="password-length"
            type="range"
            min={4}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-zinc-900 dark:accent-zinc-50"
            aria-label="Password length"
          />
          <div className="flex justify-between text-xs text-zinc-600">4<span className="text-zinc-500">128</span></div>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Character Types</legend>
          <div className="flex flex-wrap gap-4">
            {([
              { key: "uppercase" as const, label: "Uppercase (A-Z)" },
              { key: "lowercase" as const, label: "Lowercase (a-z)" },
              { key: "numbers" as const, label: "Numbers (0-9)" },
              { key: "symbols" as const, label: "Symbols (!@#$%...)" },
            ]).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={chars[key]}
                  onChange={() => toggleChar(key)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <Button onClick={handleGenerate} variant="primary" disabled={!anySelected}>
          Generate Password
        </Button>
      </div>

      {password && (
        <div className="mt-6 space-y-4">
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Generated Password</p>
              <CopyButton text={password} label="Copy Password" />
            </div>
            <pre className="overflow-x-auto break-all p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{password}</pre>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Password Strength</span>
              <span className={`text-sm font-semibold ${getStrengthTextColor(strength)}`}>{getStrengthLabel(strength)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div className={`h-full rounded-full transition-all ${getStrengthColor(strength)}`} style={{ width: `${strength}%` }} />
            </div>
            <div className="flex justify-between text-xs text-zinc-600">
              <span>Weak</span>
              <span>Very Strong</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
