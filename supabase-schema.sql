-- TRC — The Recruitment Challenge
-- Run this in your Supabase project's SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists candidates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  age int,
  school text,
  course text,
  leader text not null,
  events text[] not null default '{}',
  paper_m9 boolean not null default false,
  paper_m9a boolean not null default false,
  paper_res5 boolean not null default false,
  paper_hi boolean not null default false,
  foundation_training boolean not null default false,
  rnf boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table candidates enable row level security;

-- Since this app has no login (leader is picked from a dropdown, per your
-- earlier decision), we allow the anon key full read/write access.
-- Anyone with the site link can read and edit all candidates.
create policy "Allow public read access"
  on candidates for select
  using (true);

create policy "Allow public insert access"
  on candidates for insert
  with check (true);

create policy "Allow public update access"
  on candidates for update
  using (true);

create policy "Allow public delete access"
  on candidates for delete
  using (true);

create index if not exists candidates_leader_idx on candidates (leader);
create index if not exists candidates_rnf_idx on candidates (rnf);

-- Attrition: associates who left, tracked against a leader for net growth
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
