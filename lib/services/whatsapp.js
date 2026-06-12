export function normalizeWhatsAppDigits(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function buildWhatsAppHref(phone, message) {
  const digits = normalizeWhatsAppDigits(phone);
  if (!digits) return "";
  const text = message || "Olá! Tenho uma dúvida sobre o sorteio.";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(phone, message) {
  const href = buildWhatsAppHref(phone, message);
  if (!href) return;
  window.open(href, "_blank", "noopener,noreferrer");
}

export function buildParticipantWhatsAppMessage(participant) {
  const firstName = String(participant?.name || "participante").split(" ")[0];
  return `Olá ${firstName}! Aqui é da TironiDraws sobre sua participação no sorteio "${participant?.raffle || "sorteio"}".`;
}
