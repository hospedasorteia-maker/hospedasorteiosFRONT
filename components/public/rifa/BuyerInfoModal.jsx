"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getBuyerProfile } from "@/lib/services/purchases";
import { formatBichoPurchaseLabel } from "@/lib/services/jogoDoBicho";

function formatNumbersLabel(numbers, isBicho, bichoPlayMode = "dezena") {
  if (!numbers?.length) return "";
  if (isBicho) return numbers.map((n) => formatBichoPurchaseLabel(n, bichoPlayMode)).join(", ");
  return numbers.join(", ");
}

export default function BuyerInfoModal({
  open,
  onClose,
  onSubmit,
  primaryColor = "#7C3AED",
  numbersCount = 0,
  amount = 0,
  numbers = [],
  isBicho = false,
  bichoPlayMode = "dezena",
}) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const saved = getBuyerProfile();
    if (saved) {
      setName(saved.name || "");
      setPhone(saved.phone || "");
      setCpf(saved.cpf || "");
    }
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

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ name: name.trim(), phone: phone.trim(), cpf: cpf.trim() });
  }

  const numbersLabel = formatNumbersLabel(numbers, isBicho, bichoPlayMode);

  return createPortal(
    <div className="buyer-modal" role="dialog" aria-modal="true" aria-labelledby="buyer-modal-title">
      <div className="buyer-modal__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="buyer-modal__panel">
        <div className="buyer-modal__head">
          <h2 id="buyer-modal-title">Seus dados</h2>
          <p>Informe seus dados para reservar {numbersCount}{" "}
            {isBicho ? (bichoPlayMode === "grupo" ? "bicho(s)" : "dezena(s)") : "número(s)"}
          </p>
          {numbersLabel && (
            <p className="buyer-modal__numbers">{numbersLabel}</p>
          )}
        </div>

        <form className="buyer-modal__form" onSubmit={handleSubmit}>
          <div className="buyer-modal__field">
            <label htmlFor="buyer-name">Nome completo</label>
            <input id="buyer-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
          </div>

          <div className="buyer-modal__field">
            <label htmlFor="buyer-phone">WhatsApp</label>
            <input id="buyer-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" />
          </div>

          <div className="buyer-modal__field">
            <label htmlFor="buyer-cpf">CPF</label>
            <input id="buyer-cpf" required value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
          </div>

          <p className="buyer-modal__total">
            Total:{" "}
            <strong style={{ color: primaryColor }}>
              {amount > 0
                ? `R$ ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : "Grátis"}
            </strong>
          </p>

          <div className="buyer-modal__actions">
            <button type="button" className="btn btn--outline" onClick={onClose}>Voltar</button>
            <button type="submit" className="btn btn--violet" style={{ backgroundColor: primaryColor, borderColor: primaryColor }}>
              Continuar para PIX
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
