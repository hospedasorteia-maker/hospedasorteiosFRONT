import { getGlobalPixConfig } from "@/lib/settings";

const DEFAULT_PIX_KEY = "contato@TironiDraws.com.br";
const DEFAULT_MERCHANT_NAME = "TironiDraws";
const DEFAULT_MERCHANT_CITY = "SAO PAULO";

function tlv(id, value) {
  const v = String(value);
  return `${id}${String(v.length).padStart(2, "0")}${v}`;
}

function crc16(payload) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
    }
    crc &= 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function sanitizePixText(text, maxLen) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .slice(0, maxLen)
    .toUpperCase();
}

function buildTxId(raffleId, numbers) {
  const suffix = String(Date.now()).slice(-8);
  const base = `R${String(raffleId).slice(-4)}${numbers.length}${suffix}`;
  return base.replace(/[^a-zA-Z0-9]/g, "").slice(0, 25);
}

export function generatePixPayload({
  amount,
  pixKey = DEFAULT_PIX_KEY,
  merchantName = DEFAULT_MERCHANT_NAME,
  merchantCity = DEFAULT_MERCHANT_CITY,
  txId,
}) {
  const key = pixKey.trim();
  const name = sanitizePixText(merchantName, 25) || DEFAULT_MERCHANT_NAME;
  const city = sanitizePixText(merchantCity, 15) || DEFAULT_MERCHANT_CITY;
  const value = Number(amount).toFixed(2);
  const reference = sanitizePixText(txId, 25).replace(/\s/g, "") || `RM${Date.now()}`.slice(0, 25);

  const merchantAccount = tlv("00", "BR.GOV.BCB.PIX") + tlv("01", key);
  const additionalData = tlv("05", reference);

  let payload =
    tlv("00", "01") +
    tlv("01", "12") +
    tlv("26", merchantAccount) +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", value) +
    tlv("58", "BR") +
    tlv("59", name) +
    tlv("60", city) +
    tlv("62", additionalData) +
    "6304";

  payload += crc16(payload);
  return { payload, txId: reference, amount: value };
}

export function createPixPayment({ raffle, numbers, pixKey, merchantName }) {
  const amount = numbers.length * (raffle.price || 0);
  const txId = buildTxId(raffle.id, numbers);
  const globalPix = getGlobalPixConfig();

  return generatePixPayload({
    amount,
    pixKey: pixKey || raffle.pixKey || globalPix?.pixKey || DEFAULT_PIX_KEY,
    merchantName: merchantName || raffle.pixMerchantName || globalPix?.merchantName || raffle.title || DEFAULT_MERCHANT_NAME,
    merchantCity: raffle.pixMerchantCity || DEFAULT_MERCHANT_CITY,
    txId,
  });
}
