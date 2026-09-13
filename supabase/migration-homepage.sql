-- Adds the homepage_content table used by /admin/homepage.
-- Run this once in the Supabase SQL Editor. Safe to re-run.

create table if not exists homepage_content (
  id text primary key default 'default',
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table homepage_content enable row level security;
