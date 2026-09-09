-- Run this after 003_customers.sql.
-- `phone` already exists on `customers` (see 003_customers.sql) but
-- isn't currently collected at signup. This adds `address` alongside
-- it so both can be captured on the "Create Your Account" form.

alter table customers
  add column if not exists address text;