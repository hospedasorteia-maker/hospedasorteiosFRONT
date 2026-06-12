"use client";

export default function EditorNumberGridPreview({ totalNumbers, colors, pricePerNumber }) {
  const total = Math.min(totalNumbers || 100, 100);
  const padLen = total >= 100 ? 3 : 2;

  return (
    <div className="editor-grid-preview">
      <div className="editor-grid-preview__legend">
        <span><i className="cell-demo cell-demo--free" /> Disponível</span>
        <span><i className="cell-demo cell-demo--picked" style={{ backgroundColor: colors.primary }} /> Selecionado</span>
        <span><i className="cell-demo cell-demo--sold" /> Indisponível</span>
      </div>
      <div className="editor-grid-preview__cells">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <span key={n} className="editor-grid-preview__cell">
            {String(n).padStart(padLen, "0")}
          </span>
        ))}
      </div>
      {pricePerNumber > 0 && (
        <button type="button" className="editor-grid-preview__cta" style={{ backgroundColor: colors.primary }}>
          Continuar com PIX
        </button>
      )}
    </div>
  );
}
