-- Run this after 003_customers.sql. Stores storefront orders.
--
-- One row in `orders` per checkout/order-placement event; its items live
-- in `order_items`. Every order carries customer_id, so a given
-- customer's orders can always be queried and grouped together — see
-- src/app/admin/orders/page.tsx for the grouped query.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  -- Product name/image/price are snapshotted at order time rather than
  -- foreign-keyed to a products table — there isn't one yet (PRODUCTS
  -- currently lives as a static array in src/constants). Snapshotting
  -- also means a later price change never rewrites historical orders.
  product_name text not null,
  product_img text,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists orders_customer_id_idx on orders (customer_id);
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists order_items_order_id_idx on order_items (order_id);