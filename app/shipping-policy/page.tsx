import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Shipping Policy | ${siteConfig.name}`,
};

export default function ShippingPolicyPage() {
  return (
    <div className="container-nova max-w-3xl py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shipping Policy" }]} />
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Shipping Policy
      </h1>
      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-neutral-600">
        <p>Free standard shipping on all orders above ₹999. Orders below that qualify for a flat ₹99 shipping fee.</p>
        <p>Standard delivery takes 3–7 business days. Express delivery (₹149) arrives within 1–2 business days.</p>
        <p>Once your order ships, you&apos;ll receive a tracking link by email and SMS.</p>
      </div>
    </div>
  );
}
