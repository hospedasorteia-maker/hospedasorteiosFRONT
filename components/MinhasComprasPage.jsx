"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BackToDashboard from "./BackToDashboard";
import {
  getPurchasesFromStorage,
  getBuyerProfile,
  formatPurchaseDate,
} from "@/lib/purchases";
import { fmtCurrency } from "@/lib/raffles";

const STATUS = {
  confirmed: { label: "Confirmado", className: "minhas-compras__status--confirmed" },
  pending: { label: "Aguardando PIX", className: "minhas-compras__status--pending" },
  cancelled: { label: "Cancelado", className: "minhas-compras__status--cancelled" },
};

function PurchaseCard({ purchase }) {
  const [open, setOpen] = useState(false);
  const status = STATUS[purchase.status] || STATUS.pending;
  const numbers = [...(purchase.numbers || [])].sort((a, b) => a - b);
  const padLen = numbers.length > 0 && Math.max(...numbers) >= 100 ? 3 : 2;

  return (
    <article className="minhas-compras__card">
      <div
        className="minhas-compras__card-cover"
        style={
          purchase.raffleImage
            ? { backgroundImage: `url(${purchase.raffleImage})` }
            : { background: "linear-gradient(135deg, #7C3AED, #A855F7)" }
        }
      >
        <div className="minhas-compras__card-cover-overlay">
          <div>
            <p>{purchase.raffleTitle || "Sorteio"}</p>
            {purchase.rafflePrize && <span>{purchase.rafflePrize}</span>}
          </div>
          <span className={`minhas-compras__status ${status.className}`}>{status.label}</span>
        </div>
      </div>

      <div className="minhas-compras__card-body">
        <div className="minhas-compras__card-meta">
          <span>{formatPurchaseDate(purchase.createdAt)}</span>
          <span>{numbers.length} número(s)</span>
          {purchase.amount > 0 && <strong>R$ {fmtCurrency(purchase.amount)}</strong>}
        </div>

        <button type="button" className="minhas-compras__toggle" onClick={() => setOpen(!open)}>
          Meus números ({numbers.length})
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

        <Link href={`/rifa/${purchase.raffleId}`} className="btn btn--outline btn--sm minhas-compras__access">
          Acessar sorteio
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
    setBuyer(getBuyerProfile());
    setPurchases(
      getPurchasesFromStorage().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
    setLoading(false);
  }, []);

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

  const filtered = tab === "all" ? purchases : purchases.filter((p) => p.status === tab);
  const totalPaid = purchases
    .filter((p) => p.status === "confirmed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalNumbers = purchases
    .filter((p) => p.status === "confirmed")
    .reduce((sum, p) => sum + (p.numbers?.length || 0), 0);

  return (
    <div className="minhas-compras">
      <header className="minhas-compras__header">
        <div className="minhas-compras__header-row">
          <BackToDashboard className="rifa-publica__back" />
          <Link href="/dashboard" className="minhas-compras__brand">
          <span className="rifa-publica__brand-icon" style={{ backgroundColor: "#7C3AED" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            </svg>
          </span>
          RifaMaster
        </Link>
        </div>
      </header>

      <div className="minhas-compras__body">
        <div className="minhas-compras__title">
          <h1>Minhas Compras</h1>
          <p>Acompanhe suas participações e números adquiridos</p>
        </div>

        {buyer?.name && (
          <div className="minhas-compras__profile">
            <div className="minhas-compras__avatar">{(buyer.name[0] || "?").toUpperCase()}</div>
            <div>
              <p>{buyer.name}</p>
              <span>{buyer.phone}</span>
            </div>
          </div>
        )}

        <div className="minhas-compras__stats">
          <div>
            <strong>{totalNumbers}</strong>
            <span>Números confirmados</span>
          </div>
          <div>
            <strong>R$ {fmtCurrency(totalPaid)}</strong>
            <span>Total investido</span>
          </div>
          <div>
            <strong>{purchases.length}</strong>
            <span>Participações</span>
          </div>
        </div>

        {purchases.length > 0 && (
          <div className="minhas-compras__tabs">
            {[
              { key: "all", label: "Todos" },
              { key: "confirmed", label: "Confirmados" },
              { key: "pending", label: "Pendentes" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={tab === key ? "is-active" : ""}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="minhas-compras__empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <p>Nenhuma compra encontrada</p>
            <span>Participe de um sorteio para ver suas compras aqui.</span>
            <BackToDashboard className="btn btn--violet btn--sm back-to-dashboard--btn" label="Voltar ao painel" showIcon={false} />
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
