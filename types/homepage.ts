export interface FloatingProductCard {
  name: string;
  price: number;
  image: string;
  className: string;
}

export interface FeaturedCategory {
  name: string;
  href: string;
  image: string;
}

export interface HomepageContent {
  hero: {
    eyebrow: string;
    heading: string[];
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    socialProof: string;
    images: string[];
    floatingCards: FloatingProductCard[];
  };
  banners: {
    flashSale: {
      label: string;
      heading: string;
      cta: { label: string; href: string };
      image: string;
      endsAt: string;
    };
    newCollection: {
      label: string;
      heading: string;
      cta: { label: string; href: string };
      image: string;
    };
  };
  featuredCategories: FeaturedCategory[];
}
