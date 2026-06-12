"use client";

import { useState } from "react";
import { fmtCurrency } from "@/lib/services/raffles";
import { STATUS_CONFIG, openWhatsApp, buildWhatsAppMessage } from "@/lib/services/participants";

const AVATAR_PALETTE = [
  { bg: "#ede9fe", color: "#6d28d9" },
  { bg: "#ecfdf5", color: "#059669" },
  { bg: "#eff6ff", color: "#2563eb" },
  { bg: "#fff7ed", color: "#c2410c" },
  { bg: "#fce7f3", color: "#be185d" },
];

function getAvatarStyle(name = "") {
  const code = name.charCodeAt(0) || 65;
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0]?.[0] || "?").toUpperCase();
}

export default function ParticipantDetailModal({ participant, onClose }) {
  const [copied, setCopied] = useState("");

  if (!participant) return null;

  const status = STATUS_CONFIG[participant.status] || STATUS_CONFIG.pendente;
  const avatar = getAvatarStyle(participant.name);

  function copy(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }

  function handleMessage() {
    openWhatsApp(participant.phone, buildWhatsAppMessage(participant));
  }

  return (
    <div className="participant-modal" role="dialog" aria-modal="true">
      <div className="participant-modal__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="participant-modal__panel">
        <div className="participant-modal__head">
          <button type="button" className="participant-modal__close" onClick={onClose} aria-label="Fechar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div className="participant-modal__profile">
            <span className="participant-modal__avatar" style={{ backgroundColor: avatar.bg, color: avatar.color }}>
              {getInitials(participant.name)}
            </span>
            <div>
              <h2>{participant.name}</h2>
              <span className={`participants__status ${status.className}`}>
                <span className="participants__status-dot" aria-hidden />
                {status.label}
              </span>
            </div>
          </div>
        </div>

        <div className="participant-modal__body">
          <section className="participant-modal__section">
            <p className="participant-modal__label">Contato</p>
            <div className="participant-modal__contact">
              <div>
                <span>Telefone</span>
                <strong>{participant.phone}</strong>
              </div>
              <button type="button" onClick={() => copy(participant.phone, "phone")}>
                {copied === "phone" ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <div className="participant-modal__contact">
              <div>
                <span>E-mail</span>
                <strong>{participant.email}</strong>
              </div>
              <button type="button" onClick={() => copy(participant.email, "email")}>
                {copied === "email" ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </section>

          <section className="participant-modal__section">
            <p className="participant-modal__label">Compra</p>
            <div className="participant-modal__grid">
              <div><span>Sorteio</span><strong>{participant.raffle}</strong></div>
              <div><span>Total pago</span><strong className="is-green">R$ {fmtCurrency(participant.total || 0)}</strong></div>
              <div><span>Data</span><strong>{participant.date}</strong></div>
              <div><span>Pagamento</span><strong>{participant.paymentMethod}</strong></div>
            </div>
          </section>

          <section className="participant-modal__section">
            <p className="participant-modal__label">Números ({participant.numbers?.length || 0})</p>
            <div className="participant-modal__numbers">
              {(participant.numbers || []).map((n) => (
                <span key={n}>{String(n).padStart(3, "0")}</span>
              ))}
            </div>
          </section>

          <div className="participant-modal__actions">
            <button type="button" className="btn btn--violet btn--sm" onClick={handleMessage}>
              Enviar WhatsApp
            </button>
            <button type="button" className="btn btn--outline btn--sm" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
