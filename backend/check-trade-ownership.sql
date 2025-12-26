-- Check trade ownership
-- Replace the IDs with the actual values from your error log

SELECT 
  t.id as trade_id,
  t."userId" as trade_user_id,
  u.id as user_id,
  u.email as user_email,
  t.instrument,
  t."tradeDate",
  t."emotionalState"
FROM trades t
LEFT JOIN users u ON t."userId" = u.id
WHERE t.id = '5e474865-697e-440f-ba3a-f467a943dc9d';

-- Check if the authenticated user exists
SELECT id, email, name 
FROM users 
WHERE id = '9f067fea-b32c-494d-a7fc-b7081010f3bb';

-- Check all trades for the authenticated user
SELECT id, instrument, "tradeDate", "userId"
FROM trades
WHERE "userId" = '9f067fea-b32c-494d-a7fc-b7081010f3bb'
ORDER BY "tradeDate" DESC
LIMIT 10;
