"use client";

import { useEffect, useState } from "react";
import { fmtCurrency } from "@/lib/raffles";
import {
  BICHO_ANIMALS,
  formatBichoNumber,
  getAnimalByNumber,
  getNumbersForGroup,
} from "@/lib/jogoDoBicho";

function toNumberSet(values = []) {
  return new Set(values.map((v) => Number(v)).filter((v) => !Number.isNaN(v)));
}

export default function JogoDoBichoGrid({
  pricePerNumber = 0,
  primaryColor = "#7C3AED",
  soldNumbers = [],
  reservedNumbers = [],
  onPurchase,
  selectionReset = 0,
  readOnly = false,
}) {
  const [activeGroup, setActiveGroup] = useState(1);
  const [selected, setSelected] = useState([]);

  const confirmedSet = toNumberSet(soldNumbers);
  const reservedSet = toNumberSet(reservedNumbers);
  const groupNumbers = getNumbersForGroup(activeGroup);
  const activeAnimal = BICHO_ANIMALS.find((a) => a.id === activeGroup);

  useEffect(() => {
    setSelected([]);
  }, [selectionReset]);

  function toggle(n) {
    if (readOnly) return;
    if (confirmedSet.has(n) || reservedSet.has(n)) return;
    setSelected((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  function handleBuy() {
    if (readOnly || selected.length === 0) return;
    onPurchase?.({
      numbers: [...selected].sort((a, b) => a - b),
      amount: selected.length * pricePerNumber,
    });
  }

  const subtotal = selected.length * pricePerNumber;
  const selectedLabels = selected.map((n) => formatBichoNumber(n));

  return (
    <>
      <div className="number-grid bicho-grid">
        <div className="bicho-grid__head">
          <p>Escolha o bicho</p>
          <span>Toque no animal, selecione a dezena e clique em <strong>Continuar</strong></span>
        </div>

        <div className="number-grid__cells bicho-grid__animals">
          {BICHO_ANIMALS.map((animal) => {
            const nums = getNumbersForGroup(animal.id);
            const soldInGroup = nums.filter((n) => confirmedSet.has(n)).length;
            const pickedInGroup = nums.filter((n) => selected.includes(n)).length;
            const isActive = activeGroup === animal.id;
            const allSold = soldInGroup === 4;
            const label = `${animal.emoji} ${animal.name}`;

            return (
              <button
                key={animal.id}
                type="button"
                disabled={allSold && !readOnly}
                className={`number-grid__cell bicho-grid__animal${isActive ? " is-selected" : ""}${pickedInGroup > 0 ? " has-picked" : ""}${allSold ? " is-sold" : ""}`}
                style={isActive ? { backgroundColor: primaryColor, borderColor: primaryColor } : undefined}
                onClick={() => setActiveGroup(animal.id)}
                title={allSold ? `${label} — esgotado` : label}
                aria-label={label}
              >
                {animal.emoji}
              </button>
            );
          })}
        </div>

        {activeAnimal && (
          <>
            <p className="bicho-grid__dezenas-label">
              {activeAnimal.emoji} {activeAnimal.name} · grupo {String(activeAnimal.id).padStart(2, "0")}
            </p>
            <div className="number-grid__cells bicho-grid__dezenas">
              {groupNumbers.map((n) => {
                const confirmed = confirmedSet.has(n);
                const reserved = reservedSet.has(n);
                const unavailable = confirmed || reserved;
                const picked = selected.includes(n);

                return (
                  <button
                    key={`num-${n}`}
                    type="button"
                    disabled={unavailable || readOnly}
                    className={`number-grid__cell${confirmed ? " is-sold" : ""}${reserved ? " is-reserved" : ""}${picked ? " is-selected" : ""}`}
                    style={picked ? { backgroundColor: primaryColor, borderColor: primaryColor, color: "#fff" } : undefined}
                    title={reserved ? "Reservado" : confirmed ? "Vendido" : undefined}
                    onClick={() => toggle(n)}
                  >
                    {formatBichoNumber(n)}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {selected.length > 0 && (
          <div className="bicho-grid__picked">
            <p>Selecionadas:</p>
            <div className="bicho-grid__picked-list">
              {selected.map((n) => {
                const animal = getAnimalByNumber(n);
                return (
                  <button
                    key={`picked-${n}`}
                    type="button"
                    className="bicho-grid__picked-chip"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                    onClick={() => toggle(n)}
                    title="Remover"
                  >
                    {formatBichoNumber(n)} {animal?.emoji}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!readOnly && (
          <div className="number-grid__footer bicho-grid__footer">
            <div className="number-grid__summary bicho-grid__summary">
              <span>{selected.length} dezena(s) selecionada(s)</span>
              <strong style={{ color: primaryColor }}>
                {pricePerNumber > 0 ? `R$ ${fmtCurrency(subtotal)}` : "Grátis"}
              </strong>
            </div>
            <button
              type="button"
              className="btn btn--violet btn--sm bicho-grid__buy-btn"
              style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
              disabled={selected.length === 0}
              onClick={handleBuy}
            >
              Continuar compra
            </button>
          </div>
        )}
      </div>

      {!readOnly && selected.length > 0 && (
        <div className="checkout-sticky" style={{ borderColor: `${primaryColor}30` }}>
          <div className="checkout-sticky__info">
            <strong>{selected.length} dezena(s)</strong>
            <span>{selectedLabels.join(" · ")}</span>
            <em>{pricePerNumber > 0 ? `R$ ${fmtCurrency(subtotal)}` : "Grátis"}</em>
          </div>
          <button
            type="button"
            className="checkout-sticky__btn"
            style={{ backgroundColor: primaryColor }}
            onClick={handleBuy}
          >
            Continuar
          </button>
        </div>
      )}
    </>
  );
}
