"use client";

import { FormEvent, useEffect, useState } from "react";
import { getContactSettings, saveContactSettings } from "@/lib/local-store";
import type { ContactSettings } from "@/lib/types";

export function ContactAdminClient() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getContactSettings());
  }, []);

  if (!settings) return null;

  function updateField(field: keyof ContactSettings, value: string) {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;
    saveContactSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
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
          Pickup area
          <input value={settings.pickupArea} onChange={(event) => updateField("pickupArea", event.target.value)} placeholder="Example: Kuching / KL" />
        </label>
        <label>
          Business hours
          <input value={settings.businessHours} onChange={(event) => updateField("businessHours", event.target.value)} placeholder="Example: Monday–Saturday, 9 AM–6 PM" />
        </label>
      </div>
      <div className="form-grid" style={{ marginTop: 14 }}>
        <label>
          Order instructions
          <textarea value={settings.orderInstructions} onChange={(event) => updateField("orderInstructions", event.target.value)} />
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">Save contact info</button>
          {saved ? <span className="badge badge-green">Saved</span> : null}
        </div>
      </div>
    </form>
  );
}
