"use client";

import { useEffect } from "react";

const PREVIEW_LIMIT = 5;

export default function RemoveParticipantsModal({ participants = [], onClose, onConfirm }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!participants.length) return null;

  const count = participants.length;
  const preview = participants.slice(0, PREVIEW_LIMIT);
  const remaining = count - preview.length;
  const title = count === 1 ? "Remover participante?" : `Remover ${count} participantes?`;

  return (
    <div className="confirm-delete" role="dialog" aria-modal="true" aria-labelledby="remove-participants-title">
      <div className="confirm-delete__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="confirm-delete__panel">
        <button type="button" className="confirm-delete__close" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="confirm-delete__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="17" y1="11" x2="22" y2="11" />
          </svg>
        </div>

        <p className="confirm-delete__eyebrow">Ação irreversível</p>
        <h2 id="remove-participants-title" className="confirm-delete__title">{title}</h2>
        <p className="confirm-delete__text">
          {count === 1
            ? "Este participante será removido da lista. Os números reservados voltarão a ficar disponíveis."
            : "Os participantes selecionados serão removidos da lista. Os números reservados voltarão a ficar disponíveis."}
        </p>

        <ul className="confirm-delete__list">
          {preview.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong>
              {p.raffle && <span>{p.raffle}</span>}
            </li>
          ))}
          {remaining > 0 && (
            <li className="confirm-delete__list-more">
              + {remaining} {remaining === 1 ? "outro participante" : "outros participantes"}
            </li>
          )}
        </ul>

        <div className="confirm-delete__actions">
          <button type="button" className="btn btn--outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn confirm-delete__confirm" onClick={onConfirm}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Sim, remover
          </button>
        </div>
      </div>
    </div>
  );
}
