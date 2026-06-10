"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RaffleCard from "./RaffleCard";
import { getRafflesFromStorage } from "@/lib/raffles";

const SECONDARY_METRICS = [
  {
    label: "Sorteios Ativos", value: "2", sub: "de 2 total", accent: "accent-emerald",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>,
  },
  {
    label: "Total de Compras", value: "7", sub: "todas as transações", accent: "accent-sky",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  },
  {
    label: "Participantes", value: "2", sub: "únicos", accent: "accent-rose",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
  {
    label: "Ticket Médio", value: "R$ 24,36", sub: "por compra", accent: "accent-indigo",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>,
  },
];

const TREND_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
);

const ARROW_ICON = (
  <svg className="quick-link__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
);

export default function DashboardContent() {
  const [search, setSearch] = useState("");
  const [raffles, setRaffles] = useState([]);

  useEffect(() => {
    setRaffles(getRafflesFromStorage());
  }, []);

  const filtered = raffles.filter((r) => {
    const term = search.trim().toLowerCase();
    return (
      r.title.toLowerCase().includes(term) ||
      r.prizeName.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Acompanhe suas vendas e sorteios em tempo real</p>
        </div>
        <Link href="/dashboard/editor/new" className="btn btn--violet">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          <span className="hide-mobile">Novo Sorteio</span>
          <span className="show-mobile">Novo</span>
        </Link>
      </div>

      <div className="metrics-primary">
        <div className="metric-big metric-big--violet metric-big--wide">
          <div className="metric-big__circle metric-big__circle--tr"></div>
          <div className="metric-big__circle metric-big__circle--bl"></div>
          <div className="metric-big__content">
            <div className="metric-big__top">
              <span className="metric-big__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </span>
              <span className="metric-big__trend">{TREND_ICON}+12%</span>
            </div>
            <p className="metric-big__label">Total Arrecadado</p>
            <p className="metric-big__value">R$ 170,50</p>
            <p className="metric-big__sub">7 compras confirmadas · Ticket médio: R$ 24,36</p>
          </div>
        </div>

        <div className="metric-big metric-big--amber">
          <div className="metric-big__circle metric-big__circle--tr"></div>
          <div className="metric-big__circle metric-big__circle--bl"></div>
          <div className="metric-big__content">
            <div className="metric-big__top">
              <span className="metric-big__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
              </span>
              <span className="metric-big__trend">{TREND_ICON}+8%</span>
            </div>
            <p className="metric-big__label">Números Vendidos</p>
            <p className="metric-big__value">42</p>
            <p className="metric-big__sub">2 sorteios ativos · 2 participantes</p>
          </div>
        </div>
      </div>

      <div className="metrics-secondary">
        {SECONDARY_METRICS.map((m) => (
          <div className="metric-small" key={m.label}>
            <div className="metric-small__head">
              <span className={`metric-small__icon ${m.accent}`}>{m.icon}</span>
              <p>{m.label}</p>
            </div>
            <p className="metric-small__value">{m.value}</p>
            <p className="metric-small__sub">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="quick-access">
        <p className="quick-access__title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          Acesso Rápido
        </p>
        <div className="quick-access__grid">
          <a href="#" className="quick-link quick-link--violet">
            <span>{TREND_ICON}Relatórios</span>
            {ARROW_ICON}
          </a>
          <a href="#" className="quick-link">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              Participantes
            </span>
            {ARROW_ICON}
          </a>
          <a href="#" className="quick-link">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>
              Configurações
            </span>
            {ARROW_ICON}
          </a>
        </div>
      </div>

      <div className="raffles">
        <div className="raffles__head">
          <h2>Seus Sorteios</h2>
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
              <RaffleCard key={raffle.id} raffle={raffle} />
            ))}
          </div>
        ) : (
          <div className="raffles__empty">
            <div className="raffles__empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
            </div>
            <h3>Nenhum resultado encontrado</h3>
            <p>Tente buscar por outro termo ou crie um novo sorteio.</p>
          </div>
        )}
      </div>
    </>
  );
}
