import dynamicIconImports from "lucide-react/dynamicIconImports";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const iconCache = new Map<string, React.ComponentType<{ className?: string }> | null>();

function pascalToKebab(name: string): string {
  return name.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
}

function getIconComponent(name: string): React.ComponentType<{ className?: string }> | null {
  const cached = iconCache.get(name);
  if (cached !== undefined) return cached;

  const kebab = pascalToKebab(name);
  const importer = dynamicIconImports[kebab as keyof typeof dynamicIconImports];

  if (!importer) {
    iconCache.set(name, null);
    return null;
  }

  const DynamicIcon = dynamic(() => importer().then((m) => ({ default: m.default })));
  iconCache.set(name, DynamicIcon as React.ComponentType<{ className?: string }>);
  return DynamicIcon as React.ComponentType<{ className?: string }>;
}

function resolveName(name: string): string {
  const aliases: Record<string, string> = {
    Warning: "AlertTriangle",
    Success: "CheckCircle2",
    Error: "XCircle",
    Unknown: "HelpCircle",
    InfoIcon: "Info",
    MailPlus: "Send",
    MailCheck: "ShieldCheck",
    FileCheck: "ShieldCheck",
    FileX: "XCircle",
    FileWarning: "AlertTriangle",
    AlarmCheck: "Clock",
    AlarmPlus: "Clock",
    AlarmMinus: "Clock",
    Watch: "Clock",
    Hourglass: "Timer",
    Power: "Zap",
    PowerOff: "ZapOff",
    Pulse: "Activity",
    Gauge: "Activity",
    Wand: "Sparkles",
    Sparkle: "Sparkles",
    Paintbrush: "Brush",
    PaintBucket: "Droplets",
    Eraser: "Scissors",
    Stamp: "File",
    Type: "Text",
    CaseSensitive: "Text",
    TextIcon: "Text",
    SearchCheck: "CheckCircle2",
    SearchX: "XCircle",
    StopCircle: "XCircle",
    Eye: "Monitor",
    EyeOff: "Monitor",
    Laptop: "Monitor",
    Tablet: "Smartphone",
  };
  return aliases[name] || name;
}

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const resolvedName = resolveName(name);
  const IconComponent = getIconComponent(resolvedName);

  if (!IconComponent) {
    return <span className={cn("inline-flex items-center justify-center", className)} aria-hidden="true">{name}</span>;
  }

  return <IconComponent className={cn("shrink-0", className)} aria-hidden="true" />;
}
