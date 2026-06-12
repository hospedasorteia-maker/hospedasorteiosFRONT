import { getPurchasesFromStorage } from "@/lib/services/purchases";
import { getRafflesFromStorage } from "@/lib/services/raffles";
import { formatDateBR } from "@/lib/services/format";
import {
  getDemoSeedParticipants,
  isDemoMode,
  stripDemoParticipants,
} from "@/lib/services/demo";
import {
  buildParticipantWhatsAppMessage,
  openWhatsApp,
} from "@/lib/services/whatsapp";

const STORAGE_KEY = "TironiDraws_participants";

export const STATUS_CONFIG = {
  confirmado: { label: "Confirmado", className: "participants__status--confirmed" },
  pendente: { label: "Pendente", className: "participants__status--pending" },
  cancelado: { label: "Cancelado", className: "participants__status--cancelled" },
};

function mapPurchaseStatus(status) {
  if (status === "confirmed") return "confirmado";
  if (status === "cancelled") return "cancelado";
  return "pendente";
}

function mapPaymentMethod(method) {
  if (method === "pix") return "PIX";
  if (method === "credit_card") return "Cartão";
  if (method === "boleto") return "Boleto";
  return "PIX";
}

function purchaseToParticipant(purchase) {
  const count = purchase.numbers?.length || 1;
  return {
    id: `purchase-${purchase.id}`,
    purchaseId: purchase.id,
    name: purchase.buyerName || "Participante",
    phone: purchase.buyerPhone || "",
    email: purchase.buyerEmail || `${purchase.phoneDigits || "cliente"}@TironiDraws.local`,
    numbers: purchase.numbers || [],
    pricePerNumber: count ? (purchase.amount || 0) / count : 0,
    raffle: purchase.raffleTitle || "Sorteio",
    raffleId: purchase.raffleId,
    total: purchase.amount || 0,
    date: formatDateBR(purchase.createdAt),
    status: mapPurchaseStatus(purchase.status),
    paymentMethod: mapPaymentMethod(purchase.paymentMethod),
  };
}

export function syncParticipantsFromPurchases(list) {
  const purchases = getPurchasesFromStorage();
  const byPurchaseId = new Set(list.filter((p) => p.purchaseId).map((p) => p.purchaseId));
  const merged = [...list];

  purchases.forEach((purchase) => {
    if (byPurchaseId.has(purchase.id)) {
      const idx = merged.findIndex((p) => p.purchaseId === purchase.id);
      if (idx >= 0) merged[idx] = purchaseToParticipant(purchase);
      return;
    }
    merged.unshift(purchaseToParticipant(purchase));
  });

  return merged;
}

function getInitialParticipants() {
  if (isDemoMode()) return getDemoSeedParticipants();
  return [];
}

export function getParticipantsFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = syncParticipantsFromPurchases(getInitialParticipants());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw);
    if (!isDemoMode()) {
      return stripDemoParticipants(parsed);
    }
    return parsed;
  } catch {
    return isDemoMode() ? getDemoSeedParticipants() : [];
  }
}

export function saveParticipantsToStorage(participants) {
  const next = isDemoMode() ? participants : stripDemoParticipants(participants);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function loadParticipants() {
  const synced = syncParticipantsFromPurchases(getParticipantsFromStorage());
  saveParticipantsToStorage(synced);
  return synced;
}

export function removeParticipantsByIds(ids) {
  const set = new Set(ids);
  const next = getParticipantsFromStorage().filter((p) => !set.has(p.id));
  saveParticipantsToStorage(next);
  return next;
}

export function removeParticipantsByRaffleId(raffleId) {
  const next = getParticipantsFromStorage().filter((p) => p.raffleId !== String(raffleId));
  saveParticipantsToStorage(next);
  return next;
}

export function getRaffleFilterOptions() {
  const raffles = getRafflesFromStorage();
  return ["Todos os sorteios", ...raffles.map((r) => r.title)];
}

export function getParticipantStats(participants) {
  const confirmados = participants.filter((p) => p.status === "confirmado");
  const receita = confirmados.reduce((acc, p) => acc + (p.total || 0), 0);
  return {
    total: participants.length,
    confirmados: confirmados.length,
    pendentes: participants.filter((p) => p.status === "pendente").length,
    numeros: participants.reduce((acc, p) => acc + (p.numbers?.length || 0), 0),
    receita,
    ticketMedio: confirmados.length ? receita / confirmados.length : 0,
  };
}

export function exportParticipantsCSV(participants) {
  const headers = ["Nome", "Telefone", "E-mail", "Sorteio", "Números", "Qtd", "Valor/Nº", "Total", "Pagamento", "Status", "Data"];
  const rows = participants.map((p) => [
    p.name,
    p.phone,
    p.email,
    p.raffle,
    (p.numbers || []).join(" "),
    p.numbers?.length || 0,
    p.pricePerNumber?.toFixed(2),
    p.total?.toFixed(2),
    p.paymentMethod,
    STATUS_CONFIG[p.status]?.label || p.status,
    p.date,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `participantes-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export { openWhatsApp, buildParticipantWhatsAppMessage as buildWhatsAppMessage };
