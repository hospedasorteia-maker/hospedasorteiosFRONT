import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

async function readUsersFile() {
  try {
    const raw = await readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeUsersFile(users) {
  await mkdir(path.dirname(USERS_FILE), { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function findUserByEmail(email) {
  const users = await readUsersFile();
  const normalized = normalizeEmail(email);
  return users.find((user) => user.email === normalized) || null;
}

export async function createUser({ email, passwordHash, name, provider = "email" }) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    throw new Error("Informe um e-mail válido.");
  }

  const users = await readUsersFile();
  if (users.some((user) => user.email === normalized)) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  const user = {
    id: crypto.randomUUID(),
    email: normalized,
    name: String(name || normalized.split("@")[0]).trim(),
    provider,
    passwordHash: passwordHash || null,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsersFile(users);
  return user;
}

export async function findOrCreateGoogleUser({ email, name }) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    throw new Error("Informe um e-mail válido.");
  }

  const users = await readUsersFile();
  const existing = users.find((user) => user.email === normalized);
  if (existing) {
    if (name?.trim() && existing.name !== name.trim()) {
      existing.name = name.trim();
      await writeUsersFile(users);
    }
    return existing;
  }

  const user = {
    id: crypto.randomUUID(),
    email: normalized,
    name: String(name || normalized.split("@")[0]).trim(),
    provider: "google",
    passwordHash: null,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsersFile(users);
  return user;
}

export function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
