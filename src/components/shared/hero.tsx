"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getRegisteredToolCount } from "@/lib/registry";
import { Logo } from "@/components/ui/logo";
import { HERO_TAGLINE, HERO_SUBTITLE } from "@/lib/constants";

const trustBadges = [
  { icon: "🔒", label: "Privacy First" },
  { icon: "⚡", label: "Instant Results" },
  { icon: "🆓", label: "100% Free" },
  { icon: "📱", label: "Works on Mobile" },
];

const floatingIcons = [
  { icon: "🛠️", x: -120, y: -80, intensity: 1 },
  { icon: "📄", x: 140, y: -40, intensity: 0.8 },
  { icon: "🖼️", x: -160, y: 60, intensity: 1.2 },
  { icon: "🔒", x: 0, y: -120, intensity: 0.6 },
  { icon: "🌐", x: 130, y: 80, intensity: 0.9 },
  { icon: "⚡", x: -60, y: 130, intensity: 1.1 },
];

function getStats(toolCount: number) {
  return [
    { value: `${toolCount.toLocaleString()}+`, label: "Free Tools" },
    { value: "100% Free", label: "No Hidden Fees" },
    { value: "No Signup", label: "Just Results" },
    { value: "Privacy First", label: "Zero Tracking" },
  ];
}

export function Hero() {
  const toolCount = getRegisteredToolCount();
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => { setMounted(true); }, []);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
    setMousePos({ x: e.clientX - rect.left - rect.width / 2, y: e.clientY - rect.top - rect.height / 2 });
  }, []);

  const fadeUp = prefersReduced ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <section className="relative overflow-hidden" onMouseMove={handleMouseMove}>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-nuvora-50 via-surface to-aurora-50 dark:from-nuvora-950/30 dark:via-background dark:to-aurora-950/20" />
      <motion.div
        className="absolute inset-0 -z-10 opacity-30 dark:opacity-20"
        animate={prefersReduced ? {} : {
          background: [
            "radial-gradient(40% 40% at 25% 25%, rgba(124,58,237,0.15), transparent)",
            "radial-gradient(40% 40% at 75% 75%, rgba(6,182,212,0.15), transparent)",
            "radial-gradient(40% 40% at 50% 50%, rgba(59,130,246,0.12), transparent)",
            "radial-gradient(40% 40% at 25% 25%, rgba(124,58,237,0.15), transparent)",
          ]
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <motion.div className="text-center" {...fadeUp} transition={{ duration: 0.6 }}>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-nuvora-200 bg-nuvora-50/80 px-4 py-1.5 text-xs font-medium text-nuvora-700 backdrop-blur-sm dark:border-nuvora-800 dark:bg-nuvora-950/50 dark:text-nuvora-300">
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

          <motion.div animate={prefersReduced ? {} : { y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <Logo size="xl" />
          </motion.div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {HERO_TAGLINE}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            {HERO_SUBTITLE}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={prefersReduced ? {} : { scale: 1.03 }} whileTap={prefersReduced ? {} : { scale: 0.97 }}>
              <Link href="/tools" className="inline-flex items-center gap-2 rounded-xl bg-nuvora-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-nuvora-600/25 transition-all hover:bg-nuvora-700">
                Explore All Tools
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="size-4"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </motion.div>
            <motion.div whileHover={prefersReduced ? {} : { scale: 1.03 }}>
              <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface/80 px-7 py-3.5 text-base font-semibold text-text-secondary backdrop-blur-sm transition-all hover:border-nuvora-300 hover:text-nuvora-600 hover:shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                How It Works
              </Link>
            </motion.div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                className="flex items-center gap-1.5 text-sm text-text-secondary"
                initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={prefersReduced ? {} : { scale: 1.05, y: -2 }}
              >
                <span>{badge.icon}</span>
                <span className="font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="mx-auto mt-12 flex items-center justify-center gap-8 sm:gap-12">
            <div className="text-center">
              <motion.p
                className="text-5xl font-bold text-nuvora-600 dark:text-nuvora-400"
                animate={prefersReduced ? {} : { scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {(mounted ? count : toolCount).toLocaleString()}+
              </motion.p>
              <p className="mt-2 text-sm font-medium text-text-secondary">Free Tools</p>
            </div>
            <div className="hidden h-16 w-px bg-border-subtle sm:block" />
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary">100%</p>
              <p className="mt-2 text-sm font-medium text-text-secondary">Browser Based</p>
            </div>
          </div>

          <div ref={statsRef} className="mx-auto mt-12 max-w-2xl text-center">
            <motion.p
              className="text-lg text-text-secondary"
              initial={prefersReduced || statsVisible ? {} : { opacity: 0, y: 10 }}
              animate={statsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="font-semibold text-text-primary">Join 100,000+ users</span> who trust Nuvora daily
            </motion.p>
          </div>
        </motion.div>
      </div>

      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute select-none text-2xl opacity-20 dark:opacity-15"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          initial={prefersReduced ? { opacity: 0 } : { x: item.x, y: item.y, opacity: 0.2 }}
          animate={prefersReduced ? { opacity: 0 } : {
            x: [item.x, item.x + 15 * item.intensity, item.x - 10 * item.intensity, item.x],
            y: [item.y, item.y - 12 * item.intensity, item.y + 8 * item.intensity, item.y],
          }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {item.icon}
        </motion.div>
      ))}

      <div className="border-t border-border-subtle bg-surface/60 backdrop-blur-sm dark:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4 sm:gap-8">
            {getStats(toolCount).map((stat) => (
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