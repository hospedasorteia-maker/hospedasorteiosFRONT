import { getSupportSettings } from "@/lib/services/settings";
import { buildWhatsAppHref } from "@/lib/services/whatsapp";

const TICKETS_KEY = "TironiDraws_support_tickets";

export function getSupportContacts() {
  return getSupportSettings();
}

export { buildWhatsAppHref };

export function buildSupportChannels(contacts = null) {
  const { whatsapp, email, whatsappMessage } = contacts || getSupportContacts();
  const channels = [];

  if (email) {
    channels.push({
      id: "email",
      title: "E-mail",
      desc: email,
      badge: "Resposta em 2h",
      color: "sky",
      href: `mailto:${email}?subject=${encodeURIComponent("Dúvida sobre o sorteio")}`,
      configured: true,
    });
  }

  if (whatsapp) {
    channels.push({
      id: "whatsapp",
      title: "WhatsApp",
      desc: whatsapp,
      badge: "Resposta rápida",
      color: "emerald",
      href: buildWhatsAppHref(whatsapp, whatsappMessage),
      configured: true,
    });
  }

  return channels;
}

export const SUPPORT_FAQS = [
  {
    q: "Como criar meu primeiro sorteio?",
    a: "Acesse o Dashboard e clique em 'Criar Sorteio'. Preencha as informações do prêmio, defina a quantidade de números e o preço, escolha as cores e publique. Leva menos de 5 minutos!",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Aceitamos PIX, cartão de crédito/débito e boleto bancário. Configure as opções em Meio de Pagamento.",
  },
  {
    q: "Como faço o sorteio do ganhador?",
    a: "Quando todas as cotas forem vendidas (ou na data definida), acesse sua campanha no editor e use a aba Resultado para definir o ganhador.",
  },
  {
    q: "Quanto tempo leva para receber os pagamentos?",
    a: "Pagamentos via PIX caem em até 1 hora. Cartão de crédito em até 2 dias úteis. Boleto em até 3 dias após a compensação.",
  },
  {
    q: "Posso personalizar a página do sorteio?",
    a: "Sim! No editor da rifa você pode alterar cores, posição da imagem, estilo do card e muito mais para combinar com sua marca.",
  },
  {
    q: "O que acontece se um participante pedir reembolso?",
    a: "Você pode cancelar a cota do participante no painel de Participantes. O estorno seria processado pelo gateway de pagamento em produção.",
  },
];

export const HELP_CATEGORIES = [
  {
    id: "sorteios",
    title: "Sorteios",
    desc: "Criar, editar e gerenciar campanhas",
    color: "violet",
    articles: [
      { title: "Como criar meu primeiro sorteio", time: "2 min", href: "/dashboard/editor/new" },
      { title: "Configurar quantidade de números e preço", time: "3 min", href: "/dashboard/editor/new" },
      { title: "Personalizar cores e layout", time: "2 min", href: "/dashboard/editor/new" },
      { title: "Publicar e compartilhar o link", time: "1 min", href: "/dashboard" },
      { title: "Como realizar o sorteio do ganhador", time: "3 min", href: "/dashboard" },
    ],
  },
  {
    id: "pagamentos",
    title: "Pagamentos",
    desc: "PIX, cartão, boleto e recebimentos",
    color: "sky",
    articles: [
      { title: "Configurar recebimento via PIX", time: "3 min", href: "/dashboard/configuracoes/pagamento" },
      { title: "Ativar cartão de crédito e débito", time: "4 min", href: "/dashboard/configuracoes/pagamento" },
      { title: "Como funciona o boleto bancário", time: "2 min", href: "/dashboard/configuracoes/pagamento" },
      { title: "Prazo para receber pagamentos", time: "2 min", href: "/dashboard/suporte" },
      { title: "Solicitar reembolso para um participante", time: "3 min", href: "/dashboard/participantes" },
    ],
  },
  {
    id: "participantes",
    title: "Participantes",
    desc: "Gerenciar compradores e cotas",
    color: "emerald",
    articles: [
      { title: "Ver todos os participantes de um sorteio", time: "1 min", href: "/dashboard/participantes" },
      { title: "Filtrar por status de pagamento", time: "1 min", href: "/dashboard/participantes" },
      { title: "Exportar lista de participantes", time: "2 min", href: "/dashboard/participantes" },
      { title: "Cancelar e remover uma cota", time: "2 min", href: "/dashboard/participantes" },
    ],
  },
  {
    id: "conta",
    title: "Conta e Configurações",
    desc: "Perfil, segurança e notificações",
    color: "amber",
    articles: [
      { title: "Alterar senha da conta", time: "2 min", href: "/dashboard/configuracoes?tab=seguranca" },
      { title: "Configurar notificações por e-mail", time: "2 min", href: "/dashboard/configuracoes?tab=notificacoes" },
      { title: "Atualizar dados do perfil", time: "1 min", href: "/dashboard/configuracoes?tab=perfil" },
      { title: "Ver relatórios de vendas", time: "2 min", href: "/dashboard/relatorios" },
    ],
  },
];

export const POPULAR_ARTICLES = [
  "Como criar meu primeiro sorteio",
  "Configurar recebimento via PIX",
  "Como realizar o sorteio do ganhador",
  "Prazo para receber pagamentos",
  "Exportar lista de participantes",
];

export const SUPPORT_CHANNELS = [];

const SUBJECT_LABELS = {
  pagamento: "Problema com pagamento",
  sorteio: "Dúvida sobre sorteio",
  tecnico: "Problema técnico",
  conta: "Minha conta",
  outro: "Outro",
};

export function getSubjectLabel(value) {
  return SUBJECT_LABELS[value] || value || "Geral";
}

export function getTicketsFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TICKETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTicket(ticket) {
  const entry = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    status: "aberto",
    ...ticket,
  };
  const list = [entry, ...getTicketsFromStorage()];
  localStorage.setItem(TICKETS_KEY, JSON.stringify(list.slice(0, 20)));
  return entry;
}

export function formatTicketDate(iso) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
