-- TRC — Attrition tracking migration
-- Run this in your Supabase SQL Editor (your candidates table already
-- exists, so this only adds the new departures table).

create extension if not exists "uuid-ossp";

create table if not exists departures (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  leader text not null,
  date_left date not null default current_date,
  reason text,
  created_at timestamptz not null default now()
);

alter table departures enable row level security;

create policy "Allow public read access on departures"
  on departures for select
  using (true);

create policy "Allow public insert access on departures"
  on departures for insert
  with check (true);

create policy "Allow public update access on departures"
  on departures for update
  using (true);

create policy "Allow public delete access on departures"
  on departures for delete
  using (true);

create index if not exists departures_leader_idx on departures (leader);
