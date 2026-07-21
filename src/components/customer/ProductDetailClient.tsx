"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildWhatsAppUrl, formatPrice, getCategories, getContactSettings, getProductById } from "@/lib/local-store";
import type { Category, ContactSettings, Product } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

export function ProductDetailClient({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [contact, setContact] = useState<ContactSettings | undefined>();
  const { getCategoryLabel, language, t } = useLanguage();

  useEffect(() => {
    setProduct(getProductById(productId));
    setCategories(getCategories());
    setContact(getContactSettings());
  }, [productId]);

  const categoryName = useMemo(() => {
    if (!product) return "";
    const slug = categories.find((category) => category.slug === product.categorySlug)?.slug ?? product.categorySlug;
    return getCategoryLabel(slug);
  }, [categories, getCategoryLabel, product]);

  if (!product) {
    return (
      <div className="container section">
        <div className="empty-state">
          <h2>{t("productNotFound")}</h2>
          <p>{t("productRemoved")}</p>
          <Link className="btn btn-primary" href="/products">
            {t("backToProducts")}
          </Link>
        </div>
      </div>
    );
  }

  const orderMessage =
    language === "ms"
      ? `${t("orderMessagePrefix")} ${product.name}. Boleh saya tahu sama ada ia masih tersedia?`
      : `${t("orderMessagePrefix")} ${product.name}. May I know if it is available?`;
  const whatsappUrl = buildWhatsAppUrl(contact?.whatsappNumber ?? "60XXXXXXXXX", orderMessage);

  return (
    <main className="container section">
      <Link className="btn btn-secondary btn-small" href="/products">
        ← {t("backToProducts")}
      </Link>

      <div className="detail-grid" style={{ marginTop: 18 }}>
        <div className="detail-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="photo-placeholder" style={{ minHeight: 460 }}>
            {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : null}
            <span className="photo-label">{categoryName}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="badge-row">
            <span className="badge badge-pink">{categoryName}</span>
            <span className={`badge ${product.isAvailable ? "badge-green" : "badge-muted"}`}>
              {product.isAvailable ? t("available") : t("unavailable")}
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 4.4rem)" }}>{product.name}</h1>
          <p className="lead">{product.description}</p>

          <h3>{t("priceOptions")}</h3>
          <ul className="option-list">
            {product.options.map((option) => (
              <li key={option.id}>
                <span>
                  <strong>{option.label}</strong>
                  {option.notes ? <small className="muted" style={{ display: "block" }}>{option.notes}</small> : null}
                </span>
                <strong>{formatPrice(option.price)}</strong>
              </li>
            ))}
          </ul>

          <div className="card-actions">
            <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              {t("orderViaWhatsApp")}
            </a>
            <Link className="btn btn-secondary" href="/contact">
              {t("contactDetails")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
