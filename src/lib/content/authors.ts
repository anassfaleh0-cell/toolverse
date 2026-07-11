export interface Author {
  id: string;
  name: string;
  url?: string;
  title: string;
  bio: string;
  avatarUrl?: string;
}

/*
 * ──── PLACEHOLDER ────
 * The 4 previous author entries (Alex Chen, Sarah Mitchell, James Wilson,
 * Priya Patel) were fabricated AI-generated personas. They have been
 * removed entirely.
 *
 * Replace this single entry with your REAL name, bio, and URL.
 * Do NOT invent credentials.  Provide only what's true.
 *
 * Required from you:
 *   - name  (your real name)
 *   - slug  (URL-safe version of your name, e.g. "john-doe")
 *   - bio   (1-3 sentences about your relevant experience)
 *   - url   (optional – your personal site, LinkedIn, or GitHub)
 *   - photo (optional – avatarUrl, omitted until you provide one)
 */
export const AUTHORS: Record<string, Author> = {
  founder: {
    id: "founder",
    name: "[REAL NAME — I will provide]",
    title: "Founder & Developer, Nuvora",
    bio: "[I will provide a short real bio]",
    /* url: null, */          // ← fill in your real link when ready
    /* avatarUrl: null, */    // ← fill in your photo when ready
  },
};
