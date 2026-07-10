interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
}

const sizeMap = { sm: 8, md: 10, lg: 14, xl: 20 };

export function Logo({ className = "", size = "md", showWordmark = true }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 dark:hidden"
        style={{ width: s * 4, height: s * 4 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-light" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#7c3aed" />
            <stop offset=".5" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill="url(#logo-light)" />
        <path d="M20 6l12 7v14l-12 7-12-7V13l12-7z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="white" fillOpacity="0.15" />
        <path d="M16 22l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden shrink-0 dark:block"
        style={{ width: s * 4, height: s * 4 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-dark" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#a78bfa" />
            <stop offset=".5" stopColor="#60a5fa" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill="url(#logo-dark)" />
        <path d="M20 6l12 7v14l-12 7-12-7V13l12-7z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="white" fillOpacity="0.2" />
        <path d="M16 22l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showWordmark && (
        <span className={`font-bold tracking-tight bg-gradient-to-r from-nuvora-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent dark:from-nuvora-400 dark:via-blue-400 dark:to-cyan-400 ${size === "sm" ? "text-base" : size === "md" ? "text-lg" : size === "lg" ? "text-xl" : "text-3xl"}`}>
          Nuvora
        </span>
      )}
    </div>
  );
}

export function NuvoraLogo({ className = "" }: { className?: string }) {
  return (
    <a href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Nuvora home">
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-nuvora-500 via-blue-500 to-cyan-500 shadow-sm ring-1 ring-nuvora-500/20 transition-shadow group-hover:shadow-md group-hover:ring-nuvora-500/40 dark:from-nuvora-400 dark:via-blue-400 dark:to-cyan-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="size-5" aria-hidden="true">
          <path d="M12 3l9 5.5v11L12 21l-9-5.5v-11L12 3z" />
          <path d="M9 14l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-nuvora-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent dark:from-nuvora-400 dark:via-blue-400 dark:to-cyan-400">
        Nuvora
      </span>
    </a>
  );
}