import type { Metadata } from "next";
import { Mail, Phone, Clock } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ContactForm from "@/components/ui/ContactForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description: `Get in touch with the ${siteConfig.name} support team.`,
};

export default function ContactPage() {
  return (
    <div className="container-nova py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Contact Us
      </h1>
      <p className="mt-2 max-w-lg text-sm text-neutral-500">
        Have a question about an order, product or return? Send us a message and our team will
        get back to you.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 shrink-0 text-neutral-700" />
            <div>
              <p className="text-sm font-medium text-neutral-900">Email</p>
              <p className="text-sm text-neutral-500">{siteConfig.contact.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="mt-0.5 shrink-0 text-neutral-700" />
            <div>
              <p className="text-sm font-medium text-neutral-900">Phone</p>
              <p className="text-sm text-neutral-500">{siteConfig.contact.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={18} className="mt-0.5 shrink-0 text-neutral-700" />
            <div>
              <p className="text-sm font-medium text-neutral-900">Business Hours</p>
              <p className="text-sm text-neutral-500">{siteConfig.contact.hours}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
