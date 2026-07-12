"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui";

export function FontSizeConverter() {
  const [baseSize, setBaseSize] = useState("16");
  const [px, setPx] = useState("");
  const [rem, setRem] = useState("");
  const [em, setEm] = useState("");
  const [pt, setPt] = useState("");
  const lastEdited = useRef<string | null>(null);

  function handleBaseChange(val: string) {
    try {
      setBaseSize(val);
      const base = parseFloat(val);
      if (isNaN(base) || base <= 0) return;
      if (lastEdited.current === "px" && px) {
        const p = parseFloat(px);
        if (!isNaN(p)) { setRem((p / base).toFixed(2)); setEm((p / base).toFixed(2)); setPt((p * 0.75).toFixed(2)); }
      } else if (lastEdited.current === "rem" && rem) {
        const r = parseFloat(rem);
        if (!isNaN(r)) { setPx((r * base).toFixed(2)); setEm((r * base / base).toFixed(2)); setPt((r * base * 0.75).toFixed(2)); }
      } else if (lastEdited.current === "em" && em) {
        const e = parseFloat(em);
        if (!isNaN(e)) { setPx((e * base).toFixed(2)); setRem((e * base / base).toFixed(2)); setPt((e * base * 0.75).toFixed(2)); }
      } else if (lastEdited.current === "pt" && pt) {
        const t = parseFloat(pt);
        if (!isNaN(t)) { const p = t / 0.75; setPx(p.toFixed(2)); setRem((p / base).toFixed(2)); setEm((p / base).toFixed(2)); }
      }
    } catch {
    }
  }

  function handlePxChange(val: string) {
    try {
      setPx(val);
      lastEdited.current = "px";
      const base = parseFloat(baseSize);
      if (isNaN(base) || base <= 0) return;
      const p = parseFloat(val);
      if (isNaN(p) || val === "") { setRem(""); setEm(""); setPt(""); return; }
      setRem((p / base).toFixed(2));
      setEm((p / base).toFixed(2));
      setPt((p * 0.75).toFixed(2));
    } catch {
    }
  }

  function handleRemChange(val: string) {
    try {
      setRem(val);
      lastEdited.current = "rem";
      const base = parseFloat(baseSize);
      if (isNaN(base) || base <= 0) return;
      const r = parseFloat(val);
      if (isNaN(r) || val === "") { setPx(""); setEm(""); setPt(""); return; }
      const p = r * base;
      setPx(p.toFixed(2));
      setEm(p.toFixed(2));
      setPt((p * 0.75).toFixed(2));
    } catch {
    }
  }

  function handleEmChange(val: string) {
    try {
      setEm(val);
      lastEdited.current = "em";
      const base = parseFloat(baseSize);
      if (isNaN(base) || base <= 0) return;
      const e = parseFloat(val);
      if (isNaN(e) || val === "") { setPx(""); setRem(""); setPt(""); return; }
      const p = e * base;
      setPx(p.toFixed(2));
      setRem(p.toFixed(2));
      setPt((p * 0.75).toFixed(2));
    } catch {
    }
  }

  function handlePtChange(val: string) {
    try {
      setPt(val);
      lastEdited.current = "pt";
      const base = parseFloat(baseSize);
      if (isNaN(base) || base <= 0) return;
      const t = parseFloat(val);
      if (isNaN(t) || val === "") { setPx(""); setRem(""); setEm(""); return; }
      const p = t / 0.75;
      setPx(p.toFixed(2));
      setRem((p / base).toFixed(2));
      setEm((p / base).toFixed(2));
    } catch {
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Base Font Size (px)</label>
        <input
          type="number"
          value={baseSize}
          onChange={(e) => handleBaseChange(e.target.value)}
          placeholder="16"
          aria-label="Base font size"
          className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
        />
      </div>

      <Card variant="default" className="p-8">
        <p className="mb-4 text-sm text-text-secondary">Base Size: {baseSize}px</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">px</label>
            <input
              type="number"
              value={px}
              onChange={(e) => handlePxChange(e.target.value)}
              placeholder="16"
              aria-label="Pixels"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">rem</label>
            <input
              type="number"
              value={rem}
              onChange={(e) => handleRemChange(e.target.value)}
              placeholder="1"
              aria-label="REM"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">em</label>
            <input
              type="number"
              value={em}
              onChange={(e) => handleEmChange(e.target.value)}
              placeholder="1"
              aria-label="EM"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">pt</label>
            <input
              type="number"
              value={pt}
              onChange={(e) => handlePtChange(e.target.value)}
              placeholder="12"
              aria-label="Points"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
