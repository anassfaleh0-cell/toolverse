"use client";
import { useState } from "react";

function generateGradientSvg(title: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#a855f7"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><text x="60" y="315" font-family="system-ui,sans-serif" font-size="48" font-weight="700" fill="white" opacity="0.9">${title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function FeaturedImage({ src, title }: { src: string; title: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <div className="mb-8 overflow-hidden rounded-2xl">
      <img
        src={imgSrc}
        alt={title}
        className="aspect-[1200/630] w-full object-cover"
        onError={() => setImgSrc(generateGradientSvg(title))}
      />
    </div>
  );
}
