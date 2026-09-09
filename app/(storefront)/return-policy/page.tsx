import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Return Policy | ${siteConfig.name}`,
};

export default function ReturnPolicyPage() {
  return (
    <div className="container-nova max-w-3xl py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Return Policy" }]} />
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Return Policy
      </h1>
      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-neutral-600">
        <p>We offer a 30-day hassle-free return window on unused items with original tags attached.</p>
        <p>To initiate a return, visit your Orders page in Account or contact {siteConfig.contact.email}.</p>
        <p>Refunds are processed within 5–7 business days of us receiving the returned item.</p>
      </div>
    </div>
  );
}
