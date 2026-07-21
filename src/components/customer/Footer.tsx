"use client";

import { useLanguage } from "./LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>Cheta Homemade</strong>
          <p>{t("footerBody")}</p>
        </div>
      </div>
    </footer>
  );
}
