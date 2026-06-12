import { NextResponse } from "next/server";
import { findOrCreateGoogleUser, toPublicUser } from "@/lib/auth/server/users";
import { buildSessionCookie, createSessionToken } from "@/lib/auth/server/session";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const name = String(body.name || "").trim();

    if (!email) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }

    const user = await findOrCreateGoogleUser({ email, name });
    const publicUser = toPublicUser(user);
    const token = await createSessionToken(publicUser);

    return NextResponse.json(
      { user: publicUser },
      {
        headers: { "Set-Cookie": buildSessionCookie(token) },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Não foi possível entrar com Google." },
      { status: 500 },
    );
  }
}
