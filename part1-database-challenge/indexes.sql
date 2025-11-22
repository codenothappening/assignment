-- ============================================================================
-- INDEX STRATEGY
-- ============================================================================

-- 1. OPTIMIZE MASTER SEARCH
-- The original query filters by txn_date and sorts by local_txn_date_time.
-- While txn_date index exists, a composite index helps if the filter is highly selective.
-- However, since we are sorting by a different column than the filter, 
-- the existing 'idx_transaction_master_txn_date' is actually sufficient for the bitmap scan.
-- 
-- RECOMMENDATION: Keep existing index on txn_date, but if sorting is the bottleneck:
-- CREATE INDEX CONCURRENTLY idx_tm_date_sort ON operators.transaction_master(txn_date, local_txn_date_time DESC);


-- 2. OPTIMIZE DETAILS LOOKUP (High Priority)
-- The query aggregates details by master_txn_id and sorts them by local_txn_date_time.
-- Current index is just on master_txn_id.
-- Adding 'local_txn_date_time' to the index allows Postgres to fetch rows 
-- already sorted, avoiding a sort operation during JSON aggregation.

CREATE INDEX CONCURRENTLY idx_transaction_details_composite 
ON operators.transaction_details(master_txn_id, local_txn_date_time DESC);

-- Justification:
-- This is a "Covering Index" strategy for the sort. 
-- Performance Gain: Eliminates the "Sort Key" step inside the subquery/lateral join.
-- Estimated improvement: 15-20% reduction in CPU usage for the aggregation part.


-- 3. OPTIMIZE FOREIGN KEYS
-- The members table is small (500 rows), but strictly speaking, we should ensure 
-- FKs are indexed on the transaction_master side if we ever delete members (locking issues).
-- For this specific read-query, the standard B-Tree on member_id in the members table is enough.

-- ============================================================================
-- FINAL COMMANDS TO EXECUTE
-- ============================================================================

-- Drop old suboptimal index if space is tight (Optional)
-- DROP INDEX operators.idx_transaction_details_master_txn_id;

-- Create the optimized composite index
CREATE INDEX IF NOT EXISTS idx_transaction_details_lookup_sort 
ON operators.transaction_details(master_txn_id, local_txn_date_time DESC) 
INCLUDE (amount, detail_type, currency); 

-- Note: The 'INCLUDE' clause allows for an "Index Only Scan" in some cases, 
-- meaning Postgres doesn't even need to look at the heap table for those columns.