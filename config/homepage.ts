import type { HomepageContent } from "@/types/homepage";

/**
 * Default/fallback homepage content — used only if no row exists yet in the
 * homepage_content table (i.e. before the first admin save). Once an admin
 * saves changes at /admin/homepage, the database row takes over and this
 * file is no longer read at runtime; see lib/db/homepage.ts.
 */
export const defaultHomepageContent: HomepageContent = {
  hero: {
    eyebrow: "Trending Now",
    heading: ["Discover Style", "You'll Love"],
    subtitle:
      "Shop the latest fashion, footwear, accessories and beauty essentials curated for modern lifestyles.",
    primaryCta: { label: "Shop Now", href: "/new-arrivals" },
    secondaryCta: { label: "Explore Collection", href: "/best-sellers" },
    socialProof: "Loved by 50,000+ customers",
    image: "",
    floatingCards: [
      {
        name: "Sports Sneakers",
        price: 3499,
        image: "",
        className: "top-[8%] left-[-6%] md:left-[-8%]",
      },
      {
        name: "Classic Watch",
        price: 4999,
        image: "",
        className: "top-[4%] right-[-4%] md:right-[-6%]",
      },
      {
        name: "Wireless Earbuds",
        price: 2299,
        image: "",
        className: "top-[42%] left-[-10%] md:left-[-12%]",
      },
      {
        name: "Aviator Sunglasses",
        price: 1899,
        image: "",
        className: "bottom-[10%] right-[-6%] md:right-[-8%]",
      },
    ],
  },

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
