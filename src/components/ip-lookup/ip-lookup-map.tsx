interface IpLookupMapProps {
  lat: number;
  lon: number;
  title: string;
}

export function IpLookupMap({ lat, lon, title }: IpLookupMapProps) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05}%2C${lat - 0.05}%2C${lon + 0.05}%2C${lat + 0.05}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="relative min-h-[280px] w-full sm:min-h-[400px]">
      <iframe
        src={src}
        title={`Map showing ${title}`}
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
