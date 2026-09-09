"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { searchProducts } from "@/data/products";
import { useSearchOverlay } from "@/context/SearchContext";
import { useRecentSearches } from "@/lib/useRecentSearches";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { formatPrice, cn } from "@/lib/utils";

const POPULAR_SEARCHES = [
  "T-Shirts",
  "Sneakers",
  "Sarees",
  "Sunglasses",
  "Skincare",
  "Handbags",
];

export default function SearchOverlay() {
  const { isOpen, close } = useSearchOverlay();
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { recent, addSearch, clearSearches } = useRecentSearches();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setQuery("");
    close();
  }, [close]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  const results = useMemo(() => searchProducts(query).slice(0, 8), [query]);

  if (!isOpen) return null;

  const submitSearch = (q: string) => {
    if (!q.trim()) return;
    addSearch(q);
    handleClose();
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="border-b border-neutral-200">
        <div className="container-nova flex h-16 items-center gap-3 lg:h-20">
          <Search size={20} className="shrink-0 text-neutral-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch(query)}
            placeholder="Search for products, brands and categories..."
            className="h-full flex-1 border-0 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
            aria-label="Search products"
          />
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="shrink-0 rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="container-nova flex-1 overflow-y-auto py-6">
        {query.trim() ? (
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {results.length} result{results.length !== 1 && "s"}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={() => submitSearch(product.name)}
                  className="group flex flex-col gap-2"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="line-clamp-1 text-sm font-medium text-neutral-900">
                      {product.name}
                    </p>
                    <p className="text-sm text-neutral-500">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
            {results.length === 0 && (
              <p className="py-10 text-center text-sm text-neutral-500">
                No products found for &ldquo;{query}&rdquo;.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {recent.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Recent Searches
                  </p>
                  <button
                    type="button"
                    onClick={clearSearches}
                    className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => submitSearch(term)}
                      className={cn(
                        "rounded-full border border-neutral-200 px-3.5 py-1.5 text-sm text-neutral-700 hover:border-neutral-900"
                      )}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => submitSearch(term)}
                    className="rounded-full border border-neutral-200 px-3.5 py-1.5 text-sm text-neutral-700 hover:border-neutral-900"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
