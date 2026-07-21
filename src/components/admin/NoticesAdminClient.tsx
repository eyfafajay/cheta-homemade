"use client";

import { FormEvent, useEffect, useState } from "react";
import { getNotices, saveNotices, slugify } from "@/lib/local-store";
import type { Notice } from "@/lib/types";

export function NoticesAdminClient() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [titleMs, setTitleMs] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [messageMs, setMessageMs] = useState("");
  const [messageEn, setMessageEn] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setNotices(getNotices());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const notice: Notice = {
      id: `notice-${slugify(titleEn || titleMs)}-${Date.now()}`,
      title: titleMs || titleEn,
      message: messageMs || messageEn,
      titleMs,
      titleEn,
      messageMs,
      messageEn,
      isActive
    };
    const nextNotices = isActive
      ? [notice, ...notices.map((item) => ({ ...item, isActive: false }))]
      : [notice, ...notices];
    saveNotices(nextNotices);
    setNotices(nextNotices);
    setTitleMs("");
    setTitleEn("");
    setMessageMs("");
    setMessageEn("");
    setIsActive(true);
  }

  function toggleNotice(noticeId: string) {
    const selectedNotice = notices.find((notice) => notice.id === noticeId);
    const nextActiveState = !selectedNotice?.isActive;
    const nextNotices = notices.map((notice) => ({
      ...notice,
      isActive: notice.id === noticeId ? nextActiveState : false
    }));
    saveNotices(nextNotices);
    setNotices(nextNotices);
  }

  function deleteNotice(noticeId: string) {
    const confirmed = confirm("Delete this notice?");
    if (!confirmed) return;
    const nextNotices = notices.filter((notice) => notice.id !== noticeId);
    saveNotices(nextNotices);
    setNotices(nextNotices);
  }

  return (
    <div className="admin-dashboard-grid">
      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Add notice popup</h3>
        <p className="prototype-note">
          Enter the notice in BM and EN. Customers will see the matching version based on their language selection.
        </p>
        <div className="form-grid two">
          <label>
            Notice title (Bahasa Melayu)
            <input value={titleMs} onChange={(event) => setTitleMs(event.target.value)} required placeholder="Contoh: Notis cuti" />
          </label>
          <label>
            Notice title (English)
            <input value={titleEn} onChange={(event) => setTitleEn(event.target.value)} required placeholder="Example: Day off notice" />
          </label>
          <label>
            Notice message (Bahasa Melayu)
            <textarea value={messageMs} onChange={(event) => setMessageMs(event.target.value)} required placeholder="Contoh: Kami bercuti hari ini. Tempahan akan dibuka semula esok." />
          </label>
          <label>
            Notice message (English)
            <textarea value={messageEn} onChange={(event) => setMessageEn(event.target.value)} required placeholder="Example: We are taking a day off today. Orders will resume tomorrow." />
          </label>
        </div>
        <label style={{ marginTop: 14 }}>
          <span>
            <input checked={isActive} onChange={(event) => setIsActive(event.target.checked)} type="checkbox" style={{ width: "auto", marginRight: 8 }} />
            Show this popup on customer website
          </span>
        </label>
        <button className="btn btn-primary" type="submit">Save notice</button>
      </form>

      <div className="table-card">
        <h3>Saved notices</h3>
        <div className="form-grid">
          {notices.map((notice) => (
            <div className="notice-panel" key={notice.id}>
              <div className="badge-row">
                <span className={`badge ${notice.isActive ? "badge-green" : "badge-muted"}`}>{notice.isActive ? "Active" : "Inactive"}</span>
              </div>
              <h3>{notice.titleMs || notice.title}</h3>
              <p><strong>BM:</strong> {notice.messageMs || notice.message}</p>
              <p><strong>EN:</strong> {notice.messageEn || notice.message}</p>
              <div className="inline-actions">
                <button className="btn btn-secondary btn-small" type="button" onClick={() => toggleNotice(notice.id)}>{notice.isActive ? "Turn off" : "Turn on"}</button>
                <button className="btn btn-danger btn-small" type="button" onClick={() => deleteNotice(notice.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
