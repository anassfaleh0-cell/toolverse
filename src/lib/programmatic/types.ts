export interface ProgrammaticPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqItems: { question: string; answer: string }[];
  toolIds: string[];
  relatedSlugs: string[];
}
