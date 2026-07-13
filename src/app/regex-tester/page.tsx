import type { Metadata } from "next";
import { RegexTester } from "@/components/regex-tester/regex-tester";
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

const slug = "regex-tester";
const pageTitle = "Regex Tester - Test Regular Expressions Online with Live Matching";
const pageDescription =
  "Test and debug regular expressions online with real-time matching, capture groups, and flags. Free regex tester for JavaScript and PCRE-compatible patterns with example library.";

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
  { label: "Regex Tester" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is a regular expression and how does it work?",
    answer:
      "A regular expression (regex) is a sequence of characters that defines a search pattern. The regex engine processes the pattern against an input string, character by character, using a state machine that matches literal characters, metacharacters (like . * + ?), character classes ([a-z]), groups ((...)), and anchors (^ $). The engine finds either the first match or all matches depending on the flags used. Understanding how the engine backtracks is key to writing efficient patterns that do not cause catastrophic backtracking on long inputs.",
  },
  {
    question: "What is the difference between greedy and lazy quantifiers?",
    answer:
      "Greedy quantifiers (*, +, {n,m}) match as much text as possible while still allowing the overall pattern to match. Lazy quantifiers (*?, +?, {n,m}?) match as little text as possible. For example, on input &quot;abc123&quot; with pattern \\w+, a greedy match captures &quot;abc123&quot;. With \\w+?, it captures just &quot;a&quot;. Greedy quantifiers often cause more backtracking when the pattern cannot find a match, while lazy quantifiers can be more efficient but sometimes produce unexpected partial matches.",
  },
  {
    question: "What are lookahead and lookbehind assertions?",
    answer:
      "Lookahead ((?=...) for positive, (?!...) for negative) and lookbehind ((?<=...) for positive, (?<!...) for negative) are zero-width assertions that check for patterns without including them in the match. They are essential for validating password strength (ensuring at least one uppercase, one number, etc.), extracting data between delimiters without including the delimiters, and implementing split logic that preserves the separator. Lookbehind was added to JavaScript in ES2018 and is now universally supported in modern environments.",
  },
  {
    question: "Why does my regex cause the browser to freeze or hang?",
    answer:
      "Catastrophic backtracking occurs when a regex with nested quantifiers matches the same text in multiple ways, causing the engine to explore an exponentially growing number of paths. Classic patterns like (<\\w+>).*<\\/\\1> on deeply nested HTML can cause this. The solution is to use atomic groups, possessive quantifiers (where supported), or rewrite the pattern to eliminate ambiguity. If your regex hangs indefinitely, try simplifying the pattern, using more specific character classes, and avoiding nested quantifiers like (.*)*.",
  },
  {
    question: "What regex flags are available and when should I use them?",
    answer:
      "Common regex flags include: g (global, find all matches rather than stopping at the first), i (case-insensitive matching), m (multiline, where ^ and $ match line boundaries instead of string boundaries), s (dotall, where . matches newlines), u (unicode, enables \\uXXXX and proper Unicode property escapes like \\p{L}), and y (sticky, matches only from the lastIndex position). Use g for find-and-replace operations, i for case-insensitive searches, and s when your pattern needs to span multiple lines.",
  },
  {
    question: "How do capture groups work and what are named groups?",
    answer:
      "Capture groups, defined by parentheses (...), capture the matched portion of the pattern for back-referencing in the same pattern (\\1, \\2) or for extraction in the replacement string ($1, $2). Named capture groups use the syntax (?&lt;name&gt;...) and can be referenced by name rather than numeric index: \\k&lt;name&gt; in the pattern and $&lt;name&gt; in the replacement. Named groups make patterns self-documenting and eliminate the fragile renumbering that occurs when you add or remove groups.",
  },
  {
    question: "What is the difference between regex in JavaScript, Python, and PCRE?",
    answer:
      "JavaScript regex follows the ECMAScript specification, which lacks some features available in PCRE (Perl Compatible Regular Expressions) and Python. PCRE supports atomic groups, possessive quantifiers, recursive patterns, and (?(condition)then|else) conditional patterns. Python adds named groups with (?P&lt;name&gt;...) syntax and supports the VERBOSE flag for readable multi-line patterns. JavaScript has caught up with Unicode property escapes (\\p{L}) and lookbehind in ES2018, but still lacks atomic groups and recursion. Nuvora tests JavaScript-style regex.",
  },
  {
    question: "How do I validate an email address with regex?",
    answer:
      "Validating email addresses with regex is notoriously difficult because the RFC 5322 specification allows comments, quoted strings, and many special characters. A practical regex for most applications is: ^[\\w.-]+@[\\w.-]+\\.\\w{2,}$. This matches the common form and prevents obvious invalid inputs. For production validation, combine regex with DNS MX record verification and avoid overly strict patterns that reject valid internationalized email addresses. The definitive regex from RFC 5322 is hundreds of characters long and is overkill for most applications.",
  },
  {
    question: "What are character classes and shorthand classes?",
    answer:
      "Character classes define sets of characters to match. The simplest form is a character set like [aeiou] matching any vowel. Ranges like [a-z] match any lowercase letter. Negated classes like [^0-9] match anything except digits. Shorthand classes include \\d (digits, equivalent to [0-9]), \\w (word characters, [a-zA-Z0-9_]), \\s (whitespace, including space, tab, newline), \\D (non-digits), \\W (non-word), and \\S (non-whitespace). With the u flag, \\p{L} matches any Unicode letter and \\p{N} matches any Unicode number.",
  },
  {
    question: "How do I test a regex pattern against multiple test cases?",
    answer:
      "Write a list of strings that should match and a list of strings that should not match. For each test case, apply the regex and verify the result. This is called a test-driven approach to regex development. Start with the simplest possible pattern that passes all your positive test cases, then incrementally refine it to reject the negative cases. Nuvora&apos;s tester supports this workflow by showing all matches highlighted in the input text, making it easy to see exactly which portions of your test strings are captured by the pattern.",
  },
  {
    question: "What is the difference between match, exec, and test in JavaScript regex?",
    answer:
      "String.prototype.match(regex) returns an array of matches when used with the g flag, or the first match with capture groups when used without g. RegExp.prototype.exec(string) returns the next match and updates lastIndex, enabling iterative matching. RegExp.prototype.test(string) returns a boolean indicating whether a match exists. Use test for validation, exec for iterative extraction with position tracking, and match for simple retrieval. All three reset lastIndex when used without the g flag.",
  },
  {
    question: "How do I use regex for find-and-replace transformations?",
    answer:
      "String.prototype.replace(regex, replacement) supports pattern-based replacement. The replacement string can include special patterns: $& (the match), $` (text before match), $' (text after match), $1, $2 (capture group values), and $&lt;name&gt; (named capture groups). You can also pass a function as the replacement argument: function(match, ...groups, offset, string) { return transformedValue; }. This enables complex transformations like converting date formats, reformatting phone numbers, or escaping special characters in templates.",
  },
];

export default function RegexTesterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Regex Tester"
            description="Write and test regular expressions with live highlighting, capture group extraction, and flag toggling. Debug patterns against sample text and iterate instantly."
            breadcrumbs={breadcrumbs}
          >
            <RegexTester />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Every Developer Needs a Regex Tester in Their Toolkit
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Regular expressions are one of the most powerful and most feared tools in a developer&apos;s arsenal. A well-crafted regex can replace dozens of lines of procedural string manipulation, validating formats, extracting data, and transforming text in a single expression. But regex is also notoriously difficult to debug because the failure mode is often silent: the pattern simply does not match, and you are left wondering whether the pattern is wrong or the input is unexpected. A regex tester eliminates this uncertainty by showing you exactly what matches and what does not.
            </p>
            <p>
              The feedback loop between writing a pattern and seeing its results is critical for learning and productivity. When you can see highlighted matches update in real time as you type, you develop an intuition for how quantifiers, character classes, and anchors interact. You can also spot subtle issues like unexpected capture group inclusion or greedy quantifiers consuming more text than intended. For large-scale text processing, validate your patterns against real data samples in the tester before deploying them in production code. The <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> complements regex testing by letting you extract and format structured data from logs and API responses, which you can then use as regex test input.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Mastering Regex Flags: How They Change Pattern Behavior
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Regex flags are modifiers that change how the pattern engine interprets the expression and searches the input text. The global flag (g) is the most commonly misunderstood: without it, most methods return only the first match. With it, the engine finds all non-overlapping matches. The multiline flag (m) changes the behavior of the ^ and $ anchors from matching string start/end to matching line start/end, which is essential for validating multi-line input like log files or CSV data.
            </p>
            <p>
               The dotall flag (s) is relatively new to JavaScript (ES2018) but is crucial for patterns that must span multiple lines. Without it, the dot metacharacter matches everything except newline characters, which causes unexpected failures when your input contains line breaks. The unicode flag (u) enables proper handling of Unicode code points, turning \\uXXXX into Unicode character escapes and enabling Unicode property escapes such as \\p{'{'}L{'}'} for letters. Without the u flag, a pattern like \\w does not match Unicode letters in non-Latin scripts, causing internationalization bugs. For patterns that need to match UUIDs or device identifiers alongside text, try the <Link href="/uuid-generator" className="text-blue-600 hover:underline dark:text-blue-400">UUID Generator</Link> to produce matching test data for your regex patterns.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Regex Pitfalls and Performance Traps
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
               The most common regex mistake is overusing the dot (.) metacharacter with the greedy star quantifier (.*). This combination matches everything it can and then backtracks character by character to satisfy the rest of the pattern. On a long input string, this backtracking can take exponential time. The classic example is using ({'<'}.*{'>'}) to match HTML tags: on input &quot;{'<'}div{'>'}content{'<'}/div{'>'}&quot;, it matches the entire string instead of just the first tag because .* is greedy. The fix is to use a negated character class ({'<'}[{'>'}]*{'>'}) or a lazy quantifier ({'<'}.*?{'>'}).
            </p>
            <p>
                             Another frequent issue is forgetting to escape special characters in the pattern. Characters like ., +, *, ?, ^, $, {'{'}, {'}'}, [, ], (, ), |, and \\ all have special meanings in regex and must be escaped with a backslash to match them literally. A related trap is assuming regex behavior is consistent across programming languages. JavaScript regex differs from Python, which differs from PCRE, which differs from grep. The same pattern can produce different results in different engines. Always test your regex in the environment where it will run, and use Nuvora&apos;s tester as a quick iteration tool before finalizing. For encoding special characters in test strings or output, the <Link href="/url-encoder" className="text-blue-600 hover:underline dark:text-blue-400">URL Encoder</Link> helps you prepare encoded test data for patterns that process URL components.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Practical Regex Use Cases in Development
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Regex is indispensable for validating user input on forms: email addresses, phone numbers, postal codes, credit card numbers, and password strength requirements are all commonly checked with regex patterns. In DevOps and backend development, regex powers log parsing, NGINX and Apache configuration pattern matching, and find-and-replace operations across large codebases. CI/CD pipelines use regex for branch name validation, commit message linting, and changelog generation.
            </p>
            <p>
              Data engineers use regex to extract structured fields from semi-structured log formats, parse CSV lines with quoted fields, and clean and normalize text data before loading it into databases. Text editors and IDEs rely on regex for advanced search-and-replace: converting snake_case to camelCase, extracting all TODO comments from a project, or reformatting dates from MM/DD/YYYY to YYYY-MM-DD. A solid understanding of regex pays dividends across every language and environment you work in. For transforming and normalizing text outputs from your regex operations, the <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> provides additional formatting options for matched strings.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Regex Testing" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "FileText", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data for regex test inputs", href: "/json-formatter" },
              { icon: "CaseSensitive", title: "Case Converter", description: "Convert text between uppercase, lowercase, camelCase, and more", href: "/case-converter" },
              { icon: "LockKeyhole", title: "Base64 Encoder", description: "Encode and decode Base64 strings for test data preparation", href: "/base64-encoder" },
              { icon: "Link", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="regex-tester" />
    </>
  );
}
