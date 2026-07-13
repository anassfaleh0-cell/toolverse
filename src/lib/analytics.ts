export interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

const ANALYTICS_KEY = "tv_analytics_consent";
const BOOKMARKS_KEY = "tv_bookmarks";
const HISTORY_KEY = "tv_history";

export function getAnalyticsConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(ANALYTICS_KEY);
  if (val === "true") return true;
  if (val === "false") return false;
  return null;
}

export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANALYTICS_KEY, String(granted));
  window.dispatchEvent(new CustomEvent("tv:analytics-consent-granted"));
}

export function revokeConsent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ANALYTICS_KEY);
  window.dispatchEvent(new CustomEvent("tv:analytics-consent-revoked"));
}

function pushEvent(event: AnalyticsEvent): void {
  if (typeof window.gtag === "function") {
    window.gtag("event", event.name, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.metadata,
    });
  }
}

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  if (getAnalyticsConsent() !== true) return;
  try { pushEvent(event); } catch { /* analytics error */ }
}

export function trackPageView(pageView: PageView): void {
  if (typeof window === "undefined") return;
  if (getAnalyticsConsent() !== true) return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("config", "", {
        page_path: pageView.path,
        page_title: pageView.title,
        page_referrer: pageView.referrer,
      });
    }
  } catch { /* analytics error */ }
}

export function trackToolOpen(toolSlug: string): void {
  trackEvent({ name: "tool_open", category: "Tool", label: toolSlug });
}

export function trackToolRun(toolSlug: string): void {
  trackEvent({ name: "tool_run", category: "Tool", label: toolSlug });
}

export function trackToolComplete(toolSlug: string, msElapsed?: number): void {
  trackEvent({ name: "tool_complete", category: "Tool", label: toolSlug, value: msElapsed });
}

export function trackSearch(query: string, resultCount: number): void {
  trackEvent({ name: "search", category: "Search", label: query, value: resultCount });
}

export function trackExport(format: string, toolSlug: string): void {
  trackEvent({ name: "export", category: "Export", label: format, metadata: { tool: toolSlug } });
}

export function trackShare(platform: string, toolSlug: string): void {
  trackEvent({ name: "share", category: "Share", label: platform, metadata: { tool: toolSlug } });
}

export function trackBookmark(toolSlug: string, action: "add" | "remove"): void {
  trackEvent({ name: "bookmark", category: "Bookmark", label: toolSlug, metadata: { action } });
}

export function trackWorkflow(workflowName: string, steps?: number): void {
  trackEvent({ name: "workflow_complete", category: "Workflow", label: workflowName, value: steps });
}

export function trackConversion(type: string, value?: number): void {
  trackEvent({ name: "conversion", category: "Conversion", label: type, value });
}

export function reportWebVitals(id: string, name: string, value: number, rating: string): void {
  trackEvent({
    name: "web_vital",
    category: "Web Vitals",
    label: name,
    value: Math.round(name === "CLS" ? value * 1000 : value),
    metadata: { metric_id: id, rating },
  });
}

export function clearAnalyticsData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ANALYTICS_KEY);
  localStorage.removeItem(BOOKMARKS_KEY);
  localStorage.removeItem(HISTORY_KEY);
}

export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]"); } catch { return []; }
}

export function clearBookmarks(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BOOKMARKS_KEY);
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}