import { SignJWT, jwtVerify } from "jose";
import { AUTH_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/constants";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (secret) return new TextEncoder().encode(secret);

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET não configurado.");
  }

  return new TextEncoder().encode("dev-only-auth-secret-change-me");
}

export async function createSessionToken(user) {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token) {
  const { payload } = await jwtVerify(token, getSecretKey());
  if (!payload.sub || !payload.email) {
    throw new Error("Sessão inválida.");
  }

  return {
    id: String(payload.sub),
    email: String(payload.email),
    name: String(payload.name || payload.email),
  };
}

export function buildSessionCookie(token) {
  const secure = process.env.NODE_ENV === "production";
  const parts = [
    `${AUTH_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_MAX_AGE}`,
  ];

  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production";
  const parts = [`${AUTH_COOKIE}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export { AUTH_COOKIE };
