"use client";

import Link from "next/link";
import { fmtCurrency } from "@/lib/services/reports";

const STATUS = {
  confirmado: { label: "Confirmado", className: "dashboard-recent__status--confirmed" },
  pendente: { label: "Pendente", className: "dashboard-recent__status--pending" },
  cancelado: { label: "Cancelado", className: "dashboard-recent__status--cancelled" },
};

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0]?.[0] || "?").toUpperCase();
}

export default function RecentBuyersPanel({ buyers = [] }) {
  return (
    <section className="dashboard-recent">
      <div className="dashboard-recent__head">
        <div>
          <h2>Compradores recentes</h2>
          <p>Últimas movimentações nas suas campanhas</p>
        </div>
        <Link href="/dashboard/participantes" className="btn btn--outline btn--sm">
          Ver todos
        </Link>
      </div>

      {buyers.length === 0 ? (
        <div className="dashboard-recent__empty">
          <p>Nenhuma compra registrada ainda.</p>
          <span>Quando alguém reservar ou confirmar números, aparece aqui.</span>
        </div>
      ) : (
        <ul className="dashboard-recent__list">
          {buyers.map((buyer) => {
            const status = STATUS[buyer.status] || STATUS.pendente;
            return (
              <li key={buyer.id} className="dashboard-recent__item">
                <span className="dashboard-recent__avatar" aria-hidden>
                  {getInitials(buyer.name)}
                </span>
                <div className="dashboard-recent__info">
                  <strong>{buyer.name}</strong>
                  <span>{buyer.raffleTitle}</span>
                </div>
                <div className="dashboard-recent__meta">
                  <span>{buyer.numbers} nº · {fmtCurrency(buyer.amount)}</span>
                  <small>{buyer.date}</small>
                </div>
                <span className={`dashboard-recent__status ${status.className}`}>
                  {status.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
