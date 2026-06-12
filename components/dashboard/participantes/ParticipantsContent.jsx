"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ParticipantDetailModal from "./ParticipantDetailModal";
import RemoveParticipantsModal from "./RemoveParticipantsModal";
import { syncAllData } from "@/lib/services/sync";
import { fmtCurrency } from "@/lib/services/raffles";
import {
  removeParticipantsByIds,
  getRaffleFilterOptions,
  getParticipantStats,
  exportParticipantsCSV,
  openWhatsApp,
  buildWhatsAppMessage,
  STATUS_CONFIG,
} from "@/lib/services/participants";

const PAYMENT_METHODS = ["Todos", "PIX", "Cartão", "Boleto"];
const STATUS_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "confirmado", label: "Confirmados" },
  { value: "pendente", label: "Pendentes" },
  { value: "cancelado", label: "Cancelados" },
];

const KPI_CONFIG = [
  {
    key: "total",
    label: "Participantes",
    sub: "total cadastrados",
    accent: "violet",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: "confirmados",
    label: "Confirmados",
    sub: "pagamentos aprovados",
    accent: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    key: "pendentes",
    label: "Pendentes",
    sub: "aguardando PIX",
    accent: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    key: "numeros",
    label: "Números vendidos",
    sub: "bilhetes confirmados",
    accent: "sky",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="13" y2="14" />
      </svg>
    ),
  },
  {
    key: "receita",
    label: "Receita total",
    sub: "valor arrecadado",
    accent: "emerald",
    money: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    key: "ticketMedio",
    label: "Ticket médio",
    sub: "por participante",
    accent: "violet",
    money: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
];

const AVATAR_PALETTE = [
  { bg: "#ede9fe", color: "#6d28d9" },
  { bg: "#ecfdf5", color: "#059669" },
  { bg: "#eff6ff", color: "#2563eb" },
  { bg: "#fff7ed", color: "#c2410c" },
  { bg: "#fce7f3", color: "#be185d" },
  { bg: "#f0fdf4", color: "#15803d" },
];

function getAvatarStyle(name = "") {
  const code = name.charCodeAt(0) || 65;
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0]?.[0] || "?").toUpperCase();
}

function formatMoney(value) {
  return fmtCurrency(value || 0);
}

function SortIcon({ active, dir }) {
  if (!active) {
    return (
      <svg className="participants__sort-icon is-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" />
      </svg>
    );
  }
  return (
    <svg className="participants__sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {dir === "asc" ? <path d="m18 15-6-6-6 6" /> : <path d="m6 9 6 6 6-6" />}
    </svg>
  );
}

function FilterMenu({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`participants-filter${open ? " is-open" : ""}`}>
      <button type="button" className="participants-filter__btn" onClick={() => setOpen(!open)}>
        <span>{label}</span>
        <strong>{value}</strong>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <>
          <div className="participants-filter__backdrop" onClick={() => setOpen(false)} />
          <div className="participants-filter__menu">
            {options.map((opt) => (
              <button
                key={opt.value ?? opt}
                type="button"
                className={value === (opt.value ?? opt) ? "is-active" : ""}
                onClick={() => {
                  onChange(opt.value ?? opt);
                  setOpen(false);
                }}
              >
                {opt.label ?? opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RowMenu({ participant, onView, onRemove, onNotify }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`participants-row-menu${open ? " is-open" : ""}`}>
      <button type="button" className="participants-row-menu__trigger" onClick={() => setOpen(!open)} aria-label="Ações">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
      </button>
      {open && (
        <>
          <div className="participants-row-menu__backdrop" onClick={() => setOpen(false)} />
          <div className="participants-row-menu__menu">
            <button type="button" onClick={() => { onView(participant); setOpen(false); }}>Ver detalhes</button>
            <button type="button" onClick={() => { onNotify(participant); setOpen(false); }}>WhatsApp</button>
            <button type="button" className="is-danger" onClick={() => { onRemove(participant); setOpen(false); }}>Remover</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ParticipantsContent() {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterRaffle, setFilterRaffle] = useState("Todos os sorteios");
  const [filterPayment, setFilterPayment] = useState("Todos");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [toast, setToast] = useState("");
  const [raffleOptions, setRaffleOptions] = useState(["Todos os sorteios"]);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingRemoveIds, setPendingRemoveIds] = useState([]);

  const refresh = useCallback((options = {}) => {
    const { silent = false } = options;
    if (!silent) setRefreshing(true);
    try {
      const { participants: synced } = syncAllData();
      setParticipants([...synced]);
      setRaffleOptions(getRaffleFilterOptions());
      setSelectedIds([]);
      return synced.length;
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh({ silent: true });
  }, [refresh]);

  useEffect(() => {
    function onStorage(event) {
      if (!event.key?.startsWith("TironiDraws_")) return;
      refresh({ silent: true });
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  function handleRefresh() {
    const count = refresh();
    showToast(`Lista atualizada · ${count} participante(s)`);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function toggleSort(field) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    return participants
      .filter((p) => {
        const term = search.toLowerCase();
        const matchSearch =
          p.name.toLowerCase().includes(term) ||
          p.phone.includes(search) ||
          p.email.toLowerCase().includes(term);
        const matchStatus = filterStatus === "todos" || p.status === filterStatus;
        const matchRaffle = filterRaffle === "Todos os sorteios" || p.raffle === filterRaffle;
        const matchPayment = filterPayment === "Todos" || p.paymentMethod === filterPayment;
        return matchSearch && matchStatus && matchRaffle && matchPayment;
      })
      .sort((a, b) => {
        if (sortField === "total") return sortDir === "asc" ? a.total - b.total : b.total - a.total;
        if (sortField === "numbers") {
          const diff = a.numbers.length - b.numbers.length;
          return sortDir === "asc" ? diff : -diff;
        }
        if (sortField === "pricePerNumber") {
          const diff = a.pricePerNumber - b.pricePerNumber;
          return sortDir === "asc" ? diff : -diff;
        }
        const valA = String(a[sortField] ?? "");
        const valB = String(b[sortField] ?? "");
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  }, [participants, search, filterStatus, filterRaffle, filterPayment, sortField, sortDir]);

  const stats = getParticipantStats(participants);
  const filteredTotal = filtered.reduce((acc, p) => acc + p.total, 0);

  function toggleSelect(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleAll() {
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((p) => p.id));
  }

  const pendingRemoveParticipants = useMemo(
    () => participants.filter((p) => pendingRemoveIds.includes(p.id)),
    [participants, pendingRemoveIds],
  );

  function requestRemove(ids) {
    if (!ids.length) return;
    setPendingRemoveIds(ids);
  }

  function confirmRemove() {
    const ids = pendingRemoveIds;
    if (!ids.length) return;
    const next = removeParticipantsByIds(ids);
    setParticipants(next);
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    setPendingRemoveIds([]);
    showToast(`${ids.length} participante(s) removido(s)`);
  }

  function handleNotifyOne(p) {
    openWhatsApp(p.phone, buildWhatsAppMessage(p));
    showToast("Abrindo WhatsApp...");
  }

  function handleBulkNotify() {
    if (!selectedIds.length) return;
    const first = participants.find((p) => p.id === selectedIds[0]);
    if (first) handleNotifyOne(first);
    if (selectedIds.length > 1) showToast(`WhatsApp aberto para o primeiro de ${selectedIds.length} selecionados`);
  }

  function clearFilters() {
    setFilterStatus("todos");
    setFilterRaffle("Todos os sorteios");
    setFilterPayment("Todos");
    setSearch("");
  }

  const hasFilters = filterStatus !== "todos" || filterRaffle !== "Todos os sorteios" || filterPayment !== "Todos" || search;
  const raffleFilterOptions = raffleOptions.map((r) => ({ value: r, label: r.length > 24 ? `${r.slice(0, 24)}…` : r }));

  return (
    <div className="participants">
      {toast && <div className="participants__toast">{toast}</div>}

      <div className="participants__head">
        <div>
          <p className="participants__eyebrow">Gestão de compradores</p>
          <h1>Participantes</h1>
          <p>Acompanhe vendas, status de pagamento e contatos em um só lugar.</p>
        </div>
        <div className="participants__head-actions">
          <button
            type="button"
            className={`btn btn--outline btn--sm${refreshing ? " is-loading" : ""}`}
            disabled={refreshing}
            onClick={handleRefresh}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-3-6.7" /><polyline points="21 3 21 9 15 9" /></svg>
            {refreshing ? "Atualizando..." : "Atualizar"}
          </button>
          <button type="button" className="btn btn--violet btn--sm" onClick={() => { exportParticipantsCSV(filtered); showToast("CSV exportado"); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="participants__kpis">
        {KPI_CONFIG.map(({ key, label, sub, accent, money, icon }) => (
          <article key={key} className={`participants__kpi participants__kpi--${accent}`}>
            <div className="participants__kpi-icon">{icon}</div>
            <div className="participants__kpi-body">
              <p className="participants__kpi-label">{label}</p>
              <strong>{money ? formatMoney(stats[key]) : stats[key]}</strong>
              <small>{sub}</small>
            </div>
          </article>
        ))}
      </div>

      <div className="participants__toolbar">
        <div className="participants__tabs">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`participants__tab${filterStatus === value ? " is-active" : ""}`}
              onClick={() => setFilterStatus(value)}
            >
              {label}
              {value !== "todos" && (
                <span className="participants__tab-count">
                  {value === "confirmado"
                    ? stats.confirmados
                    : value === "pendente"
                      ? stats.pendentes
                      : participants.filter((p) => p.status === "cancelado").length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="participants__filters">
          <div className="participants__search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, telefone ou e-mail..."
            />
          </div>
          <div className="participants__filter-row">
            <FilterMenu label="Sorteio" value={filterRaffle.length > 18 ? `${filterRaffle.slice(0, 18)}…` : filterRaffle} options={raffleFilterOptions} onChange={setFilterRaffle} />
            <FilterMenu label="Pagamento" value={filterPayment} options={PAYMENT_METHODS} onChange={setFilterPayment} />
            {hasFilters && (
              <button type="button" className="participants__clear-filters" onClick={clearFilters}>
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="participants__bulk">
          <div className="participants__bulk-info">
            <span className="participants__bulk-count">{selectedIds.length}</span>
            <span>participante(s) selecionado(s)</span>
          </div>
          <div className="participants__bulk-actions">
            <button type="button" className="btn btn--outline btn--sm" onClick={handleBulkNotify}>Notificar</button>
            <button type="button" className="btn btn--outline btn--sm participants__bulk-remove" onClick={() => requestRemove(selectedIds)}>Remover</button>
          </div>
        </div>
      )}

      <div className="participants__table-wrap">
        <div className="participants__table-head">
          <h2>Lista de participantes</h2>
          <span>{filtered.length} resultado(s)</span>
        </div>

        <div className="participants__table-scroll">
          <table className="participants__table">
            <thead>
              <tr>
                <th className="participants__col-check">
                  <input type="checkbox" checked={filtered.length > 0 && selectedIds.length === filtered.length} onChange={toggleAll} aria-label="Selecionar todos" />
                </th>
                <th>
                  <button type="button" className="participants__th-btn" onClick={() => toggleSort("name")}>
                    Participante <SortIcon active={sortField === "name"} dir={sortDir} />
                  </button>
                </th>
                <th className="participants__col-raffle">
                  <button type="button" className="participants__th-btn" onClick={() => toggleSort("raffle")}>
                    Sorteio <SortIcon active={sortField === "raffle"} dir={sortDir} />
                  </button>
                </th>
                <th>
                  <button type="button" className="participants__th-btn" onClick={() => toggleSort("numbers")}>
                    Números <SortIcon active={sortField === "numbers"} dir={sortDir} />
                  </button>
                </th>
                <th>Pagamento</th>
                <th>
                  <button type="button" className="participants__th-btn" onClick={() => toggleSort("total")}>
                    Total <SortIcon active={sortField === "total"} dir={sortDir} />
                  </button>
                </th>
                <th className="participants__col-date">
                  <button type="button" className="participants__th-btn" onClick={() => toggleSort("date")}>
                    Data <SortIcon active={sortField === "date"} dir={sortDir} />
                  </button>
                </th>
                <th>Status</th>
                <th className="participants__col-actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="participants__empty">
                    <div className="participants__empty-card">
                      <div className="participants__empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                      </div>
                      <h3>Nenhum participante encontrado</h3>
                      <p>Ajuste os filtros ou aguarde as primeiras compras do sorteio.</p>
                      {hasFilters && (
                        <button type="button" className="btn btn--outline btn--sm" onClick={clearFilters}>
                          Limpar filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const status = STATUS_CONFIG[p.status] || STATUS_CONFIG.pendente;
                  const isSelected = selectedIds.includes(p.id);
                  const avatar = getAvatarStyle(p.name);

                  return (
                    <tr
                      key={p.id}
                      className={isSelected ? "is-selected" : ""}
                      onClick={() => setSelectedParticipant(p)}
                    >
                      <td className="participants__col-check" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(p.id)} aria-label={`Selecionar ${p.name}`} />
                      </td>
                      <td>
                        <div className="participants__person">
                          <span className="participants__avatar" style={{ backgroundColor: avatar.bg, color: avatar.color }}>
                            {getInitials(p.name)}
                          </span>
                          <div>
                            <strong>{p.name}</strong>
                            <span className="participants__contact-line">{p.phone}</span>
                            <span className="participants__contact-line participants__contact-line--email">{p.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="participants__col-raffle">
                        <span className="participants__raffle" title={p.raffle}>{p.raffle}</span>
                      </td>
                      <td>
                        <div className="participants__numbers">
                          {p.numbers.slice(0, 4).map((n) => (
                            <span key={n}>{String(n).padStart(3, "0")}</span>
                          ))}
                          {p.numbers.length > 4 && <span className="is-more">+{p.numbers.length - 4}</span>}
                        </div>
                        <small>{p.numbers.length} número(s)</small>
                      </td>
                      <td>
                        <span className={`participants__pay participants__pay--${p.paymentMethod === "PIX" ? "pix" : p.paymentMethod === "Cartão" ? "card" : "boleto"}`}>
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td>
                        <strong className="participants__total">{formatMoney(p.total)}</strong>
                        <small>{formatMoney(p.pricePerNumber)}/nº</small>
                      </td>
                      <td className="participants__col-date">{p.date}</td>
                      <td>
                        <span className={`participants__status ${status.className}`}>
                          <span className="participants__status-dot" aria-hidden />
                          {status.label}
                        </span>
                      </td>
                      <td className="participants__col-actions" onClick={(e) => e.stopPropagation()}>
                        <RowMenu
                          participant={p}
                          onView={setSelectedParticipant}
                          onNotify={handleNotifyOne}
                          onRemove={(row) => requestRemove([row.id])}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="participants__footer">
            <span>Mostrando <strong>{filtered.length}</strong> de <strong>{participants.length}</strong> participantes</span>
            <span>Total filtrado: <strong>{formatMoney(filteredTotal)}</strong></span>
          </div>
        )}
      </div>

      {selectedParticipant && (
        <ParticipantDetailModal participant={selectedParticipant} onClose={() => setSelectedParticipant(null)} />
      )}

      {pendingRemoveIds.length > 0 && (
        <RemoveParticipantsModal
          participants={pendingRemoveParticipants}
          onClose={() => setPendingRemoveIds([])}
          onConfirm={confirmRemove}
        />
      )}
    </div>
  );
}
