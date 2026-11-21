-- Pro Football: one JSON document per coach, synced between devices.
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists public.coach_data (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.coach_data enable row level security;

-- Each coach can only see and change their own row.
create policy "own row: select" on public.coach_data for select using (auth.uid() = user_id);
create policy "own row: insert" on public.coach_data for insert with check (auth.uid() = user_id);
create policy "own row: update" on public.coach_data for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Live updates to the other device.
alter publication supabase_realtime add table public.coach_data;
