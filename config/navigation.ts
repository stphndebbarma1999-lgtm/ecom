/**
 * Primary navigation + mega menu structure.
 * Kept centralized so header, mobile nav and mega menus all read the same source.
 */

export interface MegaMenuLink {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  heading: string;
  links: MegaMenuLink[];
}

export interface NavItem {
  label: string;
  href: string;
  megaMenu?: {
    columns: MegaMenuColumn[];
    image?: {
      src: string;
      alt: string;
      href: string;
    };
  };
}

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Men",
    href: "/men",
    megaMenu: {
      columns: [
        {
          heading: "Clothing",
          links: [
            { label: "T-Shirts", href: "/men/t-shirts" },
            { label: "Shirts", href: "/men/shirts" },
            { label: "Jackets", href: "/men/jackets" },
            { label: "Jeans", href: "/men/jeans" },
            { label: "Trousers", href: "/men/trousers" },
            { label: "Formal Pants", href: "/men/formal-pants" },
          ],
        },
        {
          heading: "Footwear",
          links: [
            { label: "Casual Shoes", href: "/men/casual-shoes" },
            { label: "Formal Shoes", href: "/men/formal-shoes" },
            { label: "Sports Shoes", href: "/men/sports-shoes" },
          ],
        },
        {
          heading: "Accessories",
          links: [
            { label: "Watches", href: "/men/watches" },
            { label: "Sunglasses", href: "/men/sunglasses" },
          ],
        },
      ],
      image: {
        src: "",
        alt: "Men's collection",
        href: "/men",
      },
    },
  },
  {
    label: "Women",
    href: "/women",
    megaMenu: {
      columns: [
        {
          heading: "Clothing",
          links: [
            { label: "Tops", href: "/women/tops" },
            { label: "Jeans", href: "/women/jeans" },
            { label: "Leggings", href: "/women/leggings" },
            { label: "Kurta Sets", href: "/women/kurta-sets" },
            { label: "Sarees", href: "/women/sarees" },
            { label: "Jumpsuits & More", href: "/women/jumpsuits" },
            { label: "Activewear", href: "/women/activewear" },
          ],
        },
        {
          heading: "Accessories",
          links: [
            { label: "Handbags", href: "/women/handbags" },
            { label: "Sunglasses", href: "/women/sunglasses" },
            { label: "Watches", href: "/women/watches" },
          ],
        },
        {
          heading: "Footwear",
          links: [{ label: "Footwear", href: "/women/footwear" }],
        },
      ],
      image: {
        src: "",
        alt: "Women's collection",
        href: "/women",
      },
    },
  },
  {
    label: "Beauty",
    href: "/beauty",
    megaMenu: {
      columns: [
        {
          heading: "Beauty",
          links: [
            { label: "Skincare", href: "/beauty/skincare" },
            { label: "Haircare", href: "/beauty/haircare" },
            { label: "Makeup", href: "/beauty/makeup" },
            { label: "Fragrance", href: "/beauty/fragrance" },
            { label: "Korean Beauty", href: "/beauty/korean-beauty" },
          ],
        },
        {
          heading: "Devices",
          links: [
            { label: "Hair Styling Devices", href: "/beauty/hair-styling-devices" },
          ],
        },
      ],
      image: {
        src: "",
        alt: "Beauty collection",
        href: "/beauty",
      },
    },
  },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Contact", href: "/contact" },
];

export const mobileBottomNav = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Explore", href: "/new-arrivals", icon: "compass" },
  { label: "Wishlist", href: "/wishlist", icon: "heart" },
  { label: "Cart", href: "/cart", icon: "shopping-bag" },
  { label: "Profile", href: "/account", icon: "user" },
] as const;

export const announcements = [
  "Free Shipping on Orders Above ₹999",
  "Season Sale Up To 70% Off",
  "Limited Time Flash Deals",
];

export const footerLinks = {
  shop: [
    { label: "Men", href: "/men" },
    { label: "Women", href: "/women" },
    { label: "Beauty", href: "/beauty" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Best Sellers", href: "/best-sellers" },
  ],
  customerService: [
    { label: "Contact", href: "/contact" },
    { label: "Shipping", href: "/shipping-policy" },
    { label: "Returns", href: "/return-policy" },
    { label: "FAQ", href: "/contact" },
    { label: "Track Order", href: "/account" },
  ],
  account: [
    { label: "My Account", href: "/account" },
    { label: "Cart", href: "/cart" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Orders", href: "/account" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Return Policy", href: "/return-policy" },
  ],
};
