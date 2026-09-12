import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/db/orders";
import { formatPrice, cn } from "@/lib/utils";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { updateOrderStatusAction } from "../actions";

export const dynamic = "force-dynamic";

const statuses = ["Processing", "Shipped", "Delivered", "Cancelled"] as const;

const paymentMethodLabel: Record<string, string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net Banking",
  cod: "Cash on Delivery",
};

const paymentStatusColor: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-neutral-100 text-neutral-700",
  failed: "bg-red-50 text-red-700",
  cod: "bg-neutral-100 text-neutral-700",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const boundAction = updateOrderStatusAction.bind(null, order.id);
  const addr = order.shippingAddress;

  return (
    <div className="max-w-3xl">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: `#${order.orderNumber}` },
        ]}
      />
      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Order #{order.orderNumber}</h1>
        <Link href="/admin/orders" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          Back to Orders
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="border border-neutral-200 bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Customer</h2>
          <p className="mt-2 text-sm font-medium text-neutral-900">{order.customerName}</p>
          <p className="text-sm text-neutral-600">{order.customerEmail}</p>
          {order.customerPhone && <p className="text-sm text-neutral-600">{order.customerPhone}</p>}
        </div>

        <div className="border border-neutral-200 bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Shipping Address
          </h2>
          <p className="mt-2 text-sm text-neutral-900">{addr.fullName}</p>
          <p className="text-sm text-neutral-600">{addr.phone}</p>
          <p className="text-sm text-neutral-600">
            {addr.address}
            {addr.apartment ? `, ${addr.apartment}` : ""}
          </p>
          <p className="text-sm text-neutral-600">
            {addr.city}, {addr.state} - {addr.pinCode}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Payment</h2>
          <p className="mt-2 text-sm text-neutral-900">
            {paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}
          </p>
          <span
            className={cn(
              "mt-2 inline-block px-2 py-1 text-xs font-semibold capitalize",
              paymentStatusColor[order.paymentStatus]
            )}
          >
            {order.paymentStatus}
          </span>
          {order.paytmTxnId && (
            <p className="mt-2 truncate text-xs text-neutral-400" title={order.paytmTxnId}>
              {order.paytmTxnId}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 border border-neutral-200 bg-white p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Update Status</h2>
        <form action={boundAction} className="mt-3 flex items-center gap-3">
          <select
            name="status"
            defaultValue={order.status}
            className="border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center bg-neutral-900 px-6 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Update
          </button>
        </form>
      </div>

      <div className="mt-6 border border-neutral-200 bg-white">
        <h2 className="border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Items
        </h2>
        <div className="divide-y divide-neutral-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
              <div>
                <p className="font-medium text-neutral-900">{item.productName}</p>
                <p className="text-xs text-neutral-500">
                  {item.brand}
                  {item.color ? ` · ${item.color}` : ""}
                  {item.size ? ` · ${item.size}` : ""} · Qty {item.quantity}
                </p>
              </div>
              <span className="font-medium text-neutral-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 border-t border-neutral-200 px-5 py-4 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-neutral-600">
              <span>Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-600">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-semibold text-neutral-900">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
