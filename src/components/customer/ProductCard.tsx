"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import {
  getLocalizedProductDescription,
  getLocalizedProductName,
  getProductStartingPrice
} from "@/lib/utils";
import { useLanguage } from "./LanguageProvider";

export function ProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  const { language, t } = useLanguage();
  const priceLabel = getProductStartingPrice(product).replace(/^From/, t("from"));
  const productName = getLocalizedProductName(product, language);
  const productDescription = getLocalizedProductDescription(product, language);

  return (
    <article className="product-card">
      <Link href={`/products/item/${product.id}`}>
        <div className="photo-placeholder">
          {product.imageUrl ? <img src={product.imageUrl} alt={productName} /> : null}
          <span className="photo-label">{categoryName ?? product.categorySlug}</span>
        </div>
      </Link>
      <div className="product-card-content">
        <div className="badge-row">
          <span className="badge badge-pink">{categoryName ?? product.categorySlug}</span>
          <span className={`badge ${product.isAvailable ? "badge-green" : "badge-muted"}`}>
            {product.isAvailable ? t("available") : t("unavailable")}
          </span>
        </div>
        <h3>{productName}</h3>
        <p className="product-description">{productDescription}</p>
        <p className="price">{priceLabel}</p>
        <div className="card-actions">
          <Link className="btn btn-primary" href={`/products/item/${product.id}`}>{t("viewDetails")}</Link>
        </div>
      </div>
    </article>
  );
}
