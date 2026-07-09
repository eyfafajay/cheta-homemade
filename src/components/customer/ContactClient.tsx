"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppUrl, getContactSettings } from "@/lib/local-store";
import type { ContactSettings } from "@/lib/types";

export function ContactClient() {
  const [contact, setContact] = useState<ContactSettings>();

  useEffect(() => {
    setContact(getContactSettings());
  }, []);

  if (!contact) return null;

  const message = "Hi Cheta Homemade, I’m interested to order. May I know what is available?";

  return (
    <main>
      <section className="container section">
        <span className="eyebrow">📞 Contact Cheta Homemade</span>
        <h1>Ready to order?</h1>
        <p className="lead">
          Contact us through WhatsApp to check availability, pickup details, and order slots.
        </p>

        <div className="contact-grid" style={{ marginTop: 26 }}>
          <div className="contact-card">
            <h2>Order through WhatsApp</h2>
            <p className="lead">{contact.orderInstructions}</p>
            <a className="btn btn-primary" href={buildWhatsAppUrl(contact.whatsappNumber, message)} target="_blank" rel="noreferrer">
              Open WhatsApp
            </a>
          </div>

          <div className="contact-card">
            <h3>Contact Information</h3>
            <ul className="option-list">
              <li><span>WhatsApp</span><strong>{contact.whatsappNumber}</strong></li>
              <li><span>Phone</span><strong>{contact.phoneNumber}</strong></li>
              <li><span>Pickup Area</span><strong>{contact.pickupArea}</strong></li>
              <li><span>Business Hours</span><strong>{contact.businessHours}</strong></li>
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
