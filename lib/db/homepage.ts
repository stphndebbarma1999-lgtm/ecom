import "server-only";
import { cache } from "react";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { defaultHomepageContent } from "@/config/homepage";
import type { HomepageContent, HeroSlide, BannerSlide } from "@/types/homepage";

const ROW_ID = "default";

/**
 * Hero, CategorySection and PromoBanners each call this independently —
 * cache() dedupes those into a single DB round-trip per request instead of
 * three, since they all run within the same render pass.
 */
/**
 * Normalizes rows saved before hero/banner slides had separate desktop and
 * mobile photos. Handles every shape this table has ever stored:
 *  - hero.image (single string, the very first version)
 *  - hero.images (string[], one photo per slide, same photo on every device)
 *  - hero.slides ({desktop, mobile}[]) — current shape
 *  - midBanner ({image, href}) — single banner, pre-slider
 *  - midBannerSlides ({image, href}[]) — one photo per slide, pre-desktop/mobile
 *  - midBannerSlides ({desktop, mobile, href}[]) — current shape
 */
function normalize(content: HomepageContent): HomepageContent {
  const hero = content.hero as HomepageContent["hero"] & { images?: string[]; image?: string };
  let slides: HeroSlide[];
  if (Array.isArray(hero.slides)) {
    slides = hero.slides;
  } else if (Array.isArray(hero.images)) {
    slides = hero.images.map((url) => ({ desktop: url, mobile: url }));
  } else {
    slides = hero.image ? [{ desktop: hero.image, mobile: hero.image }] : [];
  }

  const legacyMidBanner = (content as unknown as { midBanner?: { image?: string; href?: string } })
    .midBanner;
  const rawMidBannerSlides = content.midBannerSlides as unknown as
    | { desktop?: string; mobile?: string; image?: string; href?: string }[]
    | undefined;

  let midBannerSlides: BannerSlide[];
  if (Array.isArray(rawMidBannerSlides)) {
    midBannerSlides = rawMidBannerSlides.map((s) => ({
      desktop: s.desktop ?? s.image ?? "",
      mobile: s.mobile ?? s.image ?? "",
      href: s.href || "/",
    }));
  } else if (legacyMidBanner?.image) {
    midBannerSlides = [
      { desktop: legacyMidBanner.image, mobile: legacyMidBanner.image, href: legacyMidBanner.href || "/" },
    ];
  } else {
    midBannerSlides = [];
  }

  return {
    ...content,
    hero: { slides },
    midBannerSlides,
  };
}

export const getHomepageContent = cache(async (): Promise<HomepageContent> => {
  const { data, error } = await getSupabaseAdmin()
    .from("homepage_content")
    .select("content")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error) throw error;
  return normalize(data ? (data.content as HomepageContent) : defaultHomepageContent);
});

export async function updateHomepageContent(content: HomepageContent): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("homepage_content")
    .upsert({ id: ROW_ID, content, updated_at: new Date().toISOString() });

  if (error) throw error;
}
