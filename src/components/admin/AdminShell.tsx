"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      const target = event.target as Node;
      if (!sidebarRef.current?.contains(target) && !menuButtonRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function handleLogout() {
    logoutAdmin();
    router.replace("/admin/login");
  }

  if (!ready) return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" ref={sidebarRef}>
        <div className="admin-sidebar-header">
          <Link className="brand" href="/admin/dashboard" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">🍰</span>
            <span>Cheta Admin</span>
          </Link>

          <button
            className="admin-menu-toggle"
            type="button"
            ref={menuButtonRef}
            aria-expanded={menuOpen}
            aria-controls="admin-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="admin-menu-icon" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <strong>Menu</strong>
          </button>
        </div>

        <nav className={`admin-nav ${menuOpen ? "open" : ""}`} id="admin-navigation" aria-label="Admin navigation">
          {links.map((link) => (
            <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/" target="_blank" onClick={() => setMenuOpen(false)}>View customer site</Link>
          <button type="button" onClick={handleLogout}>Logout</button>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
