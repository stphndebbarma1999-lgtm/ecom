"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "@/lib/db/orders";
import type { OrderStatus } from "@/types/order";

export async function updateOrderStatusAction(orderId: string, formData: FormData) {
  const status = String(formData.get("status") ?? "") as OrderStatus;
  const validStatuses: OrderStatus[] = ["Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) return;

  await updateOrderStatus(orderId, status);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
