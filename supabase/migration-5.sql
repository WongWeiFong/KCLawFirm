-- Migration 5: staff presence and last-login tracking.
-- Run in Supabase SQL Editor after migration-4.sql.

alter table public.profiles
  add column if not exists last_seen_at timestamptz,
  add column if not exists last_login_at timestamptz;

create or replace function public.record_staff_presence(
  p_is_login boolean default false,
  p_signed_out boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  account_role text;
  account_active boolean;
begin
  select role, is_active into account_role, account_active
  from public.profiles
  where id = auth.uid();

  if account_role not in ('admin', 'staff') or not account_active then
    return;
  end if;

  update public.profiles
  set last_seen_at = case when p_signed_out then null else now() end,
      last_login_at = case when p_is_login then now() else last_login_at end
  where id = auth.uid();
end;
$$;

revoke all on function public.record_staff_presence(boolean, boolean) from public, anon;
grant execute on function public.record_staff_presence(boolean, boolean) to authenticated;

create or replace function public.get_staff_presence()
returns table (
  id uuid,
  full_name text,
  last_seen_at timestamptz,
  last_login_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select staff.id, staff.full_name, staff.last_seen_at, staff.last_login_at
  from public.profiles as staff
  where staff.role = 'staff'
    and exists (
      select 1
      from public.profiles as caller
      where caller.id = auth.uid()
        and caller.role in ('admin', 'staff')
        and caller.is_active
    )
  order by staff.full_name nulls last;
$$;

revoke all on function public.get_staff_presence() from public, anon;
grant execute on function public.get_staff_presence() to authenticated;
