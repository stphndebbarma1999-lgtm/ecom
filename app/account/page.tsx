"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  Heart,
  CreditCard,
  LogOut,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import { cn, formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import type { Order, Address } from "@/types/auth";

const MOCK_ORDERS: Order[] = [
  { id: "NOVA10234", date: "2026-08-28", status: "Delivered", total: 3298, itemCount: 2 },
  { id: "NOVA10198", date: "2026-08-12", status: "Shipped", total: 1899, itemCount: 1 },
  { id: "NOVA10142", date: "2026-07-30", status: "Processing", total: 5499, itemCount: 3 },
];

const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    fullName: "Jane Doe",
    phone: "+91 98765 43210",
    line1: "221B, MG Road",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560001",
    isDefault: true,
  },
];

type Tab = "profile" | "orders" | "addresses" | "wishlist" | "payments";

const tabs: { value: Tab; label: string; icon: typeof User }[] = [
  { value: "profile", label: "Profile", icon: User },
  { value: "orders", label: "Orders", icon: Package },
  { value: "addresses", label: "Addresses", icon: MapPin },
  { value: "wishlist", label: "Wishlist", icon: Heart },
  { value: "payments", label: "Saved Payments", icon: CreditCard },
];

const statusColor: Record<Order["status"], string> = {
  Delivered: "text-emerald-600",
  Shipped: "text-accent",
  Processing: "text-neutral-500",
};

export default function AccountPage() {
  const { user, hydrated, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const router = useRouter();

  if (hydrated && !user) {
    return (
      <div className="container-nova flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-sm font-medium text-neutral-900">You&apos;re not signed in</p>
        <Button href="/login" variant="primary" size="md">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="container-nova py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Account" }]} />
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        My Account
      </h1>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <aside className="flex shrink-0 flex-row gap-1 overflow-x-auto no-scrollbar lg:w-56 lg:flex-col lg:overflow-visible">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 px-3 py-2.5 text-left text-sm font-medium",
                  tab === t.value
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex shrink-0 items-center gap-2.5 px-3 py-2.5 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <div className="flex-1">
          {tab === "profile" && (
            <div className="max-w-md">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
                Profile
              </h2>
              <div className="mt-4 flex flex-col gap-3 border border-neutral-200 p-5 text-sm">
                <div>
                  <p className="text-neutral-500">Name</p>
                  <p className="font-medium text-neutral-900">{user?.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Email</p>
                  <p className="font-medium text-neutral-900">{user?.email ?? "—"}</p>
                </div>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
                Orders
              </h2>
              <div className="mt-4 flex flex-col divide-y divide-neutral-200 border-y border-neutral-200">
                {MOCK_ORDERS.map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-4 py-4 text-sm">
                    <div>
                      <p className="font-medium text-neutral-900">#{order.id}</p>
                      <p className="text-xs text-neutral-500">
                        {order.date} · {order.itemCount} item{order.itemCount > 1 && "s"}
                      </p>
                    </div>
                    <span className={cn("text-xs font-semibold", statusColor[order.status])}>
                      {order.status}
                    </span>
                    <span className="font-medium text-neutral-900">{formatPrice(order.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "addresses" && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
                Addresses
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {MOCK_ADDRESSES.map((addr) => (
                  <div key={addr.id} className="flex flex-col gap-1 border border-neutral-200 p-4 text-sm">
                    <p className="font-medium text-neutral-900">
                      {addr.fullName} {addr.isDefault && <span className="ml-1 text-xs font-normal text-accent">(Default)</span>}
                    </p>
                    <p className="text-neutral-500">{addr.phone}</p>
                    <p className="text-neutral-500">
                      {addr.line1}, {addr.city}, {addr.state} - {addr.pinCode}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
                Wishlist
              </h2>
              <p className="mt-4 text-sm text-neutral-500">
                View and manage your saved items on the{" "}
                <Link href="/wishlist" className="font-medium text-neutral-900 hover:underline">
                  Wishlist page
                </Link>
                .
              </p>
            </div>
          )}

          {tab === "payments" && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
                Saved Payments
              </h2>
              <p className="mt-4 text-sm text-neutral-500">
                No saved payment methods yet. Payment options can be saved during checkout once
                payment gateway integration is enabled.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
