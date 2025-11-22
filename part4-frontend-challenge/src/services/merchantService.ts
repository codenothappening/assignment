import { get, post, put } from './api';
import {
  Merchant,
  MerchantsResponse,
  MerchantFilters,
  MerchantFormData,
  MerchantStats,
  MerchantTransaction,
  MerchantActivity,
} from '../types/merchant';

// Mock data for development
const mockMerchants: Merchant[] = [
  {
    id: 'M001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    businessName: 'Doe Electronics',
    businessRegistrationNumber: 'BRN123456',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
    },
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'M002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    businessName: 'Smith Retail',
    businessRegistrationNumber: 'BRN123457',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      postalCode: '90001',
    },
    status: 'active',
    createdAt: '2025-02-20T14:30:00Z',
    updatedAt: '2025-02-20T14:30:00Z',
  },
  {
    id: 'M003',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1234567892',
    businessName: 'Johnson Services',
    businessRegistrationNumber: 'BRN123458',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postalCode: '60601',
    },
    status: 'inactive',
    createdAt: '2025-03-10T09:15:00Z',
    updatedAt: '2025-03-10T09:15:00Z',
  },
];

/**
 * Get list of merchants with filtering, sorting, and pagination
 */
export const getMerchants = async (filters: MerchantFilters): Promise<MerchantsResponse> => {
  try {
    // Try real API first
    const params = new URLSearchParams();
    params.append('page', filters.page.toString());
    params.append('size', filters.size.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    return await get<MerchantsResponse>(`/merchants?${params.toString()}`);
  } catch (error) {
    console.log('Using mock data for merchants');
    // Fallback to mock data
    let filteredMerchants = [...mockMerchants];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredMerchants = filteredMerchants.filter(
        (m) =>
          m.name.toLowerCase().includes(searchLower) ||
          m.email.toLowerCase().includes(searchLower) ||
          m.businessName.toLowerCase().includes(searchLower) ||
          m.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredMerchants = filteredMerchants.filter((m) => m.status === filters.status);
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredMerchants.sort((a, b) => {
        let comparison = 0;
        if (filters.sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (filters.sortBy === 'email') {
          comparison = a.email.localeCompare(b.email);
        } else if (filters.sortBy === 'createdAt') {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Apply pagination
    const startIndex = filters.page * filters.size;
    const endIndex = startIndex + filters.size;
    const paginatedMerchants = filteredMerchants.slice(startIndex, endIndex);

    return {
      merchants: paginatedMerchants,
      pagination: {
        page: filters.page,
        size: filters.size,
        totalPages: Math.ceil(filteredMerchants.length / filters.size),
        totalElements: filteredMerchants.length,
      },
    };
  }
};

/**
 * Get merchant by ID
 */
export const getMerchantById = async (id: string): Promise<Merchant> => {
  try {
    return await get<Merchant>(`/merchants/${id}`);
  } catch (error) {
    console.log('Using mock data for merchant details');
    const merchant = mockMerchants.find((m) => m.id === id);
    if (!merchant) {
      throw new Error('Merchant not found');
    }
    return merchant;
  }
};

/**
 * Create new merchant
 */
export const createMerchant = async (data: MerchantFormData): Promise<Merchant> => {
  try {
    return await post<Merchant>('/merchants', data);
  } catch (error) {
    console.log('Creating mock merchant');
    // Mock creation
    const newMerchant: Merchant = {
      id: `M${String(mockMerchants.length + 1).padStart(3, '0')}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      businessName: data.businessName,
      businessRegistrationNumber: data.businessRegistrationNumber,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
      },
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMerchants.push(newMerchant);
    return newMerchant;
  }
};

/**
 * Update merchant
 */
export const updateMerchant = async (id: string, data: MerchantFormData): Promise<Merchant> => {
  try {
    return await put<Merchant>(`/merchants/${id}`, data);
  } catch (error) {
    console.log('Updating mock merchant');
    const index = mockMerchants.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error('Merchant not found');
    }
    mockMerchants[index] = {
      ...mockMerchants[index],
      name: data.name,
      email: data.email,
      phone: data.phone,
      businessName: data.businessName,
      businessRegistrationNumber: data.businessRegistrationNumber,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
      },
      status: data.status,
      updatedAt: new Date().toISOString(),
    };
    return mockMerchants[index];
  }
};

/**
 * Get merchant statistics
 */
export const getMerchantStats = async (id: string): Promise<MerchantStats> => {
  try {
    return await get<MerchantStats>(`/merchants/${id}/stats`);
  } catch (error) {
    console.log('Using mock stats');
    return {
      totalTransactions: Math.floor(Math.random() * 1000) + 100,
      totalRevenue: Math.floor(Math.random() * 100000) + 10000,
      successRate: 95 + Math.random() * 4,
      avgTransactionAmount: Math.floor(Math.random() * 500) + 50,
      currency: 'USD',
    };
  }
};

/**
 * Get merchant transactions
 */
export const getMerchantTransactions = async (id: string): Promise<MerchantTransaction[]> => {
  try {
    return await get<MerchantTransaction[]>(`/merchants/${id}/transactions`);
  } catch (error) {
    console.log('Using mock transactions');
    const mockTransactions: MerchantTransaction[] = [];
    for (let i = 0; i < 10; i++) {
      mockTransactions.push({
        txnId: 1000 + i,
        amount: Math.floor(Math.random() * 500) + 50,
        currency: 'USD',
        status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        cardType: ['Visa', 'Mastercard', 'Amex'][Math.floor(Math.random() * 3)],
        cardLast4: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
      });
    }
    return mockTransactions;
  }
};

/**
 * Get merchant activity timeline
 */
export const getMerchantActivity = async (id: string): Promise<MerchantActivity[]> => {
  try {
    return await get<MerchantActivity[]>(`/merchants/${id}/activity`);
  } catch (error) {
    console.log('Using mock activity');
    return [
      {
        id: '1',
        type: 'created',
        description: 'Merchant account created',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        type: 'status_change',
        description: 'Status changed to active',
        timestamp: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        type: 'transaction',
        description: 'Processed 150 transactions',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        type: 'updated',
        description: 'Contact information updated',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
};
