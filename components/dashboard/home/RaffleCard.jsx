"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteRaffleModal from "./DeleteRaffleModal";
import { formatDrawDate } from "@/lib/services/raffles";

const STATUS = {
  active: { label: "Ativo", className: "raffle-card__status--active" },
  completed: { label: "Finalizado", className: "raffle-card__status--done" },
  draft: { label: "Rascunho", className: "raffle-card__status--draft" },
};

export default function RaffleCard({ raffle, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const status = STATUS[raffle.status] || STATUS.draft;

  function handleConfirmDelete() {
    onDelete?.(raffle.id);
    setShowDeleteModal(false);
  }

  return (
    <>
    <article className="raffle-card">
      <div
        className="raffle-card__cover"
        style={
          raffle.imageUrl
            ? undefined
            : { background: `linear-gradient(135deg, ${raffle.themeColors?.primary || "#7C3AED"}, ${raffle.themeColors?.secondary || "#A855F7"})` }
        }
      >
        {raffle.imageUrl && (
          <img src={raffle.imageUrl} alt={raffle.prizeName} className="raffle-card__photo" />
        )}
        <div className="raffle-card__overlay" aria-hidden="true"></div>
        <span className={`raffle-card__status ${status.className}`}>{status.label}</span>
      </div>

      <div className="raffle-card__body">
        <div className="raffle-card__info">
          <h3>{raffle.title}</h3>
          {raffle.prizeName && (
            <p className="raffle-card__prize">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
              {raffle.prizeName}
            </p>
          )}
        </div>

        <div className="raffle-card__stats">
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>
            {raffle.totalNumbers}
          </span>
          {raffle.drawDate && (
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              {formatDrawDate(raffle.drawDate)}
            </span>
          )}
          {raffle.price > 0 && (
            <span className="raffle-card__price">
              R$ {raffle.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        <div className="raffle-card__actions">
          <Link href={`/dashboard/editor/${raffle.id}`} className="btn btn--outline btn--sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
            Editar
          </Link>
          <Link href={`/rifa/${raffle.id}`} target="_blank" className="btn btn--violet btn--sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
            Página pública
          </Link>
          <button type="button" className="btn btn--outline btn--sm raffle-card__delete" onClick={() => setShowDeleteModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
            Excluir
          </button>
        </div>
      </div>
    </article>

    {showDeleteModal && (
      <DeleteRaffleModal
        raffle={raffle}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    )}
    </>
  );
}
