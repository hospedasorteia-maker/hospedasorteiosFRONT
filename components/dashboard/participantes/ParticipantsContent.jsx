"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ParticipantDetailModal from "./ParticipantDetailModal";
import { syncAllData } from "@/lib/sync";
import {
  removeParticipantsByIds,
  getRaffleFilterOptions,
  getParticipantStats,
  exportParticipantsCSV,
  openWhatsApp,
  buildWhatsAppMessage,
  STATUS_CONFIG,
} from "@/lib/participants";

const PAYMENT_METHODS = ["Todos", "PIX", "Cartão", "Boleto"];
const STATUS_FILTERS = [
  { value: "todos", label: "Todos os status" },
  { value: "confirmado", label: "Confirmado" },
  { value: "pendente", label: "Pendente" },
  { value: "cancelado", label: "Cancelado" },
];

function FilterMenu({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`participants-filter${open ? " is-open" : ""}`}>
      <button type="button" className="btn btn--outline btn--sm" onClick={() => setOpen(!open)}>
        {label}: {value}
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
            <button type="button" onClick={() => { onNotify(participant); setOpen(false); }}>Enviar mensagem</button>
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
      if (!event.key?.startsWith("rifamaster_")) return;
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

  function toggleSelect(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleAll() {
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((p) => p.id));
  }

  function handleRemove(ids) {
    if (!ids.length) return;
    if (!window.confirm(`Remover ${ids.length} participante(s)?`)) return;
    const next = removeParticipantsByIds(ids);
    setParticipants(next);
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
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

  const raffleFilterOptions = raffleOptions.map((r) => ({ value: r, label: r.length > 20 ? `${r.slice(0, 20)}…` : r }));

  return (
    <div className="participants">
      {toast && <div className="participants__toast">{toast}</div>}

      <div className="participants__head">
        <div>
          <h1>Participantes</h1>
          <p>Gerencie todos os compradores dos seus sorteios</p>
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
          <button type="button" className="btn btn--outline btn--sm" onClick={() => { exportParticipantsCSV(filtered); showToast("CSV exportado"); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Exportar
          </button>
        </div>
      </div>

      <div className="participants__stats">
        <div><span>Total</span><strong>{stats.total}</strong></div>
        <div><span>Confirmados</span><strong>{stats.confirmados}</strong></div>
        <div><span>Pendentes</span><strong>{stats.pendentes}</strong></div>
        <div><span>Nºs vendidos</span><strong>{stats.numeros}</strong></div>
        <div><span>Receita</span><strong className="is-green">R$ {stats.receita.toFixed(2)}</strong></div>
        <div><span>Ticket médio</span><strong className="is-purple">R$ {stats.ticketMedio.toFixed(2)}</strong></div>
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
          <FilterMenu
            label="Status"
            value={STATUS_FILTERS.find((s) => s.value === filterStatus)?.label || "Status"}
            options={STATUS_FILTERS}
            onChange={setFilterStatus}
          />
          <FilterMenu label="Sorteio" value={filterRaffle.length > 16 ? `${filterRaffle.slice(0, 16)}…` : filterRaffle} options={raffleFilterOptions} onChange={setFilterRaffle} />
          <FilterMenu label="Pagamento" value={filterPayment} options={PAYMENT_METHODS} onChange={setFilterPayment} />
          {hasFilters && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={clearFilters}>
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="participants__bulk">
          <span>{selectedIds.length} selecionado(s)</span>
          <div>
            <button type="button" className="btn btn--outline btn--sm" onClick={handleBulkNotify}>Notificar</button>
            <button type="button" className="btn btn--outline btn--sm participants__bulk-remove" onClick={() => handleRemove(selectedIds)}>Remover</button>
          </div>
        </div>
      )}

      <div className="participants__table-wrap">
        <table className="participants__table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={filtered.length > 0 && selectedIds.length === filtered.length} onChange={toggleAll} />
              </th>
              <th><button type="button" onClick={() => toggleSort("name")}>Participante</button></th>
              <th><button type="button" onClick={() => toggleSort("raffle")}>Sorteio</button></th>
              <th><button type="button" onClick={() => toggleSort("numbers")}>Números</button></th>
              <th>Pagamento</th>
              <th><button type="button" onClick={() => toggleSort("pricePerNumber")}>Valor/Nº</button></th>
              <th><button type="button" onClick={() => toggleSort("total")}>Total</button></th>
              <th><button type="button" onClick={() => toggleSort("date")}>Data</button></th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="participants__empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                  <p>Nenhum participante encontrado</p>
                  <span>Tente ajustar os filtros de busca</span>
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const status = STATUS_CONFIG[p.status] || STATUS_CONFIG.pendente;
                const isSelected = selectedIds.includes(p.id);
                return (
                  <tr key={p.id} className={isSelected ? "is-selected" : ""}>
                    <td><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(p.id)} /></td>
                    <td>
                      <div className="participants__person">
                        <span className="participants__avatar">{p.name.charAt(0)}</span>
                        <div>
                          <strong>{p.name}</strong>
                          <span>{p.phone}</span>
                          <span>{p.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{p.raffle}</td>
                    <td>
                      <div className="participants__numbers">
                        {p.numbers.slice(0, 3).map((n) => (
                          <span key={n}>{String(n).padStart(3, "0")}</span>
                        ))}
                        {p.numbers.length > 3 && <span className="is-more">+{p.numbers.length - 3}</span>}
                      </div>
                      <small>{p.numbers.length} número(s)</small>
                    </td>
                    <td><span className={`participants__pay participants__pay--${p.paymentMethod === "PIX" ? "pix" : p.paymentMethod === "Cartão" ? "card" : "boleto"}`}>{p.paymentMethod}</span></td>
                    <td>R$ {p.pricePerNumber.toFixed(2)}</td>
                    <td><strong>R$ {p.total.toFixed(2)}</strong></td>
                    <td>{p.date}</td>
                    <td><span className={`participants__status ${status.className}`}>{status.label}</span></td>
                    <td>
                      <RowMenu
                        participant={p}
                        onView={setSelectedParticipant}
                        onNotify={handleNotifyOne}
                        onRemove={(row) => handleRemove([row.id])}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="participants__footer">
            <span>Mostrando <strong>{filtered.length}</strong> de <strong>{participants.length}</strong> participantes</span>
            <span>Total filtrado: <strong>R$ {filtered.reduce((acc, p) => acc + p.total, 0).toFixed(2)}</strong></span>
          </div>
        )}
      </div>

      {selectedParticipant && (
        <ParticipantDetailModal participant={selectedParticipant} onClose={() => setSelectedParticipant(null)} />
      )}
    </div>
  );
}
