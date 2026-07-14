"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

const CONTENT_TYPES = ["Blog Post", "Product Description", "Social Media Post", "Email Newsletter", "Landing Page Copy", "Advertisement"] as const;
const TONES = ["Professional", "Conversational", "Persuasive", "Informative", "Humorous", "Inspirational"] as const;
const LENGTHS = ["Short (150-300 words)", "Medium (300-600 words)", "Long (600-1000 words)"] as const;

const TONE_VOCAB: Record<string, { formal: string; casual: string; intensifier: string; connector: string }> = {
  Professional: { formal: "high", casual: "low", intensifier: "significantly", connector: "furthermore" },
  Conversational: { formal: "low", casual: "high", intensifier: "really", connector: "and" },
  Persuasive: { formal: "medium", casual: "medium", intensifier: "absolutely", connector: "because" },
  Informative: { formal: "high", casual: "low", intensifier: "notably", connector: "in addition" },
  Humorous: { formal: "low", casual: "high", intensifier: "super", connector: "plus" },
  Inspirational: { formal: "medium", casual: "high", intensifier: "truly", connector: "and" },
};

const ADJECTIVES: Record<string, string[]> = {
  Professional: ["strategic", "comprehensive", "innovative", "effective", "optimal", "scalable", "efficient", "sophisticated"],
  Conversational: ["awesome", "handy", "cool", "easy", "smart", "simple", "friendly", "fun"],
  Persuasive: ["exclusive", "limited", "proven", "guaranteed", "powerful", "remarkable", "unbeatable", "essential"],
  Informative: ["key", "notable", "relevant", "specific", "significant", "common", "important", "detailed"],
  Humorous: ["ridiculous", "hilarious", "silly", "crazy", "wild", "absurd", "epic", "wacky"],
  Inspirational: ["extraordinary", "remarkable", "transformative", "inspiring", "limitless", "powerful", "amazing", "unforgettable"],
};

const TRANSITIONS: Record<string, string[]> = {
  Professional: ["In addition", "Moreover", "Furthermore", "Consequently", "Specifically"],
  Conversational: ["Plus", "Also", "And", "So", "You know what"],
  Persuasive: ["Best of all", "What's more", "Even better", "Above all", "Of course"],
  Informative: ["Additionally", "In particular", "For example", "Notably", "In fact"],
  Humorous: ["Believe it or not", "As if that wasn't enough", "Plot twist", "Here's the kicker", "Fun fact"],
  Inspirational: ["Imagine this", "Here's the thing", "What if", "The truth is", "Picture this"],
};

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

function getTargetWordCount(length: string): number {
  if (length.startsWith("Short")) return 200;
  if (length.startsWith("Medium")) return 400;
  return 700;
}

function buildTopicVariations(topic: string, count: number): string[] {
  const words = topic.split(/\s+/).filter(Boolean);
  const vars: string[] = [];
  const phrases = [
    topic,
    ...words.length > 1 ? [words.join(" and "), words.slice(0, 2).join(" - ")] : [],
    ...words.length > 2 ? [words.slice(0, 3).join(" ")] : [],
    `${words[0] || topic} strategy`,
    `effective ${words[0] || topic}`,
    `${words[0] || topic} best practices`,
  ];
  for (let i = 0; i < count; i++) {
    vars.push(phrases[i % phrases.length]);
  }
  return vars;
}

function applyTone(text: string, tone: string): string {
  const adj = ADJECTIVES[tone] || ADJECTIVES.Professional;
  let result = text.replace(/\b(good|great|nice)\b/gi, () => pick(adj, Math.random()));
  return result;
}

function applyToneToSentence(text: string, tone: string, idx: number): string {
  const trans = TRANSITIONS[tone] || TRANSITIONS.Professional;
  const vocab = TONE_VOCAB[tone] || TONE_VOCAB.Professional;
  let result = text;
  if (idx > 0 && Math.random() > 0.4) {
    result = `${pick(trans, idx)}, ${result.toLowerCase()}`;
  }
  result = result.replace(/\b(very|really|extremely)\b/gi, vocab.intensifier);
  return result;
}

function generateBlogPost(topic: string, tone: string, length: string, audience: string): string {
  const topics = buildTopicVariations(topic, 5);
  const wordTarget = getTargetWordCount(length);
  const sections = 3 + Math.floor(wordTarget / 150);
  const headerWords = ["Understanding", "The Complete Guide to", "Why You Need", "How to Master", "The Importance of"];

  const title = `${pick(headerWords, 0)} ${topics[0]}`;
  const parts: string[] = [];
  parts.push(title);
  parts.push("");

  const intro = applyToneToSentence(
    audience
      ? `For ${audience}, understanding ${topics[0]} is more important than ever. This comprehensive guide explores everything you need to know about ${topics[1]}.`
      : `${topics[0]} is a crucial topic that deserves a deep dive. In this post, we will explore the key aspects of ${topics[1]} and how you can apply them.`,
    tone, 0
  );
  parts.push(intro);

  const sectionTopics = [
    `What Is ${topics[2]}?`,
    `Key Benefits of ${topics[3]}`,
    `How to Get Started with ${topics[0]}`,
    `Common Challenges and Solutions`,
    `Expert Tips for ${topics[4]}`,
    `Measuring Success with ${topics[2]}`,
    `Future Trends in ${topics[0]}`,
  ];

  for (let i = 0; i < sections && i < sectionTopics.length; i++) {
    parts.push("");
    parts.push(sectionTopics[i]);
    const body = applyToneToSentence(
      `${topics[i % topics.length]} plays a vital role in today's landscape. By focusing on the right strategies, you can achieve outstanding results. ${audience ? `This is especially relevant for ${audience} who are looking to stay ahead.` : ""} Whether you are just starting out or looking to refine your approach, understanding the nuances of ${topics[(i + 1) % topics.length]} will set you up for success.`,
      tone, i + 1
    );
    parts.push(body);
  }

  parts.push("");
  const conclusion = applyToneToSentence(
    `${topics[0]} is an ever-evolving field that offers tremendous opportunities. ${audience ? `For ${audience}, staying informed about ${topics[1]} is the key to long-term success.` : ""} We hope this guide has provided valuable insights and actionable takeaways. Start implementing these strategies today and see the difference for yourself.`,
    tone, sections + 1
  );
  parts.push("Conclusion");
  parts.push(conclusion);

  return parts.join("\n");
}

function generateProductDescription(topic: string, tone: string, length: string, audience: string): string {
  const topics = buildTopicVariations(topic, 4);
  const adj = ADJECTIVES[tone] || ADJECTIVES.Professional;
  const isLong = length.startsWith("Long") || length.startsWith("Medium");

  const parts: string[] = [];
  parts.push(`Introducing ${topics[0]}: The ${pick(adj, 0)} Solution You Have Been Waiting For`);
  parts.push("");

  const hook = applyToneToSentence(
    audience
      ? `Designed specifically for ${audience}, ${topics[0]} delivers everything you need to succeed.`
      : `${topics[0]} is the ${pick(adj, 1)} tool that transforms the way you work. Say hello to better results.`,
    tone, 0
  );
  parts.push(hook);
  parts.push("");

  if (isLong) {
    parts.push("Key Features");
    const features = [
      `${pick(adj, 2)} design tailored for ${topics[1]}`,
      `Seamless integration with your existing workflow involving ${topics[2]}`,
      `Built-in analytics to track your progress with ${topics[0]}`,
      `24/7 support and continuous updates on ${topics[1]}`,
    ];
    features.forEach((f, i) => {
      parts.push(`  \u2022 ${applyToneToSentence(f, tone, i + 1)}`);
    });
    parts.push("");
  }

  parts.push("Benefits");
  const benefits = [
    `Save time and effort with ${topics[0]} - ${pick(adj, 3)} automation at its finest`,
    `Achieve ${pick(adj, 4)} results with ${topics[1]} optimization`,
    `Scale your efforts effortlessly using ${topics[2]} techniques`,
  ];
  benefits.forEach((b, i) => {
    parts.push(`  \u2022 ${applyToneToSentence(b, tone, i + 1)}`);
  });
  parts.push("");

  const cta = applyToneToSentence(
    `Ready to experience the power of ${topics[0]}? Join thousands of satisfied ${audience || "users"} and transform your results today. Get started now!`,
    tone, 9
  );
  parts.push(cta);

  return parts.join("\n");
}

function generateSocialMediaPost(topic: string, tone: string, length: string, audience: string): string {
  const topics = buildTopicVariations(topic, 3);
  const adj = ADJECTIVES[tone] || ADJECTIVES.Professional;
  const isLong = length.startsWith("Long") || length.startsWith("Medium");

  const parts: string[] = [];
  const hook = applyToneToSentence(
    `\u{1F525} ${pick(adj, 0)} ${topics[0]} tip that ${audience || "everyone"} needs to know!`,
    tone, 0
  );
  parts.push(hook);
  parts.push("");

  const body = applyToneToSentence(
    `${topics[1]} is changing the game. Here is what you need to know: ${topics[0]} offers ${pick(adj, 1)} benefits that can ${audience ? `help ${audience} ` : ""}achieve more. Whether you are new to ${topics[2]} or an experienced pro, these insights will level up your approach.`,
    tone, 1
  );
  parts.push(body);
  parts.push("");

  if (isLong) {
    parts.push(applyToneToSentence(`We have seen incredible results with ${topics[0]}. The key is consistency and understanding the fundamentals of ${topics[1]}. Don't miss out on this opportunity to grow.`, tone, 2));
    parts.push("");
  }

  parts.push("Save this post for later \u{1F4CC}");
  parts.push("");

  const hashtags = `#${topics[0].replace(/\s+/g, "")} #${topics[1].replace(/\s+/g, "")} #${(audience || "tips").replace(/\s+/g, "")} #${pick(adj, 2).replace(/\s+/g, "")}`;
  parts.push(hashtags);
  parts.push("");
  parts.push(`Ready to start? Click the link in bio to learn more about ${topics[0]}!`);

  return parts.join("\n");
}

function generateEmailNewsletter(topic: string, tone: string, length: string, audience: string): string {
  const topics = buildTopicVariations(topic, 4);
  const adj = ADJECTIVES[tone] || ADJECTIVES.Professional;
  const isLong = length.startsWith("Long") || length.startsWith("Medium");
  const greeting = tone === "Professional" ? "Dear" : tone === "Humorous" ? "Hey there" : "Hello";

  const parts: string[] = [];
  parts.push(`Subject: ${pick(adj, 0)} Insights on ${topics[0]} You Need to Read`);
  parts.push("");

  parts.push(`${greeting}${audience ? ` ${audience}` : " Reader"},`);
  parts.push("");
  parts.push(applyToneToSentence(`Welcome to this edition of our newsletter, where we dive deep into ${topics[0]}. ${topics[1]} continues to evolve, and staying informed is the key to staying ahead.`, tone, 0));
  parts.push("");

  const body1 = applyToneToSentence(
    `In this issue, we explore the most ${pick(adj, 1)} aspects of ${topics[2]}. From practical tips to expert strategies, we have got you covered. ${audience ? `Whether you are a ${audience} or just curious, ` : ""}there is something here for everyone.`,
    tone, 1
  );
  parts.push(body1);
  parts.push("");

  if (isLong) {
    const body2 = applyToneToSentence(
      `One of the biggest developments in ${topics[0]} is the growing emphasis on ${topics[3]}. Industry leaders are adopting new approaches that prioritize ${pick(adj, 2)} outcomes. Here is what you need to know to stay competitive.`,
      tone, 2
    );
    parts.push(body2);
    parts.push("");
    const body3 = applyToneToSentence(
      `We have also curated a list of ${pick(adj, 3)} resources to help you master ${topics[1]}. These hand-picked tools and guides will accelerate your learning journey.`,
      tone, 3
    );
    parts.push(body3);
    parts.push("");
  }

  parts.push(applyToneToSentence(`Thank you for being a valued ${audience || "reader"}. We look forward to sharing more ${pick(adj, 4)} content on ${topics[0]} with you soon.`, tone, 4));
  parts.push("");
  parts.push("Best regards,");
  parts.push("The Team");

  return parts.join("\n");
}

function generateLandingPageCopy(topic: string, tone: string, length: string, audience: string): string {
  const topics = buildTopicVariations(topic, 5);
  const adj = ADJECTIVES[tone] || ADJECTIVES.Professional;
  const isLong = length.startsWith("Long") || length.startsWith("Medium");

  const parts: string[] = [];
  parts.push(`[Hero Headline] ${topics[0]}: The ${pick(adj, 0)} Way to ${audience ? `Empower ${audience}` : "Achieve More"}`);
  parts.push("");
  parts.push(`[Subheadline] Stop overcomplicating ${topics[1]}. Our approach to ${topics[0]} delivers ${pick(adj, 1)} results in half the time.`);
  parts.push("");

  if (isLong) {
    parts.push("[Value Proposition]");
    parts.push(applyToneToSentence(`${topics[2]} is no longer a luxury â€” it is a necessity. With ${topics[0]}, you can unlock ${pick(adj, 2)} potential and transform the way you approach ${topics[3]}.`, tone, 0));
    parts.push("");

    parts.push("[Key Benefits]");
    const benefits = [
      `${pick(adj, 3)} integration with ${topics[1]} workflows`,
      `${pick(adj, 4)} support for ${audience || "all users"}`,
      `Proven results across ${topics[2]} implementations`,
    ];
    benefits.forEach((b, i) => {
      parts.push(`  \u2713 ${applyToneToSentence(b, tone, i + 1)}`);
    });
    parts.push("");
  }

  parts.push("[Social Proof]");
  parts.push(applyToneToSentence(`Join thousands of ${audience || "professionals"} who have transformed their approach to ${topics[0]}. "This changed everything," says one satisfied ${audience || "user"}.`, tone, 5));
  parts.push("");

  parts.push(`[Call to Action] Get started with ${topics[0]} today and see the difference. Sign up now for ${pick(adj, 5)} access!`);

  return parts.join("\n");
}

function generateAdvertisement(topic: string, tone: string, length: string, audience: string): string {
  const topics = buildTopicVariations(topic, 3);
  const adj = ADJECTIVES[tone] || ADJECTIVES.Professional;
  const isLong = length.startsWith("Long") || length.startsWith("Medium");

  const parts: string[] = [];

  if (tone === "Humorous") {
    parts.push(`[Headline] ${topics[0]} Not Working? Let Us Fix That.`);
  } else if (tone === "Inspirational") {
    parts.push(`[Headline] Transform Your ${topics[0]} Journey Today`);
  } else {
    parts.push(`[Headline] ${pick(adj, 0)} ${topics[0]} Solutions for ${audience || "Modern Professionals"}`);
  }
  parts.push("");

  parts.push(`[Body] ${applyToneToSentence(`${audience ? `Attention ${audience}: ` : ""}Are you struggling with ${topics[1]}? Our ${topics[0]} solution delivers ${pick(adj, 1)} results. ${pick(adj, 2)} technology meets practical design to give you the edge you need.`, tone, 0)}`);
  parts.push("");

  if (isLong) {
    parts.push(applyToneToSentence(`Unlike other approaches to ${topics[2]}, our method focuses on what actually works. No fluff, no gimmicks â€” just ${pick(adj, 3)} outcomes.`, tone, 1));
    parts.push("");
  }

  if (tone === "Persuasive") {
    parts.push(`[Offer] Limited time: Get ${pick(adj, 4)} access to ${topics[0]} for ${audience || "early adopters"}. Offer ends soon!`);
  } else {
    parts.push(`[Offer] Start your journey with ${topics[0]} today. ${pick(adj, 4)} value, zero risk.`);
  }
  parts.push("");

  parts.push(`[CTA] ${["Get Started Now", "Claim Your Offer", "Learn More", "Try It Free", "Sign Up Today"][Math.floor(Math.random() * 5)]}`);

  return parts.join("\n");
}

const GENERATORS: Record<string, (topic: string, tone: string, length: string, audience: string) => string> = {
  "Blog Post": generateBlogPost,
  "Product Description": generateProductDescription,
  "Social Media Post": generateSocialMediaPost,
  "Email Newsletter": generateEmailNewsletter,
  "Landing Page Copy": generateLandingPageCopy,
  "Advertisement": generateAdvertisement,
};

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function countChars(text: string): number {
  return text.length;
}

function estimateReadingTime(wordCount: number): string {
  const min = Math.max(1, Math.round(wordCount / 200));
  return `${min} min read`;
}

export function ContentGenerator() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<string>("Blog Post");
  const [tone, setTone] = useState<string>("Professional");
  const [length, setLength] = useState<string>("Medium (300-600 words)");
  const [audience, setAudience] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setGenerated(null);
    setCopied(false);

    const generator = GENERATORS[contentType] || GENERATORS["Blog Post"];
    const result = generator(topic.trim(), tone, length, audience.trim());
    setGenerated(result);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = generated;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!generated) return;
    const blob = new Blob([generated], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contentType.replace(/\s+/g, "-").toLowerCase()}-${topic.slice(0, 30).replace(/\s+/g, "-").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wc = generated ? countWords(generated) : 0;
  const cc = generated ? countChars(generated) : 0;
  const rt = generated ? estimateReadingTime(wc) : "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Topic / Keyword
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic, keywords, or brief description..."
            rows={4}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400"
            >
              {CONTENT_TYPES.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Length
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400"
            >
              {LENGTHS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Target Audience <span className="text-zinc-600 dark:text-zinc-400">(optional)</span>
          </label>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g., developers, marketers, beginners..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:ring-blue-400"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          variant="primary"
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating content...
            </span>
          ) : (
            "Generate Content"
          )}
        </Button>
      </div>

      {loading && !generated && (
        <div className="space-y-3">
          <div className="h-6 w-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-3/4 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        </div>
      )}

      {generated && !loading && (
        <Card variant="default" className="p-6">
          <div ref={resultRef} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Generated {contentType}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {wc} words
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 border-b border-zinc-200 pb-3 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Icon name="PenSquare" className="size-3.5" />
                {wc} words
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Clock" className="size-3.5" />
                {rt}
              </span>
              <span className="flex items-center gap-1">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /></svg>
                {cc} characters
              </span>
            </div>

            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              {generated}
            </pre>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={handleCopy} variant="secondary" size="sm">
                {copied ? (
                  <span className="flex items-center gap-1.5">
                    <Icon name="Check" className="size-4" />
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Icon name="Copy" className="size-4" />
                    Copy to Clipboard
                  </span>
                )}
              </Button>
              <Button onClick={handleDownload} variant="secondary" size="sm">
                <span className="flex items-center gap-1.5">
                  <Icon name="Download" className="size-4" />
                  Download as .txt
                </span>
              </Button>
              <Button onClick={handleGenerate} variant="primary" size="sm">
                <span className="flex items-center gap-1.5">
                  <Icon name="RefreshCw" className="size-4" />
                  Regenerate
                </span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!topic.trim() && !generated && !loading && (
        <Alert variant="info" className="text-center">
          Enter a topic and click Generate Content to get started.
        </Alert>
      )}
    </div>
  );
}
