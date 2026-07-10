"use client";
import { useState } from "react";
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="text-xs text-nuvora-600 hover:text-nuvora-700 font-medium">
      {copied ? "Copied!" : "Copy code"}
    </button>
  );
}
