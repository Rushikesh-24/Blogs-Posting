-- add admin-wide access to profiles so admins can manage users
alter table if exists public.profiles enable row level security;

drop policy if exists "admins manage all profiles" on public.profiles;
create policy "admins manage all profiles"
on public.profiles for all
using (
  exists (
    select 1 from public.profiles pr
    where pr.user_id = auth.uid() and pr.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles pr
    where pr.user_id = auth.uid() and pr.role = 'admin'
  )
);
