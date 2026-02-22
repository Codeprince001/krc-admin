// Giving Categories (admin-created types)
export interface GivingCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  isOthers: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGivingCategoryInput {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
  isOthers?: boolean;
}

export interface UpdateGivingCategoryInput extends Partial<CreateGivingCategoryInput> {}

// Campaigns
export type CampaignStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED";

export interface GivingCampaign {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  targetAmount: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  currency: string;
  sortOrder: number;
  isActive: boolean;
  raised?: number;
  progress?: number;
  transactionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGivingCampaignInput {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
  currency?: string;
  sortOrder?: number;
  isActive?: boolean;
  status?: CampaignStatus;
}

export interface UpdateGivingCampaignInput extends Partial<CreateGivingCampaignInput> {
  status?: CampaignStatus;
}

// Transactions
export type PaymentMethodType =
  | "PAYSTACK"
  | "STRIPE"
  | "BANK_TRANSFER"
  | "CASH";
export type PaymentStatusType =
  | "PENDING"
  | "PAID"
  | "SUCCESSFUL"
  | "FAILED"
  | "REFUNDED";

export interface GivingTransaction {
  id: string;
  userId: string;
  categoryId: string;
  campaignId: string | null;
  category: GivingCategory;
  campaign?: GivingCampaign | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  amount: number;
  currency: string;
  customTitle?: string | null;
  customReason?: string | null;
  paymentMethod: PaymentMethodType;
  paymentRef: string | null;
  paymentStatus: PaymentStatusType;
  paidAt: string | null;
  notes: string | null;
  isAnonymous: boolean;
  createdAt: string;
}

export interface GivingTransactionsResponse {
  data: GivingTransaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GivingTransactionStats {
  totalAmount: number;
  totalCount: number;
  byCategory: {
    categoryId: string;
    categoryName?: string;
    amount: number;
    count: number;
  }[];
  byPaymentMethod: { paymentMethod: string; amount: number }[];
}

export interface QueryGivingTransactionsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  campaignId?: string;
  userId?: string;
  paymentMethod?: PaymentMethodType;
  paymentStatus?: PaymentStatusType;
  startDate?: string;
  endDate?: string;
}
