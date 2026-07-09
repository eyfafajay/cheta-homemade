"use client";

import { useEffect, useState } from "react";
import { getActiveNotice } from "@/lib/local-store";
import type { Notice } from "@/lib/types";

export function NoticePopup() {
  const [notice, setNotice] = useState<Notice | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const activeNotice = getActiveNotice();
    const dismissedNoticeId = typeof window !== "undefined" ? sessionStorage.getItem("cheta_dismissed_notice") : null;

    setNotice(activeNotice);
    setIsOpen(Boolean(activeNotice && dismissedNoticeId !== activeNotice.id));
  }, []);

  function closeNotice() {
    if (notice && typeof window !== "undefined") {
      sessionStorage.setItem("cheta_dismissed_notice", notice.id);
    }
    setIsOpen(false);
  }

  if (!notice || !isOpen) return null;

  return (
    <aside className="notice-toast" role="status" aria-live="polite" aria-labelledby="notice-title">
      <div>
        <span className="notice-kicker">📌 Notice</span>
        <h3 id="notice-title">{notice.title}</h3>
        <p>{notice.message}</p>
      </div>
      <button className="notice-close" type="button" onClick={closeNotice} aria-label="Close notice">
        ×
      </button>
    </aside>
  );
}
