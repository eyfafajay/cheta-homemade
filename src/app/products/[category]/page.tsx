"use client";

import { use, useEffect, useState } from "react";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { NoticePopup } from "@/components/customer/NoticePopup";
import { ProductGridClient } from "@/components/customer/ProductGridClient";
import { useLanguage } from "@/components/customer/LanguageProvider";
import { getCategories, getLocalizedCategoryName } from "@/lib/local-store";
import type { Category } from "@/lib/types";

export default function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const { language, t } = useLanguage();
  const [categoryData, setCategoryData] = useState<Category | undefined>();

  useEffect(() => {
    setCategoryData(getCategories().find((item) => item.slug === category));
  }, [category]);

  return (
    <>
      <Header />
      <NoticePopup />
      <main className="container section">
        <span className="eyebrow">{t("categoryEyebrow")}</span>
        <h1>{categoryData ? getLocalizedCategoryName(categoryData, language) : category.replaceAll("-", " ")}</h1>
        <p className="lead">{t("categoryLead")}</p>
        <ProductGridClient categorySlug={category} />
      </main>
      <Footer />
    </>
  );
}
