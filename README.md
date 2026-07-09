# Cheta Homemade Website

![Status](https://img.shields.io/badge/status-In%20Progress-yellow)
![Platform](https://img.shields.io/badge/platform-Web-purple)
![Framework](https://img.shields.io/badge/framework-Next.js-blue)
![Backend](https://img.shields.io/badge/backend-Supabase-green)
![Hosting](https://img.shields.io/badge/hosting-Vercel-black)
![Version Control](https://img.shields.io/badge/version%20control-GitHub-lightgrey)

A website for **Cheta Homemade** to showcase cakes, pastries, desserts, roti, and craft items with a separate admin panel for content management.

## Current Version

This version is a frontend prototype using mock data and browser `localStorage`.

Supabase is **not connected yet**. The project is already structured so Supabase can be added later for:

- Admin authentication
- PostgreSQL product data
- Product categories
- Product options
- Notices
- Contact settings
- Supabase Storage image uploads

## Main Features

### Customer Website

- Home page
- Product listing
- Category filtering
- Product detail page
- Notice popup
- Contact page
- WhatsApp order button
- No customer login required

### Admin Website

- Separate admin route: `/admin/login`
- Dashboard
- Manage products
- Add/edit/delete products
- Manage categories
- Manage notices
- Manage contact information

> Prototype note: Admin login currently stores a demo session in `localStorage`. Supabase Auth will replace this later.

## Routes

### Customer Routes

| Page | Route |
|---|---|
| Home | `/` |
| Products | `/products` |
| Category | `/products/[category]` |
| Product Details | `/products/item/[id]` |
| Contact | `/contact` |

### Admin Routes

| Page | Route |
|---|---|
| Admin Login | `/admin/login` |
| Dashboard | `/admin/dashboard` |
| Products | `/admin/products` |
| Add Product | `/admin/products/new` |
| Edit Product | `/admin/products/[id]/edit` |
| Categories | `/admin/categories` |
| Notices | `/admin/notices` |
| Contact Settings | `/admin/contact` |

## Tech Stack

- Next.js
- React
- TypeScript
- CSS
- Future backend: Supabase
- Future deployment: Vercel
- Version control: GitHub

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin login page:

```text
http://localhost:3000/admin/login
```

## Future Supabase Integration

The future tables can be:

- `admin_profiles`
- `categories`
- `products`
- `product_options`
- `product_images`
- `notices`
- `contact_settings`

Future storage bucket:

- `product-images`

Environment variables will be added later in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not commit `.env.local` to GitHub.

## Notes

- Product data is currently stored in `src/lib/mock-data.ts`.
- Admin updates are saved in browser `localStorage` for prototype testing.
- If you clear browser storage, the website will return to the default product data.
- Real image upload will be added later using Supabase Storage.
