interface DashboardCardProps {
  label: string;
  value: string | number;
  status?: "good" | "warning" | "critical" | "neutral";
  icon?: string;
  subtitle?: string;
}

const STATUS_STYLES: Record<string, { card: string; dot: string; text: string }> = {
  good: { card: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/30", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300" },
  warning: { card: "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-300" },
  critical: { card: "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30", dot: "bg-red-500", text: "text-red-700 dark:text-red-300" },
  neutral: { card: "border-zinc-200 dark:border-zinc-800", dot: "bg-zinc-400", text: "text-zinc-700 dark:text-zinc-300" },
};

export function DashboardCard({ label, value, status = "neutral", icon, subtitle }: DashboardCardProps) {
  const s = STATUS_STYLES[status];
  return (
    <div className={`rounded-xl border p-4 ${s.card} animate-fade-slide-up`}>
      <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
        <span className={`inline-block size-1.5 rounded-full ${s.dot}`} />
        {icon && <span aria-hidden="true">{icon}</span>}
        {label}
      </p>
      <p className={`mt-1.5 text-lg font-bold ${s.text}`}>{value}</p>
      {subtitle && <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
    </div>
  );
}

interface StatusBadgeProps {
  status: "good" | "warning" | "critical" | "neutral";
  label: string;
  pulse?: boolean;
}

const BADGE_STYLES: Record<string, string> = {
  good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export function StatusBadge({ status, label, pulse }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${BADGE_STYLES[status]} ${pulse ? "animate-status-pulse" : ""}`}>
      <span className={`inline-block size-1.5 rounded-full ${pulse ? "animate-pulse" : ""} ${status === "good" ? "bg-emerald-500" : status === "warning" ? "bg-amber-500" : status === "critical" ? "bg-red-500" : "bg-zinc-400"}`} />
      {label}
    </span>
  );
}

interface ScoreGaugeProps {
  score: number;
  max?: number;
  size?: number;
  label?: string;
}

export function ScoreGauge({ score, max = 100, size = 80, label }: ScoreGaugeProps) {
  const pct = Math.min(score / max, 1);
  const strokeWidth = 6;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color = pct >= 0.8 ? "#10b981" : pct >= 0.5 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="drop-shadow-sm" aria-label={label || `${Math.round(pct * 100)}%`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-zinc-600 dark:text-zinc-400" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} className="transition-all duration-700" />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" className="fill-zinc-900 text-[11px] font-bold dark:fill-zinc-50">
          {Math.round(pct * 100)}
        </text>
      </svg>
      {label && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{label}</p>}
    </div>
  );
}

interface MiniBarChartProps {
  values: number[];
  maxValue?: number;
  height?: number;
  barColor?: string;
  lossColor?: string;
  lossCount?: number;
  className?: string;
}

export function MiniBarChart({ values, maxValue, height = 48, barColor = "bg-emerald-500", lossColor = "bg-red-400", lossCount = 0, className = "" }: MiniBarChartProps) {
  const mx = maxValue ?? Math.max(...values, 1);
  return (
    <div className={`flex items-end gap-1 ${className}`} style={{ height }} aria-label={`${values.length} successful, ${lossCount} lost`}>
      {values.map((v, i) => (
        <div key={i} className="flex-1 transition-all duration-500 hover:opacity-80" style={{ height: `${(v / mx) * 100}%` }}>
          <div className={`h-full w-full rounded-t ${barColor} animate-bar-grow`} style={{ animationDelay: `${i * 80}ms` }} />
        </div>
      ))}
      {Array.from({ length: lossCount }).map((_, i) => (
        <div key={`loss-${i}`} className="flex-1" style={{ height: "20%" }}>
          <div className={`h-full w-full rounded-t ${lossColor} animate-bar-grow`} style={{ animationDelay: `${(values.length + i) * 80}ms` }} />
        </div>
      ))}
    </div>
  );
}

interface RiskLevelProps {
  level: "low" | "medium" | "high" | "critical";
  label?: string;
}

const RISK_CONFIG = {
  low: { color: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", bar: "w-[25%]" },
  medium: { color: "bg-amber-500", text: "text-amber-700 dark:text-amber-400", bar: "w-[50%]" },
  high: { color: "bg-orange-500", text: "text-orange-700 dark:text-orange-400", bar: "w-[75%]" },
  critical: { color: "bg-red-500", text: "text-red-700 dark:text-red-400", bar: "w-full" },
};

export function RiskMeter({ level, label }: RiskLevelProps) {
  const cfg = RISK_CONFIG[level];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-500 dark:text-zinc-400">Risk Level</span>
        <span className={`font-semibold ${cfg.text}`}>{label || level.charAt(0).toUpperCase() + level.slice(1)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div className={`h-full rounded-full transition-all duration-700 ${cfg.color} ${cfg.bar}`} />
      </div>
    </div>
  );
}

interface DashboardProps {
  title: string;
  status: "good" | "warning" | "critical";
  mainFinding: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskLabel?: string;
  timestamp?: string;
  nextAction?: string;
  children?: React.ReactNode;
}

export function DashboardSummary({ title, status, mainFinding, riskLevel, riskLabel, timestamp, nextAction, children }: DashboardProps) {
  const statusLabel = { good: "All Good", warning: "Needs Attention", critical: "Critical Issues" };
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusBadge status={status} label={statusLabel[status]} />
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
            <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{mainFinding}</p>
          </div>
        </div>
        {timestamp && (
          <p className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">Updated {new Date(timestamp).toLocaleString()}</p>
        )}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RiskMeter level={riskLevel} label={riskLabel} />
        {children}
      </div>
      {nextAction && (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-medium">Next:</span> {nextAction}
        </p>
      )}
    </div>
  );
}

const GRADE_CONFIG: Record<string, { label: string; color: string; ring: string }> = {
  "A+": { label: "A+", color: "text-emerald-700 dark:text-emerald-400", ring: "stroke-emerald-500" },
  "A": { label: "A", color: "text-emerald-700 dark:text-emerald-400", ring: "stroke-emerald-500" },
  "A-": { label: "A-", color: "text-emerald-700 dark:text-emerald-400", ring: "stroke-emerald-500" },
  "B+": { label: "B+", color: "text-emerald-700 dark:text-emerald-400", ring: "stroke-emerald-400" },
  "B": { label: "B", color: "text-amber-700 dark:text-amber-400", ring: "stroke-amber-500" },
  "B-": { label: "B-", color: "text-amber-700 dark:text-amber-400", ring: "stroke-amber-500" },
  "C+": { label: "C+", color: "text-amber-700 dark:text-amber-400", ring: "stroke-amber-500" },
  "C": { label: "C", color: "text-amber-700 dark:text-amber-400", ring: "stroke-amber-500" },
  "C-": { label: "C-", color: "text-orange-700 dark:text-orange-400", ring: "stroke-orange-500" },
  "D": { label: "D", color: "text-orange-700 dark:text-orange-400", ring: "stroke-orange-500" },
  "F": { label: "F", color: "text-red-700 dark:text-red-400", ring: "stroke-red-500" },
};

export function computeSecurityGrade(present: number, total: number): { grade: string; pct: number } {
  const pct = total > 0 ? present / total : 0;
  if (pct >= 0.95) return { grade: "A+", pct };
  if (pct >= 0.85) return { grade: "A", pct };
  if (pct >= 0.75) return { grade: "A-", pct };
  if (pct >= 0.65) return { grade: "B+", pct };
  if (pct >= 0.55) return { grade: "B", pct };
  if (pct >= 0.45) return { grade: "B-", pct };
  if (pct >= 0.35) return { grade: "C+", pct };
  if (pct >= 0.25) return { grade: "C", pct };
  if (pct >= 0.15) return { grade: "C-", pct };
  if (pct >= 0.05) return { grade: "D", pct };
  return { grade: "F", pct };
}

export function GradeBadge({ grade, size = 64 }: { grade: string; size?: number }) {
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG["F"];
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const score = grade === "A+" ? 1 : grade === "A" ? 0.92 : grade === "A-" ? 0.82 : grade === "B+" ? 0.72 : grade === "B" ? 0.62 : grade === "B-" ? 0.52 : grade === "C+" ? 0.42 : grade === "C" ? 0.32 : grade === "C-" ? 0.22 : grade === "D" ? 0.12 : 0.02;
  const offset = circ * (1 - score);
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} aria-label={`Grade ${grade}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={6} className="text-zinc-600 dark:text-zinc-400" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={6} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} className={`transition-all duration-700 ${cfg.ring}`} />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" className={`fill-current text-lg font-extrabold ${cfg.color}`}>{grade}</text>
      </svg>
    </div>
  );
}

interface CompositeScoreProps {
  overall: number;
  subScores: { label: string; score: number; max?: number }[];
  size?: number;
}

export function CompositeScore({ overall, subScores, size = 72 }: CompositeScoreProps) {
  const pct = Math.min(overall / 100, 1);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color = pct >= 0.8 ? "#10b981" : pct >= 0.5 ? "#f59e0b" : "#ef4444";
  const subColors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-purple-500", "bg-rose-500"];
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-col items-center">
        <svg width={size} height={size} aria-label={`Overall score ${overall}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={6} className="text-zinc-600 dark:text-zinc-400" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} className="transition-all duration-700" />
          <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" className="fill-zinc-900 text-base font-bold dark:fill-zinc-50">{overall}</text>
        </svg>
        <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">Overall</p>
      </div>
      <div className="flex-1 space-y-1.5">
        {subScores.map((s, i) => {
          const spct = Math.min(s.score / (s.max ?? 100), 1);
          return (
            <div key={s.label} className="flex items-center gap-2 text-xs">
              <span className="w-20 shrink-0 text-zinc-500 dark:text-zinc-400">{s.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div className={`h-full rounded-full transition-all duration-500 ${subColors[i % subColors.length]}`} style={{ width: `${spct * 100}%` }} />
              </div>
              <span className="w-8 text-right font-mono text-zinc-600 dark:text-zinc-400">{s.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TimelineEvent {
  date: string;
  label: string;
  type: "past" | "present" | "future" | "warning";
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const dotColors = { past: "bg-zinc-400", present: "bg-emerald-500", future: "bg-zinc-300 dark:bg-zinc-600", warning: "bg-red-500" };
  return (
    <div className="space-y-0">
      {events.map((e, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`size-2.5 rounded-full ${dotColors[e.type]} ${e.type === "present" ? "animate-pulse" : ""}`} />
            {i < events.length - 1 && <div className="mt-0.5 w-px flex-1 bg-zinc-200 dark:bg-zinc-700" />}
          </div>
          <div className={`pb-4 ${i === events.length - 1 ? "pb-0" : ""}`}>
            <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50">{e.label}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{e.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExpiryBar({ daysRemaining, totalDays = 365 }: { daysRemaining: number; totalDays?: number }) {
  const pct = Math.max(0, Math.min(daysRemaining / totalDays, 1));
  const color = pct > 0.3 ? "bg-emerald-500" : pct > 0.1 ? "bg-amber-500" : "bg-red-500";
  const textColor = pct > 0.3 ? "text-emerald-700 dark:text-emerald-300" : pct > 0.1 ? "text-amber-700 dark:text-amber-300" : "text-red-700 dark:text-red-300";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-500 dark:text-zinc-400">Expiry</span>
        <span className={`font-semibold ${textColor}`}>{daysRemaining > 0 ? `${daysRemaining}d remaining` : "Expired"}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct * 100}%` }} />
      </div>
    </div>
  );
}
