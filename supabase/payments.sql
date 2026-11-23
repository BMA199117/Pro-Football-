-- Pro Football: prices, free trial, launch promo, academy plan and Click payments.
-- Run once in Supabase → SQL Editor, AFTER paywall.sql. Safe to run again.
--
--   app_settings      public settings: prices ('pricing') and Click ids ('click'); the admin edits them
--   private_settings  secrets (the Click secret key); nobody can read them through the API
--   payments          one row per order; the status is changed only by Click's callbacks
--   trials            who has used the free trial (once per account)
--   academy_members   coaches an academy subscription covers (by email)
--   click_callback()  the whole Click SHOP-API logic (signature, amount, prepare, complete);
--                     the edge function "click" only passes Click's request here

/* ---------------------------------------------------------------- settings */
create table if not exists public.app_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;
drop policy if exists "settings: everyone reads" on public.app_settings;
drop policy if exists "settings: admin inserts" on public.app_settings;
drop policy if exists "settings: admin updates" on public.app_settings;
create policy "settings: everyone reads" on public.app_settings for select to anon, authenticated using (true);
create policy "settings: admin inserts" on public.app_settings for insert to authenticated with check (public.is_admin());
create policy "settings: admin updates" on public.app_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.app_settings (key, value) values
  ('pricing', '{"month":39000,"year":290000,"academy":199000,"academySeats":10,"trialDays":7,"promoYearPercent":50,"promoLimit":100}'),
  ('click', '{"service_id":"","merchant_id":""}')
on conflict (key) do nothing;

create table if not exists public.private_settings (
  key   text primary key,
  value text not null
);
alter table public.private_settings enable row level security;
-- no policies: only security-definer functions read it

create or replace function public.admin_set_click_secret(secret text) returns text
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'not an admin' using errcode = '42501'; end if;
  insert into public.private_settings (key, value) values ('click_secret', trim(secret))
  on conflict (key) do update set value = excluded.value;
  return 'ok';
end $$;
create or replace function public.admin_click_secret_set() returns boolean
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'not an admin' using errcode = '42501'; end if;
  return exists (select 1 from public.private_settings where key = 'click_secret' and value <> '');
end $$;

/* ---------------------------------------------------------------- payments */
create table if not exists public.payments (
  id              bigserial primary key,
  user_id         uuid not null references auth.users (id) on delete cascade,
  plan            text not null check (plan in ('month', 'year', 'academy')),
  amount          integer not null,
  promo           boolean not null default false,
  status          text not null default 'new' check (status in ('new', 'prepared', 'paid', 'cancelled')),
  click_trans_id  bigint,
  click_paydoc_id bigint,
  note            text,
  created_at      timestamptz not null default now(),
  prepared_at     timestamptz,
  paid_at         timestamptz
);
create index if not exists payments_user on public.payments (user_id);
alter table public.payments enable row level security;
drop policy if exists "payments: own or admin reads" on public.payments;
create policy "payments: own or admin reads" on public.payments for select to authenticated
  using ((select auth.uid()) = user_id or public.is_admin());

create table if not exists public.trials (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  started_at timestamptz not null default now()
);
alter table public.trials enable row level security;
drop policy if exists "trials: own or admin reads" on public.trials;
create policy "trials: own or admin reads" on public.trials for select to authenticated
  using ((select auth.uid()) = user_id or public.is_admin());

create table if not exists public.academy_members (
  owner        uuid not null references auth.users (id) on delete cascade,
  member_email text not null,
  added_at     timestamptz not null default now(),
  primary key (owner, member_email)
);
alter table public.academy_members enable row level security;
drop policy if exists "academy: owner or admin reads" on public.academy_members;
create policy "academy: owner or admin reads" on public.academy_members for select to authenticated
  using ((select auth.uid()) = owner or public.is_admin());

/* ------------------------------------------------- who has premium (now with academies) */
create or replace function public.academy_owner_of(uid uuid) returns uuid
language sql stable security definer set search_path = '' as $$
  select m.owner from public.academy_members m
    join auth.users u on lower(u.email) = m.member_email
    join public.subscriptions s on s.user_id = m.owner
  where u.id = uid and s.plan = 'academy' and (s.until is null or s.until > now())
  limit 1
$$;
revoke execute on function public.academy_owner_of(uuid) from public, anon, authenticated;

create or replace function public.has_premium() returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_admin()
    or exists (select 1 from public.subscriptions s where s.user_id = auth.uid() and (s.until is null or s.until > now()))
    or public.academy_owner_of(auth.uid()) is not null
$$;

create or replace function public.my_access() returns json
language sql stable security definer set search_path = '' as $$
  with own as (select s.plan, s.until from public.subscriptions s where s.user_id = auth.uid() and (s.until is null or s.until > now())),
       acad as (select s.until from public.subscriptions s where s.user_id = public.academy_owner_of(auth.uid()))
  select json_build_object(
    'premium', exists (select 1 from own) or exists (select 1 from acad),
    'until', coalesce((select until from own), (select until from acad), (select s.until from public.subscriptions s where s.user_id = auth.uid())),
    'plan', coalesce((select plan from own), case when exists (select 1 from acad) then 'academy-member' end),
    'admin', public.is_admin(),
    'trialUsed', exists (select 1 from public.trials t where t.user_id = auth.uid()))
$$;

/* --------------------------------------------------------------- prices */
-- The price of a plan right now (the yearly launch promo while places are left).
create or replace function public.price_of(p text) returns json
language plpgsql stable security definer set search_path = '' as $$
declare cfg jsonb; base int; used int; lim int; pct int;
begin
  select value into cfg from public.app_settings where key = 'pricing';
  if p not in ('month', 'year', 'academy') then return null; end if;
  base := (cfg->>p)::int;
  if p = 'year' then
    lim := coalesce((cfg->>'promoLimit')::int, 0);
    pct := coalesce((cfg->>'promoYearPercent')::int, 0);
    select count(*) into used from public.payments where plan = 'year' and promo and status = 'paid';
    if lim > 0 and pct > 0 and used < lim then
      return json_build_object('amount', round(base * (100 - pct) / 100.0)::int, 'base', base, 'promo', true, 'left', lim - used);
    end if;
  end if;
  return json_build_object('amount', base, 'base', base, 'promo', false, 'left', 0);
end $$;
grant execute on function public.price_of(text) to anon, authenticated;

-- Everything the subscription card shows.
create or replace function public.my_offer() returns json
language sql stable security definer set search_path = '' as $$
  select json_build_object(
    'pricing', (select value from public.app_settings where key = 'pricing'),
    'month', public.price_of('month'), 'year', public.price_of('year'), 'academy', public.price_of('academy'),
    'click', (select value from public.app_settings where key = 'click'),
    'trialAvailable', auth.uid() is not null
      and not exists (select 1 from public.trials t where t.user_id = auth.uid())
      and not exists (select 1 from public.subscriptions s where s.user_id = auth.uid()))
$$;
grant execute on function public.my_offer() to anon, authenticated;

-- Free trial: once per account, only for accounts that never had a subscription.
create or replace function public.start_trial() returns text
language plpgsql security definer set search_path = '' as $$
declare days int;
begin
  if auth.uid() is null then return 'signin'; end if;
  if exists (select 1 from public.trials where user_id = auth.uid())
     or exists (select 1 from public.subscriptions where user_id = auth.uid()) then return 'used'; end if;
  select coalesce((value->>'trialDays')::int, 7) into days from public.app_settings where key = 'pricing';
  insert into public.trials (user_id) values (auth.uid());
  insert into public.subscriptions (user_id, plan, until, note) values (auth.uid(), 'trial', now() + make_interval(days => days), 'bepul sinov');
  return 'ok';
end $$;
revoke execute on function public.start_trial() from public, anon;
grant execute on function public.start_trial() to authenticated;

-- A new order; the amount is decided here, never by the browser.
create or replace function public.create_order(p text) returns json
language plpgsql security definer set search_path = '' as $$
declare pr json; oid bigint;
begin
  if auth.uid() is null then raise exception 'sign in first' using errcode = '42501'; end if;
  pr := public.price_of(p);
  if pr is null then raise exception 'unknown plan'; end if;
  insert into public.payments (user_id, plan, amount, promo) values (auth.uid(), p, (pr->>'amount')::int, (pr->>'promo')::boolean)
  returning id into oid;
  return json_build_object('id', oid, 'amount', (pr->>'amount')::int, 'click', (select value from public.app_settings where key = 'click'));
end $$;
revoke execute on function public.create_order(text) from public, anon;
grant execute on function public.create_order(text) to authenticated;

-- Academy owner: the coaches the subscription covers (replaces the list).
create or replace function public.academy_set_members(emails text[]) returns text
language plpgsql security definer set search_path = '' as $$
declare seats int; clean text[];
begin
  if not exists (select 1 from public.subscriptions s where s.user_id = auth.uid() and s.plan = 'academy' and (s.until is null or s.until > now()))
    then return 'not_academy'; end if;
  select coalesce((value->>'academySeats')::int, 10) into seats from public.app_settings where key = 'pricing';
  select coalesce(array_agg(distinct lower(trim(e))), '{}') into clean from unnest(emails) e where trim(e) like '%@%';
  if array_length(clean, 1) > seats then return 'too_many'; end if;
  delete from public.academy_members where owner = auth.uid();
  insert into public.academy_members (owner, member_email) select auth.uid(), e from unnest(clean) e;
  return 'ok';
end $$;
revoke execute on function public.academy_set_members(text[]) from public, anon;
grant execute on function public.academy_set_members(text[]) to authenticated;

/* ----------------------------------------------------------- Click SHOP API */
-- p = Click's request fields (all as text). Returns the JSON answer for Click.
-- Errors: 0 ok, -1 sign, -2 amount, -3 action, -4 already paid, -5 order not found,
--         -6 transaction not found, -8 bad request, -9 cancelled.
create or replace function public.click_callback(p jsonb) returns json
language plpgsql security definer set search_path = '' as $$
declare
  secret text; svc text; pay public.payments; act int; sign text; days int; ok_sign boolean;
  res jsonb := jsonb_build_object('click_trans_id', p->>'click_trans_id', 'merchant_trans_id', p->>'merchant_trans_id');
begin
  select value into secret from public.private_settings where key = 'click_secret';
  select value->>'service_id' into svc from public.app_settings where key = 'click';
  if secret is null or secret = '' then return res || '{"error":-8,"error_note":"Merchant is not configured"}'; end if;
  if coalesce(p->>'click_trans_id', '') = '' or coalesce(p->>'merchant_trans_id', '') = '' or coalesce(p->>'action', '') = ''
     or coalesce(p->>'sign_string', '') = '' then return res || '{"error":-8,"error_note":"Error in request from click"}'; end if;
  act := (p->>'action')::int;
  if act = 0 then
    sign := md5((p->>'click_trans_id') || (p->>'service_id') || secret || (p->>'merchant_trans_id') || (p->>'amount') || (p->>'action') || (p->>'sign_time'));
  elsif act = 1 then
    sign := md5((p->>'click_trans_id') || (p->>'service_id') || secret || (p->>'merchant_trans_id') || coalesce(p->>'merchant_prepare_id', '') || (p->>'amount') || (p->>'action') || (p->>'sign_time'));
  else
    return res || '{"error":-3,"error_note":"Action not found"}';
  end if;
  ok_sign := sign = lower(p->>'sign_string') and (svc = '' or svc is null or svc = p->>'service_id');
  if not ok_sign then return res || '{"error":-1,"error_note":"SIGN CHECK FAILED!"}'; end if;

  if (p->>'merchant_trans_id') !~ '^[0-9]+$' then return res || '{"error":-5,"error_note":"Order not found"}'; end if;
  select * into pay from public.payments where id = (p->>'merchant_trans_id')::bigint for update;
  if not found then return res || '{"error":-5,"error_note":"Order not found"}'; end if;
  if abs(pay.amount - (p->>'amount')::numeric) > 0.01 then return res || '{"error":-2,"error_note":"Incorrect parameter amount"}'; end if;
  if pay.status = 'paid' then return res || '{"error":-4,"error_note":"Already paid"}'; end if;
  if pay.status = 'cancelled' then return res || '{"error":-9,"error_note":"Transaction cancelled"}'; end if;

  if act = 0 then
    update public.payments set status = 'prepared', prepared_at = now(),
      click_trans_id = (p->>'click_trans_id')::bigint, click_paydoc_id = nullif(p->>'click_paydoc_id', '')::bigint
    where id = pay.id;
    return res || jsonb_build_object('merchant_prepare_id', pay.id, 'error', 0, 'error_note', 'Success');
  end if;

  -- complete
  if coalesce(p->>'merchant_prepare_id', '') <> pay.id::text or pay.status <> 'prepared' then
    return res || '{"error":-6,"error_note":"Transaction does not exist"}';
  end if;
  if coalesce((p->>'error')::int, 0) < 0 then
    update public.payments set status = 'cancelled', note = p->>'error_note' where id = pay.id;
    return res || '{"error":-9,"error_note":"Transaction cancelled"}';
  end if;
  update public.payments set status = 'paid', paid_at = now() where id = pay.id;
  days := case pay.plan when 'year' then 365 else 30 end;
  insert into public.subscriptions (user_id, plan, until, note, updated_at)
  values (pay.user_id, pay.plan, now() + make_interval(days => days), 'Click #' || pay.id, now())
  on conflict (user_id) do update set
    plan = excluded.plan,
    -- a running paid subscription is extended; a trial or an expired one starts from now
    until = case when public.subscriptions.plan in ('month', 'year', 'academy', 'manual') and public.subscriptions.until > now()
                 then public.subscriptions.until + make_interval(days => days)
                 else now() + make_interval(days => days) end,
    note = excluded.note, updated_at = now();
  return res || jsonb_build_object('merchant_confirm_id', pay.id, 'error', 0, 'error_note', 'Success');
end $$;
revoke execute on function public.click_callback(jsonb) from public, anon, authenticated;
grant execute on function public.click_callback(jsonb) to service_role;

/* --------------------------------------------------------- admin: payments */
create or replace function public.admin_payments(lim int default 200)
returns table (id bigint, email text, plan text, amount int, promo boolean, status text, created_at timestamptz, paid_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'not an admin' using errcode = '42501'; end if;
  return query select p.id, u.email::text, p.plan, p.amount, p.promo, p.status, p.created_at, p.paid_at
    from public.payments p join auth.users u on u.id = p.user_id
    order by p.id desc limit lim;
end $$;
revoke execute on function public.admin_payments(int) from public, anon;
grant execute on function public.admin_payments(int) to authenticated;
revoke execute on function public.admin_click_secret_set() from public, anon;
grant execute on function public.admin_click_secret_set() to authenticated;
revoke execute on function public.admin_set_click_secret(text) from public, anon;
grant execute on function public.admin_set_click_secret(text) to authenticated;
