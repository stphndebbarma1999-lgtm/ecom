/**
 * Central brand/site configuration.
 * Change brand name, logo, contact info, socials and currency here only —
 * every component reads from this file instead of hardcoding brand details.
 */

export const siteConfig = {
  name: "NOVA",
  tagline: "Style, curated.",
  description:
    "NOVA is a premium fashion, footwear and beauty destination — curated collections for men, women and everyday beauty essentials.",
  url: "https://www.nova-store.example",

  logo: {
    text: "NOVA",
  },

  contact: {
    email: "support@nova-store.example",
    phone: "+91 98765 43210",
    hours: "Mon – Sat, 10:00 AM – 7:00 PM IST",
    address: "NOVA Retail HQ, Bengaluru, Karnataka, India",
  },

  social: {
    instagram: "https://instagram.com/nova",
    facebook: "https://facebook.com/nova",
    youtube: "https://youtube.com/@nova",
  },

  currency: {
    code: "INR",
    symbol: "₹",
  },
} as const;

export type SiteConfig = typeof siteConfig;
