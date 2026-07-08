import { cn } from "@/lib/utils";

interface IllustrationProps {
  className?: string;
}

export function NetworkIllustration({ className }: IllustrationProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      fill="none"
      className={cn("size-full", className)}
      aria-hidden="true"
    >
      <rect width="400" height="200" rx="16" className="fill-zinc-100 dark:fill-zinc-800/50" />
      <circle cx="80" cy="100" r="28" className="fill-blue-500/20 stroke-blue-500" strokeWidth="2" />
      <circle cx="200" cy="60" r="22" className="fill-indigo-500/20 stroke-indigo-500" strokeWidth="2" />
      <circle cx="200" cy="140" r="22" className="fill-violet-500/20 stroke-violet-500" strokeWidth="2" />
      <circle cx="320" cy="100" r="22" className="fill-emerald-500/20 stroke-emerald-500" strokeWidth="2" />
      <line x1="108" y1="100" x2="178" y2="60" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="108" y1="100" x2="178" y2="140" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="222" y1="60" x2="298" y2="100" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" />
      <line x1="222" y1="140" x2="298" y2="100" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" />
      <circle cx="80" cy="100" r="10" className="fill-blue-500" />
      <circle cx="200" cy="60" r="8" className="fill-indigo-500" />
      <circle cx="200" cy="140" r="8" className="fill-violet-500" />
      <circle cx="320" cy="100" r="8" className="fill-emerald-500" />
    </svg>
  );
}

export function CodeIllustration({ className }: IllustrationProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      fill="none"
      className={cn("size-full", className)}
      aria-hidden="true"
    >
      <rect width="400" height="200" rx="16" className="fill-zinc-100 dark:fill-zinc-800/50" />
      <rect x="60" y="50" width="280" height="24" rx="6" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="60" y="86" width="200" height="18" rx="4" className="fill-blue-400/30 dark:fill-blue-500/20" />
      <rect x="60" y="114" width="240" height="18" rx="4" className="fill-emerald-400/30 dark:fill-emerald-500/20" />
      <rect x="60" y="142" width="160" height="18" rx="4" className="fill-amber-400/30 dark:fill-amber-500/20" />
      <circle cx="340" cy="62" r="4" className="fill-red-400" />
      <circle cx="350" cy="62" r="4" className="fill-amber-400" />
      <circle cx="360" cy="62" r="4" className="fill-emerald-400" />
    </svg>
  );
}

export function ShieldIllustration({ className }: IllustrationProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      fill="none"
      className={cn("size-full", className)}
      aria-hidden="true"
    >
      <rect width="400" height="200" rx="16" className="fill-zinc-100 dark:fill-zinc-800/50" />
      <path
        d="M200 40l90 30v40c0 55-40 80-90 90-50-10-90-35-90-90V70l90-30z"
        className="fill-emerald-500/10 stroke-emerald-500"
        strokeWidth="2"
      />
      <path
        d="M185 110l-15-15-10 10 25 25 40-40-10-10-30 30z"
        className="fill-emerald-500"
      />
      <rect x="150" y="148" width="100" height="3" rx="1.5" className="fill-emerald-300 dark:fill-emerald-600" />
      <rect x="170" y="156" width="60" height="3" rx="1.5" className="fill-emerald-300 dark:fill-emerald-600" />
    </svg>
  );
}

export function ToolsIllustration({ className }: IllustrationProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      fill="none"
      className={cn("size-full", className)}
      aria-hidden="true"
    >
      <rect width="400" height="200" rx="16" className="fill-zinc-100 dark:fill-zinc-800/50" />
      <rect x="50" y="60" width="140" height="80" rx="12" className="fill-white stroke-zinc-200 dark:fill-zinc-900 dark:stroke-zinc-700" strokeWidth="1.5" />
      <rect x="70" y="80" width="100" height="6" rx="3" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="70" y="96" width="70" height="4" rx="2" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="70" y="108" width="85" height="4" rx="2" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="70" y="120" width="50" height="4" rx="2" className="fill-zinc-200 dark:fill-zinc-700" />

      <rect x="210" y="60" width="140" height="80" rx="12" className="fill-white stroke-zinc-200 dark:fill-zinc-900 dark:stroke-zinc-700" strokeWidth="1.5" />
      <rect x="230" y="80" width="100" height="6" rx="3" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="230" y="96" width="70" height="4" rx="2" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="230" y="108" width="85" height="4" rx="2" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="230" y="120" width="50" height="4" rx="2" className="fill-zinc-200 dark:fill-zinc-700" />
    </svg>
  );
}

export function WebsiteIllustration({ className }: IllustrationProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      fill="none"
      className={cn("size-full", className)}
      aria-hidden="true"
    >
      <rect width="400" height="200" rx="16" className="fill-zinc-100 dark:fill-zinc-800/50" />
      <rect x="80" y="50" width="240" height="120" rx="8" className="fill-white stroke-zinc-200 dark:fill-zinc-900 dark:stroke-zinc-700" strokeWidth="1.5" />
      <rect x="80" y="50" width="240" height="24" rx="8" className="fill-zinc-100 dark:fill-zinc-800" />
      <rect x="80" y="50" width="240" height="8" rx="4" className="fill-zinc-100 dark:fill-zinc-800" />
      <circle cx="100" cy="62" r="4" className="fill-red-400" />
      <circle cx="112" cy="62" r="4" className="fill-amber-400" />
      <circle cx="124" cy="62" r="4" className="fill-emerald-400" />
      <rect x="110" y="92" width="120" height="8" rx="4" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="110" y="108" width="180" height="6" rx="3" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="110" y="120" width="150" height="6" rx="3" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="110" y="132" width="160" height="6" rx="3" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="110" y="144" width="100" height="6" rx="3" className="fill-zinc-200 dark:fill-zinc-700" />
      <rect x="270" y="92" width="30" height="30" rx="6" className="fill-emerald-100 dark:fill-emerald-900/50" />
      <path d="M282 112l-6-6 2-2 4 4 8-8 2 2-10 10z" className="fill-emerald-500" />
    </svg>
  );
}
