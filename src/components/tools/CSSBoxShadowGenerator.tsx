"use client";

import { useState } from "react";
import { Button, Alert, Card } from "@/components/ui";

function opacityToHex(opacity: number): string {
  const val = Math.round(opacity * 255);
  return val.toString(16).padStart(2, "0");
}

export function CSSBoxShadowGenerator() {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(4);
  const [blur, setBlur] = useState(12);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(0.15);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const shadow = `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}${opacityToHex(opacity)}${inset ? " inset" : ""}`;
  const cssCode = `box-shadow: ${shadow};`;

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
            className="flex h-48 w-48 items-center justify-center rounded-xl bg-surface text-sm font-medium text-text-primary"
            style={{ boxShadow: shadow }}
          >
            Preview
          </div>
        </div>
      </Card>
      <Card variant="default" className="p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Offset X: {offsetX}px</label>
            <input type="range" min={-50} max={50} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="w-full accent-nuvora-600" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Offset Y: {offsetY}px</label>
            <input type="range" min={-50} max={50} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="w-full accent-nuvora-600" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Blur: {blur}px</label>
            <input type="range" min={0} max={100} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-nuvora-600" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Spread: {spread}px</label>
            <input type="range" min={-50} max={50} value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-full accent-nuvora-600" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-lg border border-border-subtle bg-surface" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Opacity: {opacity.toFixed(2)}</label>
            <input type="range" min={0} max={1} step={0.01} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-nuvora-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input type="checkbox" id="inset" checked={inset} onChange={(e) => setInset(e.target.checked)} className="h-4 w-4 accent-nuvora-600" />
          <label htmlFor="inset" className="text-sm font-medium text-text-primary">Inset</label>
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
