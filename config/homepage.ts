import type { HomepageContent } from "@/types/homepage";

/**
 * Default/fallback homepage content — used only if no row exists yet in the
 * homepage_content table (i.e. before the first admin save). Once an admin
 * saves changes at /admin/homepage, the database row takes over and this
 * file is no longer read at runtime; see lib/db/homepage.ts.
 */
export const defaultHomepageContent: HomepageContent = {
  hero: {
    slides: [],
  },

  midBannerSlides: [],

  banners: {
    flashSale: {
      label: "Flash Sale",
      heading: "Up To 70% Off",
      cta: { label: "Shop Sale Now", href: "/best-sellers" },
      image: "",
      endsAt: "",
    },
    newCollection: {
      label: "New Collection",
      heading: "Season Essentials",
      cta: { label: "Shop Collection", href: "/new-arrivals" },
      image: "",
    },
  },

  featuredCategories: [
    { name: "Men", href: "/men", image: "" },
    { name: "Women", href: "/women", image: "" },
    { name: "Footwear", href: "/women/footwear", image: "" },
    { name: "Beauty", href: "/beauty", image: "" },
    { name: "Watches", href: "/men/watches", image: "" },
    { name: "Handbags", href: "/women/handbags", image: "" },
    { name: "Activewear", href: "/women/activewear", image: "" },
    { name: "Sunglasses", href: "/men/sunglasses", image: "" },
  ],
};
