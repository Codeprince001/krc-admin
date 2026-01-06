// Payments Types
export type PaymentStatus = "PENDING" | "PAID" | "SUCCESSFUL" | "FAILED" | "REFUNDED";

export type PaymentMethod = "PAYSTACK" | "BANK_TRANSFER" | "CASH" | "OTHER";

export interface Payment {
  id: string;
  userId: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  amount: number;
  paymentMethod: PaymentMethod;
  paymentRef: string;
  status: PaymentStatus;
  purpose: string;
  referenceId?: string;
  metadata?: string;
  paidAt?: string;
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

export interface PaymentStats {
  totalPayments: number;
  successfulPayments: number;
  totalRevenue: number;
  recentPayments: Payment[];
}

export interface QueryPaymentsParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  search?: string;
}

