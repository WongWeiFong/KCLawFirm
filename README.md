# Law Firm Website (React + Vite + Supabase)

One React app containing the public website and a protected admin area.
Backend: Supabase (authentication, Postgres database, image storage). Hosting: Vercel.

## 1. Set up Supabase (about 10 minutes)

1. Create a project at https://supabase.com.
2. Open **SQL Editor**, paste all of `supabase/schema.sql` and run it. This creates the tables,
   the security rules, the image bucket and starter content.
3. Run `supabase/migration-2.sql`, `supabase/migration-3.sql`, `supabase/migration-4.sql`, and
   `supabase/migration-5.sql` in order to add the remaining content tables, staff support, and
   staff presence.
4. **Authentication → Users → Add user**: create the administrator (email + password, tick *Auto confirm*).
5. Run this in the SQL Editor with that email to make the account an administrator:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
6. **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up" so nobody else can register.
7. **Project Settings → API**: copy the Project URL and the `anon` public key.

The admin area shows staff presence and last login in the right panel. Presence is refreshed every
30 seconds; accounts are considered online for 90 seconds after their last update. Only staff
accounts appear in this list, so administrator names are not exposed. Run migration 5 on an
existing project to enable this feature.

## 2. Run locally

```bash
cp .env.example .env.local     # then paste the two values from step 7
npm install
npm run dev
```

Public site: http://localhost:5173 — Admin: http://localhost:5173/admin/login

## 3. Deploy to Vercel

1. Push to GitHub (`.env.local` is git-ignored).
2. Import the repository in Vercel (Framework: Vite, build `npm run build`, output `dist`).
3. **Settings → Environment Variables**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then redeploy.
4. In Supabase **Authentication → URL Configuration**, set the Site URL to your Vercel domain.

`vercel.json` already rewrites all paths to `index.html` so links such as `/articles/my-post` work on refresh.

## Security notes

- Only the **anon** key goes in the frontend. Never put the `service_role` key in this project or in Vercel variables.
- The anon key is meant to be public. Protection comes from the row-level security rules in `schema.sql`:
  visitors can read only published articles, active lawyers and active offices; only an `admin` can write anything.
- `ProtectedRoute` only hides admin screens. Even if someone bypassed it, the database would refuse the changes.
- Passwords are handled by Supabase Auth. No credentials exist in the source code.
- Article text is rendered as plain paragraphs (no raw HTML), which avoids script injection.

## Structure

```text
src/
├── components/{public,admin,common}
├── pages/{public,admin}
├── services/        auth, articles, lawyers, office, storage (all database calls)
├── context/         AuthContext, SiteContext
├── routes/          ProtectedRoute
├── hooks/  lib/  data/
supabase/schema.sql
```

Practice areas and the FAQ are static (`src/data/staticContent.js`) because they are not in the admin requirements.
