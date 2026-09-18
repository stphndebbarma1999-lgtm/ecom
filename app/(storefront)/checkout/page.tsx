"use client";

import { useState } from "react";
import { CheckCircle2, Truck, Zap, Smartphone, CreditCard, Landmark } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import CartSummary from "@/components/cart/CartSummary";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";

type DeliveryOption = "standard" | "express";
type PaymentOption = "upi" | "card" | "netbanking";

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load payment script."));
    document.body.appendChild(script);
  });
}

const deliveryOptions: { value: DeliveryOption; label: string; desc: string; icon: typeof Truck }[] = [
  { value: "standard", label: "Standard Delivery", desc: "3–7 business days · Free", icon: Truck },
  { value: "express", label: "Express Delivery", desc: "1–2 business days · ₹149", icon: Zap },
];

const paymentOptions: { value: PaymentOption; label: string; icon: typeof Smartphone }[] = [
  { value: "upi", label: "UPI", icon: Smartphone },
  { value: "card", label: "Debit / Credit Card", icon: CreditCard },
  { value: "netbanking", label: "Net Banking", icon: Landmark },
];

function FormSection({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-neutral-200 p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-900">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[11px] text-white">
          {step}
        </span>
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-neutral-700">{label}</span>
      <input
        {...props}
        className="border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900"
      />
    </label>
  );
}

function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [delivery, setDelivery] = useState<DeliveryOption>("standard");
  const [payment, setPayment] = useState<PaymentOption>("upi");
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = delivery === "express" ? 149 : subtotal >= 999 || subtotal === 0 ? 0 : 59;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const get = (name: string) => String(formData.get(name) ?? "").trim();

    const customerName = get("fullName");
    const customerEmail = get("email");
    const shippingAddress = {
      fullName: customerName,
      phone: get("shippingPhone"),
      address: get("address"),
      apartment: get("apartment") || undefined,
      city: get("city"),
      state: get("state"),
      pinCode: get("pinCode"),
    };

    try {
      const createRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          })),
          deliveryMethod: delivery,
          paymentMethod: payment,
          customerName,
          customerEmail,
          customerPhone: shippingAddress.phone,
          shippingAddress,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) {
        setError(createData.error ?? "Could not start payment. Please try again.");
        setSubmitting(false);
        return;
      }

      await loadScript(createData.checkoutJsUrl);

      if (!window.Razorpay) {
        setError("Payment gateway failed to load. Please refresh and try again.");
        setSubmitting(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: createData.keyId,
        amount: createData.amount,
        currency: createData.currency,
        name: siteConfig.name,
        order_id: createData.razorpayOrderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: shippingAddress.phone,
        },
        theme: { color: "#171717" },
        // Fires once Razorpay's own checks pass and hands back a signature.
        // That signature is the proof of payment — it can only have been
        // produced with the merchant key secret — so this is what our
        // server actually verifies below.
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              setError(verifyData.error ?? "Payment could not be confirmed.");
              setSubmitting(false);
              return;
            }
            setOrderNumber(verifyData.orderNumber ?? null);
            clearCart();
            setPlaced(true);
          } catch {
            setError(
              "Payment may have succeeded but we couldn't confirm it. Please check your email or contact support."
            );
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });
      razorpay.open();
    } catch {
      setError("Could not reach the server. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <div className="container-nova flex flex-col items-center justify-center gap-4 py-24 text-center">
        <CheckCircle2 size={40} className="text-emerald-600" />
        <h1 className="text-2xl font-semibold text-neutral-900">Order Placed!</h1>
        {orderNumber && (
          <p className="text-sm font-medium text-neutral-900">Order #{orderNumber}</p>
        )}
        <p className="max-w-sm text-sm text-neutral-500">
          Thank you for shopping with us. A confirmation has been sent to your email — your order
          is being prepared for shipping.
        </p>
        <Button href="/" variant="primary" size="md" className="mt-2">
          Back to Home
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-nova flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-sm font-medium text-neutral-900">Your cart is empty</p>
        <Button href="/new-arrivals" variant="primary" size="md">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container-nova py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <FormSection step={1} title="Contact Information">
            <Field label="Email" type="email" name="email" required placeholder="you@example.com" />
          </FormSection>

          <FormSection step={2} title="Shipping Address">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" name="fullName" required />
              <Field label="Phone" type="tel" name="shippingPhone" required />
            </div>
            <Field label="Address" name="address" required />
            <Field label="Apartment / Landmark (optional)" name="apartment" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="City" name="city" required />
              <Field label="State" name="state" required />
              <Field label="PIN Code" name="pinCode" required inputMode="numeric" />
            </div>
          </FormSection>

          <FormSection step={3} title="Delivery">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {deliveryOptions.map((option) => {
                const Icon = option.icon;
                const selected = delivery === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDelivery(option.value)}
                    className={cn(
                      "flex items-start gap-3 border p-4 text-left",
                      selected ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-400"
                    )}
                  >
                    <Icon size={18} className="mt-0.5 shrink-0 text-neutral-700" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{option.label}</p>
                      <p className="text-xs text-neutral-500">{option.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </FormSection>

          <FormSection step={4} title="Payment">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                const selected = payment === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPayment(option.value)}
                    className={cn(
                      "flex items-center gap-3 border p-4 text-left",
                      selected ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-400"
                    )}
                  >
                    <Icon size={18} className="shrink-0 text-neutral-700" />
                    <span className="text-sm font-medium text-neutral-900">{option.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-neutral-400">
              You&apos;ll complete payment securely via Razorpay.
            </p>
          </FormSection>
        </div>

        <div className="flex flex-col gap-4 border border-neutral-200 p-5 lg:sticky lg:top-24 lg:h-fit">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
            Order Summary
          </h2>
          <div className="flex flex-col gap-3 divide-y divide-neutral-100 text-sm">
            {items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between gap-3 pt-3 first:pt-0">
                <span className="text-neutral-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium text-neutral-900">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          <CartSummary subtotal={subtotal} shipping={shipping} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return <CheckoutForm />;
}
