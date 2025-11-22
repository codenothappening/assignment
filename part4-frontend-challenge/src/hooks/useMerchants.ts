import { useState, useEffect, useCallback } from 'react';
import {
  getMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  getMerchantStats,
  getMerchantTransactions,
  getMerchantActivity,
} from '../services/merchantService';
import {
  Merchant,
  MerchantsResponse,
  MerchantFilters,
  MerchantFormData,
  MerchantStats,
  MerchantTransaction,
  MerchantActivity,
  DEFAULT_MERCHANT_FILTERS,
} from '../types/merchant';

interface UseMerchantsReturn {
  merchants: Merchant[];
  pagination: MerchantsResponse['pagination'] | null;
  loading: boolean;
  error: string | null;
  filters: MerchantFilters;
  setFilters: (filters: Partial<MerchantFilters>) => void;
  refetch: () => Promise<void>;
}

export const useMerchants = (initialFilters?: Partial<MerchantFilters>): UseMerchantsReturn => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [pagination, setPagination] = useState<MerchantsResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<MerchantFilters>({
    ...DEFAULT_MERCHANT_FILTERS,
    ...initialFilters,
  });

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMerchants(filters);
      setMerchants(response.merchants);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch merchants');
      console.error('Error fetching merchants:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const setFilters = (newFilters: Partial<MerchantFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    merchants,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchMerchants,
  };
};

interface UseMerchantDetailsReturn {
  merchant: Merchant | null;
  stats: MerchantStats | null;
  transactions: MerchantTransaction[];
  activity: MerchantActivity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMerchantDetails = (merchantId: string): UseMerchantDetailsReturn => {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [stats, setStats] = useState<MerchantStats | null>(null);
  const [transactions, setTransactions] = useState<MerchantTransaction[]>([]);
  const [activity, setActivity] = useState<MerchantActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [merchantData, statsData, transactionsData, activityData] = await Promise.all([
        getMerchantById(merchantId),
        getMerchantStats(merchantId),
        getMerchantTransactions(merchantId),
        getMerchantActivity(merchantId),
      ]);
      setMerchant(merchantData);
      setStats(statsData);
      setTransactions(transactionsData);
      setActivity(activityData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch merchant details');
      console.error('Error fetching merchant details:', err);
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    merchant,
    stats,
    transactions,
    activity,
    loading,
    error,
    refetch: fetchDetails,
  };
};

interface UseMerchantFormReturn {
  submitting: boolean;
  error: string | null;
  success: boolean;
  createNewMerchant: (data: MerchantFormData) => Promise<Merchant | null>;
  updateExistingMerchant: (id: string, data: MerchantFormData) => Promise<Merchant | null>;
  resetState: () => void;
}

export const useMerchantForm = (): UseMerchantFormReturn => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createNewMerchant = async (data: MerchantFormData): Promise<Merchant | null> => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const merchant = await createMerchant(data);
      setSuccess(true);
      return merchant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create merchant');
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const updateExistingMerchant = async (
    id: string,
    data: MerchantFormData
  ): Promise<Merchant | null> => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const merchant = await updateMerchant(id, data);
      setSuccess(true);
      return merchant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update merchant');
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const resetState = () => {
    setSubmitting(false);
    setError(null);
    setSuccess(false);
  };

  return {
    submitting,
    error,
    success,
    createNewMerchant,
    updateExistingMerchant,
    resetState,
  };
};
