"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-in" | "slide-up" | "scale-in";
  delay?: number;
  threshold?: number;
  rootMargin?: string;
}

const animations = {
  "fade-in": "opacity-0 translate-y-4",
  "slide-up": "opacity-0 translate-y-8",
  "scale-in": "opacity-0 scale-95",
};

const visibleStyles = "opacity-100 translate-y-0 scale-100";

export function ScrollAnimation({
  children,
  className = "",
  animation = "fade-in",
  delay = 0,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
}: ScrollAnimationProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${animations[animation]} ${visible ? visibleStyles : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function StaggerGroup({
  children,
  className = "",
  baseDelay = 0,
  staggerMs = 100,
  animation = "slide-up",
}: {
  children: ReactNode[];
  className?: string;
  baseDelay?: number;
  staggerMs?: number;
  animation?: ScrollAnimationProps["animation"];
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <ScrollAnimation key={i} animation={animation} delay={baseDelay + i * staggerMs}>
          {child}
        </ScrollAnimation>
      ))}
    </div>
  );
}
