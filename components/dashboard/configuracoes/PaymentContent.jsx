"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSettings, updateSettingsSection } from "@/lib/services/settings";

function SettingsSwitch({ checked, onChange }) {
  return (
    <label className="settings-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="settings-switch__track" />
    </label>
  );
}

function SettingsField({ label, hint, children }) {
  return (
    <div className="settings-field">
      <label>{label}</label>
      {children}
      {hint && <small>{hint}</small>}
    </div>
  );
}

function SectionTitle({ title, sub }) {
  return (
    <div className="settings-section-title">
      <h3>{title}</h3>
      {sub && <p>{sub}</p>}
    </div>
  );
}

export default function PaymentContent() {
  const [payment, setPayment] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setPayment(getSettings().payment);
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function update(field, value) {
    setPayment((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!payment) return;
    updateSettingsSection("payment", {
      ...payment,
      pixEnabled: true,
      cartaoEnabled: false,
      boletoEnabled: false,
    });
    showToast("Configurações de pagamento salvas!");
  }

  if (!payment) {
    return (
      <div className="settings settings--loading">
        <div className="rifa-publica__spinner" />
      </div>
    );
  }

  return (
    <div className="settings payment-settings">
      {toast && <div className="settings__toast">{toast}</div>}

      <div className="settings__head payment-settings__head">
        <div>
          <Link href="/dashboard/configuracoes" className="payment-settings__back">← Configurações</Link>
          <p className="settings__eyebrow">Checkout do comprador</p>
          <h1>Recebimento via PIX</h1>
          <p>A página pública do sorteio aceita apenas PIX. Configure a chave que o comprador usará para pagar.</p>
        </div>
        <span className="payment-settings__badge">PIX ativo</span>
      </div>

      <div className="payment-settings__status">
        <div className="payment-settings__status-card payment-settings__status-card--emerald is-active">
          <span className="payment-settings__status-icon payment-settings__status-icon--emerald">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M14 14h.01M17 14h.01M20 14h.01M14 17h.01M17 17h.01M20 17h.01M14 20h.01M17 20h.01M20 20h.01" />
            </svg>
          </span>
          <p>PIX</p>
          <span className="settings-badge settings-badge--green">Único meio no checkout</span>
        </div>
      </div>

      <div className="payment-settings__sections">
        <div className="payment-settings__method payment-settings__method--emerald is-on">
          <div className="payment-settings__method-head">
            <div>
              <strong>Chave PIX do organizador</strong>
              <p>Usada na geração do QR Code e do copia e cola na página pública</p>
            </div>
            <SettingsSwitch checked={payment.pixEnabled} onChange={() => update("pixEnabled", true)} />
          </div>
          <div className="settings-grid">
            <SettingsField label="Tipo de chave PIX">
              <select className="settings-input" value={payment.pixTipo} onChange={(e) => update("pixTipo", e.target.value)}>
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="email">E-mail</option>
                <option value="telefone">Telefone</option>
                <option value="aleatoria">Chave aleatória</option>
              </select>
            </SettingsField>
            <SettingsField label="Chave PIX" hint="Exatamente como cadastrada no seu banco">
              <input className="settings-input" value={payment.pixChave} onChange={(e) => update("pixChave", e.target.value)} />
            </SettingsField>
            <SettingsField label="Nome do titular" hint="Nome que aparece para o comprador no PIX">
              <input className="settings-input" value={payment.pixTitular} onChange={(e) => update("pixTitular", e.target.value)} />
            </SettingsField>
          </div>
        </div>
      </div>

      <SectionTitle title="Reserva de números" sub="Tempo para o comprador concluir o PIX após escolher os números" />
      <div className="settings-card settings-card--list">
        <div className="settings-general-row">
          <div>
            <strong>Tempo de reserva do número</strong>
            <p>Após escolher o número, quanto tempo o participante tem para pagar via PIX</p>
          </div>
          <select className="settings-input settings-input--xs" value={payment.reservaMinutos} onChange={(e) => update("reservaMinutos", e.target.value)}>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="60">1 hora</option>
            <option value="120">2 horas</option>
            <option value="1440">24 horas</option>
          </select>
        </div>
      </div>

      <div className="payment-settings__security">
        <span>🛡</span>
        <p>
          O checkout público gera QR Code PIX e código copia e cola.
          Cartão e boleto não estão disponíveis para o comprador final.
        </p>
      </div>

      <div className="settings-actions">
        <button type="button" className="btn btn--violet" onClick={handleSave}>
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
