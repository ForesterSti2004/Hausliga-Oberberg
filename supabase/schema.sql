-- Run once in the SQL editor of the Supabase project used for this league.
create table if not exists public.hausliga_results (
  team_id smallint not null check (team_id between 1 and 10),
  day smallint not null check (day between 1 and 10),
  rows jsonb not null,
  baker jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (team_id, day)
);
alter table public.hausliga_results enable row level security;
-- No anonymous access: the Vercel server reads and writes with a server-only key.
