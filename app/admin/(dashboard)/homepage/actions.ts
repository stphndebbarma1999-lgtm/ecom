"use server";

import { revalidatePath } from "next/cache";
import { getHomepageContent, updateHomepageContent } from "@/lib/db/homepage";
import type { HomepageContent, FloatingProductCard, FeaturedCategory } from "@/types/homepage";

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Parses "Name|Price|ImageURL" lines, keeping each card's positioning class from the existing content by index. */
function parseFloatingCards(
  value: FormDataEntryValue | null,
  existing: FloatingProductCard[]
): FloatingProductCard[] {
  return lines(value).map((line, i) => {
    const [name, priceStr, image] = line.split("|").map((s) => s.trim());
    return {
      name: name || `Card ${i + 1}`,
      price: Number(priceStr) || 0,
      image: image || "",
      className: existing[i]?.className ?? "top-[10%] left-[-8%]",
    };
  });
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

  const current = await getHomepageContent();

  const content: HomepageContent = {
    hero: {
      eyebrow: get("eyebrow"),
      heading: [get("headingLine1"), get("headingLine2")].filter(Boolean),
      subtitle: get("subtitle"),
      primaryCta: { label: get("primaryCtaLabel"), href: get("primaryCtaHref") },
      secondaryCta: { label: get("secondaryCtaLabel"), href: get("secondaryCtaHref") },
      socialProof: get("socialProof"),
      image: get("heroImage"),
      floatingCards: parseFloatingCards(formData.get("floatingCards"), current.hero.floatingCards),
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

  if (!content.hero.eyebrow || content.hero.heading.length === 0) {
    return { error: "Hero eyebrow and at least one heading line are required." };
  }

  try {
    await updateHomepageContent(content);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save homepage content." };
  }

  revalidatePath("/");
  return { success: true };
}
