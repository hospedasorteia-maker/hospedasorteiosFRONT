export const DEFAULT_THEME_COLORS = {
  primary: "#7C3AED",
  secondary: "#A855F7",
  accent: "#EAB308",
  background: "#FFFFFF",
  text: "#1E1B4B",
};

export const DEFAULT_LAYOUT_CONFIG = {
  imagePosition: "top",
  showProgress: true,
  showTimer: true,
  cardStyle: "modern",
};

export const DEFAULT_RAFFLES = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB",
    prizeName: "iPhone 15 Pro Max",
    description:
      "Sorteio de um iPhone 15 Pro Max 256GB lacrado, com nota fiscal. Sorteio transparente ao vivo na data combinada.",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    totalNumbers: 100,
    drawDate: "2025-03-14",
    price: 5.5,
    status: "active",
    soldCount: 10,
    pixKey: "contato@rifamaster.com.br",
    pixMerchantName: "RifaMaster",
    themeColors: { ...DEFAULT_THEME_COLORS },
    layoutConfig: { ...DEFAULT_LAYOUT_CONFIG },
    coupons: [],
  },
  {
    id: "2",
    title: "PS5",
    prizeName: "PS5 + 2 Controles",
    description:
      "PlayStation 5 com dois controles DualSense. Envio para todo o Brasil ou retirada presencial.",
    imageUrl: "https://images.unsplash.com/photo-1606813907293-d86efa9b94de?w=800&q=80",
    totalNumbers: 6000,
    drawDate: "2026-03-20",
    price: 2,
    status: "active",
    soldCount: 32,
    pixKey: "contato@rifamaster.com.br",
    pixMerchantName: "RifaMaster",
    themeColors: { ...DEFAULT_THEME_COLORS },
    layoutConfig: { ...DEFAULT_LAYOUT_CONFIG },
    coupons: [],
  },
];

const STORAGE_KEY = "rifamaster_raffles";

export function formatDrawDate(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

export function parseDrawDate(brDate) {
  if (!brDate) return "";
  const parts = brDate.split("/");
  if (parts.length !== 3) return brDate;
  const [d, m, y] = parts;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export function getRafflesFromStorage() {
  if (typeof window === "undefined") return DEFAULT_RAFFLES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RAFFLES));
      return DEFAULT_RAFFLES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_RAFFLES;
  }
}

export function getRaffleById(id) {
  return getRafflesFromStorage().find((r) => r.id === String(id)) ?? null;
}

export function saveRaffleToStorage(raffle) {
  const list = getRafflesFromStorage();
  const idx = list.findIndex((r) => r.id === raffle.id);
  const next = idx >= 0 ? list.map((r) => (r.id === raffle.id ? raffle : r)) : [...list, raffle];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return raffle;
}

export function deleteRaffleFromStorage(id) {
  const list = getRafflesFromStorage().filter((r) => r.id !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function normalizeRaffle(raffle) {
  if (!raffle) return createEmptyRaffle();
  const base = createEmptyRaffle();
  return {
    ...base,
    ...raffle,
    id: String(raffle.id ?? base.id),
    themeColors: { ...base.themeColors, ...raffle.themeColors },
    layoutConfig: { ...base.layoutConfig, ...raffle.layoutConfig },
    coupons: raffle.coupons || [],
    numberMode: raffle.numberMode || "standard",
    winnerAnimal: raffle.winnerAnimal || "",
  };
}

export function createEmptyRaffle() {
  return {
    id: String(Date.now()),
    title: "",
    prizeName: "",
    description: "",
    imageUrl: "",
    totalNumbers: 100,
    drawDate: "",
    price: 0,
    status: "draft",
    soldCount: 0,
    pixKey: "",
    pixMerchantName: "",
    themeColors: { ...DEFAULT_THEME_COLORS },
    layoutConfig: { ...DEFAULT_LAYOUT_CONFIG },
    coupons: [],
    numberMode: "standard",
    winnerAnimal: "",
    winnerNumber: undefined,
    winnerName: "",
    winnerPhone: "",
    certificateUrl: "",
    certificateType: "",
    notificationsSent: false,
  };
}

export function fmtCurrency(value) {
  return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
