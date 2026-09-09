-- Adds Razorpay payment tracking to the orders table created by schema.sql.
-- Run this once in the Supabase SQL Editor if your `orders` table already
-- exists (e.g. you ran schema.sql before this file existed). Safe to re-run.

alter table orders
  add column if not exists payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'cod'));

alter table orders
  add column if not exists razorpay_order_id text;

alter table orders
  add column if not exists razorpay_payment_id text;

-- Backfill: any pre-existing order (from before payments existed) was a COD-style
-- direct insert, so mark it accordingly rather than leaving it stuck "pending".
update orders set payment_status = 'cod' where payment_status = 'pending';
