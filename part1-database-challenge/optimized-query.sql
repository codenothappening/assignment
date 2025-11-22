-- Optimized query: remove redundant join, use LATERAL for per-transaction JSON details
-- Maintains original output structure/fields

SELECT
    tm.*,
  tm.txn_id AS "tm.txnId",
  tm.local_txn_date_time AT TIME ZONE 'UTC' AS "tm.localTxnDateTime",
  COALESCE(det.details, '[]'::json) AS details,
  ins.member_name AS member,
  iss.member_name AS issuer
FROM operators.transaction_master tm
LEFT JOIN LATERAL (
  SELECT json_agg(
           json_build_object(
             'txn_detail_id', td2.txn_detail_id,
             'master_txn_id', td2.master_txn_id,
             'detail_type', td2.detail_type,
             'amount', td2.amount,
             'currency', td2.currency,
             'description', td2.description,
             'local_txn_date_time', td2.local_txn_date_time,
             'converted_date', td2.local_txn_date_time AT TIME ZONE 'UTC'
           )
           ORDER BY td2.local_txn_date_time DESC
         ) AS details
  FROM operators.transaction_details td2
  WHERE td2.master_txn_id = tm.txn_id
) det ON TRUE
LEFT JOIN operators.members ins ON tm.gp_acquirer_id = ins.member_id
LEFT JOIN operators.members iss ON tm.gp_issuer_id = iss.member_id
WHERE tm.txn_date > DATE '2025-11-16'
  AND tm.txn_date < DATE '2025-11-18'
ORDER BY tm.local_txn_date_time DESC;

-- Notes:
-- - Eliminates redundant JOIN to transaction_details and the GROUP BY.
-- - LATERAL subquery runs once per tm row to aggregate details in desired order.
-- - Inclusive date bounds better match index range scans.
