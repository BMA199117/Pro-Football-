-- Pro Football: administrator panel.
-- Run this once in Supabase AFTER schema.sql: SQL Editor -> New query -> paste -> Run.
-- It is safe to run again (it never deletes content or coach data).
--
-- What it adds:
--   admins          who may open the admin panel and change content
--   profiles        one row per coach (email, sign-up time, last visit) for the admin's coach list
--   activity_days   one row per coach per day they opened the app (for the activity chart)
--   content_items   the admin's changes to the app content (drills, Bilim cards, plans, ...)
--   content_history every earlier version of a content change, so nothing is lost
--   admin_* functions that only an admin can call (overview, coach list, activity, admins, delete coach)

/* ------------------------------------------------------------------ admins */

create table if not exists public.admins (
  user_id  uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins: admin reads" on public.admins;
create policy "admins: admin reads" on public.admins for select to authenticated using (public.is_admin());
-- No insert/update/delete policies: admins are added only through admin_set_admin() or the SQL editor.

/* ---------------------------------------------------------------- profiles */

create table if not exists public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now(),
  last_seen  timestamptz
);
alter table public.profiles enable row level security;

drop policy if exists "profiles: own or admin reads" on public.profiles;
create policy "profiles: own or admin reads" on public.profiles for select to authenticated
  using ((select auth.uid()) = user_id or public.is_admin());

create table if not exists public.activity_days (
  user_id uuid not null references auth.users (id) on delete cascade,
  day     date not null,
  primary key (user_id, day)
);
alter table public.activity_days enable row level security;
drop policy if exists "activity: admin reads" on public.activity_days;
create policy "activity: admin reads" on public.activity_days for select to authenticated using (public.is_admin());

-- New coach -> profile row (and keep the email up to date).
create or replace function public.profiles_from_auth() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id, email, created_at)
  values (new.id, new.email, coalesce(new.created_at, now()))
  on conflict (user_id) do update set email = excluded.email;
  return new;
end $$;

drop trigger if exists profiles_from_auth on auth.users;
create trigger profiles_from_auth after insert or update of email on auth.users
  for each row execute function public.profiles_from_auth();

-- Coaches who signed up before this file was run.
insert into public.profiles (user_id, email, created_at, last_seen)
select id, email, created_at, last_sign_in_at from auth.users
on conflict (user_id) do nothing;

-- Called by the app when a signed-in coach opens it (at most a few times a day).
create or replace function public.touch() returns void
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return; end if;
  insert into public.profiles (user_id, email, last_seen)
  select uid, u.email, now() from auth.users u where u.id = uid
  on conflict (user_id) do update set last_seen = now();
  insert into public.activity_days (user_id, day) values (uid, current_date) on conflict do nothing;
end $$;
revoke execute on function public.touch() from public, anon;
grant execute on function public.touch() to authenticated;

/* ----------------------------------------------------------- content_items */
-- kind: drill | card | plan | stage | principle | source
-- The built-in content stays in the app; a row here changes, hides or adds one item.
--   hidden = true  -> coaches do not see the item ("deleted", can be restored)
--   deleted = true -> the row no longer counts: a built-in item is back to its original,
--                     an item the admin added is gone for good

create table if not exists public.content_items (
  kind       text not null check (kind in ('drill', 'card', 'plan', 'stage', 'principle', 'source')),
  id         text not null check (char_length(id) between 1 and 100),
  data       jsonb,
  hidden     boolean not null default false,
  deleted    boolean not null default false,
  updated_at timestamptz not null default clock_timestamp(),
  updated_by uuid default auth.uid(),
  primary key (kind, id)
);
create index if not exists content_items_updated_at on public.content_items (updated_at);

create table if not exists public.content_history (
  n          bigint generated always as identity primary key,
  kind       text not null,
  id         text not null,
  data       jsonb,
  hidden     boolean not null,
  deleted    boolean not null,
  changed_at timestamptz not null,
  changed_by uuid
);
create index if not exists content_history_item on public.content_history (kind, id, n desc);

create or replace function public.content_items_stamp() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  new.updated_by := auth.uid();
  insert into public.content_history (kind, id, data, hidden, deleted, changed_at, changed_by)
  values (new.kind, new.id, new.data, new.hidden, new.deleted, new.updated_at, new.updated_by);
  return new;
end $$;

drop trigger if exists content_items_stamp on public.content_items;
create trigger content_items_stamp before insert or update on public.content_items
  for each row execute function public.content_items_stamp();

alter table public.content_items enable row level security;
alter table public.content_history enable row level security;

drop policy if exists "content: everyone reads" on public.content_items;
drop policy if exists "content: admin inserts" on public.content_items;
drop policy if exists "content: admin updates" on public.content_items;
create policy "content: everyone reads" on public.content_items for select to anon, authenticated using (true);
create policy "content: admin inserts" on public.content_items for insert to authenticated with check (public.is_admin());
create policy "content: admin updates" on public.content_items for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- No delete policy: removing is done with deleted = true, so every device learns about it.

drop policy if exists "history: admin reads" on public.content_history;
create policy "history: admin reads" on public.content_history for select to authenticated using (public.is_admin());

do $$ begin
  alter publication supabase_realtime add table public.content_items;
exception when duplicate_object then null;
end $$;

/* --------------------------------------------------------- admin functions */

create or replace function public.admin_overview() returns json
language plpgsql stable security definer set search_path = '' as $$
declare r json;
begin
  if not public.is_admin() then raise exception 'not an admin' using errcode = '42501'; end if;
  select json_build_object(
    'coaches',      (select count(*) from public.profiles),
    'new7',         (select count(*) from public.profiles where created_at > now() - interval '7 days'),
    'new30',        (select count(*) from public.profiles where created_at > now() - interval '30 days'),
    'activeToday',  (select count(*) from public.activity_days where day = current_date),
    'active7',      (select count(distinct user_id) from public.activity_days where day > current_date - 7),
    'active30',     (select count(distinct user_id) from public.activity_days where day > current_date - 30),
    'sessions',     (select count(*) from public.coach_items where kind = 'sessions' and not deleted),
    'players',      (select count(*) from public.coach_items where kind = 'players' and not deleted),
    'ownDrills',    (select count(*) from public.coach_items where kind = 'customDrills' and not deleted),
    'sessions7',    (select count(*) from public.coach_items where kind = 'sessions' and not deleted and server_at > now() - interval '7 days'),
    'contentEdits', (select count(*) from public.content_items where not deleted),
    'admins',       (select count(*) from public.admins)
  ) into r;
  return r;
end $$;

create or replace function public.admin_coaches()
returns table (user_id uuid, email text, created_at timestamptz, last_seen timestamptz,
               sessions bigint, players bigint, own_drills bigint, days_active bigint, is_admin boolean)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'not an admin' using errcode = '42501'; end if;
  return query
  select p.user_id, p.email, p.created_at, p.last_seen,
    count(*) filter (where c.kind = 'sessions'),
    count(*) filter (where c.kind = 'players'),
    count(*) filter (where c.kind = 'customDrills'),
    (select count(*) from public.activity_days a where a.user_id = p.user_id),
    exists (select 1 from public.admins x where x.user_id = p.user_id)
  from public.profiles p
  left join public.coach_items c on c.user_id = p.user_id and not c.deleted
  group by p.user_id
  order by coalesce(p.last_seen, p.created_at) desc;
end $$;

create or replace function public.admin_activity(days int default 30)
returns table (day date, active bigint, signups bigint, sessions bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'not an admin' using errcode = '42501'; end if;
  return query
  select d::date,
    (select count(*) from public.activity_days a where a.day = d::date),
    (select count(*) from public.profiles p where p.created_at::date = d::date),
    (select count(*) from public.coach_items c where c.kind = 'sessions' and c.server_at::date = d::date)
  from generate_series(current_date - (greatest(1, least(days, 365)) - 1), current_date, interval '1 day') d
  order by 1;
end $$;

-- Make someone an admin (make = true) or take it away (make = false), by email.
create or replace function public.admin_set_admin(target_email text, make boolean) returns text
language plpgsql security definer set search_path = '' as $$
declare uid uuid;
begin
  if not public.is_admin() then raise exception 'not an admin' using errcode = '42501'; end if;
  select id into uid from auth.users where lower(email) = lower(trim(target_email));
  if uid is null then return 'no_user'; end if;
  if make then
    insert into public.admins (user_id) values (uid) on conflict do nothing;
  else
    if uid = auth.uid() then return 'self'; end if;
    delete from public.admins where user_id = uid;
  end if;
  return 'ok';
end $$;

-- Delete a coach account and all its data (for test or unwanted accounts).
create or replace function public.admin_delete_coach(target uuid) returns text
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'not an admin' using errcode = '42501'; end if;
  if target = auth.uid() then return 'self'; end if;
  if exists (select 1 from public.admins where user_id = target) then return 'admin'; end if;
  delete from auth.users where id = target; -- coach_items, profiles, activity rows go with it (on delete cascade)
  return 'ok';
end $$;

revoke execute on function public.admin_overview() from public, anon;
revoke execute on function public.admin_coaches() from public, anon;
revoke execute on function public.admin_activity(int) from public, anon;
revoke execute on function public.admin_set_admin(text, boolean) from public, anon;
revoke execute on function public.admin_delete_coach(uuid) from public, anon;
grant execute on function public.admin_overview() to authenticated;
grant execute on function public.admin_coaches() to authenticated;
grant execute on function public.admin_activity(int) to authenticated;
grant execute on function public.admin_set_admin(text, boolean) to authenticated;
grant execute on function public.admin_delete_coach(uuid) to authenticated;

/* ------------------------------------------------------ the first admin */
-- After running everything above, make your own account the admin (once).
-- Replace SIZNING@EMAIL with the email you use to sign in to the app, then run only this line:
--
--   insert into public.admins (user_id) select id from auth.users where lower(email) = lower('SIZNING@EMAIL') on conflict do nothing;
--
-- More admins can then be added from the admin panel (Adminlar section).

/* ------------------------------------------------------------- videos */
-- Bucket "media" for videos (and pictures) the admin uploads. Everyone can watch, only admins upload or delete.
-- 50 MB per file (the Supabase free plan limit). Longer videos: put them on YouTube and paste the link instead.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800, array['video/mp4', 'video/webm', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media: admin uploads" on storage.objects;
drop policy if exists "media: admin updates" on storage.objects;
drop policy if exists "media: admin deletes" on storage.objects;
create policy "media: admin uploads" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media: admin updates" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media: admin deletes" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
