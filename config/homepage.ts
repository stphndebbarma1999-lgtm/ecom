/**
 * Homepage content configuration.
 * Replace any empty string with a real Sirv URL when available —
 * the ImageWithFallback component renders a neutral placeholder until then.
 */

export interface FloatingProductCard {
  name: string;
  price: number;
  image: string;
  className: string;
}

export const homepageConfig = {
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
    ] satisfies FloatingProductCard[],
  },

  banners: {
    flashSale: {
      label: "Flash Sale",
      heading: "Up To 70% Off",
      cta: { label: "Shop Sale Now", href: "/best-sellers" },
      image: "",
      endsAt: "", // ISO date string, e.g. "2026-12-31T23:59:59"
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
