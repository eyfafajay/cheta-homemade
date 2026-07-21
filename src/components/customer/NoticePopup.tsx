"use client";

import { useEffect, useState } from "react";
import { fetchActiveNotice } from "@/lib/data";
import { getLocalizedNoticeMessage, getLocalizedNoticeTitle } from "@/lib/utils";
import type { Notice } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

export function NoticePopup() {
  const [notice, setNotice] = useState<Notice | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    void fetchActiveNotice()
      .then((activeNotice) => {
        const dismissedNoticeId = sessionStorage.getItem("cheta_dismissed_notice");
        setNotice(activeNotice);
        setIsOpen(Boolean(activeNotice && dismissedNoticeId !== activeNotice.id));
      })
      .catch(console.error);
  }, []);

  function closeNotice() {
    if (notice) sessionStorage.setItem("cheta_dismissed_notice", notice.id);
    setIsOpen(false);
  }

  if (!notice || !isOpen) return null;

  return (
    <aside className="notice-toast" role="status" aria-live="polite" aria-labelledby="notice-title">
      <div>
        <span className="notice-kicker">{t("noticeKicker")}</span>
        <h3 id="notice-title">{getLocalizedNoticeTitle(notice, language)}</h3>
        <p>{getLocalizedNoticeMessage(notice, language)}</p>
      </div>
      <button className="notice-close" type="button" onClick={closeNotice} aria-label={t("noticeKicker")}>×</button>
    </aside>
  );
}
