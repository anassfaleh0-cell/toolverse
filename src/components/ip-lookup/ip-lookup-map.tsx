"use client";

import { useRef, useEffect, useState } from "react";

interface IpLookupMapProps {
  lat: number;
  lon: number;
  title: string;
}

export function IpLookupMap({ lat, lon, title }: IpLookupMapProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05}%2C${lat - 0.05}%2C${lon + 0.05}%2C${lat + 0.05}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="relative aspect-[2/1] w-full bg-zinc-100 dark:bg-zinc-800">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-8 animate-pulse rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title={`Map showing ${title}`}
        className={`h-full w-full border-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        allowFullScreen
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
