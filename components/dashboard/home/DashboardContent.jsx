"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import RaffleCard from "./RaffleCard";
import RecentBuyersPanel from "./RecentBuyersPanel";
import { deleteRaffleFromStorage, getRafflesFromStorage } from "@/lib/services/raffles";
import { deletePurchasesByRaffleId } from "@/lib/services/purchases";
import { loadParticipants, removeParticipantsByRaffleId } from "@/lib/services/participants";
import { computeDashboardOverview, fmtCurrency } from "@/lib/services/reports";

const ARROW_ICON = (
  <svg className="quick-link__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
);

const KPI_CONFIG = [
  {
    key: "totalVendas",
    label: "Vendas totais",
    sub: (o) => `${o.sorteiosAtivos} sorteio(s) ativo(s)`,
    accent: "accent-violet",
    format: (v) => String(v),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
    ),
  },
  {
    key: "numerosVendidos",
    label: "Números vendidos",
    sub: () => "confirmados e pagos",
    accent: "accent-emerald",
    format: (v) => String(v),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
    ),
  },
  {
    key: "pendentes",
    label: "Pendentes",
    sub: (o) => `${o.numerosPendentes} número(s) aguardando PIX`,
    accent: "accent-amber",
    format: (v) => String(v),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    ),
  },
  {
    key: "receita",
    label: "Receita",
    sub: (o) => (o.receitaPendente > 0 ? `${fmtCurrency(o.receitaPendente)} pendente` : "total confirmado"),
    accent: "accent-indigo",
    format: (v) => fmtCurrency(v),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
    ),
  },
];

const EMPTY_OVERVIEW = {
  totalVendas: 0,
  numerosVendidos: 0,
  pendentes: 0,
  numerosPendentes: 0,
  receita: 0,
  receitaPendente: 0,
  sorteiosAtivos: 0,
  totalSorteios: 0,
  recentBuyers: [],
};

export default function DashboardContent() {
  const [search, setSearch] = useState("");
  const [raffles, setRaffles] = useState([]);
  const [overview, setOverview] = useState(EMPTY_OVERVIEW);

  const refreshData = useCallback(() => {
    setRaffles(getRafflesFromStorage());
    setOverview(computeDashboardOverview());
  }, []);

  useEffect(() => {
    refreshData();

    function onStorage(event) {
      if (!event.key || event.key.startsWith("TironiDraws_")) {
        refreshData();
      }
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refreshData);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refreshData);
    };
  }, [refreshData]);

  const filtered = raffles.filter((r) => {
    const term = search.trim().toLowerCase();
    return (
      r.title.toLowerCase().includes(term) ||
      r.prizeName.toLowerCase().includes(term)
    );
  });

  function handleDeleteRaffle(id) {
    const next = deleteRaffleFromStorage(id);
    deletePurchasesByRaffleId(id);
    removeParticipantsByRaffleId(id);
    setRaffles(next);
    setOverview(computeDashboardOverview());
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Painel do cliente</h1>
          <p>Resumo de vendas, receita e compradores das suas campanhas</p>
        </div>
        <Link href="/dashboard/editor/new" className="btn btn--violet">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          <span className="hide-mobile">Novo sorteio</span>
          <span className="show-mobile">Novo</span>
        </Link>
      </div>

      <div className="dashboard-overview">
        {KPI_CONFIG.map(({ key, label, sub, accent, format, icon }) => (
          <article className="dashboard-kpi" key={key}>
            <div className="dashboard-kpi__head">
              <span className={`metric-small__icon ${accent}`}>{icon}</span>
              <p>{label}</p>
            </div>
            <p className="dashboard-kpi__value">{format(overview[key])}</p>
            <p className="dashboard-kpi__sub">{sub(overview)}</p>
          </article>
        ))}
      </div>

      <RecentBuyersPanel buyers={overview.recentBuyers} />

      <div className="quick-access">
        <p className="quick-access__title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          Acesso rápido
        </p>
        <div className="quick-access__grid">
          <Link href="/dashboard/relatorios" className="quick-link quick-link--violet">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
              Relatórios
            </span>
            {ARROW_ICON}
          </Link>
          <Link href="/dashboard/participantes" className="quick-link">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              Participantes
            </span>
            {ARROW_ICON}
          </Link>
          <Link href="/dashboard/configuracoes/pagamento" className="quick-link">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
              Meios de pagamento
            </span>
            {ARROW_ICON}
          </Link>
        </div>
      </div>

      <div className="raffles">
        <div className="raffles__head">
          <h2>Seus sorteios</h2>
          <div className="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Buscar sorteios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="raffles__grid">
            {filtered.map((raffle) => (
              <RaffleCard key={raffle.id} raffle={raffle} onDelete={handleDeleteRaffle} />
            ))}
          </div>
        ) : raffles.length === 0 ? (
          <div className="raffles__empty">
            <div className="raffles__empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
            </div>
            <h3>Nenhum sorteio criado</h3>
            <p>Crie sua primeira campanha e comece a vender números.</p>
            <Link href="/dashboard/editor/new" className="btn btn--violet">Criar sorteio</Link>
          </div>
        ) : (
          <div className="raffles__empty">
            <div className="raffles__empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>
            <h3>Nenhum resultado encontrado</h3>
            <p>Tente buscar por outro termo ou crie um novo sorteio.</p>
          </div>
        )}
      </div>
    </>
  );
}
