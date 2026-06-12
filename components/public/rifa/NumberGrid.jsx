"use client";

import { useEffect, useState } from "react";
import { fmtCurrency } from "@/lib/services/raffles";
export default function NumberGrid({ totalNumbers, pricePerNumber, primaryColor, soldNumbers = [], reservedNumbers = [], onPurchase, selectionReset = 0 }) {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 100;
  const totalPages = Math.ceil(totalNumbers / pageSize);
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalNumbers);

  const confirmedSet = new Set(soldNumbers);
  const reservedSet = new Set(reservedNumbers);

  useEffect(() => {
    setSelected([]);
  }, [selectionReset]);

  function toggle(n) {
    if (confirmedSet.has(n) || reservedSet.has(n)) return;
    setSelected((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  function handleBuy() {
    if (selected.length === 0) return;
    onPurchase?.({ numbers: [...selected], amount: subtotal });
  }

  const subtotal = selected.length * pricePerNumber;

  return (
    <div className="number-grid">
      {totalPages > 1 && (
        <div className="number-grid__pagination">
          <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Anterior</button>
          <span>Números {start}–{end} de {totalNumbers}</span>
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
              {String(n).padStart(String(totalNumbers).length, "0")}
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
          className="btn btn--violet btn--sm"
          disabled={selected.length === 0}
          onClick={handleBuy}
        >
          Continuar com PIX
        </button>
      </div>
    </div>
  );
}
