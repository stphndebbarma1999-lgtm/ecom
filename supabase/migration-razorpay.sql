-- Adds Razorpay payment tracking to the orders table. Safe to re-run, and
-- tolerant of whatever state your database is in: a fresh orders table with
-- none of these columns yet, or one already on Paytm's column names (from
-- an older run of migration-payments.sql).

alter table orders
  add column if not exists payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'cod'));

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'orders' and column_name = 'paytm_order_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_name = 'orders' and column_name = 'razorpay_order_id'
  ) then
    alter table orders rename column paytm_order_id to razorpay_order_id;
  end if;
end $$;

alter table orders
  add column if not exists razorpay_order_id text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_razorpay_order_id_key'
  ) then
    alter table orders add constraint orders_razorpay_order_id_key unique (razorpay_order_id);
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'orders' and column_name = 'paytm_txn_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_name = 'orders' and column_name = 'razorpay_payment_id'
  ) then
    alter table orders rename column paytm_txn_id to razorpay_payment_id;
  end if;
end $$;

alter table orders
  add column if not exists razorpay_payment_id text;

-- Backfill: any pre-existing order (from before payments existed) was a COD-style
-- direct insert, so mark it accordingly rather than leaving it stuck "pending".
update orders set payment_status = 'cod' where payment_status = 'pending';

create table if not exists pending_orders (
  razorpay_order_id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'pending_orders' and column_name = 'paytm_order_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_name = 'pending_orders' and column_name = 'razorpay_order_id'
  ) then
    alter table pending_orders rename column paytm_order_id to razorpay_order_id;
  end if;
end $$;

alter table pending_orders enable row level security;
