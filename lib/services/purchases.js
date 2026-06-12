import { getPaymentSettings } from "@/lib/services/settings";

const PURCHASES_KEY = "TironiDraws_purchases";
const BUYER_KEY = "TironiDraws_buyer";

export function getReservationMinutes() {
  const minutes = parseInt(getPaymentSettings()?.reservaMinutos, 10);
  return Number.isFinite(minutes) && minutes > 0 ? minutes : 30;
}

export function getReservationSeconds() {
  return getReservationMinutes() * 60;
}

export function getPurchaseExpiresAt(purchase) {
  if (!purchase) return 0;
  if (purchase.expiresAt) return new Date(purchase.expiresAt).getTime();
  const created = new Date(purchase.createdAt || 0).getTime();
  if (Number.isNaN(created)) return 0;
  return created + getReservationMinutes() * 60 * 1000;
}

export function getPurchaseSecondsRemaining(purchase, now = Date.now()) {
  if (!purchase || purchase.status !== "pending") return 0;
  return Math.max(0, Math.floor((getPurchaseExpiresAt(purchase) - now) / 1000));
}

export function isPurchaseExpired(purchase, now = Date.now()) {
  if (!purchase || purchase.status !== "pending") return false;
  return getPurchaseExpiresAt(purchase) <= now;
}

export function expirePendingPurchases({ raffleId } = {}) {
  const now = Date.now();
  const list = getPurchasesFromStorage();
  let expiredCount = 0;

  const next = list.map((purchase) => {
    if (purchase.status !== "pending") return purchase;
    if (raffleId && purchase.raffleId !== String(raffleId)) return purchase;
    if (!isPurchaseExpired(purchase, now)) return purchase;

    expiredCount += 1;
    return {
      ...purchase,
      status: "cancelled",
      cancelledAt: new Date(now).toISOString(),
      cancelReason: "reservation_expired",
    };
  });

  if (expiredCount > 0) {
    savePurchasesToStorage(next);
  }

  return { expiredCount, purchases: expiredCount > 0 ? next : list };
}

export function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

export function getBuyerProfile() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(BUYER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveBuyerProfile(buyer) {
  const profile = {
    name: buyer.name?.trim() || "",
    phone: buyer.phone?.trim() || "",
    cpf: buyer.cpf?.trim() || "",
    phoneDigits: normalizePhone(buyer.phone),
  };
  localStorage.setItem(BUYER_KEY, JSON.stringify(profile));
  return profile;
}

export function getPurchasesFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PURCHASES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePurchasesToStorage(purchases) {
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
}

export function createPurchase(data) {
  const reserveMinutes = getReservationMinutes();
  const createdAt = new Date().toISOString();
  const purchase = {
    ...data,
    id: String(Date.now()),
    createdAt,
    expiresAt: new Date(Date.now() + reserveMinutes * 60 * 1000).toISOString(),
    status: data.status || "pending",
    paymentMethod: "pix",
    phoneDigits: normalizePhone(data.buyerPhone),
  };

  const list = getPurchasesFromStorage();
  savePurchasesToStorage([purchase, ...list]);
  return purchase;
}

export function updatePurchase(id, updates) {
  const list = getPurchasesFromStorage();
  const next = list.map((p) => (p.id === id ? { ...p, ...updates } : p));
  savePurchasesToStorage(next);
  return next.find((p) => p.id === id) ?? null;
}

export function cancelPurchase(id, reason = "user_cancelled") {
  return updatePurchase(id, {
    status: "cancelled",
    cancelledAt: new Date().toISOString(),
    cancelReason: reason,
  });
}

export function getPurchasesByRaffle(raffleId) {
  return getPurchasesFromStorage().filter((p) => p.raffleId === String(raffleId));
}

export function deletePurchasesByRaffleId(raffleId) {
  const next = getPurchasesFromStorage().filter((p) => p.raffleId !== String(raffleId));
  savePurchasesToStorage(next);
  return next;
}

export function getPurchasesForBuyer({ raffleId, phoneDigits } = {}) {
  const buyer = getBuyerProfile();
  const digits = phoneDigits || buyer?.phoneDigits;

  return getPurchasesFromStorage().filter((p) => {
    const matchRaffle = raffleId ? p.raffleId === String(raffleId) : true;
    const matchPhone = digits ? p.phoneDigits === digits : true;
    return matchRaffle && matchPhone;
  });
}

export function getReservedNumbers(raffleId) {
  expirePendingPurchases({ raffleId });
  return getPurchasesByRaffle(raffleId)
    .filter((p) => p.status === "pending")
    .flatMap((p) => p.numbers || []);
}

export function getConfirmedNumbers(raffleId, phoneDigits) {
  return getPurchasesForBuyer({ raffleId, phoneDigits })
    .filter((p) => p.status === "confirmed")
    .flatMap((p) => p.numbers || []);
}

export function formatPurchaseDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
