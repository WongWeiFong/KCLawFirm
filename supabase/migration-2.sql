-- Migration 2: editable About page, Practice areas and FAQ.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- (Run schema.sql first if this is a brand new project.)

-- Tables ----------------------------------------------------------------------
create table if not exists public.site_pages (
  slug text primary key,
  title text not null,
  body text not null default '',
  items_title text,
  items text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.practice_areas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short text,
  body text not null default '',
  items text[] not null default '{}',
  category text not null default 'Core' check (category in ('Core', 'Other')),
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Security rules ----------------------------------------------------------------
alter table public.site_pages     enable row level security;
alter table public.practice_areas enable row level security;
alter table public.faqs           enable row level security;

create policy "pages: public read"  on public.site_pages for select using (true);
create policy "pages: admin all"    on public.site_pages for all using (public.is_admin()) with check (public.is_admin());

create policy "practice: public read active" on public.practice_areas for select using (is_active);
create policy "practice: admin all"          on public.practice_areas for all using (public.is_admin()) with check (public.is_admin());

create policy "faqs: public read active" on public.faqs for select using (is_active);
create policy "faqs: admin all"          on public.faqs for all using (public.is_admin()) with check (public.is_admin());

-- Starter content (edit later in the admin area) -------------------------------------
insert into public.site_pages (slug, title, body, items_title, items) values
  ('about', 'About the firm',
   $$We are a law firm serving clients from our offices in Kuantan and Mentakab, Pahang. We keep the firm focused so the person who advises you is the person who does your work.$$,
   'How we work',
   array['We explain the law and your options in plain language.',
         'We give a fee estimate in writing before work starts.',
         'We tell you when a matter is better settled than fought.',
         'We keep you updated, and return calls within one working day.'])
on conflict (slug) do nothing;

insert into public.practice_areas (slug, name, short, body, items, category, display_order) values
  ('corporate', 'Corporate & Commercial Law', 'Company formation, contracts, mergers and shareholder matters.',
   $$We act for founders, family businesses and listed companies on the legal side of running and growing a business.

We draft and negotiate commercial contracts, advise boards on directors' duties, and guide clients through investments, joint ventures and restructurings.$$,
   array['Company incorporation and governance','Shareholder and joint venture agreements','Mergers, acquisitions and investments','Commercial contracts and licensing','Regulatory compliance'], 'Core', 1),
  ('litigation', 'Litigation', 'Court and arbitration representation in civil and commercial disputes.',
   $$When a dispute cannot be settled, we represent clients before the courts and arbitral tribunals.

We start by assessing your position and costs honestly, then recommend negotiation, mediation or trial based on what you want to achieve.$$,
   array['Contract and debt recovery disputes','Shareholder and partnership disputes','Arbitration and mediation','Employment and tenancy disputes','Appeals'], 'Core', 2),
  ('property', 'Conveyancing & Property', 'Buying, selling, financing and developing property.',
   $$We handle property transactions from the first offer to the transfer of title, and keep you updated at each step.

Our team also advises developers, landlords and lenders on tenancy, financing and strata matters.$$,
   array['Sale and purchase agreements','Loan documentation and discharge of charge','Tenancy and lease agreements','Strata title and land matters','Property development'], 'Core', 3),
  ('family', 'Family Law', 'Divorce, custody, maintenance and wills.',
   $$We help families through separation and planning with clarity and discretion.

We advise on divorce, child custody, maintenance, matrimonial assets and wills.$$,
   array['Divorce and separation','Custody and maintenance','Matrimonial assets','Wills and estate planning'], 'Other', 4),
  ('employment', 'Employment Law', 'Advice for employers and employees.',
   $$We advise on contracts, restructuring, misconduct inquiries and dismissals, and appear at the Industrial Court.$$,
   array['Employment contracts and policies','Misconduct inquiries','Wrongful dismissal claims','Retrenchment and restructuring'], 'Other', 5),
  ('ip', 'Intellectual Property', 'Trade marks, copyright and brand protection.',
   $$We register and enforce trade marks, advise on copyright and licensing, and help businesses protect what they have built.$$,
   array['Trade mark filing and renewal','Copyright and licensing','Brand enforcement','IP clauses in commercial contracts'], 'Other', 6)
on conflict (slug) do nothing;

insert into public.faqs (question, answer, display_order) values
  ('Do you offer a first consultation?', 'Yes. Call, email or message us to arrange a first conversation. We will tell you whether we can help and explain how our fees work before you commit.', 1),
  ('How much will my matter cost?', 'Fees depend on the work involved. Conveyancing usually follows a scale of fees, and other matters are quoted as a fixed fee or hourly rate. We give you an estimate in writing.', 2),
  ('What should I bring to my first meeting?', 'Bring your identity document, any contracts or letters about the matter, and a short timeline of events. Do not worry if your papers are incomplete.', 3),
  ('Is what I tell you confidential?', 'Yes. Communications with your lawyer are protected by legal professional privilege and our duty of confidentiality.', 4),
  ('Can I contact the firm online instead of visiting?', 'Yes. We take enquiries by phone and email, and we can hold meetings by video call.', 5),
  ('Do you act for clients outside Kuantan and Mentakab?', 'Yes. We act for clients across Pahang and the rest of Malaysia, and for overseas clients with Malaysian matters.', 6);
