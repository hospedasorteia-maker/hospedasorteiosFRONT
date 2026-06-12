"use client";

import { useEffect, useRef, useState } from "react";
import EditorColorPicker from "./EditorColorPicker";
import EditorImagePositionSelector from "./EditorImagePositionSelector";
import EditorCardStyleSelector from "./EditorCardStyleSelector";
import JogoDoBichoRoller from "@/components/public/rifa/JogoDoBichoRoller";
import { BICHO_TOTAL_NUMBERS, BICHO_GRUPO_TOTAL, getAnimalGroupLabel, getAnimalByGroupId, getAnimalLabel } from "@/lib/services/jogoDoBicho";
import BichoDrawSourceLink from "@/components/public/rifa/BichoDrawSourceLink";

const NUMBER_PRESETS = [25, 50, 100, 150, 200, 300, 500, 1000];
const PRICE_PRESETS = [0, 1, 2, 5, 10, 15, 20, 50];

function parsePriceInput(raw) {
  if (raw === "" || raw === undefined || raw === null) return 0;
  let cleaned = String(raw).trim().replace(/[^\d,.-]/g, "");
  if (!cleaned) return 0;

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma > lastDot) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > lastComma) {
    cleaned = cleaned.replace(/,/g, "");
  } else {
    cleaned = cleaned.replace(",", ".");
  }

  const value = parseFloat(cleaned);
  if (Number.isNaN(value) || value < 0) return 0;
  return Math.round(value * 100) / 100;
}

function formatPriceForInput(value) {
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=200&fit=crop",
];

const TABS = [
  { id: "info", label: "Info", icon: "settings" },
  { id: "colors", label: "Cores", icon: "palette" },
  { id: "layout", label: "Layout", icon: "layout" },
  { id: "image", label: "Imagem", icon: "image" },
  { id: "cupons", label: "Cupons", icon: "ticket" },
  { id: "resultado", label: "Result.", icon: "trophy" },
];

function TabIcon({ type }) {
  const icons = {
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>,
    palette: <><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></>,
    layout: <><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></>,
    image: <><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></>,
    ticket: <><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></>,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[type]}
    </svg>
  );
}

export default function EditorSidebar({ config, onChange, titleError = false, focusTitleTick = 0 }) {
  const [activeTab, setActiveTab] = useState("info");
  const titleRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 10,
    maxUses: "",
    validUntil: "",
  });
  const [priceDraft, setPriceDraft] = useState("");

  function update(field, value) {
    onChange({ ...config, [field]: value });
  }

  function updateColors(key, value) {
    onChange({ ...config, themeColors: { ...config.themeColors, [key]: value } });
  }

  function updateLayout(key, value) {
    onChange({ ...config, layoutConfig: { ...config.layoutConfig, [key]: value } });
  }

  function readFileAsDataUrl(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    readFileAsDataUrl(file, (url) => {
      update("imageUrl", url);
      setUploading(false);
    });
  }

  function handleCertificateUpload(e, type) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCert(true);
    readFileAsDataUrl(file, (url) => {
      onChange({ ...config, certificateUrl: url, certificateType: type });
      setUploadingCert(false);
    });
  }

  function handleAddCoupon() {
    if (!newCoupon.code.trim() || !newCoupon.discountValue) return;
    const coupon = {
      code: newCoupon.code.toUpperCase().trim(),
      discountType: newCoupon.discountType,
      discountValue: parseFloat(newCoupon.discountValue),
      maxUses: newCoupon.maxUses ? parseInt(newCoupon.maxUses, 10) : undefined,
      usedCount: 0,
      validUntil: newCoupon.validUntil || undefined,
      active: true,
    };
    update("coupons", [...(config.coupons || []), coupon]);
    setNewCoupon({ code: "", discountType: "percentage", discountValue: 10, maxUses: "", validUntil: "" });
  }

  function handleRemoveCoupon(index) {
    const next = (config.coupons || []).filter((_, i) => i !== index);
    update("coupons", next.length ? next : []);
  }

  const primary = config.themeColors?.primary || "#7C3AED";

  useEffect(() => {
    if (!titleError && !focusTitleTick) return;
    setActiveTab("info");
    requestAnimationFrame(() => {
      titleRef.current?.focus();
      titleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [titleError, focusTitleTick]);

  useEffect(() => {
    setPriceDraft(config.price > 0 ? formatPriceForInput(config.price) : "");
  }, [config.price]);

  return (
    <aside className="editor-sidebar">
      <div className="editor-sidebar__head">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
          Editor de Sorteio
        </h2>
        <p>Monte do seu jeito</p>
      </div>

      <div className="editor-sidebar__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "is-active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            <TabIcon type={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="editor-sidebar__content">
        {activeTab === "info" && (
          <div className="editor-sidebar__panel">
            <div className="editor-field">
              <label className="editor-field__label" htmlFor="editor-raffle-title">
                Título do Sorteio {titleError && <span className="editor-field__required">*</span>}
              </label>
              <input
                id="editor-raffle-title"
                ref={titleRef}
                className={`editor-field__input${titleError ? " editor-field__input--error" : ""}`}
                value={config.title || ""}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Ex: Rifa do iPhone 15 Pro"
                aria-invalid={titleError}
                aria-describedby={titleError ? "editor-title-error" : undefined}
              />
              {titleError && (
                <p id="editor-title-error" className="editor-field__error">
                  Informe um título para criar o sorteio.
                </p>
              )}
            </div>
            <div className="editor-field">
              <label className="editor-field__label">Descrição</label>
              <textarea className="editor-field__textarea" value={config.description || ""} onChange={(e) => update("description", e.target.value)} placeholder="Descreva os detalhes do sorteio..." rows={4} />
            </div>
            <div className="editor-field">
              <label className="editor-field__label">Nome do Prêmio</label>
              <input className="editor-field__input" value={config.prizeName || ""} onChange={(e) => update("prizeName", e.target.value)} placeholder="Ex: iPhone 15 Pro Max" />
            </div>
            <hr className="editor-divider" />
            {config.numberMode === "bicho" && (
              <div className="editor-callout editor-callout--violet">
                <strong>Modo ativo</strong>
                <p>Salve o sorteio para aplicar o Jogo do Bicho na página pública.</p>
              </div>
            )}
            <div className="editor-field">
              <label className="editor-switch-row editor-switch-row--block">
                <span>
                  <strong>Modo Jogo do Bicho</strong>
                  <small style={{ display: "block", fontWeight: 400, opacity: 0.75, marginTop: "0.25rem" }}>
                    25 bichos · dezenas de 01 a 00 · grade vertical
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={config.numberMode === "bicho"}
                  onChange={(e) => {
                    onChange({
                      ...config,
                      numberMode: e.target.checked ? "bicho" : "standard",
                      totalNumbers: e.target.checked
                        ? (config.bichoPlayMode === "grupo" ? BICHO_GRUPO_TOTAL : BICHO_TOTAL_NUMBERS)
                        : config.totalNumbers || 100,
                    });
                  }}
                />
              </label>
            </div>
            {config.numberMode === "bicho" && (
              <div className="editor-field">
                <label className="editor-field__label">Tipo de aposta</label>
                <div className="editor-status-grid">
                  {[
                    { value: "dezena", label: "Dezena (100)" },
                    { value: "grupo", label: "Só bicho (25)" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      className={`editor-status-btn${config.bichoPlayMode === value ? " is-selected" : ""}`}
                      onClick={() =>
                        onChange({
                          ...config,
                          bichoPlayMode: value,
                          totalNumbers: value === "grupo" ? BICHO_GRUPO_TOTAL : BICHO_TOTAL_NUMBERS,
                          winnerNumber: undefined,
                          winnerAnimal: "",
                        })
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="editor-field__hint">
                  {config.bichoPlayMode === "grupo"
                    ? "Participantes escolhem apenas o bicho. A roleta sorteia um animal, sem dezena."
                    : "Participantes escolhem bicho e dezena (01 a 00)."}
                </p>
              </div>
            )}
            <div className="editor-field">
              <label className="editor-field__label">
                {config.numberMode === "bicho"
                  ? config.bichoPlayMode === "grupo"
                    ? `Quantidade de bichos: ${BICHO_GRUPO_TOTAL} (fixo)`
                    : `Quantidade de dezenas: ${BICHO_TOTAL_NUMBERS} (fixo)`
                  : `Quantidade de Números: ${config.totalNumbers || 100}`}
              </label>
              {config.numberMode !== "bicho" && (
                <>
                  <input type="range" min={10} max={1000} step={5} value={config.totalNumbers || 100} onChange={(e) => update("totalNumbers", Number(e.target.value))} className="editor-slider" />
                  <div className="editor-presets">
                    {NUMBER_PRESETS.map((n) => (
                      <button key={n} type="button" className={config.totalNumbers === n ? "is-active" : ""} onClick={() => update("totalNumbers", n)}>{n}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="editor-field">
              <label className="editor-field__label">Preço por Número (R$)</label>
              <div className="editor-price-input">
                <span>R$</span>
                <input
                  className="editor-field__input"
                  type="text"
                  inputMode="decimal"
                  value={priceDraft}
                  onChange={(e) => setPriceDraft(e.target.value)}
                  onBlur={() => {
                    const parsed = parsePriceInput(priceDraft);
                    update("price", parsed);
                    setPriceDraft(parsed > 0 ? formatPriceForInput(parsed) : "");
                  }}
                  placeholder="Digite o valor (ex: 12,50)"
                />
              </div>
              <div className="editor-presets">
                {PRICE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={config.price === preset ? "is-active" : ""}
                    onClick={() => {
                      update("price", preset);
                      setPriceDraft(preset > 0 ? formatPriceForInput(preset) : "");
                    }}
                  >
                    {preset === 0 ? "Grátis" : `R$ ${formatPriceForInput(preset)}`}
                  </button>
                ))}
              </div>
              <p className="editor-field__hint">Use os atalhos ou digite qualquer valor com centavos.</p>
            </div>
            <div className="editor-field">
              <label className="editor-field__label">Data do Sorteio</label>
              <input className="editor-field__input" type="date" value={config.drawDate || ""} onChange={(e) => update("drawDate", e.target.value)} />
            </div>
            <hr className="editor-divider" />
            <div className="editor-field">
              <label className="editor-field__label">Chave PIX (recebimento)</label>
              <input className="editor-field__input" value={config.pixKey || ""} onChange={(e) => update("pixKey", e.target.value)} placeholder="E-mail, CPF, CNPJ ou chave aleatória" />
            </div>
            <div className="editor-field">
              <label className="editor-field__label">Nome no PIX</label>
              <input className="editor-field__input" value={config.pixMerchantName || ""} onChange={(e) => update("pixMerchantName", e.target.value)} placeholder="Nome exibido no pagamento" maxLength={25} />
            </div>
          </div>
        )}

        {activeTab === "colors" && (
          <div className="editor-sidebar__panel">
            <EditorColorPicker label="Cor Principal" value={config.themeColors?.primary || "#7C3AED"} onChange={(v) => updateColors("primary", v)} />
            <hr className="editor-divider" />
            <EditorColorPicker label="Cor Secundária" value={config.themeColors?.secondary || "#A855F7"} onChange={(v) => updateColors("secondary", v)} />
            <hr className="editor-divider" />
            <EditorColorPicker label="Cor de Destaque" value={config.themeColors?.accent || "#EAB308"} onChange={(v) => updateColors("accent", v)} />
            <hr className="editor-divider" />
            <EditorColorPicker label="Cor de Fundo" value={config.themeColors?.background || "#FFFFFF"} onChange={(v) => updateColors("background", v)} />
            <hr className="editor-divider" />
            <EditorColorPicker label="Cor do Texto" value={config.themeColors?.text || "#1E1B4B"} onChange={(v) => updateColors("text", v)} />
          </div>
        )}

        {activeTab === "layout" && (
          <div className="editor-sidebar__panel">
            <EditorCardStyleSelector value={config.layoutConfig?.cardStyle || "modern"} onChange={(v) => updateLayout("cardStyle", v)} />
            <hr className="editor-divider" />
            <EditorImagePositionSelector value={config.layoutConfig?.imagePosition || "top"} onChange={(v) => updateLayout("imagePosition", v)} />
            <hr className="editor-divider" />
            <div className="editor-field">
              <label className="editor-field__label">Elementos</label>
              <label className="editor-switch-row">
                <span>Barra de progresso</span>
                <input type="checkbox" checked={config.layoutConfig?.showProgress !== false} onChange={(e) => updateLayout("showProgress", e.target.checked)} />
              </label>
              <label className="editor-switch-row">
                <span>Temporizador</span>
                <input type="checkbox" checked={config.layoutConfig?.showTimer !== false} onChange={(e) => updateLayout("showTimer", e.target.checked)} />
              </label>
            </div>
          </div>
        )}

        {activeTab === "image" && (
          <div className="editor-sidebar__panel">
            <div className="editor-field">
              <label className="editor-field__label">Imagem do Prêmio</label>
              {config.imageUrl ? (
                <div className="editor-upload-preview">
                  <img src={config.imageUrl} alt="Prêmio" />
                  <button type="button" className="editor-upload-remove" onClick={() => update("imageUrl", "")}>Remover</button>
                </div>
              ) : (
                <label className="editor-upload-drop">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <p>Clique para enviar</p>
                  <span>PNG, JPG até 5MB</span>
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </label>
              )}
              {uploading && <p className="editor-upload-status">Enviando imagem...</p>}
              <div className="editor-field" style={{ marginTop: "0.75rem" }}>
                <label className="editor-field__label editor-field__label--muted">Ou cole uma URL</label>
                <input className="editor-field__input" value={config.imageUrl || ""} onChange={(e) => update("imageUrl", e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <hr className="editor-divider" />
            <div className="editor-field">
              <label className="editor-field__label">Imagens de Exemplo</label>
              <div className="editor-sample-grid">
                {SAMPLE_IMAGES.map((url) => (
                  <button key={url} type="button" className={config.imageUrl === url ? "is-active" : ""} onClick={() => update("imageUrl", url)}>
                    <img src={url} alt="" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "cupons" && (
          <div className="editor-sidebar__panel">
            <div className="editor-callout editor-callout--violet">
              <strong>Cupons de Desconto</strong>
              <p>Crie cupons promocionais para incentivar vendas.</p>
            </div>
            <div className="editor-field-row">
              <div className="editor-field">
                <label className="editor-field__label">Código</label>
                <input className="editor-field__input" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })} placeholder="DESCONTO10" />
              </div>
              <div className="editor-field">
                <label className="editor-field__label">Tipo</label>
                <select className="editor-field__input" value={newCoupon.discountType} onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}>
                  <option value="percentage">Porcentagem (%)</option>
                  <option value="fixed">Valor Fixo (R$)</option>
                </select>
              </div>
            </div>
            <div className="editor-field-row">
              <div className="editor-field">
                <label className="editor-field__label">{newCoupon.discountType === "percentage" ? "Desconto (%)" : "Desconto (R$)"}</label>
                <input className="editor-field__input" type="number" min="0" value={newCoupon.discountValue} onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })} />
              </div>
              <div className="editor-field">
                <label className="editor-field__label">Usos Máximos (opcional)</label>
                <input className="editor-field__input" type="number" min="1" value={newCoupon.maxUses} onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })} placeholder="100" />
              </div>
            </div>
            <div className="editor-field">
              <label className="editor-field__label">Válido Até (opcional)</label>
              <input className="editor-field__input" type="date" value={newCoupon.validUntil} onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })} />
            </div>
            <button type="button" className="btn btn--violet btn--sm editor-add-coupon" style={{ backgroundColor: primary }} onClick={handleAddCoupon}>
              + Adicionar Cupom
            </button>
            {(config.coupons || []).length > 0 && (
              <div className="editor-coupon-list">
                <label className="editor-field__label">Cupons Ativos ({config.coupons.length})</label>
                {config.coupons.map((coupon, index) => (
                  <div key={coupon.code + index} className="editor-coupon-item">
                    <div>
                      <strong>{coupon.code}</strong>
                      <p>
                        {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `R$ ${Number(coupon.discountValue).toFixed(2)}`} de desconto
                        {coupon.maxUses ? ` · ${coupon.usedCount || 0}/${coupon.maxUses} usados` : ""}
                        {coupon.validUntil ? ` · Vence ${new Date(coupon.validUntil).toLocaleDateString("pt-BR")}` : ""}
                      </p>
                    </div>
                    <button type="button" className="editor-coupon-remove" onClick={() => handleRemoveCoupon(index)} aria-label="Remover cupom">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "resultado" && (
          <div className="editor-sidebar__panel">
            <div className="editor-callout editor-callout--amber">
              <strong>Finalizar sorteio</strong>
              <p>Defina o vencedor e mude o status para <strong>Concluído</strong>. Os compradores serão notificados automaticamente por e-mail.</p>
            </div>
            <div className="editor-field">
              <label className="editor-field__label">
                {config.numberMode === "bicho" && config.bichoPlayMode === "grupo"
                  ? "Bicho vencedor (grupo 1–25)"
                  : "Número Vencedor"}
              </label>
              <input
                className="editor-field__input"
                type="number"
                min={config.numberMode === "bicho" ? (config.bichoPlayMode === "grupo" ? 1 : 0) : 1}
                max={config.numberMode === "bicho" ? (config.bichoPlayMode === "grupo" ? 25 : 99) : config.totalNumbers || 100}
                value={config.winnerNumber ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (!raw) {
                    onChange({ ...config, winnerNumber: undefined, winnerAnimal: "" });
                    return;
                  }
                  const num = parseInt(raw, 10);
                  const winnerAnimal =
                    config.numberMode === "bicho" && config.bichoPlayMode === "grupo"
                      ? getAnimalGroupLabel(getAnimalByGroupId(num))
                      : config.numberMode === "bicho"
                        ? getAnimalLabel(num)
                        : config.winnerAnimal;
                  onChange({
                    ...config,
                    winnerNumber: num,
                    winnerAnimal,
                  });
                }}
                placeholder={
                  config.numberMode === "bicho"
                    ? config.bichoPlayMode === "grupo"
                      ? "Ex: 16 (Leão)"
                      : "Ex: 42 ou 00"
                    : "Ex: 042"
                }
              />
              {config.numberMode === "bicho" && config.winnerAnimal && (
                <p className="editor-field__hint">Bicho sorteado: {config.winnerAnimal}</p>
              )}
            </div>
            {config.numberMode === "bicho" && (
              <div className="editor-field">
                <BichoDrawSourceLink variant="editor" />
              </div>
            )}
            {config.numberMode === "bicho" && (
              <div className="editor-field">
                <label className="editor-field__label">Roleta do Jogo do Bicho</label>
                <p className="editor-field__hint">
                  {config.bichoPlayMode === "grupo"
                    ? "Modo só bicho: a roleta sorteia um animal (grupo), sem dezena."
                    : "Use apenas para simular. O resultado oficial vem do Lotodobicho (Rio)."}
                </p>
                <JogoDoBichoRoller
                  primaryColor={primary}
                  initialNumber={config.winnerNumber}
                  playMode={config.bichoPlayMode || "dezena"}
                  compact
                  onResult={({ number, animal, label }) => {
                    onChange({
                      ...config,
                      winnerNumber: number,
                      winnerAnimal: label,
                    });
                  }}
                />
              </div>
            )}
            <div className="editor-field">
              <label className="editor-field__label">Nome do Ganhador</label>
              <input className="editor-field__input" value={config.winnerName || ""} onChange={(e) => update("winnerName", e.target.value)} placeholder="Nome do ganhador" />
            </div>
            <div className="editor-field">
              <label className="editor-field__label">Telefone do Ganhador</label>
              <input className="editor-field__input" value={config.winnerPhone || ""} onChange={(e) => update("winnerPhone", e.target.value)} placeholder="(00) 00000-0000" />
            </div>
            <hr className="editor-divider" />
            <div className="editor-field">
              <label className="editor-field__label">Status do Sorteio</label>
              <div className="editor-status-grid">
                {[
                  { value: "draft", label: "Rascunho", className: "is-draft" },
                  { value: "active", label: "Ativo", className: "is-active-status" },
                  { value: "completed", label: "Concluído", className: "is-completed" },
                  { value: "cancelled", label: "Cancelado", className: "is-cancelled" },
                ].map(({ value, label, className }) => (
                  <button key={value} type="button" className={`editor-status-btn ${className}${config.status === value ? " is-selected" : ""}`} onClick={() => update("status", value)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {config.notificationsSent && (
              <div className="editor-callout editor-callout--green">
                <span className="editor-callout__dot" />
                Notificações já enviadas aos compradores
              </div>
            )}
            <hr className="editor-divider" />
            <div className="editor-field">
              <label className="editor-field__label">Certificado do Resultado</label>
              <p className="editor-field__hint">Faça upload do comprovante (vídeo ou foto) do sorteio para mostrar aos participantes.</p>
              {config.certificateUrl ? (
                <div className="editor-upload-preview">
                  {config.certificateType === "video" ? (
                    <video src={config.certificateUrl} controls />
                  ) : (
                    <img src={config.certificateUrl} alt="Certificado" />
                  )}
                  <button type="button" className="editor-upload-remove" onClick={() => onChange({ ...config, certificateUrl: "", certificateType: "" })}>Remover</button>
                  <p className="editor-upload-type">{config.certificateType === "video" ? "Vídeo do resultado" : "Foto do resultado"}</p>
                </div>
              ) : (
                <div className="editor-cert-uploads">
                  <label className="editor-upload-drop editor-upload-drop--sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                    <p>Upload de vídeo</p>
                    <span>MP4 até 50MB</span>
                    <input type="file" accept="video/*" hidden onChange={(e) => handleCertificateUpload(e, "video")} />
                  </label>
                  <label className="editor-upload-drop editor-upload-drop--sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                    <p>Upload de foto</p>
                    <span>JPG, PNG até 10MB</span>
                    <input type="file" accept="image/*" hidden onChange={(e) => handleCertificateUpload(e, "image")} />
                  </label>
                </div>
              )}
              {uploadingCert && <p className="editor-upload-status">Enviando certificado...</p>}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
