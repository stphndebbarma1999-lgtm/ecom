"use server";

import { revalidatePath } from "next/cache";
import { updateHomepageContent } from "@/lib/db/homepage";
import type { HomepageContent, FeaturedCategory } from "@/types/homepage";

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Parses "Name|href|ImageURL" lines. */
function parseFeaturedCategories(value: FormDataEntryValue | null): FeaturedCategory[] {
  return lines(value).map((line) => {
    const [name, href, image] = line.split("|").map((s) => s.trim());
    return { name: name || "", href: href || "/", image: image || "" };
  });
}

export async function updateHomepageAction(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const get = (name: string) => String(formData.get(name) ?? "").trim();

  const content: HomepageContent = {
    hero: {
      images: lines(formData.get("heroImages")).slice(0, 6),
    },
    midBanner: {
      image: get("midBannerImage"),
      href: get("midBannerHref") || "/",
    },
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
    featuredCategories: parseFeaturedCategories(formData.get("featuredCategories")),
  };

  try {
    await updateHomepageContent(content);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save homepage content." };
  }

  revalidatePath("/");
  return { success: true };
}
