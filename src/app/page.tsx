"use client";

import Link from "next/link";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { CategoryCards } from "@/components/customer/CategoryCards";
import { NoticePopup } from "@/components/customer/NoticePopup";
import { ProductGridClient } from "@/components/customer/ProductGridClient";
import { ShowcaseCategories } from "@/components/customer/ShowcaseCategories";
import { useLanguage } from "@/components/customer/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <NoticePopup />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">{t("heroEyebrow")}</span>
              <h1>{t("heroTitle")}</h1>
              <p className="lead">{t("heroLead")}</p>
              <div className="hero-actions">
                <Link className="btn btn-primary" href="/products">
                  {t("heroBrowse")}
                </Link>
                <Link className="btn btn-secondary" href="/contact">
                  {t("heroContact")}
                </Link>
              </div>
            </div>

            <div className="hero-showcase" aria-label="Cheta Homemade product showcase">
              <div className="hero-showcase-card hero-main-card">
                <span className="showcase-tag">{t("showcaseTag")}</span>
                <h2>{t("showcaseTitle")}</h2>
                <p>{t("showcaseBody")}</p>
              </div>

              <ShowcaseCategories />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header category-section-header">
              <div>
                <span className="eyebrow">{t("categoriesEyebrow")}</span>
                <h2>{t("categoriesTitle")}</h2>
              </div>
              <p>{t("categoriesLead")}</p>
            </div>
            <CategoryCards />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header featured-section-header">
              <div>
                <span className="eyebrow">{t("featuredEyebrow")}</span>
                <h2>{t("featuredTitle")}</h2>
              </div>
              <Link className="btn btn-secondary" href="/products">
                {t("featuredButton")}
              </Link>
            </div>
            <ProductGridClient featuredOnly />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
