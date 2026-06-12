const MAX_PERSISTENT_BYTES = 120_000;

export function isDataUrl(value) {
  return typeof value === "string" && value.startsWith("data:");
}

export function isRemoteUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

export function estimateDataUrlBytes(dataUrl) {
  if (!isDataUrl(dataUrl)) return 0;
  const base64 = dataUrl.split(",")[1] || "";
  return Math.ceil((base64.length * 3) / 4);
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

/**
 * Converte upload local em URL persistível.
 * Arquivos pequenos viram data URL; arquivos grandes exigem link externo.
 */
export async function processMediaUpload(file, { maxBytes = MAX_PERSISTENT_BYTES } = {}) {
  if (!file) {
    throw new Error("Nenhum arquivo selecionado.");
  }

  if (file.size > maxBytes) {
    const maxKb = Math.round(maxBytes / 1024);
    throw new Error(
      `Arquivo grande demais (${Math.round(file.size / 1024)} KB). Use um link (URL) ou imagem de até ${maxKb} KB.`
    );
  }

  const dataUrl = await readFileAsDataUrl(file);
  if (estimateDataUrlBytes(dataUrl) > maxBytes) {
    throw new Error("Imagem muito pesada para salvar localmente. Cole um link (URL) da imagem.");
  }

  return { url: dataUrl, persistent: true, source: "upload" };
}

export function sanitizeStoredMediaUrl(value) {
  if (!value) return "";
  if (isRemoteUrl(value)) return value.trim();
  if (isDataUrl(value) && estimateDataUrlBytes(value) <= MAX_PERSISTENT_BYTES) return value;
  return "";
}
