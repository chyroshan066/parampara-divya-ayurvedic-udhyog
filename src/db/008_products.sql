-- Run this after schema.sql. Replaces the previously-hardcoded PRODUCTS
-- array (src/constants/products.ts) with a real table the admin can
-- manage from /admin/products instead of editing code and redeploying.
--
-- image_public_id is the Cloudinary public ID for the uploaded image
-- (not just its URL) — needed so a replaced or deleted product's old
-- image can actually be removed from Cloudinary, not just unlinked in
-- the database. It's nullable so a seeded/legacy row can exist with a
-- plain static image path and no Cloudinary asset behind it (see the
-- optional 009_seed_products.sql).
--
-- Deliberately NOT foreign-keyed from cart_items/order_items — those
-- already snapshot product_name/product_img/unit_price at the moment
-- an item is added (see 004_orders.sql and 007_cart_items.sql), so
-- deleting a product here never breaks a customer's past cart or
-- order history.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  image_public_id text,
  price numeric(10, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_created_at_idx on products (created_at desc);