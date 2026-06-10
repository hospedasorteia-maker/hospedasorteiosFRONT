"use client";

const STYLES = [
  { value: "modern", label: "Moderno", desc: "Cantos arredondados e sombras", className: "style-modern" },
  { value: "classic", label: "Clássico", desc: "Bordas simples e elegantes", className: "style-classic" },
  { value: "minimal", label: "Minimalista", desc: "Limpo e sem distrações", className: "style-minimal" },
  { value: "bold", label: "Ousado", desc: "Grande e impactante", className: "style-bold" },
];

export default function EditorCardStyleSelector({ value, onChange }) {
  return (
    <div className="editor-card-style">
      <label className="editor-field__label">Estilo do Card</label>
      <div className="editor-card-style__grid">
        {STYLES.map((style) => (
          <button
            key={style.value}
            type="button"
            className={`editor-card-style__btn${value === style.value ? " is-active" : ""}`}
            onClick={() => onChange(style.value)}
          >
            <div className={`editor-card-style__preview ${style.className}`} />
            <p>{style.label}</p>
            <span>{style.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
