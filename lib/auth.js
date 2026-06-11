import { getSettings, updateSettingsSection } from "@/lib/settings";

const SESSION_KEY = "rifamaster_session";

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function completeGoogleSignIn({ name, email }) {
  const profile = getSettings().profile;
  const displayName = name?.trim() || profile.nome || "Usuário Google";
  const userEmail = email?.trim() || profile.email;

  updateSettingsSection("profile", {
    nome: displayName,
    email: userEmail,
  });

  const session = {
    provider: "google",
    name: displayName,
    email: userEmail,
    signedInAt: new Date().toISOString(),
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function signOut() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
