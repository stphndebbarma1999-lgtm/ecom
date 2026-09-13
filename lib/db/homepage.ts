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
export const getHomepageContent = cache(async (): Promise<HomepageContent> => {
  const { data, error } = await getSupabaseAdmin()
    .from("homepage_content")
    .select("content")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error) throw error;
  return data ? (data.content as HomepageContent) : defaultHomepageContent;
});

export async function updateHomepageContent(content: HomepageContent): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("homepage_content")
    .upsert({ id: ROW_ID, content, updated_at: new Date().toISOString() });

  if (error) throw error;
}
