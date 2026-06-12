export const PIX_DEFAULTS = {
  key: "contato@TironiDraws.com.br",
  merchantName: "TironiDraws",
  merchantCity: "SAO PAULO",
};

export function resolvePixConfig({ raffle = {}, globalPix = null, overrides = {} } = {}) {
  const pixKey =
    overrides.pixKey?.trim() ||
    raffle.pixKey?.trim() ||
    globalPix?.pixKey?.trim() ||
    PIX_DEFAULTS.key;

  const merchantName =
    overrides.merchantName?.trim() ||
    raffle.pixMerchantName?.trim() ||
    globalPix?.merchantName?.trim() ||
    raffle.title?.trim() ||
    PIX_DEFAULTS.merchantName;

  const merchantCity =
    overrides.merchantCity?.trim() ||
    raffle.pixMerchantCity?.trim() ||
    PIX_DEFAULTS.merchantCity;

  return { pixKey, merchantName, merchantCity };
}
