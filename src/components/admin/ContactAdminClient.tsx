"use client";

import { FormEvent, useEffect, useState } from "react";
import { getContactSettings, saveContactSettings } from "@/lib/local-store";
import type { ContactSettings } from "@/lib/types";

export function ContactAdminClient() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const current = getContactSettings();
    setSettings({
      ...current,
      pickupAreaMs: current.pickupAreaMs || current.pickupArea,
      pickupAreaEn: current.pickupAreaEn || current.pickupArea,
      businessHoursMs: current.businessHoursMs || current.businessHours,
      businessHoursEn: current.businessHoursEn || current.businessHours,
      orderInstructionsMs: current.orderInstructionsMs || current.orderInstructions,
      orderInstructionsEn: current.orderInstructionsEn || current.orderInstructions
    });
  }, []);

  if (!settings) return null;

  function updateField(field: keyof ContactSettings, value: string) {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;
    const nextSettings: ContactSettings = {
      ...settings,
      pickupArea: settings.pickupAreaMs || settings.pickupAreaEn || settings.pickupArea,
      businessHours: settings.businessHoursMs || settings.businessHoursEn || settings.businessHours,
      orderInstructions: settings.orderInstructionsMs || settings.orderInstructionsEn || settings.orderInstructions
    };
    saveContactSettings(nextSettings);
    setSettings(nextSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <p className="prototype-note">
        Contact numbers and social links are shared. Pickup information, business hours, and order instructions can be entered separately in BM and EN.
      </p>
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
          <input value={settings.pickupAreaMs ?? ""} onChange={(event) => updateField("pickupAreaMs", event.target.value)} placeholder="Contoh: Kawasan pickup akan dikemas kini" />
        </label>
        <label>
          Pickup area (English)
          <input value={settings.pickupAreaEn ?? ""} onChange={(event) => updateField("pickupAreaEn", event.target.value)} placeholder="Example: Pickup area will be updated" />
        </label>
        <label>
          Business hours (Bahasa Melayu)
          <input value={settings.businessHoursMs ?? ""} onChange={(event) => updateField("businessHoursMs", event.target.value)} placeholder="Contoh: Isnin–Sabtu, 9 pagi–6 petang" />
        </label>
        <label>
          Business hours (English)
          <input value={settings.businessHoursEn ?? ""} onChange={(event) => updateField("businessHoursEn", event.target.value)} placeholder="Example: Monday–Saturday, 9 AM–6 PM" />
        </label>
      </div>
      <div className="form-grid two" style={{ marginTop: 14 }}>
        <label>
          Order instructions (Bahasa Melayu)
          <textarea value={settings.orderInstructionsMs ?? ""} onChange={(event) => updateField("orderInstructionsMs", event.target.value)} />
        </label>
        <label>
          Order instructions (English)
          <textarea value={settings.orderInstructionsEn ?? ""} onChange={(event) => updateField("orderInstructionsEn", event.target.value)} />
        </label>
      </div>
      <div className="form-actions" style={{ marginTop: 14 }}>
        <button className="btn btn-primary" type="submit">Save contact info</button>
        {saved ? <span className="badge badge-green">Saved</span> : null}
      </div>
    </form>
  );
}
