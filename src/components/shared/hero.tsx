"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { getRegisteredToolCount, getCategories } from "@/lib/registry";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/shared/icon";
import { HERO_TAGLINE, HERO_SUBTITLE } from "@/lib/constants";

const trustBadges = [
  { icon: "Shield", label: "Privacy First" },
  { icon: "Zap", label: "Instant Results" },
  { icon: "Smile", label: "100% Free" },
  { icon: "Smartphone", label: "Works on Mobile" },
];

function getStats(toolCount: number, catCount: number) {
  return [
    { value: `${toolCount.toLocaleString()}+`, label: "Free Tools" },
    { value: `${catCount.toLocaleString()}`, label: "Categories" },
    { value: "No Signup", label: "Just Results" },
    { value: "Zero Uploads", label: "Full Privacy" },
  ];
}

export function Hero() {
  const toolCount = getRegisteredToolCount();
  const catCount = getCategories().length;
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => { setMounted(true); }, []);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setCount(toolCount); return; }
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * toolCount));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [toolCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    (e.currentTarget as HTMLElement).style.setProperty("--mouse-x", String(x));
    (e.currentTarget as HTMLElement).style.setProperty("--mouse-y", String(y));
  }, []);

  return (
    <section className="relative overflow-hidden" onMouseMove={handleMouseMove} style={{ "--mouse-x": "0", "--mouse-y": "0" } as React.CSSProperties}>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-nuvora-50 via-surface to-aurora-50 dark:from-nuvora-950/30 dark:via-background dark:to-aurora-950/20" />
      <div className="absolute inset-0 -z-10 opacity-25 dark:opacity-15 animate-hero-gradient" />

      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: "linear-gradient(var(--color-nuvora-600) 1px, transparent 1px), linear-gradient(90deg, var(--color-nuvora-600) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-nuvora-200 bg-nuvora-50/80 px-4 py-1.5 text-xs font-medium text-nuvora-700 backdrop-blur-sm dark:border-nuvora-700/50 dark:bg-nuvora-900/80 dark:text-nuvora-200">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-nuvora-400 opacity-75 animate-scale-pulse" />
              <span className="relative inline-flex size-2 rounded-full bg-nuvora-500" />
            </span>
            {toolCount.toLocaleString()}+ free tools &mdash; 100% browser-based &bull; No signup
          </div>

          <div className="animate-fade-slide-up delay-0">
            <div className="mb-4 flex justify-center opacity-60">
              <Logo size="lg" />
            </div>
            <h1 className="text-display font-bold tracking-tight text-text-primary leading-[1.1]">
              {HERO_TAGLINE}
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary leading-relaxed animate-fade-slide-up delay-[150ms]">
            {HERO_SUBTITLE}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-slide-up delay-[300ms]">
            <Link
              href="/tools"
              className="nuvora-button-primary inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-base"
            >
              Explore All Tools
              <Icon name="ArrowRight" className="size-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface/80 px-7 py-3.5 text-base font-semibold text-text-secondary backdrop-blur-sm transition-all duration-200 ease-out hover:border-nuvora-300 hover:text-nuvora-600 hover:shadow-sm active:scale-[0.97]"
            >
              <Icon name="HelpCircle" className="size-4" />
              How It Works
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 animate-fade-slide-up delay-[450ms]">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 text-sm text-text-secondary transition-all duration-200 hover:text-text-primary">
                <Icon name={badge.icon} className="size-4" />
                <span className="font-medium">{badge.label}</span>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-14 flex items-center justify-center gap-8 sm:gap-14 animate-fade-slide-up delay-[550ms]">
            <div className="text-center">
              <p className="text-5xl font-bold text-nuvora-600 dark:text-nuvora-400 tabular-nums animate-pulse-slow">
                {(mounted ? count : toolCount).toLocaleString()}+
              </p>
              <p className="mt-2 text-sm font-medium text-text-secondary">Free Tools</p>
            </div>
            <div className="h-14 w-px bg-border-subtle" />
            <div className="text-center">
              <p className="text-3xl font-bold text-text-primary tabular-nums">{catCount}</p>
              <p className="mt-2 text-sm font-medium text-text-secondary">Categories</p>
            </div>
          </div>

          <div ref={statsRef} className="mx-auto mt-14 max-w-2xl text-center">
            <p
              className={`text-base text-text-secondary transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            >
              <span className="font-semibold text-text-primary">Every tool runs entirely in your browser</span> — nothing is sent to a server
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border-subtle bg-surface/60 backdrop-blur-sm dark:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4 sm:gap-8">
            {getStats(toolCount, catCount).map((stat) => (
              <div key={stat.label}>
                <p className="text-sm font-bold text-nuvora-700 dark:text-nuvora-300">{stat.value}</p>
                <p className="mt-0.5 text-xs text-text-tertiary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
