"use client";

import { useCallback, useEffect, useState } from "react";
import ReportsBarChart from "./ReportsBarChart";
import { syncAllData } from "@/lib/sync";
import {
  computeReportsData,
  exportReportsCSV,
  fmtCurrency,
  RAFFLE_STATUS,
} from "@/lib/reports";

export default function ReportsContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState("");

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
    exportReportsCSV(data.raffles, data.sales, data.sorteiosData);
    showToast("Relatório CSV exportado");
  }

  if (loading || !data) {
    return (
      <div className="reports reports--loading">
        <div className="rifa-publica__spinner" />
      </div>
    );
  }

  const { metrics, chartData, sorteiosData } = data;

  return (
    <div className="reports">
      {toast && <div className="reports__toast">{toast}</div>}

      <div className="reports__head">
        <div>
          <h1>Relatórios</h1>
          <p>Acompanhe o desempenho real dos seus sorteios</p>
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
        <div className="reports__kpi reports__kpi--violet">
          <span className="reports__kpi-icon">R$</span>
          <strong>{fmtCurrency(metrics.totalReceita)}</strong>
          <p>Total arrecadado</p>
          <small>de todos os sorteios</small>
        </div>
        <div className="reports__kpi reports__kpi--amber">
          <span className="reports__kpi-icon">#</span>
          <strong>{metrics.totalNumeros}</strong>
          <p>Números vendidos</p>
          <small>em todos os sorteios</small>
        </div>
        <div className="reports__kpi reports__kpi--emerald">
          <span className="reports__kpi-icon">🛒</span>
          <strong>{metrics.totalCompras}</strong>
          <p>Compras realizadas</p>
          <small>transações totais</small>
        </div>
        <div className="reports__kpi reports__kpi--sky">
          <span className="reports__kpi-icon">🏆</span>
          <strong>{metrics.sorteiosAtivos}</strong>
          <p>Sorteios ativos</p>
          <small>de {metrics.totalSorteios} total</small>
        </div>
      </div>

      {sorteiosData.length > 0 ? (
        <>
          <div className="reports__card">
            <div className="reports__card-head">
              <div>
                <h2>Total arrecadado por sorteio</h2>
                <p>Receita real de cada rifa (R$)</p>
              </div>
              <span className="reports__pill">{fmtCurrency(metrics.totalReceita)}</span>
            </div>
            <ReportsBarChart key={`receita-${refreshKey}`} data={chartData} valueKey="receita" formatLabel={fmtCurrency} />
          </div>

          <div className="reports__card">
            <div className="reports__card-head">
              <div>
                <h2>Números vendidos por sorteio</h2>
                <p>Quantidade de bilhetes</p>
              </div>
            </div>
            <ReportsBarChart key={`vendidos-${refreshKey}`} data={chartData} valueKey="vendidos" />
          </div>

          <div className="reports__card reports__card--table">
            <div className="reports__card-head">
              <div>
                <h2>Desempenho por sorteio</h2>
                <p>Progresso de vendas e receita real</p>
              </div>
            </div>

            <div className="reports__table-wrap">
              <table className="reports__table">
                <thead>
                  <tr>
                    {["Sorteio", "Números vendidos", "Progresso", "Receita", "Status"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorteiosData.map((s) => {
                    const pct = s.total > 0 ? Math.round((s.vendidos / s.total) * 100) : 0;
                    const st = RAFFLE_STATUS[s.status] || RAFFLE_STATUS.draft;
                    return (
                      <tr key={s.id}>
                        <td><strong>{s.title}</strong></td>
                        <td>
                          <span className="reports__mono">{s.vendidos}</span>
                          <span className="reports__muted"> / {s.total}</span>
                        </td>
                        <td>
                          <div className="reports__progress">
                            <div className="reports__progress-bar">
                              <div style={{ width: `${pct}%`, backgroundColor: s.color }} />
                            </div>
                            <span>{pct}%</span>
                          </div>
                        </td>
                        <td style={{ color: s.color, fontWeight: 700 }}>{fmtCurrency(s.receita)}</td>
                        <td><span className={`reports__badge ${st.className}`}>{st.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="reports__empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
          <p>Nenhum sorteio criado ainda</p>
          <span>Crie um sorteio no dashboard para ver relatórios aqui</span>
        </div>
      )}
    </div>
  );
}
