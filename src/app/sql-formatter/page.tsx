import type { Metadata } from "next";
import { SqlFormatter } from "@/components/sql-formatter/sql-formatter";
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

const slug = "sql-formatter";
const pageTitle = "SQL Formatter - Format and Beautify SQL Queries Online";
const pageDescription =
  "Format messy SQL queries into readable, well-indented statements. Capitalize keywords, add line breaks after major clauses, and minify for compact output.";

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
  { label: "SQL Formatter" },
];

const faqItems: FaqItem[] = [
  {
    question: "Why is SQL formatting important for development teams?",
    answer:
      "Well-formatted SQL is easier to read, review, and maintain. Formatting enforces consistent capitalization of keywords, proper indentation of clauses, and logical line breaks that mirror the query&apos;s execution flow. In code reviews, formatted SQL lets reviewers focus on query logic rather than deciphering a wall of text. Teams that adopt a consistent SQL formatting style reduce merge conflicts in version control and make it easier to spot syntax errors and performance issues during review.",
  },
  {
    question: "What formatting rules does the Nuvora SQL formatter apply?",
    answer:
      "The formatter capitalizes all SQL keywords including SELECT, FROM, WHERE, JOIN, GROUP BY, ORDER BY, and HAVING. It adds newlines before major clauses, indents subclauses like AND and OR with two spaces, inserts spaces around parentheses and operators, and preserves string literals and quoted identifiers. The output is designed to match common SQL formatting conventions used in professional database development.",
  },
  {
    question: "What SQL dialects are supported by this formatter?",
    answer:
      "The formatter works with standard SQL syntax common to MySQL, PostgreSQL, SQLite, SQL Server, and Oracle. It handles SELECT queries, INSERT statements, UPDATE commands, DELETE operations, CREATE TABLE definitions, JOINs, subqueries, and common functions. Dialect-specific syntax like PostgreSQL&apos;s JSON operators or MySQL&apos;s backtick quoting is preserved but may not be specially formatted. The formatter focuses on the common SQL subset that works across all major databases.",
  },
  {
    question: "When should I use the Minify option instead of Format?",
    answer:
      "Use Minify when you need to compress SQL for storage in configuration files, embed it in application code, or transmit it over the network in API requests. Minified SQL removes all unnecessary whitespace while capitalizing keywords to maintain readability at a compact size. Use Format when you are writing new queries, debugging existing ones, or preparing code for peer review. The round-trip between formatted and minified SQL preserves query correctness.",
  },
  {
    question: "Can the SQL formatter handle stored procedures and complex statements?",
    answer:
      "The formatter works best on individual queries and moderately complex statements. For stored procedures with multiple statements, it is recommended to format each query separately. Very complex nested subqueries and CTEs (Common Table Expressions) are formatted with basic indentation. For production database code with complex procedural logic, consider using a dedicated SQL formatter integrated with your IDE for more advanced parsing capabilities.",
  },
  {
    question: "How does SQL formatting help with query optimization?",
    answer:
      "Formatted SQL makes it easier to visualize a query&apos;s execution plan by clearly separating the SELECT, FROM, WHERE, JOIN, and ORDER BY clauses. This separation helps identify missing indexes, inefficient JOIN orders, and unnecessary subqueries. When sharing formatted queries in performance reviews, team members can quickly identify which parts of the query access which tables and how the database engine will execute the operations.",
  },
  {
    question: "What is the difference between formatting and linting SQL?",
    answer:
      "Formatting changes the visual layout of SQL by adjusting whitespace, capitalization, and line breaks without altering the query structure or correctness. Linting goes further by analyzing the SQL for potential errors, anti-patterns, and performance issues such as missing WHERE clauses on UPDATE statements, SELECT * in production code, or implicit JOIN syntax. A formatter makes SQL look clean; a linter makes SQL behave correctly.",
  },
  {
    question: "Why do some SQL keywords appear lowercase after formatting?",
    answer:
      "The formatter capitalizes known SQL keywords from its built-in dictionary. If a keyword is not in the dictionary (e.g., database-specific extensions, custom functions, or uncommon keywords), it will remain in the original case. The keyword list covers all major SQL commands, clauses, operators, and functions across standard SQL dialects. Custom or vendor-specific extensions may need manual capitalization.",
  },
  {
    question: "How does SQL formatting work with string literals and comments?",
    answer:
      "String literals (single-quoted) and identifiers (double-quoted or backtick-quoted) are preserved exactly as written during formatting. The tokenizer recognizes quoted strings and treats their contents as literal text, preventing false keyword matches inside strings. Comments (both single-line -- and multi-line /* */) are preserved in their original form and position in the formatted output.",
  },
  {
    question: "Can I use the formatted SQL directly in my database client?",
    answer:
      "Yes. The formatted SQL output is syntactically valid and can be copied directly into any database client or query tool. The formatter does not modify the query logic or structure, only the visual layout. After formatting, you should test the query against your database to ensure it executes correctly, especially if the original query was malformed or contained dialect-specific syntax that the formatter may have misinterpreted.",
  },
];

export default function SqlFormatterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="SQL Formatter"
            description="Format SQL queries with proper capitalization, indentation, and line breaks. Minify option available for compact output."
            breadcrumbs={breadcrumbs}
          >
            <SqlFormatter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Consistent SQL Formatting Improves Team Productivity
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              SQL queries are often the most performance-critical code in an application. A poorly formatted query with inconsistent capitalization and no logical line breaks is difficult to review, debug, and optimize. When a team member writes a 50-line JOIN query as a single line, finding the WHERE clause for debugging becomes a tedious search-and-scroll exercise. Consistent formatting eliminates this friction by establishing a visual structure that mirrors the query&apos;s logical execution order: SELECT columns first, then FROM tables, JOIN conditions, WHERE filters, GROUP BY aggregations, and finally ORDER BY sorting.
            </p>
            <p>
              The benefits extend beyond readability. Formatted SQL reduces merge conflicts in version control because changes to individual clauses appear on separate lines rather than within a long line. It makes code reviews more productive by letting reviewers focus on query logic rather than deciphering syntax. And it helps junior developers learn SQL structure by providing a clear visual template for how queries are organized. When combined with the <Link href="/regex-tester" className="text-blue-600 hover:underline dark:text-blue-400">Regex Tester</Link>, you can validate that your formatted queries meet team-specific naming conventions and patterns.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common SQL Anti-Patterns That Formatting Reveals
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Formatting SQL often reveals hidden anti-patterns. A SELECT * that spans hundreds of columns becomes obvious when formatted line-by-line. Cartesian JOINs without ON conditions stand out when the JOIN clause is on its own line with no matching condition. Deeply nested subqueries become visually apparent through indentation levels. Excessive WHERE conditions with complex boolean logic are easier to simplify when each condition is on its own line with proper AND/OR indentation.
            </p>
            <p>
              Many of these anti-patterns are performance killers. SELECT * forces the database to read and transfer unnecessary columns. Missing JOIN conditions cause unintended cartesian products that can multiply row counts exponentially. Deeply nested subqueries often can be replaced with CTEs or temporary tables for better performance. By making the query structure visible, formatting helps both the original author and reviewer identify these issues before they reach production. When minifying SQL for embedding in application code, the <Link href="/js-minifier" className="text-blue-600 hover:underline dark:text-blue-400">JS Minifier</Link> can help compact the surrounding JavaScript code that builds and executes these queries.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            SQL Formatting Best Practices for Development Teams
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Establish a team-wide SQL formatting standard and enforce it in your CI/CD pipeline. The standard should specify keyword capitalization (uppercase is the industry convention), indentation size (2 spaces is most common), clause ordering (SELECT before FROM before WHERE), and when to use CTEs vs subqueries. Most teams adopt a style similar to the SQL formatter output: major clauses on new lines, AND/OR indented under WHERE, and JOIN conditions on the same line as the JOIN keyword.
            </p>
            <p>
              For complex queries longer than 50 lines, consider breaking them into CTEs with descriptive names. Each CTE should be short and focused on a single transformation step. This makes the overall query read like a pipeline of operations, which is easier to debug and optimize. The formatted output of each CTE clearly shows its input and output columns, making data lineage traceable through the entire query. For testing and validating your formatted SQL, the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> helps inspect JSON-based query plans from Postgres EXPLAIN (FORMAT JSON) output.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About SQL Formatting" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "FileText", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
              { icon: "Search", title: "Regex Tester", description: "Test regular expressions with live matching and capture groups", href: "/regex-tester" },
              { icon: "Wrench", title: "JS Minifier", description: "Minify JavaScript code to reduce file size", href: "/js-minifier" },
              { icon: "Palette", title: "CSS Minifier", description: "Minify and format CSS stylesheets", href: "/css-minifier" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="sql-formatter" />
    </>
  );
}
