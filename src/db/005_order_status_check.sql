-- Run this after 004_orders.sql. Optional but recommended: locks the
-- `orders.status` column to the same set of values the admin UI and API
-- route allow (src/constants/order-status.ts), so a bad value can never
-- land in the table even if it bypasses the app (e.g. a manual query).
--
-- Existing rows are all 'pending' by default, so this is safe to run
-- against a table that already has data.

alter table orders
  add constraint orders_status_check
  check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));