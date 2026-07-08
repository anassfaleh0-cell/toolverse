import type { Metadata } from "next";
import { JsMinifier } from "@/components/js-minifier/js-minifier";
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

const slug = "js-minifier";
const pageTitle = "JS Minifier - Minify and Beautify JavaScript Code Online";
const pageDescription =
  "Minify JavaScript code by removing whitespace, comments, and shortening variable names. Beautify compressed JS for debugging. Free online JavaScript minifier for faster page loads.";

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
  { label: "JS Minifier" },
];

const faqItems: FaqItem[] = [
  {
    question: "What does a JavaScript minifier actually do to my code?",
    answer:
      "A JavaScript minifier transforms readable source code into a compact form without changing its behavior. The key operations are: removing whitespace (spaces, tabs, newlines), removing comments (both // and /* */), shortening variable and function names (e.g., let userName becomes let a), removing unreachable code (dead code elimination), stripping debugger statements and console.log calls (when configured), condensing boolean and null comparisons, optimizing arithmetic expressions, and sometimes rewriting if/else chains into ternary operators. Tools like Terser and esbuild go further with structural optimizations like merging variable declarations and unrolling loops where safe.",
  },
  {
    question: "Can JavaScript minification change the behavior of my code?",
    answer:
      "A correctly configured JavaScript minifier should never change runtime behavior for valid JavaScript. However, there are edge cases. Variable renaming can break code that relies on Function.prototype.toString() to inspect function source (common in some testing frameworks and Angular's dependency injection). Dead code removal can eliminate functions intended to be called from outside the bundle if they are not explicitly exported. The with() statement, indirect eval, and global variable access through computed property names can confuse the minifier's scope analysis. Modern minifiers handle these cases with configuration options and bailouts when they detect unsafe optimizations.",
  },
  {
    question: "How much smaller can JavaScript be after minification and compression?",
    answer:
      "Typical minification reduces JavaScript file size by 40-60%. Gzip compression on top of that reduces size by an additional 50-70%. Combined, the final compressed payload is often 80-90% smaller than the original readable source. For example, a 300 KB JavaScript module might minify to 150 KB and then Gzip to 45 KB for transfer. Some frameworks achieve even better results: React production builds are about 70% smaller than development builds after minification. The <Link href='/css-minifier' className='text-blue-600 hover:underline dark:text-blue-400'>CSS Minifier</Link> achieves similar ratios for stylesheets, and combining both ensures comprehensive frontend optimization.",
  },
  {
    question: "What is the difference between Terser, UglifyJS, and esbuild?",
    answer:
      "Terser is the modern successor to UglifyJS, retaining its API while adding support for ES6+ syntax (arrow functions, classes, async/await, optional chaining, nullish coalescing). UglifyJS only supports ES5, making it unsuitable for modern codebases unless you transpile first. esbuild is a Go-based bundler that includes a built-in minifier. It is 10-100x faster than Terser but does fewer aggressive optimizations like constant folding and dead code elimination at the same depth. For production builds, Terser produces marginally smaller output; for development speed, esbuild is preferred. Webpack uses Terser by default via terser-webpack-plugin.",
  },
  {
    question: "How does minification relate to source maps?",
    answer:
      "Source maps map each line and character in the minified output back to the original source file and position. They are essential for debugging minified code in production. When the browser's dev tools encounter a source map directive, they display the original source instead of the minified output, allowing developers to set breakpoints, view stack traces, and step through readable code. Source maps are generated during minification and served alongside the minified file, typically as a separate .js.map file. Browsers only download the source map when dev tools are open, so there is no performance impact for end users. Always generate source maps for production builds to ensure you can debug issues without deploying debug versions.",
  },
  {
    question: "What is tree shaking and how does it differ from minification?",
    answer:
      "Tree shaking (dead code elimination at the module level) removes entire export statements that are never imported anywhere in the application. It relies on ES module static import/export syntax (import/export) rather than CommonJS (require/module.exports). Tree shaking analyzes the import graph and eliminates modules that have no reachable consumers. Minification operates within a single file or scope, removing unused code at a finer granularity. The two are complementary: tree shaking removes entire libraries or functions that are never imported, while minification compacts the remaining code. React, Lodash, and Three.js all publish ES module builds specifically to enable tree shaking.",
  },
  {
    question: "Should I minify JavaScript during development or only in production?",
    answer:
      "Only minify JavaScript in production builds. During development, readable source code with original variable names, preserved comments, and full stack traces is essential for debugging. Minified code provides meaningless error messages and impossible-to-follow stack traces. Use a build tool that applies minification only in production mode, triggered by environment variables like NODE_ENV=production. In development mode, serve the original source with fast incremental builds that skip minification entirely. Most frameworks (Next.js, Create React App, Vite) follow this pattern automatically.",
  },
  {
    question: "What are the risks of aggressive JavaScript minification?",
    answer:
      "Aggressive minification can break code that relies on: function stringification (fn.toString()), the arguments.callee pattern (deprecated but still present in legacy code), eval() with string manipulation of source code, Angular 1.x dependency injection (inline array annotation solves this), and code that reads its own source via document.currentScript. The 'compress' options in Terser can be particularly dangerous: sequences (joining consecutive statements), conditionals (rewriting if into ternary), and booleans (simplifying boolean expressions) have each caused real-world bugs. Test thoroughly with aggressive settings before deploying.",
  },
  {
    question: "How does JavaScript minification handle async/await and generators?",
    answer:
      "Modern minifiers like Terser and esbuild fully support ES6+ syntax including async/await, generators, for-await-of loops, and optional chaining. The minifier parses these constructs as part of the JavaScript AST and applies optimizations while preserving correct semantics. Async functions are minified by shortening internal variable names but never by removing await keywords or altering the async context. Generator functions have their yield expressions preserved exactly. The only limitation is if you configure the minifier to target an older ECMAScript version that does not support these features — in that case, the minifier should refuse to process the code rather than produce incorrect output.",
  },
  {
    question: "What is the difference between beautification and prettification of JavaScript?",
    answer:
      "In the context of JavaScript tooling, beautification and prettification are synonymous: they both refer to taking minified or poorly formatted code and applying consistent indentation, line breaks, and spacing to make it human-readable. The output typically uses 2-space or 4-space indentation, adds spaces around operators and after commas, places opening braces on the same line (K&R style), and breaks long lines at readable boundaries. This is the inverse operation of minification. Tools like Prettier go further by enforcing a consistent code style beyond formatting, including quote style, trailing commas, and semicolons.",
  },
  {
    question: "How do I minify JavaScript in a Node.js or browser environment?",
    answer:
      "In Node.js, use Terser programmatically: const terser = require('terser'); const result = await terser.minify(code, { compress: true, mangle: true });. For simple string minification, use the UglifyJS API or the esbuild transform API. In the browser, you can use the WASM-based version of Terser or the babel-standalone library with minification presets. For build pipeline integration, Webpack uses terser-webpack-plugin, Vite uses esbuild, and Parcel uses its own Rust-based minifier. To format JSON data that your JavaScript might process or generate, the <Link href='/json-formatter' className='text-blue-600 hover:underline dark:text-blue-400'>JSON Formatter</Link> helps validate and beautify JSON structures before or after minification.",
  },
  {
    question: "What is the 'mangle' option in JavaScript minifiers?",
    answer:
      "Mangling is the process of shortening variable, function, and parameter names to single characters or very short strings. This is one of the largest sources of size reduction in JS minification. Mangling renames local variables (let count → let a), function parameters (function(name) → function(n)), and sometimes function names themselves (if not globally referenced). Property mangling (shortening object property names) is also possible but requires knowledge of all property accesses across the codebase and is usually unsafe for library code. Mangled code is essentially unreadable, which is why source maps are essential for debugging production issues.",
  },
];

export default function JsMinifierPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="JS Minifier"
            description="Minify JavaScript code by removing whitespace, shortening variable names, and eliminating dead code. Beautify compressed JS for debugging purposes."
            breadcrumbs={breadcrumbs}
          >
            <JsMinifier />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            How JavaScript Minification Transforms Your Code
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              JavaScript minification is fundamentally a lossless transformation that operates on the code&apos;s abstract syntax tree (AST). The minifier parses the source code into an AST, applies a series of optimization passes, and then generates the compressed output from the optimized AST. This approach is far more reliable than regex-based minification because the AST captures the true syntactic structure of the code. Each optimization pass is designed to preserve: all control flow decisions (if/else, loops, switch), all side effects (function calls, assignments, property mutations), and all runtime semantics (typeof, instanceof, prototype chains). The minifier must understand JavaScript deeply to avoid introducing bugs.
            </p>
            <p>
              The scale of potential size reduction grows with the complexity of the original code. A simple jQuery-like selector function might minify by only 30%, while a large React component with multiple lifecycle methods and JSX can minify by 60-70%. The reason is that verbose code with long variable names, extensive comments, and repetitive patterns gives the minifier more opportunity. Class-based React components with full method names, prop type validations, and JSDoc comments are particularly compressible. Alongside minification, using the <Link href="/regex-tester" className="text-blue-600 hover:underline dark:text-blue-400">Regex Tester</Link> helps you validate and optimize the regular expressions that often constitute a significant portion of JavaScript utility code, as regex patterns cannot be minified but can often be rewritten more efficiently.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Dead Code Elimination and Tree Shaking
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
               Tree shaking is one of the most impactful optimizations available to JavaScript developers. When you import {'{'} debounce {'}'} from &apos;lodash&apos;, a naive bundler would include the entire lodash library (75 KB minified). With tree shaking, the bundler analyzes the import graph and includes only the code that debounce directly depends on — typically under 1 KB. The technique works because ES module imports and exports are static: the import statement always references the same binding, and the export statement always exposes the same binding. Tools like Rollup and esbuild use this static structure to trace which exports are reachable from the application&apos;s entry point and which can be safely removed.
            </p>
            <p>
              Dead code elimination operates at a finer granularity within a single module. It removes if (false) branches, eliminates unreachable code after return statements, strips variable assignments that are never read, and removes loop bodies that never execute. These optimizations are applied by the minifier during AST transformation, not during bundling. The combination of tree shaking (module-level dead code removal) and dead code elimination (function-level dead code removal) is what makes modern JavaScript bundles so much smaller than the raw source. For backend or debugging use, the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> helps inspect the configuration and metadata files that often accompany JavaScript projects, ensuring your build tools are correctly configured.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Source Maps: Debugging Minified Code in Production
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Source maps are JSON files that encode the mapping between each location in the minified output and the corresponding location in the original source. When the browser&apos;s developer tools are open, it detects the //# sourceMappingURL= comment at the end of the minified file, downloads the source map, and uses it to reconstruct the original source for display in the debugger. This means you can deploy minified code with full confidence that production errors will still produce meaningful stack traces that point to the original source files, line numbers, and column positions. Source maps also preserve the original variable names for debugging, even though the minified code uses mangled names.
            </p>
            <p>
              There are important security considerations with source maps. If you serve source maps publicly, anyone can view your original source code, including comments that might contain sensitive information or internal documentation. Some companies serve source maps only to authenticated users or internal IP ranges. Others generate source maps but only upload them to error tracking services like Sentry or Datadog rather than hosting them publicly. When working with obfuscated or Base64-encoded data in your JavaScript, the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> helps decode inline data that might appear in source-mapped stack traces from production errors.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Beyond Minification: JavaScript Bundle Optimization Strategies
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Minification is just one layer of the JavaScript optimization stack. Code splitting divides your bundle into smaller chunks loaded on demand, ensuring users only download the JavaScript needed for the current page or component. Dynamic imports (import()) are the primary mechanism for code splitting, letting you define split points in your application where the bundler creates separate chunks. Route-based splitting is the most common pattern: each page in a React Router or Next.js app loads its own JavaScript chunk when the user navigates to that route. This can reduce initial bundle sizes from hundreds of kilobytes to tens of kilobytes, dramatically improving Time to Interactive on mobile devices.
            </p>
            <p>
              Module/nomodule patterns deliver modern ES module syntax to modern browsers and transpiled ES5 bundles to legacy browsers, reducing the amount of polyfill and transformation code that modern browsers need to parse. Differential serving typically reduces the modern bundle size by 20-30% compared to the legacy bundle because modern browsers support native ES modules, async/await, and newer JavaScript features that do not require transpilation. For debugging the regular expressions within your JavaScript bundles, the <Link href="/regex-tester" className="text-blue-600 hover:underline dark:text-blue-400">Regex Tester</Link> provides a sandbox environment to test and optimize regex patterns before they ship to production.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About JS Minification" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🌐", title: "HTML Minifier", description: "Minify and beautify HTML markup for production", href: "/html-minifier" },
              { icon: "🎨", title: "CSS Minifier", description: "Minify and beautify CSS stylesheets for production", href: "/css-minifier" },
              { icon: "📋", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
              { icon: "🔍", title: "Regex Tester", description: "Test regular expressions with live matching and capture groups", href: "/regex-tester" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="js-minifier" />
    </>
  );
}
