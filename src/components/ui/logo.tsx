import { useId } from "react";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import Link from "next/link";

interface LogoProps {
  variant?: "horizontal" | "vertical" | "icon";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
}

const ICON_SIZES = { sm: 24, md: 32, lg: 48, xl: 64 } as const;
const TEXT_SIZES = { sm: "text-base", md: "text-xl", lg: "text-3xl", xl: "text-5xl" } as const;

function LogoIcon({ size, gradientId }: { size: number; gradientId: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#6366f1" />
          <stop offset=".55" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill={`url(#${gradientId})`} />
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" stroke="white" strokeOpacity={0.15} strokeWidth="0.5" />
      <path d="M16 5 L26 11 L26 21 L16 27 L6 21 L6 11 Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" fill="white" fillOpacity={0.12} />
      <path d="M16.5 7 L11 16 L14.5 16 L11.5 24.5 L21 13 L17 13 Z" fill="white" />
    </svg>
  );
}

export function Logo({ variant = "horizontal", className, size = "md", href }: LogoProps) {
  const gradientId = useId();
  const iconSize = ICON_SIZES[size];
  const textSize = TEXT_SIZES[size];

  const icon = <LogoIcon size={iconSize} gradientId={gradientId} />;
  const wordmark = (
    <span className={cn(
      "font-bold tracking-tight bg-gradient-to-r from-nuvora-600 via-nuvora-500 to-nuvora-700 bg-clip-text text-transparent dark:from-nuvora-400 dark:via-nuvora-300 dark:to-nuvora-400",
      textSize,
    )}>
      {SITE_NAME}
    </span>
  );

  const inner = () => {
    switch (variant) {
      case "horizontal":
        return <div className={cn("inline-flex items-center gap-2.5", className)}>{icon}{wordmark}</div>;
      case "vertical":
        return <div className={cn("inline-flex flex-col items-center gap-1.5", className)}>{icon}{wordmark}</div>;
      case "icon":
        return <div className={className}>{icon}</div>;
    }
  };

  if (href) {
    return <Link href={href} aria-label={`${SITE_NAME} home`}>{inner()}</Link>;
  }

  return inner();
}

export function NuvoraLogo({ className, animated }: { className?: string; animated?: boolean }) {
  const gid = useId();
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label={`${SITE_NAME} home`}>
      <LogoIcon size={36} gradientId={gid} />
      <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-nuvora-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent dark:from-nuvora-400 dark:via-blue-400 dark:to-cyan-400">
        {SITE_NAME}
      </span>
    </Link>
  );
}
