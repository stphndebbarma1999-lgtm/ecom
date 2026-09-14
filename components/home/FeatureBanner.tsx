import { getHomepageContent } from "@/lib/db/homepage";
import FeatureBannerSlider from "@/components/home/FeatureBannerSlider";

/** Clickable, auto-rotating banner slider shown just below "Shop by Categories". */
export default async function FeatureBanner() {
  const { midBannerSlides } = await getHomepageContent();
  const slides = midBannerSlides.filter((s) => s.desktop || s.mobile);

  if (slides.length === 0) return null;

  return (
    <section className="py-10 lg:py-14">
      <div className="container-nova">
        <FeatureBannerSlider slides={slides} />
      </div>
    </section>
  );
}
