"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";
import { siteConfig } from "@/config/site";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/homepage", label: "Homepage", icon: ImageIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-neutral-200 bg-neutral-950 text-white lg:h-screen lg:w-60 lg:sticky lg:top-0">
      <div className="flex items-center gap-2 border-b border-neutral-800 px-5 py-5">
        <span className="text-lg font-bold tracking-tight">{siteConfig.name}</span>
        <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
          Admin
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-white text-neutral-900" : "text-neutral-300 hover:bg-neutral-800"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-neutral-800 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
        >
          <ExternalLink size={16} />
          View Store
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm font-medium text-neutral-300 hover:bg-neutral-800"
          >
            <LogOut size={16} />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
