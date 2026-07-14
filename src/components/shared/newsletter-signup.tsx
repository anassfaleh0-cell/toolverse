"use client";
import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  if (subscribed) {
    return (
      <div className="rounded-2xl border border-aurora-200 bg-aurora-50 p-8 text-center dark:border-aurora-800 dark:bg-aurora-950/30">
        <p className="text-lg font-semibold text-aurora-700 dark:text-aurora-300">You&apos;re subscribed! 🎉</p>
        <p className="mt-2 text-sm text-aurora-700 dark:text-aurora-400">We&apos;ll keep you posted on new tools and features.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-3">
      <label htmlFor="newsletter-email-input" className="sr-only">Email address</label>
      <input
        id="newsletter-email-input"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        className="min-w-0 flex-1 rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-all focus:border-nuvora-400 focus:ring-4 focus:ring-nuvora-100 dark:focus:border-nuvora-600 dark:focus:ring-nuvora-900/30"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-nuvora-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-nuvora-700 active:scale-[0.97]"
      >
        Subscribe
      </button>
    </form>
  );
}
