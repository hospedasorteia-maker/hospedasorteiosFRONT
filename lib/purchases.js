const PURCHASES_KEY = "rifamaster_purchases";
const BUYER_KEY = "rifamaster_buyer";

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
  const purchase = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    status: "pending",
    paymentMethod: "pix",
    ...data,
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

export function getPurchasesByRaffle(raffleId) {
  return getPurchasesFromStorage().filter((p) => p.raffleId === String(raffleId));
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
