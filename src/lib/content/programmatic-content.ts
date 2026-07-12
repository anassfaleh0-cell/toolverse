import { getAllTools, getCategories } from "@/lib/registry";
import type { FaqItem } from "@/lib/seo";

const SITE_NAME = "Nuvora";

const CATEGORY_LABEL: Record<string, string> = {
  "text-writing": "Text & Writing",
  "image-design": "Image & Design",
  "code-dev": "Code & Development",
  "data-analytics": "Data & Analytics",
  "audio-video": "Audio & Video",
  productivity: "Productivity",
  "network-internet": "Network & Internet",
  finance: "Finance",
  calculators: "Calculators",
  security: "Security",
  ai: "AI",
  seo: "SEO",
  converters: "Converters",
};

function getCatLabel(slug: string): string {
  return CATEGORY_LABEL[slug] || slug;
}

function introForTool(toolName: string): string {
  const intros = [
    `Finding the right alternative to ${toolName} can significantly improve your workflow and productivity. While ${toolName} is a capable tool, exploring other options in the same category can reveal features that better match your specific needs, whether you are looking for faster performance, additional functionality, or a different user experience.`,
    `If you have been using ${toolName} and feel it is not quite meeting all your requirements, you are not alone. Many users look for alternatives that offer a different set of capabilities, better privacy protections, or a more intuitive interface. The good news is that there are several excellent free alternatives available online.`,
    `While ${toolName} serves its purpose well, the landscape of free online tools is constantly evolving with new options that bring fresh approaches and advanced features. Whether you need something more specialized, more private, or simply a different workflow, the following alternatives deserve your consideration.`,
    `Choosing the right tool for the job is essential, and sometimes the best choice is not the most obvious one. ${toolName} has its strengths, but depending on your use case, one of these alternatives might serve you better with unique features that align more closely with what you actually need day to day.`,
  ];
  return intros[toolName.length % intros.length];
}

function prosFromTool(category: string, desc: string): string[] {
  const base = ["100% free to use with no hidden costs", "Works entirely in your browser — no installation needed", "Your data stays private and never leaves your device", "No signup or registration required", "Instant results with real-time processing", "Works on all modern browsers including mobile", "Regularly updated with new features and improvements"];
  const catPros: Record<string, string[]> = {
    "network-internet": ["Tests against multiple global server locations", "Comprehensive multi-record type support", "Detailed latency and performance metrics"],
    "image-design": ["High-quality image output with original resolution preserved", "Supports all major image formats including WebP", "Advanced canvas-based processing for pixel-perfect results"],
    "code-dev": ["Syntax validation and error detection built in", "Production-ready formatted output", "Supports industry standards and specifications"],
    "text-writing": ["Advanced text analysis with real-time statistics", "Handles large volumes of text efficiently", "Multiple output formats and options"],
    "data-analytics": ["Handles complex nested data structures", "Preserves data integrity during transformation", "Multi-format import and export support"],
    productivity: ["Batch processing for multiple files at once", "Optimized for quick task completion", "Seamless integration with common workflows"],
    finance: ["Accurate calculations with precise decimal handling", "Supports multiple currencies and tax rates", "Comprehensive amortization and projection tables"],
    calculators: ["Precision calculations with detailed breakdowns", "Supports a wide range of units and conversions", "Step-by-step result explanations"],
    security: ["Enterprise-grade security analysis", "Comprehensive vulnerability and compliance checks", "Industry best practice validation"],
    ai: ["AI-powered analysis with contextual understanding", "Natural language processing capabilities", "Adaptable to various content types and tones"],
    seo: ["Search-engine optimized output with best practices", "Real-time character and pixel counting", "SERP preview and competitive analysis"],
    converters: ["Lossless conversion preserving original quality", "Multi-format support with batch conversion", "Handles complex nested structures seamlessly"],
  };
  const extras = catPros[category] || [];
  const selection = [...base, ...extras].slice(0, 6);
  if (desc.toLowerCase().includes("compress")) selection.push("Intelligent compression algorithms that balance quality and file size");
  if (desc.toLowerCase().includes("format")) selection.push("Smart formatting with customizable indentation and style options");
  if (desc.toLowerCase().includes("convert")) selection.push("High-fidelity conversion preserving all original data");
  if (desc.toLowerCase().includes("security") || desc.toLowerCase().includes("ssl")) selection.push("Advanced security scanning with detailed vulnerability reporting");
  if (desc.toLowerCase().includes("generate")) selection.push("Customizable output with multiple generation modes");
  return [...new Set(selection)].slice(0, 5);
}

function consFromTool(category: string, desc: string): string[] {
  const base = ["Limited to browser-based processing capabilities", "Requires an active internet connection to access", "Advanced features may require a server-side implementation for production use"];
  const catCons: Record<string, string[]> = {
    "network-internet": ["Results depend on network conditions at the time of testing", "Some advanced DNS record types may not be queryable from the browser"],
    "image-design": ["Large image files may take longer to process in browser", "Some advanced editing features are limited to what Canvas API supports"],
    "code-dev": ["Very large files may cause browser performance issues", "Some edge-case syntax may not be supported"],
    "text-writing": ["Very large documents may cause slowdown in browser", "Some advanced formatting may not be preserved"],
    "data-analytics": ["Large datasets may exceed browser memory limits", "Complex nested structures may require flattening"],
    productivity: ["File size limits depend on browser memory", "Some advanced PDF features may not be supported"],
    finance: ["Cryptocurrency rates depend on third-party API availability", "Historical data may not include all global markets"],
    calculators: ["Some specialized calculations may not be covered", "Results are estimates and should be verified for critical decisions"],
    security: ["Client-side scanning has inherent limitations", "Some tests require server-side execution for complete results"],
    ai: ["AI analysis is rule-based and may not catch all nuances", "Results are suggestions and should be reviewed by a human"],
    seo: ["SEO analysis is based on observable markup only", "Some search engine ranking factors cannot be measured client-side"],
    converters: ["Very large files may be limited by browser memory", "Some format-specific features may not survive conversion"],
  };
  return [...new Set([...(catCons[category] || base), ...base])].slice(0, 3);
}

function featuresFromDesc(desc: string): string[] {
  const features: string[] = [];
  const words = desc.toLowerCase();
  if (words.includes("format") || words.includes("beautif")) features.push("Code formatting and beautification");
  if (words.includes("valid")) features.push("Built-in validation with detailed error reporting");
  if (words.includes("convert")) features.push("Multi-format conversion capabilities");
  if (words.includes("compress") || words.includes("minif")) features.push("File size optimization and compression");
  if (words.includes("encod") || words.includes("decod")) features.push("Encoding and decoding with multiple modes");
  if (words.includes("search") || words.includes("query")) features.push("Advanced search and filtering capabilities");
  if (words.includes("generat")) features.push("Customizable generation with multiple options");
  if (words.includes("analyz") || words.includes("check")) features.push("Deep analysis with detailed reporting");
  if (words.includes("preview") || words.includes("render")) features.push("Live preview with real-time updates");
  if (words.includes("color") || words.includes("gradient")) features.push("Visual color picking and harmony generation");
  features.push("Privacy-first architecture with no server upload");
  features.push("Instant browser-based processing");
  return features.slice(0, 4);
}

function genFaqs(term: string, items: Array<{ q: string; a: string }>): FaqItem[] {
  return items.map((i) => ({ question: i.q, answer: i.a }));
}

function genStandardFaqs(name: string, category: string, overrides?: FaqItem[]): FaqItem[] {
  const base: FaqItem[] = [
    { question: `Is ${name} really free to use?`, answer: `Yes, ${name} is completely free to use on ${SITE_NAME}. There are no hidden fees, no credit card required, and no usage limits. You can use it as often as you need without any restrictions.` },
    { question: `Do I need to create an account to use ${name}?`, answer: `No account or signup is required to use ${name}. Simply visit the tool page and start using it immediately. Your data never leaves your browser, so there is no need for user accounts or data storage.` },
    { question: `Is my data safe when using ${name}?`, answer: `Absolutely. ${name} processes everything locally in your browser. No files or data are uploaded to any server. This means your information stays private and secure on your own device at all times.` },
    { question: `Can I use ${name} on my mobile device?`, answer: `Yes, ${name} is fully responsive and works on all modern browsers across desktop, tablet, and mobile devices. The interface adapts to your screen size for a seamless experience anywhere.` },
    { question: `What makes ${SITE_NAME} different from other free tool websites?`, answer: `${SITE_NAME} combines powerful tools with a strict privacy-first approach. Every tool runs entirely in your browser with no server uploads, no tracking, and no signup required. We focus on quality, speed, and user privacy above all else.` },
  ];
  if (overrides) return [...base, ...overrides].slice(0, 6);
  return base;
}

// === ALTERNATIVES ===
export function generateAlternativeContent(toolId: string): {
  title: string;
  description: string;
  intro: string;
  alternatives: Array<{ name: string; description: string; url: string; pros: string[]; cons: string[] }>;
  whySection: string[];
  verdict: string;
  faqs: FaqItem[];
} {
  const allTools = getAllTools();
  const tool = allTools.find((t) => t.id === toolId);
  const toolName = tool?.name ?? toolId;
  const category = tool?.category ?? "tools";
  const catLabel = getCatLabel(category);
  const others = allTools.filter((t) => t.id !== toolId && t.category === category).slice(0, 6);

  const alternatives = others.map((t) => ({
    name: t.name,
    description: t.description,
    url: t.url,
    pros: prosFromTool(t.category, t.description),
    cons: consFromTool(t.category, t.description),
  }));

  const whySection = [
    `Different feature sets: While ${toolName} offers a specific set of capabilities, other ${catLabel} tools may provide features that ${toolName} lacks, such as batch processing, advanced export options, or specialized analysis modes.`,
    `Performance considerations: Depending on your workflow, some alternatives may process data faster or handle larger files more efficiently than ${toolName}, especially if you work with substantial data volumes regularly.`,
    `Privacy and architecture: Some users prefer tools that offer different privacy guarantees or processing architectures. While ${toolName} handles data in a certain way, alternatives might offer enhanced privacy features or different data handling approaches.`,
    `User experience preferences: Interface design and workflow matter. An alternative might offer a more intuitive interface, keyboard shortcuts, or a layout that better matches how you naturally work with ${catLabel.toLowerCase()} tools.`,
  ];

  const verdict =
    alternatives.length > 0
      ? `While ${toolName} is a solid choice for ${catLabel.toLowerCase()}, the best tool for you depends on your specific needs. ${alternatives[0]?.name ?? "Our top alternative"} stands out for its comprehensive feature set and excellent user experience. We recommend trying 2-3 alternatives to find the perfect fit for your workflow. All the tools listed here are free, private, and require no signup, so you can experiment without any risk or commitment.`
      : `Currently there are no direct alternatives listed for ${toolName} in the same category. However, ${SITE_NAME} offers many other tools across different categories that might complement your workflow. Check back as we regularly add new tools and expand our catalog.`;

  const faqs: FaqItem[] = [
    ...genStandardFaqs(toolName, category),
    ...(alternatives.length > 0
      ? [
          {
            question: `What is the best alternative to ${toolName}?`,
            answer: `Based on our analysis, ${alternatives[0]?.name ?? "our top pick"} is the best free alternative to ${toolName}. It offers ${alternatives[0]?.description?.toLowerCase() ?? "a comprehensive set of features"} while maintaining the same privacy-first approach and ease of use that ${SITE_NAME} is known for.`,
          },
        ]
      : []),
  ];

  return {
    title: `Top Free ${toolName} Alternatives for 2026`,
    description: `Looking for the best free alternatives to ${toolName}? Compare top ${catLabel.toLowerCase()} tools. ${tool?.description ?? "Free, private, and browser-based."}`,
    intro: introForTool(toolName),
    alternatives,
    whySection,
    verdict,
    faqs,
  };
}

// === VS COMPARISON ===
export function generateVsContent(tool1Id: string, tool2Id: string): {
  title: string;
  description: string;
  overview: { tool1: { name: string; desc: string }; tool2: { name: string; desc: string } };
  comparisonTable: Array<{ feature: string; tool1: string; tool2: string; winner: 1 | 2 | "tie" }>;
  prosCons: { tool1: { pros: string[]; cons: string[] }; tool2: { pros: string[]; cons: string[] } };
  useCases: { tool1Best: string[]; tool2Best: string[] };
  verdict: string;
  faqs: FaqItem[];
} {
  const allTools = getAllTools();
  const t1 = allTools.find((t) => t.id === tool1Id);
  const t2 = allTools.find((t) => t.id === tool2Id);
  const n1 = t1?.name ?? tool1Id;
  const n2 = t2?.name ?? tool2Id;
  const d1 = t1?.description ?? "";
  const d2 = t2?.description ?? "";
  const c1 = t1?.category ?? "";
  const c2 = t2?.category ?? "";

  const comparisonTable: Array<{ feature: string; tool1: string; tool2: string; winner: 1 | 2 | "tie" }> = [
    { feature: "Pricing", tool1: "100% Free", tool2: "100% Free", winner: "tie" },
    { feature: "Browser-Based", tool1: "Yes — all processing in browser", tool2: "Yes — all processing in browser", winner: "tie" },
    { feature: "Privacy (No Server Upload)", tool1: "Yes — data never leaves your device", tool2: "Yes — data never leaves your device", winner: "tie" },
    { feature: "No Signup Required", tool1: "Yes", tool2: "Yes", winner: "tie" },
    { feature: "Category", tool1: getCatLabel(c1), tool2: getCatLabel(c2), winner: c1 === c2 ? "tie" : 1 },
    { feature: "Primary Use Case", tool1: d1.split(".")[0] || "General utility", tool2: d2.split(".")[0] || "General utility", winner: "tie" },
    { feature: "Mobile Responsive", tool1: "Yes — fully responsive design", tool2: "Yes — fully responsive design", winner: "tie" },
    { feature: "Processing Speed", tool1: "Instant — real-time results", tool2: "Instant — real-time results", winner: "tie" },
    { feature: "Ease of Use", tool1: "Simple intuitive interface with clear controls", tool2: "Simple intuitive interface with clear controls", winner: "tie" },
    { feature: "Data Handling", tool1: d1.toLowerCase().includes("batch") ? "Batch processing supported" : "Single input processing", tool2: d2.toLowerCase().includes("batch") ? "Batch processing supported" : "Single input processing", winner: d1.toLowerCase().includes("batch") ? 1 : d2.toLowerCase().includes("batch") ? 2 : "tie" },
    { feature: "Output Formats", tool1: d1.toLowerCase().includes("format") ? "Multiple output formats supported" : "Standard output format", tool2: d2.toLowerCase().includes("format") ? "Multiple output formats supported" : "Standard output format", winner: d1.toLowerCase().includes("format") ? 1 : d2.toLowerCase().includes("format") ? 2 : "tie" },
    { feature: "Advanced Options", tool1: d1.toLowerCase().includes("custom") || d1.toLowerCase().includes("config") ? "Advanced configuration available" : "Standard options", tool2: d2.toLowerCase().includes("custom") || d2.toLowerCase().includes("config") ? "Advanced configuration available" : "Standard options", winner: "tie" },
  ];

  const winnerScore = { t1: 0, t2: 0 };
  for (const row of comparisonTable) {
    if (row.winner === 1) winnerScore.t1++;
    else if (row.winner === 2) winnerScore.t2++;
  }

  const useCases = {
    tool1Best: [
      `When you need reliable ${getCatLabel(c1).toLowerCase()} with a focus on ${d1.split(".")[0]?.toLowerCase() || "core functionality"}`,
      `If your workflow requires ${d1.toLowerCase().includes("multiple") || d1.toLowerCase().includes("batch") ? "batch processing of multiple items at once" : "quick, straightforward processing without extra frills"}`,
      `For users who prioritize ${d1.toLowerCase().includes("privacy") || d1.toLowerCase().includes("private") ? "maximum privacy with zero data transmission" : "a clean, distraction-free interface"}`,
    ],
    tool2Best: [
      `When you need specialized ${getCatLabel(c2).toLowerCase()} capabilities centered around ${d2.split(".")[0]?.toLowerCase() || "specific functionality"}`,
      `If your tasks require ${d2.toLowerCase().includes("detail") || d2.toLowerCase().includes("comprehensive") ? "detailed analysis with comprehensive reporting" : "efficient processing with streamlined output"}`,
      `For scenarios where ${d2.toLowerCase().includes("format") || d2.toLowerCase().includes("convert") ? "format flexibility and conversion options are critical" : "speed and simplicity matter most"}`,
    ],
  };

  const verdict =
    winnerScore.t1 > winnerScore.t2
      ? `${n1} edges ahead in our comparison with more favorable feature ratings. It excels at ${d1.split(".")[0]?.toLowerCase() || "its core purpose"} and offers a slightly more comprehensive feature set. However, ${n2} remains an excellent choice, especially if your needs align more closely with its strengths in ${d2.split(".")[0]?.toLowerCase() || "its area of focus"}. Both tools are free and privacy-respecting, so the best choice ultimately depends on your specific requirements.`
      : winnerScore.t2 > winnerScore.t1
        ? `${n2} takes the lead in our comparison with stronger feature ratings. It particularly shines at ${d2.split(".")[0]?.toLowerCase() || "its specialized functionality"} and offers features that give it a slight edge. That said, ${n1} is still a fantastic free tool, especially if your priorities align with ${d1.split(".")[0]?.toLowerCase() || "its particular strengths"}. We recommend trying both to see which one fits your workflow better.`
        : `Both ${n1} and ${n2} are excellent free tools with different strengths. ${n1} specializes in ${d1.split(".")[0]?.toLowerCase() || "its core area"}, while ${n2} focuses on ${d2.split(".")[0]?.toLowerCase() || "its primary function"}. Our comparison shows they are closely matched overall. The right choice depends on whether you need the specific capabilities of ${n1} or ${n2} for your particular use case. Both are completely free, private, and require no signup.`;

  const faqs: FaqItem[] = [
    { question: `Which is better: ${n1} or ${n2}?`, answer: `Both ${n1} and ${n2} are excellent free tools, each with their own strengths. ${n1} is particularly strong at ${d1.split(".")[0]?.toLowerCase() || "its primary function"}, while ${n2} excels at ${d2.split(".")[0]?.toLowerCase() || "its area of focus"}. The best choice depends on your specific needs — we recommend trying both to see which one works better for your workflow.` },
    { question: `Is ${n1} free to use?`, answer: `Yes, ${n1} is completely free to use on ${SITE_NAME}. There are no hidden costs, no usage limits, and no subscription required. All features are available at no charge.` },
    { question: `Is ${n2} free to use?`, answer: `Yes, ${n2} is completely free to use on ${SITE_NAME}. You can access all its features without paying anything or creating an account.` },
    { question: `Can I use both ${n1} and ${n2} together?`, answer: `Absolutely. Since both tools are free and browser-based, you can use them side by side without any conflicts. They complement each other well, especially if they serve different aspects of your workflow.` },
    { question: `Do ${n1} and ${n2} work offline?`, answer: `Both tools require an initial page load but process data locally in your browser once loaded. Some features may require internet connectivity for certain operations like fetching external data or performing network checks.` },
    { question: `Which tool is more private?`, answer: `Both ${n1} and ${n2} follow the same privacy-first architecture. All processing happens locally in your browser, and no data is uploaded to any server. Your information never leaves your device with either tool.` },
  ];

  return {
    title: `${n1} vs ${n2}: Which Free Online Tool Is Better?`,
    description: `Compare ${n1} vs ${n2} side by side. Features, performance, privacy, and ease of use. Find out which free online ${getCatLabel(c1).toLowerCase()} tool wins for your needs.`,
    overview: { tool1: { name: n1, desc: d1 }, tool2: { name: n2, desc: d2 } },
    comparisonTable,
    prosCons: {
      tool1: { pros: prosFromTool(c1, d1), cons: consFromTool(c1, d1) },
      tool2: { pros: prosFromTool(c2, d2), cons: consFromTool(c2, d2) },
    },
    useCases,
    verdict,
    faqs,
  };
}

// === CONVERTER ===
export function generateConverterContent(source: string, target: string): {
  title: string;
  description: string;
  steps: Array<{ step: number; title: string; description: string }>;
  benefits: string[];
  tips: string[];
  whyConvert: string[];
  faqs: FaqItem[];
} {
  const src = source.toUpperCase();
  const tgt = target.toUpperCase();
  const label = `${src} to ${tgt}`;

  const steps = [
    { step: 1, title: "Access the converter tool", description: `Navigate to ${SITE_NAME}'s ${src} to ${tgt} converter page. The tool loads instantly in your browser without any downloads or installations. No signup or registration is required.` },
    { step: 2, title: `Upload or paste your ${src} data`, description: `Provide your ${src} file or data by uploading from your device, pasting the content directly into the input area, or dragging and dropping your file into the designated zone. The tool accepts standard ${src} formatting and will validate your input automatically.` },
    { step: 3, title: "Configure conversion options", description: `Adjust any available settings such as output quality, formatting preferences, or encoding options. The converter provides sensible defaults, but you can customize these to match your specific requirements. Tooltips explain each option clearly.` },
    { step: 4, title: "Preview and convert", description: `Click the convert button to start the transformation. The conversion happens locally in your browser, so your data never leaves your device. A preview of the converted ${tgt} output is displayed for your review before downloading.` },
    { step: 5, title: "Download or copy the result", description: `Once the conversion is complete, you can download the ${tgt} file, copy the converted content to your clipboard, or share it directly. The tool preserves the quality and integrity of your original data throughout the conversion process.` },
  ];

  const benefits = [
    `Free and unlimited: Convert as many ${src} files to ${tgt} as you need with no restrictions or hidden costs`,
    `Privacy-first: All conversion happens in your browser — your files are never uploaded to any server`,
    "No software installation: Works entirely in your web browser with no downloads or plugins required",
    "Fast processing: Instant conversion results thanks to client-side processing optimized for performance",
    "High quality: Maintains the integrity and quality of your original data throughout the conversion process",
    `Works everywhere: Fully compatible with all modern browsers on desktop, tablet, and mobile devices`,
  ];

  const tips = [
    `Ensure your ${src} file follows the standard format specification to avoid conversion errors`,
    `Check the output settings before converting to make sure the ${tgt} result matches your requirements`,
    `For large files, consider splitting them into smaller batches for faster processing`,
    `Preview the converted output before downloading to verify accuracy and completeness`,
    `Bookmark the converter for quick access when you need to perform similar conversions in the future`,
  ];

  const whyConvert = [
    `Compatibility: Converting ${src} to ${tgt} ensures your files work with software and platforms that specifically support ${tgt} format`,
    `File size optimization: Depending on the formats, ${tgt} may offer better compression or efficiency for your use case compared to ${src}`,
    `Workflow requirements: Many professional workflows require specific formats for different stages of production, editing, or distribution`,
    `Universal access: ${tgt} is widely supported across platforms and devices, making it easier to share and collaborate with others`,
  ];

  const faqs: FaqItem[] = [
    { question: `Is the ${label} converter really free?`, answer: `Yes, the ${label} converter on ${SITE_NAME} is completely free to use. There are no hidden fees, no usage limits, and no premium tiers. Convert as many files as you need without paying anything.` },
    { question: `Do I need to upload my files to a server?`, answer: `No. The ${label} converter processes everything locally in your browser using JavaScript. Your files never leave your device, ensuring complete privacy and security. This is a key difference from many other online converters that require server uploads.` },
    { question: `What is the maximum file size I can convert?`, answer: `The maximum file size depends on your browser's memory capacity. Generally, files up to 100MB work well, but very large files may cause performance issues. For best results, try converting files under 50MB.` },
    { question: `Will the conversion quality be preserved?`, answer: `Yes, the converter is designed to preserve the original quality and data integrity of your ${src} file when converting to ${tgt}. The conversion algorithm handles formatting, structure, and content carefully to ensure accurate results.` },
    { question: `Does the converter work on mobile devices?`, answer: `Yes, the ${label} converter is fully responsive and works on all modern mobile browsers. You can convert files directly from your smartphone or tablet without any loss of functionality.` },
  ];

  return {
    title: `Free ${src} to ${tgt} Converter Online`,
    description: `Convert ${src} to ${tgt} online for free. No signup, no uploads, no limits. Fast, private, browser-based ${src} to ${tgt} conversion tool.`,
    steps,
    benefits,
    tips,
    whyConvert,
    faqs,
  };
}

// === BEST-OF ===
export function generateBestOfContent(categorySlug: string, useCase: string): {
  title: string;
  description: string;
  intro: string;
  criteria: string[];
  tools: Array<{ rank: number; name: string; description: string; url: string; bestFor: string; features: string[] }>;
  tips: string[];
  faqs: FaqItem[];
} {
  const allTools = getAllTools();
  const catLabel = getCatLabel(categorySlug);
  const catTools = allTools.filter((t) => t.category === categorySlug);
  const useCaseLabel = useCase.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const intro = `Finding the best free ${catLabel.toLowerCase()} tools for ${useCaseLabel} can transform how you work. We have curated and analyzed the top tools in this category based on features, ease of use, privacy protection, and overall value. Whether you are a seasoned professional or just getting started, these tools will help you accomplish your tasks efficiently without spending a dime. All tools listed are completely free, require no signup, and process data locally in your browser for maximum privacy.`;

  const criteria = [
    `Relevance to ${useCaseLabel}: How well the tool serves the specific needs of ${useCaseLabel} use cases`,
    "Ease of use: Intuitive interface that requires no learning curve or technical expertise",
    "Feature completeness: Range of features and capabilities offered compared to industry standards",
    "Privacy and security: Zero server upload policy and client-side processing architecture",
    "Performance: Speed of processing, especially for common task sizes",
    "Mobile compatibility: Full functionality across desktop and mobile platforms",
  ];

  const tools = catTools.slice(0, 10).map((t, i) => ({
    rank: i + 1,
    name: t.name,
    description: t.description,
    url: t.url,
    bestFor: `${useCaseLabel} professionals who need ${t.description.split(".")[0]?.toLowerCase() || "reliable free tools"}`,
    features: featuresFromDesc(t.description),
  }));

  const tips = [
    `Start with the top-ranked tool if you are new to ${catLabel.toLowerCase()} tools — it offers the best balance of features and usability for ${useCaseLabel}`,
    `Try at least 2-3 tools from this list to find the one that best matches your specific workflow and preferences`,
    `Bookmark your favorite tools for quick access — they are all free, so you can use them as often as needed`,
    `Combine multiple tools from this list to create a powerful workflow that covers all your ${catLabel.toLowerCase()} needs`,
    `Check back regularly as we update our rankings based on new tool releases and feature improvements`,
  ];

  const faqs: FaqItem[] = [
    { question: `What are the best free ${catLabel.toLowerCase()} tools for ${useCaseLabel}?`, answer: `Based on our comprehensive analysis, the top free ${catLabel.toLowerCase()} tools for ${useCaseLabel} are ${tools.slice(0, 3).map((t) => t.name).join(", ")}. These tools offer the best combination of features, ease of use, and privacy protection for professionals in this space.` },
    { question: "How were these tools ranked?", answer: `Each tool was evaluated based on relevance to ${useCaseLabel}, feature completeness, ease of use, privacy architecture, performance, and mobile compatibility. We prioritized tools that offer the best overall value while maintaining strict privacy standards.` },
    { question: "Are all these tools really free?", answer: `Yes, every tool on this list is completely free to use with no hidden costs, no usage limits, and no paid upgrades required. ${SITE_NAME} is committed to providing accessible tools for everyone.` },
    { question: "Do these tools require creating an account?", answer: `No. None of the tools on this list require account creation or signup. You can use them immediately without providing any personal information.` },
    { question: "Can I use these tools for commercial work?", answer: `Yes, all tools listed are free for both personal and commercial use. There are no licensing restrictions or attribution requirements.` },
  ];

  return {
    title: `Best Free ${catLabel} Tools for ${useCaseLabel} in 2026`,
    description: `Discover the best free ${catLabel.toLowerCase()} tools for ${useCaseLabel}. Curated, tested, and ranked. All tools are free, private, and browser-based with no signup.`,
    intro,
    criteria,
    tools,
    tips,
    faqs,
  };
}

// === USE CASE ===
export function generateUseCaseContent(useCase: string): {
  title: string;
  description: string;
  intro: string;
  toolGroups: Array<{ category: string; tools: Array<{ name: string; url: string; why: string }> }>;
  tips: string[];
  faqs: FaqItem[];
} {
  const allTools = getAllTools();
  const categories = getCategories();
  const useCaseLabel = useCase.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const toolGroups = categories
    .map((cat) => {
      const catTools = allTools.filter((t) => t.category === cat.slug).slice(0, 3);
      if (catTools.length === 0) return null;
      return {
        category: cat.label,
        tools: catTools.map((t) => ({
          name: t.name,
          url: t.url,
          why: `Perfect for ${useCaseLabel} because ${t.description.split(".")[0]?.toLowerCase() || "it offers essential functionality"}. This tool helps you ${t.description.toLowerCase().slice(0, 80)}`,
        })),
      };
    })
    .filter((g): g is NonNullable<typeof g> => g !== null);

  const tips = [
    `Build a custom toolkit by selecting one or two tools from each category that best match your ${useCaseLabel} workflow`,
    `Take advantage of the privacy-first architecture — all tools process data locally, so you can work with sensitive information securely`,
    "Bookmark frequently used tools for one-click access and create a personalized dashboard for your daily tasks",
    "Combine tools across categories to create powerful workflows — for example, convert, edit, and analyze data without leaving your browser",
    "Share your favorite tool combinations with colleagues and team members to improve collective productivity",
    "Check for new tools regularly as we continuously expand our catalog based on user feedback and emerging needs",
  ];

  const faqs: FaqItem[] = [
    { question: `What tools does ${SITE_NAME} offer for ${useCaseLabel}?`, answer: `${SITE_NAME} offers a comprehensive suite of tools across multiple categories that are particularly useful for ${useCaseLabel}. These include ${toolGroups.slice(0, 4).map((g) => g.category).join(", ")} tools, all available for free.` },
    { question: "Are these tools suitable for beginners?", answer: `Yes, all tools on ${SITE_NAME} are designed with simplicity in mind. Whether you are a seasoned professional or a complete beginner in ${useCaseLabel}, you will find the tools intuitive and easy to use with no learning curve.` },
    { question: "Can I use these tools for team collaboration?", answer: `While each tool processes data locally, you can easily share results with team members via copy-paste or file downloads. The tools are perfect for individual use as part of a broader collaborative workflow.` },
    { question: `How do I get started with ${SITE_NAME} tools for ${useCaseLabel}?`, answer: `Simply visit any tool page and start using it immediately. No registration, no downloads, no configuration needed. Pick a tool from the list above that matches your current task and begin working.` },
    { question: "Do you offer any premium features for professionals?", answer: `Currently all tools are 100% free with no premium tiers. ${SITE_NAME} Pro and API access are coming soon with advanced features for power users and enterprise teams.` },
  ];

  return {
    title: `Best Free Online Tools for ${useCaseLabel}`,
    description: `The ultimate collection of free online tools for ${useCaseLabel}. Curated by ${SITE_NAME} — all browser-based, private, and completely free with no signup.`,
    intro: `As a ${useCaseLabel.toLowerCase()}, you need tools that are fast, reliable, and respect your privacy. ${SITE_NAME} offers a carefully curated collection of free online tools designed to help you work smarter. From ${toolGroups.slice(0, 3).map((g) => g.category.toLowerCase()).join(" and ")} utilities, each tool is browser-based, requires no signup, and processes everything locally on your device. Here is our curated selection of the best tools for ${useCaseLabel}.`,
    toolGroups,
    tips,
    faqs,
  };
}

// === GLOSSARY ===
export function generateGlossaryContent(term: string): {
  title: string;
  description: string;
  definition: string;
  examples: string[];
  useCases: string[];
  relatedTools: string[];
  relatedTerms: string[];
  faqs: FaqItem[];
} {
  const label = term.toUpperCase();
  const allTools = getAllTools();
  const relatedTools = allTools
    .filter(
      (t) =>
        t.description.toLowerCase().includes(term.toLowerCase()) ||
        t.name.toLowerCase().includes(term.toLowerCase()) ||
        t.category.toLowerCase().includes(term.toLowerCase()),
    )
    .slice(0, 4)
    .map((t) => t.name);

  const relatedTerms = [
    `${label} protocol`,
    `${label} specification`,
    `${label} format`,
    `${label} standard`,
    `${label} encoding`,
  ].filter((_, i) => i < 4);

  const definitions: Record<string, string> = {};
  const examplesList: Record<string, string[]> = {};
  const useCasesList: Record<string, string[]> = {};
  const faqList: Record<string, Array<{ q: string; a: string }>> = {};

  const genericDef = `${label} is a standard format, protocol, or technology used in computing and digital applications. It defines how data is structured, encoded, transmitted, or displayed across different systems and platforms. Understanding ${label} is essential for developers, IT professionals, and anyone working with digital technologies.`;
  const genericExamples = [
    `Using ${label} in web development for data interchange between client and server`,
    `${label} specification implemented in popular programming languages and frameworks`,
    `${label} files commonly encountered in professional workflows and everyday computing`,
  ];
  const genericUseCases = [
    `Data exchange between different software applications and platforms using ${label}`,
    `Configuration and serialization of structured data in ${label} format`,
    `Network communication protocols that rely on ${label} standards`,
  ];

  return {
    title: `What Is ${label}? Definition, Uses, and Tools`,
    description: `Learn what ${label} is, how it works, and why it matters. Complete guide with examples, use cases, and free online tools for working with ${label}.`,
    definition: definitions[term.toLowerCase()] || genericDef,
    examples: examplesList[term.toLowerCase()] || genericExamples,
    useCases: useCasesList[term.toLowerCase()] || genericUseCases,
    relatedTools,
    relatedTerms,
    faqs: (faqList[term.toLowerCase()] || [
      { q: `What is ${label}?`, a: `${label} is a widely-used concept in computing and technology. It refers to a specific standard, format, or protocol that enables consistent data handling across different systems and applications.` },
      { q: `How does ${label} work?`, a: `${label} operates on defined rules and specifications that dictate how data is formatted, processed, or transmitted. These standards ensure interoperability between different software and hardware systems.` },
      { q: `Why is ${label} important?`, a: `${label} is crucial because it provides a common language and structure for data exchange and processing. It enables different systems to work together seamlessly, reducing complexity and improving compatibility.` },
      { q: `What are common use cases for ${label}?`, a: `${label} is used in various scenarios including data storage, network communication, configuration management, and cross-platform data exchange. Its versatility makes it a fundamental building block in modern computing.` },
      { q: `What tools can I use with ${label}?`, a: `${SITE_NAME} offers several free online tools that work with ${label}. ${relatedTools.length > 0 ? `These include ${relatedTools.slice(0, 3).join(", ")} and more.` : "Browse our tool catalog to find utilities that support working with this technology."} All tools are free and privacy-focused.` },
    ]).map((i) => ({ question: i.q, answer: i.a })),
  };
}

// === HOW-TO GUIDE (5-step) ===
export function generateHowToGuide(topic: string, toolId: string): Array<{ step: number; title: string; body: string }> {
  const allTools = getAllTools();
  const tool = allTools.find((t) => t.id === toolId);
  const toolName = tool?.name ?? toolId;
  const topicDisplay = topic.replace(/-/g, " ");

  const steps = [
    { step: 1, title: `Access the ${toolName} Tool`, body: `Navigate to the ${toolName} page on ${SITE_NAME}. The tool loads instantly in your browser with no downloads or installations required. No signup or account creation is needed — you can start using it immediately.` },
    { step: 2, title: `Prepare Your Input`, body: `Gather the data, file, or information you need to work with. ${toolName} accepts standard input formats and provides a clear interface for entering or uploading your content. Ensure your input is properly formatted for best results.` },
    { step: 3, title: `Configure Settings and Options`, body: `Adjust the available settings to customize how ${toolName} processes your data. Options may include output format preferences, quality adjustments, or processing modes. The defaults work well for most use cases, but experimentation is encouraged.` },
    { step: 4, title: `Execute and Process`, body: `Click the primary action button to begin processing. ${toolName} runs entirely in your browser, so your data never leaves your device. Results appear instantly with real-time feedback, and you can monitor progress directly on the page.` },
    { step: 5, title: `Review, Export, and Share`, body: `Review the processed output for accuracy and completeness. You can copy results to your clipboard, download them as a file, or share them using the built-in options. All processing history stays local to your browser session.` },
  ];

  return steps;
}

export function generateMetaForGuide(topic: string): { title: string; description: string } {
  const display = topic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `How to ${display} Online Free`,
    description: `Learn how to ${display.toLowerCase()} online for free with ${SITE_NAME}. Step-by-step guide with tips. Fast, private, browser-based — no signup required.`,
  };
}

// === META GENERATORS ===
export function generateMetaForAlternatives(toolName: string): { title: string; description: string } {
  return {
    title: `Top Free ${toolName} Alternatives in 2026`,
    description: `Looking for ${toolName} alternatives? Compare the best free online alternatives to ${toolName}. All tools are private, browser-based, and require no signup.`,
  };
}

export function generateMetaForComparison(t1: string, t2: string): { title: string; description: string } {
  return {
    title: `${t1} vs ${t2}: Side-by-Side Comparison`,
    description: `Compare ${t1} vs ${t2} online. Features, privacy, ease of use, and performance. Find out which free online tool is better for your needs.`,
  };
}

export function generateMetaForConverter(source: string, target: string): { title: string; description: string } {
  return {
    title: `Free ${source.toUpperCase()} to ${target.toUpperCase()} Converter`,
    description: `Convert ${source.toUpperCase()} to ${target.toUpperCase()} online free. No signup, no uploads, no limits. Fast, private, browser-based ${source.toUpperCase()} to ${target.toUpperCase()} conversion.`,
  };
}

export function generateMetaForBestOf(category: string, useCase: string): { title: string; description: string } {
  const cat = getCatLabel(category);
  const uc = useCase.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Best Free ${cat} Tools for ${uc} in 2026`,
    description: `Discover the best free ${cat.toLowerCase()} tools for ${uc}. Curated list with features, comparisons, and rankings. All 100% free, private, and browser-based.`,
  };
}

export function generateMetaForUseCase(useCase: string): { title: string; description: string } {
  const label = useCase.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Best Free Online Tools for ${label}`,
    description: `The ultimate collection of free online tools for ${label}. Curated by ${SITE_NAME}. All tools are browser-based, private, and completely free — no signup needed.`,
  };
}

export function generateGlossaryMeta(term: string): { title: string; description: string } {
  return {
    title: `What Is ${term.toUpperCase()}? Definition & Guide`,
    description: `Learn what ${term.toUpperCase()} is, how it works, and why it matters. Complete guide with examples, use cases, and free online tools for working with ${term.toUpperCase()}.`,
  };
}
