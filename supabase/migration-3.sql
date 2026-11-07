-- Migration 3: staff role. Run once in Supabase SQL Editor (after schema.sql and migration-2.sql).

-- 1. Extra profile details and the new role ---------------------------------------
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists is_active boolean not null default true;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('admin', 'staff', 'viewer'));

-- 2. Permission helpers (inactive accounts have no permissions) -----------------------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and is_active);
$$;

-- Admin or staff: may edit website content.
create or replace function public.can_edit_content()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff') and is_active);
$$;

-- 3. Profiles: users read their own row, admins read all. Writes go through the server function only.
create policy "profiles: admin read all" on public.profiles for select using (public.is_admin());

-- 4. Content tables: admin AND staff can edit ----------------------------------------
drop policy if exists "settings: admin write" on public.site_settings;
create policy "settings: editors write" on public.site_settings for all using (public.can_edit_content()) with check (public.can_edit_content());

drop policy if exists "offices: admin all" on public.offices;
create policy "offices: editors all" on public.offices for all using (public.can_edit_content()) with check (public.can_edit_content());

drop policy if exists "lawyers: admin all" on public.lawyers;
create policy "lawyers: editors all" on public.lawyers for all using (public.can_edit_content()) with check (public.can_edit_content());

drop policy if exists "articles: admin all" on public.articles;
create policy "articles: editors all" on public.articles for all using (public.can_edit_content()) with check (public.can_edit_content());

drop policy if exists "pages: admin all" on public.site_pages;
create policy "pages: editors all" on public.site_pages for all using (public.can_edit_content()) with check (public.can_edit_content());

drop policy if exists "practice: admin all" on public.practice_areas;
create policy "practice: editors all" on public.practice_areas for all using (public.can_edit_content()) with check (public.can_edit_content());

drop policy if exists "faqs: admin all" on public.faqs;
create policy "faqs: editors all" on public.faqs for all using (public.can_edit_content()) with check (public.can_edit_content());

-- 5. Image storage ---------------------------------------------------------------------
drop policy if exists "images: admin insert" on storage.objects;
drop policy if exists "images: admin update" on storage.objects;
drop policy if exists "images: admin delete" on storage.objects;
create policy "images: editors insert" on storage.objects for insert with check (bucket_id = 'images' and public.can_edit_content());
create policy "images: editors update" on storage.objects for update using (bucket_id = 'images' and public.can_edit_content());
create policy "images: editors delete" on storage.objects for delete using (bucket_id = 'images' and public.can_edit_content());
