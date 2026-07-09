"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories, getNotices, getProducts } from "@/lib/local-store";
import type { Category, Notice, Product } from "@/lib/types";

export function DashboardClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    setProducts(getProducts());
    setCategories(getCategories());
    setNotices(getNotices());
  }, []);

  const activeProducts = products.filter((product) => product.isAvailable).length;
  const activeNotice = notices.find((notice) => notice.isActive);

  return (
    <AdminDashboardLayout
      title="Dashboard"
      description="Overview of Cheta Homemade website content."
    >
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
            <p className="lead"><strong>{activeNotice.title}</strong><br />{activeNotice.message}</p>
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
