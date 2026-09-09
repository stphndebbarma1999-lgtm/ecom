import Hero from "@/components/home/Hero";
import BenefitsStrip from "@/components/home/BenefitsStrip";
import CategorySection from "@/components/home/CategorySection";
import NewArrivals from "@/components/home/NewArrivals";
import BestSellers from "@/components/home/BestSellers";
import PromoBanners from "@/components/home/PromoBanners";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BenefitsStrip />
      <CategorySection />
      <NewArrivals />
      <BestSellers />
      <PromoBanners />
    </>
  );
}
