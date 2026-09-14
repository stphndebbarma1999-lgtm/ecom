"use server";

import { revalidatePath } from "next/cache";
import { updateHomepageContent } from "@/lib/db/homepage";
import type { HomepageContent, FeaturedCategory, HeroSlide, BannerSlide } from "@/types/homepage";

/** Reads the per-category Name/Link/Image URL fields rendered by HomepageForm. */
function parseFeaturedCategories(formData: FormData): FeaturedCategory[] {
  const count = Number(formData.get("categoryCount") ?? 0);
  const categories: FeaturedCategory[] = [];
  for (let i = 0; i < count; i++) {
    const name = String(formData.get(`category_${i}_name`) ?? "").trim();
    const href = String(formData.get(`category_${i}_href`) ?? "").trim();
    const image = String(formData.get(`category_${i}_image`) ?? "").trim();
    categories.push({ name, href: href || "/", image });
  }
  return categories;
}

/** Reads the indexed hero_{i}_desktop / hero_{i}_mobile fields rendered by SlideListEditor. */
function parseHeroSlides(formData: FormData): HeroSlide[] {
  const count = Number(formData.get("heroSlideCount") ?? 0);
  const slides: HeroSlide[] = [];
  for (let i = 0; i < count; i++) {
    const desktop = String(formData.get(`hero_${i}_desktop`) ?? "").trim();
    const mobile = String(formData.get(`hero_${i}_mobile`) ?? "").trim();
    if (desktop || mobile) slides.push({ desktop, mobile });
  }
  return slides;
}

/** Reads the indexed banner_{i}_desktop / _mobile / _href fields rendered by SlideListEditor. */
function parseBannerSlides(formData: FormData): BannerSlide[] {
  const count = Number(formData.get("bannerSlideCount") ?? 0);
  const slides: BannerSlide[] = [];
  for (let i = 0; i < count; i++) {
    const desktop = String(formData.get(`banner_${i}_desktop`) ?? "").trim();
    const mobile = String(formData.get(`banner_${i}_mobile`) ?? "").trim();
    const href = String(formData.get(`banner_${i}_href`) ?? "").trim();
    if (desktop || mobile) slides.push({ desktop, mobile, href: href || "/" });
  }
  return slides;
}

export async function updateHomepageAction(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const get = (name: string) => String(formData.get(name) ?? "").trim();

  const content: HomepageContent = {
    hero: {
      slides: parseHeroSlides(formData).slice(0, 6),
    },
    midBannerSlides: parseBannerSlides(formData).slice(0, 6),
    banners: {
      flashSale: {
        label: get("flashSaleLabel"),
        heading: get("flashSaleHeading"),
        cta: { label: get("flashSaleCtaLabel"), href: get("flashSaleCtaHref") },
        image: get("flashSaleImage"),
        endsAt: get("flashSaleEndsAt"),
      },
      newCollection: {
        label: get("newCollectionLabel"),
        heading: get("newCollectionHeading"),
        cta: { label: get("newCollectionCtaLabel"), href: get("newCollectionCtaHref") },
        image: get("newCollectionImage"),
      },
    },
    featuredCategories: parseFeaturedCategories(formData),
  };

  try {
    await updateHomepageContent(content);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save homepage content." };
  }

  revalidatePath("/");
  return { success: true };
}
