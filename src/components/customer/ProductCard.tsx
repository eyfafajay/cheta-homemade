"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { getProductStartingPrice } from "@/lib/local-store";

export function ProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  return (
    <article className="product-card">
      <Link href={`/products/item/${product.id}`}>
        <div className="photo-placeholder">
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : null}
          <span className="photo-label">{categoryName ?? product.categorySlug}</span>
        </div>
      </Link>
      <div className="product-card-content">
        <div className="badge-row">
          <span className="badge badge-pink">{categoryName ?? product.categorySlug}</span>
          <span className={`badge ${product.isAvailable ? "badge-green" : "badge-muted"}`}>
            {product.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="price">{getProductStartingPrice(product)}</p>
        <div className="card-actions">
          <Link className="btn btn-primary" href={`/products/item/${product.id}`}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
