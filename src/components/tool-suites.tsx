import Link from "next/link";
import { getAllTools } from "@/lib/registry";

interface Suite {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  toolIds: string[];
}

const SUITES: Suite[] = [
  {
    id: "website-intelligence",
    name: "Website Intelligence",
    description: "Analyze any website's health, security, and configuration in seconds.",
    icon: "globe",
    color: "blue",
    toolIds: ["website-status-checker", "http-headers-checker", "ssl-certificate-checker", "user-agent-parser"],
  },
  {
    id: "network-suite",
    name: "Network Suite",
    description: "Complete DNS, WHOIS, and connectivity diagnostics at your fingertips.",
    icon: "network",
    color: "indigo",
    toolIds: ["dns-lookup", "whois-lookup", "ping-test", "port-checker", "reverse-dns-lookup", "dns-propagation-checker"],
  },
  {
    id: "developer-studio",
    name: "Developer Studio",
    description: "Format, encode, decode, and inspect data with precision tools.",
    icon: "code",
    color: "violet",
    toolIds: ["json-formatter", "base64-encoder", "url-encoder", "html-entity-encoder", "jwt-decoder", "uuid-generator", "regex-tester"],
  },
  {
    id: "security-center",
    name: "Security Center",
    description: "Protect your online presence with privacy and security analysis tools.",
    icon: "shield",
    color: "emerald",
    toolIds: ["what-is-my-ip", "ip-lookup", "ssl-certificate-checker", "http-headers-checker"],
  },
  {
    id: "code-utilities",
    name: "Code Utilities",
    description: "Hash, minify, convert, and transform your code with ease.",
    icon: "tool",
    color: "amber",
    toolIds: ["md5-hash-generator", "sha-hash-generator", "html-minifier", "css-minifier", "js-minifier", "case-converter", "number-base-converter", "color-converter"],
  },
];

const COLOR_MAPS: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  blue: {
    border: "border-blue-200 dark:border-blue-900",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  indigo: {
    border: "border-indigo-200 dark:border-indigo-900",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    text: "text-indigo-700 dark:text-indigo-300",
    dot: "bg-indigo-500",
  },
  violet: {
    border: "border-violet-200 dark:border-violet-900",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    text: "text-violet-700 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-900",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  amber: {
    border: "border-amber-200 dark:border-amber-900",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
};

function SuiteIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    globe: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    network: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    code: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    shield: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    tool: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  };
  return icons[icon] || null;
}

export function ToolSuites() {
  const allTools = getAllTools();

  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Everything you need, organized
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Tools grouped by workflow, so you never waste time finding what you need
          </p>
        </div>
        <div className="mt-12 space-y-10">
          {SUITES.map((suite) => {
            const colors = COLOR_MAPS[suite.color];
            const tools = suite.toolIds
              .map((id) => allTools.find((t) => t.id === id))
              .filter(Boolean);
            if (tools.length === 0) return null;

            return (
              <div key={suite.id}>
                <div className={`inline-flex items-center gap-3 rounded-xl border ${colors.border} ${colors.bg} px-5 py-3`}>
                  <span className={`flex size-10 items-center justify-center rounded-lg ${colors.text} ${colors.bg} ${colors.border} border`}>
                    <SuiteIcon icon={suite.icon} />
                  </span>
                  <div>
                    <h3 className={`font-semibold ${colors.text}`}>{suite.name}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{suite.description}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {tools.map((tool) => (
                    <Link
                      key={tool!.id}
                      href={tool!.url}
                      className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}>
                          <span className={`size-2 rounded-full ${colors.dot}`} />
                        </span>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                            {tool!.name}
                          </h4>
                          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {tool!.description.split(".")[0]}.
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
