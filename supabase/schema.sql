-- Menulift Supabase/Postgres setup
-- Run this entire file once in Supabase: SQL Editor -> New query -> Run.

create table if not exists public.leads (
  id text primary key,
  type text not null check (type in ('booking', 'quiz', 'partner')),
  created_at text not null,
  name text not null default '',
  phone text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'showed', 'paid', 'closed', 'cancelled')),
  note text not null default '',
  slot_date text,
  slot_time text,
  channel text,
  go_live text,
  budget text,
  kitchen text,
  score integer,
  missing text,
  source text,
  utm text
);

create table if not exists public.settings (
  key text primary key,
  value text not null
);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'settings'
      and column_name = 'k'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'settings'
      and column_name = 'key'
  ) then
    alter table public.settings rename column k to key;
  end;
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'settings'
      and column_name = 'v'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'settings'
      and column_name = 'value'
  ) then
    alter table public.settings rename column v to value;
  end;
end $$;

create unique index if not exists uniq_slot
  on public.leads (slot_date, slot_time)
  where type = 'booking' and status <> 'cancelled';

create index if not exists idx_created
  on public.leads (created_at desc);

create index if not exists idx_phone
  on public.leads (phone);

create index if not exists idx_type
  on public.leads (type, created_at desc);

-- Keep tables inaccessible through Supabase's public REST API.
-- The Next.js server uses DATABASE_URL and remains the only application access point.
alter table public.leads enable row level security;
alter table public.settings enable row level security;

-- Strip existing broad policies if they were accidentally created earlier.
drop policy if exists "Public can read leads" on public.leads;
drop policy if exists "Public can manage leads" on public.leads;
drop policy if exists "Public can read settings" on public.settings;
drop policy if exists "Public can manage settings" on public.settings;

-- Test that the setup was created.
select 'leads' as table_name, count(*) as rows from public.leads
union all
select 'settings' as table_name, count(*) as rows from public.settings;
