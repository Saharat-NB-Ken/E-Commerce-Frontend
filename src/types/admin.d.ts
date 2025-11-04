export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface User {
  id: number;
  name: string;
  email: string;
}

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
  paidAt?: string | null;
}


export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user: User;
  payment?: Payment | null;
  isDeleted: boolean;
}

export interface PaginatedResponse {
  data: [];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}



