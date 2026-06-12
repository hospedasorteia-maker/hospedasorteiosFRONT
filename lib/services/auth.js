import { updateSettingsSection } from "@/lib/services/settings";

const SESSION_KEY = "TironiDraws_session";

function persistClientSession(user) {
  if (typeof window === "undefined" || !user) return null;

  const session = {
    id: user.id,
    email: user.email,
    name: user.name,
    signedInAt: new Date().toISOString(),
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  updateSettingsSection("profile", {
    nome: user.name,
    email: user.email,
  });

  return session;
}

function clearClientSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

async function parseAuthResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Não foi possível concluir a autenticação.");
  }
  return data.user;
}

export async function fetchSession() {
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch("/api/auth/session", { credentials: "include" });
    const data = await response.json();
    if (!data.user) {
      clearClientSession();
      return null;
    }
    return persistClientSession(data.user);
  } catch {
    return getSession();
  }
}

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function ensureSession() {
  const cached = getSession();
  if (cached) return cached;
  return fetchSession();
}

export async function isAuthenticated() {
  return !!(await ensureSession());
}

export async function registerWithEmail({ email, password, name }) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  const user = await parseAuthResponse(response);
  return persistClientSession(user);
}

export async function signInWithEmail({ email, password }) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const user = await parseAuthResponse(response);
  return persistClientSession(user);
}

export async function signInWithGoogle({ email, name }) {
  const response = await fetch("/api/auth/google", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });

  const user = await parseAuthResponse(response);
  return persistClientSession(user);
}

export async function signOut() {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } finally {
    clearClientSession();
  }
}

