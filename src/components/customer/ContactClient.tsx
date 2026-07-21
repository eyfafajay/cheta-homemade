"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchContactSettings } from "@/lib/data";
import {
  buildWhatsAppUrl,
  getLocalizedBusinessHours,
  getLocalizedOrderInstructions,
  getLocalizedPickupArea
} from "@/lib/utils";
import type { ContactSettings } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

export function ContactClient() {
  const [contact, setContact] = useState<ContactSettings>();
  const { language, t } = useLanguage();

  useEffect(() => {
    void fetchContactSettings().then(setContact).catch(console.error);
  }, []);

  const message = useMemo(() => t("orderMessageGeneral"), [t]);

  if (!contact) {
    return (
      <main>
        <section className="container section">
          <span className="eyebrow">{t("contactEyebrow")}</span>
          <h1>{t("contactTitle")}</h1>
          <p className="lead">{t("contactLead")}</p>
        </section>
      </main>
    );
  }

  const whatsappUrl = buildWhatsAppUrl(contact.whatsappNumber, message);

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
            {whatsappUrl !== "#" ? (
              <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                {t("openWhatsApp")}
              </a>
            ) : null}
          </div>

          <div className="contact-card">
            <h3>{t("contactInfoTitle")}</h3>
            <ul className="option-list">
              {contact.whatsappNumber ? <li><span>{t("whatsappLabel")}</span><strong>{contact.whatsappNumber}</strong></li> : null}
              {contact.phoneNumber ? <li><span>{t("phoneLabel")}</span><strong>{contact.phoneNumber}</strong></li> : null}
              {getLocalizedPickupArea(contact, language) ? <li><span>{t("pickupLabel")}</span><strong>{getLocalizedPickupArea(contact, language)}</strong></li> : null}
              {getLocalizedBusinessHours(contact, language) ? <li><span>{t("businessHoursLabel")}</span><strong>{getLocalizedBusinessHours(contact, language)}</strong></li> : null}
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
