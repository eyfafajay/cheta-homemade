"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchCategories, fetchContactSettings, fetchProductById } from "@/lib/data";
import {
  buildWhatsAppUrl,
  formatPrice,
  getLocalizedCategoryName,
  getLocalizedOptionLabel,
  getLocalizedOptionNotes,
  getLocalizedProductDescription,
  getLocalizedProductName
} from "@/lib/utils";
import type { Category, ContactSettings, Product } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

export function ProductDetailClient({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [contact, setContact] = useState<ContactSettings | undefined>();
  const [loaded, setLoaded] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    void Promise.all([fetchProductById(productId), fetchCategories(), fetchContactSettings()])
      .then(([nextProduct, nextCategories, nextContact]) => {
        setProduct(nextProduct);
        setCategories(nextCategories);
        setContact(nextContact);
        setLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setLoaded(true);
      });
  }, [productId]);

  const categoryName = useMemo(() => {
    if (!product) return "";
    const category = categories.find((item) => item.slug === product.categorySlug);
    return category ? getLocalizedCategoryName(category, language) : product.categorySlug;
  }, [categories, language, product]);

  if (!loaded) return null;

  if (!product) {
    return (
      <div className="container section">
        <div className="empty-state">
          <h2>{t("productNotFound")}</h2>
          <p>{t("productRemoved")}</p>
          <Link className="btn btn-primary" href="/products">{t("backToProducts")}</Link>
        </div>
      </div>
    );
  }

  const productName = getLocalizedProductName(product, language);
  const productDescription = getLocalizedProductDescription(product, language);
  const orderMessage = language === "ms"
    ? `${t("orderMessagePrefix")} ${productName}. Boleh saya tahu sama ada ia masih tersedia?`
    : `${t("orderMessagePrefix")} ${productName}. May I know if it is available?`;
  const whatsappUrl = buildWhatsAppUrl(contact?.whatsappNumber ?? "", orderMessage);

  return (
    <main className="container section">
      <Link className="btn btn-secondary btn-small" href="/products">← {t("backToProducts")}</Link>

      <div className="detail-grid" style={{ marginTop: 18 }}>
        <div className="detail-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="photo-placeholder" style={{ minHeight: 460 }}>
            {product.imageUrl ? <img src={product.imageUrl} alt={productName} /> : null}
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
          <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 4.4rem)" }}>{productName}</h1>
          <p className="lead">{productDescription}</p>

          <h3>{t("priceOptions")}</h3>
          <ul className="option-list">
            {product.options.map((option) => {
              const notes = getLocalizedOptionNotes(option);
              return (
                <li key={option.id}>
                  <span>
                    <strong>{getLocalizedOptionLabel(option)}</strong>
                    {notes ? <small className="muted" style={{ display: "block" }}>{notes}</small> : null}
                  </span>
                  <strong>{formatPrice(option.price)}</strong>
                </li>
              );
            })}
          </ul>

          <div className="card-actions">
            {whatsappUrl !== "#" ? (
              <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">{t("orderViaWhatsApp")}</a>
            ) : null}
            <Link className="btn btn-secondary" href="/contact">{t("contactDetails")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
