export function fmtNumber(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Formato canônico: "R$ 5,50" */
export function fmtCurrency(value) {
  return `R$ ${fmtNumber(value)}`;
}

export function formatDateBR(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR");
}
