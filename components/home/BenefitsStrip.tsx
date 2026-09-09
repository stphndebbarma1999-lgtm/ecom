import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";

const benefits = [
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
  { icon: ShieldCheck, title: "Secure Payments", desc: "100% secure checkout" },
  { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free return policy" },
  { icon: Headset, title: "24/7 Support", desc: "Always here to help" },
];

export default function BenefitsStrip() {
  return (
    <section className="border-b border-neutral-100">
      <div className="container-nova grid grid-cols-2 gap-6 py-8 sm:grid-cols-4 sm:gap-4 lg:py-10">
        {benefits.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon size={22} strokeWidth={1.5} className="shrink-0 text-neutral-900" />
            <div>
              <p className="text-sm font-semibold text-neutral-900">{title}</p>
              <p className="text-xs text-neutral-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
