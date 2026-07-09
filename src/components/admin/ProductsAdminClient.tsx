"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { deleteProduct, formatPrice, getCategories, getProducts, saveProducts } from "@/lib/local-store";
import type { Category, Product } from "@/lib/types";

export function ProductsAdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  function reload() {
    setProducts(getProducts());
    setCategories(getCategories());
  }

  useEffect(() => {
    reload();
  }, []);

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((category) => [category.slug, category.name])), [categories]);

  function handleDelete(productId: string) {
    const confirmed = confirm("Delete this product?");
    if (!confirmed) return;
    deleteProduct(productId);
    reload();
  }

  function toggleAvailability(productId: string) {
    const nextProducts = products.map((product) => (
      product.id === productId ? { ...product, isAvailable: !product.isAvailable } : product
    ));
    saveProducts(nextProducts);
    setProducts(nextProducts);
  }

  return (
    <div className="table-card">
      <div className="section-header" style={{ marginBottom: 10 }}>
        <div>
          <h3>Product list</h3>
          <p className="muted">Manage all product data before Supabase integration.</p>
        </div>
        <Link className="btn btn-primary" href="/admin/products/new">Add product</Link>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Starting price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const prices = product.options.map((option) => option.price).filter((price) => price > 0);
              const startingPrice = prices.length ? formatPrice(Math.min(...prices)) : "Price TBA";
              return (
                <tr key={product.id}>
                  <td><strong>{product.name}</strong><br /><span className="muted">{product.description}</span></td>
                  <td>{categoryMap[product.categorySlug] ?? product.categorySlug}</td>
                  <td>{startingPrice}</td>
                  <td><span className={`badge ${product.isAvailable ? "badge-green" : "badge-muted"}`}>{product.isAvailable ? "Available" : "Unavailable"}</span></td>
                  <td>
                    <div className="inline-actions">
                      <Link className="btn btn-secondary btn-small" href={`/admin/products/${product.id}/edit`}>Edit</Link>
                      <button className="btn btn-secondary btn-small" type="button" onClick={() => toggleAvailability(product.id)}>{product.isAvailable ? "Hide" : "Show"}</button>
                      <button className="btn btn-danger btn-small" type="button" onClick={() => handleDelete(product.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
