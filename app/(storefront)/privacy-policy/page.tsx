import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-nova max-w-3xl py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Privacy Policy
      </h1>
      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-neutral-600">
        <p>
          {siteConfig.name} collects only the information needed to process your orders and
          improve your shopping experience, including your name, contact details and shipping
          address.
        </p>
        <p>
          We never sell your personal information to third parties. Payment details are handled
          securely and are not stored on our servers.
        </p>
        <p>
          For any privacy-related questions, contact us at {siteConfig.contact.email}.
        </p>
      </div>
    </div>
  );
}
