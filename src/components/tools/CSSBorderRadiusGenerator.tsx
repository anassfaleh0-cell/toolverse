"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card } from "@/components/ui";

export function CSSBorderRadiusGenerator() {
  const [tl, setTl] = useState(20);
  const [tr, setTr] = useState(20);
  const [br, setBr] = useState(20);
  const [bl, setBl] = useState(20);
  const [linked, setLinked] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastChanged = useRef<"tl" | "tr" | "br" | "bl">("tl");

  function updateAll(value: number) {
    setTl(value);
    setTr(value);
    setBr(value);
    setBl(value);
  }

  function handleChange(corner: "tl" | "tr" | "br" | "bl", value: number) {
    lastChanged.current = corner;
    if (linked) {
      updateAll(value);
    } else {
      switch (corner) {
        case "tl": setTl(value); break;
        case "tr": setTr(value); break;
        case "br": setBr(value); break;
        case "bl": setBl(value); break;
      }
    }
  }

  const cssCode = `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card variant="default" className="p-8">
        <div className="flex items-center justify-center">
          <div
            className="h-56 w-56 bg-gradient-to-br from-nuvora-400 to-nuvora-600"
            style={{ borderRadius: `${tl}px ${tr}px ${br}px ${bl}px` }}
          />
        </div>
      </Card>
      <Card variant="default" className="p-8">
        <div className="mb-4 flex items-center gap-2">
          <input type="checkbox" id="linked" checked={linked} onChange={(e) => setLinked(e.target.checked)} className="h-4 w-4 accent-nuvora-600" />
          <label htmlFor="linked" className="text-sm font-medium text-text-primary">Link all corners</label>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Top-Left: {tl}px</label>
            <input type="range" min={0} max={100} value={tl} onChange={(e) => handleChange("tl", Number(e.target.value))} className="w-full accent-nuvora-600" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Top-Right: {tr}px</label>
            <input type="range" min={0} max={100} value={tr} onChange={(e) => handleChange("tr", Number(e.target.value))} className="w-full accent-nuvora-600" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Bottom-Right: {br}px</label>
            <input type="range" min={0} max={100} value={br} onChange={(e) => handleChange("br", Number(e.target.value))} className="w-full accent-nuvora-600" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Bottom-Left: {bl}px</label>
            <input type="range" min={0} max={100} value={bl} onChange={(e) => handleChange("bl", Number(e.target.value))} className="w-full accent-nuvora-600" />
          </div>
        </div>
      </Card>
      <Card variant="default" className="p-8">
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">CSS Code</label>
          <textarea
            readOnly
            value={cssCode}
            rows={2}
            className="w-full resize-none rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
          <Button variant="primary" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy CSS"}
          </Button>
          {copied && <Alert variant="success" className="mt-2">Copied to clipboard</Alert>}
        </div>
      </Card>
    </div>
  );
}
