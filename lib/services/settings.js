import { PIX_DEFAULTS } from "@/lib/services/pixConfig";

const STORAGE_KEY = "TironiDraws_settings";

export const BRAZIL_STATES = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT",
  "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO",
];

export const DEFAULT_SETTINGS = {
  profile: {
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(11) 99999-1234",
    bio: "Organizador de sorteios e rifas online.",
    site: "https://meusite.com.br",
    cidade: "São Paulo",
    estado: "SP",
    plano: "Plano Gratuito",
  },
  notifications: {
    email_novo_participante: true,
    email_pagamento: true,
    email_sorteio_encerrado: true,
    email_marketing: false,
    whatsapp_pagamento: false,
    whatsapp_resumo: false,
    push_tudo: true,
    push_pagamento: true,
    resumo_diario: true,
    resumo_semanal: false,
  },
  security: {
    twoFactor: false,
  },
  appearance: {
    theme: "light",
    accent: "#7c3aed",
    density: "normal",
    lang: "pt-BR",
  },
  integrations: {
    pix: true,
    mercadopago: false,
    whatsapp: false,
    google: true,
    apiKey: "sk_live_demo_TironiDraws_2026",
  },
  payment: {
    pixEnabled: true,
    pixTipo: "email",
    pixChave: PIX_DEFAULTS.key,
    pixTitular: PIX_DEFAULTS.merchantName,
    cartaoEnabled: false,
    cartaoGateway: "mercadopago",
    cartaoToken: "",
    cartaoParcelas: "12",
    boletoEnabled: false,
    boletoVencimento: "3",
    boletoInstrucao: "Não aceitar após o vencimento.",
    reservaMinutos: "30",
    checkoutEstilo: "padrao",
  },
  support: {
    whatsapp: "",
    email: "",
    whatsappMessage: "Olá! Tenho uma dúvida sobre o sorteio.",
  },
};

function mergeSettings(stored) {
  return {
    profile: { ...DEFAULT_SETTINGS.profile, ...stored?.profile },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...stored?.notifications },
    security: { ...DEFAULT_SETTINGS.security, ...stored?.security },
    appearance: { ...DEFAULT_SETTINGS.appearance, ...stored?.appearance },
    integrations: { ...DEFAULT_SETTINGS.integrations, ...stored?.integrations },
    payment: { ...DEFAULT_SETTINGS.payment, ...stored?.payment },
    support: { ...DEFAULT_SETTINGS.support, ...stored?.support },
  };
}

export function getSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return mergeSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  const merged = mergeSettings(settings);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  applyAppearanceSettings(merged.appearance);
  return merged;
}

export function updateSettingsSection(section, partial) {
  const current = getSettings();
  const next = {
    ...current,
    [section]: { ...current[section], ...partial },
  };
  return saveSettings(next);
}

export function getPaymentSettings() {
  return getSettings().payment;
}

export function getSupportSettings() {
  const settings = getSettings();
  return {
    whatsapp: settings.support?.whatsapp?.trim() || settings.profile?.telefone?.trim() || "",
    email: settings.support?.email?.trim() || settings.profile?.email?.trim() || "",
    whatsappMessage: settings.support?.whatsappMessage?.trim() || "Olá! Tenho uma dúvida sobre o sorteio.",
  };
}

export function getGlobalPixConfig() {
  const payment = getPaymentSettings();
  if (!payment.pixEnabled) return null;
  return {
    pixKey: payment.pixChave?.trim() || "",
    merchantName: payment.pixTitular?.trim() || "",
  };
}

export function generateApiKey() {
  const rand = Math.random().toString(36).slice(2, 10);
  return `sk_live_${rand}_${Date.now().toString(36)}`;
}

export function applyAppearanceSettings(appearance) {
  if (typeof document === "undefined") return;
  const app = document.querySelector(".app");
  if (!app) return;

  app.style.setProperty("--settings-accent", appearance?.accent || "#7c3aed");
  app.dataset.theme = appearance?.theme || "light";
  app.dataset.density = appearance?.density || "normal";
}

export function initSettingsAppearance() {
  applyAppearanceSettings(getSettings().appearance);
}
