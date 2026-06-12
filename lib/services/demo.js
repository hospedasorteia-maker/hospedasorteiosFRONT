const DEMO_MODE_KEY = "TironiDraws_demo_mode";

export const DEMO_PARTICIPANTS = [
  { id: "demo-1", name: "João Silva", phone: "(11) 99999-1234", email: "joao@email.com", numbers: [7, 23, 45], pricePerNumber: 5.5, raffle: "iPhone 15 Pro Max 256GB", raffleId: "1", total: 16.5, date: "05/06/2026", status: "confirmado", paymentMethod: "PIX", isDemo: true },
  { id: "demo-2", name: "Maria Souza", phone: "(21) 98888-5678", email: "maria@email.com", numbers: [12, 88], pricePerNumber: 2, raffle: "PS5", raffleId: "2", total: 4, date: "06/06/2026", status: "confirmado", paymentMethod: "Cartão", isDemo: true },
  { id: "demo-3", name: "Carlos Lima", phone: "(31) 97777-9012", email: "carlos@email.com", numbers: [3], pricePerNumber: 5.5, raffle: "iPhone 15 Pro Max 256GB", raffleId: "1", total: 5.5, date: "07/06/2026", status: "pendente", paymentMethod: "PIX", isDemo: true },
  { id: "demo-4", name: "Ana Costa", phone: "(41) 96666-3456", email: "ana@email.com", numbers: [55, 66, 77, 88], pricePerNumber: 2, raffle: "PS5", raffleId: "2", total: 8, date: "07/06/2026", status: "confirmado", paymentMethod: "PIX", isDemo: true },
  { id: "demo-5", name: "Pedro Alves", phone: "(51) 95555-7890", email: "pedro@email.com", numbers: [2, 19], pricePerNumber: 5.5, raffle: "iPhone 15 Pro Max 256GB", raffleId: "1", total: 11, date: "08/06/2026", status: "cancelado", paymentMethod: "Boleto", isDemo: true },
  { id: "demo-6", name: "Fernanda Rocha", phone: "(61) 94444-2345", email: "fernanda@email.com", numbers: [100], pricePerNumber: 2, raffle: "PS5", raffleId: "2", total: 2, date: "08/06/2026", status: "pendente", paymentMethod: "PIX", isDemo: true },
  { id: "demo-7", name: "Rafael Nunes", phone: "(71) 93333-6789", email: "rafael@email.com", numbers: [14, 27, 38, 50, 61], pricePerNumber: 5.5, raffle: "iPhone 15 Pro Max 256GB", raffleId: "1", total: 27.5, date: "08/06/2026", status: "confirmado", paymentMethod: "Cartão", isDemo: true },
  { id: "demo-8", name: "Juliana Martins", phone: "(81) 92222-0123", email: "juliana@email.com", numbers: [5, 9], pricePerNumber: 2, raffle: "PS5", raffleId: "2", total: 4, date: "09/06/2026", status: "confirmado", paymentMethod: "PIX", isDemo: true },
];

export function isDemoMode() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(DEMO_MODE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setDemoMode(enabled) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_MODE_KEY, enabled ? "true" : "false");
}

export function getDemoSeedParticipants() {
  return DEMO_PARTICIPANTS.map((p) => ({ ...p }));
}

export function stripDemoParticipants(list = []) {
  return list.filter((p) => !p.isDemo && !String(p.id).startsWith("demo-"));
}
