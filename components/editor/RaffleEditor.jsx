"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  getRaffleById,
  createEmptyRaffle,
  normalizeRaffle,
  saveRaffleToStorage,
} from "@/lib/services/raffles";
import EditorSidebar from "./EditorSidebar";
import EditorRafflePreview from "./EditorRafflePreview";
import EditorAlertModal from "./EditorAlertModal";
import BackToDashboard from "@/components/public/rifa/BackToDashboard";

export default function RaffleEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const isNew = id === "new";

  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [titleError, setTitleError] = useState(false);
  const [showTitleAlert, setShowTitleAlert] = useState(false);
  const [focusTitleTick, setFocusTitleTick] = useState(0);

  useEffect(() => {
    if (isNew) {
      setConfig(createEmptyRaffle());
    } else {
      setConfig(normalizeRaffle(getRaffleById(id)));
    }
    setLoading(false);
    setSaved(false);
    setTitleError(false);
  }, [id, isNew]);

  function handleChange(next) {
    setConfig(next);
    setSaved(false);
    if (next.title?.trim()) setTitleError(false);
  }

  function handleSave() {
    if (!config?.title?.trim()) {
      setTitleError(true);
      setShowTitleAlert(true);
      setSidebarOpen(true);
      setFocusTitleTick((t) => t + 1);
      return;
    }
    setSaving(true);
    const toSave = {
      ...config,
      status: config.status === "draft" && !isNew ? config.status : config.status || "active",
    };
    saveRaffleToStorage(toSave);
    setSaving(false);
    setSaved(true);
    if (isNew) {
      router.replace(`/dashboard/editor/${toSave.id}`);
    }
  }

  if (loading || !config) {
    return (
      <div className="editor-loading">
        <header className="editor-v2__toolbar editor-v2__toolbar--standalone">
          <BackToDashboard className="editor-v2__tool-btn" label="Voltar ao painel" />
        </header>
        <div className="rifa-publica__spinner" />
      </div>
    );
  }

  return (
    <div className="editor-v2">
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            className="editor-v2__sidebar-wrap"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <EditorSidebar
              config={config}
              onChange={handleChange}
              titleError={titleError}
              focusTitleTick={focusTitleTick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="editor-v2__main">
        <div className="editor-v2__toolbar">
          <div className="editor-v2__toolbar-left">
            <BackToDashboard className="editor-v2__tool-btn" label="Voltar" />
            <button type="button" className="editor-v2__tool-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
              {sidebarOpen ? "Ocultar Painel" : "Mostrar Painel"}
            </button>
          </div>

          <div className="editor-v2__toolbar-right">
            {!isNew && (
              <Link href={`/rifa/${config.id}`} target="_blank" className="btn btn--outline btn--sm">
                Ver página pública
              </Link>
            )}

            <div className="editor-v2__preview-toggle">
              <button type="button" className={previewMode === "desktop" ? "is-active" : ""} onClick={() => setPreviewMode("desktop")} aria-label="Preview desktop">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </button>
              <button type="button" className={previewMode === "mobile" ? "is-active" : ""} onClick={() => setPreviewMode("mobile")} aria-label="Preview mobile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="20" x="5" y="2" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
              </button>
            </div>

            <button type="button" className="btn btn--violet btn--sm editor-v2__save" disabled={saving} onClick={handleSave}>
              {saving ? (
                <span className="editor-v2__save-loading" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              )}
              {saving ? "Salvando..." : saved ? "Salvo!" : isNew ? "Criar Sorteio" : "Salvar"}
            </button>
          </div>
        </div>

        <div className="editor-v2__canvas">
          <div
            className="editor-v2__preview-frame"
            style={{
              width: previewMode === "mobile" ? "380px" : "100%",
              maxWidth: previewMode === "mobile" ? "380px" : "600px",
            }}
          >
            <p className="editor-v2__preview-label">
              Preview — {previewMode === "mobile" ? "Mobile" : "Desktop"}
            </p>
            <motion.div
              key={`${config.layoutConfig?.cardStyle}-${config.layoutConfig?.imagePosition}-${previewMode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EditorRafflePreview config={config} />
            </motion.div>
          </div>
        </div>
      </div>

      <EditorAlertModal
        open={showTitleAlert}
        onClose={() => setShowTitleAlert(false)}
        onAction={() => {
          setShowTitleAlert(false);
          setSidebarOpen(true);
          setFocusTitleTick((t) => t + 1);
        }}
        title="Informe o título do sorteio"
        message="O título aparece na página pública e ajuda os participantes a entenderem o prêmio. Preencha o campo na aba Info antes de salvar."
        actionLabel="Preencher título"
        tone="warning"
      />
    </div>
  );
}
