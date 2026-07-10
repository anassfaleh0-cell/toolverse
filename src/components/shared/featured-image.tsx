"use client";
import { useState } from "react";

export function generateAuroraSvg(title: string): string {
  const escaped = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const lines: string[] = [];
  const words = escaped.split(" ");
  let currentLine = "";
  for (const word of words) {
    if ((currentLine + " " + word).length > 35) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = (currentLine ? currentLine + " " : "") + word;
    }
  }
  if (currentLine) lines.push(currentLine);
  const textY = lines.length === 1 ? 360 : lines.length === 2 ? 340 : 310;
  const lineHeight = 64;

  const textElements = lines
    .map((line, i) => `<text x="600" y="${textY + i * lineHeight}" font-family="system-ui, -apple-system, sans-serif" font-size="${lines.length > 2 ? 40 : 48}" font-weight="700" fill="white" text-anchor="middle" opacity="0.95">${line}</text>`)
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="aurora" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6366f1"/>
        <stop offset="35%" stop-color="#8b5cf6"/>
        <stop offset="65%" stop-color="#06b6d4"/>
        <stop offset="100%" stop-color="#22d3ee"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#aurora)"/>
    <g transform="translate(560,540)">
      <rect x="0" y="0" width="80" height="24" rx="4" fill="white" opacity="0.15"/>
      <text x="40" y="17" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="white" text-anchor="middle" opacity="0.7">NUVORA</text>
    </g>
    ${textElements}
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function FeaturedImage({ src, title }: { src: string; title: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle">
      <img
        src={imgSrc}
        alt={title}
        className="aspect-video w-full object-cover"
        onError={() => setImgSrc(generateAuroraSvg(title))}
      />
    </div>
  );
}
