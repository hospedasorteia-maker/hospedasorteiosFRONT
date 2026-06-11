"use client";

import { useState } from "react";
import { STATUS_CONFIG, openWhatsApp, buildWhatsAppMessage } from "@/lib/participants";

export default function ParticipantDetailModal({ participant, onClose }) {
  const [copied, setCopied] = useState("");

  if (!participant) return null;

  const status = STATUS_CONFIG[participant.status] || STATUS_CONFIG.pendente;

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
            <span className="participant-modal__avatar">{participant.name.charAt(0)}</span>
            <div>
              <h2>{participant.name}</h2>
              <span className={`participants__status ${status.className}`}>{status.label}</span>
            </div>
          </div>
        </div>

        <div className="participant-modal__body">
          <section>
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

          <section>
            <p className="participant-modal__label">Compra</p>
            <div className="participant-modal__grid">
              <div><span>Sorteio</span><strong>{participant.raffle}</strong></div>
              <div><span>Total pago</span><strong className="is-green">R$ {participant.total.toFixed(2)}</strong></div>
              <div><span>Data</span><strong>{participant.date}</strong></div>
              <div><span>Pagamento</span><strong>{participant.paymentMethod}</strong></div>
            </div>
          </section>

          <section>
            <p className="participant-modal__label">Números ({participant.numbers?.length || 0})</p>
            <div className="participant-modal__numbers">
              {(participant.numbers || []).map((n) => (
                <span key={n}>{String(n).padStart(3, "0")}</span>
              ))}
            </div>
          </section>

          <div className="participant-modal__actions">
            <button type="button" className="btn btn--violet btn--sm" onClick={handleMessage}>
              Enviar mensagem
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
