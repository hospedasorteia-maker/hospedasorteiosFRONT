"use client";

import { useState } from "react";
import { fmtCurrency } from "@/lib/services/raffles";

export default function NumberGrid({ totalNumbers, pricePerNumber, primaryColor, soldNumbers = [], reservedNumbers = [], onPurchase }) {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 100;
  const totalPages = Math.ceil(totalNumbers / pageSize);
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalNumbers);
  const padLen = String(totalNumbers).length;

  const confirmedSet = new Set(soldNumbers);
  const reservedSet = new Set(reservedNumbers);

  function toggle(n) {
    if (confirmedSet.has(n) || reservedSet.has(n)) return;
    setSelected((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  function handleBuy() {
    if (selected.length === 0) return;
    onPurchase?.({ numbers: [...selected], amount: subtotal });
  }

  const subtotal = selected.length * pricePerNumber;
  const selectedLabels = selected
    .slice(0, 10)
    .map((n) => String(n).padStart(padLen, "0"))
    .join(" · ");

  return (
    <>
      <div className={`number-grid${selected.length > 0 ? " number-grid--has-selection" : ""}`}>
        {totalPages > 1 && (
          <div className="number-grid__pagination">
            <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Anterior</button>
            <span className="number-grid__pagination-label">
              {start}–{end} de {totalNumbers}
            </span>
            <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Próximo →</button>
          </div>
        )}

        <div className="number-grid__cells">
          {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((n) => {
            const confirmed = confirmedSet.has(n);
            const reserved = reservedSet.has(n);
            const unavailable = confirmed || reserved;
            const picked = selected.includes(n);
            return (
              <button
                key={n}
                type="button"
                disabled={unavailable}
                className={`number-grid__cell${confirmed ? " is-sold" : ""}${reserved ? " is-reserved" : ""}${picked ? " is-selected" : ""}`}
                style={picked ? { backgroundColor: primaryColor, borderColor: primaryColor } : undefined}
                title={reserved ? "Reservado — aguardando PIX" : confirmed ? "Vendido" : undefined}
                onClick={() => toggle(n)}
              >
                {String(n).padStart(padLen, "0")}
              </button>
            );
          })}
        </div>

        <div className="number-grid__footer">
          <div className="number-grid__summary">
            <span>{selected.length} número(s) selecionado(s)</span>
            {selected.length > 0 && (
              <strong style={{ color: primaryColor }}>{fmtCurrency(subtotal)}</strong>
            )}
          </div>
          <button
            type="button"
            className="btn btn--violet btn--sm number-grid__buy-btn"
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            disabled={selected.length === 0}
            onClick={handleBuy}
          >
            Continuar com PIX
          </button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="checkout-sticky" style={{ borderColor: `${primaryColor}30` }}>
          <div className="checkout-sticky__info">
            <strong>{selected.length} número(s)</strong>
            <span>
              {selectedLabels}
              {selected.length > 10 ? ` +${selected.length - 10}` : ""}
            </span>
            <em>{fmtCurrency(subtotal)}</em>
          </div>
          <button
            type="button"
            className="checkout-sticky__btn"
            style={{ backgroundColor: primaryColor }}
            onClick={handleBuy}
          >
            Continuar com PIX
          </button>
        </div>
      )}
    </>
  );
}
