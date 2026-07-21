"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchCategories, fetchProducts } from "@/lib/data";
import { getLocalizedCategoryName } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { useLanguage } from "./LanguageProvider";

export function ProductGridClient({ categorySlug, featuredOnly = false }: { categorySlug?: string; featuredOnly?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { language, t } = useLanguage();

  useEffect(() => {
    void Promise.all([fetchProducts(), fetchCategories()])
      .then(([nextProducts, nextCategories]) => {
        setProducts(nextProducts);
        setCategories(nextCategories);
      })
      .catch(console.error);
  }, []);

  const filteredProducts = useMemo(() => {
    let nextProducts = products;
    if (featuredOnly) nextProducts = nextProducts.filter((product) => product.isFeatured);
    if (!categorySlug) return nextProducts;
    return nextProducts.filter((product) => product.categorySlug === categorySlug);
  }, [products, categorySlug, featuredOnly]);

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.slug, getLocalizedCategoryName(category, language)])),
    [categories, language]
  );

  return (
    <>
      <div className="filter-bar">
          <Link className={!categorySlug ? "active" : ""} href="/products">{t("allFilter")}</Link>
          {categories.map((category) => (
            <Link
              className={categorySlug === category.slug ? "active" : ""}
              href={`/products/${category.slug}`}
              key={category.id}
            >
              {getLocalizedCategoryName(category, language)}
            </Link>
          ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard product={product} categoryName={categoryMap[product.categorySlug]} key={product.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>{t("noProductsTitle")}</h3>
          <p>{t("noProductsBody")}</p>
        </div>
      )}
    </>
  );
}
