-- Telegram bot (functions/api/tg/*). Run once in Supabase → SQL Editor. Running it again is safe.
-- Who pressed Start in the bot, which Pro Football account their Telegram is tied to, and who gets news.
-- Only the server (service key, Cloudflare functions) reads and writes it; admins can read it.

create table if not exists public.tg_users (
  tg_id      bigint primary key,
  user_id    uuid references auth.users(id) on delete set null,
  first_name text,
  username   text,
  lang       text not null default 'uz',
  subscribed boolean not null default false,
  blocked    boolean not null default false,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tg_users_user on public.tg_users(user_id);
create index if not exists tg_users_news on public.tg_users(tg_id) where subscribed and not blocked;

alter table public.tg_users enable row level security;
drop policy if exists "tg: admin reads" on public.tg_users;
create policy "tg: admin reads" on public.tg_users for select to authenticated using (public.is_admin());

select 'telegram: ok' as result, count(*) as users from public.tg_users;
