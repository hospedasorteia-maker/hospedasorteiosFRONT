"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";
import { fmtCurrency } from "@/lib/raffles";
import { formatBichoPurchaseLabel } from "@/lib/jogoDoBicho";

export default function PixPaymentModal({
  open,
  onClose,
  onConfirm,
  pixPayload,
  amount,
  numbers = [],
  raffleTitle,
  primaryColor = "#7C3AED",
  isBicho = false,
  bichoPlayMode = "dezena",
}) {
  const [mounted, setMounted] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState(900);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !pixPayload) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(pixPayload, {
      width: 220,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [open, pixPayload]);

  useEffect(() => {
    if (!open) return;

    setCopied(false);
    setExpiresIn(900);

    const timer = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  function handleCopy() {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  const numbersLabel = numbers
    .slice(0, 12)
    .map((n) => (isBicho ? formatBichoPurchaseLabel(n, bichoPlayMode) : String(n).padStart(2, "0")))
    .join(", ");

  return createPortal(
    <div className="pix-modal" role="dialog" aria-modal="true" aria-labelledby="pix-modal-title">
      <div className="pix-modal__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="pix-modal__panel">
        <div className="pix-modal__head">
          <div>
            <p className="pix-modal__eyebrow">Pagamento via PIX</p>
            <h2 id="pix-modal-title">Finalize sua compra</h2>
          </div>
          <button type="button" className="pix-modal__close" onClick={onClose} aria-label="Fechar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="pix-modal__amount" style={{ color: primaryColor }}>
          {amount > 0 ? `R$ ${fmtCurrency(amount)}` : "Grátis"}
        </div>

        <p className="pix-modal__subtitle">
          {numbers.length}{" "}
          {isBicho ? (bichoPlayMode === "grupo" ? "bicho(s)" : "dezena(s)") : "número(s)"} — {raffleTitle}
        </p>

        <div className="pix-modal__numbers">
          <span>{numbersLabel}{numbers.length > 12 ? ` +${numbers.length - 12}` : ""}</span>
        </div>

        <div className="pix-modal__qr">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code PIX" width={220} height={220} />
          ) : (
            <div className="pix-modal__qr-loading">Gerando QR Code...</div>
          )}
        </div>

        <p className="pix-modal__timer">
          {expiresIn > 0 ? (
            <>Expira em <strong>{formatTime(expiresIn)}</strong></>
          ) : (
            <span className="pix-modal__expired">PIX expirado — feche e tente novamente</span>
          )}
        </p>

        <div className="pix-modal__code">
          <label htmlFor="pix-code">PIX copia e cola</label>
          <div className="pix-modal__code-row">
            <input id="pix-code" readOnly value={pixPayload} />
            <button type="button" className="btn btn--outline btn--sm" onClick={handleCopy}>
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        <ol className="pix-modal__steps">
          <li>Abra o app do seu banco</li>
          <li>Escolha pagar com PIX (QR Code ou copia e cola)</li>
          <li>Confirme o valor e finalize o pagamento</li>
        </ol>

        <div className="pix-modal__actions">
          <button type="button" className="btn btn--outline" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn--violet"
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            disabled={expiresIn === 0}
            onClick={onConfirm}
          >
            Já paguei
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
