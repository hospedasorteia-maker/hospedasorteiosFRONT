"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getRaffleById, saveRaffleToStorage, formatDrawDate, fmtCurrency } from "@/lib/services/raffles";
import { createPixPayment } from "@/lib/services/pix";
import { assertPixCheckoutAvailable } from "@/lib/services/checkout";
import {
  createPurchase,
  updatePurchase,
  saveBuyerProfile,
  getReservedNumbers,
  expirePendingPurchases,
  isPurchaseExpired,
} from "@/lib/services/purchases";
import { loadParticipants } from "@/lib/services/participants";
import { getSupportSettings } from "@/lib/services/settings";
import { buildWhatsAppHref } from "@/lib/services/support";
import NumberGrid from "./NumberGrid";
import JogoDoBichoGrid from "./JogoDoBichoGrid";
import { isBichoMode, isBichoGrupoMode, getAnimalLabel, getAnimalGroupLabel, getAnimalByGroupId, BICHO_DRAW_URL, BICHO_TOTAL_NUMBERS, BICHO_GRUPO_TOTAL } from "@/lib/services/jogoDoBicho";
import BichoDrawSourceLink from "./BichoDrawSourceLink";
import PixPaymentModal from "./PixPaymentModal";
import BuyerInfoModal from "./BuyerInfoModal";
import MinhaCompra from "./MinhaCompra";
import BackToDashboard from "./BackToDashboard";

function normalizeNumbers(list = []) {
  return list.map((n) => Number(n)).filter((n) => !Number.isNaN(n));
}

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
  const [checkoutError, setCheckoutError] = useState("");
  const [supportContacts, setSupportContacts] = useState({
    whatsapp: "",
    email: "",
    whatsappMessage: "",
  });

  function syncRaffleState(found) {
    setRaffle(found);
    if (!found) return;

    expirePendingPurchases({ raffleId: found.id });
    loadParticipants();

    const confirmed = normalizeNumbers(
      found.soldNumbers?.length
        ? found.soldNumbers
        : found.soldCount > 0
          ? Array.from({ length: found.soldCount }, (_, i) => i + 1)
          : [],
    );
    const reserved = normalizeNumbers(getReservedNumbers(found.id));
    setSoldNumbers(confirmed);
    setReservedNumbers(reserved);
  }

  function refreshAfterExpiry(message) {
    if (!raffle) return;
    loadParticipants();
    setReservedNumbers(normalizeNumbers(getReservedNumbers(raffle.id)));
    setSelectionReset((k) => k + 1);
    setPurchaseRefresh((k) => k + 1);
    if (message) setCheckoutError(message);
  }

  function handlePixExpire() {
    if (!raffle) return;

    expirePendingPurchases({ raffleId: raffle.id });
    refreshAfterExpiry("Tempo de reserva expirado. Escolha os números novamente.");
    setPixOpen(false);
    setPendingSelection(null);
    setActivePurchase(null);
    setPixPayload("");
  }

  useEffect(() => {
    syncRaffleState(getRaffleById(id));
    setLoading(false);
    setSupportContacts(getSupportSettings());
  }, [id]);

  useEffect(() => {
    if (!raffle?.id) return;

    const interval = setInterval(() => {
      const { expiredCount } = expirePendingPurchases({ raffleId: raffle.id });
      if (expiredCount > 0) {
        refreshAfterExpiry(
          pixOpen ? "Tempo de reserva expirado. Escolha os números novamente." : "",
        );
        if (pixOpen) {
          setPixOpen(false);
          setPendingSelection(null);
          setActivePurchase(null);
          setPixPayload("");
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [raffle?.id, pixOpen]);

  function handlePurchase({ numbers, amount }) {
    if (!raffle || numbers.length === 0) return;
    try {
      assertPixCheckoutAvailable(raffle);
      setCheckoutError("");
    } catch (error) {
      setCheckoutError(error.message || "Pagamento via PIX indisponível no momento.");
      return;
    }
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
    loadParticipants();
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
    loadParticipants();

    setRaffle(updated);
    setSoldNumbers(confirmedNumbers);
    setReservedNumbers(getReservedNumbers(raffle.id));
    setSelectionReset((k) => k + 1);
    setPurchaseRefresh((k) => k + 1);
    closePixModal();
  }

  function handleContinuePix(purchase) {
    if (isPurchaseExpired(purchase)) {
      expirePendingPurchases({ raffleId: raffle.id });
      refreshAfterExpiry("Esta reserva expirou. Escolha os números novamente.");
      return;
    }
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
        <header className="rifa-publica__header rifa-publica__header--minimal">
          <BackToDashboard className="rifa-publica__back" />
        </header>
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
        <div className="rifa-publica__empty-actions">
          <BackToDashboard className="btn btn--violet btn--sm back-to-dashboard--btn" label="Voltar ao painel" showIcon={false} />
          <Link href="/">Voltar ao site</Link>
        </div>
      </div>
    );
  }

  const primary = raffle.themeColors?.primary || "#7C3AED";
  const secondary = raffle.themeColors?.secondary || "#A855F7";
  const total = isBichoGrupoMode(raffle)
    ? BICHO_GRUPO_TOTAL
    : isBichoMode(raffle)
      ? BICHO_TOTAL_NUMBERS
      : (raffle.totalNumbers || 100);
  const soldCount = countOccupied(soldNumbers, reservedNumbers);
  const remaining = Math.max(0, total - soldCount);
  const progressPct = Math.min(100, Math.round((soldCount / total) * 100));

  return (
    <div className="rifa-publica">
      <header className="rifa-publica__header">
        <div className="rifa-publica__header-left">
          <BackToDashboard className="rifa-publica__back" />
          <Link href="/dashboard" className="rifa-publica__brand">
            <span className="rifa-publica__brand-icon" style={{ backgroundColor: primary }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /></svg>
            </span>
            <span style={{ color: primary }}>TironiDraws</span>
          </Link>
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
                {raffle.price > 0 ? fmtCurrency(raffle.price) : "Gratuita"}
              </p>
              <span className="rifa-publica__pix-badge" style={{ color: primary, borderColor: `${primary}40`, backgroundColor: `${primary}12` }}>
                Pagamento exclusivo via PIX
              </span>
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

        {isBichoMode(raffle) && (
          <div className="rifa-publica__card">
            <BichoDrawSourceLink primaryColor={primary} />
          </div>
        )}

        <div className="rifa-publica__card">
          {checkoutError && (
            <p className="rifa-publica__checkout-error" role="alert">{checkoutError}</p>
          )}
          <div className="rifa-publica__grid-head">
            <p>{isBichoMode(raffle) ? (isBichoGrupoMode(raffle) ? "Escolha seu bicho" : "Escolha seu bicho e dezena") : "Escolha seus números"}</p>
            <span>
              {isBichoGrupoMode(raffle)
                ? "Toque no bicho desejado e continue a compra."
                : isBichoMode(raffle)
                  ? "Toque no bicho, escolha a dezena e continue a compra."
                  : "Toque para selecionar. Quanto mais números, maiores as chances."}
            </span>
          </div>
          {isBichoMode(raffle) ? (
            <JogoDoBichoGrid
              key={`${id}-${selectionReset}`}
              pricePerNumber={raffle.price}
              primaryColor={primary}
              soldNumbers={soldNumbers}
              reservedNumbers={reservedNumbers}
              playMode={raffle.bichoPlayMode || "dezena"}
              onPurchase={handlePurchase}
            />
          ) : (
            <NumberGrid
              key={`${id}-${selectionReset}`}
              totalNumbers={total}
              pricePerNumber={raffle.price}
              primaryColor={primary}
              soldNumbers={soldNumbers}
              reservedNumbers={reservedNumbers}
              onPurchase={handlePurchase}
            />
          )}
        </div>

        {isBichoMode(raffle) && raffle.status === "completed" && raffle.winnerNumber !== undefined && (
          <div className="rifa-publica__card rifa-publica__bicho-result">
            <p className="rifa-publica__label">Resultado do sorteio</p>
            <h3 style={{ color: primary }}>
              {raffle.winnerAnimal ||
                (isBichoGrupoMode(raffle)
                  ? getAnimalGroupLabel(getAnimalByGroupId(raffle.winnerNumber))
                  : getAnimalLabel(raffle.winnerNumber))}
            </h3>
            {raffle.winnerName && <p>Ganhador: {raffle.winnerName}</p>}
            <a
              href={BICHO_DRAW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bicho-draw-source__link"
              style={{ marginTop: "0.75rem", borderColor: `${primary}40`, color: primary }}
            >
              Conferir no Lotodobicho
            </a>
          </div>
        )}

        <BuyerInfoModal
          open={buyerOpen}
          onClose={closeBuyerModal}
          onSubmit={handleBuyerSubmit}
          primaryColor={primary}
          numbersCount={pendingSelection?.numbers?.length ?? 0}
          amount={pendingSelection?.amount ?? 0}
          numbers={pendingSelection?.numbers ?? []}
          isBicho={isBichoMode(raffle)}
          bichoPlayMode={raffle.bichoPlayMode || "dezena"}
        />

        <PixPaymentModal
          open={pixOpen}
          onClose={closePixModal}
          onConfirm={handlePixConfirm}
          onExpire={handlePixExpire}
          purchase={activePurchase}
          pixPayload={pixPayload}
          amount={activePurchase?.amount ?? pendingSelection?.amount ?? 0}
          numbers={activePurchase?.numbers ?? pendingSelection?.numbers ?? []}
          raffleTitle={raffle.title}
          primaryColor={primary}
          isBicho={isBichoMode(raffle)}
          bichoPlayMode={raffle.bichoPlayMode || "dezena"}
        />

        <div className="rifa-publica__trust">
          {["Ambiente seguro", "Pagamento via PIX", "Transparência"].map((label) => (
            <div key={label} className="rifa-publica__trust-item">
              <p>{label}</p>
            </div>
          ))}
        </div>

        {supportContacts.whatsapp && (
          <a
            href={buildWhatsAppHref(
              supportContacts.whatsapp,
              `${supportContacts.whatsappMessage || "Olá! Tenho uma dúvida sobre o sorteio"} "${raffle.title}"`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rifa-publica__whatsapp"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
            Dúvidas? Fale conosco no WhatsApp
          </a>
        )}

        <p className="rifa-publica__powered">
          Powered by <strong style={{ color: primary }}>TironiDraws</strong>
        </p>
      </div>
    </div>
  );
}
