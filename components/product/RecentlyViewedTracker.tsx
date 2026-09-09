"use client";

import { useEffect } from "react";
import { trackRecentlyViewed } from "@/lib/useRecentlyViewed";

export default function RecentlyViewedTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackRecentlyViewed(productId);
  }, [productId]);

  return null;
}
