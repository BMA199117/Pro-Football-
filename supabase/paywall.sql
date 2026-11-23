-- Pro Football: paid version (Premium).
-- Run once in Supabase → SQL Editor, AFTER schema.sql and admin.sql. Safe to run again.
--
--   free_items      which drills / ready plans / season programmes are free (the admin chooses)
--   subscriptions   who has Premium and until when (the admin gives it now, the payment system later)
--   drill_details   the full drill content (description, points, drawing, animation, "why useful").
--                   The server returns a row only if the drill is free or the coach has Premium,
--                   so closed drills cannot be opened by tinkering with the browser.
--   content_items   the admin's drill edits are closed the same way; content_drill_meta() gives
--                   everyone only the catalog part (name, age, category…) of those rows.

/* ------------------------------------------------------------- free items */
create table if not exists public.free_items (
  kind     text not null check (kind in ('drill', 'plan', 'season')),
  id       text not null,
  added_at timestamptz not null default now(),
  primary key (kind, id)
);
alter table public.free_items enable row level security;
drop policy if exists "free: everyone reads" on public.free_items;
drop policy if exists "free: admin inserts" on public.free_items;
drop policy if exists "free: admin deletes" on public.free_items;
create policy "free: everyone reads" on public.free_items for select to anon, authenticated using (true);
create policy "free: admin inserts" on public.free_items for insert to authenticated with check (public.is_admin());
create policy "free: admin deletes" on public.free_items for delete to authenticated using (public.is_admin());

create or replace function public.is_free(k text, item text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.free_items where kind = k and id = item)
$$;
grant execute on function public.is_free(text, text) to anon, authenticated;

/* ---------------------------------------------------------- subscriptions */
create table if not exists public.subscriptions (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  plan       text not null default 'manual',      -- manual | month | year | … (payment system later)
  until      timestamptz,                          -- null = without end
  note       text,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
alter table public.subscriptions enable row level security;
drop policy if exists "subs: own or admin reads" on public.subscriptions;
create policy "subs: own or admin reads" on public.subscriptions for select to authenticated
  using ((select auth.uid()) = user_id or public.is_admin());
-- No write policies: changed only by admin_set_premium() (and later by the payment webhook with the service key).

create or replace function public.has_premium() returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_admin() or exists (
    select 1 from public.subscriptions s where s.user_id = auth.uid() and (s.until is null or s.until > now()))
$$;
grant execute on function public.has_premium() to anon, authenticated;

-- What the app asks after sign-in.
create or replace function public.my_access() returns json
language sql stable security definer set search_path = '' as $$
  select json_build_object(
    'premium', exists (select 1 from public.subscriptions s where s.user_id = auth.uid() and (s.until is null or s.until > now())),
    'until', (select s.until from public.subscriptions s where s.user_id = auth.uid()),
    'plan', (select s.plan from public.subscriptions s where s.user_id = auth.uid()),
    'admin', public.is_admin())
$$;
grant execute on function public.my_access() to authenticated;

/* ---------------------------------------------------------- drill details */
create table if not exists public.drill_details (
  id         text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.drill_details enable row level security;
drop policy if exists "details: free or premium reads" on public.drill_details;
drop policy if exists "details: admin inserts" on public.drill_details;
drop policy if exists "details: admin updates" on public.drill_details;
drop policy if exists "details: admin deletes" on public.drill_details;
create policy "details: free or premium reads" on public.drill_details for select to anon, authenticated
  using (public.is_free('drill', id) or public.has_premium());
create policy "details: admin inserts" on public.drill_details for insert to authenticated with check (public.is_admin());
create policy "details: admin updates" on public.drill_details for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "details: admin deletes" on public.drill_details for delete to authenticated using (public.is_admin());

/* ------------------------------------------- the admin's drill edits, closed too */
drop policy if exists "content: everyone reads" on public.content_items;
create policy "content: everyone reads" on public.content_items for select to anon, authenticated
  using (kind <> 'drill' or public.is_free('drill', id) or public.has_premium());

-- Catalog part of every drill row (for coaches who cannot read the full row).
create or replace function public.content_drill_meta()
returns table (id text, data jsonb, hidden boolean, deleted boolean, updated_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select c.id,
    case when c.data is null then null else jsonb_strip_nulls(jsonb_build_object(
      'id', c.id, 'name', c.data->'name', 'cat', c.data->'cat', 'dia', c.data->'dia', 'age', c.data->'age',
      'min', c.data->'min', 'players', c.data->'players', 'equip', c.data->'equip', 'source', c.data->'source',
      'desc', jsonb_build_object(
        'uz', case when length(c.data->'desc'->>'uz') > 110 then left(c.data->'desc'->>'uz', 100) || '…' else coalesce(c.data->'desc'->>'uz', '') end,
        'ru', case when length(c.data->'desc'->>'ru') > 110 then left(c.data->'desc'->>'ru', 100) || '…' else coalesce(c.data->'desc'->>'ru', '') end)))
    end,
    c.hidden, c.deleted, c.updated_at
  from public.content_items c
  where c.kind = 'drill'
$$;
grant execute on function public.content_drill_meta() to anon, authenticated;

/* --------------------------------------------------------- admin functions */
-- Give Premium by email: days = 30, 365…; days = null → without end; days = 0 → take it away.
create or replace function public.admin_set_premium(target_email text, days int, note text default null) returns text
language plpgsql security definer set search_path = '' as $$
declare uid uuid;
begin
  if not public.is_admin() then raise exception 'not an admin' using errcode = '42501'; end if;
  select id into uid from auth.users where lower(email) = lower(trim(target_email));
  if uid is null then return 'no_user'; end if;
  if days = 0 then
    delete from public.subscriptions where user_id = uid;
    return 'ok';
  end if;
  insert into public.subscriptions (user_id, plan, until, note, updated_at, updated_by)
  values (uid, 'manual',
          case when days is null then null else now() + make_interval(days => days) end,
          note, now(), auth.uid())
  on conflict (user_id) do update set
    plan = 'manual',
    -- adding days to a running subscription extends it
    until = case when days is null then null
                 else greatest(coalesce(public.subscriptions.until, now()), now()) + make_interval(days => days) end,
    note = coalesce(excluded.note, public.subscriptions.note),
    updated_at = now(), updated_by = auth.uid();
  return 'ok';
end $$;

create or replace function public.admin_premium()
returns table (user_id uuid, email text, plan text, until timestamptz, note text, updated_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'not an admin' using errcode = '42501'; end if;
  return query select s.user_id, u.email::text, s.plan, s.until, s.note, s.updated_at
    from public.subscriptions s join auth.users u on u.id = s.user_id
    order by s.updated_at desc;
end $$;

revoke execute on function public.admin_set_premium(text, int, text) from public, anon;
revoke execute on function public.admin_premium() from public, anon;
grant execute on function public.admin_set_premium(text, int, text) to authenticated;
grant execute on function public.admin_premium() to authenticated;

-- Live updates for the free list (the app also re-reads it when it comes back to the foreground).
do $$ begin
  alter publication supabase_realtime add table public.free_items;
exception when others then null; end $$;
