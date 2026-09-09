import type { NextConfig } from "next";

/**
 * All product/category/banner imagery is hosted on Sirv (https://my.sirv.com/).
 * remotePatterns whitelists the Sirv CDN domains so next/image can optimize
 * remote URLs without disabling optimization altogether.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.sirv.com",
      },
      {
        protocol: "https",
        hostname: "sirv.com",
      },
    ],
  },
};

export default nextConfig;
