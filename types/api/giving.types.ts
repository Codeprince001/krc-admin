// Giving Types
export type GivingCategory = 
  | "OFFERING"
  | "TITHE"
  | "PARTNERSHIP"
  | "PROJECT"
  | "SEED"
  | "SPECIAL";

export type PaymentMethod = "PAYSTACK" | "BANK_TRANSFER" | "CASH" | "OTHER";
export type PaymentStatus = "PENDING" | "PAID" | "SUCCESSFUL" | "FAILED" | "REFUNDED";

export interface Giving {
  id: string;
  userId: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
  category: GivingCategory;
  amount: number;
  givenDate: string;
  paymentMethod?: PaymentMethod;
  paymentRef?: string;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  notes?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface GivingStats {
  totalAmount: number;
  totalRecords: number;
  byCategory: {
    category: GivingCategory;
    amount: number;
    count: number;
  }[];
  recentRecords: Giving[];
}

export interface QueryGivingParams {
  page?: number;
  limit?: number;
  category?: GivingCategory;
  startDate?: string;
  endDate?: string;
  search?: string;
}

