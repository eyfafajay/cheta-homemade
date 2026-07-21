"use client";

import { FormEvent, useEffect, useState } from "react";
import { createNotice, deleteNotice, fetchNotices, setActiveNotice } from "@/lib/data";
import type { Notice } from "@/lib/types";

export function NoticesAdminClient() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [titleMs, setTitleMs] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [messageMs, setMessageMs] = useState("");
  const [messageEn, setMessageEn] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function reload() {
    setNotices(await fetchNotices());
  }

  useEffect(() => {
    void reload().catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load notices."));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createNotice({
        titleMs,
        titleEn,
        messageMs,
        messageEn,
        isActive
      });
      await reload();
      setTitleMs("");
      setTitleEn("");
      setMessageMs("");
      setMessageEn("");
      setIsActive(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save notice.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleNotice(notice: Notice) {
    setError("");
    try {
      await setActiveNotice(notice.id, !notice.isActive);
      await reload();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Unable to update notice.");
    }
  }

  async function handleDelete(noticeId: string) {
    const confirmed = confirm("Delete this notice?");
    if (!confirmed) return;
    setError("");
    try {
      await deleteNotice(noticeId);
      await reload();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete notice.");
    }
  }

  return (
    <div className="admin-dashboard-grid">
      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Add notice popup</h3>
        <p className="prototype-note">
          Enter the notice in BM and EN. Customers will see the matching version based on their language selection.
        </p>
        {error ? <p className="prototype-note" role="alert">{error}</p> : null}
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
            <textarea value={messageMs} onChange={(event) => setMessageMs(event.target.value)} required />
          </label>
          <label>
            Notice message (English)
            <textarea value={messageEn} onChange={(event) => setMessageEn(event.target.value)} required />
          </label>
        </div>
        <label style={{ marginTop: 14 }}>
          <span>
            <input checked={isActive} onChange={(event) => setIsActive(event.target.checked)} type="checkbox" style={{ width: "auto", marginRight: 8 }} />
            Show this popup on customer website
          </span>
        </label>
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save notice"}</button>
      </form>

      <div className="table-card">
        <h3>Saved notices</h3>
        <div className="form-grid">
          {notices.map((notice) => (
            <div className="notice-panel" key={notice.id}>
              <div className="badge-row">
                <span className={`badge ${notice.isActive ? "badge-green" : "badge-muted"}`}>{notice.isActive ? "Active" : "Inactive"}</span>
              </div>
              <h3>{notice.titleMs}</h3>
              <p><strong>BM:</strong> {notice.messageMs}</p>
              <p><strong>EN:</strong> {notice.messageEn}</p>
              <div className="inline-actions">
                <button className="btn btn-secondary btn-small" type="button" onClick={() => toggleNotice(notice)}>{notice.isActive ? "Turn off" : "Turn on"}</button>
                <button className="btn btn-danger btn-small" type="button" onClick={() => handleDelete(notice.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
