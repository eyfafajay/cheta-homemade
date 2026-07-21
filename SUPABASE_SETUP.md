# Supabase Setup Guide

This version no longer uses mock data or browser `localStorage` for business content. Products, categories, notices, contact details, admin authentication, and product images are loaded from Supabase.

## 1. Create the Supabase project

1. Sign in to Supabase.
2. Select **New project**.
3. Use a name such as `cheta-homemade`.
4. Save the database password safely.
5. Choose the nearest available region.
6. Wait until the project is ready.

## 2. Create the database and storage policies

1. Open the project in Supabase.
2. Go to **SQL Editor**.
3. Open `supabase/schema.sql` from this project.
4. Copy the whole SQL file into the editor.
5. Select **Run**.

The SQL creates:

- `admin_profiles`
- `categories`
- `products`
- `product_options`
- `notices`
- `contact_settings`
- Public `product-images` Storage bucket
- Row Level Security policies

The tables intentionally start empty. Enter all real business data through the admin dashboard after setup.

## 3. Create the admin account

1. In Supabase, open **Authentication → Users**.
2. Select **Add user**.
3. Enter your mom's admin email and a strong password.
4. Create the user and copy the new user's UUID.
5. Return to **SQL Editor** and run this after replacing both values:

```sql
insert into public.admin_profiles (user_id, email)
values ('PASTE_AUTH_USER_UUID_HERE', 'admin-email@example.com');
```

Only users listed in `admin_profiles` can add, edit, or delete website content.

Recommended: keep public user registration disabled because customers do not need accounts.

## 4. Add the local environment variables

1. Copy `.env.example` and rename the copy to `.env.local`.
2. In Supabase, open the project's **Connect** dialog or API settings.
3. Copy the Project URL and publishable key.
4. Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

For an older Supabase project that displays only an anon key, use:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Do not add the service-role key to this website and do not commit `.env.local` to GitHub.

## 5. Install and test locally

```bash
npm install
npm run dev
```

Open the URL printed by Next.js, normally:

```text
http://localhost:3000
```

Admin login:

```text
http://localhost:3000/admin/login
```

Use the email and password created in Supabase Authentication.

## 6. Add the real website data

Use the admin dashboard in this order:

1. **Categories** — add BM and English names/descriptions and arrange their order.
2. **Contact Info** — add WhatsApp, phone, pickup information, business hours, and instructions.
3. **Products** — add products, prices, availability, and upload images.
4. **Notices** — add an optional active customer notice.

The Products dropdown, homepage category showcase, category cards, filters, product pages, notice, and contact page all read directly from Supabase.

## 7. Add environment variables to Vercel

1. Open the Cheta Homemade project in Vercel.
2. Go to **Settings → Environment Variables**.
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Apply them to Production, Preview, and Development as needed.
5. Redeploy the project.

## 8. Verification checklist

- Customer pages open without login.
- Admin routes redirect to `/admin/login` when logged out.
- Correct admin credentials open the dashboard.
- A non-admin Supabase user cannot access or modify admin data.
- New categories appear in the customer Products dropdown and homepage.
- New products appear on the customer pages.
- Uploaded product images are visible publicly.
- Category rearrangement is reflected on the customer website.
- BM and EN content changes with the language switch.
- The active notice appears below the header and can be dismissed.
