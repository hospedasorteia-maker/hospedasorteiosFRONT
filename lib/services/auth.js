import { getSettings, updateSettingsSection } from "@/lib/services/settings";

const SESSION_KEY = "TironiDraws_session";
export const AUTH_COOKIE = "TironiDraws_auth";

function setAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=1; path=/; SameSite=Lax`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function hasAuthCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((part) => part.trim().startsWith(`${AUTH_COOKIE}=1`));
}

function persistSession(session) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setAuthCookie();
  }
  return session;
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

export function ensureSession() {
  const existing = getSession();
  if (existing) return existing;

  if (!hasAuthCookie()) return null;

  const profile = getSettings().profile;
  if (!profile?.email) return null;

  return persistSession({
    provider: "restored",
    name: profile.nome || profile.email.split("@")[0],
    email: profile.email,
    signedInAt: new Date().toISOString(),
  });
}

export function isAuthenticated() {
  return !!ensureSession();
}

export function signInWithEmail({ email, name }) {
  const userEmail = String(email || "").trim();
  if (!userEmail) {
    throw new Error("Informe um e-mail válido.");
  }

  const profile = getSettings().profile;
  const displayName = name?.trim() || profile.nome || userEmail.split("@")[0];

  updateSettingsSection("profile", {
    nome: displayName,
    email: userEmail,
  });

  return persistSession({
    provider: "email",
    name: displayName,
    email: userEmail,
    signedInAt: new Date().toISOString(),
  });
}

export function completeGoogleSignIn({ name, email }) {
  const profile = getSettings().profile;
  const displayName = name?.trim() || profile.nome || "Usuário Google";
  const userEmail = email?.trim() || profile.email;

  updateSettingsSection("profile", {
    nome: displayName,
    email: userEmail,
  });

  return persistSession({
    provider: "google",
    name: displayName,
    email: userEmail,
    signedInAt: new Date().toISOString(),
  });
}

export function signOut() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  clearAuthCookie();
}
