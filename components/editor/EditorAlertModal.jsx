"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function EditorAlertModal({
  open,
  onClose,
  onAction,
  title = "Atenção",
  message,
  actionLabel = "Entendi",
  tone = "warning",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  function handleAction() {
    if (onAction) onAction();
    else onClose();
  }

  return createPortal(
    <div className="editor-alert" role="dialog" aria-modal="true" aria-labelledby="editor-alert-title">
      <div className="editor-alert__backdrop" onClick={onClose} aria-hidden="true" />

      <div className={`editor-alert__panel editor-alert__panel--${tone}`}>
        <button type="button" className="editor-alert__close" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={`editor-alert__icon editor-alert__icon--${tone}`} aria-hidden="true">
          {tone === "warning" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>

        <p className="editor-alert__eyebrow">Quase lá</p>
        <h2 id="editor-alert-title" className="editor-alert__title">{title}</h2>
        <p className="editor-alert__text">{message}</p>

        <div className="editor-alert__actions">
          <button type="button" className="btn btn--outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn--violet editor-alert__confirm" onClick={handleAction}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
