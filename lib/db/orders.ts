import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { CreateOrderInput, Order, OrderItem, OrderStatus } from "@/types/order";

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: Order["shippingAddress"];
  delivery_method: Order["deliveryMethod"];
  payment_method: Order["paymentMethod"];
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  created_at: string;
}

interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  brand: string;
  image: string | null;
  price: number;
  color: string | null;
  size: string | null;
  quantity: number;
}

function mapItemRow(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    brand: row.brand,
    image: row.image ?? "",
    price: Number(row.price),
    color: row.color ?? undefined,
    size: row.size ?? undefined,
    quantity: row.quantity,
  };
}

function mapOrderRow(row: OrderRow, items: OrderItemRow[]): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone ?? undefined,
    shippingAddress: row.shipping_address,
    deliveryMethod: row.delivery_method,
    paymentMethod: row.payment_method,
    status: row.status,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    total: Number(row.total),
    createdAt: row.created_at,
    items: items.map(mapItemRow),
  };
}

function generateOrderNumber(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `NOVA${random}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const supabase = getSupabaseAdmin();

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone || null,
      shipping_address: input.shippingAddress,
      delivery_method: input.deliveryMethod,
      payment_method: input.paymentMethod,
      subtotal: input.subtotal,
      discount: input.discount,
      shipping: input.shipping,
      total: input.total,
    })
    .select()
    .single();

  if (orderError) throw orderError;
  const order = orderRow as unknown as OrderRow;

  const { data: itemRows, error: itemsError } = await supabase
    .from("order_items")
    .insert(
      input.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        brand: item.brand,
        image: item.image || null,
        price: item.price,
        color: item.color || null,
        size: item.size || null,
        quantity: item.quantity,
      }))
    )
    .select();

  if (itemsError) {
    // best-effort compensation: don't leave an orphaned order with no items
    await supabase.from("orders").delete().eq("id", order.id);
    throw itemsError;
  }

  return mapOrderRow(order, (itemRows as unknown as OrderItemRow[]) ?? []);
}

export async function listOrders(): Promise<Order[]> {
  const supabase = getSupabaseAdmin();
  const { data: orderRows, error } = await supabase
    .from("orders")
    .select()
    .order("created_at", { ascending: false });

  if (error) throw error;
  const orders = (orderRows as unknown as OrderRow[]) ?? [];
  if (orders.length === 0) return [];

  const { data: itemRows, error: itemsError } = await supabase
    .from("order_items")
    .select()
    .in(
      "order_id",
      orders.map((o) => o.id)
    );

  if (itemsError) throw itemsError;
  const items = (itemRows as unknown as OrderItemRow[]) ?? [];
  const itemsByOrder = new Map<string, OrderItemRow[]>();
  for (const item of items) {
    const list = itemsByOrder.get(item.order_id) ?? [];
    list.push(item);
    itemsByOrder.set(item.order_id, list);
  }

  return orders.map((order) => mapOrderRow(order, itemsByOrder.get(order.id) ?? []));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = getSupabaseAdmin();
  const { data: orderRow, error } = await supabase
    .from("orders")
    .select()
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!orderRow) return null;

  const { data: itemRows, error: itemsError } = await supabase
    .from("order_items")
    .select()
    .eq("order_id", id);

  if (itemsError) throw itemsError;

  return mapOrderRow(
    orderRow as unknown as OrderRow,
    (itemRows as unknown as OrderItemRow[]) ?? []
  );
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}
