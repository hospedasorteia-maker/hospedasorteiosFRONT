"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSettings, updateSettingsSection } from "@/lib/settings";

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

const METHODS = [
  {
    id: "pix",
    name: "PIX",
    short: "PIX",
    color: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h.01M17 14h.01M20 14h.01M14 17h.01M17 17h.01M20 17h.01M14 20h.01M17 20h.01M20 20h.01" />
      </svg>
    ),
  },
  {
    id: "cartao",
    name: "Cartão",
    short: "Cartão",
    color: "sky",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    id: "boleto",
    name: "Boleto",
    short: "Boleto",
    color: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
];

const GATEWAYS = [
  { id: "mercadopago", name: "Mercado Pago", taxa: "4,99% + R$ 0,40" },
  { id: "pagseguro", name: "PagSeguro", taxa: "4,99% + R$ 0,40" },
  { id: "stripe", name: "Stripe", taxa: "3,99% + R$ 0,50" },
  { id: "asaas", name: "Asaas", taxa: "2,99%" },
];

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
    updateSettingsSection("payment", payment);
    showToast("Configurações de pagamento salvas!");
  }

  if (!payment) {
    return (
      <div className="settings settings--loading">
        <div className="rifa-publica__spinner" />
      </div>
    );
  }

  const ativos = [payment.pixEnabled, payment.cartaoEnabled, payment.boletoEnabled].filter(Boolean).length;
  const gw = GATEWAYS.find((g) => g.id === payment.cartaoGateway);

  return (
    <div className="settings payment-settings">
      {toast && <div className="settings__toast">{toast}</div>}

      <div className="settings__head payment-settings__head">
        <div>
          <Link href="/dashboard/configuracoes" className="payment-settings__back">← Configurações</Link>
          <h1>Meios de Pagamento</h1>
          <p>Configure como seus participantes vão pagar</p>
        </div>
        <span className="payment-settings__badge">{ativos} ativo{ativos !== 1 ? "s" : ""}</span>
      </div>

      <div className="payment-settings__status">
        {METHODS.map((m) => {
          const on = m.id === "pix" ? payment.pixEnabled : m.id === "cartao" ? payment.cartaoEnabled : payment.boletoEnabled;
          return (
            <div key={m.id} className={`payment-settings__status-card payment-settings__status-card--${m.color}${on ? " is-active" : ""}`}>
              <span className={`payment-settings__status-icon payment-settings__status-icon--${m.color}`}>{m.icon}</span>
              <p>{m.short}</p>
              <span className={`settings-badge ${on ? "settings-badge--green" : ""}`}>{on ? "Ativo" : "Inativo"}</span>
            </div>
          );
        })}
      </div>

      <div className="payment-settings__sections">
        <div className={`payment-settings__method payment-settings__method--emerald${payment.pixEnabled ? " is-on" : ""}`}>
          <div className="payment-settings__method-head">
            <div>
              <strong>PIX</strong>
              <p>Pagamento instantâneo, 24h por dia</p>
            </div>
            <SettingsSwitch checked={payment.pixEnabled} onChange={(v) => update("pixEnabled", v)} />
          </div>
          {payment.pixEnabled && (
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
              <SettingsField label="Nome do titular" hint="Nome que aparece para o comprador">
                <input className="settings-input" value={payment.pixTitular} onChange={(e) => update("pixTitular", e.target.value)} />
              </SettingsField>
            </div>
          )}
        </div>

        <div className={`payment-settings__method payment-settings__method--sky${payment.cartaoEnabled ? " is-on" : ""}`}>
          <div className="payment-settings__method-head">
            <div>
              <strong>Cartão de Crédito / Débito</strong>
              <p>Aceite todas as bandeiras</p>
            </div>
            <SettingsSwitch checked={payment.cartaoEnabled} onChange={(v) => update("cartaoEnabled", v)} />
          </div>
          {payment.cartaoEnabled && (
            <div className="payment-settings__method-body">
              <SettingsField label="Gateway de pagamento">
                <div className="payment-settings__gateways">
                  {GATEWAYS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      className={`payment-settings__gateway${payment.cartaoGateway === g.id ? " is-active" : ""}`}
                      onClick={() => update("cartaoGateway", g.id)}
                    >
                      <strong>{g.name}</strong>
                      <span>{g.taxa}</span>
                    </button>
                  ))}
                </div>
              </SettingsField>
              {gw && (
                <p className="payment-settings__note">Taxa: <strong>{gw.taxa}</strong> por transação aprovada</p>
              )}
              <div className="settings-grid">
                <SettingsField label="Token / Chave de API" hint="Encontre nas configurações do gateway escolhido">
                  <input className="settings-input settings-input--mono" type="password" value={payment.cartaoToken} onChange={(e) => update("cartaoToken", e.target.value)} placeholder="••••••••••••••••" />
                </SettingsField>
                <SettingsField label="Parcelamento máximo">
                  <select className="settings-input" value={payment.cartaoParcelas} onChange={(e) => update("cartaoParcelas", e.target.value)}>
                    {["1", "2", "3", "4", "5", "6", "9", "12"].map((p) => (
                      <option key={p} value={p}>{p === "1" ? "À vista" : `Até ${p}x`}</option>
                    ))}
                  </select>
                </SettingsField>
              </div>
            </div>
          )}
        </div>

        <div className={`payment-settings__method payment-settings__method--amber${payment.boletoEnabled ? " is-on" : ""}`}>
          <div className="payment-settings__method-head">
            <div>
              <strong>Boleto Bancário</strong>
              <p>O número só é reservado após confirmação</p>
            </div>
            <SettingsSwitch checked={payment.boletoEnabled} onChange={(v) => update("boletoEnabled", v)} />
          </div>
          {payment.boletoEnabled && (
            <div className="settings-grid">
              <SettingsField label="Dias de vencimento" hint="A partir da data do pedido">
                <select className="settings-input" value={payment.boletoVencimento} onChange={(e) => update("boletoVencimento", e.target.value)}>
                  {["1", "2", "3", "5", "7"].map((d) => (
                    <option key={d} value={d}>{d} {d === "1" ? "dia" : "dias"}</option>
                  ))}
                </select>
              </SettingsField>
              <SettingsField label="Instrução do boleto" hint="Aparece no rodapé do boleto">
                <input className="settings-input" value={payment.boletoInstrucao} onChange={(e) => update("boletoInstrucao", e.target.value)} />
              </SettingsField>
            </div>
          )}
        </div>
      </div>

      <SectionTitle title="Configurações Gerais" sub="Comportamento do checkout e reservas" />
      <div className="settings-card settings-card--list">
        <div className="settings-general-row">
          <div>
            <strong>Tempo de reserva do número</strong>
            <p>Após escolher o número, quanto tempo o participante tem para pagar</p>
          </div>
          <select className="settings-input settings-input--xs" value={payment.reservaMinutos} onChange={(e) => update("reservaMinutos", e.target.value)}>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="60">1 hora</option>
            <option value="120">2 horas</option>
            <option value="1440">24 horas</option>
          </select>
        </div>
        <div className="settings-general-row">
          <div>
            <strong>Estilo do checkout</strong>
            <p>Como a tela de pagamento é exibida ao comprador</p>
          </div>
          <select className="settings-input settings-input--xs" value={payment.checkoutEstilo} onChange={(e) => update("checkoutEstilo", e.target.value)}>
            <option value="padrao">Padrão</option>
            <option value="modal">Modal / Popup</option>
            <option value="redirect">Página externa</option>
          </select>
        </div>
      </div>

      <div className="payment-settings__security">
        <span>🛡</span>
        <p>
          Todas as transações são criptografadas com <strong>SSL/TLS</strong>.
          Dados de cartão nunca passam pelos nossos servidores — processados diretamente pelo gateway escolhido.
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
