-- Adds Paytm payment tracking to the orders table created by schema.sql.
-- Run this once in the Supabase SQL Editor if your `orders` table already
-- exists (e.g. you ran schema.sql before this file existed). Safe to re-run.

alter table orders
  add column if not exists payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'cod'));

alter table orders
  add column if not exists paytm_order_id text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_paytm_order_id_key'
  ) then
    alter table orders add constraint orders_paytm_order_id_key unique (paytm_order_id);
  end if;
end $$;

alter table orders
  add column if not exists paytm_txn_id text;

-- Backfill: any pre-existing order (from before payments existed) was a COD-style
-- direct insert, so mark it accordingly rather than leaving it stuck "pending".
update orders set payment_status = 'cod' where payment_status = 'pending';

create table if not exists pending_orders (
  paytm_order_id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table pending_orders enable row level security;
