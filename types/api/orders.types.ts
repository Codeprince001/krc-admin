// Orders Types
export type OrderStatus = 
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "READY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type DeliveryType = "PICKUP" | "DELIVERY" | "HOME_DELIVERY";

export type PaymentStatus = "PENDING" | "PAID" | "SUCCESSFUL" | "FAILED" | "REFUNDED";

export type PaymentMethod = "PAYSTACK" | "BANK_TRANSFER" | "CASH" | "OTHER";

export interface OrderItem {
  id: string;
  bookId: string;
  book: {
    id: string;
    title: string;
    author: string;
    coverImage?: string;
    isDigital: boolean;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phoneNumber: string | null;
  };
  status: OrderStatus;
  deliveryType: DeliveryType;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  recipientName?: string;
  recipientPhone?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentRef?: string;
  paidAt?: string;
  customerNotes?: string;
  adminNotes?: string;
  trackingNote?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  items: OrderItem[];
  auditLogs?: OrderAuditLog[];
}

export interface OrderAuditLog {
  id: string;
  orderId: string;
  action: string;
  previousValue?: string;
  newValue?: string;
  note?: string;
  performedBy?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  createdAt: string;
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

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  adminNotes?: string;
  trackingNote?: string;
  cancellationReason?: string;
  notifyCustomer?: boolean;
}

export interface ProcessPaymentRequest {
  paymentMethod: PaymentMethod;
  paymentRef: string;
}

export interface QueryOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  deliveryType?: DeliveryType;
  search?: string;
}

