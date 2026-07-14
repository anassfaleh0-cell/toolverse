import { SITE_URL } from "@/lib/constants";

export const BRAND = {
  name: "Nuvora",
  tagline: "Smart Tools, Simply Done",
  description:
    "Nuvora provides powerful free online tools for everyone — from developers to designers, students to startups. Every tool runs entirely in your browser.",
  url: SITE_URL,
  email: `hello@${new URL(SITE_URL).hostname}`,
  founded: "2026",

  mission:
    "To empower everyone with intelligent tools that make complex tasks simple, fast, and accessible entirely in the browser.",

  vision:
    "A world where anyone can build, debug, create, and secure their digital life with the same powerful tools used by experts — without installing a thing.",

  values: [
    {
      title: "Privacy First",
      description: "Your data never leaves your device. Every tool runs in your browser — no uploads, no servers, no tracking.",
    },
    {
      title: "Radical Simplicity",
      description: "Powerful doesn't mean complicated. Every tool has one clear job and does it perfectly with minimal friction.",
    },
    {
      title: "Craft over Quantity",
      description: "We'd rather build 10 exceptional tools than 100 mediocre ones. Each tool is designed, tested, and polished.",
    },
    {
      title: "Intelligence by Default",
      description: "AI isn't a gimmick — it's the engine. Every tool learns from context to give you smarter results automatically.",
    },
    {
      title: "Open & Accessible",
      description: "Free for everyone, always. No paywalls, no signups, no limits. Great tools are a right, not a subscription.",
    },
  ],

  targetAudience: [
    "Developers and engineers debugging infrastructure",
    "Designers creating and optimizing visual assets",
    "DevOps and SRE teams monitoring system health",
    "Students learning networking and security concepts",
    "Small business owners managing their online presence",
    "Content creators producing and optimizing media",
  ],

  personality: [
    "Confident but humble — we know our tools are great, but we let the results speak",
    "Minimalist and refined — every pixel has purpose",
    "Approachable and helpful — expert tools without the expert jargon",
    "Forward-thinking — built for tomorrow's workflows, not yesterday's",
  ],

  usp: "The only digital workspace that combines AI-powered analysis, browser-local privacy, and a unified tool ecosystem — all free, all in your browser, no signup required.",

  voice: {
    tone: "Professional yet warm, concise yet complete, confident yet approachable",
    principles: [
      "Use plain language — never talk down, but never assume expertise",
      "Be direct — say what the tool does in one sentence",
      "Show, don't tell — results and examples speak louder than claims",
      "Be human — avoid corporate speak and buzzwords",
    ],
    avoid: [
      "Overhyped claims ('revolutionary', 'game-changing')",
      "Passive voice ('can be used to', 'allows you to')",
      "Jargon without explanation",
      "Marketing fluff",
    ],
  },

  products: {
    core: { name: "Nuvora Tools", description: "Free browser-based tools for network, security, development, and design." },
    ai: { name: "Nuvora AI", description: "Intelligent result analysis, explanations, and recommendations powered by AI." },
    pro: { name: "Nuvora Pro", description: "Advanced features, priority support, custom integrations, and team workspaces." },
    api: { name: "Nuvora API", description: "Programmatic access to all Nuvora tools and analysis engines for developers." },
    extension: { name: "Nuvora Extension", description: "Browser extension for instant access to Nuvora tools from any tab." },
    mobile: { name: "Nuvora Mobile", description: "Native iOS and Android apps with offline support and mobile-optimized tools." },
  },
} as const;