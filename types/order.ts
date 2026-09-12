export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type DeliveryMethod = "standard" | "express";
export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed" | "cod";

export interface OrderShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  brand: string;
  image: string;
  price: number;
  color?: string;
  size?: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: OrderShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paytmOrderId?: string;
  paytmTxnId?: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: OrderShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paytmOrderId?: string;
  paytmTxnId?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  items: {
    productId: string | null;
    productName: string;
    brand: string;
    image: string;
    price: number;
    color?: string;
    size?: string;
    quantity: number;
  }[];
}
