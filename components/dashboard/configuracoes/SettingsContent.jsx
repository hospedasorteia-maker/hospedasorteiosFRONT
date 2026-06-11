"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BRAZIL_STATES,
  generateApiKey,
  getSettings,
  initSettingsAppearance,
  updateSettingsSection,
} from "@/lib/settings";

function SettingsSwitch({ checked, onChange, label, hint }) {
  return (
    <div className="settings-switch-row">
      <div>
        {label && <p>{label}</p>}
        {hint && <span>{hint}</span>}
      </div>
      <label className="settings-switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="settings-switch__track" />
      </label>
    </div>
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

function TabPerfil({ profile, onSave, onToast }) {
  const [form, setForm] = useState(profile);
  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  return (
    <div className="settings-tab">
      <div className="settings-profile-head">
        <div className="settings-profile-head__avatar">{form.nome?.charAt(0) || "?"}</div>
        <div>
          <strong>{form.nome}</strong>
          <p>{form.email}</p>
          <span className="settings-badge settings-badge--violet">{form.plano || "Plano Gratuito"}</span>
        </div>
      </div>

      <hr className="settings-divider" />

      <SectionTitle title="Informações Pessoais" sub="Informações exibidas no seu perfil público" />
      <div className="settings-grid">
        <SettingsField label="Nome completo">
          <input className="settings-input" value={form.nome} onChange={set("nome")} />
        </SettingsField>
        <SettingsField label="E-mail">
          <input className="settings-input" type="email" value={form.email} onChange={set("email")} />
        </SettingsField>
        <SettingsField label="Telefone / WhatsApp">
          <input className="settings-input" value={form.telefone} onChange={set("telefone")} />
        </SettingsField>
        <SettingsField label="Site ou link">
          <input className="settings-input" value={form.site} onChange={set("site")} />
        </SettingsField>
        <SettingsField label="Cidade">
          <input className="settings-input" value={form.cidade} onChange={set("cidade")} />
        </SettingsField>
        <SettingsField label="Estado">
          <select className="settings-input" value={form.estado} onChange={set("estado")}>
            {BRAZIL_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </SettingsField>
        <SettingsField label="Bio" hint="Aparece na página pública dos seus sorteios">
          <textarea className="settings-input settings-textarea" rows={3} value={form.bio} onChange={set("bio")} />
        </SettingsField>
      </div>

      <div className="settings-actions">
        <button type="button" className="btn btn--violet" onClick={() => { onSave(form); onToast("Perfil salvo com sucesso!"); }}>
          Salvar Perfil
        </button>
      </div>
    </div>
  );
}

function TabNotificacoes({ notifications, onSave, onToast }) {
  const [cfg, setCfg] = useState(notifications);
  const toggle = (key) => setCfg((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    setCfg(notifications);
  }, [notifications]);

  return (
    <div className="settings-tab">
      <SectionTitle title="Preferências de Notificação" sub="Escolha quando e como receber alertas" />

      <div className="settings-card">
        <p className="settings-card__label">E-mail</p>
        <SettingsSwitch checked={cfg.email_novo_participante} onChange={() => toggle("email_novo_participante")} label="Novo participante" hint="Receba um e-mail a cada nova compra" />
        <SettingsSwitch checked={cfg.email_pagamento} onChange={() => toggle("email_pagamento")} label="Pagamento confirmado" hint="Alerta quando um pagamento é aprovado" />
        <SettingsSwitch checked={cfg.email_sorteio_encerrado} onChange={() => toggle("email_sorteio_encerrado")} label="Sorteio encerrado" hint="Quando todos os números forem vendidos" />
        <SettingsSwitch checked={cfg.email_marketing} onChange={() => toggle("email_marketing")} label="Novidades e promoções" hint="Dicas e atualizações da plataforma" />
      </div>

      <div className="settings-card">
        <p className="settings-card__label">WhatsApp</p>
        <SettingsSwitch checked={cfg.whatsapp_pagamento} onChange={() => toggle("whatsapp_pagamento")} label="Confirmação de pagamento" hint="Notificação instantânea pelo WhatsApp" />
        <SettingsSwitch checked={cfg.whatsapp_resumo} onChange={() => toggle("whatsapp_resumo")} label="Resumo diário" hint="Resumo das vendas do day às 20h" />
      </div>

      <div className="settings-card">
        <p className="settings-card__label">Relatórios automáticos</p>
        <SettingsSwitch checked={cfg.resumo_diario} onChange={() => toggle("resumo_diario")} label="Resumo diário" hint="Receba um resumo todos os dias às 8h" />
        <SettingsSwitch checked={cfg.resumo_semanal} onChange={() => toggle("resumo_semanal")} label="Resumo semanal" hint="Receba um relatório completo toda segunda" />
      </div>

      <div className="settings-actions">
        <button type="button" className="btn btn--violet" onClick={() => { onSave(cfg); onToast("Notificações salvas!"); }}>
          Salvar Preferências
        </button>
      </div>
    </div>
  );
}

function TabSeguranca({ security, onSave, onToast }) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFactor, setTwoFactor] = useState(security.twoFactor);

  useEffect(() => {
    setTwoFactor(security.twoFactor);
  }, [security.twoFactor]);

  const sessions = [
    { device: "Chrome — Windows 11", local: "São Paulo, BR", time: "Agora", current: true },
    { device: "Safari — iPhone 14", local: "São Paulo, BR", time: "Há 2 horas", current: false },
    { device: "Firefox — macOS", local: "Rio de Janeiro, BR", time: "Ontem", current: false },
  ];

  return (
    <div className="settings-tab">
      <SectionTitle title="Senha" sub="Altere sua senha de acesso" />
      <div className="settings-grid settings-grid--narrow">
        <SettingsField label="Senha atual">
          <div className="settings-input-wrap">
            <input className="settings-input" type={showOld ? "text" : "password"} placeholder="••••••••" />
            <button type="button" className="settings-input-wrap__btn" onClick={() => setShowOld(!showOld)}>
              {showOld ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </SettingsField>
        <div />
        <SettingsField label="Nova senha">
          <div className="settings-input-wrap">
            <input className="settings-input" type={showNew ? "text" : "password"} placeholder="••••••••" />
            <button type="button" className="settings-input-wrap__btn" onClick={() => setShowNew(!showNew)}>
              {showNew ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </SettingsField>
        <SettingsField label="Confirmar nova senha">
          <input className="settings-input" type="password" placeholder="••••••••" />
        </SettingsField>
      </div>
      <button type="button" className="btn btn--outline" onClick={() => onToast("Senha alterada!")}>
        Alterar Senha
      </button>

      <hr className="settings-divider" />

      <SectionTitle title="Autenticação em dois fatores (2FA)" sub="Adicione uma camada extra de proteção à sua conta" />
      <div className="settings-highlight">
        <div className="settings-highlight__info">
          <span className="settings-highlight__icon">🛡</span>
          <div>
            <strong>Autenticação via app autenticador</strong>
            <p>Google Authenticator ou similar</p>
          </div>
        </div>
        <div className="settings-highlight__actions">
          <span className={`settings-badge ${twoFactor ? "settings-badge--green" : ""}`}>
            {twoFactor ? "Ativo" : "Inativo"}
          </span>
          <SettingsSwitch
            checked={twoFactor}
            onChange={(v) => {
              setTwoFactor(v);
              onSave({ twoFactor: v });
              onToast(v ? "2FA ativado!" : "2FA desativado");
            }}
          />
        </div>
      </div>

      <hr className="settings-divider" />

      <SectionTitle title="Sessões Ativas" sub="Dispositivos com acesso ativo à sua conta" />
      <div className="settings-card settings-card--list">
        {sessions.map((s) => (
          <div key={s.device} className="settings-session">
            <div>
              <strong>{s.device}</strong>
              <p>{s.local} · {s.time}</p>
            </div>
            {s.current ? (
              <span className="settings-badge settings-badge--green">Sessão atual</span>
            ) : (
              <button type="button" className="btn btn--ghost btn--sm settings-btn-danger" onClick={() => onToast("Sessão encerrada")}>
                Encerrar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabAparencia({ appearance, onSave, onToast }) {
  const [cfg, setCfg] = useState(appearance);
  const accents = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

  useEffect(() => {
    setCfg(appearance);
  }, [appearance]);

  return (
    <div className="settings-tab">
      <SectionTitle title="Tema" sub="Personalize a aparência da plataforma" />
      <div className="settings-theme-grid">
        {[
          { id: "light", label: "Claro" },
          { id: "dark", label: "Escuro" },
          { id: "auto", label: "Automático" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`settings-theme-btn${cfg.theme === t.id ? " is-active" : ""}`}
            onClick={() => setCfg((p) => ({ ...p, theme: t.id }))}
          >
            {cfg.theme === t.id ? "✓ " : ""}{t.label}
          </button>
        ))}
      </div>

      <hr className="settings-divider" />

      <SectionTitle title="Cor de Destaque" sub="Cor de destaque dos botões e elementos interativos" />
      <div className="settings-accents">
        {accents.map((c) => (
          <button
            key={c}
            type="button"
            className={`settings-accent${cfg.accent === c ? " is-active" : ""}`}
            style={{ backgroundColor: c }}
            onClick={() => setCfg((p) => ({ ...p, accent: c }))}
            aria-label={`Cor ${c}`}
          />
        ))}
      </div>

      <hr className="settings-divider" />

      <SectionTitle title="Densidade" sub="Espaçamento e tamanho dos elementos" />
      <div className="settings-density">
        {["compacto", "normal", "confortável"].map((d) => (
          <button
            key={d}
            type="button"
            className={`settings-density-btn${cfg.density === d ? " is-active" : ""}`}
            onClick={() => setCfg((p) => ({ ...p, density: d }))}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      <hr className="settings-divider" />

      <SectionTitle title="Idioma" sub="Idioma da interface" />
      <select className="settings-input settings-input--sm" value={cfg.lang} onChange={(e) => setCfg((p) => ({ ...p, lang: e.target.value }))}>
        <option value="pt-BR">Português (Brasil)</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>

      <div className="settings-actions">
        <button type="button" className="btn btn--violet" onClick={() => { onSave(cfg); onToast("Aparência salva!"); }}>
          Salvar Aparência
        </button>
      </div>
    </div>
  );
}

function TabIntegracao({ integrations, onSave, onToast }) {
  const [cfg, setCfg] = useState(integrations);

  useEffect(() => {
    setCfg(integrations);
  }, [integrations]);

  const items = [
    { id: "pix", name: "PIX", desc: "Receba pagamentos via chave PIX automaticamente.", color: "emerald" },
    { id: "mercadopago", name: "Mercado Pago", desc: "Aceite cartões, boleto e PIX com split automático.", color: "sky" },
    { id: "whatsapp", name: "WhatsApp Business", desc: "Notifique participantes e envie confirmações.", color: "green" },
    { id: "google", name: "Google Analytics", desc: "Acompanhe métricas e conversão das suas páginas.", color: "amber" },
  ];

  function toggle(id, name) {
    const next = !cfg[id];
    const updated = { ...cfg, [id]: next };
    setCfg(updated);
    onSave({ [id]: next });
    onToast(next ? `${name} conectado!` : `${name} desconectado`);
  }

  function copyApiKey() {
    navigator.clipboard.writeText(cfg.apiKey);
    onToast("Chave copiada!");
  }

  function regenerateKey() {
    const key = generateApiKey();
    const updated = { ...cfg, apiKey: key };
    setCfg(updated);
    onSave({ apiKey: key });
    onToast("Nova chave gerada!");
  }

  return (
    <div className="settings-tab">
      <SectionTitle title="Integrações disponíveis" sub="Conecte ferramentas externas à sua conta" />
      <div className="settings-integrations">
        {items.map((int) => (
          <div key={int.id} className="settings-integration">
            <div className="settings-integration__info">
              <span className={`settings-integration__icon settings-integration__icon--${int.color}`}>{int.name[0]}</span>
              <div>
                <strong>{int.name}</strong>
                <p>{int.desc}</p>
              </div>
            </div>
            <div className="settings-integration__actions">
              <span className={`settings-badge ${cfg[int.id] ? "settings-badge--green" : ""}`}>
                {cfg[int.id] ? "Conectado" : "Desconectado"}
              </span>
              <button
                type="button"
                className={`btn btn--sm ${cfg[int.id] ? "btn--outline" : "btn--violet"}`}
                onClick={() => toggle(int.id, int.name)}
              >
                {cfg[int.id] ? "Desconectar" : "Conectar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <hr className="settings-divider" />

      <SectionTitle title="API Key" sub="Use a API para integrar com sistemas próprios" />
      <div className="settings-card">
        <SettingsField label="Sua chave de API" hint="Não compartilhe esta chave com ninguém.">
          <div className="settings-api-row">
            <input className="settings-input settings-input--mono" value={cfg.apiKey} readOnly />
            <button type="button" className="btn btn--outline btn--sm" onClick={copyApiKey}>Copiar</button>
          </div>
        </SettingsField>
        <button type="button" className="btn btn--outline btn--sm settings-btn-danger" onClick={regenerateKey}>
          Gerar nova chave
        </button>
      </div>
    </div>
  );
}

const TABS = [
  { id: "perfil", label: "Perfil" },
  { id: "notificacoes", label: "Notificações" },
  { id: "seguranca", label: "Segurança" },
  { id: "aparencia", label: "Aparência" },
  { id: "integracao", label: "Integrações" },
];

export default function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [tab, setTab] = useState("perfil");
  const [settings, setSettings] = useState(null);
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    setSettings(getSettings());
    initSettingsAppearance();
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (initialTab && TABS.some((t) => t.id === initialTab)) {
      setTab(initialTab);
    }
  }, [initialTab]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function saveSection(section, data) {
    const next = updateSettingsSection(section, data);
    setSettings(next);
  }

  if (!settings) {
    return (
      <div className="settings settings--loading">
        <div className="rifa-publica__spinner" />
      </div>
    );
  }

  const tabContent = {
    perfil: <TabPerfil profile={settings.profile} onSave={(d) => saveSection("profile", d)} onToast={showToast} />,
    notificacoes: <TabNotificacoes notifications={settings.notifications} onSave={(d) => saveSection("notifications", d)} onToast={showToast} />,
    seguranca: <TabSeguranca security={settings.security} onSave={(d) => saveSection("security", d)} onToast={showToast} />,
    aparencia: <TabAparencia appearance={settings.appearance} onSave={(d) => saveSection("appearance", d)} onToast={showToast} />,
    integracao: <TabIntegracao integrations={settings.integrations} onSave={(d) => saveSection("integrations", d)} onToast={showToast} />,
  }[tab];

  return (
    <div className="settings">
      {toast && <div className="settings__toast">{toast}</div>}

      <div className="settings__head">
        <h1>Configurações</h1>
        <p>Gerencie sua conta, segurança e preferências</p>
      </div>

      <div className="settings__layout">
        <aside className="settings__nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`settings__nav-item${tab === t.id ? " is-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <div className="settings__panel">{tabContent}</div>
      </div>
    </div>
  );
}
