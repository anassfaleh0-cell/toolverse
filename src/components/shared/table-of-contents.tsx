"use client";
import { useState } from "react";
import { Icon } from "@/components/shared/icon";

interface TocItem { id: string; label: string; level: number }

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="hidden lg:block sticky top-24 w-56 shrink-0">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary mb-3">On this page</h3>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
              <a href={`#${item.id}`} className="text-sm text-text-secondary hover:text-nuvora-600 transition-colors">{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="lg:hidden">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm font-medium text-text-secondary py-2">
          <Icon name="List" className="size-4" />
          Table of Contents
        </button>
        {open && (
          <ul className="space-y-2 pb-4">
            {items.map(item => (
              <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 16}px` }}>
                <a href={`#${item.id}`} className="text-sm text-text-secondary hover:text-nuvora-600" onClick={() => setOpen(false)}>{item.label}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
