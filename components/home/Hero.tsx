import { getHomepageContent } from "@/lib/db/homepage";
import { siteConfig } from "@/config/site";
import HeroSlider from "@/components/home/HeroSlider";

/**
 * Fills the viewport below the (in-flow, sticky) announcement bar + header:
 * 36px announcement + 56px mobile header below lg, 36px + 80px desktop
 * header at lg and up. See AnnouncementBar/MobileHeader/Header for those
 * heights.
 */
export default async function Hero() {
  const { hero } = await getHomepageContent();

  return (
    <section className="h-[calc(100svh-92px)] w-full lg:h-[calc(100vh-116px)]">
      <HeroSlider images={hero.images} alt={`${siteConfig.name} collection`} />
    </section>
  );
}
