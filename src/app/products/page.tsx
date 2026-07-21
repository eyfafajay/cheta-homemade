"use client";

import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { NoticePopup } from "@/components/customer/NoticePopup";
import { ProductGridClient } from "@/components/customer/ProductGridClient";
import { useLanguage } from "@/components/customer/LanguageProvider";

export default function ProductsPage() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <NoticePopup />
      <main className="container section">
        <span className="eyebrow">{t("productsEyebrow")}</span>
        <h1>{t("productsTitle")}</h1>
        <p className="lead">{t("productsLead")}</p>
        <ProductGridClient />
      </main>
      <Footer />
    </>
  );
}
