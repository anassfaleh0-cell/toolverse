"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/constants";
import { Icon } from "@/components/shared/icon";

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-zinc-900 dark:text-zinc-50">
          {question}
        </span>
        <Icon name="ChevronDown" className={`size-5 shrink-0 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div
        className={`overflow-hidden transition-all ${
          isOpen ? "pb-5" : "max-h-0"
        }`}
        role="region"
      >
        <p className="text-zinc-600 dark:text-zinc-400">{answer}</p>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleToggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Everything you need to know about Nuvora
          </p>
        </div>
        <div className="mt-12 divide-y divide-zinc-200 dark:divide-zinc-800">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
