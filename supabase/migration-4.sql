-- Migration 4: allow active admins and staff to update their own name and phone.
-- Run in Supabase SQL Editor after migration-3.sql.

revoke update on table public.profiles from anon, authenticated;
grant update (full_name, phone) on table public.profiles to authenticated;

drop policy if exists "profiles: update own contact details" on public.profiles;
create policy "profiles: update own contact details"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid() and role in ('admin', 'staff') and is_active)
  with check (id = auth.uid() and role in ('admin', 'staff') and is_active);
