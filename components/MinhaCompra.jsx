"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BackToDashboard from "./BackToDashboard";
import {
  getPurchasesForBuyer,
  getBuyerProfile,
  normalizePhone,
  formatPurchaseDate,
} from "@/lib/purchases";
import { fmtCurrency } from "@/lib/raffles";

const STATUS = {
  confirmed: { label: "Confirmado", className: "minha-compra__status--confirmed" },
  pending: { label: "Aguardando PIX", className: "minha-compra__status--pending" },
  cancelled: { label: "Cancelado", className: "minha-compra__status--cancelled" },
};

function padNumber(n, totalNumbers) {
  return String(n).padStart(String(totalNumbers).length, "0");
}

function PurchaseItem({ purchase, totalNumbers, primaryColor, onContinuePix }) {
  const [open, setOpen] = useState(purchase.status === "pending");
  const status = STATUS[purchase.status] || STATUS.pending;
  const numbers = [...(purchase.numbers || [])].sort((a, b) => a - b);

  return (
    <article className="minha-compra__item">
      <div className="minha-compra__item-head">
        <div>
          <p className="minha-compra__item-date">{formatPurchaseDate(purchase.createdAt)}</p>
          <p className="minha-compra__item-meta">
            {numbers.length} número(s) · R$ {fmtCurrency(purchase.amount || 0)}
          </p>
        </div>
        <span className={`minha-compra__status ${status.className}`}>{status.label}</span>
      </div>

      {purchase.status === "pending" && (
        <div className="minha-compra__active">
          <p><strong>Números reservados</strong> — conclua o PIX para confirmar</p>
          {onContinuePix && (
            <button type="button" className="btn btn--violet btn--sm" onClick={() => onContinuePix(purchase)}>
              Ver PIX novamente
            </button>
          )}
        </div>
      )}

      <button type="button" className="minha-compra__toggle" onClick={() => setOpen(!open)}>
        {open ? "Ocultar números" : `Ver meus números (${numbers.length})`}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points={open ? "6 15 12 9 18 15" : "6 9 12 15 18 9"} />
        </svg>
      </button>

      {open && (
        <div className="minha-compra__numbers">
          {numbers.map((n) => (
            <span
              key={n}
              className={`minha-compra__number${purchase.status === "pending" ? " is-pending" : ""}`}
              style={purchase.status === "confirmed" ? { backgroundColor: primaryColor } : undefined}
            >
              {padNumber(n, totalNumbers)}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default function MinhaCompra({ raffleId, raffleTitle, totalNumbers, primaryColor, onContinuePix, refreshKey = 0 }) {
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState("all");
  const [lookupPhone, setLookupPhone] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [buyer, setBuyer] = useState(null);

  useEffect(() => {
    const profile = getBuyerProfile();
    setBuyer(profile);
    if (profile?.phone && !lookupPhone) setLookupPhone(profile.phone);

    const digits = normalizePhone(lookupPhone || profile?.phone);
    const list = digits
      ? getPurchasesForBuyer({ raffleId, phoneDigits: digits })
      : [];

    setPurchases(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, [raffleId, lookupPhone, refreshKey]);

  function handleLookup(e) {
    e.preventDefault();
    const digits = normalizePhone(lookupPhone);
    if (!digits) return;
    setPurchases(
      getPurchasesForBuyer({ raffleId, phoneDigits: digits }).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    );
  }

  const filtered = tab === "all" ? purchases : purchases.filter((p) => p.status === tab);
  const activeNumbers = purchases
    .filter((p) => p.status === "pending" || p.status === "confirmed")
    .flatMap((p) => p.numbers || []);
  const confirmedCount = purchases.filter((p) => p.status === "confirmed").length;
  const pendingCount = purchases.filter((p) => p.status === "pending").length;

  return (
    <div className="rifa-publica__card minha-compra">
      <button type="button" className="minha-compra__head" onClick={() => setOpen(!open)}>
        <div>
          <p>Minha compra</p>
          <span>Acompanhe seus números e pagamentos neste sorteio</span>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points={open ? "6 15 12 9 18 15" : "6 9 12 15 18 9"} />
        </svg>
      </button>

      {open && (
        <div className="minha-compra__body">
          <form className="minha-compra__lookup" onSubmit={handleLookup}>
            <input
              value={lookupPhone}
              onChange={(e) => setLookupPhone(e.target.value)}
              placeholder="Buscar pelo WhatsApp"
            />
            <button type="submit" className="btn btn--outline btn--sm">Buscar</button>
          </form>

          {buyer?.name && (
            <p className="minha-compra__greeting">
              Olá, <strong>{buyer.name.split(" ")[0]}</strong>
            </p>
          )}

          {activeNumbers.length > 0 && (
            <div className="minha-compra__summary">
              <div>
                <p className="minha-compra__summary-label">Seus números neste sorteio</p>
                <p className="minha-compra__summary-value" style={{ color: primaryColor }}>
                  {activeNumbers.length} {activeNumbers.length === 1 ? "número" : "números"}
                </p>
              </div>
              <div className="minha-compra__summary-stats">
                {confirmedCount > 0 && <span className="minha-compra__pill minha-compra__pill--confirmed">{confirmedCount} confirmada(s)</span>}
                {pendingCount > 0 && <span className="minha-compra__pill minha-compra__pill--pending">{pendingCount} aguardando PIX</span>}
              </div>
            </div>
          )}

          {purchases.length > 0 && (
            <div className="minha-compra__tabs">
              {[
                { key: "all", label: "Todas" },
                { key: "confirmed", label: "Confirmadas" },
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
            <div className="minha-compra__empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p>Nenhuma compra neste sorteio</p>
              <span>Selecione números acima e finalize o pagamento PIX</span>
            </div>
          ) : (
            <div className="minha-compra__list">
              {filtered.map((purchase) => (
                <PurchaseItem
                  key={purchase.id}
                  purchase={purchase}
                  totalNumbers={totalNumbers}
                  primaryColor={primaryColor}
                  onContinuePix={onContinuePix}
                />
              ))}
            </div>
          )}

          <Link href="/minhas-compras" className="minha-compra__link-all">
            Ver todas as minhas compras
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>

          <BackToDashboard className="minha-compra__link-dashboard" label="Voltar ao painel" showIcon={false} />
        </div>
      )}
    </div>
  );
}
