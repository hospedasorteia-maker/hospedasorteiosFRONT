"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReportsBarChart from "./ReportsBarChart";
import ReportsHorizontalChart from "./ReportsHorizontalChart";
import ReportsRevenueRing from "./ReportsRevenueRing";
import { syncAllData } from "@/lib/sync";
import {
  computeReportsData,
  exportReportsCSV,
  fmtCurrency,
  formatSaleDate,
  parseSaleDate,
  RAFFLE_STATUS,
} from "@/lib/reports";

const STATUS_TABS = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Ativos" },
  { id: "draft", label: "Rascunhos" },
  { id: "completed", label: "Concluídos" },
];

const KPI_CONFIG = [
  {
    key: "totalReceita",
    label: "Total arrecadado",
    sub: "receita confirmada",
    accent: "violet",
    format: fmtCurrency,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    key: "totalNumeros",
    label: "Números vendidos",
    sub: "bilhetes confirmados",
    accent: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="13" y2="14" />
      </svg>
    ),
  },
  {
    key: "totalCompras",
    label: "Compras realizadas",
    sub: "transações no período",
    accent: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    key: "sorteiosAtivos",
    label: "Sorteios ativos",
    subKey: "totalSorteios",
    subPrefix: "de ",
    subSuffix: " cadastrados",
    accent: "sky",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
];

const CARD_ICONS = {
  revenue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  tickets: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
    </svg>
  ),
  table: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
    </svg>
  ),
  sales: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

export default function ReportsContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [toast, setToast] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = useCallback(() => {
    syncAllData();
    return computeReportsData();
  }, []);

  const refresh = useCallback((options = {}) => {
    const { silent = false } = options;
    if (!silent) setRefreshing(true);
    try {
      const next = loadData();
      setData(next);
      setRefreshKey((k) => k + 1);
      setLastUpdated(new Date());
      setLoading(false);
      return next;
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, [loadData]);

  useEffect(() => {
    refresh({ silent: true });
  }, [refresh]);

  useEffect(() => {
    function onStorage(event) {
      if (!event.key?.startsWith("rifamaster_")) return;
      refresh({ silent: true });
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const filteredSorteios = useMemo(() => {
    if (!data) return [];
    if (statusFilter === "all") return data.sorteiosData;
    return data.sorteiosData.filter((s) => s.status === statusFilter);
  }, [data, statusFilter]);

  const filteredChartData = useMemo(() => {
    const ids = new Set(filteredSorteios.map((s) => s.id));
    return (data?.chartData || []).filter((c) => ids.has(c.id));
  }, [data, filteredSorteios]);

  const recentSales = useMemo(() => {
    if (!data) return [];
    return [...data.sales]
      .filter((s) => s.status === "confirmado")
      .sort((a, b) => parseSaleDate(b.date) - parseSaleDate(a.date))
      .slice(0, 5);
  }, [data]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function handleRefresh() {
    const next = refresh();
    if (!next) return;
    showToast(`Dados atualizados · ${next.metrics.totalCompras} compra(s)`);
  }

  function handleExport() {
    if (!data || data.raffles.length === 0) return;
    exportReportsCSV(data.raffles, data.sales, filteredSorteios.length ? filteredSorteios : data.sorteiosData);
    showToast("Relatório CSV exportado");
  }

  if (loading || !data) {
    return (
      <div className="reports reports--loading">
        <div className="reports__loader">
          <div className="reports__loader-ring" />
          <p>Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  const { metrics } = data;
  const confirmedCount = data.sales.filter((s) => s.status === "confirmado").length;
  const ticketMedio = confirmedCount > 0 ? metrics.totalReceita / confirmedCount : 0;
  const avgProgress = filteredSorteios.length
    ? Math.round(
        filteredSorteios.reduce((acc, s) => acc + (s.total > 0 ? (s.vendidos / s.total) * 100 : 0), 0) /
          filteredSorteios.length
      )
    : 0;
  const topRaffle = [...filteredSorteios].sort((a, b) => b.receita - a.receita)[0];

  return (
    <div className="reports">
      {toast && <div className="reports__toast">{toast}</div>}

      <div className="reports__hero">
        <div className="reports__hero-text">
          <span className="reports__eyebrow">Painel analítico</span>
          <h1>Relatórios</h1>
          <p>Visão completa do desempenho das suas campanhas e vendas</p>
          {lastUpdated && (
            <span className="reports__updated">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Atualizado às {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        <div className="reports__head-actions">
          <button
            type="button"
            className={`btn btn--outline btn--sm${refreshing ? " is-loading" : ""}`}
            disabled={refreshing}
            onClick={handleRefresh}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-3-6.7" /><polyline points="21 3 21 9 15 9" /></svg>
            {refreshing ? "Atualizando..." : "Atualizar"}
          </button>
          <button
            type="button"
            className="btn btn--violet btn--sm"
            disabled={data.raffles.length === 0}
            onClick={handleExport}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="reports__kpis">
        {KPI_CONFIG.map((kpi) => {
          const value = metrics[kpi.key];
          const display = kpi.format ? kpi.format(value) : value;
          const sub = kpi.subKey
            ? `${kpi.subPrefix || ""}${metrics[kpi.subKey]}${kpi.subSuffix || ""}`
            : kpi.sub;
          return (
            <div key={kpi.key} className={`reports__kpi reports__kpi--${kpi.accent}`}>
              <div className="reports__kpi-icon">{kpi.icon}</div>
              <div className="reports__kpi-body">
                <p className="reports__kpi-label">{kpi.label}</p>
                <strong>{display}</strong>
                <small>{sub}</small>
              </div>
            </div>
          );
        })}
      </div>

      {data.sorteiosData.length > 0 ? (
        <>
          <div className="reports__summary">
            <div className="reports__summary-item">
              <span>Ticket médio</span>
              <strong>{fmtCurrency(ticketMedio)}</strong>
            </div>
            <div className="reports__summary-divider" />
            <div className="reports__summary-item">
              <span>Progresso médio</span>
              <strong>{avgProgress}%</strong>
            </div>
            <div className="reports__summary-divider" />
            <div className="reports__summary-item">
              <span>Melhor campanha</span>
              <strong className="reports__summary-highlight">{topRaffle?.title || "—"}</strong>
            </div>
            <div className="reports__summary-divider" />
            <div className="reports__summary-item">
              <span>Receita líder</span>
              <strong>{topRaffle ? fmtCurrency(topRaffle.receita) : "—"}</strong>
            </div>
          </div>

          <div className="reports__filters">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`reports__filter${statusFilter === tab.id ? " is-active" : ""}`}
                onClick={() => setStatusFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredSorteios.length > 0 ? (
            <>
              <div className="reports__charts">
                <div className="reports__main">
                  <article className="reports__card reports__card--featured">
                    <div className="reports__card-head">
                      <div className="reports__card-title">
                        <span className="reports__card-icon reports__card-icon--violet">{CARD_ICONS.revenue}</span>
                        <div>
                          <h2>Receita por campanha</h2>
                          <p>Comparativo de arrecadação confirmada</p>
                        </div>
                      </div>
                      <span className="reports__pill">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        {fmtCurrency(filteredSorteios.reduce((s, r) => s + r.receita, 0))}
                      </span>
                    </div>
                    <ReportsHorizontalChart
                      key={`receita-${refreshKey}-${statusFilter}`}
                      data={filteredChartData}
                      valueKey="receita"
                      formatLabel={fmtCurrency}
                    />
                  </article>

                  <article className="reports__card reports__card--sales">
                    <div className="reports__card-head">
                      <div className="reports__card-title">
                        <span className="reports__card-icon reports__card-icon--sky">{CARD_ICONS.sales}</span>
                        <div>
                          <h2>Últimas vendas</h2>
                          <p>Transações confirmadas recentes</p>
                        </div>
                      </div>
                    </div>

                    {recentSales.length > 0 ? (
                      <ul className="reports__sales-list">
                        {recentSales.map((sale) => (
                          <li key={sale.id} className="reports__sale-item">
                            <div className="reports__sale-avatar">{sale.buyerName?.charAt(0) || "?"}</div>
                            <div className="reports__sale-info">
                              <strong>{sale.buyerName || "Participante"}</strong>
                              <span>{sale.raffleTitle}</span>
                            </div>
                            <div className="reports__sale-meta">
                              <strong>{fmtCurrency(sale.amount)}</strong>
                              <span>{formatSaleDate(sale.date)}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="reports__sales-empty">Nenhuma venda confirmada ainda</p>
                    )}
                  </article>
                </div>

                <div className="reports__side">
                  <article className="reports__card">
                    <div className="reports__card-head">
                      <div className="reports__card-title">
                        <span className="reports__card-icon reports__card-icon--violet">{CARD_ICONS.revenue}</span>
                        <div>
                          <h2>Distribuição</h2>
                          <p>Participação na receita total</p>
                        </div>
                      </div>
                    </div>
                    <ReportsRevenueRing
                      key={`ring-${refreshKey}-${statusFilter}`}
                      data={filteredChartData}
                      total={filteredSorteios.reduce((s, r) => s + r.receita, 0)}
                      formatLabel={fmtCurrency}
                    />
                  </article>

                  <article className="reports__card">
                    <div className="reports__card-head">
                      <div className="reports__card-title">
                        <span className="reports__card-icon reports__card-icon--amber">{CARD_ICONS.tickets}</span>
                        <div>
                          <h2>Bilhetes vendidos</h2>
                          <p>Volume por campanha</p>
                        </div>
                      </div>
                      <span className="reports__pill reports__pill--amber">
                        {filteredSorteios.reduce((s, r) => s + r.vendidos, 0)} total
                      </span>
                    </div>
                    <ReportsBarChart
                      key={`vendidos-${refreshKey}-${statusFilter}`}
                      data={filteredChartData}
                      valueKey="vendidos"
                      variant="compact"
                    />
                  </article>
                </div>
              </div>

              <article className="reports__card reports__card--table">
                <div className="reports__card-head">
                  <div className="reports__card-title">
                    <span className="reports__card-icon reports__card-icon--emerald">{CARD_ICONS.table}</span>
                    <div>
                      <h2>Desempenho detalhado</h2>
                      <p>Progresso, receita e status de cada campanha</p>
                    </div>
                  </div>
                  <span className="reports__count">{filteredSorteios.length} campanha(s)</span>
                </div>

                <div className="reports__table-wrap">
                  <table className="reports__table">
                    <thead>
                      <tr>
                        {["#", "Campanha", "Vendidos", "Progresso", "Receita", "Status"].map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSorteios.map((s, index) => {
                        const pct = s.total > 0 ? Math.round((s.vendidos / s.total) * 100) : 0;
                        const st = RAFFLE_STATUS[s.status] || RAFFLE_STATUS.draft;
                        return (
                          <tr key={s.id}>
                            <td>
                              <span className={`reports__rank${index === 0 ? " is-top" : ""}`}>{index + 1}</span>
                            </td>
                            <td>
                              <div className="reports__raffle-cell">
                                <span className="reports__raffle-dot" style={{ backgroundColor: s.color }} />
                                <div>
                                  <strong>{s.title}</strong>
                                  {s.drawDate && <small>Sorteio em {s.drawDate.split("-").reverse().join("/")}</small>}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="reports__mono">{s.vendidos}</span>
                              <span className="reports__muted"> / {s.total}</span>
                            </td>
                            <td>
                              <div className="reports__progress">
                                <div className="reports__progress-bar">
                                  <div
                                    style={{
                                      width: `${pct}%`,
                                      background: `linear-gradient(90deg, ${s.color}, ${s.color}99)`,
                                    }}
                                  />
                                </div>
                                <span className={pct >= 80 ? "is-high" : pct >= 40 ? "is-mid" : ""}>{pct}%</span>
                              </div>
                            </td>
                            <td>
                              <span className="reports__revenue">{fmtCurrency(s.receita)}</span>
                            </td>
                            <td><span className={`reports__badge ${st.className}`}>{st.label}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </article>
            </>
          ) : (
            <div className="reports__filter-empty">
              <p>Nenhuma campanha encontrada com este filtro.</p>
              <button type="button" className="btn btn--outline btn--sm" onClick={() => setStatusFilter("all")}>
                Ver todas
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="reports__empty">
          <div className="reports__empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
          </div>
          <h3>Nenhuma campanha criada ainda</h3>
          <p>Crie um sorteio no dashboard para ver relatórios e gráficos aqui</p>
          <Link href="/dashboard/editor/new" className="btn btn--violet btn--sm">Criar primeira campanha</Link>
        </div>
      )}
    </div>
  );
}
