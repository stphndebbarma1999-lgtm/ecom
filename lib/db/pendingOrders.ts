import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { CreateOrderInput } from "@/types/order";

export type PendingOrderPayload = Omit<
  CreateOrderInput,
  "paymentStatus" | "razorpayOrderId" | "razorpayPaymentId"
>;

export async function createPendingOrder(
  razorpayOrderId: string,
  payload: PendingOrderPayload
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("pending_orders")
    .upsert({ razorpay_order_id: razorpayOrderId, payload });

  if (error) throw error;
}

export async function getPendingOrder(razorpayOrderId: string): Promise<PendingOrderPayload | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("pending_orders")
    .select("payload")
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();

  if (error) throw error;
  return data ? (data.payload as PendingOrderPayload) : null;
}

export async function deletePendingOrder(razorpayOrderId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("pending_orders")
    .delete()
    .eq("razorpay_order_id", razorpayOrderId);

  if (error) throw error;
}
