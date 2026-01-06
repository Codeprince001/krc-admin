// Giving
export type GivingType = "TITHE" | "OFFERING" | "DONATION" | "BUILDING_FUND" | "MISSIONS" | "OTHER";

export interface Giving {
  id: string;
  userId: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  amount: number;
  type: GivingType;
  paymentMethod: string;
  reference: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGivingRequest {
  userId: string;
  amount: number;
  type: GivingType;
  paymentMethod: string;
  reference: string;
  notes?: string;
}

export interface UpdateGivingRequest {
  amount?: number;
  type?: GivingType;
  notes?: string;
}

export interface GivingResponse {
  data: Giving[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Payments
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY" | "OTHER";

export interface Payment {
  id: string;
  userId: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  reference: string;
  transactionId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentsResponse {
  data: Payment[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Orders
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  id: string;
  bookId: string;
  book?: {
    id: string;
    title: string;
    price: number;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress?: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  shippingAddress?: string;
}

export interface OrdersResponse {
  data: Order[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

