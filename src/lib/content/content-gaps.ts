import { TOOL_KEYWORDS, type KeywordCluster } from "@/lib/seo/keywords";
import { tools } from "@/lib/tools";

export type ContentPageType =
  | "tutorial"
  | "examples"
  | "errors"
  | "reference"
  | "cheat-sheet"
  | "best-practices"
  | "commands"
  | "use-cases";

export interface ContentGap {
  toolSlug: string;
  toolName: string;
  pageType: ContentPageType;
  title: string;
  description: string;
  keywords: string[];
  priority: "high" | "medium" | "low";
}

function derivePageType(
  cluster: KeywordCluster,
  type: ContentPageType,
): { exists: boolean; priority: "high" | "medium" | "low" } {
  const hasTroubleshooting = cluster.troubleshooting.length >= 3;
  const hasBeginner = cluster.beginner.length >= 3;
  const hasComparisons = cluster.comparisons.length >= 3;
  const hasLongTail = cluster.longTail.length >= 5;
  const hasQuestions = cluster.questions.length >= 5;

  switch (type) {
    case "errors":
      return {
        exists: false,
        priority: hasTroubleshooting ? "high" : hasLongTail ? "medium" : "low",
      };
    case "tutorial":
      return {
        exists: false,
        priority: hasBeginner ? "high" : "medium",
      };
    case "examples":
      return {
        exists: false,
        priority: hasLongTail ? "high" : "medium",
      };
    case "reference":
      return {
        exists: false,
        priority: hasQuestions ? "high" : "low",
      };
    case "cheat-sheet":
      return {
        exists: false,
        priority: hasQuestions && hasLongTail ? "high" : "medium",
      };
    case "best-practices":
      return {
        exists: false,
        priority: hasTroubleshooting ? "high" : "medium",
      };
    case "commands":
      return {
        exists: false,
        priority: hasBeginner || cluster.secondary.length >= 4 ? "medium" : "low",
      };
    case "use-cases":
      return {
        exists: false,
        priority: hasComparisons ? "high" : "low",
      };
  }
}

function toolName(slug: string): string {
  return tools.find((t) => t.id === slug)?.name ?? slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function getContentGaps(toolSlug: string): ContentGap[] {
  const cluster = TOOL_KEYWORDS[toolSlug];
  if (!cluster) return [];

  const name = toolName(toolSlug);
  const primary = cluster.primary;
  const gaps: ContentGap[] = [];

  const pageSpecs: Array<{
    type: ContentPageType;
    title: string;
    description: string;
    keywords: string[];
  }> = [
    {
      type: "tutorial",
      title: `How to Use ${name}: A Complete Tutorial`,
      description: `Step-by-step guide to using a ${primary} tool effectively, with real-world examples and best practices.`,
      keywords: [`${primary} tutorial`, `how to use ${primary}`, `${primary} step by step`, ...cluster.beginner.slice(0, 2)],
    },
    {
      type: "examples",
      title: `${name} Examples: Real-World Use Cases`,
      description: `Practical ${primary} examples and scenarios showing how professionals use this tool in real projects.`,
      keywords: [`${primary} example`, `${primary} sample`, `${primary} use case`, ...cluster.longTail.slice(0, 2)],
    },
    {
      type: "errors",
      title: `Common ${name} Errors & How to Fix Them`,
      description: `Troubleshoot common ${primary} errors with detailed solutions and diagnostic steps.`,
      keywords: [`${primary} error`, `${primary} troubleshooting`, `fix ${primary}`, ...cluster.troubleshooting.slice(0, 2)],
    },
    {
      type: "reference",
      title: `${name} Reference: Complete Field Guide`,
      description: `Comprehensive ${primary} reference covering all record types, parameters, and output fields.`,
      keywords: [`${primary} reference`, `${primary} guide`, `${primary} documentation`, ...cluster.secondary.slice(0, 2)],
    },
    {
      type: "cheat-sheet",
      title: `${name} Cheat Sheet`,
      description: `Quick-reference ${primary} cheat sheet with common commands, fields, and best practices for rapid lookup.`,
      keywords: [`${primary} cheat sheet`, `${primary} quick reference`, `${primary} commands`, ...cluster.secondary.slice(0, 2)],
    },
    {
      type: "best-practices",
      title: `${name} Best Practices & Tips`,
      description: `Expert ${primary} best practices to improve accuracy, performance, and security when using this tool.`,
      keywords: [`${primary} best practices`, `${primary} tips`, `${primary} optimization`, ...cluster.troubleshooting.slice(0, 2)],
    },
    {
      type: "commands",
      title: `${name} Commands: CLI Alternatives & Equivalents`,
      description: `Command-line equivalents and alternatives to the ${primary} tool for advanced users.`,
      keywords: [`${primary} command`, `${primary} CLI`, `${primary} terminal`, ...cluster.comparisons.slice(0, 2)],
    },
    {
      type: "use-cases",
      title: `${primary}: Top Use Cases for Developers`,
      description: `Explore the most common ${primary} use cases across development, DevOps, and IT operations.`,
      keywords: [`${primary} use cases`, `why use ${primary}`, `${primary} applications`, ...cluster.comparisons.slice(0, 2)],
    },
  ];

  for (const spec of pageSpecs) {
    const { priority } = derivePageType(cluster, spec.type);
    gaps.push({
      toolSlug,
      toolName: name,
      pageType: spec.type,
      title: spec.title,
      description: spec.description,
      keywords: spec.keywords,
      priority,
    });
  }

  return gaps;
}

export function getHighPriorityGaps(): ContentGap[] {
  const all: ContentGap[] = [];
  for (const slug of Object.keys(TOOL_KEYWORDS)) {
    all.push(...getContentGaps(slug));
  }
  return all.filter((g) => g.priority === "high");
}

export function getGapsByPageType(type: ContentPageType): ContentGap[] {
  const all: ContentGap[] = [];
  for (const slug of Object.keys(TOOL_KEYWORDS)) {
    all.push(...getContentGaps(slug));
  }
  return all.filter((g) => g.pageType === type);
}

export function getGapSummary(): Record<ContentPageType, number> {
  const summary: Record<string, number> = { tutorial: 0, examples: 0, errors: 0, reference: 0, "cheat-sheet": 0, "best-practices": 0, commands: 0, "use-cases": 0 };
  for (const slug of Object.keys(TOOL_KEYWORDS)) {
    const gaps = getContentGaps(slug);
    for (const g of gaps) {
      summary[g.pageType]++;
    }
  }
  return summary as Record<ContentPageType, number>;
}

export function getPriorityBreakdown(): Record<string, number> {
  const breakdown = { high: 0, medium: 0, low: 0 };
  for (const slug of Object.keys(TOOL_KEYWORDS)) {
    const gaps = getContentGaps(slug);
    for (const g of gaps) {
      breakdown[g.priority]++;
    }
  }
  return breakdown;
}

export function getGapsByTool(toolSlug: string): ContentGap[] {
  return getContentGaps(toolSlug);
}

export function getGapCountByTool(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const slug of Object.keys(TOOL_KEYWORDS)) {
    counts[slug] = getContentGaps(slug).length;
  }
  return counts;
}

export function suggestNextGap(): ContentGap | null {
  const high = getHighPriorityGaps();
  if (high.length > 0) return high[0];
  const all: ContentGap[] = [];
  for (const slug of Object.keys(TOOL_KEYWORDS)) {
    all.push(...getContentGaps(slug));
  }
  return all[0] ?? null;
}

export function getGapsByPriority(
  priority: "high" | "medium" | "low",
): ContentGap[] {
  const all: ContentGap[] = [];
  for (const slug of Object.keys(TOOL_KEYWORDS)) {
    all.push(...getContentGaps(slug));
  }
  return all.filter((g) => g.priority === priority);
}

export function searchGaps(query: string): ContentGap[] {
  const lower = query.toLowerCase();
  const all: ContentGap[] = [];
  for (const slug of Object.keys(TOOL_KEYWORDS)) {
    all.push(...getContentGaps(slug));
  }
  return all.filter(
    (g) =>
      g.title.toLowerCase().includes(lower) ||
      g.description.toLowerCase().includes(lower) ||
      g.toolName.toLowerCase().includes(lower) ||
      g.keywords.some((k) => k.toLowerCase().includes(lower)),
  );
}
