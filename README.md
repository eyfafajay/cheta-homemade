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

## System Architecture

![System Architecture](public/architecture/system-architecture.png)

The Cheta Homemade website adopts a layered web-based architecture that consists of the customer interface, admin interface, application layer, backend service layer, and deployment layer. The frontend is developed using Next.js and hosted on Vercel, while GitHub is used for version control and deployment tracking.

The public customer interface allows users to access the website without authentication. Customers can view the homepage, browse product categories, view product listings and product details, read active notices, and contact Cheta Homemade through WhatsApp. This ensures that the customer experience remains simple and accessible.

The private admin interface is separated from the customer-facing pages. The admin panel is intended for the business owner to manage website content, including products, categories, notices, and contact information. This reduces the need to modify the source code whenever product information or announcements need to be updated.

For the current release, the system operates using local/mock data to demonstrate the website interface and admin workflow. In the next development phase, Supabase will be integrated as the backend service. Supabase Auth will handle secure admin authentication, Supabase PostgreSQL will store product and notice data, and Supabase Storage will manage uploaded product and craft images.

This architecture allows the system to remain user-friendly for customers, easy to manage for the admin, and scalable for future backend integration.

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
