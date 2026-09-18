-- Drapesly ecommerce schema
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query -> paste -> Run).
-- Safe to re-run: uses "if not exists" / "or replace" where possible.

create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  department text not null check (department in ('men', 'women', 'beauty')),
  image text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (department, slug)
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text not null,
  department text not null check (department in ('men', 'women', 'beauty')),
  category text not null,
  subcategory text,
  description text not null default '',
  details text[] not null default '{}',
  material_and_care text[] not null default '{}',
  price numeric(10, 2) not null,
  original_price numeric(10, 2),
  rating numeric(2, 1) not null default 0,
  review_count int not null default 0,
  images text[] not null default '{}',
  colors jsonb not null default '[]',
  sizes text[] not null default '{}',
  stock int not null default 0,
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_department_category_idx on products (department, category);
create index if not exists products_is_new_idx on products (is_new);
create index if not exists products_is_best_seller_idx on products (is_best_seller);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb not null,
  delivery_method text not null default 'standard' check (delivery_method in ('standard', 'express')),
  payment_method text not null default 'cod' check (payment_method in ('upi', 'card', 'netbanking', 'cod')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'cod')),
  razorpay_order_id text unique,
  razorpay_payment_id text,
  status text not null default 'Processing' check (status in ('Processing', 'Shipped', 'Delivered', 'Cancelled')),
  subtotal numeric(10, 2) not null,
  discount numeric(10, 2) not null default 0,
  shipping numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  product_name text not null,
  brand text not null,
  image text,
  price numeric(10, 2) not null,
  color text,
  size text,
  quantity int not null default 1
);

create index if not exists order_items_order_id_idx on order_items (order_id);

-- Holds the customer/shipping/items details for a checkout in progress,
-- keyed by the Razorpay order id. Razorpay's checkout handler and webhook
-- only ever report back payment fields (order id, payment id, signature) —
-- never the original order contents — so this is what lets either the
-- client-driven verify call or Razorpay's own webhook finish creating the
-- real order. Rows are deleted once the order is finalized; a stray
-- abandoned-checkout row otherwise carries no payment info and is harmless.
create table if not exists pending_orders (
  razorpay_order_id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

-- Single-row table holding the homepage hero/banners/featured-categories
-- content as JSON, editable from /admin/homepage. id is always 'default' —
-- there's exactly one row. Falls back to config/homepage.ts's
-- defaultHomepageContent if this row doesn't exist yet.
create table if not exists homepage_content (
  id text primary key default 'default',
  content jsonb not null,
  updated_at timestamptz not null default now()
);

-- Every table is accessed exclusively through server-side code using the
-- service_role key, so Row Level Security stays enabled with no policies:
-- this blocks all access via the public anon key by default (defense in depth).
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table pending_orders enable row level security;
alter table homepage_content enable row level security;
