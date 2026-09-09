-- Run this after 003_customers.sql. Stores each logged-in customer's
-- cart. One row per (customer, product) — adding a product that's
-- already in the cart increments its quantity rather than creating a
-- duplicate row (see the ON CONFLICT upsert in the cart API route).
--
-- Like order_items, product_name/img/price are snapshotted rather than
-- foreign-keyed to a products table, since PRODUCTS still lives as a
-- static array in src/constants with no stable product id yet.

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  product_name text not null,
  product_img text,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (customer_id, product_name)
);

create index if not exists cart_items_customer_id_idx on cart_items (customer_id);