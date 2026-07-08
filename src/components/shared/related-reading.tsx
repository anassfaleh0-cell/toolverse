const RELATED_READING: Record<string, { href: string; label: string; desc: string }[]> = {
  "network-internet": [
    { href: "/ultimate-guides/dns", label: "The Ultimate DNS Guide", desc: "Everything about the Domain Name System" },
    { href: "/ultimate-guides/networking", label: "Ultimate Networking Guide", desc: "TCP/IP, ports, and diagnostics" },
    { href: "/ultimate-guides/ssl-tls", label: "Ultimate SSL/TLS Guide", desc: "Certificates, handshakes, and security" },
    { href: "/glossary", label: "Technical Glossary", desc: "60+ network and security terms explained" },
    { href: "/learning-paths/dns-fundamentals", label: "DNS Learning Path", desc: "From beginner to advanced DNS" },
    { href: "/benchmarks/dns-performance", label: "DNS Benchmarks", desc: "DNS provider speed comparison" },
    { href: "/authors/alex-chen", label: "By Alex Chen", desc: "Senior Network Engineer" },
    { href: "/case-studies", label: "Case Studies", desc: "Real-world ToolVerse success stories" },
  ],
  "code-dev": [
    { href: "/ultimate-guides/json", label: "The Ultimate JSON Guide", desc: "Syntax, validation, and data exchange" },
    { href: "/ultimate-guides/http", label: "The Ultimate HTTP Guide", desc: "Status codes, headers, and protocols" },
    { href: "/glossary", label: "Technical Glossary", desc: "Developer terms explained" },
    { href: "/authors/james-wilson", label: "By James Wilson", desc: "Full-Stack Developer" },
  ],
  "image-design": [
    { href: "/ultimate-guides/http", label: "The Ultimate HTTP Guide", desc: "Status codes, headers, and protocols" },
    { href: "/glossary", label: "Technical Glossary", desc: "Technical terms explained" },
  ],
  "text-writing": [
    { href: "/ultimate-guides/http", label: "The Ultimate HTTP Guide", desc: "Status codes, headers, and protocols" },
    { href: "/glossary", label: "Technical Glossary", desc: "Technical terms explained" },
  ],
  "productivity": [
    { href: "/glossary", label: "Technical Glossary", desc: "Technical terms explained" },
    { href: "/methodology", label: "How We Test Tools", desc: "Our testing methodology" },
    { href: "/authors/priya-patel", label: "By Priya Patel", desc: "Content Strategist" },
  ],
  "data-analytics": [
    { href: "/ultimate-guides/json", label: "The Ultimate JSON Guide", desc: "Syntax, validation, and data exchange" },
    { href: "/glossary", label: "Technical Glossary", desc: "Technical terms explained" },
  ],
};

interface RelatedReadingProps {
  category: string;
}

export function RelatedReading({ category }: RelatedReadingProps) {
  const links = RELATED_READING[category] ?? RELATED_READING["network-internet"];
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">Related Reading</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group rounded-lg border border-zinc-200 p-3 transition-colors hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700"
          >
            <span className="text-sm font-semibold text-blue-600 group-hover:underline dark:text-blue-400">{link.label}</span>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{link.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
