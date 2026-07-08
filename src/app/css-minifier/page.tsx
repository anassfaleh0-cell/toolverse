import type { Metadata } from "next";
import { CssMinifier } from "@/components/css-minifier/css-minifier";
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

const slug = "css-minifier";
const pageTitle = "CSS Minifier - Minify and Beautify CSS Stylesheets Online";
const pageDescription =
  "Minify CSS stylesheets by removing whitespace, comments, and redundant rules. Beautify compressed CSS for readability. Free online CSS optimizer for faster page loads and smaller stylesheets.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${slug}`,
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: `${SITE_URL}/${slug}`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Code & Development", href: `${SITE_URL}/category/code-dev` },
  { label: "CSS Minifier" },
];

const faqItems: FaqItem[] = [
  {
    question: "What does a CSS minifier actually remove from stylesheets?",
    answer:
      "A CSS minifier removes all unnecessary characters that do not affect how the browser interprets the stylesheet. This includes whitespace (spaces, tabs, line breaks) between selectors, properties, and values; CSS comments (/* ... */); trailing semicolons before closing braces; redundant units like 0px becoming 0; shorthand consolidations like #ff0000 becoming #f00; and removing the last semicolon in a rule block. Some advanced minifiers also merge identical selectors, remove vendor prefixes that are no longer needed, and inline @import statements. The result is functionally identical CSS that is typically 30-60% smaller.",
  },
  {
    question: "Can CSS minification change the visual appearance of my page?",
    answer:
      "No, a properly implemented CSS minifier produces byte-identical rendering. The CSS specification is whitespace-agnostic: spaces between selectors, properties, and values are not semantically significant. The only risk is with CSS hacks that rely on specific character patterns to target specific browsers. For example, some IE hacks use malformed CSS comments and specific spacing that a minifier might remove. Modern minifiers handle standard CSS correctly, but if you use browser-specific hacks, test the minified output across all target browsers before deploying.",
  },
  {
    question: "How much does CSS minification improve page load speed?",
    answer:
      "CSS is a render-blocking resource: the browser cannot render the page until it has downloaded and parsed all CSS. Minification reduces the download time proportionally to the size reduction. A 100 KB CSS file minified to 60 KB saves 40 KB of bandwidth per page load. On a 3G connection (1.5 Mbps), that saves approximately 200 milliseconds. More importantly, minification reduces parse time because the CSS parser processes fewer tokens. Combined with Gzip/Brotli compression, CSS minification can reduce total CSS payload by 60-75% compared to unminified, uncompressed CSS.",
  },
  {
    question: "What is the difference between CSS minification and CSS optimization?",
    answer:
      "CSS minification focuses on removing unnecessary characters without changing the rules. CSS optimization goes further by modifying the structure to produce smaller or more efficient CSS. Optimizations include merging duplicate selectors, combining identical rules, removing unused CSS (tree-shaking), converting longhand properties to shorthand (margin: 10px 0 10px 0 becomes margin: 10px 0), re-ordering selectors for better Gzip compression, and removing vendor prefixes that the target browsers do not need. Some tools like PurgeCSS remove entire rules that are not used in your HTML, which can reduce CSS file size by 90% or more on large frameworks like Bootstrap or Tailwind.",
  },
  {
    question: "Should I minify CSS before or after using PostCSS or Sass?",
    answer:
      "Always minify after compilation, never before. If you use Sass/SCSS, Less, or PostCSS, the preprocessor compiles your source into standard CSS. You should minify the final CSS output, not the preprocessor source. Minifying the preprocessor source could break valid syntax that the preprocessor needs to parse. In a typical build pipeline, the order is: preprocessor compilation → autoprefixing → CSS organization (merge/concatenate) → minification → gzip. Most build tools like Webpack, Vite, and Parcel handle this order automatically when configured correctly.",
  },
  {
    question: "Will CSS minification break CSS Grid or Flexbox layouts?",
    answer:
      "No, CSS minification does not affect the semantics of CSS Grid, Flexbox, or any other CSS layout module. The minifier only removes whitespace and comments; it does not alter property names, values, or selectors. Grid and Flexbox properties like grid-template-columns, gap, flex-direction, and their values are preserved exactly. The only layout-related issue that could arise is if you rely on whitespace in generated content (::before { content: ' ' }) — but minifiers preserve whitespace inside string values because that would change the rendered output.",
  },
  {
    question: "What are safe margins for CSS minification aggressiveness?",
    answer:
      "Safe CSS minification removes: all whitespace and comment blocks; trailing semicolons; the last rule's semicolon; units on zero values (0px → 0); color values to their shortest hex form (#ff0000 → #f00, #ffffff → #fff); and using the shorthand opacity/visibility pattern. Aggressive but still safe options include: merging identical selectors from different blocks; removing duplicate properties within a single block where the second overrides the first; and removing vendor prefixes for browsers you do not support via autoprefixer configuration. Unsafe operations include: re-ordering rules that affect CSS cascade order; removing properties that appear to be overridden but might affect different elements; or shortening time values (1s → 1) which changes the duration.",
  },
  {
    question: "How does CSS minification interact with CSS custom properties (variables)?",
    answer:
      "CSS custom properties (var(--name)) are handled correctly by all standard CSS minifiers. The variable declarations (--name: value) are preserved with their names unchanged because minifiers do not rename CSS variables (doing so would require understanding the entire scope chain, which is impractical). The var() function calls are also preserved. However, minifiers can safely shorten the values assigned to custom properties when those values are standard CSS value types. For example, --primary: #ff0000 can be minified to --primary: #f00. This is safe because the variable substitution happens after the entire stylesheet is parsed.",
  },
  {
    question: "What is the difference between CSS minification and CSS beautification?",
    answer:
      "CSS minification condenses stylesheets for production by removing all non-essential characters, producing compact, single-line (or nearly single-line) output. CSS beautification (or formatting) takes compressed or messy CSS and adds consistent indentation, line breaks, and spacing to make it human-readable. Beautification is essential for debugging minified CSS, reviewing code generations from transpilers, and maintaining legacy stylesheets that lack consistent formatting. A good CSS tool offers both modes, allowing developers to toggle between compact and readable views as needed.",
  },
  {
    question: "Can CSS minification cause specificity issues?",
    answer:
      "CSS minification itself cannot cause specificity issues because it does not change selectors or the rules within them. However, if your minifier merges selectors or combines rules, there is a theoretical risk of specificity changes if not implemented correctly. For example, if two separate rules have different selectors targeting the same element with different specificity, merging them could change which property wins. Reputable CSS minifiers do not perform such merging for exactly this reason. If you need selector merging, use a dedicated CSS optimization tool that understands specificity calculations.",
  },
  {
    question: "How do I set up CSS minification in a Webpack or Vite project?",
    answer:
      `In Webpack, CSS minification is handled by css-minimizer-webpack-plugin, which uses cssnano (a PostCSS-based optimizer) under the hood. It runs during the optimization phase of the build, after all loaders have processed the CSS. In Vite, CSS minification is built-in and enabled by default for production builds using esbuild or cssnano. The minification level can be configured in vite.config.js under css.minify. Both tools integrate with PostCSS for autoprefixing and then minify the final output. For stylesheets that need additional formatting before processing, the <Link href="/js-minifier" className="text-blue-600 hover:underline dark:text-blue-400">JS Minifier</Link> handles companion script minification in the same build step.`,
  },
  {
    question: "What is PurgeCSS and how does it relate to CSS minification?",
    answer:
      "PurgeCSS is a tool that analyzes your HTML and JavaScript files to find which CSS selectors are actually used, then removes all unused CSS rules. It is commonly used with Tailwind CSS, which generates thousands of utility classes, typically 90% of which are unused in any given project. PurgeCSS is not a CSS minifier in the traditional sense — it removes entire rules rather than compacting syntax. The two are complementary: run PurgeCSS first to eliminate unused rules, then minify the result to compact the remaining CSS. This combination can reduce a 2 MB Tailwind stylesheet to under 10 KB in many real-world projects.",
  },
];

export default function CssMinifierPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="CSS Minifier"
            description="Minify CSS stylesheets by removing whitespace, comments, and redundant syntax. Beautify compressed CSS for debugging and analysis."
            breadcrumbs={breadcrumbs}
          >
            <CssMinifier />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why CSS File Size Matters More Than You Think
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              CSS is one of the few resources that blocks both rendering and parsing. When a browser encounters a <code>&lt;link rel=&quot;stylesheet&quot;&gt;</code> tag in the <code>&lt;head&gt;</code>, it stalls further HTML parsing until the CSS is downloaded and processed. This means every kilobyte of CSS directly delays the browser&apos;s ability to discover and load other resources like images and scripts that appear later in the HTML. The impact is multiplicative: a large CSS file not only takes longer to download itself but also delays the entire page load pipeline. On mobile networks with high latency and limited bandwidth, CSS size can dominate the initial loading experience.
            </p>
            <p>
              Modern CSS frameworks like Tailwind, Bootstrap, and Material UI generate massive stylesheets. An unoptimized Tailwind build can easily exceed 3 MB. With PurgeCSS and minification, that drops to 10-30 KB for most projects — a 99% reduction. This is not just about bandwidth: the CSS parser must tokenize every rule, and the style engine must compute the cascade for every element on the page. Fewer CSS rules mean faster style recalculations during scrolling and interactions. For complementary optimization of JavaScript, which also blocks parsing and execution, the <Link href="/js-minifier" className="text-blue-600 hover:underline dark:text-blue-400">JS Minifier</Link> provides the same size reduction benefits for your scripts.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            CSS Optimization Techniques Beyond Minification
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              While minification handles the low-hanging fruit of whitespace and comment removal, true CSS optimization requires understanding how browsers process stylesheets. Selector matching performance varies significantly: the browser matches selectors from right to left, so <code>.nav .item a</code> first matches all <code>&lt;a&gt;</code> elements, then filters by ancestry. Universal selectors and deeply nested selectors cause the most work for the style engine. Modern CSS optimization tools can rewrite selectors to reduce matching complexity while preserving the same visual outcome. Critical CSS extraction is another powerful technique: inlining the above-fold CSS directly in the HTML eliminates the render-blocking request for the full stylesheet on the initial page load.
            </p>
            <p>
              CSS containment (the <code>contain</code> property) is an underutilized optimization that limits the scope of style recalculation and layout operations. By declaring <code>contain: layout style paint</code> on independent UI widgets, you tell the browser that changes inside the widget do not affect the rest of the page. This dramatically improves runtime performance for dynamic content. CSS size optimization also benefits from removing legacy hacks: deleting old flexbox prefixes for IE10 (<code>-ms-flex</code>), dropping obsolete gradient syntax, and stripping out styles that target browsers with vanishingly small market share all reduce file size. The <Link href="/html-minifier" className="text-blue-600 hover:underline dark:text-blue-400">HTML Minifier</Link> can complement CSS optimization by ensuring the HTML markup that references your stylesheets is also as lean as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            CSS Beautification for Debugging and Code Review
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              CSS beautification transforms compressed, unreadable stylesheets into well-formatted, indented code. This is essential when debugging production issues where you only have access to the minified CSS file. By beautifying the stylesheet, you can trace the cascade, identify which rules apply to a given element, and spot inconsistencies that the minifier may have obscured. Beautification is also invaluable when working with CSS-in-JS outputs, styled-components, or CSS modules, where the generated class names are hashed but the rule structure is standard CSS. A beautified view reveals the logical grouping of styles and makes it easy to identify redundant or conflicting declarations.
            </p>
            <p>
              Code review of CSS benefits enormously from beautification. A pull request that changes 1,000 lines of CSS is nearly impossible to review in minified form. By formatting the diff with consistent indentation and line breaks, reviewers can see exactly which properties were added, removed, or modified. Many teams enforce beautification as a pre-commit hook using Prettier or stylelint to ensure every CSS file in the repository follows the same formatting conventions. For working with CSS colors during design reviews and theme adjustments, the <Link href="/color-converter" className="text-blue-600 hover:underline dark:text-blue-400">Color Converter</Link> helps translate between HEX, RGB, and HSL values referenced in the stylesheet.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            CSS Variables, Container Queries, and Modern Minification
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Modern CSS features like custom properties (variables), container queries, and cascade layers introduce new considerations for minification. CSS variables must have their names preserved because they are referenced by name in var() functions throughout the stylesheet. A minifier that renamed variables would break the cascade. Container query syntax (@container (min-width: 600px)) introduces additional whitespace that minifiers must handle carefully — the parentheses and comparison operators must remain intact. Cascade layers (@layer) have similar constraints: the layer name and ordering must be preserved because they affect the cascade&apos;s final authority.
            </p>
            <p>
              The good news is that modern CSS minifiers are designed to handle these features correctly. They parse the full CSS syntax tree rather than applying regex-based transformations, which means they understand the structure of CSS at a semantic level. This allows them to safely minify within the constraints of each CSS construct. When working across multiple technologies, you might need to combine CSS minification with other encoding tools. The <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> helps standardize property naming conventions if you are migrating between CSS naming conventions like kebab-case (native CSS) and camelCase (CSS-in-JS).
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About CSS Minification" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "📜", title: "JS Minifier", description: "Minify and beautify JavaScript code for faster loading", href: "/js-minifier" },
              { icon: "🌐", title: "HTML Minifier", description: "Minify and beautify HTML markup for production", href: "/html-minifier" },
              { icon: "🎨", title: "Color Converter", description: "Convert colors between HEX, RGB, and HSL formats", href: "/color-converter" },
              { icon: "🔡", title: "Case Converter", description: "Convert text between camelCase, snake_case, and more", href: "/case-converter" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="css-minifier" />
    </>
  );
}
