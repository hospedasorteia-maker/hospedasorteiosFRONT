import { getRafflesFromStorage } from "@/lib/services/raffles";
import { getPurchasesFromStorage } from "@/lib/services/purchases";
import { loadParticipants } from "@/lib/services/participants";
import { isDemoMode } from "@/lib/services/demo";
import { fmtCurrency } from "@/lib/services/format";

export { fmtCurrency };

export const CHART_COLORS = ["#7C3AED", "#A855F7", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];

export const RAFFLE_STATUS = {
  active: { label: "Ativo", className: "reports__badge--active" },
  draft: { label: "Rascunho", className: "reports__badge--draft" },
  completed: { label: "Concluído", className: "reports__badge--completed" },
  cancelled: { label: "Cancelado", className: "reports__badge--cancelled" },
};

export function parseSaleDate(date) {
  if (!date) return 0;
  if (typeof date === "string" && date.includes("/")) {
    const [d, m, y] = date.split("/");
    return new Date(`${y}-${m}-${d}`).getTime();
  }
  const parsed = new Date(date).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatSaleDate(date) {
  if (!date) return "—";
  if (typeof date === "string" && date.includes("/")) return date;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapPurchaseToSale(purchase) {
  return {
    id: purchase.id,
    raffleId: String(purchase.raffleId),
    raffleTitle: purchase.raffleTitle || "",
    buyerName: purchase.buyerName || "",
    buyerPhone: purchase.buyerPhone || "",
    buyerCpf: purchase.buyerCpf || "",
    numbers: purchase.numbers || [],
    amount: purchase.amount || 0,
    paymentMethod: purchase.paymentMethod || "pix",
    status: purchase.status === "confirmed" ? "confirmado" : purchase.status === "cancelled" ? "cancelado" : "pendente",
    date: purchase.createdAt,
  };
}

function mapParticipantToSale(participant) {
  return {
    id: participant.id,
    raffleId: String(participant.raffleId || ""),
    raffleTitle: participant.raffle || "",
    buyerName: participant.name || "",
    buyerPhone: participant.phone || "",
    buyerCpf: "",
    numbers: participant.numbers || [],
    amount: participant.total || 0,
    paymentMethod: participant.paymentMethod === "PIX" ? "pix" : participant.paymentMethod === "Cartão" ? "credit_card" : "boleto",
    status: participant.status,
    date: participant.date,
  };
}

export function getSalesRecords() {
  const purchases = getPurchasesFromStorage().map(mapPurchaseToSale);

  if (!isDemoMode()) {
    return purchases;
  }

  const participants = loadParticipants();
  const purchaseIds = new Set(purchases.map((p) => p.id));
  const fromParticipants = participants
    .filter((p) => p.isDemo || !p.purchaseId || !purchaseIds.has(p.purchaseId))
    .map(mapParticipantToSale);

  return [...purchases, ...fromParticipants];
}

export function computeReportsData() {
  const raffles = getRafflesFromStorage();
  const sales = getSalesRecords();

  const salesByRaffle = {};
  sales.forEach((sale) => {
    const key = sale.raffleId || sale.raffleTitle;
    if (!salesByRaffle[key]) salesByRaffle[key] = [];
    salesByRaffle[key].push(sale);
  });

  const sorteiosData = raffles.map((raffle, index) => {
    const key = String(raffle.id);
    const raffleSales = salesByRaffle[key] || sales.filter((s) => s.raffleTitle === raffle.title);
    const confirmed = raffleSales.filter((s) => s.status === "confirmado");
    const vendidosFromSales = confirmed.reduce((sum, s) => sum + (s.numbers?.length || 0), 0);
    const vendidos = Math.max(raffle.soldCount || 0, vendidosFromSales);
    const receita = confirmed.reduce((sum, s) => sum + (s.amount || 0), 0);

    return {
      id: raffle.id,
      title: raffle.title,
      total: raffle.totalNumbers || 0,
      vendidos,
      receita,
      status: raffle.status || "draft",
      drawDate: raffle.drawDate || "",
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
  });

  const confirmedSales = sales.filter((s) => s.status === "confirmado");
  const totalReceita = confirmedSales.reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalNumeros = confirmedSales.reduce((sum, s) => sum + (s.numbers?.length || 0), 0);

  const chartData = sorteiosData.map((s) => ({
    id: s.id,
    name: s.title?.length > 14 ? `${s.title.slice(0, 14)}…` : s.title,
    fullName: s.title,
    vendidos: s.vendidos,
    receita: s.receita,
    color: s.color,
  }));

  return {
    raffles,
    sales,
    sorteiosData,
    chartData,
    metrics: {
      totalReceita,
      totalNumeros,
      totalCompras: sales.length,
      sorteiosAtivos: raffles.filter((r) => r.status === "active").length,
      totalSorteios: raffles.length,
    },
  };
}

export function getRaffleSalesStats(raffleId) {
  const sales = getSalesRecords().filter((s) => s.raffleId === String(raffleId));
  const confirmed = sales.filter((s) => s.status === "confirmado");
  const pending = sales.filter((s) => s.status === "pendente");

  return {
    vendas: confirmed.length,
    numerosVendidos: confirmed.reduce((sum, s) => sum + (s.numbers?.length || 0), 0),
    pendentes: pending.length,
    numerosPendentes: pending.reduce((sum, s) => sum + (s.numbers?.length || 0), 0),
    receita: confirmed.reduce((sum, s) => sum + (s.amount || 0), 0),
    receitaPendente: pending.reduce((sum, s) => sum + (s.amount || 0), 0),
  };
}

export function computeDashboardOverview() {
  const { sales, metrics } = computeReportsData();
  const confirmed = sales.filter((s) => s.status === "confirmado");
  const pending = sales.filter((s) => s.status === "pendente");

  const recentBuyers = [...sales]
    .sort((a, b) => parseSaleDate(b.date) - parseSaleDate(a.date))
    .slice(0, 8)
    .map((sale) => ({
      id: sale.id,
      name: sale.buyerName || "Comprador",
      phone: sale.buyerPhone || "",
      raffleTitle: sale.raffleTitle || "Sorteio",
      numbers: sale.numbers?.length || 0,
      amount: sale.amount || 0,
      status: sale.status,
      date: formatSaleDate(sale.date),
    }));

  return {
    totalVendas: confirmed.length,
    numerosVendidos: metrics.totalNumeros,
    pendentes: pending.length,
    numerosPendentes: pending.reduce((sum, s) => sum + (s.numbers?.length || 0), 0),
    receita: metrics.totalReceita,
    receitaPendente: pending.reduce((sum, s) => sum + (s.amount || 0), 0),
    sorteiosAtivos: metrics.sorteiosAtivos,
    totalSorteios: metrics.totalSorteios,
    recentBuyers,
  };
}

export function exportReportsCSV(raffles, sales, sorteiosData) {
  const purchasesByRaffle = {};
  sales.forEach((s) => {
    const key = s.raffleId || s.raffleTitle;
    if (!purchasesByRaffle[key]) purchasesByRaffle[key] = [];
    purchasesByRaffle[key].push(s);
  });

  const rows = [
    ["Sorteio", "Status", "Total Números", "Vendidos", "% Vendido", "Receita (R$)", "Data do Sorteio"],
    ...sorteiosData.map((r) => {
      const pct = r.total > 0 ? ((r.vendidos / r.total) * 100).toFixed(1) : "0.0";
      const st = RAFFLE_STATUS[r.status]?.label || r.status;
      return [r.title, st, r.total, r.vendidos, `${pct}%`, r.receita.toFixed(2), r.drawDate || ""];
    }),
    [],
    ["TOTAL", "", "", sorteiosData.reduce((s, r) => s + r.vendidos, 0), "", sorteiosData.reduce((s, r) => s + r.receita, 0).toFixed(2), ""],
    [],
    ["=== VENDAS INDIVIDUAIS ==="],
    ["Comprador", "CPF", "Telefone", "Sorteio", "Números", "Qtd", "Total Pago (R$)", "Método", "Status", "Data"],
    ...sales.map((s) => [
      s.buyerName,
      s.buyerCpf || "",
      s.buyerPhone,
      s.raffleTitle,
      (s.numbers || []).join(" | "),
      s.numbers?.length || 0,
      (s.amount || 0).toFixed(2),
      s.paymentMethod,
      s.status,
      s.date ? (typeof s.date === "string" && s.date.includes("/") ? s.date : new Date(s.date).toLocaleDateString("pt-BR")) : "",
    ]),
  ];

  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `TironiDraws_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
