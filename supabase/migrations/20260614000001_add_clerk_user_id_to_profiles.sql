alter table public.profiles
add column if not exists clerk_user_id text;

update public.profiles
set clerk_user_id = id
where clerk_user_id is null;

alter table public.profiles
alter column clerk_user_id set not null;

create unique index if not exists profiles_clerk_user_id_key
on public.profiles(clerk_user_id);

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using (clerk_user_id = auth.jwt() ->> 'sub');

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (clerk_user_id = auth.jwt() ->> 'sub')
with check (clerk_user_id = auth.jwt() ->> 'sub');
