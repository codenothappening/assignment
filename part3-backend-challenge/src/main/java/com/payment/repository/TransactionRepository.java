package com.payment.repository;

import com.payment.entity.TransactionMaster;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.PageableRepository;

import java.util.List;
import java.math.BigDecimal;

import io.micronaut.data.annotation.Query;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import com.payment.dto.StatusCount;
 
/**
 * Repository for TransactionMaster entities.
 * 
 * TODO: Add custom query methods for:
 * - Finding transactions by merchant ID with date range
 * - Paginated queries
 * - Aggregation queries for summary calculation
 * - Join queries with transaction details
 */
@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
public interface TransactionRepository extends PageableRepository<TransactionMaster, Long> {

    // Example: Basic finder method (provided)
    List<TransactionMaster> findByMerchantId(String merchantId);

    TransactionMaster save(TransactionMaster entity);

    // TODO: Add your custom query methods here
    // Examples:
    // - Page<TransactionMaster> findByMerchantIdAndTxnDateBetween(...)
    // - TransactionSummary calculateSummary(...)
    // - List<TransactionWithDetails> findTransactionsWithDetails(...)

    // Paging finders (date range inclusive); overload with and without status
    Page<TransactionMaster> findByMerchantIdAndTxnDateBetween(String merchantId,
                                                              java.sql.Date start,
                                                              java.sql.Date end,
                                                              Pageable pageable);

    Page<TransactionMaster> findByMerchantIdAndTxnDateBetweenAndStatus(String merchantId,
                                                                        java.sql.Date start,
                                                                        java.sql.Date end,
                                                                        String status,
                                                                        Pageable pageable);

    // Total count for date range (for summary; independent of pagination)
    long countByMerchantIdAndTxnDateBetween(String merchantId, java.sql.Date start, java.sql.Date end);

    // Total amount for date range (for summary)
    @Query("SELECT COALESCE(SUM(amount), 0) FROM operators.transaction_master WHERE merchant_id = :merchantId AND txn_date BETWEEN :start AND :end")
    BigDecimal sumAmount(String merchantId, java.sql.Date start, java.sql.Date end);

    // By-status counts for date range (for summary)
    @Query("SELECT tm.status AS status, COUNT(*) AS cnt FROM operators.transaction_master tm WHERE tm.merchant_id = :merchantId AND tm.txn_date BETWEEN :start AND :end GROUP BY tm.status")
    List<StatusCount> aggregateStatusCounts(String merchantId, java.sql.Date start, java.sql.Date end);

    // Total amount for date range with status filter
    @Query("SELECT COALESCE(SUM(amount), 0) FROM operators.transaction_master WHERE merchant_id = :merchantId AND txn_date BETWEEN :start AND :end AND status = :status")
    BigDecimal sumAmountWithStatus(String merchantId, java.sql.Date start, java.sql.Date end, String status);

    // Status counts when a specific status filter is applied (returns single-row list)
    @Query("SELECT tm.status AS status, COUNT(*) AS cnt FROM operators.transaction_master tm WHERE tm.merchant_id = :merchantId AND tm.txn_date BETWEEN :start AND :end AND tm.status = :status GROUP BY tm.status")
    List<StatusCount> aggregateStatusCountsFiltered(String merchantId, java.sql.Date start, java.sql.Date end, String status);

    // Merchant existence check (based on presence of any transactions)
    boolean existsByMerchantId(String merchantId);
}
