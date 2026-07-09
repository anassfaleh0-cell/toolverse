"use client";

const RECENTLY_VIEWED_KEY = "tv_recently_viewed";
const BOOKMARKS_KEY = "tv_bookmarks";
const PINNED_KEY = "tv_pinned";
const COLLECTIONS_KEY = "tv_collections";
const WORKSPACE_KEY = "tv_workspace";
const SEARCH_HISTORY_KEY = "tv_search_history";
const MAX_RECENT = 12;
const MAX_SEARCH_HISTORY = 20;

export interface StoredTool {
  slug: string;
  name: string;
  url: string;
  viewedAt: string;
}

export interface WorkspaceEntry {
  toolSlug: string;
  toolName: string;
  data: unknown;
  label: string;
  savedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  toolSlugs: string[];
  createdAt: string;
  updatedAt: string;
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

/* Pinned tools */
export function getPinned(): string[] {
  return safeGet<string[]>(PINNED_KEY, []);
}

export function isPinned(slug: string): boolean {
  return getPinned().includes(slug);
}

export function togglePinned(slug: string): boolean {
  const list = getPinned();
  const idx = list.indexOf(slug);
  if (idx >= 0) {
    list.splice(idx, 1);
    safeSet(PINNED_KEY, list);
    return false;
  }
  list.push(slug);
  safeSet(PINNED_KEY, list);
  return true;
}

/* Collections */
export function getCollections(): Collection[] {
  return safeGet<Collection[]>(COLLECTIONS_KEY, []);
}

export function createCollection(name: string, description = ""): Collection {
  const collections = getCollections();
  const collection: Collection = {
    id: crypto.randomUUID(),
    name,
    description,
    toolSlugs: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  collections.push(collection);
  safeSet(COLLECTIONS_KEY, collections);
  return collection;
}

export function addToolToCollection(collectionId: string, slug: string): void {
  const collections = getCollections();
  const col = collections.find((c) => c.id === collectionId);
  if (col && !col.toolSlugs.includes(slug)) {
    col.toolSlugs.push(slug);
    col.updatedAt = new Date().toISOString();
    safeSet(COLLECTIONS_KEY, collections);
  }
}

export function removeToolFromCollection(collectionId: string, slug: string): void {
  const collections = getCollections();
  const col = collections.find((c) => c.id === collectionId);
  if (col) {
    col.toolSlugs = col.toolSlugs.filter((s) => s !== slug);
    col.updatedAt = new Date().toISOString();
    safeSet(COLLECTIONS_KEY, collections);
  }
}

export function deleteCollection(id: string): void {
  const collections = getCollections().filter((c) => c.id !== id);
  safeSet(COLLECTIONS_KEY, collections);
}

export function renameCollection(id: string, name: string): void {
  const collections = getCollections();
  const col = collections.find((c) => c.id === id);
  if (col) {
    col.name = name;
    col.updatedAt = new Date().toISOString();
    safeSet(COLLECTIONS_KEY, collections);
  }
}

/* Workspace — saved results from any tool */
export function getWorkspaceEntries(): WorkspaceEntry[] {
  return safeGet<WorkspaceEntry[]>(WORKSPACE_KEY, []);
}

export function addWorkspaceEntry(entry: Omit<WorkspaceEntry, "savedAt">): void {
  const list = getWorkspaceEntries();
  list.unshift({ ...entry, savedAt: new Date().toISOString() });
  safeSet(WORKSPACE_KEY, list.slice(0, 50));
}

export function clearWorkspace(): void {
  safeSet(WORKSPACE_KEY, []);
}

export function removeWorkspaceEntry(toolSlug: string, savedAt: string): void {
  const list = getWorkspaceEntries().filter(
    (e) => !(e.toolSlug === toolSlug && e.savedAt === savedAt),
  );
  safeSet(WORKSPACE_KEY, list);
}

/* Search history */
export function getSearchHistory(): string[] {
  return safeGet<string[]>(SEARCH_HISTORY_KEY, []);
}

export function addSearchQuery(query: string): void {
  const list = getSearchHistory().filter((q) => q !== query);
  list.unshift(query);
  safeSet(SEARCH_HISTORY_KEY, list.slice(0, MAX_SEARCH_HISTORY));
}

export function clearSearchHistory(): void {
  safeSet(SEARCH_HISTORY_KEY, []);
}

/* Continue Reading */
const CONTINUE_READING_KEY = "tv_continue_reading";
const MAX_CONTINUE = 9;

interface ContinueReadingItem {
  slug: string;
  title: string;
  url: string;
  type: string;
  typeLabel: string;
  readingTimeMinutes: number;
  viewedAt: string;
}

let _continueReading: ContinueReadingItem[] = [];
let _continueDirty = true;

function _readContinue(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CONTINUE_READING_KEY);
    _continueReading = raw ? (JSON.parse(raw) as ContinueReadingItem[]) : [];
  } catch {
    _continueReading = [];
  }
  _continueDirty = false;
}

export function addContinueReading(item: Omit<ContinueReadingItem, "viewedAt">): void {
  const list = safeGet<ContinueReadingItem[]>(CONTINUE_READING_KEY, []).filter(
    (i) => i.slug !== item.slug,
  );
  list.unshift({ ...item, viewedAt: new Date().toISOString() });
  safeSet(CONTINUE_READING_KEY, list.slice(0, MAX_CONTINUE));
  _continueReading = list;
}

export function getContinueReading(): ContinueReadingItem[] {
  if (typeof window === "undefined") return [];
  if (_continueDirty) _readContinue();
  return _continueReading;
}

export function invalidateContinueReading(): void {
  _continueDirty = true;
}

export function clearContinueReading(): void {
  safeSet(CONTINUE_READING_KEY, []);
  _continueReading = [];
}

/* Result History */
const HISTORY_PREFIX = "tv_history_";
const MAX_HISTORY = 20;

export function saveResult(toolSlug: string, data: unknown): void {
  const key = HISTORY_PREFIX + toolSlug;
  const list = safeGet<{ ts: string; data: unknown }[]>(key, []);
  list.unshift({ ts: new Date().toISOString(), data });
  safeSet(key, list.slice(0, MAX_HISTORY));
}

export function getResultHistory(toolSlug: string): { ts: string; data: unknown }[] {
  return safeGet<{ ts: string; data: unknown }[]>(HISTORY_PREFIX + toolSlug, []);
}

export function clearResultHistory(toolSlug: string): void {
  safeSet(HISTORY_PREFIX + toolSlug, []);
}

export function deleteResultEntry(toolSlug: string, timestamp: string): void {
  const key = HISTORY_PREFIX + toolSlug;
  const list = safeGet<{ ts: string; data: unknown }[]>(key, []);
  safeSet(key, list.filter((e) => e.ts !== timestamp));
}
