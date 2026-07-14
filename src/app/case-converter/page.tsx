import type { Metadata } from "next";
import { CaseConverter } from "@/components/case-converter/case-converter";
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

const slug = "case-converter";
const pageTitle = "Case Converter - Convert Text Between camelCase, snake_case, and More";
const pageDescription =
  "Convert text between camelCase, PascalCase, snake_case, kebab-case, UPPER_CASE, Title Case, and more. Free online case converter for developers handling naming conventions and code transformations.";

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
  { label: "Case Converter" },
];

const faqItems: FaqItem[] = [
  {
    question: "What are the common naming conventions and where are they used?",
    answer:
      "camelCase (e.g., userName, fetchData) is standard in JavaScript and Java for variable and function names. PascalCase (e.g., UserProfile, ApiClient) is used for class names in most OOP languages and React component names. snake_case (e.g., user_name, fetch_data) is conventional in Python, Ruby, and database column names. kebab-case (e.g., user-name, fetch-data) is used in HTML data attributes, CSS class names, and URL slugs. UPPER_CASE (e.g., MAX_RETRIES, API_KEY) is used for constants and environment variables. SCREAMING_SNAKE_CASE and Train-Case are rarer variants. Each ecosystem has established conventions, and mixing them within a project leads to inconsistency and reduced readability.",
  },
  {
    question: "Why does JavaScript use camelCase while Python uses snake_case?",
    answer:
      "JavaScript's camelCase convention originates from C and Java, where it was popularized by Java's standard library and propagated through early JavaScript frameworks like jQuery and Node.js APIs. Python's snake_case convention is explicitly recommended in PEP 8, Python's style guide, which argues that underscores improve readability for variable and function names. Guido van Rossum, Python's creator, preferred underscores because they are more visible than camelCase boundaries, especially in monochrome terminals and when printed. Both conventions are equally expressive; the choice is primarily cultural and historical. Modern TypeScript developers sometimes adopt snake_case for database model fields to align with SQL naming, while using camelCase for application logic.",
  },
  {
    question: "What is the best naming convention for database columns?",
    answer:
      "snake_case is the dominant convention for database columns and table names across all major relational databases (PostgreSQL, MySQL, SQL Server, SQLite). Most ORMs automatically convert between snake_case (database) and camelCase (application code) — for example, ActiveRecord in Rails, SQLAlchemy in Python, and Sequelize in Node.js all support this mapping. The reason snake_case is preferred in databases is that SQL is case-insensitive by default in many implementations, and underscored names avoid ambiguity in case-folding. Table names are typically plural snake_case (users, orders), and join tables combine both table names (users_orders).",
  },
  {
    question: "How do I convert between camelCase and snake_case programmatically?",
    answer:
      "Converting camelCase to snake_case requires inserting an underscore before each uppercase letter (except the first) and lowercasing everything: 'userName' becomes 'user_name'. Converting snake_case to camelCase requires removing underscores and uppercasing the following character: 'user_name' becomes 'userName'. For PascalCase, also uppercase the first character. In JavaScript, the conversion can be done with regex: str.replace(/([A-Z])/g, '_$1').toLowerCase() for camelToSnake, and str.replace(/_([a-z])/g, (_, c) => c.toUpperCase()) for snakeToCamel. Edge cases include consecutive uppercase letters (parseHTMLUrl → parse_h_t_t_p_u_r_l) which need special handling to produce parse_html_url.",
  },
  {
    question: "What are the rules for naming environment variables?",
    answer:
      "Environment variables conventionally use UPPER_CASE (SCREAMING_SNAKE_CASE) with underscores separating words. This convention comes from Unix heritage where environment variable names were traditionally uppercase to distinguish them from shell variables and commands. Examples: NODE_ENV, DATABASE_URL, API_KEY, PORT. There is no formal standard, but the convention is universally followed across platforms, programming languages, and cloud providers. .env files and cloud configuration panels (AWS, Heroku, Vercel) all expect uppercase underscored names. Avoid using lowercase or mixed case env vars because different operating systems handle case sensitivity differently — uppercase avoids ambiguity.",
  },
  {
    question: "What naming convention should I use for REST API endpoints?",
    answer:
      "REST API endpoints conventionally use kebab-case (lowercase with hyphens): /api/user-profiles, /order-items/123. This is the convention recommended by REST API design guides from Microsoft, Google, and the broader industry. kebab-case is preferred for URLs because: hyphens are more readable than underscores in browser address bars, search engines treat hyphens as word separators (improving SEO for the API documentation), and lowercase avoids case-sensitivity issues in web servers. The path segments should be plural nouns for collections (/users, /orders) and the specific resource ID as the next segment (/users/123). Query parameters also use kebab-case by convention.",
  },
  {
    question: "What naming convention do CSS class names use?",
    answer:
      "CSS class names conventionally use kebab-case (lowercase with hyphens): .user-profile, .nav-bar. This comes from the CSS property naming itself, which uses hyphens (background-color, font-size). BEM (Block Element Modifier) methodology extends this with double underscores for elements and double hyphens for modifiers: .block__element--modifier. CSS-in-JS solutions like styled-components use camelCase because they map more directly to JavaScript object property access. Tailwind CSS uses utility classes with kebab-case names (text-center, bg-blue-500). The key rule is consistency within a project.",
  },
  {
    question: "How do JSON API field names handle case conventions?",
    answer:
      "JSON API field naming is a contentious topic. camelCase is standard in JavaScript-heavy stacks because the JSON is consumed directly as JavaScript objects. snake_case is preferred in Python and Ruby ecosystems, and when the data passes through a database layer. Google's JSON style guide recommends camelCase. Some APIs use kebab-case for consistency with their URL conventions. The safest approach is to use camelCase for JSON APIs consumed by web frontends and snake_case for backend-to-backend communication. Many frameworks handle automatic conversion: ASP.NET Core uses CamelCase by default, Rails uses snake_case. GraphQL conventionally uses camelCase for field names across all ecosystems.",
  },
  {
    question: "What is the naming convention for TypeScript interfaces and types?",
    answer:
      "TypeScript interfaces and type aliases conventionally use PascalCase, matching the class naming convention. Interface names traditionally did not include an 'I' prefix (unlike C# where IUser is common), though some older TypeScript codebases use this pattern. TypeScript's own documentation and the DefinitelyTyped community standardize on PascalCase without prefix: User, ApiResponse, ConfigOptions. Generic type parameters use single uppercase letters by convention (T, K, V), or descriptive PascalCase names with a T prefix (TItem, TResponse). TypeScript enums also use PascalCase for their members, while enum values can be UPPER_CASE if they represent constants.",
  },
  {
    question: "How do I handle naming convention conflicts when switching between languages?",
    answer:
      "Cross-language projects inevitably face naming convention conflicts. A common pattern is to use snake_case for domain models and database schemas, then convert to camelCase at the API boundary using serialization config. For example, a Python backend (snake_case) sends JSON to a React frontend (camelCase). You can configure Django REST Framework or FastAPI to automatically convert field names. In the frontend, Axios interceptors or Apollo Link middleware can handle the conversion. GraphQL provides a natural solution: the schema defines field names independently of the backend and frontend conventions. For quick one-off conversions during development, the <Link href='/regex-tester' className='text-blue-600 hover:underline dark:text-blue-400'>Regex Tester</Link> helps craft and validate the regex patterns used for bulk renaming across codebases.",
  },
  {
    question: "What is the convention for file naming in web projects?",
    answer:
      "File naming conventions vary by framework and language. React components conventionally use PascalCase (UserProfile.tsx) because the file exports a component class or function. Utility modules use camelCase (formatDate.ts, apiClient.ts). Next.js uses kebab-case for page files in the app directory. Python modules use snake_case (user_profile.py). Vue single-file components use PascalCase or kebab-case. Configuration files kebab-case (tailwind.config.js, babel.config.js). The most important rule is to follow the convention established in your project and framework, as consistent file naming improves both readability and cross-referencing in imports.",
  },
  {
    question: "How does case sensitivity work in different programming languages?",
    answer:
      "Most modern languages are case-sensitive: userName, UserName, and username are three different identifiers in JavaScript, Python, Java, C#, and TypeScript. HTML element and attribute names are case-insensitive (DIV and div are equivalent), but XHTML requires lowercase. CSS class names and IDs are case-sensitive in most browsers. SQL column names are case-insensitive by default in MySQL and SQLite but case-sensitive in PostgreSQL (unless quoted). File systems vary: Linux is case-sensitive (File.txt ≠ file.txt), macOS and Windows are case-insensitive by default. This cross-platform discrepancy is a common source of bugs — always use consistent casing for file imports.",
  },
];

export default function CaseConverterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Case Converter"
            description={pageDescription}
            introText="Convert text between uppercase, lowercase, title case, sentence case, camelCase, snake_case, and more. Instant conversion with copy-to-clipboard support."
            breadcrumbs={breadcrumbs}
          >
            <CaseConverter />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Naming Conventions Matter Across the Stack
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Naming conventions are one of the most visible expressions of a programming language&apos;s culture and a project&apos;s internal consistency. When you see camelCase, you immediately think JavaScript or Java. When you see snake_case, you think Python or Ruby. These conventions are not arbitrary — they emerge from the syntax and grammar of each language. JavaScript allows dollar signs and underscores in identifiers, so camelCase blends well with the language&apos;s C-family syntax. Python&apos;s lack of constant declarations and its significant whitespace make snake_case more visually distinct. The impedance mismatch between conventions becomes acute in full-stack applications where data flows through multiple language boundaries.
            </p>
            <p>
              A typical web application spans at least three naming convention zones: the database (snake_case columns), the backend API (camelCase or snake_case JSON fields), and the frontend (camelCase JavaScript properties). Without a translation layer, developers constantly context-switch between conventions, increasing cognitive load and the potential for bugs. Most mature frameworks provide automated translation. For ad-hoc conversions, refactoring, or when bringing legacy code up to modern standards, this tool provides instant transformations across all common formats. When your converted data needs to be encoded for URL parameters or API calls, the <Link href="/url-encoder" className="text-blue-600 hover:underline dark:text-blue-400">URL Encoder</Link> handles the subsequent encoding step seamlessly.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Case Conventions in Database and API Design
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Database naming conventions are often the first place where case choices have real operational impact. PostgreSQL folds unquoted identifiers to lowercase, MySQL folds to lowercase on case-insensitive systems, and SQL Server preserves case but is case-insensitive in comparisons. Using snake_case and always quoting or never quoting identifiers avoids ambiguity. Most ORMs default to snake_case for table and column names because it aligns with SQL readability and avoids the need for case-sensitive quoting. When building APIs that expose database entities as JSON, you need to decide whether to expose the database&apos;s snake_case directly or convert to camelCase at the API boundary.
            </p>
            <p>
              The trend in modern API design favors camelCase in JSON responses, especially for public APIs consumed by web and mobile clients. JavaScript&apos;s dominance in the client ecosystem makes camelCase the path of least resistance. However, some ecosystems strongly prefer snake_case: the Ruby on Rails convention is snake_case throughout the stack, and many Python web frameworks (Django, Flask) follow suit. GraphQL APIs standardize on camelCase regardless of the backend language, since the schema language is language-agnostic. When working with JSON data that needs reformatting, the <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> helps visualize and restructure the output after applying case conversions.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Case Conversion for Search Engine Optimization and URLs
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              URL slugs are one of the most important applications of case conversion for SEO. Standard practice is to use lowercase kebab-case for URL paths: /my-blog-post instead of /MyBlogPost or /my_blog_post. Search engines treat hyphens as word separators, meaning my-blog-post is indexed as the words &apos;my&apos;, &apos;blog&apos;, &apos;post&apos;. Underscores in URLs are not treated as word separators by Google — /my_blog_post is indexed as the single word &apos;my_blog_post&apos;. This difference can affect search rankings for multi-word URLs. Consistent lowercasing also prevents duplicate content issues caused by case-sensitive URL paths — both /Blog and /blog resolving to the same page splits page authority.
            </p>
            <p>
              Meta titles and descriptions should use Title Case for maximum click-through rates in search results. Converting between Title Case and the kebab-case URL slugs requires understanding some rules: articles (a, an, the), conjunctions (and, but, or), and short prepositions (in, on, at) are typically lowercased in Title Case unless they start or end the title. Proper nouns and acronyms should remain capitalized regardless of position. For database keys and identifiers that underpin your URL structure, the <Link href="/uuid-generator" className="text-blue-600 hover:underline dark:text-blue-400">UUID Generator</Link> can create unique identifiers that, when converted to lowercase, serve as collision-free URL components.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Automating Case Conversion in CI/CD Pipelines
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Case conversion automation in CI/CD pipelines helps enforce project-wide naming consistency without relying on manual code reviews. Pre-commit hooks can lint for naming violations using tools like eslint-plugin-unicorn (which has filename-case rules), stylelint for CSS naming, and database migration linters. Codemods written with jscodeshift or ts-morph can automate large-scale renaming across thousands of files when migrating between conventions. For example, migrating a codebase from snake_case API fields to camelCase requires coordinated changes in model definitions, serialization logic, and frontend consumers — each of which benefits from automated case conversion.
            </p>
            <p>
              When renaming across an entire project, it is critical to update all references simultaneously and verify with type checking. TypeScript&apos;s rename symbol feature handles single-language refactoring, but cross-language changes (Python backend, TypeScript frontend) require separate passes. Always run the full test suite after a convention migration — automated renaming tools cannot distinguish between semantically meaningful naming (an API field contract) and internal variable naming that has no external effect. For generating and testing the regular expressions that drive these automated migrations, the <Link href="/regex-tester" className="text-blue-600 hover:underline dark:text-blue-400">Regex Tester</Link> provides live feedback to ensure your patterns match exactly the intended identifiers without false positives.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Case Conversion" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Search", title: "Regex Tester", description: "Test regular expressions with live matching and capture groups", href: "/regex-tester" },
              { icon: "FileText", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
              { icon: "Link", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
              { icon: "Hash", title: "Number Base Converter", description: "Convert numbers between binary, octal, decimal, and hexadecimal", href: "/number-base-converter" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="case-converter" />
    </>
  );
}
