"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getRaffleById, saveRaffleToStorage, formatDrawDate, fmtCurrency } from "@/lib/raffles";
import { createPixPayment } from "@/lib/pix";
import {
  createPurchase,
  updatePurchase,
  saveBuyerProfile,
  getReservedNumbers,
} from "@/lib/purchases";
import NumberGrid from "./NumberGrid";
import PixPaymentModal from "./PixPaymentModal";
import BuyerInfoModal from "./BuyerInfoModal";
import MinhaCompra from "./MinhaCompra";

function countOccupied(confirmed, reserved) {
  return new Set([...confirmed, ...reserved]).size;
}

export default function RifaPublica() {
  const params = useParams();
  const id = params?.id;
  const [raffle, setRaffle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [soldNumbers, setSoldNumbers] = useState([]);
  const [reservedNumbers, setReservedNumbers] = useState([]);
  const [selectionReset, setSelectionReset] = useState(0);
  const [buyerOpen, setBuyerOpen] = useState(false);
  const [pixOpen, setPixOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [activePurchase, setActivePurchase] = useState(null);
  const [pixPayload, setPixPayload] = useState("");
  const [purchaseRefresh, setPurchaseRefresh] = useState(0);

  function syncRaffleState(found) {
    setRaffle(found);
    if (!found) return;

    const confirmed = found.soldNumbers || Array.from({ length: found.soldCount || 0 }, (_, i) => i + 1);
    const reserved = getReservedNumbers(found.id);
    setSoldNumbers(confirmed);
    setReservedNumbers(reserved);
  }

  useEffect(() => {
    syncRaffleState(getRaffleById(id));
    setLoading(false);
  }, [id]);

  function handlePurchase({ numbers, amount }) {
    if (!raffle || numbers.length === 0) return;
    setPendingSelection({ numbers, amount });
    setBuyerOpen(true);
  }

  function handleBuyerSubmit(buyer) {
    if (!raffle || !pendingSelection) return;

    saveBuyerProfile(buyer);

    const pix = createPixPayment({ raffle, numbers: pendingSelection.numbers });
    const purchase = createPurchase({
      raffleId: raffle.id,
      raffleTitle: raffle.title,
      rafflePrize: raffle.prizeName,
      raffleImage: raffle.imageUrl,
      drawDate: raffle.drawDate,
      numbers: pendingSelection.numbers,
      amount: pendingSelection.amount,
      buyerName: buyer.name,
      buyerPhone: buyer.phone,
      buyerCpf: buyer.cpf,
      txId: pix.txId,
      pixPayload: pix.payload,
      paymentMethod: "pix",
      status: "pending",
    });

    setActivePurchase(purchase);
    setPixPayload(pix.payload);
    setBuyerOpen(false);
    setPixOpen(true);
    setReservedNumbers((prev) => [...new Set([...prev, ...pendingSelection.numbers])]);
    setPurchaseRefresh((k) => k + 1);
  }

  function closeBuyerModal() {
    setBuyerOpen(false);
    setPendingSelection(null);
  }

  function closePixModal() {
    setPixOpen(false);
    setPendingSelection(null);
    setActivePurchase(null);
    setPixPayload("");
    setPurchaseRefresh((k) => k + 1);
  }

  function handlePixConfirm() {
    if (!raffle || !activePurchase) return;

    const confirmedNumbers = [...new Set([...soldNumbers, ...activePurchase.numbers])].sort((a, b) => a - b);
    const updated = {
      ...raffle,
      soldCount: confirmedNumbers.length,
      soldNumbers: confirmedNumbers,
    };

    updatePurchase(activePurchase.id, { status: "confirmed", confirmedAt: new Date().toISOString() });
    saveRaffleToStorage(updated);

    setRaffle(updated);
    setSoldNumbers(confirmedNumbers);
    setReservedNumbers(getReservedNumbers(raffle.id));
    setSelectionReset((k) => k + 1);
    setPurchaseRefresh((k) => k + 1);
    closePixModal();
  }

  function handleContinuePix(purchase) {
    setActivePurchase(purchase);
    setPixPayload(purchase.pixPayload || "");
    setPixOpen(true);
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="rifa-publica rifa-publica--loading">
        <div className="rifa-publica__spinner"></div>
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="rifa-publica rifa-publica--empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <h1>Sorteio não encontrado</h1>
        <p>Este link pode ter expirado ou não existe.</p>
        <Link href="/">Voltar ao site</Link>
      </div>
    );
  }

  const primary = raffle.themeColors?.primary || "#7C3AED";
  const secondary = raffle.themeColors?.secondary || "#A855F7";
  const total = raffle.totalNumbers || 100;
  const soldCount = countOccupied(soldNumbers, reservedNumbers);
  const remaining = Math.max(0, total - soldCount);
  const progressPct = Math.min(100, Math.round((soldCount / total) * 100));

  return (
    <div className="rifa-publica">
      <header className="rifa-publica__header">
        <div className="rifa-publica__brand">
          <span className="rifa-publica__brand-icon" style={{ backgroundColor: primary }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /></svg>
          </span>
          <span style={{ color: primary }}>RifaMaster</span>
        </div>
        <div className="rifa-publica__header-actions">
          <Link href="/minhas-compras" className="rifa-publica__minhas-compras">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>Minhas compras</span>
          </Link>
          <button type="button" className="rifa-publica__share" onClick={handleShare}>
            {copied ? "Copiado!" : "Compartilhar"}
          </button>
        </div>
      </header>

      <div className="rifa-publica__hero">
        {raffle.imageUrl ? (
          <img src={raffle.imageUrl} alt={raffle.prizeName} />
        ) : (
          <div className="rifa-publica__hero-fallback" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
          </div>
        )}
        <div className="rifa-publica__hero-overlay"></div>
        {raffle.status === "active" && (
          <span className="rifa-publica__badge-ativo">Ativo</span>
        )}
        <div className="rifa-publica__hero-text">
          <p>Sorteio</p>
          <h1>{raffle.title}</h1>
          {raffle.prizeName && (
            <span className="rifa-publica__prize">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
              {raffle.prizeName}
            </span>
          )}
        </div>
      </div>

      <div className="rifa-publica__body">
        <div className="rifa-publica__card">
          <div className="rifa-publica__price-row">
            <div>
              <p className="rifa-publica__label">Valor por número</p>
              <p className="rifa-publica__price" style={{ color: primary }}>
                {raffle.price > 0 ? `R$ ${fmtCurrency(raffle.price)}` : "Gratuita"}
              </p>
            </div>
            {raffle.drawDate && (
              <div className="rifa-publica__date">
                <p className="rifa-publica__label">Data do sorteio</p>
                <p>{formatDrawDate(raffle.drawDate)}</p>
              </div>
            )}
          </div>

          <div className="rifa-publica__progress">
            <div className="rifa-publica__progress-meta">
              <span>{soldCount} vendidos</span>
              <strong style={{ color: primary }}>{progressPct}% preenchido</strong>
              <span>{remaining} restam</span>
            </div>
            <div className="rifa-publica__progress-bar">
              <div style={{ width: `${progressPct}%`, backgroundColor: primary }}></div>
            </div>
          </div>
        </div>

        <MinhaCompra
          raffleId={raffle.id}
          raffleTitle={raffle.title}
          totalNumbers={total}
          primaryColor={primary}
          onContinuePix={handleContinuePix}
          refreshKey={purchaseRefresh}
        />

        {raffle.description && (
          <div className="rifa-publica__card rifa-publica__desc">
            <button type="button" onClick={() => setShowDesc(!showDesc)}>
              Sobre este sorteio
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points={showDesc ? "6 15 12 9 18 15" : "6 9 12 15 18 9"} /></svg>
            </button>
            {showDesc && <p>{raffle.description}</p>}
          </div>
        )}

        <div className="rifa-publica__card">
          <div className="rifa-publica__grid-head">
            <p>Escolha seus números</p>
            <span>Toque para selecionar. Quanto mais números, maiores as chances.</span>
          </div>
          <NumberGrid
            totalNumbers={total}
            pricePerNumber={raffle.price}
            primaryColor={primary}
            soldNumbers={soldNumbers}
            reservedNumbers={reservedNumbers}
            selectionReset={selectionReset}
            onPurchase={handlePurchase}
          />
        </div>

        <BuyerInfoModal
          open={buyerOpen}
          onClose={closeBuyerModal}
          onSubmit={handleBuyerSubmit}
          primaryColor={primary}
          numbersCount={pendingSelection?.numbers?.length ?? 0}
          amount={pendingSelection?.amount ?? 0}
        />

        <PixPaymentModal
          open={pixOpen}
          onClose={closePixModal}
          onConfirm={handlePixConfirm}
          pixPayload={pixPayload}
          amount={activePurchase?.amount ?? pendingSelection?.amount ?? 0}
          numbers={activePurchase?.numbers ?? pendingSelection?.numbers ?? []}
          raffleTitle={raffle.title}
          primaryColor={primary}
        />

        <div className="rifa-publica__trust">
          {["Ambiente seguro", "Pagamento seguro", "Transparência"].map((label) => (
            <div key={label} className="rifa-publica__trust-item">
              <p>{label}</p>
            </div>
          ))}
        </div>

        <p className="rifa-publica__powered">
          Powered by <strong style={{ color: primary }}>RifaMaster</strong>
        </p>
      </div>
    </div>
  );
}
