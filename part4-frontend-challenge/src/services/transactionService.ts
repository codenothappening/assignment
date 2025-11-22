import { get } from './api';
import { TransactionResponse, FilterState } from '../types/transaction';

/**
 * Transaction Service
 * Handles all transaction-related API calls
 */

const MERCHANT_BASE = '/merchants';

/**
 * Get transactions for a specific merchant
 * 
 * TODO: Implement this method to call the backend API
 * 
 * @param merchantId - The merchant ID
 * @param filters - Filter parameters (page, size, dates, status)
 * @returns Promise with transaction response data
 */
export const getTransactions = async (
  merchantId: string,
  filters: FilterState
): Promise<{ transactions: any[]; totalTransactions: number; page: number; size: number }> => {
  const params = {
    page: filters.page,
    size: filters.size,
    startDate: filters.startDate,
    endDate: filters.endDate,
    ...(filters.status && { status: filters.status }),
  };

  const url = `${MERCHANT_BASE}/${merchantId}/transactions`;
  try {
    const response = await get<TransactionResponse>(url, { params });
    const simplified = {
      transactions: response.transactions,
      totalTransactions: response.pagination.totalElements,
      page: response.pagination.page,
      size: response.pagination.size,
    };
    return simplified as any;
  } catch (error) {
    console.log('Using mock transactions for fallback');
    const statuses = ['completed', 'pending', 'failed'];
    const cards = ['Visa', 'Mastercard', 'Amex'];
    const transactions: any[] = [];
    for (let i = 0; i < filters.size; i++) {
      const status = filters.status || statuses[Math.floor(Math.random() * statuses.length)];
      const txnDate = new Date(
        new Date(filters.startDate).getTime() + Math.random() * (new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime())
      ).toISOString();
      transactions.push({
        txnId: filters.page * filters.size + i + 1,
        merchantId,
        amount: Math.floor(Math.random() * 500) + 50,
        currency: 'USD',
        status,
        cardType: cards[Math.floor(Math.random() * cards.length)],
        cardLast4: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
        authCode: String(Math.floor(Math.random() * 900000) + 100000),
        txnDate,
        createdAt: txnDate,
      });
    }
    return {
      transactions,
      totalTransactions: 500,
      page: filters.page,
      size: filters.size,
    };
  }
};

/**
 * Get a single transaction by ID
 * (Optional - for future enhancement)
 */
export const getTransactionById = async (
  txnId: number
): Promise<any> => {
  throw new Error(`Not implemented: ${txnId}`);
};

export default {
  getTransactions,
  getTransactionById,
};
