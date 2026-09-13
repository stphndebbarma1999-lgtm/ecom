/**
 * Central brand/site configuration.
 * Change brand name, logo, contact info, socials and currency here only —
 * every component reads from this file instead of hardcoding brand details.
 */

export const siteConfig = {
  name: "Drapesly",
  tagline: "Style, curated.",
  description:
    "Drapesly is a premium fashion, footwear and beauty destination — curated collections for men, women and everyday beauty essentials.",
  url: "https://www.drapesly.example",

  logo: {
    text: "Drapesly",
  },

  contact: {
    email: "drapeslysupport@gmail.com",
    hours: "Mon – Sat, 10:00 AM – 7:00 PM IST",
    address: "Drapesly Retail HQ, Bengaluru, Karnataka, India",
  },

  social: {
    instagram: "https://instagram.com/drapesly",
    facebook: "https://facebook.com/drapesly",
    youtube: "https://youtube.com/@drapesly",
  },

  currency: {
    code: "INR",
    symbol: "₹",
  },
} as const;

export type SiteConfig = typeof siteConfig;
