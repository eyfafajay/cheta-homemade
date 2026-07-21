"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { deleteProduct, fetchCategories, fetchProducts, setProductAvailability } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";

export function ProductsAdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  async function reload() {
    const [nextProducts, nextCategories] = await Promise.all([fetchProducts(), fetchCategories()]);
    setProducts(nextProducts);
    setCategories(nextCategories);
  }

  useEffect(() => {
    void reload().catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load products."));
  }, []);

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.slug, `${category.nameMs} / ${category.nameEn}`])),
    [categories]
  );

  async function handleDelete(productId: string) {
    const confirmed = confirm("Delete this product?");
    if (!confirmed) return;
    setError("");
    try {
      await deleteProduct(productId);
      await reload();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete product.");
    }
  }

  async function toggleAvailability(product: Product) {
    setError("");
    try {
      await setProductAvailability(product.id, !product.isAvailable);
      await reload();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Unable to update availability.");
    }
  }

  return (
    <div className="table-card">
      <div className="section-header" style={{ marginBottom: 10 }}>
        <div>
          <h3>Product list</h3>
          <p className="muted">Manage bilingual product data and images stored in Supabase.</p>
        </div>
        <Link className="btn btn-primary" href="/admin/products/new">Add product</Link>
      </div>
      {error ? <p className="prototype-note" role="alert">{error}</p> : null}

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
                  <td>
                    <strong>{product.nameMs}</strong><br />
                    <span className="muted">EN: {product.nameEn}</span><br />
                    <span className="muted">BM: {product.descriptionMs}</span><br />
                    <span className="muted">EN: {product.descriptionEn}</span>
                  </td>
                  <td>{categoryMap[product.categorySlug] ?? product.categorySlug}</td>
                  <td>{startingPrice}</td>
                  <td><span className={`badge ${product.isAvailable ? "badge-green" : "badge-muted"}`}>{product.isAvailable ? "Available" : "Unavailable"}</span></td>
                  <td>
                    <div className="inline-actions">
                      <Link className="btn btn-secondary btn-small" href={`/admin/products/${product.id}/edit`}>Edit</Link>
                      <button className="btn btn-secondary btn-small" type="button" onClick={() => toggleAvailability(product)}>{product.isAvailable ? "Hide" : "Show"}</button>
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
