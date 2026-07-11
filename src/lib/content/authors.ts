export interface Author {
  id: string;
  name: string;
  url?: string;
  title: string;
  bio: string;
  avatarUrl?: string;
}

export const AUTHORS: Record<string, Author> = {
  founder: {
    id: "founder",
    name: "Anass Faleh",
    title: "Founder & Developer",
    bio: "Software engineer with 10+ years of experience building web applications, developer tools, and network diagnostics. I created Nuvora to help webmasters and developers solve problems quickly with free, privacy-respecting online tools — no signup, no tracking, just results.",
    avatarUrl: "/authors/anass-faleh.jpg",
  },
};
