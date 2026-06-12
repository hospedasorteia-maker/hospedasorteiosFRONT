"use client";

import { useEffect, useRef, useState } from "react";
import {
  BICHO_ANIMALS,
  formatBichoNumber,
  getAnimalByGroupId,
  getAnimalByNumber,
  getAnimalGroupLabel,
  pickRandomBichoAnimal,
  pickRandomBichoResult,
} from "@/lib/services/jogoDoBicho";

export default function JogoDoBichoRoller({
  onResult,
  primaryColor = "#7C3AED",
  initialNumber,
  playMode = "dezena",
  compact = false,
}) {
  const timerRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [displayAnimal, setDisplayAnimal] = useState(BICHO_ANIMALS[0]);
  const [result, setResult] = useState(null);
  const grupoOnly = playMode === "grupo";

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (initialNumber === undefined || initialNumber === null || initialNumber === "") {
      setResult(null);
      return;
    }

    const num = typeof initialNumber === "string" ? parseInt(initialNumber, 10) : initialNumber;
    const animal = grupoOnly ? getAnimalByGroupId(num) : getAnimalByNumber(num);

    if (animal) {
      setDisplayAnimal(animal);
      setResult(
        grupoOnly
          ? { number: animal.id, animal, label: getAnimalGroupLabel(animal) }
          : { number: num, animal, label: `${formatBichoNumber(num)} · ${animal.emoji} ${animal.name}` },
      );
    }
  }, [initialNumber, grupoOnly]);

  function handleSpin() {
    if (spinning) return;

    const picked = grupoOnly ? pickRandomBichoAnimal() : pickRandomBichoResult();
    if (!picked.animal) return;

    setSpinning(true);
    setResult(null);

    let step = 0;
    const totalSteps = 28 + picked.animal.id;

    function tick() {
      step += 1;
      const idx = step % BICHO_ANIMALS.length;
      setDisplayAnimal(BICHO_ANIMALS[idx]);

      if (step >= totalSteps) {
        setDisplayAnimal(picked.animal);
        setResult(picked);
        setSpinning(false);
        onResult?.({
          number: picked.number,
          animal: picked.animal,
          label: picked.label,
        });
        return;
      }

      const delay = Math.min(40 + step * 12, 220);
      timerRef.current = window.setTimeout(tick, delay);
    }

    tick();
  }

  const display = result
    ? grupoOnly
      ? getAnimalGroupLabel(result.animal)
      : `${formatBichoNumber(result.number)} · ${result.animal.emoji} ${result.animal.name}`
    : null;

  return (
    <div className={`bicho-roller${compact ? " bicho-roller--compact" : ""}`}>
      <div
        className={`bicho-roller__stage${spinning ? " is-spinning" : ""}`}
        style={{ borderColor: `${primaryColor}35`, boxShadow: spinning ? `0 0 0 2px ${primaryColor}25` : undefined }}
      >
        <span className="bicho-roller__emoji" aria-hidden>{displayAnimal.emoji}</span>
        <strong className="bicho-roller__name" style={{ color: primaryColor }}>{displayAnimal.name}</strong>
        <small>Grupo {String(displayAnimal.id).padStart(2, "0")}</small>
      </div>

      {display && (
        <div className="bicho-roller__result" style={{ color: primaryColor }}>
          Resultado: <strong>{display}</strong>
        </div>
      )}

      <button
        type="button"
        className="btn btn--violet btn--sm bicho-roller__btn"
        style={{ backgroundColor: primaryColor }}
        disabled={spinning}
        onClick={handleSpin}
      >
        {spinning ? "Girando..." : grupoOnly ? "Girar bicho" : "Girar jogo do bicho"}
      </button>
    </div>
  );
}
