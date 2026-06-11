export const BICHO_ANIMALS = [
  { id: 1, name: "Avestruz", emoji: "🦩" },
  { id: 2, name: "Águia", emoji: "🦅" },
  { id: 3, name: "Burro", emoji: "🫏" },
  { id: 4, name: "Borboleta", emoji: "🦋" },
  { id: 5, name: "Cachorro", emoji: "🐕" },
  { id: 6, name: "Cabra", emoji: "🐐" },
  { id: 7, name: "Carneiro", emoji: "🐑" },
  { id: 8, name: "Camelo", emoji: "🐫" },
  { id: 9, name: "Cobra", emoji: "🐍" },
  { id: 10, name: "Coelho", emoji: "🐰" },
  { id: 11, name: "Cavalo", emoji: "🐴" },
  { id: 12, name: "Elefante", emoji: "🐘" },
  { id: 13, name: "Galo", emoji: "🐓" },
  { id: 14, name: "Gato", emoji: "🐈" },
  { id: 15, name: "Jacaré", emoji: "🐊" },
  { id: 16, name: "Leão", emoji: "🦁" },
  { id: 17, name: "Macaco", emoji: "🐒" },
  { id: 18, name: "Porco", emoji: "🐷" },
  { id: 19, name: "Pavão", emoji: "🦚" },
  { id: 20, name: "Peru", emoji: "🦃" },
  { id: 21, name: "Touro", emoji: "🐂" },
  { id: 22, name: "Tigre", emoji: "🐯" },
  { id: 23, name: "Urso", emoji: "🐻" },
  { id: 24, name: "Veado", emoji: "🦌" },
  { id: 25, name: "Vaca", emoji: "🐄" },
];

export const BICHO_TOTAL_NUMBERS = 100;

export function isBichoMode(raffle) {
  return raffle?.numberMode === "bicho";
}

export function formatBichoNumber(num) {
  if (num === 0 || num === "0" || num === "00") return "00";
  const n = typeof num === "number" ? num : parseInt(String(num), 10);
  if (Number.isNaN(n)) return "—";
  return String(n).padStart(2, "0");
}

export function getGroupIdForNumber(num) {
  if (num === 0 || num === "0" || num === "00") return 25;
  const n = typeof num === "number" ? num : parseInt(String(num), 10);
  if (Number.isNaN(n)) return null;
  if (n === 0) return 25;
  return Math.ceil(n / 4);
}

export function getAnimalByGroupId(groupId) {
  return BICHO_ANIMALS.find((a) => a.id === groupId) || null;
}

export function getAnimalByNumber(num) {
  const groupId = getGroupIdForNumber(num);
  return groupId ? getAnimalByGroupId(groupId) : null;
}

export function getNumbersForGroup(groupId) {
  if (groupId === 25) return [97, 98, 99, 0];
  const start = (groupId - 1) * 4 + 1;
  return [start, start + 1, start + 2, start + 3];
}

export function getAnimalLabel(num) {
  const animal = getAnimalByNumber(num);
  if (!animal) return formatBichoNumber(num);
  return `${formatBichoNumber(num)} · ${animal.emoji} ${animal.name}`;
}

export function pickRandomBichoResult() {
  const number = Math.floor(Math.random() * 100);
  const animal = getAnimalByNumber(number);
  return { number, animal, label: getAnimalLabel(number) };
}
