"use client";

const PRESET_COLORS = [
  "#7C3AED", "#8B5CF6", "#A855F7", "#6D28D9",
  "#EC4899", "#F43F5E", "#EF4444", "#F97316",
  "#EAB308", "#22C55E", "#14B8A6", "#06B6D4",
  "#3B82F6", "#6366F1", "#1E1B4B", "#0F172A",
  "#FFFFFF", "#F8FAFC", "#FEF3C7", "#FCE7F3",
];

export default function EditorColorPicker({ label, value, onChange }) {
  return (
    <div className="editor-color-picker">
      <label className="editor-field__label">{label}</label>
      <div className="editor-color-picker__row">
        <div className="editor-color-picker__swatch" style={{ backgroundColor: value }}>
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} />
        </div>
        <input
          className="editor-field__input editor-color-picker__hex"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
        />
      </div>
      <div className="editor-color-picker__presets">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`editor-color-picker__preset${value === color ? " is-active" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Cor ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
