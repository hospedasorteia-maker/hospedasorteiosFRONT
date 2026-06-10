"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  getRaffleById,
  createEmptyRaffle,
  saveRaffleToStorage,
  formatDrawDate,
  fmtCurrency,
} from "@/lib/raffles";

function RafflePreview({ config }) {
  const primary = config.themeColors?.primary || "#7C3AED";
  const secondary = config.themeColors?.secondary || "#A855F7";

  return (
    <div className="editor-preview" style={{ borderColor: `${primary}33` }}>
      <div className="editor-preview__cover">
        {config.imageUrl ? (
          <img src={config.imageUrl} alt={config.prizeName || "Prêmio"} />
        ) : (
          <div style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
        )}
        {config.prizeName && (
          <span className="editor-preview__prize-badge">{config.prizeName}</span>
        )}
      </div>
      <div className="editor-preview__body">
        <h3>{config.title || "Nome do Sorteio"}</h3>
        {config.description && <p>{config.description}</p>}
        <div className="editor-preview__meta">
          <span># {config.totalNumbers || 0}</span>
          {config.drawDate && <span>{formatDrawDate(config.drawDate)}</span>}
          {config.price > 0 && <strong style={{ color: primary }}>R$ {fmtCurrency(config.price)}</strong>}
        </div>
        <div className="editor-preview__cta" style={{ backgroundColor: primary }}>
          Participar agora
        </div>
      </div>
    </div>
  );
}

export default function RaffleEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const isNew = id === "new";

  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew) {
      setConfig(createEmptyRaffle());
    } else {
      const found = getRaffleById(id);
      setConfig(found || createEmptyRaffle());
    }
    setLoading(false);
  }, [id, isNew]);

  function update(field, value) {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function updateColor(key, value) {
    setConfig((prev) => ({
      ...prev,
      themeColors: { ...prev.themeColors, [key]: value },
    }));
    setSaved(false);
  }

  function handleSave() {
    if (!config.title.trim()) {
      alert("Informe o título do sorteio.");
      return;
    }
    setSaving(true);
    const toSave = {
      ...config,
      status: config.status === "draft" ? "active" : config.status,
    };
    saveRaffleToStorage(toSave);
    setSaving(false);
    setSaved(true);
    if (isNew) {
      router.replace(`/dashboard/editor/${toSave.id}`);
    }
  }

  if (loading || !config) {
    return <div className="editor-loading">Carregando editor...</div>;
  }

  return (
    <div className="editor">
      <aside className="editor__sidebar">
        <div className="editor__sidebar-head">
          <h2>Editor de Sorteio</h2>
          <p>Monte do seu jeito</p>
        </div>

        <div className="editor__form">
          <div className="editor__field">
            <label htmlFor="title">Título do sorteio</label>
            <input id="title" value={config.title} onChange={(e) => update("title", e.target.value)} placeholder="Ex: iPhone 15 Pro Max 256GB" />
          </div>

          <div className="editor__field">
            <label htmlFor="prizeName">Nome do prêmio</label>
            <input id="prizeName" value={config.prizeName} onChange={(e) => update("prizeName", e.target.value)} placeholder="Ex: iPhone 15 Pro Max" />
          </div>

          <div className="editor__field">
            <label htmlFor="description">Descrição</label>
            <textarea id="description" rows={3} value={config.description} onChange={(e) => update("description", e.target.value)} placeholder="Descreva o sorteio..." />
          </div>

          <div className="editor__field">
            <label htmlFor="imageUrl">URL da imagem</label>
            <input id="imageUrl" value={config.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="https://..." />
          </div>

          <div className="editor__row">
            <div className="editor__field">
              <label htmlFor="totalNumbers">Total de números</label>
              <input id="totalNumbers" type="number" min={1} value={config.totalNumbers} onChange={(e) => update("totalNumbers", Number(e.target.value))} />
            </div>
            <div className="editor__field">
              <label htmlFor="price">Preço (R$)</label>
              <input id="price" type="number" min={0} step={0.01} value={config.price} onChange={(e) => update("price", Number(e.target.value))} />
            </div>
          </div>

          <div className="editor__field">
            <label htmlFor="drawDate">Data do sorteio</label>
            <input id="drawDate" type="date" value={config.drawDate} onChange={(e) => update("drawDate", e.target.value)} />
          </div>

          <div className="editor__field">
            <label htmlFor="status">Status</label>
            <select id="status" value={config.status} onChange={(e) => update("status", e.target.value)}>
              <option value="draft">Rascunho</option>
              <option value="active">Ativo</option>
              <option value="completed">Finalizado</option>
            </select>
          </div>

          <div className="editor__field">
            <label htmlFor="pixKey">Chave PIX (recebimento)</label>
            <input id="pixKey" value={config.pixKey || ""} onChange={(e) => update("pixKey", e.target.value)} placeholder="E-mail, CPF, CNPJ ou chave aleatória" />
          </div>

          <div className="editor__field">
            <label htmlFor="pixMerchantName">Nome no PIX</label>
            <input id="pixMerchantName" value={config.pixMerchantName || ""} onChange={(e) => update("pixMerchantName", e.target.value)} placeholder="Nome exibido no pagamento" maxLength={25} />
          </div>

          <div className="editor__field">
            <label htmlFor="primaryColor">Cor principal</label>
            <div className="editor__color">
              <input id="primaryColor" type="color" value={config.themeColors?.primary || "#7C3AED"} onChange={(e) => updateColor("primary", e.target.value)} />
              <span>{config.themeColors?.primary}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="editor__main">
        <div className="editor__toolbar">
          <Link href="/dashboard" className="editor__back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            Voltar
          </Link>
          <div className="editor__toolbar-actions">
            {!isNew && (
              <Link href={`/rifa/${config.id}`} target="_blank" className="btn btn--outline btn--sm">
                Ver página pública
              </Link>
            )}
            <button type="button" className="btn btn--violet btn--sm" disabled={saving} onClick={handleSave}>
              {saving ? "Salvando..." : saved ? "Salvo!" : isNew ? "Criar Sorteio" : "Salvar"}
            </button>
          </div>
        </div>

        <div className="editor__canvas">
          <p className="editor__canvas-label">Preview</p>
          <RafflePreview config={config} />
        </div>
      </div>
    </div>
  );
}
