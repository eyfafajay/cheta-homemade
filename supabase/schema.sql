-- Cheta Homemade database, authentication authorization, and storage policies.
-- Run this file once in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ms text not null,
  name_en text not null,
  description_ms text not null default '',
  description_en text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name_ms text not null,
  name_en text not null,
  description_ms text not null default '',
  description_en text not null default '',
  image_path text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  price numeric(10,2) not null default 0 check (price >= 0),
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title_ms text not null,
  title_en text not null,
  message_ms text not null,
  message_en text not null,
  is_active boolean not null default false,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_notice_dates check (end_date is null or start_date is null or end_date >= start_date)
);

create table if not exists public.contact_settings (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text not null default '',
  phone_number text not null default '',
  instagram_url text,
  facebook_url text,
  pickup_area_ms text not null default '',
  pickup_area_en text not null default '',
  business_hours_ms text not null default '',
  business_hours_en text not null default '',
  order_instructions_ms text not null default '',
  order_instructions_en text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists product_options_product_id_idx on public.product_options(product_id);
create index if not exists categories_sort_order_idx on public.categories(sort_order);
create index if not exists notices_active_idx on public.notices(is_active);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists notices_set_updated_at on public.notices;
create trigger notices_set_updated_at
before update on public.notices
for each row execute function public.set_updated_at();

drop trigger if exists contact_settings_set_updated_at on public.contact_settings;
create trigger contact_settings_set_updated_at
before update on public.contact_settings
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.admin_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_options enable row level security;
alter table public.notices enable row level security;
alter table public.contact_settings enable row level security;

drop policy if exists "Admin can view own profile" on public.admin_profiles;
create policy "Admin can view own profile"
on public.admin_profiles for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Public can read product options" on public.product_options;
create policy "Public can read product options"
on public.product_options for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage product options" on public.product_options;
create policy "Admins can manage product options"
on public.product_options for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Public can read notices" on public.notices;
create policy "Public can read notices"
on public.notices for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage notices" on public.notices;
create policy "Admins can manage notices"
on public.notices for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Public can read contact settings" on public.contact_settings;
create policy "Public can read contact settings"
on public.contact_settings for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage contact settings" on public.contact_settings;
create policy "Admins can manage contact settings"
on public.contact_settings for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

grant select on public.categories, public.products, public.product_options, public.notices, public.contact_settings to anon;
grant select, insert, update, delete on public.categories, public.products, public.product_options, public.notices, public.contact_settings to authenticated;
grant select on public.admin_profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and (select public.is_admin()));

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and (select public.is_admin()))
with check (bucket_id = 'product-images' and (select public.is_admin()));

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and (select public.is_admin()));
