"use client";

import { useEffect, useState } from "react";
import { products as allProducts } from "@/data/products";
import type { Product } from "@/types/product";

const STORAGE_KEY = "nova.recentlyViewed";
const MAX_ITEMS = 8;

export function trackRecentlyViewed(productId: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const next = [productId, ...ids.filter((id) => id !== productId)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
}

export function useRecentlyViewed(excludeId?: string): Product[] {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const found = ids
        .filter((id) => id !== excludeId)
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount, required to avoid SSR/CSR mismatch
      setItems(found);
    } catch {
      setItems([]);
    }
  }, [excludeId]);

  return items;
}
