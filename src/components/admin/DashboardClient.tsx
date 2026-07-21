"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCategories, fetchNotices, fetchProducts } from "@/lib/data";
import type { Category, Notice, Product } from "@/lib/types";

export function DashboardClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void Promise.all([fetchProducts(), fetchCategories(), fetchNotices()])
      .then(([nextProducts, nextCategories, nextNotices]) => {
        setProducts(nextProducts);
        setCategories(nextCategories);
        setNotices(nextNotices);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard."));
  }, []);

  const activeProducts = products.filter((product) => product.isAvailable).length;
  const activeNotice = notices.find((notice) => notice.isActive);

  return (
    <AdminDashboardLayout title="Dashboard" description="Overview of Cheta Homemade website content.">
      {error ? <p className="prototype-note" role="alert">{error}</p> : null}
      <div className="admin-grid-3">
        <div className="stat-card"><span className="muted">Total products</span><strong>{products.length}</strong></div>
        <div className="stat-card"><span className="muted">Active products</span><strong>{activeProducts}</strong></div>
        <div className="stat-card"><span className="muted">Categories</span><strong>{categories.length}</strong></div>
      </div>

      <div className="admin-dashboard-grid" style={{ marginTop: 20 }}>
        <div className="admin-card">
          <h3>Quick actions</h3>
          <div className="card-actions">
            <Link className="btn btn-primary" href="/admin/products/new">Add product</Link>
            <Link className="btn btn-secondary" href="/admin/notices">Manage notice</Link>
            <Link className="btn btn-secondary" href="/admin/contact">Update contact</Link>
          </div>
        </div>
        <div className="admin-card">
          <h3>Current notice</h3>
          {activeNotice ? (
            <p className="lead"><strong>{activeNotice.titleMs}</strong><br />{activeNotice.messageMs}</p>
          ) : (
            <p className="muted">No active notice right now.</p>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export function AdminDashboardLayout({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <>
      <span className="eyebrow">🔐 Admin Panel</span>
      <h1 style={{ fontSize: "clamp(2.6rem, 5vw, 4.8rem)" }}>{title}</h1>
      <p className="lead">{description}</p>
      <div style={{ marginTop: 26 }}>{children}</div>
    </>
  );
}
