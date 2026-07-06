"use client";

const RECENTLY_VIEWED_KEY = "tv_recently_viewed";
const BOOKMARKS_KEY = "tv_bookmarks";
const MAX_RECENT = 12;

export interface StoredTool {
  slug: string;
  name: string;
  url: string;
  viewedAt: string;
}

let _recentViewed: StoredTool[] = [];
let _recentDirty = true;

function _readRecent(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    _recentViewed = raw ? (JSON.parse(raw) as StoredTool[]) : [];
  } catch {
    _recentViewed = [];
  }
  _recentDirty = false;
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded */
  }
}

export function getRecentlyViewed(): StoredTool[] {
  if (typeof window === "undefined") return [];
  if (_recentDirty) _readRecent();
  return _recentViewed;
}

export function addRecentlyViewed(tool: Omit<StoredTool, "viewedAt">): void {
  const list = getRecentlyViewed().filter((t) => t.slug !== tool.slug);
  list.unshift({ ...tool, viewedAt: new Date().toISOString() });
  const trimmed = list.slice(0, MAX_RECENT);
  safeSet(RECENTLY_VIEWED_KEY, trimmed);
  _recentViewed = trimmed;
}

export function clearRecentlyViewed(): void {
  safeSet(RECENTLY_VIEWED_KEY, []);
  _recentViewed = [];
}

/* Called by window "storage" event listener to invalidate the cache
   when another tab changes localStorage. */
export function invalidateRecentlyViewed(): void {
  _recentDirty = true;
}

export function getBookmarks(): StoredTool[] {
  return safeGet<StoredTool[]>(BOOKMARKS_KEY, []);
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().some((t) => t.slug === slug);
}

export function toggleBookmark(tool: StoredTool): boolean {
  const list = getBookmarks();
  const idx = list.findIndex((t) => t.slug === tool.slug);
  if (idx >= 0) {
    list.splice(idx, 1);
    safeSet(BOOKMARKS_KEY, list);
    return false;
  }
  list.unshift(tool);
  safeSet(BOOKMARKS_KEY, list);
  return true;
}

export function removeBookmark(slug: string): void {
  const list = getBookmarks().filter((t) => t.slug !== slug);
  safeSet(BOOKMARKS_KEY, list);
}
