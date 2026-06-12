import { getGlobalPixConfig } from "@/lib/services/settings";
import { resolvePixConfig } from "@/lib/services/pixConfig";

export const PUBLIC_CHECKOUT_PAYMENT_METHOD = "pix";

export function isPublicCheckoutPixOnly() {
  return true;
}

export function getCheckoutPixConfig(raffle) {
  const globalPix = getGlobalPixConfig();
  return resolvePixConfig({ raffle, globalPix });
}

export function assertPixCheckoutAvailable(raffle) {
  const { pixKey } = getCheckoutPixConfig(raffle);
  if (!pixKey) {
    throw new Error("PIX não configurado para este sorteio. O organizador precisa cadastrar a chave PIX.");
  }
  return getCheckoutPixConfig(raffle);
}
