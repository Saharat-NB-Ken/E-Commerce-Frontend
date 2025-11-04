// types.ts

// -----------------------
// Enum Types
// -----------------------
export type Role = "USER" | "MERCHANT" | "ADMIN";
export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

// -----------------------
// User
// -----------------------
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// -----------------------
// Category
// -----------------------
export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// -----------------------
// Product & ProductImage
// -----------------------
export interface ProductImage {
  id: number;
  productId: number;
  name: string;
  url: string;
  isMain: boolean;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: number;
  category: Category;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------
// Cart & CartItem
// -----------------------
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

// -----------------------
// Orders
// -----------------------
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Payment {
  id: number;
  orderId: number;
  method: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
}

export interface Order {
  id: number;
  userId: number;
  user: User;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment?: Payment;
  isDeleted: boolean;
}

// -----------------------
// Notifications
// -----------------------
export interface NotificationShow {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  createdAt: string;
}

// -----------------------
// Meta & Response Types
// -----------------------
export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
};

export type ProductResponse = {
  data: Product[];
  meta: Meta;
};

export interface RevenuePoint {
  period: string;
  revenue: number;
}