import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const s = (searchParams.get("q") || "").trim();
    let r = 0, g = 0, b = 0;
    const hex = s.match(/^#?([0-9a-f]{6})$/i);
    if (hex) { const n = parseInt(hex[1], 16); r = (n >> 16) & 255; g = (n >> 8) & 255; b = n & 255; }
    else {
      const rgb = s.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
      if (rgb) { r = parseInt(rgb[1]); g = parseInt(rgb[2]); b = parseInt(rgb[3]); }
      else return NextResponse.json({ error: "Enter HEX (#ff6600) or RGB (rgb(255,102,0))" }, { status: 400 });
    }
    const hexOut = "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
    const rgbOut = `rgb(${r}, ${g}, ${b})`;
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const mx = Math.max(rn, gn, bn), mn = Math.min(rn, gn, bn);
    const l = (mx + mn) / 2;
    let h = 0, s2 = 0;
    if (mx !== mn) {
      const d = mx - mn;
      s2 = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (mx === gn) h = ((bn - rn) / d + 2) / 6;
      else h = ((rn - gn) / d + 4) / 6;
    }
    const hslOut = `hsl(${Math.round(h * 360)}, ${Math.round(s2 * 100)}%, ${Math.round(l * 100)}%)`;
    return NextResponse.json({ HEX: hexOut, RGB: rgbOut, HSL: hslOut, swatch: `background:${hexOut};` });
  } catch {
    return NextResponse.json({ error: "Failed to convert color" }, { status: 500 });
  }
}
