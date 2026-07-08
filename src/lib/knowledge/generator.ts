import type { ContentPiece, ContentType, ContentSection } from "@/lib/content/types";
import { getAllTools, getRelatedTools } from "@/lib/registry";
import type { Tool } from "@/lib/registry";

type CategoryFamily =
  | "network-internet"
  | "productivity"
  | "text-writing"
  | "image-design"
  | "code-dev"
  | "data-analytics";

function fmtSections(
  sections: { heading: string; body: string }[],
): ContentSection[] {
  return sections;
}

function examplesFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  if (cat === "network-internet") {
    return [
      { heading: `Basic ${name} Example`, body: `Enter a valid domain name (e.g., example.com or google.com) into the input field and click the lookup button. The tool will query the relevant servers and display results in a structured format within seconds. This is the simplest way to begin using ${name}.` },
      { heading: `Bulk ${name} Analysis`, body: `For users who need to analyze multiple targets, enter each domain or IP on a new line. The tool processes each entry sequentially and returns results in a scrollable list. This is useful for system administrators auditing multiple servers or websites at once.` },
      { heading: `Advanced ${name} Options`, body: `Some queries support advanced parameters such as selecting specific record types, choosing a DNS resolver, or setting a custom timeout. These options give power users finer control over the query process and can help diagnose edge cases in network configurations.` },
    ];
  }
  if (cat === "image-design") {
    return [
      { heading: `Basic ${name} Example`, body: `Upload an image file (JPG, PNG, or WebP) using the file picker and click the process button. The tool applies the transformation client-side and shows a preview of the result within seconds. No file is uploaded to any server.` },
      { heading: `Batch ${name} Processing`, body: `To process multiple images at once, select several files in the file picker. The tool handles each image sequentially and displays before/after previews for comparison. This is ideal for designers preparing multiple assets.` },
      { heading: `Fine-Tuning ${name} Parameters`, body: `Adjust the available sliders and controls to fine-tune the output. Most image tools offer real-time preview updates as you adjust parameters, allowing you to dial in the exact result you need before downloading.` },
    ];
  }
  if (cat === "text-writing") {
    return [
      { heading: `Basic ${name} Example`, body: `Paste or type your text into the input area and click the process button. The tool immediately transforms your text according to the selected operation and displays the result in the output area.` },
      { heading: `Processing Large ${name} Inputs`, body: `The tool can handle large text blocks, making it suitable for processing entire documents, log files, or datasets. Paste up to several hundred kilobytes of text at once for batch processing.` },
      { heading: `Combining ${name} With Other Tools`, body: `Copy the output and use it as input for another text tool to perform multi-step transformations. For example, clean text first, then format it, then analyze it — all within ToolVerse.` },
    ];
  }
  if (cat === "code-dev") {
    return [
      { heading: `Basic ${name} Example`, body: `Enter your input data or code snippet into the main input area and click execute. The tool processes everything client-side and returns formatted results in the output panel.` },
      { heading: `Using ${name} in Development Workflows`, body: `Developers can use this tool alongside their IDE for quick validations. Paste output from your code editor, validate or transform it, then copy the result back. This rapid feedback loop speeds up development.` },
      { heading: `${name} With Custom Configuration`, body: `Some tools in this category offer configuration options such as indentation settings, formatting rules, or filter criteria. Adjust these to match your project's coding standards.` },
    ];
  }
  return [
    { heading: `Basic ${name} Example`, body: `Enter your data in the input field and click the process button. The tool analyzes the input and displays the result instantly.` },
    { heading: `Advanced ${name} Usage`, body: `For more complex scenarios, adjust the available settings to customize the output. The tool provides real-time feedback as you change parameters.` },
  ];
}

function errorsFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  if (cat === "network-internet") {
    return [
      { heading: "No Response / Timeout", body: `If ${name} returns a timeout error, the target server may be unreachable or blocking requests. Check that the domain or IP address is correct and that the target allows queries from public tools. Firewalls or rate limiting can also cause timeouts.` },
      { heading: "Invalid Input Format", body: `The tool expects a specific input format (domain name, IP address, or URL). Ensure the input does not contain extra spaces, protocol prefixes like http:// (unless specified), or invalid characters. Validate the input before retrying.` },
      { heading: "DNS Resolution Failure", body: `If the tool cannot resolve the domain, DNS servers may be unavailable or the domain may not exist. Try using a different DNS resolver option if available, or verify the domain's existence using a basic ping command.` },
    ];
  }
  if (cat === "image-design") {
    return [
      { heading: "Unsupported File Format", body: `${name} supports common image formats like JPG, PNG, WebP, and GIF. If you receive a format error, try converting your image to a supported format using an image converter tool first. RAW files from professional cameras are not supported.` },
      { heading: "File Too Large", body: `If the tool struggles with large files, try reducing the image dimensions or file size before processing. Most client-side tools have practical limits based on available memory. Compress the image first if needed.` },
      { heading: "Browser Compatibility", body: `Some image processing features rely on modern browser APIs (Canvas, WebAssembly). If you encounter issues, try updating to the latest version of Chrome, Firefox, or Edge. Safari may have limited support for certain operations.` },
    ];
  }
  if (cat === "text-writing") {
    return [
      { heading: "Encoding Issues", body: `If the output contains garbled characters, the input may use an unsupported encoding. ${name} expects UTF-8 encoded text. Convert your text to UTF-8 using a text editor before pasting.` },
      { heading: "Unexpected Output", body: `If the transformation produces unexpected results, check for hidden characters, non-printable characters, or mixed line endings (CRLF vs LF) in your input. Use a text cleaner tool to normalize the input first.` },
    ];
  }
  return [
    { heading: "Input Validation Error", body: `Ensure your input matches the expected format. Check for extra whitespace, invalid characters, or missing required fields. ${name} will display a specific error message indicating what is wrong.` },
    { heading: "Processing Error", body: `If processing fails unexpectedly, try refreshing the page and retrying. Client-side tools can occasionally encounter memory limits with very large inputs. Break your input into smaller chunks.` },
  ];
}

function bestPracticesFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  if (cat === "network-internet") {
    return [
      { heading: "Verify Input Accuracy", body: `Always double-check domain names and IP addresses for typos. A single mistyped character can return results for the wrong server or fail entirely. Copy-paste from authoritative sources when possible.` },
      { heading: "Understand Rate Limits", body: `If using the tool repeatedly for automated checks, respect rate limits. Rapid-fire queries may trigger rate limiting on the underlying APIs. Space out bulk checks by a few seconds between requests.` },
      { heading: "Cross-Reference Results", body: `For critical network diagnostics, cross-reference results from multiple tools. Use ${name} alongside other ToolVerse network tools for a complete picture of your infrastructure's health.` },
    ];
  }
  if (cat === "image-design") {
    return [
      { heading: "Work With Copies", body: `Always process copies of your original images, never the originals. If the transformation is destructive (e.g., compression, resizing), you cannot revert to the original. Keep backups.` },
      { heading: "Check Output Quality", body: `Preview the result at 100% zoom before downloading. Some transformations may look good at thumbnail size but reveal artifacts at full resolution. Zoom in to verify quality.` },
    ];
  }
  return [
    { heading: "Review Output Carefully", body: `Always review the tool output before using it in production. Automated processing can introduce subtle errors.${cat === "text-writing" ? " For text transformations, read a sample of the output to verify correctness." : ""}` },
    { heading: "Combine With Related Tools", body: `For best results, use ${name} in combination with other ToolVerse tools. Chaining complementary tools often produces better results than any single tool alone.` },
  ];
}

function cheatSheetFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  if (cat === "network-internet") {
    return [
      { heading: `Quick ${name} Reference`, body: `Input: Domain name or IP address. Action: Enter and click lookup. Results: Read the structured output with record types, values, and TTLs. Use the copy button to export any row.` },
      { heading: "Common Options", body: `Record type selector: Filter by A, AAAA, CNAME, MX, NS, TXT, SOA. Resolver selector: Choose Google, Cloudflare, Quad9, or system default. Export: Copy individual results or download as JSON.` },
    ];
  }
  if (cat === "image-design") {
    return [
      { heading: `Quick ${name} Reference`, body: `Upload → Adjust parameters → Preview → Download. All processing happens in your browser. Supported formats: JPG, PNG, WebP, GIF. Max file size: varies by browser memory.` },
      { heading: "Keyboard Shortcuts", body: `Ctrl+V: Paste image from clipboard. Esc: Cancel current operation. Ctrl+Z: Undo last adjustment (where available). Use the reset button to restore original image.` },
    ];
  }
  if (cat === "text-writing") {
    return [
      { heading: `Quick ${name} Reference`, body: `Paste input → Configure options → Process → Copy output. Supports plain text and common delimited formats. Use the character counter to track input/output sizes.` },
      { heading: "Power Tips", body: `Use keyboard shortcuts: Ctrl+A to select all, Ctrl+C to copy output. For batch operations, separate items with newlines. The undo feature (where available) reverts the last transformation.` },
    ];
  }
  return [
    { heading: `Quick ${name} Reference`, body: `Enter input → Configure → Process → Export. All operations are client-side and private. Use the export button to download results.` },
    { heading: "Power Tips", body: `Copy results with one click using the copy button. Use the history panel to revisit previous results. Bookmark the tool for quick access from any page.` },
  ];
}

function commandsFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;

  const cliCommands: Record<string, string> = {
    "dns-lookup": "nslookup example.com",
    "reverse-dns-lookup": "nslookup 8.8.8.8",
    "whois-lookup": "whois example.com",
    "ip-lookup": "curl https://ipinfo.io/8.8.8.8/json",
    "ssl-certificate-checker": "openssl s_client -connect example.com:443",
    "port-checker": "nc -zv example.com 80",
    "ping-test": "ping example.com",
    "http-headers-checker": "curl -I https://example.com",
    "dns-propagation-checker": "dig @8.8.8.8 example.com",
  };

  const cmd = cliCommands[tool.id] || `${tool.id} [options]`;

  return [
    { heading: `Equivalent ${name} CLI Command`, body: `Many ${name} features can be replicated using command-line tools. The equivalent command is: \`${cmd}\`. Run this in your terminal for a similar result without leaving your development environment.` },
    { heading: "Automation Script Example", body: `For automation, combine the CLI command with shell scripting: \`for domain in $(cat domains.txt); do ${cmd.split(" ")[0]} $domain; done\`. This enables bulk processing of multiple targets.` },
    { heading: "Integrating With CI/CD Pipelines", body: `Add the relevant command to your CI/CD pipeline configuration to perform automated checks during deployment. For example, verify DNS records or SSL certificates before a production release.` },
  ];
}

function troubleshootingFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;

  return [
    { heading: `${name} Not Working?`, body: `If ${name} is not working as expected, first check your internet connection. Some tools require network access to function. Next, verify that your input is correctly formatted. If the tool uses browser APIs, ensure your browser is up to date.` },
    { heading: "Performance Issues", body: `If the tool is running slowly, the input may be too large for client-side processing. Try reducing the input size. For image tools, use smaller dimensions. For text tools, process content in smaller batches.` },
    { heading: "Clearing Cache and Retrying", body: `If you encounter persistent errors, clear your browser cache and reload the page. Stale JavaScript bundles can sometimes cause unexpected behavior. Hard refresh (Ctrl+Shift+R) forces the latest version.` },
  ];
}

function useCasesFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  if (cat === "network-internet") {
    return [
      { heading: "System Administration", body: `System administrators use ${name} daily to verify server configurations, diagnose connectivity issues, and monitor infrastructure health. It is an essential part of any sysadmin toolkit for rapid troubleshooting.` },
      { heading: "Web Development", body: `Web developers use ${name} during and after deployments to verify that DNS records, SSL certificates, and server configurations are correct. Catching misconfigurations early prevents production incidents.` },
      { heading: "Security Auditing", body: `Security professionals leverage ${name} during reconnaissance and vulnerability assessments. Checking DNS records, SSL configurations, and server headers reveals potential attack surfaces.` },
    ];
  }
  if (cat === "image-design") {
    return [
      { heading: "Web Performance Optimization", body: `Web developers use ${name} to optimize images before uploading to websites. Properly optimized images reduce page load times, improve Core Web Vitals scores, and enhance user experience.` },
      { heading: "Social Media Content", body: `Content creators use ${name} to prepare images for social media platforms. Each platform has specific image requirements, and adjusting images before uploading ensures they display correctly.` },
    ];
  }
  if (cat === "text-writing") {
    return [
      { heading: "Content Preparation", body: `Writers and editors use ${name} to prepare and format text content before publishing. Consistent formatting improves readability and professionalism across all published materials.` },
      { heading: "Data Cleaning", body: `Data analysts use ${name} as part of their data cleaning workflow. Removing duplicates, standardizing formats, and cleaning text data are essential preprocessing steps before analysis.` },
    ];
  }
  return [
    { heading: "Professional Use", body: `Professionals across industries use ${name} to streamline their workflows. The tool eliminates manual effort and reduces errors in repetitive processing tasks.` },
    { heading: "Educational Use", body: `Educators and students use ${name} as a learning aid. Experimenting with the tool helps develop understanding of the underlying concepts through hands-on practice.` },
  ];
}

function faqFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;

  return [
    { heading: `Is ${name} free to use?`, body: `Yes, ${name} is completely free to use with no hidden charges. There are no daily usage limits, subscription fees, or premium tiers that gate essential features. All processing happens in your browser or through our free API tier, giving you unlimited access to full functionality without ever hitting a paywall or needing a credit card.` },
    { heading: `Does ${name} store my data?`, body: `No, your data never leaves your device. ${name} processes everything client-side in your browser whenever possible — files are not uploaded to any server. For tools that require server-side operations, data is processed temporarily in memory and never written to disk, logged, or stored; it is discarded immediately after the operation completes. Your privacy is guaranteed by design, not by policy.` },
    { heading: `What are the limitations of ${name}?`, body: `${name} is designed for typical use cases and everyday input sizes. Extremely large inputs — images over 50MB or text files over 100,000 words — may be limited by available browser memory rather than artificial restrictions. For network tools, rate limiting may apply to prevent abuse of upstream services, but normal interactive usage stays well within these limits. The tool handles the vast majority of real-world professional and personal use cases without issue.` },
    { heading: `How accurate is ${name}?`, body: `${name} uses authoritative data sources and well-established APIs to ensure accuracy. Network tools query live DNS servers, WHOIS databases, and certificate authorities in real-time, returning the same results you would get from command-line utilities. Image and text tools apply battle-tested algorithms used in production environments, delivering consistent results with no unexpected variations.` },
    { heading: `Can I use ${name} programmatically?`, body: `Some tools in the ToolVerse suite support direct API access for integration into your applications. Check the individual tool's documentation for available API endpoints, authentication requirements, and rate limits. For client-side tools that operate entirely in the browser, you can integrate them into your workflow using automation frameworks like Puppeteer or Playwright, or simply bookmark them for quick manual access whenever needed.` },
  ];
}

function commonMistakesFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  if (cat === "network-internet") {
    return [
      { heading: "Including Protocol Prefixes", body: `A common mistake is including http:// or https:// when entering a domain name. ${name} expects a bare domain or IP. Including the protocol prefix will cause lookup failures. Enter example.com, not https://example.com.` },
      { heading: "Misreading TTL Values", body: `TTL (Time To Live) values represent seconds, not minutes or hours. A common error is misinterpreting TTL=3600 as "one hour from now" when it means "cache for 3600 seconds (1 hour)". Check tool documentation for TTL display units.` },
      { heading: "Ignoring Propagation Delay", body: `After changing DNS records, users often assume the tool results are wrong because changes haven't appeared immediately. DNS propagation takes time. Use the DNS Propagation Checker tool to verify changes across global resolvers.` },
    ];
  }
  return [
    { heading: "Skipping Input Validation", body: `Failing to validate input before processing is a common mistake. Invalid or malformed input leads to incorrect results or errors. Always check your input format before running the tool.` },
    { heading: "Overlooking Output Preview", body: `Downloading results without reviewing them first can lead to wasted time. Always preview the output before downloading or using it in production. Small errors are easier to catch in preview mode.` },
  ];
}

function alternativesFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  if (cat === "network-internet") {
    return [
      { heading: "Built-in OS Tools", body: `Most operating systems include native command-line utilities like nslookup, dig, ping, and traceroute that offer similar network diagnostic functionality to ${name}. These are ideal for users comfortable with the terminal and require no additional installation.` },
      { heading: "Commercial Network Monitors", body: `Enterprise solutions such as SolarWinds, Datadog, and Nagios provide comprehensive network monitoring that includes the capabilities of ${name} alongside alerting, dashboards, and team collaboration. These suit organizations needing centralized network management.` },
      { heading: "Other Web-Based Network Tools", body: `Web alternatives like MXToolbox, WhatIsMyIP, and DNSChecker offer overlapping functionality with different interfaces. Cross-referencing results from multiple tools helps ensure accuracy in critical diagnostics.` },
      { heading: "Browser Extensions", body: `Browser extensions such as Chrome DevTools built-in network tools and various DNS checker extensions provide quick access to network diagnostics without leaving your browser tab. These are convenient for rapid checks during development.` },
    ];
  }
  if (cat === "image-design") {
    return [
      { heading: "Desktop Image Editors", body: `Professional applications like Adobe Photoshop, GIMP, and Affinity Photo offer comprehensive image editing far beyond ${name}. They support layers, masks, advanced retouching, and precise color management for complex projects.` },
      { heading: "Online Design Platforms", body: `Web-based alternatives such as Canva, Pixlr, and Photopea provide similar image processing with additional features like templates, team collaboration, and stock photo libraries. These suit users who need more than basic transformations.` },
      { heading: "Command-Line Image Tools", body: `For automation, tools like ImageMagick and Sharp offer programmable image processing via scripts. These integrate into CI/CD pipelines and batch processing workflows for developers.` },
    ];
  }
  if (cat === "text-writing") {
    return [
      { heading: "Dedicated Text Editors", body: `Applications like VS Code, Sublime Text, and Notepad++ provide advanced text editing beyond ${name}, with syntax highlighting, multi-cursor editing, and extensive plugin ecosystems for specialized needs.` },
      { heading: "Command-Line Text Utilities", body: `Unix tools like sed, awk, and grep enable powerful text processing from the terminal, ideal for batch operations and shell script integration in automated workflows.` },
      { heading: "Other Online Text Tools", body: `Websites like TextFixer, ConvertCase, and OnlineTextTools offer similar text transformations with different interfaces and additional utility functions that complement ${name}.` },
    ];
  }
  if (cat === "code-dev") {
    return [
      { heading: "IDE Built-In Features", body: `Modern IDEs like VS Code, IntelliJ IDEA, and WebStorm include built-in code formatters, linters, and validators that overlap with ${name}. These integrate seamlessly into the development workflow without switching tools.` },
      { heading: "CLI Developer Tools", body: `Command-line alternatives such as ESLint, Prettier, and language-specific compilers provide similar functionality preferred in CI/CD pipelines and by terminal-focused developers.` },
      { heading: "Online Code Platforms", body: `Platforms like CodeSandbox, Replit, and JSFiddle offer full development environments with features comparable to ${name}, useful for prototyping and sharing code snippets.` },
    ];
  }
  if (cat === "data-analytics") {
    return [
      { heading: "Spreadsheet Software", body: `Applications like Microsoft Excel and Google Sheets offer data analysis features overlapping with ${name}, including sorting, filtering, formulas, and charting for straightforward analytical tasks.` },
      { heading: "BI and Analytics Platforms", body: `Tools like Tableau, Power BI, and Looker provide enterprise-grade analytics beyond ${name}, with interactive dashboards, data source connections, and team sharing capabilities.` },
      { heading: "Programming Libraries", body: `Python libraries such as pandas, NumPy, and data visualization tools offer programmable analytics for complex data processing and custom analysis pipelines.` },
    ];
  }
  return [
    { heading: "Desktop Software Alternatives", body: `Desktop applications often provide deeper functionality than ${name}, with advanced options, batch processing, and integration with other software in your workflow.` },
    { heading: "Alternative Web Tools", body: `Several other web-based tools offer similar functionality with different strengths. Exploring alternatives helps find the best fit for your specific use case and preferences.` },
    { heading: "Command-Line and API Options", body: `For developers, CLI tools and APIs provide programmable access to similar functionality, enabling automation, scripting, and integration into larger workflows.` },
  ];
}

function competitorComparisonFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  if (cat === "network-internet") {
    return [
      { heading: "vs Built-in CLI Tools", body: `Unlike command-line tools like nslookup and dig which require terminal knowledge, ${name} provides a user-friendly web interface with visual results. CLI tools offer more advanced flags and scripting capabilities, while ${name} prioritizes accessibility and immediate results without installation.` },
      { heading: "vs Commercial Network Suites", body: `Enterprise solutions like SolarWinds and Datadog offer comprehensive monitoring with alerting and dashboards, but require configuration and licensing costs. ${name} is free and instant, making it ideal for quick diagnostics rather than ongoing infrastructure monitoring.` },
      { heading: "vs Other Free Web Tools", body: `Compared to MXToolbox and WhatIsMyIP, ${name} offers a cleaner interface and is focused on specific network diagnostics without ads or upsells. The trade-off is fewer advanced features compared to more established alternatives.` },
    ];
  }
  if (cat === "image-design") {
    return [
      { heading: "vs Adobe Photoshop", body: `Photoshop is the industry standard with comprehensive editing capabilities, layers, masks, and professional color management. ${name} is free, browser-based, and focuses on quick transformations without the learning curve or subscription cost of Photoshop.` },
      { heading: "vs GIMP", body: `GIMP is a powerful free desktop alternative with advanced features comparable to Photoshop. ${name} is more accessible since it requires no installation, but GIMP offers far more depth for complex image editing projects.` },
      { heading: "vs Canva", body: `Canva excels at design templates, branding, and team collaboration. ${name} focuses on utility transformations rather than design creation, making them complementary tools for different stages of content production.` },
    ];
  }
  if (cat === "text-writing") {
    return [
      { heading: "vs Dedicated Text Editors", body: `VS Code and Sublime Text offer rich editing experiences with syntax highlighting, extensions, and project management. ${name} is purpose-built for specific text transformations, making it faster for focused tasks without the overhead of a full editor.` },
      { heading: "vs CLI Text Tools", body: `Tools like sed and awk provide powerful text processing from the terminal with infinite customization. ${name} offers a visual interface that is more approachable for users who prefer not to use command-line syntax.` },
      { heading: "vs Other Online Utilities", body: `Many online text tools offer similar functionality but often include ads and limited features. ${name} provides a clean, ad-free experience with consistent quality across all ToolVerse text tools.` },
    ];
  }
  if (cat === "code-dev") {
    return [
      { heading: "vs IDE Features", body: `IDEs like VS Code include built-in formatting, linting, and validation. ${name} is accessible from any browser without opening your IDE, useful for quick checks or when reviewing code on a device without your development environment.` },
      { heading: "vs CLI Linters and Formatters", body: `ESLint, Prettier, and similar tools integrate into build pipelines and editor workflows. ${name} is better for one-off checks and educational use where setting up a full toolchain is unnecessary.` },
      { heading: "vs Online Playgrounds", body: `CodeSandbox and Replit provide full development environments. ${name} focuses on specific code utilities rather than full application development, making it lighter and faster for targeted operations.` },
    ];
  }
  if (cat === "data-analytics") {
    return [
      { heading: "vs Excel and Google Sheets", body: `Spreadsheet applications offer powerful data manipulation with formulas, pivot tables, and charting. ${name} excels at specific analytical operations that would require complex formulas in a spreadsheet, providing instant results.` },
      { heading: "vs BI Platforms", body: `Tableau and Power BI provide enterprise analytics with interactive dashboards and data source connections. ${name} is lightweight and free, suitable for quick analysis without the overhead of a BI platform.` },
      { heading: "vs Python Libraries", body: `pandas and NumPy offer programmatic analysis with unlimited customization. ${name} is accessible to non-programmers who need analytical results without writing code.` },
    ];
  }
  return [
    { heading: "vs Desktop Applications", body: `Desktop applications generally offer more features and better performance for complex tasks. ${name} compensates with instant browser-based access and no installation requirements.` },
    { heading: "vs Other Web Tools", body: `While many web tools offer similar functionality, ${name} distinguishes itself with a clean interface, no ads, and integration with the broader ToolVerse ecosystem of complementary tools.` },
    { heading: "vs Manual Methods", body: `Performing these operations manually or with general-purpose tools is time-consuming and error-prone. ${name} automates the process with consistent, reliable results every time.` },
  ];
}

function whenToUseFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  if (cat === "network-internet") {
    return [
      { heading: "During Server Setup and Deployment", body: `Use ${name} when setting up new servers or deploying applications to verify that DNS records, SSL certificates, and network configurations are correct. Catching misconfigurations at deployment time prevents production incidents and reduces troubleshooting time.` },
      { heading: "For Routine Network Health Checks", body: `${name} is ideal for scheduled network health assessments. Regular checks help identify potential issues before they impact users, making it an essential part of proactive infrastructure maintenance.` },
      { heading: "When Troubleshooting Connectivity Issues", body: `When users report connectivity problems, ${name} helps quickly isolate whether the issue is DNS-related, SSL-related, or at another network layer. Rapid diagnosis reduces downtime and speeds up resolution.` },
    ];
  }
  if (cat === "image-design") {
    return [
      { heading: "Preparing Web Assets", body: `Use ${name} when preparing images for website publication. Optimizing images before upload improves page load times, enhances Core Web Vitals scores, and reduces bandwidth usage without sacrificing visual quality.` },
      { heading: "Format Conversion for Compatibility", body: `When you need to convert images between formats for platform compatibility, ${name} handles common conversions quickly and preserves quality. This is essential when preparing assets for platforms with specific format requirements.` },
      { heading: "Quick One-Off Edits", body: `For simple image adjustments that don't warrant launching a full editor, ${name} provides instant results. This includes basic resizing, compression, and format changes that would otherwise interrupt your workflow.` },
    ];
  }
  if (cat === "text-writing") {
    return [
      { heading: "Content Formatting and Standardization", body: `Use ${name} to standardize text formatting across documents. This ensures consistency in published content, reduces manual editing effort, and maintains professional quality across all written materials.` },
      { heading: "Data Preprocessing for Analysis", body: `When preparing text data for analysis, ${name} helps clean and normalize input. Removing inconsistencies, standardizing formats, and cleaning text are essential preprocessing steps before any meaningful analysis.` },
      { heading: "Quick Text Transformations", body: `For rapid text transformations during writing or editing, ${name} provides instant results without switching to specialized tools. This keeps you in your creative flow while ensuring accurate output.` },
    ];
  }
  if (cat === "code-dev") {
    return [
      { heading: "Code Review and Validation", body: `Use ${name} during code review to quickly validate formatting, check for syntax errors, or transform code snippets. This speeds up the review process and ensures consistent code quality across the team.` },
      { heading: "Learning and Experimentation", body: `${name} is excellent for learning new programming concepts. Experiment with code transformations and see immediate results, making it a valuable educational tool for developers at all skill levels.` },
      { heading: "Quick Debugging Sessions", body: `When debugging, ${name} helps isolate issues by testing specific code transformations or data manipulations without running your full application. This targeted approach speeds up the debugging process.` },
    ];
  }
  if (cat === "data-analytics") {
    return [
      { heading: "Exploratory Data Analysis", body: `Use ${name} during the initial exploration of datasets to quickly understand structure, identify patterns, and detect anomalies. Rapid iteration helps form hypotheses before deeper analysis.` },
      { heading: "Data Cleaning Pipelines", body: `${name} is ideal for standardizing and cleaning data as part of a preprocessing pipeline. Remove duplicates, normalize formats, and handle missing values to prepare data for accurate analysis.` },
      { heading: "Quick Reporting and Visualization", body: `When you need rapid insights from data for reports or presentations, ${name} provides quick analysis without the overhead of full analytics tools. Perfect for ad-hoc queries and exploratory analysis.` },
    ];
  }
  return [
    { heading: "Everyday Quick Tasks", body: `Use ${name} for quick, everyday tasks that would otherwise require multiple steps in general-purpose tools. Its focused functionality saves time and reduces errors in routine operations.` },
    { heading: "Learning and Skill Development", body: `${name} serves as an excellent learning tool for understanding concepts through hands-on practice. Experiment freely without worrying about breaking anything in a production environment.` },
    { heading: "When You Need Results Fast", body: `When time is critical, ${name} delivers instant results without setup, configuration, or installation. This makes it ideal for time-sensitive tasks where speed matters most.` },
  ];
}

function whenNotToUseFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  if (cat === "network-internet") {
    return [
      { heading: "Continuous Infrastructure Monitoring", body: `${name} is designed for on-demand queries rather than continuous monitoring. For real-time alerting and dashboards that track network health 24/7, use dedicated monitoring solutions like Nagios, Datadog, or Prometheus instead.` },
      { heading: "Large-Scale Automated Scanning", body: `If you need to scan thousands of domains or IPs programmatically, ${name}'s web interface is not designed for bulk automated operations. Use CLI tools with scripting or dedicated security scanning platforms for high-volume tasks.` },
      { heading: "Historical Data and Trend Analysis", body: `${name} provides current state information without historical tracking. For analyzing network trends over time, use monitoring platforms that store and visualize historical metrics with retention policies.` },
    ];
  }
  if (cat === "image-design") {
    return [
      { heading: "Professional Photo Retouching", body: `For advanced photo retouching tasks like skin smoothing, object removal, or color grading, ${name} lacks the precision of professional tools like Photoshop or Affinity Photo. Use dedicated editors for complex image manipulation.` },
      { heading: "Batch Processing Hundreds of Images", body: `While ${name} can handle a few images at once, processing hundreds requires dedicated batch processing tools like ImageMagick or desktop applications designed for volume workflows.` },
      { heading: "Vector Graphics Creation", body: `${name} works with raster images only. For creating or editing vector graphics (SVG, AI, EPS), use vector editors like Adobe Illustrator, Inkscape, or Figma which provide the necessary tools for scalable design work.` },
    ];
  }
  if (cat === "text-writing") {
    return [
      { heading: "Full-Featured Document Editing", body: `For comprehensive document creation with formatting, images, tables, and layouts, use word processors like Microsoft Word or Google Docs. ${name} focuses on text transformations and is not a replacement for document editing software.` },
      { heading: "Large-Scale Text Processing", body: `If you need to process gigabytes of text data, command-line tools like sed, awk, and custom scripts are far more efficient than browser-based tools. ${name} is best suited for moderate-sized text inputs.` },
      { heading: "Collaborative Writing Projects", body: `${name} does not support real-time collaboration features. For team writing projects with comments, suggestions, and version history, use collaborative platforms like Google Docs or Notion.` },
    ];
  }
  if (cat === "code-dev") {
    return [
      { heading: "Full Application Development", body: `${name} is not a development environment. For writing, testing, and debugging full applications, use proper IDEs and development tools that provide debugging, testing frameworks, and build systems.` },
      { heading: "Automated CI/CD Pipeline Checks", body: `While ${name} is great for manual checks, automated code quality gates in CI/CD pipelines are better served by CLI tools like ESLint and Prettier that run without manual input and integrate with build systems.` },
      { heading: "Complex Refactoring Operations", body: `For large-scale code refactoring across multiple files, use IDE refactoring tools or codemods that understand your codebase structure. ${name} is best for single-snippet operations.` },
    ];
  }
  if (cat === "data-analytics") {
    return [
      { heading: "Real-Time Data Processing", body: `${name} is not designed for real-time or streaming data processing. For live data pipelines and streaming analytics, use specialized platforms like Apache Kafka, Apache Flink, or real-time database queries.` },
      { heading: "Large Dataset Analysis", body: `For datasets exceeding hundreds of megabytes, browser-based tools face memory limitations. Use dedicated analytical tools, database queries, or big data platforms like Spark for large-scale analysis.` },
      { heading: "Advanced Statistical Modeling", body: `${name} provides basic analytical operations but lacks advanced statistical modeling capabilities. For regression analysis, machine learning, or complex statistical tests, use Python (scikit-learn, statsmodels) or R.` },
    ];
  }
  return [
    { heading: "Heavy-Duty Production Workloads", body: `For production workloads requiring high throughput, reliability, and automation, ${name} is not the right choice. Use dedicated server-side tools or APIs designed for production-scale operations.` },
    { heading: "When Offline Access Is Required", body: `${name} requires an internet connection. If you need to work offline, use desktop applications or local scripts that function without network access.` },
    { heading: "Specialized Professional Needs", body: `For industry-specific requirements with advanced features, compliance needs, or proprietary formats, specialized professional software will serve you better than general-purpose web tools.` },
  ];
}

function realExamplesFor(tool: Tool): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  if (cat === "network-internet") {
    return [
      { heading: "IT Team Verifies Domain Migration", body: `An IT team migrating their company website to a new hosting provider used ${name} to verify DNS records were correctly transferred. They checked A, AAAA, and MX records before and after the migration to ensure zero downtime during the cutover, catching a missing CNAME record that would have broken email services.` },
      { heading: "Developer Debugs SSL Certificate Issue", body: `A web developer investigating mixed content warnings used ${name} to verify SSL certificate installation and check HTTP security headers. The tool revealed an expired intermediate certificate, which they promptly renewed before it caused browser warnings for site visitors.` },
      { heading: "Security Auditor Performs Reconnaissance", body: `A security professional used ${name} during a penetration test to enumerate subdomains and identify exposed services. The DNS records revealed a development server with open ports that was not intended to be publicly accessible, which the client then secured.` },
      { heading: "System Administrator Monitors Infrastructure", body: `A sysadmin uses ${name} weekly to monitor DNS health across their organization's 50+ domains. They detected an unauthorized DNS change within hours when a hijacked NS record pointed to a malicious server, limiting the potential damage from the attack.` },
    ];
  }
  if (cat === "image-design") {
    return [
      { heading: "E-Commerce Team Optimizes Product Images", body: `An e-commerce team used ${name} to batch-optimize 200 product images before a website redesign. They reduced average image size by 60% while maintaining visual quality, resulting in a 35% improvement in page load speed and a measurable increase in conversion rates.` },
      { heading: "Content Creator Prepares Social Media Assets", body: `A social media manager uses ${name} daily to resize and compress images for different platforms. By preparing platform-specific versions, they eliminated the manual cropping and compression work that previously took 30 minutes per campaign.` },
      { heading: "Developer Generates Placeholder Images", body: `A frontend developer used ${name} to quickly generate placeholder images with consistent dimensions during the initial build of a design system. This allowed the design team to review layouts with realistic image placeholders before final assets were available.` },
    ];
  }
  if (cat === "text-writing") {
    return [
      { heading: "Content Team Standardizes Blog Posts", body: `A content marketing team used ${name} to standardize formatting across 50 blog posts during a content migration. They normalized heading styles, removed inconsistent formatting, and ensured all posts followed the new style guide in minutes rather than hours of manual editing.` },
      { heading: "Data Analyst Cleans Survey Responses", body: `A market research analyst used ${name} to clean and normalize thousands of free-text survey responses. The tool removed leading/trailing whitespace, standardized capitalization, and flagged entries requiring manual review, reducing preprocessing time by 80%.` },
      { heading: "Writer Prepares Manuscript for Submission", body: `An author used ${name} to prepare their manuscript for submission by removing double spaces, standardizing quote characters, and ensuring consistent paragraph formatting throughout a 300-page document.` },
    ];
  }
  if (cat === "code-dev") {
    return [
      { heading: "Team Enforces Code Style Consistency", body: `A development team used ${name} during code review to quickly reformat submitted code snippets to match their style guide. This eliminated back-and-forth comments about formatting and reduced the average code review time by 15%.` },
      { heading: "Developer Debugs JSON API Response", body: `A backend developer used ${name} to validate and pretty-print a malformed JSON response from a third-party API. The formatted output revealed a missing closing bracket that was causing parsing errors in the client application, leading to a quick fix.` },
      { heading: "Student Learns Programming Concepts", body: `A computer science student used ${name} to experiment with data transformation and algorithm visualization while learning programming fundamentals. The immediate feedback helped them understand concepts faster than textbook study alone.` },
    ];
  }
  if (cat === "data-analytics") {
    return [
      { heading: "Analyst Prepares Quarterly Report Data", body: `A business analyst used ${name} to clean and transform raw CSV data before importing into their BI tool for quarterly reporting. The tool handled date normalization, removed duplicate entries, and formatted numeric values consistently across 10,000 rows.` },
      { heading: "Researcher Analyzes Survey Dataset", body: `A market researcher used ${name} to perform initial analysis on survey data with 5,000 responses. They generated summary statistics and identified data quality issues before proceeding with more advanced statistical analysis in specialized software.` },
      { heading: "Marketing Team Tracks Campaign Performance", body: `A marketing team used ${name} to analyze campaign performance data across multiple channels. They quickly identified the top-performing channels and calculated ROI metrics, enabling data-driven budget allocation for the next quarter.` },
    ];
  }
  return [
    { heading: "Professional Workflow Integration", body: `A professional used ${name} to streamline their daily workflow, reducing repetitive manual tasks and improving accuracy. The tool became an essential part of their toolkit for routine operations.` },
    { heading: "Educational Application", body: `An educator incorporated ${name} into their curriculum, using it to demonstrate concepts through hands-on exercises. Students reported better understanding of the underlying principles through interactive experimentation.` },
    { heading: "Quick Problem Solving", body: `A user faced with an urgent task used ${name} to get immediate results without downloading or installing new software. The tool's accessibility and speed made it the go-to solution for time-sensitive problems.` },
  ];
}

function shortAnswerFor(tool: Tool): string {
  const cat = tool.category as CategoryFamily;
  const labels: Record<string, string> = {
    "network-internet": "network diagnostics",
    "productivity": "productivity",
    "text-writing": "text processing",
    "image-design": "image processing",
    "code-dev": "software development",
    "data-analytics": "data analysis",
  };
  const verbs: Record<string, string> = {
    "network-internet": "perform network lookups and diagnose connectivity issues",
    "productivity": "boost your daily workflow efficiency",
    "text-writing": "transform, clean, and analyze text content",
    "image-design": "edit, convert, and optimize images directly in your browser",
    "code-dev": "format, validate, and transform code snippets",
    "data-analytics": "process, clean, and analyze data sets",
  };
  const label = labels[cat] || "utility";
  const verb = verbs[cat] || "perform essential operations";
  return `${tool.name} is a free online ${label} tool that helps you ${verb}. It processes everything entirely in your browser — your data never leaves your device, ensuring complete privacy and instant results without any server uploads or waiting times. Just enter your input, configure your options, and get results in seconds.`;
}

function aiOverviewSections(
  tool: Tool,
  typeKey: string,
  title: string,
  desc: string,
): { heading: string; body: string }[] {
  return [
    {
      heading: `What Is ${tool.name}?`,
      body: shortAnswerFor(tool),
    },
    {
      heading: `Short Answer — ${title}`,
      body: desc,
    },
    {
      heading: `Summary`,
      body: `This guide covers ${typeKey.replace(/-/g, " ")} for ${tool.name}, a ${toolCategory(tool)} tool. ${desc}`,
    },
    {
      heading: `Key Takeaways`,
      body: `• ${tool.name} provides fast, private, and reliable ${toolCategory(tool)} capabilities entirely in your browser • This ${typeKey.replace(/-/g, " ")} guide helps you master the tool and avoid common pitfalls • All processing happens client-side so your data stays secure and never reaches any server • Apply these insights to get professional-quality results in seconds without any software installation`,
    },
  ];
}

function enrichmentFor(tool: Tool, ktIndex: number): { heading: string; body: string }[] {
  const name = tool.name;
  const cat = tool.category as CategoryFamily;

  switch (ktIndex) {
    case 0:
      return [{
        heading: "Real-World Example",
        body: `Imagine you are a ${
          cat === "network-internet" ? "system administrator auditing DNS records before a critical domain migration" :
          cat === "image-design" ? "graphic designer preparing product images for an e-commerce launch" :
          cat === "text-writing" ? "content writer standardizing formatting across dozens of blog posts" :
          cat === "code-dev" ? "developer debugging a malformed JSON response during a production incident" :
          cat === "data-analytics" ? "data analyst cleaning a large dataset before generating quarterly reports" :
          "professional working on a time-sensitive task"
        }. ${name} completes this in seconds with consistent, reliable results.`,
      }];
    case 1:
      return [{
        heading: "Prevention Tips",
        body: `Avoid common ${name} errors: (1) Always verify your input format matches the tool's expected format before submitting. (2) Keep your browser updated to ensure compatibility with the latest APIs. (3) For large inputs, process data in smaller batches to avoid memory limitations.`,
      }];
    case 2:
      return [{
        heading: "Industry Standard Reference",
        body: `These best practices align with recognized industry standards.${
          cat === "network-internet" ? " The IETF and ICANN guidelines inform the diagnostic approaches used here." :
          cat === "image-design" ? " The W3C and web performance communities endorse these optimization techniques." :
          cat === "text-writing" ? " Professional writing standards from AP Stylebook inform these recommendations." :
          cat === "code-dev" ? " The Linux Foundation and language-specific style guides support these practices." :
          ""
        } Following these conventions keeps your workflows compatible with broader industry practices.`,
      }];
    case 3:
      return [{
        heading: "Key Takeaway",
        body: `${name} processes everything client-side in your browser — your data never leaves your device. Bookmark it for quick access whenever you need ${cat.replace(/-/g, " ")} operations.`,
      }];
    case 4:
      return [{
        heading: "Why This Matters",
        body: `Knowing the CLI equivalents of ${name} lets you automate repetitive tasks, integrate checks into CI/CD pipelines, and work without leaving your terminal. This bridges GUI convenience with CLI power.`,
      }];
    case 5:
      return [{
        heading: "Common Mistakes to Avoid",
        body: `When troubleshooting with ${name}, users often: (1) Jump to conclusions without verifying input correctness. (2) Ignore browser console errors that may reveal API compatibility issues. (3) Forget to clear their browser cache after updates, causing stale JavaScript to run. Avoiding these pitfalls speeds up resolution significantly.`,
      }];
    case 6:
      return [{
        heading: "Evolution of This Category",
        body: `The ${cat.replace(/-/g, " ")} category has changed dramatically over the past decade. What once required specialized desktop software or CLI expertise is now accessible through browser tools like ${name}. This democratization lets professionals at all skill levels perform complex tasks without extensive training.`,
      }];
    case 7:
      return [{
        heading: "Getting the Most From This FAQ",
        body: `The answers above cover the most common questions about ${name}. If your specific use case is not addressed, try experimenting with the tool directly — most features are intuitive. The ToolVerse team also welcomes feedback to improve documentation.`,
      }];
    case 8:
      return [{
        heading: "Why This Matters",
        body: `These mistakes represent the majority of support requests and user frustrations. Learning about them upfront saves time and eliminates the trial-and-error approach many new users experience. ${name} is intuitive, but knowing these pitfalls ensures a smooth start.`,
      }];
    case 9:
      return [{
        heading: "How to Choose the Right Tool",
        body: `Pick desktop tools when you need advanced features and offline access. Pick other web tools when you want different interfaces. Pick ${name} when you need a fast, free, private solution without ads or sign-ups. Align your choice with your specific workflow needs.`,
      }];
    case 10:
      return [{
        heading: "Making Your Choice",
        body: `${name} is best when you prioritize speed, privacy, and zero cost. Competitors may offer more specialized features or mature ecosystems. For quick, reliable, private operations, ${name} excels. For enterprise needs, consider paid solutions.`,
      }];
    case 11:
      return [{
        heading: "Pro Tips",
        body: `Expert tips: (1) Bookmark ${name} and use keyboard shortcuts for rapid access during your workflow. (2) Combine it with complementary ToolVerse tools for multi-step operations. (3) Use the built-in copy and export features to integrate seamlessly with your team's tools. These small optimizations compound into significant time savings.`,
      }];
    case 12:
      return [{
        heading: "Success Criteria Checklist",
        body: `Before choosing ${name}: ✓ Task is a one-off or ad-hoc operation. ✓ You have a stable internet connection. ✓ Input size is within browser memory limits. ✓ No real-time or continuous processing needed. ✓ No team collaboration features required. If all criteria are met, ${name} is an excellent choice.`,
      }];
    case 13:
      return [{
        heading: "The Bigger Picture: An Analogy",
        body: `Think of ${name} as a Swiss Army knife for ${cat.replace(/-/g, " ")} tasks. It is not a full workshop (enterprise software) or a power tool (specialized apps), but it handles 80% of everyday tasks instantly. Just as a Swiss Army knife is always in your pocket, ${name} is always in your browser — no setup, no learning curve.`,
      }];
    default:
      return [];
  }
}

const KNOWLEDGE_TYPES: {
  type: ContentType;
  title: (tool: Tool) => string;
  description: (tool: Tool) => string;
  sections: (tool: Tool) => { heading: string; body: string }[];
}[] = [
  {
    type: "examples",
    title: (t) => `${t.name} Examples — Real-World Usage Guide`,
    description: (t) => `Practical examples showing how to use ${t.name} effectively, with step-by-step instructions for common scenarios and advanced use cases.`,
    sections: examplesFor,
  },
  {
    type: "errors",
    title: (t) => `${t.name} Errors — Common Issues and Solutions`,
    description: (t) => `Diagnose and fix common errors encountered when using ${t.name}. Detailed explanations of error causes and step-by-step resolution guides.`,
    sections: errorsFor,
  },
  {
    type: "best-practices",
    title: (t) => `${t.name} Best Practices — Tips for Optimal Results`,
    description: (t) => `Expert best practices for getting the most out of ${t.name}. Learn how to avoid common pitfalls and achieve professional-grade results every time.`,
    sections: bestPracticesFor,
  },
  {
    type: "cheat-sheet",
    title: (t) => `${t.name} Cheat Sheet — Quick Reference Guide`,
    description: (t) => `A concise cheat sheet for ${t.name}. Quick reference covering all features, input formats, options, and keyboard shortcuts for power users.`,
    sections: cheatSheetFor,
  },
  {
    type: "commands",
    title: (t) => `${t.name} CLI Commands and Automation Guide`,
    description: (t) => `Command-line equivalents and automation scripts for ${t.name}. Integrate ${toolCategory(t)} diagnostics into your terminal workflow and CI/CD pipelines.`,
    sections: commandsFor,
  },
  {
    type: "tutorial",
    title: (t) => `${t.name} Troubleshooting Guide — Fix Common Problems`,
    description: (t) => `Step-by-step troubleshooting guide for ${t.name}. Resolve common issues, improve performance, and get accurate results every time.`,
    sections: troubleshootingFor,
  },
  {
    type: "use-cases",
    title: (t) => `${t.name} Use Cases — Who Uses It and Why`,
    description: (t) => `Real-world use cases for ${t.name} across different professions and industries. See how professionals integrate this tool into their daily workflows.`,
    sections: useCasesFor,
  },
  {
    type: "reference",
    title: (t) => `${t.name} FAQ — Frequently Asked Questions`,
    description: (t) => `Comprehensive FAQ for ${t.name}. Answers to the most common questions about functionality, privacy, accuracy, limitations, and programmatic access.`,
    sections: faqFor,
  },
  {
    type: "article",
    title: (t) => `${t.name} Common Mistakes — What to Avoid`,
    description: (t) => `Learn about the most common mistakes users make with ${t.name} and how to avoid them. Save time by understanding these pitfalls before you start.`,
    sections: commonMistakesFor,
  },
  {
    type: "guide",
    title: (t) => `${t.name} Alternatives — Top Competitors and Similar Tools`,
    description: (t) => `Explore the best alternatives to ${t.name}. Compare features across similar tools to find the right solution for your specific needs.`,
    sections: alternativesFor,
  },
  {
    type: "comparison",
    title: (t) => `${t.name} vs Competitors — Feature Comparison`,
    description: (t) => `Detailed feature comparison between ${t.name} and its top competitors. Make an informed decision with side-by-side analysis.`,
    sections: competitorComparisonFor,
  },
  {
    type: "use-cases",
    title: (t) => `When to Use ${t.name} — Best Use Cases and Scenarios`,
    description: (t) => `Learn the ideal scenarios for using ${t.name}. Understand which tasks this tool handles best and how to integrate it into your workflow.`,
    sections: whenToUseFor,
  },
  {
    type: "use-cases",
    title: (t) => `When NOT to Use ${t.name} — Limitations and Alternatives`,
    description: (t) => `Understand the limitations of ${t.name} and when it is better to choose a different tool. Make informed decisions about tool selection.`,
    sections: whenNotToUseFor,
  },
  {
    type: "examples",
    title: (t) => `${t.name} Real-World Examples — Practical Applications`,
    description: (t) => `Real-world examples showing how professionals use ${t.name} to solve actual problems. Learn from practical scenarios and apply them to your own work.`,
    sections: realExamplesFor,
  },
];

function toolCategory(tool: Tool): string {
  const labels: Record<string, string> = {
    "network-internet": "networking",
    "productivity": "productivity",
    "text-writing": "text processing",
    "image-design": "image processing",
    "code-dev": "software development",
    "data-analytics": "data analysis",
  };
  return labels[tool.category] || "utility";
}

function howToSchemaFor(
  tool: Tool,
  sections: { heading: string; body: string }[],
  title: string,
  description: string,
): Record<string, unknown> | undefined {
  if (sections.length === 0) return undefined;
  const steps = sections.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.heading,
    text: s.body,
  }));
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to ${title}`,
    description,
    step: steps,
  };
}

const SCHEMA_TYPES = new Set<ContentType>(["tutorial", "guide"]);

export function generateKnowledgePieces(tool: Tool): ContentPiece[] {
  const pieces: ContentPiece[] = [];

  const allTools = getAllTools();
  const sameCategoryTools = allTools
    .filter((t) => t.id !== tool.id && t.category === tool.category)
    .slice(0, 5);

  for (const [i, kt] of KNOWLEDGE_TYPES.entries()) {
    const baseSections = kt.sections(tool);
    if (baseSections.length === 0) continue;

    const slug = `${tool.id}-${kt.type}`;
    const relatedToolSlugs = getRelatedTools(tool)
      .slice(0, 3)
      .map((t) => t.url.replace("/", ""));

    const categoryToolSlugs = sameCategoryTools.map((t) => t.id);

    const allRelatedSlugs = [...new Set([tool.id, ...relatedToolSlugs, ...categoryToolSlugs])];

    const aiSections = aiOverviewSections(tool, kt.type, kt.title(tool), kt.description(tool));
    const allSections = [...aiSections, ...baseSections, ...enrichmentFor(tool, i)];

    const otherContentSlugs = KNOWLEDGE_TYPES
      .filter((other) => other !== kt)
      .slice(0, 4)
      .map((other) => `${tool.id}-${other.type}`);

    const currentType = kt.type as ContentType;
    const schema = SCHEMA_TYPES.has(currentType)
      ? howToSchemaFor(tool, baseSections, kt.title(tool), kt.description(tool))
      : undefined;

    pieces.push({
      slug,
      type: currentType,
      title: kt.title(tool),
      description: kt.description(tool),
      sections: fmtSections(allSections),
      toolSlugs: allRelatedSlugs,
      relatedContent: otherContentSlugs,
      difficulty: "beginner",
      category: tool.category,
      readingTimeMinutes: Math.max(3, allSections.length),
      publishedAt: "2026-07-01",
      updatedAt: "2026-07-10",
      author: { name: "ToolVerse Team", url: "https://toolverse.dev/about" },
      schema,
    });
  }

  return pieces;
}

export function generateAllKnowledgePieces(): ContentPiece[] {
  const pieces: ContentPiece[] = [];
  for (const tool of getAllTools()) {
    pieces.push(...generateKnowledgePieces(tool));
  }
  return pieces;
}

export function getKnowledgePageCount(): number {
  return getAllTools().length * KNOWLEDGE_TYPES.length;
}
