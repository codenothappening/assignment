-- Index strategy for optimized query

-- 1) Support primary filter pattern and ordering on transaction_master
-- Composite index enables index-assisted range scan and ORDER BY
CREATE INDEX IF NOT EXISTS idx_tm_merchant_date_time
  ON operators.transaction_master (merchant_id, txn_date, local_txn_date_time DESC);

-- Optional: If queries often filter only by date, a BRIN can help on very large tables
-- CREATE INDEX IF NOT EXISTS idx_tm_txn_date_brin ON operators.transaction_master USING BRIN (txn_date);

-- 2) Support per-transaction detail aggregation with ordering
CREATE INDEX IF NOT EXISTS idx_td_master_time
  ON operators.transaction_details (master_txn_id, local_txn_date_time DESC);

-- 3) Joins to members are by primary key (member_id), which is already indexed as PK
-- No additional indexes required for members.

-- Estimated impact
-- - Expected 10–50x improvement vs original query by removing redundant join/group
--   and enabling index-assisted scans for filter + order and detail aggregation.
