"use client";

import { use } from "react";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { NoticePopup } from "@/components/customer/NoticePopup";
import { ProductGridClient } from "@/components/customer/ProductGridClient";
import { useLanguage } from "@/components/customer/LanguageProvider";

export default function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const { getCategoryLabel, t } = useLanguage();

  return (
    <>
      <Header />
      <NoticePopup />
      <main className="container section">
        <span className="eyebrow">{t("categoryEyebrow")}</span>
        <h1>{getCategoryLabel(category)}</h1>
        <p className="lead">{t("categoryLead")}</p>
        <ProductGridClient categorySlug={category} />
      </main>
      <Footer />
    </>
  );
}
