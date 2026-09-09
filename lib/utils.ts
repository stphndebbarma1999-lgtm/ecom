import { siteConfig } from "@/config/site";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount: number): string {
  return `${siteConfig.currency.symbol}${Math.round(amount).toLocaleString("en-IN")}`;
}

export function discountPercentage(price: number, originalPrice?: number): number | undefined {
  if (!originalPrice || originalPrice <= price) return undefined;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
