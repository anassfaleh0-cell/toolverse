export interface Author {
  id: string;
  name: string;
  url: string;
  title: string;
  bio: string;
  avatarUrl?: string;
}

export const AUTHORS: Record<string, Author> = {
  team: {
    id: "team",
    name: "Nuvora Team",
    url: "/about",
    title: "Nuvora Editorial Team",
    bio: "The Nuvora team researches, builds, and maintains free online network diagnostic tools and educational content for developers, sysadmins, and IT professionals.",
  },
  alex: {
    id: "alex",
    name: "Alex Chen",
    url: "https://github.com/alexchen",
    title: "Senior Network Engineer & Technical Writer",
    bio: "Alex is a network engineer with over a decade of experience in DNS, BGP routing, and network security. He writes about protocol analysis and network diagnostics.",
  },
  sarah: {
    id: "sarah",
    name: "Sarah Mitchell",
    url: "https://github.com/sarahmitchell",
    title: "Security Researcher & Content Lead",
    bio: "Sarah specializes in web security, SSL/TLS protocols, and cryptographic standards. She oversees the technical accuracy of all security-related content.",
  },
  james: {
    id: "james",
    name: "James Wilson",
    url: "https://github.com/jameswilson",
    title: "Full-Stack Developer & Open-Source Maintainer",
    bio: "James builds web applications and developer tools with a focus on performance and accessibility. He maintains several popular open-source libraries.",
  },
  priya: {
    id: "priya",
    name: "Priya Patel",
    url: "https://github.com/priyapatel",
    title: "Content Strategist & SEO Specialist",
    bio: "Priya crafts content strategies that balance technical depth with readability. She ensures every guide and article meets both user needs and search best practices.",
  },
};
