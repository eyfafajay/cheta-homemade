"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fetchCategories } from "@/lib/data";
import { getLocalizedCategoryName } from "@/lib/utils";
import type { Category } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

const categoryIconClass: Record<string, string> = {
  kek: "dropdown-icon-cakes",
  desserts: "dropdown-icon-desserts",
  roti: "dropdown-icon-roti",
  craft: "dropdown-icon-craft"
};

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const productsDropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    void fetchCategories().then(setCategories).catch(console.error);
  }, []);

  function closeProductsDropdown() {
    productsDropdownRef.current?.removeAttribute("open");
  }

  function closeNavigation() {
    setMenuOpen(false);
    closeProductsDropdown();
  }

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      const target = event.target as Node;
      if (!productsDropdownRef.current?.contains(target)) closeProductsDropdown();
      if (!navRef.current?.contains(target) && !menuButtonRef.current?.contains(target)) setMenuOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeNavigation();
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="container navbar">
        <Link className="brand" href="/" onClick={closeNavigation}>
          <span className="brand-mark">CH</span>
          <span>
            Cheta Homemade
            <small>{t("brandTagline")}</small>
          </span>
        </Link>

        <div className="header-tools">
          <div className="language-switch" role="group" aria-label={t("languageLabel")}>
            <button type="button" className={language === "en" ? "active" : ""} onClick={() => { setLanguage("en"); closeProductsDropdown(); }}>
              EN
            </button>
            <button type="button" className={language === "ms" ? "active" : ""} onClick={() => { setLanguage("ms"); closeProductsDropdown(); }}>
              BM
            </button>
          </div>

          <button
            type="button"
            className="menu-toggle"
            ref={menuButtonRef}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={t("menuLabel")}
            onClick={() => { setMenuOpen((value) => !value); closeProductsDropdown(); }}
          >
            <span className="menu-icon" aria-hidden="true"><i /><i /><i /></span>
            <strong>{t("menuLabel")}</strong>
          </button>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`} id="main-navigation" aria-label="Main navigation" ref={navRef}>
          <Link href="/" onClick={closeNavigation}>{t("navHome")}</Link>

          <details className="nav-dropdown" ref={productsDropdownRef}>
            <summary>
              <span>{t("navProducts")}</span>
              <span className="dropdown-chevron" aria-hidden="true" />
            </summary>
            <div className="dropdown-menu">
              <Link href="/products" onClick={closeNavigation}>
                <span className="dropdown-icon dropdown-icon-all" aria-hidden="true" />
                <span>{t("navAllProducts")}</span>
              </Link>
              {categories.map((category) => (
                <Link href={`/products/${category.slug}`} onClick={closeNavigation} key={category.id}>
                  <span className={`dropdown-icon ${categoryIconClass[category.slug] ?? "dropdown-icon-all"}`} aria-hidden="true" />
                  <span>{getLocalizedCategoryName(category, language)}</span>
                </Link>
              ))}
            </div>
          </details>

          <Link href="/contact" onClick={closeNavigation}>{t("navContact")}</Link>
        </nav>
      </div>
    </header>
  );
}
