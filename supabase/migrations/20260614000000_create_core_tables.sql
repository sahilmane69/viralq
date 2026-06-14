create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id text primary key,
  clerk_user_id text unique not null,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  profile_id text not null references public.profiles(id) on delete cascade,
  title text not null,
  video_url text,
  thumbnail_url text,
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'completed', 'failed')),
  score integer check (score >= 0 and score <= 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null unique references public.analyses(id) on delete cascade,
  profile_id text not null references public.profiles(id) on delete cascade,
  summary text,
  hook_score integer check (hook_score >= 0 and hook_score <= 100),
  pacing_score integer check (pacing_score >= 0 and pacing_score <= 100),
  clarity_score integer check (clarity_score >= 0 and clarity_score <= 100),
  share_score integer check (share_score >= 0 and share_score <= 100),
  recommendations jsonb not null default '[]'::jsonb,
  raw_report jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists analyses_profile_id_created_at_idx
  on public.analyses(profile_id, created_at desc);

create index if not exists reports_profile_id_created_at_idx
  on public.reports(profile_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists analyses_set_updated_at on public.analyses;
create trigger analyses_set_updated_at
before update on public.analyses
for each row execute function public.set_updated_at();

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
before update on public.reports
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.analyses enable row level security;
alter table public.reports enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using (clerk_user_id = auth.jwt() ->> 'sub');

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (clerk_user_id = auth.jwt() ->> 'sub')
with check (clerk_user_id = auth.jwt() ->> 'sub');

drop policy if exists "Users can read own analyses" on public.analyses;
create policy "Users can read own analyses"
on public.analyses for select
using (profile_id = auth.jwt() ->> 'sub');

drop policy if exists "Users can read own reports" on public.reports;
create policy "Users can read own reports"
on public.reports for select
using (profile_id = auth.jwt() ->> 'sub');
