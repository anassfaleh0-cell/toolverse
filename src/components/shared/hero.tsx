"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => { setMounted(true); }, []);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
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
  }, [toolCount, prefersReduced]);

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
      <motion.div
        className="absolute inset-0 -z-10 opacity-25 dark:opacity-15"
        animate={prefersReduced ? {} : {
          background: [
            "radial-gradient(40% 40% at 25% 25%, rgba(124,58,237,0.12), transparent)",
            "radial-gradient(40% 40% at 75% 75%, rgba(6,182,212,0.12), transparent)",
            "radial-gradient(40% 40% at 50% 50%, rgba(59,130,246,0.1), transparent)",
            "radial-gradient(40% 40% at 25% 25%, rgba(124,58,237,0.12), transparent)",
          ]
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      {/* Subtle grid pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: "linear-gradient(var(--color-nuvora-600) 1px, transparent 1px), linear-gradient(90deg, var(--color-nuvora-600) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-nuvora-200 bg-nuvora-50/80 px-4 py-1.5 text-xs font-medium text-nuvora-700 backdrop-blur-sm dark:border-nuvora-700/50 dark:bg-nuvora-950 dark:text-nuvora-200">
            <span className="relative flex size-2">
              <motion.span
                className="absolute inline-flex size-full rounded-full bg-nuvora-400 opacity-75"
                animate={prefersReduced ? {} : { scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="relative inline-flex size-2 rounded-full bg-nuvora-500" />
            </span>
            {toolCount.toLocaleString()}+ free tools &mdash; 100% browser-based &bull; No signup
          </div>

          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4 flex justify-center opacity-60">
              <Logo size="lg" />
            </div>
            <h1 className="text-display font-bold tracking-tight text-text-primary leading-[1.1]">
              {HERO_TAGLINE}
            </h1>
          </motion.div>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary leading-relaxed"
            initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {HERO_SUBTITLE}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/tools"
              className="nuvora-button-primary inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-base"
            >
              Explore All Tools
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="size-4"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface/80 px-7 py-3.5 text-base font-semibold text-text-secondary backdrop-blur-sm transition-all duration-200 ease-out hover:border-nuvora-300 hover:text-nuvora-600 hover:shadow-sm active:scale-[0.97]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
              How It Works
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
            initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 text-sm text-text-secondary transition-all duration-200 hover:text-text-primary">
                <Icon name={badge.icon} className="size-4" />
                <span className="font-medium">{badge.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="mx-auto mt-14 flex items-center justify-center gap-8 sm:gap-14"
            initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center">
              <motion.p
                className="text-5xl font-bold text-nuvora-600 dark:text-nuvora-400 tabular-nums"
                animate={prefersReduced ? {} : { scale: [1, 1.02, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                {(mounted ? count : toolCount).toLocaleString()}+
              </motion.p>
              <p className="mt-2 text-sm font-medium text-text-secondary">Free Tools</p>
            </div>
            <div className="h-14 w-px bg-border-subtle" />
            <div className="text-center">
              <p className="text-3xl font-bold text-text-primary tabular-nums">{catCount}</p>
              <p className="mt-2 text-sm font-medium text-text-secondary">Categories</p>
            </div>
          </motion.div>

          <div ref={statsRef} className="mx-auto mt-14 max-w-2xl text-center">
            <motion.p
              className="text-base text-text-secondary"
              initial={prefersReduced || statsVisible ? {} : { opacity: 0, y: 10 }}
              animate={statsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="font-semibold text-text-primary">Every tool runs entirely in your browser</span> — nothing is sent to a server
            </motion.p>
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