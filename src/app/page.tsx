import { HeroSection } from "@/components/hero-section";
import { FeaturedTools } from "@/components/featured-tools";
import { ToolCategories } from "@/components/tool-categories";
import { LatestTools } from "@/components/latest-tools";
import { FaqSection } from "@/components/faq-section";
import { RecentlyViewed } from "@/components/shared/recently-viewed";
import { SearchSuggestions } from "@/components/shared/search-suggestions";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="mx-auto max-w-5xl px-4 pb-6 sm:px-6">
        <SearchSuggestions />
      </div>
      <RecentlyViewed />
      <FeaturedTools />
      <ToolCategories />
      <LatestTools />
      <FaqSection />
    </>
  );
}
