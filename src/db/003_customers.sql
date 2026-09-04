-- Run this after 002_contact_messages.sql. Stores public storefront
-- customer accounts (separate from `admins` — different table, different
-- session cookie, different JWT payload shape).

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  first_name text not null,
  last_name text not null,
  phone text,
  -- Password reset: we only ever store a SHA-256 hash of the reset
  -- token, never the raw value that goes out in the email. See
  -- src/utils/customer-auth.ts for the generate/verify logic.
  reset_token_hash text,
  reset_token_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists customers_email_idx
  on customers (email);
