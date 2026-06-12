"use client";

import { formatDrawDate, fmtCurrency } from "@/lib/raffles";
import { isBichoMode, isBichoGrupoMode } from "@/lib/jogoDoBicho";
import EditorNumberGridPreview from "./EditorNumberGridPreview";
import JogoDoBichoGrid from "../JogoDoBichoGrid";

const CARD_STYLES = {
  modern: "editor-preview-card--modern",
  classic: "editor-preview-card--classic",
  minimal: "editor-preview-card--minimal",
  bold: "editor-preview-card--bold",
};

export default function EditorRafflePreview({ config }) {
  const colors = config.themeColors || {};
  const layout = config.layoutConfig || {};
  const cardClass = CARD_STYLES[layout.cardStyle] || CARD_STYLES.modern;
  const imageUrl =
    config.imageUrl ||
    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&h=400&fit=crop";

  function renderImage() {
    return (
      <div className="editor-preview-card__image-wrap">
        <img src={imageUrl} alt={config.prizeName || "Prêmio"} />
        <div
          className="editor-preview-card__image-gradient"
          style={{ background: `linear-gradient(to bottom, transparent 50%, ${colors.background || "#fff"}ee)` }}
        />
        {config.prizeName && (
          <span className="editor-preview-card__prize-badge" style={{ backgroundColor: colors.accent || "#EAB308" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
            {config.prizeName}
          </span>
        )}
      </div>
    );
  }

  function renderMeta() {
    return (
      <div className="editor-preview-card__tags">
        {config.drawDate && (
          <span style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            {formatDrawDate(config.drawDate)}
          </span>
        )}
        <span style={{ backgroundColor: `${colors.secondary}15`, color: colors.secondary }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>
          {isBichoMode(config)
            ? isBichoGrupoMode(config)
              ? "Jogo do Bicho · 25 bichos"
              : "Jogo do Bicho · 100 dezenas"
            : `${config.totalNumbers || 100} números`}
        </span>
        {config.price > 0 && (
          <span style={{ backgroundColor: `${colors.accent}25`, color: colors.text || "#1E1B4B" }}>
            R$ {fmtCurrency(config.price)}
          </span>
        )}
      </div>
    );
  }

  function renderGrid() {
    if (isBichoMode(config)) {
      return (
        <div className="editor-preview-bicho">
          <JogoDoBichoGrid
            readOnly
            pricePerNumber={config.price || 0}
            primaryColor={colors.primary || "#7C3AED"}
            playMode={config.bichoPlayMode || "dezena"}
            soldNumbers={[1, 5, 17]}
            reservedNumbers={[42]}
          />
        </div>
      );
    }
    return (
      <EditorNumberGridPreview
        totalNumbers={config.totalNumbers}
        colors={colors}
        pricePerNumber={config.price}
      />
    );
  }

  function renderInfo() {
    return (
      <div className="editor-preview-card__body">
        <div>
          <h3 style={{ color: colors.text || "#1E1B4B" }}>{config.title || "Nome do Sorteio"}</h3>
          {config.description && (
            <p className="editor-preview-card__desc" style={{ color: colors.text || "#1E1B4B" }}>
              {config.description}
            </p>
          )}
        </div>
        {renderMeta()}
        {layout.showProgress !== false && (
          <div className="editor-preview-card__progress">
            <div className="editor-preview-card__progress-meta" style={{ color: colors.text }}>
              <span>Progresso</span>
              <strong>23%</strong>
            </div>
            <div className="editor-preview-card__progress-bar" style={{ backgroundColor: `${colors.secondary}20` }}>
              <div
                style={{
                  width: "23%",
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                }}
              />
            </div>
          </div>
        )}
        {renderGrid()}
      </div>
    );
  }

  const cardStyle = { backgroundColor: colors.background || "#FFFFFF" };

  if (layout.imagePosition === "background") {
    return (
      <div className={`editor-preview-card ${cardClass} editor-preview-card--bg`} style={cardStyle}>
        <div className="editor-preview-card__bg-image">
          <img src={imageUrl} alt="" />
          <div style={{ background: `linear-gradient(135deg, ${colors.background}ee, ${colors.background}cc)` }} />
        </div>
        <div className="editor-preview-card__bg-content">{renderInfo()}</div>
      </div>
    );
  }

  if (layout.imagePosition === "left" || layout.imagePosition === "right") {
    return (
      <div
        className={`editor-preview-card ${cardClass} editor-preview-card--split${layout.imagePosition === "right" ? " is-reverse" : ""}`}
        style={cardStyle}
      >
        <div className="editor-preview-card__split-image">{renderImage()}</div>
        <div className="editor-preview-card__split-body">{renderInfo()}</div>
      </div>
    );
  }

  if (layout.imagePosition === "center") {
    return (
      <div className={`editor-preview-card ${cardClass}`} style={cardStyle}>
        <div className="editor-preview-card__center-head">
          <h3 style={{ color: colors.text || "#1E1B4B" }}>{config.title || "Nome do Sorteio"}</h3>
        </div>
        <div className="editor-preview-card__center-image">{renderImage()}</div>
        <div className="editor-preview-card__body editor-preview-card__body--compact">
          {config.description && (
            <p className="editor-preview-card__desc" style={{ color: colors.text || "#1E1B4B" }}>
              {config.description}
            </p>
          )}
          {renderGrid()}
        </div>
      </div>
    );
  }

  return (
    <div className={`editor-preview-card ${cardClass}`} style={cardStyle}>
      <div className="editor-preview-card__top-image">{renderImage()}</div>
      {renderInfo()}
    </div>
  );
}
