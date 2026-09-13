export interface FeaturedCategory {
  name: string;
  href: string;
  image: string;
}

export interface BannerSlide {
  image: string;
  href: string;
}

export interface HomepageContent {
  hero: {
    images: string[];
  };
  midBannerSlides: BannerSlide[];
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
