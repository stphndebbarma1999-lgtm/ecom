import "server-only";
import { cache } from "react";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { defaultHomepageContent } from "@/config/homepage";
import type { HomepageContent } from "@/types/homepage";

const ROW_ID = "default";

/**
 * Hero, CategorySection and PromoBanners each call this independently —
 * cache() dedupes those into a single DB round-trip per request instead of
 * three, since they all run within the same render pass.
 */
/**
 * Normalizes rows saved before the hero became a text-free full-screen
 * slider: those rows have `hero.image` (a single string, from the very
 * first version) or a `hero.images` array plus now-removed text/CTA/
 * floating-card fields. Also migrates the single-image `midBanner` object
 * (from before it became a slider) into the `midBannerSlides` array.
 */
function normalize(content: HomepageContent): HomepageContent {
  const hero = content.hero as HomepageContent["hero"] & { image?: string };
  const images = Array.isArray(hero.images) ? hero.images : hero.image ? [hero.image] : [];

  const legacyMidBanner = (content as unknown as { midBanner?: { image?: string; href?: string } })
    .midBanner;
  const midBannerSlides = Array.isArray(content.midBannerSlides)
    ? content.midBannerSlides
    : legacyMidBanner?.image
      ? [{ image: legacyMidBanner.image, href: legacyMidBanner.href || "/" }]
      : [];

  return {
    ...content,
    hero: { images },
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
