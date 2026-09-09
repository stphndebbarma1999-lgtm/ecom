"use client";

import { useEffect, useState } from "react";
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
    let cancelled = false;

    async function load() {
      let ids: string[] = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        ids = raw ? JSON.parse(raw) : [];
      } catch {
        ids = [];
      }

      const filtered = ids.filter((id) => id !== excludeId);
      if (filtered.length === 0) {
        if (!cancelled) setItems([]);
        return;
      }

      try {
        const res = await fetch(`/api/products/by-ids?ids=${filtered.join(",")}`);
        const data = await res.json();
        if (!cancelled) setItems(data.products ?? []);
      } catch {
        if (!cancelled) setItems([]);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [excludeId]);

  return items;
}
