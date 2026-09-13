export interface FeaturedCategory {
  name: string;
  href: string;
  image: string;
}

export interface HomepageContent {
  hero: {
    images: string[];
  };
  midBanner: {
    image: string;
    href: string;
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
