import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import FeatureBanner from "@/components/home/FeatureBanner";
import NewArrivals from "@/components/home/NewArrivals";
import BestSellers from "@/components/home/BestSellers";
import PromoBanners from "@/components/home/PromoBanners";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeatureBanner />
      <NewArrivals />
      <BestSellers />
      <PromoBanners />
    </>
  );
}
