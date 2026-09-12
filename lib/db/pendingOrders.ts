import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { CreateOrderInput } from "@/types/order";

export type PendingOrderPayload = Omit<
  CreateOrderInput,
  "paymentStatus" | "paytmOrderId" | "paytmTxnId"
>;

export async function createPendingOrder(
  paytmOrderId: string,
  payload: PendingOrderPayload
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("pending_orders")
    .upsert({ paytm_order_id: paytmOrderId, payload });

  if (error) throw error;
}

export async function getPendingOrder(paytmOrderId: string): Promise<PendingOrderPayload | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("pending_orders")
    .select("payload")
    .eq("paytm_order_id", paytmOrderId)
    .maybeSingle();

  if (error) throw error;
  return data ? (data.payload as PendingOrderPayload) : null;
}

export async function deletePendingOrder(paytmOrderId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("pending_orders")
    .delete()
    .eq("paytm_order_id", paytmOrderId);

  if (error) throw error;
}
