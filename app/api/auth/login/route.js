import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/server/password";
import { findUserByEmail, toPublicUser } from "@/lib/auth/server/users";
import { buildSessionCookie, createSessionToken } from "@/lib/auth/server/session";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
    }

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
      { error: error.message || "Não foi possível entrar." },
      { status: 500 },
    );
  }
}
