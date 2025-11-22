import { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactionService';
import { FilterState } from '../types/transaction';

interface Transaction {
  txnId: number;
  merchantId: string;
  amount: number;
  currency: string;
  status: string;
  cardType: string;
  cardLast4: string;
  authCode: string;
  txnDate: string;
  createdAt: string;
}

interface UseTransactionsResult {
  data: {
    transactions: Transaction[];
    totalTransactions: number;
    page: number;
    size: number;
  } | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useTransactions = (
  merchantId: string,
  filters: FilterState
): UseTransactionsResult => {
  const [data, setData] = useState<UseTransactionsResult['data']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTransactions(merchantId, filters);
      setData(response);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [merchantId, filters.page, filters.size, filters.status, filters.startDate, filters.endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchTransactions,
  };
};
