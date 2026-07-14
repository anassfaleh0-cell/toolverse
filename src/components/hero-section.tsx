import { SearchBox } from "@/components/search-box";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-36">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
          Discover the Best{" "}
          <span className="text-zinc-500 dark:text-zinc-300">Online Tools</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300 sm:text-xl">
          Curated tools for developers, designers, and creators. Free, fast, and
          built to supercharge your productivity.
        </p>
        <div className="mt-10">
          <SearchBox />
        </div>
        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-300">
          Trusted by thousands. 80+ tools across 6 categories.
        </p>
      </div>
    </section>
  );
}
