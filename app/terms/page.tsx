import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms of Service | ${siteConfig.name}`,
};

export default function TermsPage() {
  return (
    <div className="container-nova max-w-3xl py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Terms of Service
      </h1>
      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-neutral-600">
        <p>
          By using the {siteConfig.name} website, you agree to purchase products for personal use
          and to provide accurate information when placing an order.
        </p>
        <p>
          Product prices, availability and promotions are subject to change without prior notice.
          All prices are listed in Indian Rupees ({siteConfig.currency.symbol}).
        </p>
        <p>
          {siteConfig.name} reserves the right to cancel any order suspected of fraud or abuse of
          our return policy.
        </p>
      </div>
    </div>
  );
}
