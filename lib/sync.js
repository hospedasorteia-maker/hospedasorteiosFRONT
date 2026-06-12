import { getPurchasesFromStorage } from "@/lib/purchases";
import { getRafflesFromStorage } from "@/lib/raffles";
import { loadParticipants } from "@/lib/participants";

const RAFFLES_KEY = "TironiDraws_raffles";

function syncRafflesFromPurchases(raffles, purchases) {
  return raffles.map((raffle) => {
    const rafflePurchases = purchases.filter((p) => String(p.raffleId) === String(raffle.id));
    const confirmedNumbers = rafflePurchases
      .filter((p) => p.status === "confirmed")
      .flatMap((p) => p.numbers || []);
    const existingSold = raffle.soldNumbers || [];
    const soldNumbers = [...new Set([...existingSold, ...confirmedNumbers])].sort((a, b) => a - b);

    return {
      ...raffle,
      soldCount: Math.max(raffle.soldCount || 0, soldNumbers.length),
      soldNumbers,
    };
  });
}

export function syncAllData() {
  if (typeof window === "undefined") {
    return { participants: [], raffles: [], purchases: [] };
  }

  const purchases = getPurchasesFromStorage();
  const participants = loadParticipants();
  const raffles = syncRafflesFromPurchases(getRafflesFromStorage(), purchases);

  localStorage.setItem(RAFFLES_KEY, JSON.stringify(raffles));

  return { participants, raffles, purchases };
}
