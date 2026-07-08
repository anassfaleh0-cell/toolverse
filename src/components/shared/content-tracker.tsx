"use client";

import { useEffect } from "react";
import type { ContentType } from "@/lib/content/types";

interface ContentTrackerProps {
  slug: string;
  title: string;
  url: string;
  type: ContentType;
  typeLabel: string;
  readingTimeMinutes: number;
}

export function ContentTracker({ slug, title, url, type, typeLabel, readingTimeMinutes }: ContentTrackerProps) {
  useEffect(() => {
    import("@/lib/user-storage").then((m) => {
      m.addContinueReading({ slug, title, url, type, typeLabel, readingTimeMinutes });
    });
  }, [slug, title, url, type, typeLabel, readingTimeMinutes]);

  return null;
}
