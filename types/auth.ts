export interface AuthUser {
  name: string;
  email: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered";
  total: number;
  itemCount: number;
}
