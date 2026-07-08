import { getToolsByCategory } from "@/lib/registry";
import type { ProgrammaticPage } from "./types";

const USER_SLOTS: { id: string; name: string; desc: string; catMatch: Record<string, number> }[] = [
  { id: "sysadmins", name: "System Administrators", desc: "system administrators managing servers and infrastructure", catMatch: { "network-internet": 3, "code-dev": 1 } },
  { id: "developers", name: "Developers", desc: "software developers writing and debugging code", catMatch: { "code-dev": 3, "network-internet": 1, "productivity": 1 } },
  { id: "designers", name: "Designers", desc: "web and graphic designers creating visual assets", catMatch: { "image-design": 3, "text-writing": 1 } },
  { id: "writers", name: "Writers", desc: "content writers and editors creating text", catMatch: { "text-writing": 3, "productivity": 1 } },
  { id: "marketers", name: "Marketers", desc: "digital marketers optimizing online presence", catMatch: { "code-dev": 1, "text-writing": 1, "image-design": 1, "productivity": 1 } },
  { id: "security-pros", name: "Security Professionals", desc: "security professionals auditing and protecting systems", catMatch: { "network-internet": 3, "code-dev": 1 } },
];

const CATEGORY_NAMES: Record<string, string> = {
  "network-internet": "Network & Internet",
  "productivity": "Productivity",
  "text-writing": "Text & Writing",
  "image-design": "Image & Design",
  "code-dev": "Code & Development",
  "data-analytics": "Data & Analytics",
};

const CATEGORY_DESC: Record<string, string> = {
  "network-internet": "diagnose connectivity issues, verify DNS records, check security certificates, and monitor network performance",
  "productivity": "streamline repetitive tasks, format and transform data, and automate everyday workflows",
  "text-writing": "clean, transform, analyze, and format text content for any purpose",
  "image-design": "optimize, transform, and edit images directly in your browser without uploading to a server",
  "code-dev": "validate, format, transform, and debug code across multiple programming languages and formats",
  "data-analytics": "convert, transform, and analyze data across different formats and structures",
};

function generateToolIntro(category: string, count: number): string {
  const desc = CATEGORY_DESC[category] || "get things done";
  return `We've curated ${count} of the best free ${CATEGORY_NAMES[category] || category} tools to help you ${desc}. Every tool on this list is completely free, works in your browser, and has been tested by our team.`;
}

function generateSection(category: string, slot: string): { heading: string; body: string }[] {
  const catName = CATEGORY_NAMES[category] || category;
  return [
    { heading: `Why ${slot === "sysadmins" ? "System Administrators" : slot === "developers" ? "Developers" : "Users"} Need ${catName} Tools`, body: `Whether you're managing infrastructure, building applications, or creating content, ${catName} tools are essential for your daily workflow. The tools on this page handle common tasks that would otherwise require multiple specialized applications or manual effort.` },
    { heading: `Key Features to Look For in ${catName} Tools`, body: `When choosing ${catName} tools, consider factors like processing speed, accuracy, privacy (client-side processing), export options, and ease of use. All tools listed here are free, require no sign-up, and prioritize your privacy.` },
    { heading: "How to Get the Most Out of These Tools", body: `Start with the most common use case for each tool to understand its core functionality. Then explore advanced options and settings. Many tools can be chained together — use the output of one tool as input for another to create powerful workflows. Bookmark your frequently used tools for quick access.` },
  ];
}

function generateFaq(slot: string, catName: string): { question: string; answer: string }[] {
  return [
    { question: `Are these ${catName} tools really free?`, answer: `Yes, every tool listed on this page is completely free to use. There are no hidden charges, usage limits, or subscription fees. All processing is done client-side in your browser or through our free API tier.` },
    { question: `Do I need to create an account?`, answer: `No account or registration is required. Simply open any tool and start using it immediately. Your privacy is important to us — no personal information is collected.` },
    { question: `Can I use these tools on mobile devices?`, answer: `Yes, all tools are fully responsive and work on smartphones and tablets. The interfaces adapt to smaller screens while maintaining full functionality.` },
    { question: `How accurate are these tools?`, answer: `${catName} tools use well-established algorithms and authoritative data sources. Network tools query live servers in real-time. Image and text tools apply proven processing techniques for consistent, reliable results.` },
  ];
}

export function generateBestForSlotPages(): ProgrammaticPage[] {
  const pages: ProgrammaticPage[] = [];

  for (const slot of USER_SLOTS) {
    for (const [category] of Object.entries(slot.catMatch)) {
      const catTools = getToolsByCategory(category);
      if (catTools.length < 2) continue;

      const catName = CATEGORY_NAMES[category] || category;
      const slug = `best-${category}-tools-for-${slot.id}`;

      pages.push({
        slug,
        title: `Best ${catName} Tools for ${slot.name} (2026) — Free Online Tools | ToolVerse`,
        description: `Discover the best free ${catName.toLowerCase()} tools for ${slot.desc}. ${catTools.length} hand-picked tools for ${slot.name.toLowerCase()} to ${CATEGORY_DESC[category] || "get work done"}.`,
        h1: `Best ${catName} Tools for ${slot.name}`,
        intro: generateToolIntro(category, catTools.length),
        sections: generateSection(category, slot.id),
        faqItems: generateFaq(slot.id, catName),
        toolIds: catTools.map((t) => t.id),
        relatedSlugs: [],
      });
    }
  }

  return pages;
}

export function generateAllProgrammaticPages(): ProgrammaticPage[] {
  return generateBestForSlotPages();
}
