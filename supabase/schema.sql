-- Law firm website: database, security rules and starter content.
-- Run this whole file once in Supabase: SQL Editor -> New query -> paste -> Run.

create extension if not exists pgcrypto;

-- 1. Users and roles ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- 2. Content tables -----------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  firm_name text not null,
  whatsapp text,
  business_hours text,
  social_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.offices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  phones text[] not null default '{}',
  fax text,
  email text,
  map_query text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lawyers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text,
  photo_url text,
  biography text,
  practice_areas text[] not null default '{}',
  education text[] not null default '{}',
  qualifications text[] not null default '{}',
  email text,
  phone text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  image_url text,
  author text,
  author_id uuid references auth.users(id) on delete set null default auth.uid(),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Row-level security: this is what actually protects the data -------------
alter table public.profiles      enable row level security;
alter table public.site_settings enable row level security;
alter table public.offices       enable row level security;
alter table public.lawyers       enable row level security;
alter table public.articles      enable row level security;

-- A user can read only their own profile. Nobody can change roles from the website.
create policy "profiles: read own"  on public.profiles for select using (id = auth.uid());

create policy "settings: public read" on public.site_settings for select using (true);
create policy "settings: admin write" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

create policy "offices: public read active" on public.offices for select using (is_active);
create policy "offices: admin all"          on public.offices for all using (public.is_admin()) with check (public.is_admin());

create policy "lawyers: public read active" on public.lawyers for select using (is_active);
create policy "lawyers: admin all"          on public.lawyers for all using (public.is_admin()) with check (public.is_admin());

create policy "articles: public read published" on public.articles for select using (status = 'published');
create policy "articles: admin all"              on public.articles for all using (public.is_admin()) with check (public.is_admin());

-- 4. Image storage ------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict (id) do nothing;

create policy "images: public read"   on storage.objects for select using (bucket_id = 'images');
create policy "images: admin insert"  on storage.objects for insert with check (bucket_id = 'images' and public.is_admin());
create policy "images: admin update"  on storage.objects for update using (bucket_id = 'images' and public.is_admin());
create policy "images: admin delete"  on storage.objects for delete using (bucket_id = 'images' and public.is_admin());

-- 5. Starter content (edit later from the admin area) -----------------------
insert into public.site_settings (id, firm_name, whatsapp, business_hours) values
  (1, 'Tan & Rahman Advocates & Solicitors', '60123391446', 'Monday to Friday, 9:00 am to 6:00 pm')
on conflict (id) do nothing;

insert into public.offices (name, address, phones, fax, email, map_query, display_order) values
  ('Kuantan Office',
   E'A-9, Tingkat 2,\nJalan Seri Kuantan 2,\nSri Kuantan Square,\n25050 Kuantan,\nPahang Darul Makmur',
   array['09-515 8988', '09-515 8984', '09-515 8981'], '09-515 8980', 'nrhkuantan@gmail.com',
   'Sri Kuantan Square, Jalan Seri Kuantan 2, 25050 Kuantan, Pahang', 1),
  ('Mentakab Office',
   E'No. 7, Tingkat Atas,\nJalan Haji Kassim,\n28400 Mentakab,\nPahang Darul Makmur',
   array['09-277 9777'], null, 'general@rhcolegal.com',
   'Jalan Haji Kassim, 28400 Mentakab, Pahang', 2);

insert into public.lawyers (name, position, biography, practice_areas, education, qualifications, phone, display_order) values
  ('Aisyah Rahman', 'Managing Partner',
   $$Aisyah leads the firm's corporate practice. She advises owner-managed businesses on investments, governance and succession.$$,
   array['Corporate & Commercial Law'], array['LL.B. (Hons), University of Malaya'], array['Advocate & Solicitor, High Court of Malaya'], null, 1),
  ('David Tan', 'Senior Partner',
   $$David represents clients in commercial disputes and arbitration, with a focus on shareholder and construction matters.$$,
   array['Litigation'], array['LL.B. (Hons), University of London'], array['Barrister-at-Law, Lincoln''s Inn'], null, 2),
  ('Nurul Hana Ismail', 'Partner',
   $$Nurul Hana acts for buyers, developers and banks on residential and commercial property transactions.$$,
   array['Conveyancing & Property'], array['LL.B. (Hons), International Islamic University Malaysia'], '{}', null, 3),
  ('Kelly Chan', 'Associate', null,
   '{}', array['LL.B (Hons), Queen''s University Belfast', 'LL.M., Nottingham Law School'], array['Barrister of the Inner Temple'], '012-339 1446', 4);

insert into public.articles (title, slug, excerpt, content, author, status, published_at) values
  ('Buying your first home: the legal steps in order', 'buying-your-first-home',
   'What happens between signing the offer and receiving the keys.',
   $$A property purchase has several legal stages. Knowing them early prevents delays and surprises.

First, you pay a booking fee and sign a sale and purchase agreement. Your lawyer checks the title, searches for encumbrances and confirms the seller can transfer it.

Next comes financing. Your bank issues a letter of offer and your lawyer prepares the loan agreement and charge. Stamp duty is paid before the transfer is registered.

Finally, the balance is released and vacant possession is handed over. Keep all signed copies in one safe place.$$,
   'Nurul Hana Ismail', 'published', '2026-10-12'),
  ('Why every private company needs a shareholders'' agreement', 'shareholders-agreement',
   'The company constitution is not enough when owners disagree.',
   $$A constitution sets out how a company runs. A shareholders' agreement sets out how the owners deal with each other.

It can cover how decisions are made, what happens if a shareholder leaves, and how shares are valued and sold.

Agreeing these terms when relations are good is far cheaper than arguing about them later.$$,
   'Aisyah Rahman', 'published', '2026-09-28'),
  ('Court, arbitration or mediation: choosing how to resolve a dispute', 'court-arbitration-or-mediation',
   'A short comparison of cost, speed and privacy.',
   $$Court judgments are public, binding and can be appealed. They suit disputes where precedent or enforcement powers matter.

Arbitration is private and decided by an expert you help choose. It is often faster, but fees can be high.

Mediation is non-binding and cheapest. If it works, both sides keep control of the outcome. Many contracts require you to try it first.$$,
   'David Tan', 'published', '2026-09-09');

-- 6. Make your first administrator --------------------------------------------
-- a) In Supabase: Authentication -> Users -> Add user (email + password, tick "Auto confirm").
-- b) Then run this with that email:
--
--   update public.profiles set role = 'admin' where email = 'you@example.com';
