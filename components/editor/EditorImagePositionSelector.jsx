"use client";

const POSITIONS = [
  { value: "top", label: "Topo", icon: "top" },
  { value: "left", label: "Esquerda", icon: "left" },
  { value: "right", label: "Direita", icon: "right" },
  { value: "center", label: "Centro", icon: "center" },
  { value: "background", label: "Fundo", icon: "bg" },
];

function PositionIcon({ type }) {
  const paths = {
    top: <><rect x="4" y="4" width="16" height="6" rx="1" /><rect x="4" y="12" width="16" height="8" rx="1" opacity="0.35" /></>,
    left: <><rect x="4" y="4" width="7" height="16" rx="1" /><rect x="13" y="4" width="7" height="16" rx="1" opacity="0.35" /></>,
    right: <><rect x="4" y="4" width="7" height="16" rx="1" opacity="0.35" /><rect x="13" y="4" width="7" height="16" rx="1" /></>,
    center: <><rect x="4" y="4" width="16" height="5" rx="1" opacity="0.35" /><rect x="6" y="10" width="12" height="6" rx="1" /><rect x="4" y="17" width="16" height="3" rx="1" opacity="0.35" /></>,
    bg: <><rect x="4" y="4" width="16" height="16" rx="1" opacity="0.25" /><rect x="7" y="8" width="10" height="8" rx="1" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="editor-pos-icon">
      {paths[type]}
    </svg>
  );
}

export default function EditorImagePositionSelector({ value, onChange }) {
  return (
    <div className="editor-pos">
      <label className="editor-field__label">Posição da Imagem</label>
      <div className="editor-pos__grid">
        {POSITIONS.map((pos) => (
          <button
            key={pos.value}
            type="button"
            className={`editor-pos__btn${value === pos.value ? " is-active" : ""}`}
            onClick={() => onChange(pos.value)}
          >
            <PositionIcon type={pos.icon} />
            <span>{pos.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
