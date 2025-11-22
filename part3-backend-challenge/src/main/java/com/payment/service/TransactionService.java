package com.payment.service;

import com.payment.dto.MerchantTransactionsResponse;

import java.util.Optional;

public interface TransactionService {
    MerchantTransactionsResponse getMerchantTransactions(
            String merchantId,
            Optional<Integer> page,
            Optional<Integer> size,
            Optional<String> startDate,
            Optional<String> endDate,
            Optional<String> status
    );
}
