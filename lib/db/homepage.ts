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
 * Normalizes rows saved before the hero became a multi-image slider: those
 * rows have `hero.image` (a single string) instead of `hero.images`.
 */
function normalize(content: HomepageContent): HomepageContent {
  const hero = content.hero as HomepageContent["hero"] & { image?: string };
  if (!Array.isArray(hero.images)) {
    return { ...content, hero: { ...hero, images: hero.image ? [hero.image] : [] } };
  }
  return content;
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
