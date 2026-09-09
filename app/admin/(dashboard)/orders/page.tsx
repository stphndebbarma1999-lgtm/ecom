import Link from "next/link";
import { listOrders } from "@/lib/db/orders";
import { formatPrice, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  Processing: "bg-neutral-100 text-neutral-700",
  Shipped: "bg-orange-50 text-accent",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

const paymentStatusColor: Record<string, string> = {
  paid: "text-emerald-700",
  pending: "text-neutral-500",
  failed: "text-red-600",
  cod: "text-neutral-500",
};

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Orders</h1>
      <p className="mt-1 text-sm text-neutral-500">{orders.length} total</p>

      <div className="mt-6 overflow-x-auto border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-neutral-900 hover:underline">
                    #{order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {order.customerName}
                  <span className="block text-xs text-neutral-400">{order.customerEmail}</span>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-semibold",
                      statusColor[order.status]
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                <td className={cn("px-4 py-3 text-xs font-semibold capitalize", paymentStatusColor[order.paymentStatus])}>
                  {order.paymentStatus}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">{formatPrice(order.total)}</td>
                <td className="px-4 py-3 text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-neutral-400">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
