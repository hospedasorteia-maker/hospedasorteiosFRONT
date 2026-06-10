import { getPurchasesFromStorage } from "@/lib/purchases";
import { getRafflesFromStorage } from "@/lib/raffles";

const STORAGE_KEY = "rifamaster_participants";

export const STATUS_CONFIG = {
  confirmado: { label: "Confirmado", className: "participants__status--confirmed" },
  pendente: { label: "Pendente", className: "participants__status--pending" },
  cancelado: { label: "Cancelado", className: "participants__status--cancelled" },
};

export const DEFAULT_MOCK_PARTICIPANTS = [
  { id: "1", name: "João Silva", phone: "(11) 99999-1234", email: "joao@email.com", numbers: [7, 23, 45], pricePerNumber: 15, raffle: "iPhone 15 Pro Max 256GB", raffleId: "1", total: 45, date: "05/06/2026", status: "confirmado", paymentMethod: "PIX" },
  { id: "2", name: "Maria Souza", phone: "(21) 98888-5678", email: "maria@email.com", numbers: [12, 88], pricePerNumber: 15, raffle: "PS5", raffleId: "2", total: 30, date: "06/06/2026", status: "confirmado", paymentMethod: "Cartão" },
  { id: "3", name: "Carlos Lima", phone: "(31) 97777-9012", email: "carlos@email.com", numbers: [3], pricePerNumber: 15, raffle: "iPhone 15 Pro Max 256GB", raffleId: "1", total: 15, date: "07/06/2026", status: "pendente", paymentMethod: "PIX" },
  { id: "4", name: "Ana Costa", phone: "(41) 96666-3456", email: "ana@email.com", numbers: [55, 66, 77, 88], pricePerNumber: 15, raffle: "PS5", raffleId: "2", total: 60, date: "07/06/2026", status: "confirmado", paymentMethod: "PIX" },
  { id: "5", name: "Pedro Alves", phone: "(51) 95555-7890", email: "pedro@email.com", numbers: [2, 19], pricePerNumber: 15, raffle: "iPhone 15 Pro Max 256GB", raffleId: "1", total: 30, date: "08/06/2026", status: "cancelado", paymentMethod: "Boleto" },
  { id: "6", name: "Fernanda Rocha", phone: "(61) 94444-2345", email: "fernanda@email.com", numbers: [100], pricePerNumber: 15, raffle: "PS5", raffleId: "2", total: 15, date: "08/06/2026", status: "pendente", paymentMethod: "PIX" },
  { id: "7", name: "Rafael Nunes", phone: "(71) 93333-6789", email: "rafael@email.com", numbers: [14, 27, 38, 50, 61], pricePerNumber: 15, raffle: "iPhone 15 Pro Max 256GB", raffleId: "1", total: 75, date: "08/06/2026", status: "confirmado", paymentMethod: "Cartão" },
  { id: "8", name: "Juliana Martins", phone: "(81) 92222-0123", email: "juliana@email.com", numbers: [5, 9], pricePerNumber: 15, raffle: "PS5", raffleId: "2", total: 30, date: "09/06/2026", status: "confirmado", paymentMethod: "PIX" },
];

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

function formatDateBR(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR");
}

function purchaseToParticipant(purchase) {
  const count = purchase.numbers?.length || 1;
  return {
    id: `purchase-${purchase.id}`,
    purchaseId: purchase.id,
    name: purchase.buyerName || "Participante",
    phone: purchase.buyerPhone || "",
    email: purchase.buyerEmail || `${purchase.phoneDigits || "cliente"}@rifamaster.local`,
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

export function getParticipantsFromStorage() {
  if (typeof window === "undefined") return DEFAULT_MOCK_PARTICIPANTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = syncParticipantsFromPurchases(DEFAULT_MOCK_PARTICIPANTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MOCK_PARTICIPANTS;
  }
}

export function saveParticipantsToStorage(participants) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
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

export function openWhatsApp(phone, message) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return;
  const normalized = digits.startsWith("55") ? digits : `55${digits}`;
  window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

export function buildWhatsAppMessage(participant) {
  return `Olá ${participant.name.split(" ")[0]}! Aqui é da RifaMaster sobre sua participação no sorteio "${participant.raffle}".`;
}
