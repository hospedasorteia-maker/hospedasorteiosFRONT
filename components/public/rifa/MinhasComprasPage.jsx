"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BackToDashboard from "./BackToDashboard";
import {
  getPurchasesFromStorage,
  getBuyerProfile,
  formatPurchaseDate,
  expirePendingPurchases,
} from "@/lib/services/purchases";
import { fmtCurrency } from "@/lib/services/raffles";

const STATUS = {
  confirmed: { label: "Confirmado", className: "minhas-compras__status--confirmed" },
  pending: { label: "Aguardando PIX", className: "minhas-compras__status--pending" },
  cancelled: { label: "Cancelado", className: "minhas-compras__status--cancelled" },
};

function formatPhone(value = "") {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return value;
}

function PurchaseCard({ purchase }) {
  const [open, setOpen] = useState(false);
  const status = STATUS[purchase.status] || STATUS.pending;
  const numbers = [...(purchase.numbers || [])].sort((a, b) => a - b);
  const padLen = numbers.length > 0 && Math.max(...numbers) >= 100 ? 3 : 2;

  return (
    <article className="minhas-compras__card">
      <div className="minhas-compras__card-top">
        <div
          className="minhas-compras__card-thumb"
          style={
            purchase.raffleImage
              ? { backgroundImage: `url(${purchase.raffleImage})` }
              : { background: "linear-gradient(135deg, #7C3AED, #A855F7)" }
          }
          aria-hidden
        />
        <div className="minhas-compras__card-head">
          <div className="minhas-compras__card-title-row">
            <div>
              <h3>{purchase.raffleTitle || "Sorteio"}</h3>
              {purchase.rafflePrize && <p>{purchase.rafflePrize}</p>}
            </div>
            <span className={`minhas-compras__status ${status.className}`}>{status.label}</span>
          </div>
          <div className="minhas-compras__card-meta">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              {formatPurchaseDate(purchase.createdAt)}
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /></svg>
              {numbers.length} número(s)
            </span>
            {purchase.amount > 0 && (
              <strong>{fmtCurrency(purchase.amount)}</strong>
            )}
          </div>
        </div>
      </div>

      <div className="minhas-compras__card-body">
        <button type="button" className="minhas-compras__toggle" onClick={() => setOpen(!open)}>
          <span>Meus números ({numbers.length})</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points={open ? "6 15 12 9 18 15" : "6 9 12 15 18 9"} />
          </svg>
        </button>

        {open && (
          <div className="minhas-compras__numbers">
            {numbers.map((n) => (
              <span key={n}>{String(n).padStart(padLen, "0")}</span>
            ))}
          </div>
        )}

        <Link href={`/rifa/${purchase.raffleId}`} className="btn btn--violet btn--sm minhas-compras__access">
          Acessar sorteio
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </Link>
      </div>
    </article>
  );
}

export default function MinhasComprasPage() {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [buyer, setBuyer] = useState(null);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    expirePendingPurchases();
    setBuyer(getBuyerProfile());
    setPurchases(
      getPurchasesFromStorage().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    );
    setLoading(false);
  }, []);

  const stats = useMemo(() => {
    const confirmed = purchases.filter((p) => p.status === "confirmed");
    const pending = purchases.filter((p) => p.status === "pending");
    return {
      totalNumbers: confirmed.reduce((sum, p) => sum + (p.numbers?.length || 0), 0),
      totalPaid: confirmed.reduce((sum, p) => sum + (p.amount || 0), 0),
      pendingCount: pending.length,
      total: purchases.length,
    };
  }, [purchases]);

  const filtered = tab === "all" ? purchases : purchases.filter((p) => p.status === tab);

  const tabs = [
    { key: "all", label: "Todos", count: purchases.length },
    { key: "confirmed", label: "Confirmados", count: purchases.filter((p) => p.status === "confirmed").length },
    { key: "pending", label: "Pendentes", count: purchases.filter((p) => p.status === "pending").length },
  ];

  if (loading) {
    return (
      <div className="minhas-compras minhas-compras--loading">
        <header className="minhas-compras__header">
          <BackToDashboard className="rifa-publica__back" />
        </header>
        <div className="rifa-publica__spinner" />
      </div>
    );
  }

  return (
    <div className="minhas-compras">
      <header className="minhas-compras__header">
        <div className="minhas-compras__header-row">
          <BackToDashboard className="rifa-publica__back" />
          <Link href="/" className="minhas-compras__brand">
            <span className="minhas-compras__brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              </svg>
            </span>
            TironiDraws
          </Link>
        </div>
      </header>

      <div className="minhas-compras__hero">
        <div className="minhas-compras__body">
          <div className="minhas-compras__title">
            <span className="minhas-compras__eyebrow">Área do participante</span>
            <h1>Minhas Compras</h1>
            <p>Acompanhe suas participações, números e pagamentos em um só lugar.</p>
          </div>
        </div>
      </div>

      <div className="minhas-compras__body">
        {buyer?.name && (
          <div className="minhas-compras__profile">
            <div className="minhas-compras__avatar">{(buyer.name[0] || "?").toUpperCase()}</div>
            <div>
              <p>{buyer.name}</p>
              <span>{formatPhone(buyer.phone)}</span>
            </div>
          </div>
        )}

        <div className="minhas-compras__stats">
          <article className="minhas-compras__stat minhas-compras__stat--violet">
            <span className="minhas-compras__stat-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /></svg>
            </span>
            <strong>{stats.totalNumbers}</strong>
            <span>Números confirmados</span>
          </article>
          <article className="minhas-compras__stat minhas-compras__stat--emerald">
            <span className="minhas-compras__stat-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </span>
            <strong>{fmtCurrency(stats.totalPaid)}</strong>
            <span>Total investido</span>
          </article>
          <article className="minhas-compras__stat minhas-compras__stat--amber">
            <span className="minhas-compras__stat-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </span>
            <strong>{stats.pendingCount}</strong>
            <span>Pendentes de PIX</span>
          </article>
        </div>

        {purchases.length > 0 && (
          <div className="minhas-compras__tabs" role="tablist" aria-label="Filtrar compras">
            {tabs.map(({ key, label, count }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                className={tab === key ? "is-active" : ""}
                onClick={() => setTab(key)}
              >
                {label}
                <em>{count}</em>
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="minhas-compras__empty">
            <div className="minhas-compras__empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p>Nenhuma compra encontrada</p>
            <span>Participe de um sorteio para ver suas compras aqui.</span>
            <Link href="/" className="btn btn--violet btn--sm">Explorar sorteios</Link>
          </div>
        ) : (
          <div className="minhas-compras__list">
            {filtered.map((p) => (
              <PurchaseCard key={p.id} purchase={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
