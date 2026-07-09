"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdminLoggedIn, logoutAdmin } from "@/lib/local-store";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/notices", label: "Notices" },
  { href: "/admin/contact", label: "Contact Info" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  function handleLogout() {
    logoutAdmin();
    router.replace("/admin/login");
  }

  if (!ready) return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link className="brand" href="/admin/dashboard">
          <span className="brand-mark">🍰</span>
          <span>Cheta Admin</span>
        </Link>
        <nav className="admin-nav" aria-label="Admin navigation">
          {links.map((link) => (
            <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/" target="_blank">View customer site</Link>
          <button type="button" onClick={handleLogout}>Logout</button>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
