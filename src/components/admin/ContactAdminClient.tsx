"use client";

import { FormEvent, useEffect, useState } from "react";
import { fetchContactSettings, saveContactSettings } from "@/lib/data";
import type { ContactSettings } from "@/lib/types";

const emptySettings: ContactSettings = {
  whatsappNumber: "",
  phoneNumber: "",
  instagramUrl: "",
  facebookUrl: "",
  pickupAreaMs: "",
  pickupAreaEn: "",
  businessHoursMs: "",
  businessHoursEn: "",
  orderInstructionsMs: "",
  orderInstructionsEn: ""
};

export function ContactAdminClient() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetchContactSettings()
      .then((current) => setSettings(current ?? emptySettings))
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load contact information.");
        setSettings(emptySettings);
      });
  }, []);

  if (!settings) return null;

  function updateField(field: keyof ContactSettings, value: string) {
    setSettings((current) => current ? { ...current, [field]: value } : current);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const currentSettings = settings;
    if (!currentSettings) return;
    try {
      const nextSettings = await saveContactSettings(currentSettings);
      setSettings(nextSettings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save contact information.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <p className="prototype-note">
        Contact numbers and social links are shared. Pickup information, business hours, and order instructions can be entered separately in BM and EN.
      </p>
      {error ? <p className="prototype-note" role="alert">{error}</p> : null}
      <div className="form-grid two">
        <label>
          WhatsApp number
          <input value={settings.whatsappNumber} onChange={(event) => updateField("whatsappNumber", event.target.value)} placeholder="60XXXXXXXXX" />
        </label>
        <label>
          Phone number
          <input value={settings.phoneNumber} onChange={(event) => updateField("phoneNumber", event.target.value)} placeholder="60XXXXXXXXX" />
        </label>
        <label>
          Instagram URL
          <input value={settings.instagramUrl} onChange={(event) => updateField("instagramUrl", event.target.value)} placeholder="https://instagram.com/username" />
        </label>
        <label>
          Facebook URL
          <input value={settings.facebookUrl} onChange={(event) => updateField("facebookUrl", event.target.value)} placeholder="https://facebook.com/page" />
        </label>
        <label>
          Pickup area (Bahasa Melayu)
          <input value={settings.pickupAreaMs} onChange={(event) => updateField("pickupAreaMs", event.target.value)} />
        </label>
        <label>
          Pickup area (English)
          <input value={settings.pickupAreaEn} onChange={(event) => updateField("pickupAreaEn", event.target.value)} />
        </label>
        <label>
          Business hours (Bahasa Melayu)
          <input value={settings.businessHoursMs} onChange={(event) => updateField("businessHoursMs", event.target.value)} />
        </label>
        <label>
          Business hours (English)
          <input value={settings.businessHoursEn} onChange={(event) => updateField("businessHoursEn", event.target.value)} />
        </label>
      </div>
      <div className="form-grid two" style={{ marginTop: 14 }}>
        <label>
          Order instructions (Bahasa Melayu)
          <textarea value={settings.orderInstructionsMs} onChange={(event) => updateField("orderInstructionsMs", event.target.value)} />
        </label>
        <label>
          Order instructions (English)
          <textarea value={settings.orderInstructionsEn} onChange={(event) => updateField("orderInstructionsEn", event.target.value)} />
        </label>
      </div>
      <div className="form-actions" style={{ marginTop: 14 }}>
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save contact info"}</button>
        {saved ? <span className="badge badge-green">Saved</span> : null}
      </div>
    </form>
  );
}
