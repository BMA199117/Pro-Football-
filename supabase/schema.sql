-- Pro Football: coach data synced between phone and PC.
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- It is safe to run again.
--
-- One row per item (a session, a player, an own drill, a group, a favorite).
-- updated_at is the edit time from the device (ms). An older edit never overwrites a newer one.
-- server_at is set by the server and lets a device download only what changed since last time.

create table if not exists public.coach_items (
  user_id    uuid    not null default auth.uid() references auth.users (id) on delete cascade,
  kind       text    not null check (char_length(kind) between 1 and 40),
  id         text    not null check (char_length(id) between 1 and 200),
  data       jsonb,
  deleted    boolean not null default false,
  updated_at bigint  not null,
  server_at  timestamptz not null default clock_timestamp(),
  primary key (user_id, kind, id)
);

create index if not exists coach_items_user_server_at on public.coach_items (user_id, server_at);

-- Keep the newest edit; stamp server time on every accepted write.
create or replace function public.coach_items_guard() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and new.updated_at < old.updated_at then
    return null; -- an older edit arrived late: ignore it
  end if;
  new.server_at := clock_timestamp();
  return new;
end $$;

drop trigger if exists coach_items_guard on public.coach_items;
create trigger coach_items_guard before insert or update on public.coach_items
  for each row execute function public.coach_items_guard();

-- Each coach can only see and change their own rows.
alter table public.coach_items enable row level security;

drop policy if exists "own rows: select" on public.coach_items;
drop policy if exists "own rows: insert" on public.coach_items;
drop policy if exists "own rows: update" on public.coach_items;
create policy "own rows: select" on public.coach_items for select to authenticated using ((select auth.uid()) = user_id);
create policy "own rows: insert" on public.coach_items for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own rows: update" on public.coach_items for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Live updates to the coach's other devices.
do $$ begin
  alter publication supabase_realtime add table public.coach_items;
exception when duplicate_object then null;
end $$;
