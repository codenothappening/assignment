// Merchant-related types and interfaces

export interface Merchant {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessRegistrationNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface MerchantFormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessRegistrationNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  status: 'active' | 'inactive';
}

export interface MerchantStats {
  totalTransactions: number;
  totalRevenue: number;
  successRate: number;
  avgTransactionAmount: number;
  currency: string;
}

export interface MerchantActivity {
  id: string;
  type: 'created' | 'updated' | 'status_change' | 'transaction';
  description: string;
  timestamp: string;
}

export interface MerchantTransaction {
  txnId: number;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'reversed';
  timestamp: string;
  cardType: string;
  cardLast4: string;
}

export interface MerchantsResponse {
  merchants: Merchant[];
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

export interface MerchantFilters {
  page: number;
  size: number;
  search?: string;
  status?: string;
  sortBy?: 'name' | 'createdAt' | 'email';
  sortOrder?: 'asc' | 'desc';
}

export const DEFAULT_MERCHANT_FILTERS: MerchantFilters = {
  page: 0,
  size: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export interface ValidationErrors {
  [key: string]: string;
}
