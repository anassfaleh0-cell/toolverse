/**
 * Analytics architecture for ToolVerse.
 *
 * Slot-based design: actual analytics providers (GA4, Clarity, etc.) are
 * injected via environment variables and rendered by the Analytics component.
 * This file provides the event tracking interface used across the application.
 */

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

export type AnalyticsProvider = "ga4" | "clarity" | "custom";

export interface AnalyticsConfig {
  ga4MeasurementId?: string;
  clarityProjectId?: string;
  enabled: boolean;
  cookieConsentRequired: boolean;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

const ANALYTICS_KEY = "tv_analytics_consent";

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
  if (granted) {
    window.dispatchEvent(new CustomEvent("tv:analytics-consent-granted"));
  }
}

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  if (getAnalyticsConsent() !== true) return;

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event.name, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }
  } catch {
    /* analytics error */
  }
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
  } catch {
    /* analytics error */
  }
}

export function trackToolUsage(toolSlug: string, toolName: string): void {
  trackEvent({
    name: "tool_usage",
    category: "Tool",
    label: toolSlug,
    metadata: { tool_name: toolName },
  });
}

export function trackSearch(query: string, resultCount: number): void {
  trackEvent({
    name: "search",
    category: "Search",
    label: query,
    value: resultCount,
  });
}

export function trackConversion(type: string, value?: number): void {
  trackEvent({
    name: "conversion",
    category: "Conversion",
    label: type,
    value,
  });
}
