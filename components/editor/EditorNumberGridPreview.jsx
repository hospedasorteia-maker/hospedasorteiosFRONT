"use client";

export default function EditorNumberGridPreview({ totalNumbers, colors, pricePerNumber }) {
  const total = Math.min(totalNumbers || 100, 100);
  const padLen = total >= 100 ? 3 : 2;
  const sold = new Set([3, 7, 12, 15, 21, 28, 33, 40, 45, 52]);
  const selected = new Set([5, 9, 14]);

  return (
    <div className="editor-grid-preview">
      <div className="editor-grid-preview__legend">
        <span><i className="cell-demo cell-demo--free" /> Disponível</span>
        <span><i className="cell-demo cell-demo--picked" style={{ backgroundColor: colors.primary }} /> Reservado</span>
        <span><i className="cell-demo cell-demo--sold" /> Indisponível</span>
      </div>
      <div className="editor-grid-preview__cells">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
          const isSold = sold.has(n);
          const isSelected = selected.has(n);
          return (
            <span
              key={n}
              className={`editor-grid-preview__cell${isSold ? " is-sold" : ""}${isSelected ? " is-selected" : ""}`}
              style={isSelected ? { backgroundColor: colors.primary, borderColor: colors.primary } : undefined}
            >
              {String(n).padStart(padLen, "0")}
            </span>
          );
        })}
      </div>
      {pricePerNumber > 0 && (
        <button type="button" className="editor-grid-preview__cta" style={{ backgroundColor: colors.primary }}>
          Continuar — 3 números · R$ {(3 * pricePerNumber).toFixed(2)}
        </button>
      )}
    </div>
  );
}
