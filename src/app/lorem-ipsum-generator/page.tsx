import type { Metadata } from "next";
import { LoremIpsumGenerator } from "@/components/lorem-ipsum-generator/lorem-ipsum-generator";
import {
  ToolLayout,
  ToolHero,
  FaqSection,
  RelatedTools,
  RelatedContent,
  JsonLd,
} from "@/components/shared";
import {
  faqSchema,
  webPageSchema,
  breadcrumbSchema,
  softwareAppSchema,
  type FaqItem,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";

const slug = "lorem-ipsum-generator";
const pageTitle = "Lorem Ipsum Generator - Generate Dummy Text for Designs and Layouts";
const pageDescription =
  "Generate lorem ipsum placeholder text for your designs, mockups, wireframes, and layouts. Free online generator with customizable paragraph count for your design projects.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Text & Writing", href: `${SITE_URL}/category/text-writing` },
  { label: "Lorem Ipsum Generator" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is lorem ipsum and why is it used in design?",
    answer:
      "Lorem ipsum is dummy text derived from a scrambled passage of De finibus bonorum et malorum, a treatise on ethics by Cicero written in 45 BC. Typesetters and designers have used it since the 1500s as placeholder text because it has a natural-looking distribution of letters and words without being readable content. The slightly irregular Latin-like text allows viewers to focus on typography, layout, and visual design elements rather than being distracted by meaningful content. It has become the universal standard dummy text across graphic design, publishing, and web development industries.",
  },
  {
    question: "How does the lorem ipsum paragraph generation work?",
    answer:
      "Each paragraph is constructed by randomly selecting words from a curated dictionary of standard lorem ipsum words. Sentences are built with 8-20 words each, and paragraphs contain 3-6 sentences, resulting in approximately 50-100 words per paragraph. Each sentence starts with a capitalized word and ends with a period. The generation algorithm ensures each paragraph has natural variation in length while maintaining the distinctive Latin-like vocabulary that designers expect from placeholder text.",
  },
  {
    question: "What is the standard amount of lorem ipsum text for a design mockup?",
    answer:
      "For most web and print designs, 3-5 paragraphs of lorem ipsum provide sufficient text to evaluate layout, spacing, and typography. A single paragraph (~50-100 words) works for card components, sidebars, and small UI elements. For full-page layouts, article templates, or detailed mockups, 5-10 paragraphs allow you to assess how the design handles longer content, scrolling behavior, and the visual balance of text-heavy pages. The generator defaults to 5 paragraphs, which is appropriate for most wireframing and prototyping needs.",
  },
  {
    question: "Is lorem ipsum still relevant in modern web design?",
    answer:
      "Lorem ipsum remains widely used in wireframing, prototyping, and template development because it provides text that looks like natural language without conveying any actual meaning. This is valuable when demonstrating layout concepts to clients who should focus on structure rather than content. However, many modern designers also use realistic placeholder content (sometimes called 'real copy') during later design stages to better simulate the final product. Lorem ipsum is most appropriate during early ideation and structural design phases when the actual content is not yet available.",
  },
  {
    question: "Can I use lorem ipsum in commercial projects?",
    answer:
      "Yes, lorem ipsum text is public domain and can be freely used in any commercial or personal project without attribution or licensing restrictions. The original Cicero text is ancient enough to be in the public domain, and the scrambled lorem ipsum variants are considered common knowledge not subject to copyright. This makes it safe for use in client deliverables, published designs, software interfaces, and any other commercial application where placeholder text is needed.",
  },
  {
    question: "What are alternatives to standard lorem ipsum text?",
    answer:
      "Several alternatives exist for specialized use cases: 'Corporate ipsum' uses business jargon for enterprise software mockups, 'Hipster ipsum' includes modern tech and lifestyle terminology for startup designs, 'Cupcake ipsum' uses dessert-themed words for food and lifestyle projects, and 'Zombie ipsum' uses horror-themed vocabulary. For international projects, localized versions of lorem ipsum are available in many languages. Some designers prefer using the actual content from the project brief or industry-specific sample text to create more realistic mockups.",
  },
  {
    question: "How should lorem ipsum be styled in design mockups?",
    answer:
      "Lorem ipsum in design mockups should use the actual font family, size, line height, and color intended for the final product to accurately assess readability and visual hierarchy. Use the generated paragraphs to test different heading-to-body ratios, measure line lengths (aim for 45-75 characters per line for optimal readability), and evaluate the overall text color on the page. The placeholder text should be styled exactly as real content would be, allowing stakeholders to evaluate the typographic system rather than being distracted by the meaninglessness of the text.",
  },
  {
    question: "What is the history of lorem ipsum in typesetting?",
    answer:
      "Lorem ipsum originated in the 1500s when an unknown printer scrambled a passage from Cicero's De finibus bonorum et malorum to create a type specimen book. The text became standard in the printing industry and was popularized in the 1960s by Letraset transfer sheets. It achieved digital ubiquity when Aldus Corporation included it in PageMaker templates in the 1980s. The passage 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' is derived from 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...' meaning 'There is no one who loves pain itself, who seeks after it and wants to have it...'.",
  },
  {
    question: "Can I generate non-Latin placeholder text?",
    answer:
      "This generator produces standard Latin-based lorem ipsum text. For non-Latin placeholder text, specialized generators exist for Cyrillic, CJK (Chinese, Japanese, Korean), Arabic, Hebrew, and other scripts. Each script has different typographic characteristics (line height, character width, word spacing) that affect layout differently than Latin text. When designing multi-language interfaces, using placeholder text in each target script is essential to ensure the layout accommodates varying text lengths and typographic conventions across languages.",
  },
  {
    question: "Should I replace lorem ipsum with real content before launch?",
    answer:
      "Absolutely. Lorem ipsum must be replaced with real content before any design goes into production, client review finalization, or user testing. Real content often differs from placeholder text in length, structure, and formatting, which can significantly impact layout. A heading that fits perfectly with lorem ipsum may overflow with a real product name, and navigation labels that work as placeholder text may be too long in actual deployment. Always validate your design with real content during the final review stage to avoid layout breaks and accessibility issues in production.",
  },
];

export default function LoremIpsumGeneratorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Lorem Ipsum Generator"
            description="Generate placeholder lorem ipsum text for your design mockups, wireframes, prototypes, and layout tests. Perfect for designers, developers, and content strategists."
            breadcrumbs={breadcrumbs}
          >
            <LoremIpsumGenerator />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            The Role of Placeholder Text in Modern Design Workflows
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Placeholder text serves a critical function in the design process by allowing designers and stakeholders to evaluate visual hierarchy, typography, spacing, and layout without being distracted by content meaning. During wireframing and prototyping phases, the specific words are irrelevant — what matters is how text blocks relate to each other visually, how headings balance with body copy, and how the overall composition guides the viewer&apos;s eye. Lorem ipsum provides the raw material for these evaluations without the cognitive load of reading meaningful content.
            </p>
            <p>
              The key principle is that placeholder text should look like real text without being real text. A good lorem ipsum generator produces output with realistic word length distribution, sentence length variation, and paragraph structure. This is why the classic lorem ipsum vocabulary, despite being derived from a single Latin passage, remains effective: it has the right visual rhythm and density to simulate real content. When you need to analyze the structure of your actual text content, the <Link href="/word-counter" className="text-blue-600 hover:underline dark:text-blue-400">Word Counter</Link> can help you understand your document&apos;s composition beyond what placeholder text reveals.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Best Practices for Using Lorem Ipsum in Client Projects
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              When presenting mockups to clients, explicitly label lorem ipsum text as placeholder content to avoid confusion. Some clients may not recognize lorem ipsum and might approve content thinking it is final copy. Use annotations, callouts, or a different background color for placeholder sections during review. Establish clear milestones when placeholder text will be replaced with real copy, and ensure content writers deliver the final text before development handoff. This prevents last-minute layout changes during the build phase when design adjustments are more costly.
            </p>
            <p>
              For responsive designs, test placeholder text at multiple viewport sizes to ensure your typographic system scales properly. The same number of lorem ipsum paragraphs that looks balanced on desktop may create excessive scrolling on mobile. Use the generated text to test your line-length constraints, heading wrapping behavior, and the relationship between text and adjacent media elements across breakpoints. When you need to compare how different text variants affect your layout, the <Link href="/text-diff-checker" className="text-blue-600 hover:underline dark:text-blue-400">Text Diff Checker</Link> helps you track changes between iterations of your placeholder content during the design refinement process.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Lorem Ipsum" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📝", title: "Word Counter", description: "Count words, characters, sentences, and paragraphs in your text", href: "/word-counter" },
              { icon: "🔡", title: "Case Converter", description: "Convert text between camelCase, snake_case, kebab-case, and more", href: "/case-converter" },
              { icon: "🔗", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
              { icon: "🔍", title: "Regex Tester", description: "Test regular expressions with live matching and capture groups", href: "/regex-tester" },
            ]}
            title="Related Text & Writing Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="lorem-ipsum-generator" />
    </>
  );
}
