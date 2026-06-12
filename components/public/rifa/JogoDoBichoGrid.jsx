"use client";

import { useEffect, useState } from "react";
import { fmtCurrency } from "@/lib/services/raffles";
import {
  BICHO_ANIMALS,
  formatBichoNumber,
  getAnimalByNumber,
  getAnimalGroupLabel,
  getNumbersForGroup,
} from "@/lib/services/jogoDoBicho";

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
  playMode = "dezena",
}) {
  const [activeGroup, setActiveGroup] = useState(1);
  const [selected, setSelected] = useState([]);
  const grupoOnly = playMode === "grupo";

  const confirmedSet = toNumberSet(soldNumbers);
  const reservedSet = toNumberSet(reservedNumbers);
  const groupNumbers = getNumbersForGroup(activeGroup);
  const activeAnimal = BICHO_ANIMALS.find((a) => a.id === activeGroup);

  useEffect(() => {
    setSelected([]);
  }, [selectionReset]);

  function toggleDezena(n) {
    if (readOnly) return;
    if (confirmedSet.has(n) || reservedSet.has(n)) return;
    setSelected((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  function toggleGrupo(groupId) {
    if (readOnly) return;
    if (confirmedSet.has(groupId) || reservedSet.has(groupId)) return;
    setSelected((prev) => (prev.includes(groupId) ? prev.filter((x) => x !== groupId) : [...prev, groupId]));
  }

  function handleBuy() {
    if (readOnly || selected.length === 0) return;
    onPurchase?.({
      numbers: [...selected].sort((a, b) => a - b),
      amount: selected.length * pricePerNumber,
    });
  }

  const subtotal = selected.length * pricePerNumber;
  const selectedLabels = grupoOnly
    ? selected.map((id) => getAnimalGroupLabel(BICHO_ANIMALS.find((a) => a.id === id)))
    : selected.map((n) => formatBichoNumber(n));

  return (
    <>
      <div className="number-grid bicho-grid">
        <div className="bicho-grid__head">
          <p>{grupoOnly ? "Escolha o bicho" : "Escolha o bicho"}</p>
          <span>
            {grupoOnly
              ? <>Toque no animal para selecionar e clique em <strong>Continuar</strong></>
              : <>Toque no animal, selecione a dezena e clique em <strong>Continuar</strong></>}
          </span>
        </div>

        <div className="number-grid__cells bicho-grid__animals">
          {BICHO_ANIMALS.map((animal) => {
            const nums = getNumbersForGroup(animal.id);
            const soldInGroup = grupoOnly
              ? confirmedSet.has(animal.id)
              : nums.filter((n) => confirmedSet.has(n)).length;
            const pickedInGroup = grupoOnly
              ? selected.includes(animal.id)
              : nums.filter((n) => selected.includes(n)).length;
            const isActive = !grupoOnly && activeGroup === animal.id;
            const allSold = grupoOnly ? soldInGroup : soldInGroup === 4;
            const reserved = grupoOnly && reservedSet.has(animal.id);
            const label = `${animal.emoji} ${animal.name}`;

            return (
              <button
                key={animal.id}
                type="button"
                disabled={(allSold || reserved) && !readOnly}
                className={`number-grid__cell bicho-grid__animal${isActive || pickedInGroup ? " is-selected" : ""}${pickedInGroup ? " has-picked" : ""}${allSold ? " is-sold" : ""}${reserved ? " is-reserved" : ""}`}
                style={isActive || pickedInGroup ? { backgroundColor: primaryColor, borderColor: primaryColor } : undefined}
                onClick={() => (grupoOnly ? toggleGrupo(animal.id) : setActiveGroup(animal.id))}
                title={allSold ? `${label} — esgotado` : reserved ? `${label} — reservado` : label}
                aria-label={label}
              >
                {animal.emoji}
              </button>
            );
          })}
        </div>

        {!grupoOnly && activeAnimal && (
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
                    onClick={() => toggleDezena(n)}
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
                const animal = grupoOnly
                  ? BICHO_ANIMALS.find((a) => a.id === n)
                  : getAnimalByNumber(n);

                return (
                  <button
                    key={`picked-${n}`}
                    type="button"
                    className="bicho-grid__picked-chip"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                    onClick={() => (grupoOnly ? toggleGrupo(n) : toggleDezena(n))}
                    title="Remover"
                  >
                    {grupoOnly ? getAnimalGroupLabel(animal) : `${formatBichoNumber(n)} ${animal?.emoji}`}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!readOnly && (
          <div className="number-grid__footer bicho-grid__footer">
            <div className="number-grid__summary bicho-grid__summary">
              <span>
                {selected.length} {grupoOnly ? "bicho(s)" : "dezena(s)"} selecionada(s)
              </span>
              <strong style={{ color: primaryColor }}>
                {pricePerNumber > 0 ? fmtCurrency(subtotal) : "Grátis"}
              </strong>
            </div>
            <button
              type="button"
              className="btn btn--violet btn--sm bicho-grid__buy-btn"
              style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
              disabled={selected.length === 0}
              onClick={handleBuy}
            >
              Continuar com PIX
            </button>
          </div>
        )}
      </div>

      {!readOnly && selected.length > 0 && (
        <div className="checkout-sticky" style={{ borderColor: `${primaryColor}30` }}>
          <div className="checkout-sticky__info">
            <strong>{selected.length} {grupoOnly ? "bicho(s)" : "dezena(s)"}</strong>
            <span>{selectedLabels.join(" · ")}</span>
            <em>{pricePerNumber > 0 ? fmtCurrency(subtotal) : "Grátis"}</em>
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
