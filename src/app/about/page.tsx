import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about ToolVerse and our mission.",
};

export default function About() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        About ToolVerse
      </h1>
      <div className="mt-8 space-y-6 text-zinc-600 dark:text-zinc-400">
        <p>
          ToolVerse is a curated directory of the best online tools for
          developers, designers, and creators. Our mission is to help you find
          the right tool for the job so you can focus on what matters most:
          building great products.
        </p>
        <p>
          Every tool on ToolVerse is handpicked by our team. We evaluate each
          submission for usability, performance, and value. Whether you need a
          JSON formatter, a color palette generator, or an API tester, ToolVerse
          has you covered.
        </p>
        <p>
          We believe in the power of great tools. The right tool can turn hours
          of work into minutes and turn complex tasks into simple workflows.
          That is why we built ToolVerse: to be your go-to source for discovering
          tools that make a real difference.
        </p>
      </div>
    </section>
  );
}
