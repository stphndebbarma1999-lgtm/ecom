import Link from "next/link";
import { Package, FolderTree, ShoppingCart, IndianRupee } from "lucide-react";
import { listProductsForAdmin } from "@/lib/db/products";
import { listAllCategories } from "@/lib/db/categories";
import { listOrders } from "@/lib/db/orders";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  Processing: "text-neutral-500",
  Shipped: "text-accent",
  Delivered: "text-emerald-600",
  Cancelled: "text-red-600",
};

export default async function AdminDashboardPage() {
  const [{ total: totalProducts }, categories, orders] = await Promise.all([
    listProductsForAdmin({ pageSize: 1 }),
    listAllCategories(),
    listOrders(),
  ]);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "Processing").length;
  const recentOrders = orders.slice(0, 8);

  const stats = [
    { label: "Products", value: totalProducts, icon: Package, href: "/admin/products" },
    { label: "Categories", value: categories.length, icon: FolderTree, href: "/admin/categories" },
    { label: "Orders", value: orders.length, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Revenue", value: formatPrice(revenue), icon: IndianRupee, href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {pendingOrders > 0
          ? `${pendingOrders} order${pendingOrders > 1 ? "s" : ""} awaiting processing.`
          : "All orders are up to date."}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col gap-2 border border-neutral-200 bg-white p-5 hover:border-neutral-900"
          >
            <Icon size={18} className="text-neutral-400" />
            <span className="text-2xl font-semibold text-neutral-900">{value}</span>
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {label}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
            Recent Orders
          </h2>
          <Link href="/admin/orders" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
            View All
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-neutral-900 hover:underline">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{order.customerName}</td>
                  <td className={cn("px-4 py-3 font-medium", statusColor[order.status])}>
                    {order.status}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-900">{formatPrice(order.total)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
