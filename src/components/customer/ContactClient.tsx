"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildWhatsAppUrl,
  getContactSettings,
  getLocalizedBusinessHours,
  getLocalizedOrderInstructions,
  getLocalizedPickupArea
} from "@/lib/local-store";
import type { ContactSettings } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

export function ContactClient() {
  const [contact, setContact] = useState<ContactSettings>();
  const { language, t } = useLanguage();

  useEffect(() => {
    setContact(getContactSettings());
  }, []);

  const message = useMemo(() => t("orderMessageGeneral"), [t]);

  if (!contact) return null;

  return (
    <main>
      <section className="container section">
        <span className="eyebrow">{t("contactEyebrow")}</span>
        <h1>{t("contactTitle")}</h1>
        <p className="lead">{t("contactLead")}</p>

        <div className="contact-grid" style={{ marginTop: 26 }}>
          <div className="contact-card">
            <h2>{t("contactCardTitle")}</h2>
            <p className="lead">{getLocalizedOrderInstructions(contact, language) || t("contactCardBody")}</p>
            <a className="btn btn-primary" href={buildWhatsAppUrl(contact.whatsappNumber, message)} target="_blank" rel="noreferrer">
              {t("openWhatsApp")}
            </a>
          </div>

          <div className="contact-card">
            <h3>{t("contactInfoTitle")}</h3>
            <ul className="option-list">
              <li><span>{t("whatsappLabel")}</span><strong>{contact.whatsappNumber}</strong></li>
              <li><span>{t("phoneLabel")}</span><strong>{contact.phoneNumber}</strong></li>
              <li><span>{t("pickupLabel")}</span><strong>{getLocalizedPickupArea(contact, language)}</strong></li>
              <li><span>{t("businessHoursLabel")}</span><strong>{getLocalizedBusinessHours(contact, language)}</strong></li>
            </ul>
            <div className="card-actions">
              {contact.instagramUrl ? <a className="btn btn-secondary" href={contact.instagramUrl} target="_blank" rel="noreferrer">Instagram</a> : null}
              {contact.facebookUrl ? <a className="btn btn-secondary" href={contact.facebookUrl} target="_blank" rel="noreferrer">Facebook</a> : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
