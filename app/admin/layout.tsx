import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `Admin | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name} Admin`,
  },
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Separate root layout for everything under /admin — deliberately does not
 * nest inside app/(storefront)/layout.tsx, so the admin panel never renders
 * the storefront's announcement bar, header, footer, or mobile nav, and
 * never pulls in cart/wishlist/search/customer-auth context it doesn't use.
 */
export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
