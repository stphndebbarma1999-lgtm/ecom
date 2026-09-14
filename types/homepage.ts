export interface FeaturedCategory {
  name: string;
  href: string;
  image: string;
}

export interface HeroSlide {
  desktop: string;
  mobile: string;
}

export interface BannerSlide {
  desktop: string;
  mobile: string;
  href: string;
}

export interface HomepageContent {
  hero: {
    slides: HeroSlide[];
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
