"use client";

import { useEffect, useState } from "react";
import { getBuyerProfile } from "@/lib/purchases";

export default function BuyerInfoModal({ open, onClose, onSubmit, primaryColor = "#7C3AED", numbersCount = 0, amount = 0 }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  useEffect(() => {
    if (!open) return;
    const saved = getBuyerProfile();
    if (saved) {
      setName(saved.name || "");
      setPhone(saved.phone || "");
      setCpf(saved.cpf || "");
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ name: name.trim(), phone: phone.trim(), cpf: cpf.trim() });
  }

  return (
    <div className="buyer-modal" role="dialog" aria-modal="true">
      <div className="buyer-modal__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="buyer-modal__panel">
        <div className="buyer-modal__head">
          <h2>Seus dados</h2>
          <p>Informe seus dados para reservar {numbersCount} número(s)</p>
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

          {amount > 0 && (
            <p className="buyer-modal__total">
              Total: <strong style={{ color: primaryColor }}>R$ {amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
            </p>
          )}

          <div className="buyer-modal__actions">
            <button type="button" className="btn btn--outline" onClick={onClose}>Voltar</button>
            <button type="submit" className="btn btn--violet">Continuar para PIX</button>
          </div>
        </form>
      </div>
    </div>
  );
}
