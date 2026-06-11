"use client";

import { useEffect } from "react";

export default function DeleteRaffleModal({ raffle, onClose, onConfirm }) {
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

  if (!raffle) return null;

  const label = raffle.title || raffle.prizeName || "Campanha sem título";

  return (
    <div className="confirm-delete" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title">
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
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        <p className="confirm-delete__eyebrow">Ação irreversível</p>
        <h2 id="confirm-delete-title" className="confirm-delete__title">Excluir campanha?</h2>
        <p className="confirm-delete__text">
          Todos os dados desta campanha serão removidos permanentemente, incluindo participantes e compras vinculadas.
        </p>

        <div className="confirm-delete__preview">
          <div
            className="confirm-delete__preview-cover"
            style={
              raffle.imageUrl
                ? undefined
                : {
                    background: `linear-gradient(135deg, ${raffle.themeColors?.primary || "#7C3AED"}, ${raffle.themeColors?.secondary || "#A855F7"})`,
                  }
            }
          >
            {raffle.imageUrl && <img src={raffle.imageUrl} alt="" />}
          </div>
          <div className="confirm-delete__preview-info">
            <strong>{label}</strong>
            {raffle.prizeName && raffle.prizeName !== label && (
              <span>{raffle.prizeName}</span>
            )}
          </div>
        </div>

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
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
}
